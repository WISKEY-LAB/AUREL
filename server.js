"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const http = require("node:http");
const path = require("node:path");
const { promisify } = require("node:util");

const scrypt = promisify(crypto.scrypt);
const root = __dirname;
const dataDirectory = path.resolve(process.env.STORE_DATA_DIR || path.join(root, "data"));
const uploadDirectory = path.resolve(process.env.STORE_UPLOAD_DIR || path.join(root, "uploads"));
const productsFile = path.join(dataDirectory, "products.json");
const usersFile = path.join(dataDirectory, "users.json");
const ordersFile = path.join(dataDirectory, "orders.json");
const sessions = new Map();
const maxBodyBytes = 6 * 1024 * 1024;
const maxImageBytes = 4 * 1024 * 1024;
const allowedImages = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"]
]);
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp"
};

async function readJson(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return fallback;
    throw error;
  }
}

async function writeJson(file, value) {
  const temporary = `${file}.${crypto.randomUUID()}.tmp`;
  await fs.writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
  await fs.rename(temporary, file);
}

async function getProducts() {
  return readJson(productsFile, []);
}

async function getUsers() {
  return readJson(usersFile, []);
}

async function passwordHash(password, salt = crypto.randomBytes(16).toString("hex")) {
  const derived = await scrypt(password, salt, 64);
  return { salt, hash: derived.toString("hex") };
}

async function initialize() {
  await fs.mkdir(dataDirectory, { recursive: true });
  await fs.mkdir(uploadDirectory, { recursive: true });
  if (!(await fs.access(productsFile).then(() => true, () => false))) {
    await writeJson(productsFile, []);
  }
  if (!(await fs.access(ordersFile).then(() => true, () => false))) {
    await writeJson(ordersFile, []);
  }
  const users = await getUsers();
  if (!users.some((user) => user.role === "admin")) {
    const password = process.env.ADMIN_PASSWORD || crypto.randomBytes(18).toString("base64url");
    const credentials = await passwordHash(password);
    users.push({
      id: crypto.randomUUID(),
      email: (process.env.ADMIN_EMAIL || "admin@aurel.local").trim().toLowerCase(),
      ...credentials,
      role: "admin",
      createdAt: new Date().toISOString()
    });
    await writeJson(usersFile, users);
    console.log(`Initial admin: ${users[users.length - 1].email}`);
    if (!process.env.ADMIN_PASSWORD) console.log(`Generated admin password (save it now): ${password}`);
  }
}

function sendJson(response, status, value) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  response.end(JSON.stringify(value));
}

function parseCookies(request) {
  return Object.fromEntries((request.headers.cookie || "").split(";").map((part) => {
    const separator = part.indexOf("=");
    return separator < 0 ? ["", ""] : [part.slice(0, separator).trim(), decodeURIComponent(part.slice(separator + 1).trim())];
  }).filter(([key]) => key));
}

function getSession(request) {
  const token = parseCookies(request).store_session;
  const session = token && sessions.get(token);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    sessions.delete(token);
    return null;
  }
  return { ...session.user, token };
}

function requireRole(request, response, roles) {
  const user = getSession(request);
  if (!user || !roles.includes(user.role)) {
    sendJson(response, 401, { error: "Please sign in with an authorized account." });
    return null;
  }
  return user;
}

async function readBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxBodyBytes) throw Object.assign(new Error("Request is too large."), { status: 413 });
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw Object.assign(new Error("Request body must be valid JSON."), { status: 400 });
  }
}

function cleanText(value, label, maxLength, required = false) {
  if (typeof value !== "string") {
    if (required) throw Object.assign(new Error(`${label} is required.`), { status: 400 });
    return "";
  }
  const result = value.trim();
  if (required && !result) throw Object.assign(new Error(`${label} is required.`), { status: 400 });
  if (result.length > maxLength) throw Object.assign(new Error(`${label} must be ${maxLength} characters or fewer.`), { status: 400 });
  return result;
}

async function saveProductImage(image) {
  if (typeof image !== "string" || !image.startsWith("data:")) return null;
  const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/.exec(image);
  if (!match) throw Object.assign(new Error("Upload a JPG, PNG, or WebP image."), { status: 400 });
  const extension = allowedImages.get(match[1]);
  const buffer = Buffer.from(match[2], "base64");
  if (!buffer.length || buffer.length > maxImageBytes) {
    throw Object.assign(new Error("Images must be smaller than 4 MB."), { status: 400 });
  }
  const signatureIsValid = extension === "jpg"
    ? buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))
    : extension === "png"
      ? buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      : buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP";
  if (!signatureIsValid) throw Object.assign(new Error("The uploaded file does not match its image type."), { status: 400 });
  const filename = `${crypto.randomUUID()}.${extension}`;
  await fs.writeFile(path.join(uploadDirectory, filename), buffer, { flag: "wx" });
  return `/uploads/${filename}`;
}

async function normalizeProduct(input, existing, user) {
  const name = cleanText(input.name, "Product name", 100, true);
  const price = Number(input.price);
  if (!Number.isFinite(price) || price <= 0 || price > 10000000) {
    throw Object.assign(new Error("Enter a valid product price greater than zero."), { status: 400 });
  }
  const comparePrice = input.comparePrice === "" || input.comparePrice == null ? null : Number(input.comparePrice);
  if (comparePrice !== null && (!Number.isFinite(comparePrice) || comparePrice <= price || comparePrice > 10000000)) {
    throw Object.assign(new Error("Compare-at price must be greater than the selling price."), { status: 400 });
  }
  const costInput = input.costPrice === "" || input.costPrice == null
    ? existing?.costPrice ?? null
    : Number(input.costPrice);
  if (costInput !== null && (!Number.isFinite(costInput) || costInput < 0 || costInput > 10000000)) {
    throw Object.assign(new Error("Enter a valid product cost of zero or more."), { status: 400 });
  }
  const uploaded = await saveProductImage(input.imageData);
  const image = uploaded || (input.image || existing?.image || "");
  if (!image || !(image.startsWith("/uploads/") || /^https:\/\//i.test(image))) {
    throw Object.assign(new Error("A product image is required. Use an upload or a secure HTTPS image URL."), { status: 400 });
  }
  if (image.startsWith("/uploads/") && !/^\/uploads\/[a-f0-9-]+\.(?:jpg|png|webp)$/.test(image)) {
    throw Object.assign(new Error("Invalid uploaded image path."), { status: 400 });
  }
  const status = user.role === "admin" && ["active", "pending"].includes(input.status)
    ? input.status
    : user.role === "admin" ? "active" : "pending";
  return {
    ...(existing || {}),
    id: existing?.id || crypto.randomUUID(),
    name,
    category: cleanText(input.category || "Rangoli", "Category", 50, true),
    brand: cleanText(input.brand || "AUREL", "Brand", 50, true),
    price: Math.round(price * 100) / 100,
    costPrice: costInput === null ? null : Math.round(costInput * 100) / 100,
    comparePrice: comparePrice == null ? null : Math.round(comparePrice * 100) / 100,
    badge: cleanText(input.badge, "Badge", 40),
    color: cleanText(input.color, "Color", 50),
    sizes: Array.isArray(input.sizes) ? input.sizes.slice(0, 20).map((size) => cleanText(size, "Size", 15)).filter(Boolean) : [],
    image,
    image2: cleanText(input.image2, "Second image URL", 500),
    description: cleanText(input.description, "Description", 1000),
    status,
    ownerId: existing?.ownerId || user.id,
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function validateCustomer(body) {
  const customer = {
    email: cleanText(body.email, "Email", 254, true).toLowerCase(),
    phone: cleanText(body.phone, "Phone number", 40, true),
    firstName: cleanText(body.firstName, "First name", 80, true),
    lastName: cleanText(body.lastName, "Last name", 80, true),
    address: cleanText(body.address, "Address", 200, true),
    address2: cleanText(body.address2, "Apartment or unit", 120),
    city: cleanText(body.city, "City", 100, true),
    state: cleanText(body.state, "State or province", 100, true),
    zip: cleanText(body.zip, "ZIP or postal code", 30, true),
    country: cleanText(body.country, "Country", 100, true),
    notes: cleanText(body.notes, "Order note", 1000)
  };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
    throw Object.assign(new Error("Enter a valid email address."), { status: 400 });
  }
  return customer;
}

async function createOrder(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw Object.assign(new Error("Order details must be sent as an object."), { status: 400 });
  }
  const customer = validateCustomer(body.customer && typeof body.customer === "object" ? body.customer : {});
  if (!Array.isArray(body.items) || body.items.length < 1 || body.items.length > 100) {
    throw Object.assign(new Error("Your order must contain at least one product."), { status: 400 });
  }
  const products = await getProducts();
  const items = body.items.map((requested) => {
    if (!requested || typeof requested !== "object" || Array.isArray(requested)) {
      throw Object.assign(new Error("Each order item must be a product object."), { status: 400 });
    }
    const product = products.find((entry) => entry.id === requested.id && entry.status === "active");
    const quantity = Number(requested.quantity);
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      throw Object.assign(new Error("A product in your bag is no longer available. Refresh your bag and try again."), { status: 400 });
    }
    const size = cleanText(requested.size, "Product size", 20);
    if (product.sizes?.length && !product.sizes.includes(size)) {
      throw Object.assign(new Error(`${product.name} needs a valid size selection.`), { status: 400 });
    }
    const unitPrice = Number(product.price);
    const rawCost = product.costPrice;
    const unitCost = rawCost === null || rawCost === undefined ? null : Number(rawCost);
    return {
      productId: product.id,
      name: product.name,
      brand: product.brand || "AUREL",
      category: product.category,
      image: product.image,
      color: product.color || "",
      size,
      quantity,
      unitPrice,
      unitCost,
      lineTotal: Math.round(unitPrice * quantity * 100) / 100,
      lineCost: unitCost === null ? null : Math.round(unitCost * quantity * 100) / 100
    };
  });
  const subtotal = Math.round(items.reduce((sum, item) => sum + item.lineTotal, 0) * 100) / 100;
  const shipping = subtotal === 0 || subtotal >= 150 ? 0 : 12;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const orderNumber = `AU-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
  const order = {
    id: crypto.randomUUID(),
    orderNumber,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "pending",
    paymentStatus: "not_collected_demo",
    currency: "USD",
    customer,
    updatesOptIn: body.updatesOptIn === true,
    items,
    totals: {
      subtotal,
      discounts: 0,
      shipping,
      tax,
      total: Math.round((subtotal + shipping + tax) * 100) / 100,
      costKnown: items.every((item) => item.lineCost !== null),
      costOfGoods: items.every((item) => item.lineCost !== null)
        ? Math.round(items.reduce((sum, item) => sum + item.lineCost, 0) * 100) / 100
        : null,
      estimatedProfit: items.every((item) => item.lineCost !== null)
        ? Math.round((subtotal - items.reduce((sum, item) => sum + item.lineCost, 0)) * 100) / 100
        : null
    },
    timeline: [{ status: "pending", at: new Date().toISOString(), note: "Demo order received. No payment collected." }]
  };
  const orders = await readJson(ordersFile, []);
  orders.unshift(order);
  await writeJson(ordersFile, orders);
  return order;
}

function orderReport(orders) {
  const activeOrders = orders.filter((order) => !["cancelled", "refunded"].includes(order.status));
  const knownCostOrders = activeOrders.filter((order) => order.totals?.costKnown);
  const grouped = new Map();
  for (const order of activeOrders) {
    const month = order.createdAt?.slice(0, 7) || "unknown";
    const current = grouped.get(month) || { month, orders: 0, sales: 0, profit: 0, profitKnownOrders: 0 };
    current.orders += 1;
    current.sales += Number(order.totals?.total) || 0;
    if (order.totals?.estimatedProfit != null) {
      current.profit += Number(order.totals.estimatedProfit);
      current.profitKnownOrders += 1;
    }
    grouped.set(month, current);
  }
  const sum = (field) => Math.round(activeOrders.reduce((total, order) => total + (Number(order.totals?.[field]) || 0), 0) * 100) / 100;
  return {
    totalOrders: orders.length,
    activeOrders: activeOrders.length,
    cancelledOrders: orders.filter((order) => order.status === "cancelled").length,
    refundedOrders: orders.filter((order) => order.status === "refunded").length,
    bookedSales: sum("total"),
    productRevenue: sum("subtotal"),
    discounts: sum("discounts"),
    shippingCollected: sum("shipping"),
    taxCollected: sum("tax"),
    paidSales: Math.round(orders.filter((order) => order.paymentStatus === "paid")
      .reduce((total, order) => total + (Number(order.totals?.total) || 0), 0) * 100) / 100,
    knownCostOrders: knownCostOrders.length,
    missingCostOrders: activeOrders.length - knownCostOrders.length,
    estimatedProfit: knownCostOrders.length
      ? Math.round(knownCostOrders.reduce((total, order) => total + (Number(order.totals.estimatedProfit) || 0), 0) * 100) / 100
      : null,
    monthly: [...grouped.values()].sort((a, b) => b.month.localeCompare(a.month)).slice(0, 12)
  };
}

async function handleApi(request, response, url) {
  const pathname = url.pathname;
  if (request.method === "GET" && pathname === "/api/products") {
    const products = (await getProducts()).filter((product) => product.status === "active")
      .map(({ costPrice, ...product }) => product);
    sendJson(response, 200, products);
    return;
  }
  if (request.method === "GET" && pathname === "/api/brands") {
    const products = await getProducts();
    sendJson(response, 200, [...new Set(["AUREL", ...products.filter((item) => item.status === "active").map((item) => item.brand)])]);
    return;
  }
  if (request.method === "GET" && pathname === "/api/session") {
    const user = getSession(request);
    sendJson(response, 200, user ? { id: user.id, email: user.email, role: user.role } : { user: null });
    return;
  }
  if (request.method === "POST" && pathname === "/api/auth/register") {
    const body = await readBody(request);
    const email = cleanText(body.email, "Email", 254, true).toLowerCase();
    const password = cleanText(body.password, "Password", 128, true);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 10) {
      sendJson(response, 400, { error: "Enter a valid email and a password with at least 10 characters." });
      return;
    }
    const users = await getUsers();
    if (users.some((user) => user.email === email)) {
      sendJson(response, 409, { error: "An account with this email already exists." });
      return;
    }
    const credentials = await passwordHash(password);
    const user = { id: crypto.randomUUID(), email, ...credentials, role: "reseller", createdAt: new Date().toISOString() };
    users.push(user);
    await writeJson(usersFile, users);
    createSession(request, response, user);
    return;
  }
  if (request.method === "POST" && pathname === "/api/auth/login") {
    const body = await readBody(request);
    const email = cleanText(body.email, "Email", 254, true).toLowerCase();
    const password = cleanText(body.password, "Password", 128, true);
    const user = (await getUsers()).find((item) => item.email === email);
    if (!user) {
      await passwordHash(password);
      sendJson(response, 401, { error: "Email or password is incorrect." });
      return;
    }
    const candidate = await scrypt(password, user.salt, 64);
    const stored = Buffer.from(user.hash, "hex");
    if (candidate.length !== stored.length || !crypto.timingSafeEqual(candidate, stored)) {
      sendJson(response, 401, { error: "Email or password is incorrect." });
      return;
    }
    createSession(request, response, user);
    return;
  }
  if (request.method === "POST" && pathname === "/api/auth/logout") {
    const token = parseCookies(request).store_session;
    if (token) sessions.delete(token);
    response.writeHead(204, { "Set-Cookie": "store_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0" });
    response.end();
    return;
  }
  if (request.method === "POST" && pathname === "/api/orders") {
    const order = await createOrder(await readBody(request));
    sendJson(response, 201, { orderNumber: order.orderNumber, status: order.status, totals: order.totals });
    return;
  }
  const user = requireRole(request, response, pathname.startsWith("/api/admin/") ? ["admin"] : ["admin", "reseller"]);
  if (!user) return;
  if (request.method === "GET" && pathname === "/api/admin/products") {
    sendJson(response, 200, await getProducts());
    return;
  }
  if (request.method === "GET" && pathname === "/api/admin/orders") {
    const orders = await readJson(ordersFile, []);
    sendJson(response, 200, { orders, report: orderReport(orders) });
    return;
  }
  if (request.method === "GET" && pathname === "/api/reseller/products") {
    sendJson(response, 200, (await getProducts()).filter((product) => product.ownerId === user.id));
    return;
  }
  if (request.method === "POST" && pathname === "/api/products") {
    const body = await readBody(request);
    const product = await normalizeProduct(body, null, user);
    const products = await getProducts();
    products.unshift(product);
    await writeJson(productsFile, products);
    sendJson(response, 201, product);
    return;
  }
  const match = /^\/api\/products\/([a-z0-9-]+)$/i.exec(pathname);
  const orderMatch = /^\/api\/admin\/orders\/([a-f0-9-]+)$/i.exec(pathname);
  if (orderMatch && request.method === "PATCH") {
    const body = await readBody(request);
    const allowedStatuses = ["pending", "processing", "shipped", "delivered", "cancelled", "refunded"];
    if (!body || typeof body !== "object" || !allowedStatuses.includes(body.status)) {
      sendJson(response, 400, { error: "Choose a valid order status." });
      return;
    }
    const orders = await readJson(ordersFile, []);
    const index = orders.findIndex((order) => order.id === orderMatch[1]);
    if (index < 0) {
      sendJson(response, 404, { error: "Order not found." });
      return;
    }
    const note = cleanText(body.note, "Status note", 500);
    orders[index].status = body.status;
    orders[index].updatedAt = new Date().toISOString();
    orders[index].timeline.push({ status: body.status, at: orders[index].updatedAt, note });
    await writeJson(ordersFile, orders);
    sendJson(response, 200, orders[index]);
    return;
  }
  if (match && request.method === "PATCH") {
    if (user.role !== "admin") {
      sendJson(response, 403, { error: "Only an admin can edit or approve products." });
      return;
    }
    const products = await getProducts();
    const index = products.findIndex((product) => product.id === match[1]);
    if (index < 0) {
      sendJson(response, 404, { error: "Product not found." });
      return;
    }
    products[index] = await normalizeProduct(await readBody(request), products[index], user);
    await writeJson(productsFile, products);
    sendJson(response, 200, products[index]);
    return;
  }
  if (match && request.method === "DELETE") {
    if (user.role !== "admin") {
      sendJson(response, 403, { error: "Only an admin can delete products." });
      return;
    }
    const products = await getProducts();
    const product = products.find((item) => item.id === match[1]);
    if (!product) {
      sendJson(response, 404, { error: "Product not found." });
      return;
    }
    await writeJson(productsFile, products.filter((item) => item.id !== match[1]));
    sendJson(response, 200, { ok: true });
    return;
  }
  sendJson(response, 404, { error: "API route not found." });
}

function createSession(request, response, user) {
  const token = crypto.randomBytes(32).toString("base64url");
  sessions.set(token, { user, expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7 });
  const secure = request.socket.encrypted ? "; Secure" : "";
  response.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Set-Cookie": `store_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=604800${secure}`
  });
  response.end(JSON.stringify({ user: { id: user.id, email: user.email, role: user.role } }));
}

async function serveFile(response, pathname) {
  const decoded = decodeURIComponent(pathname);
  const base = decoded.startsWith("/uploads/") ? uploadDirectory : root;
  const requested = decoded.startsWith("/uploads/") ? decoded.slice("/uploads/".length) : decoded.slice(1) || "index.html";
  const file = path.resolve(base, requested);
  if (!file.startsWith(`${base}${path.sep}`) && file !== path.join(root, "index.html")) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }
  try {
    const content = await fs.readFile(file);
    response.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(file).toLowerCase()] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": pathname.startsWith("/uploads/") ? "public, max-age=31536000, immutable" : "no-cache"
    });
    response.end(content);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}

async function handleRequest(request, response) {
  try {
    const url = new URL(request.url, "http://localhost");
    if (url.pathname.startsWith("/api/")) {
      await handleApi(request, response, url);
      return;
    }
    if (!["GET", "HEAD"].includes(request.method)) {
      sendJson(response, 405, { error: "Method not allowed." });
      return;
    }
    await serveFile(response, url.pathname);
  } catch (error) {
    if (response.headersSent) {
      response.destroy(error);
      return;
    }
    if (error.status) {
      sendJson(response, error.status, { error: error.message });
      return;
    }
    console.error("Request failed:", error);
    sendJson(response, 500, { error: "The server could not complete this request." });
  }
}

initialize().then(() => {
  const port = Number(process.env.PORT) || 3000;
  http.createServer(handleRequest).listen(port, process.env.HOST || "127.0.0.1", () => {
    console.log(`AUREL storefront is running at http://localhost:${port}`);
  });
}).catch((error) => {
  console.error("Could not initialize the storefront backend:", error);
  process.exitCode = 1;
});
