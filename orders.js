"use strict";

const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[character]);
const money = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value) || 0);
const dateTime = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(date);
};
const statusNames = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded"
};
const loginPanel = document.querySelector("[data-login-panel]");
const dashboard = document.querySelector("[data-dashboard]");
const pageStatus = document.querySelector("[data-page-status]");
const dialog = document.querySelector("[data-order-dialog]");
let orders = [];

function showStatus(message, isError = false, target = pageStatus) {
  target.textContent = message;
  target.classList.toggle("error", isError);
}

async function api(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { ...(options.body ? { "Content-Type": "application/json" } : {}), ...options.headers }
  });
  if (response.status === 204) return null;
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Something went wrong. Please try again.");
  return payload;
}

function renderReport(report) {
  const profit = report.estimatedProfit == null ? "Not available" : money(report.estimatedProfit);
  document.querySelector("[data-stats]").innerHTML = [
    ["Booked sales", money(report.bookedSales), "Excludes cancelled and refunded"],
    ["Paid sales", money(report.paidSales), "Payments are not connected"],
    ["Estimated product profit", profit, `${report.knownCostOrders} orders with recorded costs`],
    ["Total orders", report.totalOrders, `${report.activeOrders} active · ${report.cancelledOrders + report.refundedOrders} cancelled/refunded`],
    ["Recorded shipping", money(report.shippingCollected), "On active orders"],
    ["Cost data missing", report.missingCostOrders, "Add unit costs to products"]
  ].map(([label, value, note]) => `<article class="modern-stat"><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span><small>${escapeHtml(note)}</small></article>`).join("");

  const monthlyRows = report.monthly.map((month) => {
    const profitCell = month.profitKnownOrders
      ? `${money(month.profit)}${month.profitKnownOrders < month.orders ? " · partial" : ""}`
      : "Unknown";
    return `<tr><td>${escapeHtml(month.month)}</td><td>${month.orders}</td><td>${money(month.sales)}</td><td>${escapeHtml(profitCell)}</td></tr>`;
  });
  document.querySelector("[data-monthly-rows]").innerHTML = monthlyRows.length
    ? monthlyRows.join("")
    : `<tr><td colspan="4"><div class="modern-empty">No order activity yet.</div></td></tr>`;
}

function renderOrders() {
  const term = document.querySelector("[data-search]").value.trim().toLowerCase();
  const status = document.querySelector("[data-filter]").value;
  const visible = orders.filter((order) => {
    const customer = order.customer || {};
    const haystack = [order.orderNumber, customer.firstName, customer.lastName, customer.email, customer.phone]
      .join(" ").toLowerCase();
    return (status === "all" || order.status === status) && haystack.includes(term);
  });
  document.querySelector("[data-order-rows]").innerHTML = visible.length
    ? visible.map((order) => {
      const customer = order.customer || {};
      const count = order.items.reduce((total, item) => total + Number(item.quantity || 0), 0);
      return `<tr>
        <td><strong>${escapeHtml(order.orderNumber)}</strong><small class="order-subline">${escapeHtml(order.paymentStatus === "paid" ? "Paid" : "Demo · unpaid")}</small></td>
        <td>${escapeHtml(customer.firstName)} ${escapeHtml(customer.lastName)}<small class="order-subline">${escapeHtml(customer.email)}</small></td>
        <td>${escapeHtml(dateTime(order.createdAt))}</td><td>${count}</td><td>${money(order.totals?.total)}</td>
        <td><span class="modern-pill ${escapeHtml(order.status)}">${escapeHtml(statusNames[order.status] || order.status)}</span></td>
        <td><button class="order-view-button" type="button" data-view-order="${escapeHtml(order.id)}">View</button></td>
      </tr>`;
    }).join("")
    : `<tr><td colspan="7"><div class="modern-empty">No orders match this search.</div></td></tr>`;
}

async function loadOrders() {
  const result = await api("/api/admin/orders");
  orders = result.orders;
  renderReport(result.report);
  renderOrders();
}

function orderDetail(order) {
  const customer = order.customer || {};
  const address = [customer.address, customer.address2, [customer.city, customer.state, customer.zip].filter(Boolean).join(", "), customer.country]
    .filter(Boolean).map(escapeHtml).join("<br>");
  const items = order.items.map((item) => `<tr><td><div class="order-line-product">${item.image ? `<img src="${escapeHtml(item.image)}" alt="">` : ""}<span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.brand)} · ${escapeHtml(item.category)}${item.size ? ` · Size ${escapeHtml(item.size)}` : ""}</small></span></div></td><td>${item.quantity}</td><td>${money(item.unitPrice)}</td><td>${money(item.lineTotal)}</td></tr>`).join("");
  const timeline = (order.timeline || []).map((entry) => `<li><span class="order-timeline-dot"></span><div><strong>${escapeHtml(statusNames[entry.status] || entry.status)}</strong><small>${escapeHtml(dateTime(entry.at))}</small>${entry.note ? `<p>${escapeHtml(entry.note)}</p>` : ""}</div></li>`).join("");
  return `<div class="order-detail-grid">
      <section class="order-detail-block"><h3>Customer</h3><p><strong>${escapeHtml(customer.firstName)} ${escapeHtml(customer.lastName)}</strong><br><a href="mailto:${escapeHtml(customer.email)}">${escapeHtml(customer.email)}</a><br><a href="tel:${escapeHtml(customer.phone)}">${escapeHtml(customer.phone)}</a></p></section>
      <section class="order-detail-block"><h3>Shipping address</h3><p>${address || "Not provided"}</p></section>
      <section class="order-detail-block"><h3>Order information</h3><p>Placed ${escapeHtml(dateTime(order.createdAt))}<br>Payment: ${escapeHtml(order.paymentStatus === "paid" ? "Paid" : "Not collected (demo)")}${order.updatesOptIn ? "<br>Marketing opt-in: Yes" : ""}</p>${customer.notes ? `<p><strong>Customer note:</strong><br>${escapeHtml(customer.notes)}</p>` : ""}</section>
      <section class="order-detail-block"><h3>Totals</h3><dl class="order-totals"><dt>Items</dt><dd>${money(order.totals?.subtotal)}</dd><dt>Discounts</dt><dd>${money(order.totals?.discounts)}</dd><dt>Shipping</dt><dd>${money(order.totals?.shipping)}</dd><dt>Tax</dt><dd>${money(order.totals?.tax)}</dd><dt class="order-grand-total">Total</dt><dd class="order-grand-total">${money(order.totals?.total)}</dd><dt>Recorded product cost</dt><dd>${order.totals?.costOfGoods == null ? "Unknown" : money(order.totals.costOfGoods)}</dd><dt>Estimated profit*</dt><dd>${order.totals?.estimatedProfit == null ? "Unknown" : money(order.totals.estimatedProfit)}</dd></dl><small>*Revenue less recorded product costs; excludes other expenses.</small></section>
    </div>
    <section class="order-items-block"><h3>Items purchased</h3><div class="modern-table-wrap"><table class="modern-table"><thead><tr><th>Product</th><th>Qty</th><th>Unit price</th><th>Line total</th></tr></thead><tbody>${items}</tbody></table></div></section>
    <section class="order-update-block"><h3>Fulfilment and status history</h3><form data-status-form data-order-id="${escapeHtml(order.id)}"><label class="modern-field">Update status<select name="status">${Object.entries(statusNames).map(([key, name]) => `<option value="${key}" ${order.status === key ? "selected" : ""}>${name}</option>`).join("")}</select></label><label class="modern-field">Status note <span class="portal-optional">OPTIONAL</span><input name="note" maxlength="500" placeholder="Add a fulfilment update"></label><button class="modern-button" type="submit">Save status update</button></form>
      <ol class="order-timeline">${timeline || "<li>No status history available.</li>"}</ol></section>`;
}

async function openOrder(orderId) {
  const order = orders.find((item) => item.id === orderId);
  if (!order) return;
  document.querySelector("[data-dialog-title]").textContent = order.orderNumber;
  document.querySelector("[data-dialog-content]").innerHTML = orderDetail(order);
  dialog.showModal();
}

function csvCell(value) {
  let text = String(value ?? "");
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

function exportCsv() {
  const columns = ["Order", "Created", "Status", "Payment status", "First name", "Last name", "Email", "Phone", "Address", "Address 2", "City", "State", "ZIP", "Country", "Customer note", "Items", "Subtotal USD", "Shipping USD", "Tax USD", "Total USD", "Recorded cost USD", "Estimated profit USD"];
  const rows = orders.map((order) => {
    const customer = order.customer || {};
    const items = order.items.map((item) => `${item.name} x${item.quantity}${item.size ? ` (${item.size})` : ""}`).join("; ");
    return [order.orderNumber, order.createdAt, order.status, order.paymentStatus, customer.firstName, customer.lastName, customer.email, customer.phone, customer.address, customer.address2, customer.city, customer.state, customer.zip, customer.country, customer.notes, items, order.totals?.subtotal, order.totals?.shipping, order.totals?.tax, order.totals?.total, order.totals?.costOfGoods ?? "Unknown", order.totals?.estimatedProfit ?? "Unknown"];
  });
  const file = new Blob([[columns, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = `aurel-orders-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

async function startDashboard() {
  const session = await api("/api/session");
  if (session.role !== "admin") {
    if (session.role === "reseller") showStatus("Order management is available to the store admin only.", true, document.querySelector("[data-login-status]"));
    return;
  }
  loginPanel.classList.add("modern-hidden");
  dashboard.classList.remove("modern-hidden");
  document.querySelector("[data-logout]").classList.remove("modern-hidden");
  await loadOrders();
}

document.querySelector("[data-login-form]").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.querySelector("[data-login-status]");
  try {
    const result = await api("/api/auth/login", { method: "POST", body: JSON.stringify(Object.fromEntries(new FormData(form))) });
    if (result.user.role !== "admin") {
      await api("/api/auth/logout", { method: "POST" });
      throw new Error("This sign-in is not an admin account.");
    }
    await startDashboard();
  } catch (error) {
    showStatus(error.message, true, status);
  }
});

document.querySelector("[data-order-rows]").addEventListener("click", (event) => {
  const button = event.target.closest("[data-view-order]");
  if (button) openOrder(button.dataset.viewOrder);
});
document.querySelector("[data-dialog-content]").addEventListener("submit", async (event) => {
  if (!event.target.matches("[data-status-form]")) return;
  event.preventDefault();
  const form = event.target;
  const data = Object.fromEntries(new FormData(form));
  try {
    await api(`/api/admin/orders/${form.dataset.orderId}`, { method: "PATCH", body: JSON.stringify(data) });
    await loadOrders();
    await openOrder(form.dataset.orderId);
    showStatus("Order status updated.");
  } catch (error) {
    showStatus(error.message, true);
  }
});
document.querySelector("[data-close-dialog]").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
document.querySelector("[data-search]").addEventListener("input", renderOrders);
document.querySelector("[data-filter]").addEventListener("change", renderOrders);
document.querySelector("[data-refresh]").addEventListener("click", () => loadOrders().catch((error) => showStatus(error.message, true)));
document.querySelector("[data-export]").addEventListener("click", exportCsv);
document.querySelector("[data-logout]").addEventListener("click", async () => {
  try {
    await api("/api/auth/logout", { method: "POST" });
    location.reload();
  } catch (error) {
    showStatus(error.message, true);
  }
});

startDashboard().catch((error) => showStatus(error.message, true, document.querySelector("[data-login-status]")));
