let products = [
  { id: "linen-shirt", name: "The Linen Shirt", category: "Clothing", price: 128, comparePrice: 160, badge: "Bestseller", color: "Soft white", sizes: ["XS", "S", "M", "L"], image: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=900&q=82", image2: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=82", description: "An easy, beautifully relaxed layer in breathable European linen. Cut to wear loose, live in and love for a long time." },
  { id: "everyday-tote", name: "The Everyday Tote", category: "Accessories", price: 175, badge: "Small batch", color: "Warm cognac", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=82", image2: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=82", description: "A generous, dependable carryall with just enough structure. Responsibly made from supple, traceable leather." },
  { id: "sculpted-vase", name: "Sculpted Stoneware Vase", category: "Objects", price: 86, badge: "Hand finished", color: "Chalk", image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=900&q=82", image2: "https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=900&q=82", description: "A quiet sculptural form made by hand in small batches. Lovely with a single stem; just as lovely on its own." },
  { id: "everyday-trouser", name: "The Everyday Trouser", category: "Clothing", price: 148, badge: "New arrival", color: "Deep olive", sizes: ["XS", "S", "M", "L"], image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=82", image2: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=82", description: "A relaxed, considered silhouette in a softly structured fabric. An easy answer to getting dressed, any day of the week." },
  { id: "leather-flats", name: "The Soft Leather Flat", category: "Accessories", price: 195, badge: "Made in Spain", color: "Dark brown", sizes: ["36", "37", "38", "39", "40", "41"], image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=82", image2: "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=900&q=82", description: "An understated everyday flat, shaped in supple leather and made by a small family workshop in Spain." },
  { id: "soft-knit", name: "The Cloud Knit", category: "Clothing", price: 210, badge: "Considered comfort", color: "Oat", sizes: ["XS", "S", "M", "L"], image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=82", image2: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=82", description: "Soft, lightweight knitwear with an easy shape and careful finish. Designed to be layered now and loved for seasons." },
  { id: "classic-sunglasses", name: "The Daylight Sunglasses", category: "Accessories", price: 120, badge: "Everyday essential", color: "Tortoise", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=82", image2: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=900&q=82", description: "Clean lines, balanced proportions, and an acetate frame made from more responsible materials." },
  { id: "linen-dress", name: "The Sunday Dress", category: "Clothing", price: 185, badge: "New arrival", color: "Warm sand", sizes: ["XS", "S", "M", "L"], image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=82", image2: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=82", description: "A softly tailored, easy-to-wear dress that moves with you. Crafted in a considered blend of natural fibres." },
  { id: "everyday-candle", name: "No. 01 — Slow Morning", category: "Objects", price: 48, badge: "AUREL favourite", color: "Warm amber", image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=82", image2: "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=900&q=82", description: "A slow-burning, small-batch candle with notes of fig leaf, cedar and warm amber. Made for a moment to yourself." },
  { id: "cotton-shirt", name: "The Weekend Shirt", category: "Clothing", price: 118, badge: "", color: "Sky stripe", sizes: ["XS", "S", "M", "L"], image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=82", image2: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=900&q=82", description: "An unfussy cotton shirt with a little room to move. The one you borrow, pack, and reach for on repeat." },
  { id: "leather-wallet", name: "The Card Case", category: "Accessories", price: 72, comparePrice: 90, badge: "", color: "Black", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=82", image2: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?auto=format&fit=crop&w=900&q=82", description: "A slim essential for cards you actually use. Carefully cut from responsibly sourced leather." },
  { id: "ceramic-cup", name: "The Slow Cup", category: "Objects", price: 38, badge: "", color: "Soft white", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=82", image2: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=82", description: "A tactile stoneware cup, shaped for slow mornings and everyday rituals. Each one is a little different." }
];

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[character]);
const getProduct = (id) => products.find((product) => product.id === id);
const readCart = () => {
  try {
    const stored = JSON.parse(localStorage.getItem("aurel-cart") || "[]");
    if (!Array.isArray(stored)) throw new TypeError("Saved cart is not a list.");
    return stored.filter((item) => getProduct(item.id) && Number.isInteger(item.quantity) && item.quantity > 0);
  } catch (error) {
    console.error("Could not read the saved cart.", error);
    return [];
  }
};
let cart = readCart();
let drawerOpener = null;
let productGalleryImages = [];
let productGalleryIndex = 0;
let galleryDragStartX = 0;
let galleryDragActive = false;

function announce(message) {
  const region = document.querySelector("[data-toast-region]");
  if (!region) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  region.append(toast);
  window.setTimeout(() => toast.remove(), 3500);
}

function saveCart() {
  try {
    localStorage.setItem("aurel-cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Could not save the cart.", error);
    announce("Your browser could not save the bag. Please check your storage settings.");
  }
  updateCartCounts();
}

function updateCartCounts() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll("[data-cart-count]").forEach((el) => { el.textContent = String(count); });
}

function ensureCartDrawer() {
  if (document.querySelector("[data-cart-drawer]")) return;
  document.body.insertAdjacentHTML("beforeend", `
    <div class="cart-drawer-backdrop" data-cart-backdrop></div>
    <aside class="cart-drawer" data-cart-drawer role="dialog" aria-modal="true" aria-labelledby="cart-drawer-title" aria-hidden="true">
      <header class="cart-drawer-header">
        <div><span class="eyebrow">A GOOD CHOICE</span><h2 id="cart-drawer-title">Your bag <span data-drawer-count>(0)</span></h2></div>
        <button class="drawer-close" type="button" aria-label="Close shopping bag" data-cart-close>×</button>
      </header>
      <div class="cart-drawer-content" data-drawer-content></div>
      <footer class="cart-drawer-footer" data-drawer-footer></footer>
    </aside>`);
  renderCartDrawer();
}

function openCartDrawer(opener = document.activeElement) {
  const drawer = document.querySelector("[data-cart-drawer]");
  const backdrop = document.querySelector("[data-cart-backdrop]");
  if (!drawer || !backdrop) return;
  drawerOpener = opener instanceof HTMLElement ? opener : null;
  renderCartDrawer();
  document.body.classList.add("drawer-open");
  drawer.classList.add("is-open");
  backdrop.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  drawer.querySelector("[data-cart-close]")?.focus();
}

function closeCartDrawer() {
  const drawer = document.querySelector("[data-cart-drawer]");
  const backdrop = document.querySelector("[data-cart-backdrop]");
  if (!drawer || !backdrop) return;
  document.body.classList.remove("drawer-open");
  drawer.classList.remove("is-open");
  backdrop.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  drawerOpener?.focus();
}

function renderCartDrawer() {
  const drawer = document.querySelector("[data-cart-drawer]");
  if (!drawer) return;
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countLabel = drawer.querySelector("[data-drawer-count]");
  const content = drawer.querySelector("[data-drawer-content]");
  const footer = drawer.querySelector("[data-drawer-footer]");
  if (countLabel) countLabel.textContent = `(${count})`;
  if (!content || !footer) return;
  if (!cart.length) {
    content.innerHTML = `<div class="drawer-empty"><span class="drawer-empty-mark">✳</span><h3>A little room for something good.</h3><p>Your bag is taking a breather. Find a piece you’ll reach for again and again.</p><a class="button button-dark" href="shop.html">Explore the collection <span>↗</span></a></div>`;
    footer.innerHTML = "";
    return;
  }
  const totals = cartTotals();
  const remaining = Math.max(0, 150 - totals.subtotal);
  content.innerHTML = `<div class="drawer-shipping"><p>${remaining ? `You’re ${currency.format(remaining)} away from complimentary shipping.` : "Lovely. Your shipping is on us."}</p><div class="progress-track"><span style="width:${Math.min(100, totals.subtotal / 150 * 100)}%"></span></div></div>
    <div class="drawer-items">${cart.map((item) => {
      const product = getProduct(item.id);
      return `<article class="drawer-item"><a href="product.html?id=${encodeURIComponent(product.id)}"><img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}"></a><div class="drawer-item-info"><a class="drawer-item-name" href="product.html?id=${encodeURIComponent(product.id)}">${escapeHTML(product.name)}</a><span>${escapeHTML(product.color)}${item.size ? ` · ${escapeHTML(item.size)}` : ""}</span><strong>${currency.format(product.price)}${product.comparePrice ? ` <del>${currency.format(product.comparePrice)}</del>` : ""}</strong><div class="quantity-control"><button type="button" aria-label="Decrease quantity" data-drawer-quantity="-1" data-id="${escapeHTML(product.id)}" data-size="${escapeHTML(item.size || "")}">−</button><span>${item.quantity}</span><button type="button" aria-label="Increase quantity" data-drawer-quantity="1" data-id="${escapeHTML(product.id)}" data-size="${escapeHTML(item.size || "")}">＋</button></div></div><button class="drawer-remove" type="button" aria-label="Remove ${escapeHTML(product.name)}" data-drawer-remove="${escapeHTML(product.id)}" data-size="${escapeHTML(item.size || "")}">×</button></article>`;
    }).join("")}</div>`;
  footer.innerHTML = `<div class="drawer-subtotal"><span>Subtotal</span><strong>${currency.format(totals.subtotal)}</strong></div>
    ${totals.savings ? `<div class="drawer-savings"><span>You saved</span><span>−${currency.format(totals.savings)}</span></div>` : ""}
    <p>Shipping and taxes calculated at checkout.</p>
    <a class="button button-dark drawer-checkout" href="checkout.html">Continue to checkout <span>↗</span></a>
    <a class="drawer-view-bag" href="cart.html">View bag & edit details</a>`;
}

function productCard(product) {
  const name = escapeHTML(product.name);
  const brand = escapeHTML(product.brand || "AUREL");
  const category = escapeHTML(product.category);
  const color = escapeHTML(product.color);
  const image = escapeHTML(product.image);
  return `<article class="product-card">
    <div class="product-image-wrap">
      ${product.comparePrice ? `<span class="product-badge">20% off</span>` : product.badge ? `<span class="product-badge">${escapeHTML(product.badge)}</span>` : ""}
      <a href="product.html?id=${encodeURIComponent(product.id)}" aria-label="View ${name}"><img src="${image}" alt="${name} — ${color}" loading="lazy"></a>
      <button class="quick-add" type="button" data-add-product="${escapeHTML(product.id)}"><span>Quick add</span><span>＋</span></button>
    </div>
    <div class="product-info"><div class="product-meta"><a class="product-name" href="product.html?id=${encodeURIComponent(product.id)}">${name}</a><span class="product-price">${currency.format(product.price)}${product.comparePrice ? ` <del>${currency.format(product.comparePrice)}</del>` : ""}</span></div><div class="product-category">${brand} · ${category} · ${color}</div></div>
  </article>`;
}

function renderShop() {
  const grid = document.querySelector("[data-shop-products]");
  if (!grid) return;
  const params = new URLSearchParams(location.search);
  let activeCategory = params.get("deal") === "1" ? "Offers" : params.get("category") || "All";
  const search = (params.get("q") || "").trim().toLowerCase();
  const sortControl = document.querySelector("[data-sort]");
  const filterContainer = document.querySelector("[data-category-filters]");
  const categories = [...new Set(["Clothing", "Accessories", "Objects", ...products.map((product) => product.category)])];
  categories.forEach((category) => {
    if ([...filterContainer.querySelectorAll("[data-filter]")].some((button) => button.dataset.filter === category)) return;
    const button = document.createElement("button");
    button.className = "filter-chip";
    button.dataset.filter = category;
    button.textContent = category;
    filterContainer.insertBefore(button, filterContainer.querySelector('[data-filter="Offers"]'));
  });
  let filterButtons = [...filterContainer.querySelectorAll("[data-filter]")];
  if (!filterButtons.some((button) => button.dataset.filter === activeCategory)) activeCategory = "All";
  filterButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === activeCategory);
    button.setAttribute("aria-pressed", String(button.dataset.filter === activeCategory));
  });
  const render = () => {
    let matches = products.filter((product) => {
      const categoryMatches = activeCategory === "All" || (activeCategory === "Offers" ? Boolean(product.comparePrice) : product.category === activeCategory);
      const searchMatches = !search || `${product.name} ${product.brand || ""} ${product.category} ${product.color} ${product.description}`.toLowerCase().includes(search);
      return categoryMatches && searchMatches;
    });
    const sort = sortControl?.value || "featured";
    if (sort === "price-low") matches.sort((a, b) => a.price - b.price);
    if (sort === "price-high") matches.sort((a, b) => b.price - a.price);
    if (sort === "name") matches.sort((a, b) => a.name.localeCompare(b.name));
    grid.innerHTML = matches.length ? matches.map(productCard).join("") : `<div class="empty-results"><strong>Nothing here just yet.</strong>Try another search or explore the full collection.</div>`;
    const count = document.querySelector("[data-result-count]");
    if (count) count.textContent = `${matches.length} ${matches.length === 1 ? "piece" : "pieces"}${search ? ` for “${search}”` : ""}`;
    const allCount = document.querySelector("[data-count-all]");
    if (allCount) allCount.textContent = products.length;
  };
  filterButtons.forEach((button) => button.addEventListener("click", () => {
    activeCategory = button.dataset.filter;
    const next = new URL(location.href);
    next.searchParams.delete("deal");
    if (activeCategory === "All" || activeCategory === "Offers") next.searchParams.delete("category");
    else next.searchParams.set("category", activeCategory);
    if (activeCategory === "Offers") next.searchParams.set("deal", "1");
    history.replaceState(null, "", next);
    filterButtons.forEach((item) => {
      item.classList.toggle("is-active", item.dataset.filter === activeCategory);
      item.setAttribute("aria-pressed", String(item.dataset.filter === activeCategory));
    });
    render();
  }));
  if (sortControl && !sortControl.dataset.bound) {
    sortControl.dataset.bound = "true";
    sortControl.addEventListener("change", render);
  }
  render();
}

function addToCart(productId, size = "") {
  const product = getProduct(productId);
  if (!product) return;
  const variant = size ? ` · ${size}` : "";
  const existing = cart.find((item) => item.id === productId && item.size === size);
  if (existing) existing.quantity += 1;
  else cart.push({ id: productId, size, quantity: 1 });
  saveCart();
  renderCartDrawer();
  openCartDrawer();
}

function cartTotals() {
  const subtotal = Math.round(cart.reduce((sum, item) => sum + getProduct(item.id).price * item.quantity, 0) * 100) / 100;
  const savings = Math.round(cart.reduce((sum, item) => {
    const product = getProduct(item.id);
    return sum + (product.comparePrice ? product.comparePrice - product.price : 0) * item.quantity;
  }, 0) * 100) / 100;
  const shipping = subtotal === 0 || subtotal >= 150 ? 0 : 12;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  return { subtotal, savings, shipping, tax, total: Math.round((subtotal + shipping + tax) * 100) / 100 };
}

function summaryMarkup(totals, button = true) {
  const remaining = Math.max(0, 150 - totals.subtotal);
  return `<h2>Order summary</h2>
    <div class="shipping-progress"><p>${remaining ? `You’re ${currency.format(remaining)} away from complimentary shipping.` : "Lovely. Your shipping is on us."}</p><div class="progress-track"><span style="width:${Math.min(100, totals.subtotal / 150 * 100)}%"></span></div></div>
    <div class="summary-row"><span>Subtotal</span><span>${currency.format(totals.subtotal)}</span></div>
    ${totals.savings ? `<div class="summary-row deal-savings"><span>Your savings</span><span>−${currency.format(totals.savings)}</span></div>` : ""}
    <div class="summary-row"><span>Shipping</span><span>${totals.shipping ? currency.format(totals.shipping) : "Complimentary"}</span></div>
    <div class="summary-row"><span>Estimated tax</span><span>${currency.format(totals.tax)}</span></div>
    <div class="summary-row total"><span>Total</span><span>${currency.format(totals.total)}</span></div>
    <p class="summary-footnote">Taxes are estimated. Shipping and final taxes are confirmed at checkout.</p>
    ${button ? `<a class="button button-dark summary-checkout" href="checkout.html">Continue to checkout <span>↗</span></a>` : ""}`;
}

function renderCart() {
  const items = document.querySelector("[data-cart-items]");
  const summary = document.querySelector("[data-cart-summary]");
  if (!items || !summary) return;
  const headingCount = document.querySelector("[data-cart-heading-count]");
  if (headingCount) headingCount.textContent = `(${cart.reduce((sum, item) => sum + item.quantity, 0)})`;
  if (!cart.length) {
    items.innerHTML = `<div class="empty-cart"><h2>Something’s missing.</h2><p>Your bag is taking a little breather. Find a piece to bring it back to life.</p><a class="button button-dark" href="shop.html">Explore the collection <span>↗</span></a></div>`;
    summary.innerHTML = "";
    summary.hidden = true;
    return;
  }
  summary.hidden = false;
  items.innerHTML = cart.map((item) => {
    const product = getProduct(item.id);
    return `<article class="cart-row"><img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}" loading="lazy"><div class="cart-item-info"><a class="cart-item-name" href="product.html?id=${encodeURIComponent(product.id)}">${escapeHTML(product.name)}</a><span class="cart-item-category">${escapeHTML(product.brand || "AUREL")} · ${escapeHTML(product.category)} · ${escapeHTML(product.color)}${item.size ? ` · ${escapeHTML(item.size)}` : ""}</span><span class="cart-item-price">${currency.format(product.price)}${product.comparePrice ? ` <del>${currency.format(product.comparePrice)}</del>` : ""}</span><div class="cart-item-controls"><div class="quantity-control"><button type="button" aria-label="Decrease quantity" data-quantity="-1" data-id="${escapeHTML(item.id)}" data-size="${escapeHTML(item.size || "")}">−</button><span>${item.quantity}</span><button type="button" aria-label="Increase quantity" data-quantity="1" data-id="${escapeHTML(item.id)}" data-size="${escapeHTML(item.size || "")}">＋</button></div><button class="remove-item" type="button" data-remove="${escapeHTML(item.id)}" data-size="${escapeHTML(item.size || "")}">Remove</button></div></div><span class="cart-line-total">${currency.format(product.price * item.quantity)}</span></article>`;
  }).join("");
  summary.innerHTML = summaryMarkup(cartTotals());
}

function renderProduct() {
  const root = document.querySelector("[data-product-detail]");
  if (!root) return;
  const params = new URLSearchParams(location.search);
  const product = getProduct(params.get("id")) || products[0];
  if (!product) {
    root.innerHTML = `<p class="empty-results">This product is no longer available.</p>`;
    return;
  }
  document.title = `${product.name} — AUREL`;
  const crumb = document.querySelector("[data-product-crumb]");
  if (crumb) crumb.textContent = product.name;
  productGalleryImages = [...new Set([product.image, product.image2].filter(Boolean))];
  productGalleryIndex = 0;
  const sizes = product.sizes || [];
  root.innerHTML = `<div class="product-gallery" data-product-gallery tabindex="0" role="group" aria-roledescription="carousel" aria-label="Product photos for ${escapeHTML(product.name)}">
      <img class="product-gallery-image" src="${escapeHTML(productGalleryImages[0])}" alt="${escapeHTML(product.name)} — view 1" draggable="false">
      ${productGalleryImages.length > 1 ? `<span class="gallery-drag-hint" data-gallery-hint>DRAG TO EXPLORE <span>↔</span></span>` : ""}
    </div>
    <div class="product-detail-info"><span class="eyebrow">${escapeHTML(product.brand || "AUREL")} · ${escapeHTML(product.category)} · ${escapeHTML(product.badge || "AUREL essentials")}</span><h1>${escapeHTML(product.name)}</h1><span class="detail-price">${currency.format(product.price)}${product.comparePrice ? ` <del>${currency.format(product.comparePrice)}</del>` : ""}</span><p class="detail-description">${escapeHTML(product.description)}</p><hr class="detail-divider">
    ${sizes.length ? `<div class="option-title"><span>Choose your size</span><a class="text-link" href="contact.html">Size guide</a></div><div class="size-options" data-size-options>${sizes.map((size, index) => `<button class="size-option ${index === 0 ? "is-selected" : ""}" type="button" data-size="${escapeHTML(size)}" aria-pressed="${index === 0}">${escapeHTML(size)}</button>`).join("")}</div>` : `<div class="option-title"><span>Colour</span><span>${escapeHTML(product.color)}</span></div>`}
    <button class="button button-dark detail-add" type="button" data-detail-add="${escapeHTML(product.id)}">Add to bag — ${currency.format(product.price)} <span>↗</span></button>
    <div class="detail-promises"><span>✳ &nbsp;Complimentary shipping over $150</span><span>↺ &nbsp;Easy, considered returns within 30 days</span><span>♡ &nbsp;Made with care, designed to last</span></div>
    <hr class="detail-divider"><details class="detail-accordion"><summary>Details & materials</summary><p>${escapeHTML(product.description)} Each piece is made in small batches with materials selected for quality and longevity.</p></details><details class="detail-accordion"><summary>Shipping & returns</summary><p>Complimentary US shipping on orders over $150. We offer easy returns within 30 days of delivery; items must be unworn and in original condition.</p></details></div>`;
  bindProductGallery();
  const related = document.querySelector("[data-related-products]");
  if (related) related.innerHTML = products.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 4).map(productCard).join("");
}

function bindProductGallery() {
  const gallery = document.querySelector("[data-product-gallery]");
  if (!gallery || productGalleryImages.length < 2) return;
  const showImage = (direction) => {
    productGalleryIndex = (productGalleryIndex + direction + productGalleryImages.length) % productGalleryImages.length;
    const image = gallery.querySelector(".product-gallery-image");
    if (image) {
      image.classList.add("is-switching");
      image.src = productGalleryImages[productGalleryIndex];
      image.alt = `${getProduct(new URLSearchParams(location.search).get("id"))?.name || "Product"} — view ${productGalleryIndex + 1}`;
      window.setTimeout(() => image.classList.remove("is-switching"), 180);
    }
    gallery.classList.remove("show-drag-hint");
  };
  gallery.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    galleryDragStartX = event.clientX;
    galleryDragActive = true;
    gallery.classList.add("is-dragging");
    gallery.setPointerCapture(event.pointerId);
  });
  gallery.addEventListener("pointerup", (event) => {
    if (!galleryDragActive) return;
    galleryDragActive = false;
    const distance = event.clientX - galleryDragStartX;
    if (Math.abs(distance) > 45) showImage(distance < 0 ? 1 : -1);
    gallery.classList.remove("is-dragging");
  });
  gallery.addEventListener("pointercancel", () => {
    galleryDragActive = false;
    gallery.classList.remove("is-dragging");
  });
  gallery.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showImage(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showImage(-1);
    }
  });
}

function renderCheckout() {
  const summary = document.querySelector("[data-checkout-summary]");
  if (!summary) return;
  if (!cart.length) {
    summary.innerHTML = `<h2>Your bag is empty</h2><p class="summary-footnote">Find something you'll love and come back when you're ready.</p><a class="button button-dark" href="shop.html">Explore the collection <span>↗</span></a>`;
    const form = document.querySelector("[data-checkout-form]");
    if (form) form.hidden = true;
    return;
  }
  summary.innerHTML = `<h2>Your pieces <span>${cart.reduce((sum, item) => sum + item.quantity, 0)}</span></h2>
    ${cart.map((item) => { const product = getProduct(item.id); return `<div class="mini-cart-row"><img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}"><div class="mini-cart-info"><strong>${escapeHTML(product.name)}</strong><small>${escapeHTML(product.brand || "AUREL")} · ${escapeHTML(product.category)}${item.size ? ` · ${escapeHTML(item.size)}` : ""} · Qty ${item.quantity}</small></div><span class="mini-cart-price">${currency.format(product.price * item.quantity)}</span></div>`; }).join("")}
    <div class="summary-row" style="margin-top:20px"><span>Subtotal</span><span>${currency.format(cartTotals().subtotal)}</span></div>
    ${cartTotals().savings ? `<div class="summary-row deal-savings"><span>Your savings</span><span>−${currency.format(cartTotals().savings)}</span></div>` : ""}
    <div class="summary-row"><span>Shipping</span><span>${cartTotals().shipping ? currency.format(cartTotals().shipping) : "Complimentary"}</span></div>
    <div class="summary-row"><span>Estimated tax</span><span>${currency.format(cartTotals().tax)}</span></div>
    <div class="summary-row total"><span>Total</span><span>${currency.format(cartTotals().total)}</span></div><p class="summary-footnote">Taxes are estimated. No payment is collected in this demo checkout.</p>`;
}

function renderFeaturedProducts() {
  const grid = document.querySelector("[data-featured-products]");
  if (grid) grid.innerHTML = products.slice(0, 4).map(productCard).join("");
}

function bindCommonInteractions() {
  document.querySelectorAll("[data-cart-count]").forEach((el) => { el.textContent = String(cart.reduce((sum, item) => sum + item.quantity, 0)); });
  document.querySelectorAll("[data-search-toggle]").forEach((button) => button.addEventListener("click", () => {
    const panel = document.querySelector("[data-search-panel]");
    if (!panel) return;
    panel.classList.toggle("is-open");
    if (panel.classList.contains("is-open")) panel.querySelector("input")?.focus();
  }));
  document.querySelectorAll("[data-search-form]").forEach((form) => form.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = new FormData(form).get("q")?.toString().trim();
    if (query) location.href = `shop.html?q=${encodeURIComponent(query)}`;
  }));
  document.querySelectorAll("[data-menu-toggle]").forEach((button) => button.addEventListener("click", () => {
    const nav = document.querySelector(".main-nav");
    const isOpen = nav?.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(Boolean(isOpen)));
  }));
  document.querySelectorAll(".bag-link").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      openCartDrawer(button);
    });
  });
  document.querySelector("[data-cart-close]")?.addEventListener("click", closeCartDrawer);
  document.querySelector("[data-cart-backdrop]")?.addEventListener("click", closeCartDrawer);
  document.addEventListener("keydown", (event) => {
    const drawer = document.querySelector("[data-cart-drawer].is-open");
    if (!drawer) return;
    if (event.key === "Escape") {
      closeCartDrawer();
      return;
    }
    if (event.key === "Tab") {
      const focusable = [...drawer.querySelectorAll('a[href], button:not([disabled])')];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const add = target.closest("[data-add-product]");
    if (add) addToCart(add.dataset.addProduct);
    const detailAdd = target.closest("[data-detail-add]");
    if (detailAdd) {
      const selected = document.querySelector(".size-option.is-selected");
      const product = getProduct(detailAdd.dataset.detailAdd);
      if (product?.sizes && !selected) {
        announce("Please choose a size before adding this piece.");
        return;
      }
      addToCart(detailAdd.dataset.detailAdd, selected?.dataset.size || "");
    }
    const sizeButton = target.closest(".size-option");
    if (sizeButton) {
      document.querySelectorAll(".size-option").forEach((option) => {
        option.classList.toggle("is-selected", option === sizeButton);
        option.setAttribute("aria-pressed", String(option === sizeButton));
      });
    }
    const change = target.closest("[data-quantity]");
    if (change) {
      const item = cart.find((entry) => entry.id === change.dataset.id && entry.size === (change.dataset.size || ""));
      if (item) {
        item.quantity += Number(change.dataset.quantity);
        if (item.quantity <= 0) cart = cart.filter((entry) => entry !== item);
        saveCart();
        renderCartDrawer();
        renderCart();
        renderCheckout();
      }
    }
    const drawerChange = target.closest("[data-drawer-quantity]");
    if (drawerChange) {
      const item = cart.find((entry) => entry.id === drawerChange.dataset.id && entry.size === (drawerChange.dataset.size || ""));
      if (item) {
        item.quantity += Number(drawerChange.dataset.drawerQuantity);
        if (item.quantity <= 0) cart = cart.filter((entry) => entry !== item);
        saveCart();
        renderCartDrawer();
        renderCart();
        renderCheckout();
      }
    }
    const drawerRemove = target.closest("[data-drawer-remove]");
    if (drawerRemove) {
      cart = cart.filter((item) => !(item.id === drawerRemove.dataset.drawerRemove && item.size === (drawerRemove.dataset.size || "")));
      saveCart();
      renderCartDrawer();
      renderCart();
      renderCheckout();
    }
    const remove = target.closest("[data-remove]");
    if (remove) {
      cart = cart.filter((item) => !(item.id === remove.dataset.remove && item.size === (remove.dataset.size || "")));
      saveCart();
      renderCartDrawer();
      renderCart();
      renderCheckout();
      announce("Piece removed from your bag.");
    }
  });
  document.querySelectorAll("[data-newsletter-form]").forEach((form) => form.addEventListener("submit", (event) => {
    event.preventDefault();
    announce("Subscription preview complete. Connect an email service to store subscribers.");
    form.reset();
  }));
  document.querySelectorAll("[data-contact-form]").forEach((form) => form.addEventListener("submit", (event) => {
    event.preventDefault();
    announce("Form preview complete. Connect a contact service to deliver your message.");
    form.reset();
  }));
  document.querySelector("[data-checkout-form]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!cart.length) {
      announce("Your bag is empty. Add a piece before checking out.");
      return;
    }
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    submit.setAttribute("aria-busy", "true");
    try {
      const values = new FormData(form);
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          customer: {
            email: values.get("email"),
            phone: values.get("phone"),
            firstName: values.get("firstName"),
            lastName: values.get("lastName"),
            address: values.get("address"),
            address2: values.get("address2"),
            city: values.get("city"),
            state: values.get("state"),
            zip: values.get("zip"),
            country: values.get("country"),
            notes: values.get("notes")
          },
          updatesOptIn: values.get("updates") === "on",
          items: cart.map((item) => ({ id: item.id, size: item.size || "", quantity: item.quantity }))
        })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "We couldn't place your order. Please try again.");
      cart = [];
      saveCart();
      form.outerHTML = `<div class="order-success"><span class="success-mark">✓</span><span class="eyebrow">ORDER RECEIVED</span><h1>Thank you.</h1><p>Your order <strong>${escapeHTML(result.orderNumber)}</strong> is saved for <strong>${escapeHTML(values.get("email"))}</strong>.<br><br>This is a demo order. No payment was collected.</p><a class="button button-dark" href="shop.html">Back to the collection <span>↗</span></a></div>`;
      announce(`Order ${result.orderNumber} received — thank you.`);
    } catch (error) {
      console.error("Could not place demo order.", error);
      announce(error.message);
      submit.disabled = false;
      submit.removeAttribute("aria-busy");
    }
  });
}

ensureCartDrawer();
bindCommonInteractions();
updateCartCounts();
async function initializeCatalog() {
  try {
    const response = await fetch("/api/products", { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`Catalog request failed with status ${response.status}.`);
    const catalog = await response.json();
    if (!Array.isArray(catalog)) throw new TypeError("The product catalog response is invalid.");
    products = catalog;
    cart = cart.filter((item) => getProduct(item.id));
    saveCart();
  } catch (error) {
    console.error("Could not load products from the storefront backend; using the built-in preview catalogue.", error);
  }
  renderShop();
  renderFeaturedProducts();
  renderProduct();
  renderCart();
  renderCheckout();
}

initializeCatalog();
