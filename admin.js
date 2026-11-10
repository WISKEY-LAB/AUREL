"use strict";

const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[character]);
const money = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
const form = document.querySelector("[data-product-form]");
const rows = document.querySelector("[data-product-rows]");
const statusMessage = document.querySelector("[data-dashboard] [data-status]");
let catalog = [];
let editingId = null;
let currentFilter = "all";
const imageInput = form.elements.image;
const imagePreview = document.querySelector("[data-image-preview]");
const imageName = document.querySelector("[data-image-name]");

function showStatus(message, isError = false, target = statusMessage) {
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

function productRow(product) {
  const status = product.status === "active" ? "Published" : "Pending review";
  return `<tr><td><div class="modern-product"><img src="${escapeHtml(product.image)}" alt=""><span><strong>${escapeHtml(product.name)}</strong><small>${escapeHtml(product.color || "No colour")} · ${escapeHtml(product.badge || "No badge")}</small></span></div></td>
    <td>${escapeHtml(product.brand)} / ${escapeHtml(product.category)}</td><td>${money(product.price)}</td><td><span class="modern-pill ${product.status === "active" ? "" : "pending"}">${status}</span></td>
    <td><div class="modern-inline-actions">${product.status !== "active" ? `<button type="button" data-action="approve" data-id="${escapeHtml(product.id)}">Approve</button>` : ""}<button type="button" data-action="edit" data-id="${escapeHtml(product.id)}">Edit</button><button type="button" data-action="delete" data-id="${escapeHtml(product.id)}">Delete</button></div></td></tr>`;
}

async function loadProducts() {
  catalog = await api("/api/admin/products");
  const visible = catalog.filter((product) => currentFilter === "all" || product.status === currentFilter);
  rows.innerHTML = visible.length ? visible.map(productRow).join("") : `<tr><td colspan="5"><div class="modern-empty">No products in this view yet.</div></td></tr>`;
  document.querySelector("[data-stats]").innerHTML = [
    ["Products", catalog.length],
    ["Published", catalog.filter((product) => product.status === "active").length],
    ["Needs review", catalog.filter((product) => product.status === "pending").length]
  ].map(([label, count]) => `<div class="modern-stat"><strong>${count}</strong><span>${label}</span></div>`).join("");
}

function resetForm() {
  editingId = null;
  form.reset();
  form.elements.category.value = "Rangoli";
  form.elements.brand.value = "AUREL";
  form.elements.status.value = "active";
  document.querySelector("[data-form-title]").textContent = "Add a product";
  document.querySelector("[data-save-button]").textContent = "Save product";
  document.querySelector("[data-cancel-edit]").classList.add("modern-hidden");
  imagePreview.removeAttribute("src");
  imagePreview.classList.add("modern-hidden");
  if (imageName) imageName.textContent = "Choose a product photo";
}

function fileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve("");
    if (file.size > 4 * 1024 * 1024) return reject(new Error("Images must be smaller than 4 MB."));
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read the selected image."));
    reader.readAsDataURL(file);
  });
}

document.querySelector("[data-login-form]").addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  try {
    const result = await api("/api/auth/login", { method: "POST", body: JSON.stringify(data) });
    if (result.user.role !== "admin") {
      await api("/api/auth/logout", { method: "POST" });
      throw new Error("This sign-in is not an admin account.");
    }
    await startDashboard();
  } catch (error) {
    showStatus(error.message, true, document.querySelector("[data-login-panel] [data-status]"));
  }
});

async function startDashboard() {
  const session = await api("/api/session");
  if (session.role !== "admin") return;
  document.querySelector("[data-login-panel]").classList.add("modern-hidden");
  document.querySelector("[data-dashboard]").classList.remove("modern-hidden");
  document.querySelector("[data-logout]").classList.remove("modern-hidden");
  await loadProducts();
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  const file = form.elements.image.files[0];
  try {
    data.imageData = await fileAsDataUrl(file);
    data.image = editingId ? catalog.find((product) => product.id === editingId)?.image : "";
    data.sizes = data.sizes.split(",").map((size) => size.trim()).filter(Boolean);
    await api(editingId ? `/api/products/${editingId}` : "/api/products", {
      method: editingId ? "PATCH" : "POST", body: JSON.stringify(data)
    });
    showStatus(editingId ? "Product updated." : "Product added to the catalogue.");
    resetForm();
    await loadProducts();
  } catch (error) {
    showStatus(error.message, true);
  }
});

rows.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const product = catalog.find((item) => item.id === button.dataset.id);
  if (!product) return;
  if (button.dataset.action === "edit") {
    editingId = product.id;
    for (const field of ["name", "category", "brand", "price", "costPrice", "comparePrice", "badge", "color", "description", "status"]) {
      form.elements[field].value = product[field] ?? "";
    }
    form.elements.sizes.value = (product.sizes || []).join(", ");
    imagePreview.src = product.image;
    imagePreview.classList.remove("modern-hidden");
    if (imageName) imageName.textContent = "Choose a new photo to replace";
    document.querySelector("[data-form-title]").textContent = `Edit ${product.name}`;
    document.querySelector("[data-save-button]").textContent = "Save changes";
    document.querySelector("[data-cancel-edit]").classList.remove("modern-hidden");
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  if (button.dataset.action === "delete" && !window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
  try {
    if (button.dataset.action === "approve") {
      await api(`/api/products/${product.id}`, { method: "PATCH", body: JSON.stringify({ ...product, status: "active" }) });
      showStatus(`${product.name} is now published.`);
    } else {
      await api(`/api/products/${product.id}`, { method: "DELETE" });
      showStatus(`${product.name} was deleted.`);
    }
    await loadProducts();
  } catch (error) {
    showStatus(error.message, true);
  }
});

document.querySelector("[data-cancel-edit]").addEventListener("click", resetForm);
document.querySelector("[data-jump-to-form]").addEventListener("click", () => {
  document.querySelector("#product-editor").scrollIntoView({ behavior: "smooth", block: "start" });
  form.elements.name.focus({ preventScroll: true });
});
imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) return;
  if (imageName) imageName.textContent = file.name;
  imagePreview.src = URL.createObjectURL(file);
  imagePreview.classList.remove("modern-hidden");
});
document.querySelector("[data-refresh]").addEventListener("click", () => loadProducts().catch((error) => showStatus(error.message, true)));
document.querySelector("[data-status-filter]").addEventListener("click", async (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  currentFilter = button.dataset.filter;
  document.querySelectorAll("[data-filter]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
  try { await loadProducts(); } catch (error) { showStatus(error.message, true); }
});
document.querySelector("[data-logout]").addEventListener("click", async () => {
  await api("/api/auth/logout", { method: "POST" });
  location.reload();
});

startDashboard().catch((error) => showStatus(error.message, true));
