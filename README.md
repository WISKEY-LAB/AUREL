# AUREL storefront

## Run locally

1. Install Node.js 18 or newer.
2. From this folder, run `npm start`.
3. Open `http://localhost:3000`.

The first launch creates an admin account and prints the login email and a one-time generated password in the terminal. Save that password. To choose credentials before the first launch, set `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
For hosted environments, set `HOST=0.0.0.0` and provide the platform's `PORT`; the default host is local-only.

## Store management

- Admin: `/admin.html` — add, edit, publish, approve, and delete products; upload product photos; set each product's brand and category.
- Orders: `/orders.html` — review customer, shipping, item, and order details; update fulfilment status; export orders to CSV; and see booked sales, paid sales, and product profit when costs are recorded.
- Resellers: `/reseller.html` — create an account and submit product listings for admin approval.
- Product, user, and order records are stored in `data/products.json`, `data/users.json`, and `data/orders.json`; uploaded JPG, PNG, and WebP photos are stored in `uploads/`.
- The Rangoli brand and Rangoli category are seeded in the catalogue. Existing AUREL products remain in place.

Reseller passwords are stored as salted password hashes. Admin access is never assigned through reseller registration.

The checkout is a demo and does not process payments. It records customer and order details but never collects card data; accordingly, paid sales remain zero. Set a product's optional unit cost in the admin or reseller product form to include it in estimated product-profit reporting. Profit is unknown for an order if any item has no recorded cost and excludes other business expenses.
