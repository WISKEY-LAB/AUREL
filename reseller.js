"use strict";

const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[character]);
const money = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
const authForm = document.querySelector("[data-auth-form]");
const productForm = document.querySelector("[data-product-form]");
const statusMessage = document.querySelector("[data-reseller-dashboard] [data-status]");
let authMode = "login";

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
  return `<tr><td><div class="modern-product"><img src="${escapeHtml(product.image)}" alt=""><span><strong>${escapeHtml(product.name)}</strong><small>${escapeHtml(product.color || "No colour")}</small></span></div></td><td>${escapeHtml(product.brand)} / ${escapeHtml(product.category)}</td><td>${money(product.price)}</td><td><span class="modern-pill ${product.status === "active" ? "" : "pending"}">${status}</span></td></tr>`;
}

async function loadProducts() {
  const products = await api("/api/reseller/products");
  const rows = document.querySelector("[data-product-rows]");
  rows.innerHTML = products.length ? products.map(productRow).join("") : `<tr><td colspan="4"><div class="modern-empty">You haven't submitted any products yet.</div></td></tr>`;
}

async function fileAsDataUrl(file) {
  if (!file) throw new Error("Choose a product photo before submitting.");
  if (file.size > 4 * 1024 * 1024) throw new Error("Images must be smaller than 4 MB.");
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read the selected image."));
    reader.readAsDataURL(file);
  });
}

async function startDashboard() {
  const session = await api("/api/session");
  if (session.role !== "reseller") return false;
  document.querySelector("[data-auth-panel]").classList.add("modern-hidden");
  document.querySelector("[data-reseller-dashboard]").classList.remove("modern-hidden");
  document.querySelector("[data-logout]").classList.remove("modern-hidden");
  await loadProducts();
  return true;
}

document.querySelectorAll("[data-auth-mode]").forEach((button) => button.addEventListener("click", () => {
  authMode = button.dataset.authMode;
  document.querySelectorAll("[data-auth-mode]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
  document.querySelector("[data-auth-submit]").innerHTML = authMode === "register" ? "Create my seller account <span>→</span>" : "Sign in to your studio <span>→</span>";
  document.querySelector("[data-auth-title]").textContent = authMode === "register" ? "Let's get started." : "Welcome back.";
  document.querySelector("[data-auth-description]").textContent = authMode === "register"
    ? "Create your seller account and start sharing your products."
    : "Sign in to manage your products and check their review status.";
  document.querySelector("[data-auth-kicker]").textContent = authMode === "register" ? "JOIN OUR SELLER COMMUNITY" : "YOUR SELLER STUDIO";
  document.querySelector("[data-password-hint]").textContent = authMode === "register" ? "Choose at least 10 characters for your password." : "Use at least 10 characters.";
  authForm.elements.password.autocomplete = authMode === "register" ? "new-password" : "current-password";
}));

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(authForm));
  try {
    const response = await api(`/api/auth/${authMode === "register" ? "register" : "login"}`, { method: "POST", body: JSON.stringify(data) });
    if (response.user.role !== "reseller") {
      await api("/api/auth/logout", { method: "POST" });
      throw new Error("This portal is for reseller accounts. Use the admin page to sign in as an admin.");
    }
    const registered = authMode === "register";
    await startDashboard();
    if (registered) showStatus("Your reseller account is ready. Welcome to your studio.");
  } catch (error) {
    showStatus(error.message, true, document.querySelector("[data-auth-panel] [data-status]"));
  }
});

productForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(productForm));
  try {
    data.imageData = await fileAsDataUrl(productForm.elements.image.files[0]);
    data.sizes = data.sizes.split(",").map((size) => size.trim()).filter(Boolean);
    await api("/api/products", { method: "POST", body: JSON.stringify(data) });
    productForm.reset();
    productForm.elements.category.value = "Rangoli";
    productForm.elements.brand.value = "AUREL";
    showStatus("Product sent for admin review. It will go live after approval.");
    await loadProducts();
  } catch (error) {
    showStatus(error.message, true);
  }
});

document.querySelector("[data-logout]").addEventListener("click", async () => {
  await api("/api/auth/logout", { method: "POST" });
  location.reload();
});

productForm.elements.image.addEventListener("change", () => {
  const selectedFile = productForm.elements.image.files[0];
  if (selectedFile) document.querySelector("[data-file-label]").textContent = selectedFile.name;
});

startDashboard().catch((error) => showStatus(error.message, true));
