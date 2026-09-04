# MARAIS Store

A production-grade fashion e-commerce front end, built as a portfolio piece.
Stack is React 19 + Vite + Tailwind CSS 4 on the front end, Express 5 on the
back end, Supabase (Postgres) for data. No plain HTML pages, no plain CSS
files, no paid services anywhere in the build.

---

## Quick start (Windows, PowerShell)

```powershell
cd "C:\Users\Saad\Desktop\Project 2\marais-store"
npm install
npm run dev
```

Open http://localhost:5173

That is enough to see the whole site. The catalog falls back to local seed data,
so nothing is broken with no backend and no database. The label above the product
grid tells you which source is live.

### Running the API as well

In a second terminal:

```powershell
cd "C:\Users\Saad\Desktop\Project 2\marais-store"
npm run server
```

Then check it answered:

```powershell
curl.exe http://127.0.0.1:4000/api/health
```

Vite proxies every `/api/*` request from the React app to port 4000, so the
front end never hardcodes a backend URL. Switching to a deployed API later means
editing `vite.config.js` in one place.

---

## Connecting Supabase

1. Create a project at supabase.com (the free tier is enough).
2. Open the SQL editor and run `server/db/schema.sql`. It creates the three
   tables, turns on row level security, adds the required grants, and seeds the
   eight demo products.
3. Copy the two env files and fill in your keys:

```powershell
Copy-Item .env.example .env
Copy-Item server\.env.example server\.env
```

Keys live in Project Settings, then API.

| Key | Goes in | Why |
| --- | --- | --- |
| Project URL | both files | Where your database lives |
| `anon` public key | both files | Safe in the browser. Row level security is what protects data, not key secrecy |
| `service_role` key | `server/.env` only | Bypasses row level security completely. Never put this in the frontend file, and never commit it |

Restart both processes. The product grid label should switch to
"Catalog served from Supabase".

### One thing that catches people out

Postgres checks table level **privileges** before it evaluates a row level
security policy. A perfectly written policy on a table with no `GRANT` still
fails with `42501 permission denied`, because the failure happens before the
policy ever runs. That is why `schema.sql` has both `create policy` and
`grant select`. If a table returns permission denied when the policy looks
correct, the missing grant is almost always the reason.

Verify by impersonation rather than by reading the policy and assuming:

```sql
set local role anon;
select count(*) from public.products;   -- expect 8
select count(*) from public.orders;     -- expect permission denied
reset role;
```

---

## Pages

| Route | What it does |
| --- | --- |
| `/` | Storefront: hero, categories, product grid, editorial, lookbook, newsletter |
| `/checkout` | Three step checkout: contact, shipping, review. Server recalculates the total |
| `/order/:reference` | Order confirmation. Works from a shared link, not just after checkout |
| `/login` | Sign in |
| `/signup` | Create an account, with email confirmation handling |
| `/account` | Order history, sign out. Guarded route |

Routing is `react-router-dom`. `public/_redirects` and `vercel.json` hand every
path to the app, so `/checkout` still resolves after deploying to a static host.
Without those two files a deployed site 404s on every route except the home page.

## Accounts and checkout

Auth is Supabase Auth. With keys present it is real: real password hashing, real
sessions, real email confirmation. With keys absent the app runs in **demo
mode**, which accepts any login and holds the session in memory for the tab. Every
screen that uses demo mode says so on the page. That exists so the account and
checkout flow can be shown to a client before a database is wired up.

Checkout collects contact details and a shipping address across three validated
steps, then posts to `POST /api/orders`. **No payment is taken.** The order is
recorded and a reference is returned. Stripe Checkout is the usual next step and
its test mode is free.

Three things the checkout does that are easy to get wrong:

- **Totals are recalculated on the server.** The client posts product ids, sizes
  and quantities only. Prices, shipping and the total come from the database. A
  client that can post its own totals can post its own discount.
- **Every earlier step is re-validated before the order is placed.** Someone can
  reach Review, go back, clear a field, and return, so trusting the step counter
  alone is not enough.
- **The order lookup returns a narrow set of columns.** Anyone holding a
  reference can read it, so the email, phone number and shipping address are
  never included in that response.

## API

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/health` | Boot check, reports whether Supabase is configured |
| GET | `/api/products` | Active catalog |
| GET | `/api/products/:id` | Single product |
| POST | `/api/orders` | Creates an order. Validates and reprices server side |
| GET | `/api/orders/mine` | Signed in customer's own orders. Bearer token required |
| GET | `/api/orders/:reference` | Public lookup by reference, narrow columns only |
| POST | `/api/subscribers` | Newsletter signup, upsert so repeats are not errors |

`/api/orders/mine` verifies the token against Supabase rather than decoding it
locally, so a forged or expired token cannot read anyone's order history.

## Project layout

```
marais-store/
  index.html               Entry document. Fonts load in the browser, never at build time
  vite.config.js           React plugin, Tailwind plugin, /api proxy to Express
  src/
    main.jsx               React root, wrapped in CartProvider
    App.jsx                Page composition and catalog fetch with seed fallback
    index.css              Design tokens in @theme, plus the reduced-motion fallback
    context/CartContext    Cart state in a reducer, one named action per mutation
    lib/api.js             fetch wrapper. Every call has a timeout and a fallback
    lib/supabase.js        Browser client. Null when unconfigured, by design
    data/products.js       Seed catalog. Also the shape contract the API must match
    components/            One file per section, plus Reveal and SmartImage primitives
  server/
    index.js               Express app, CORS, request log, error handler
    routes/products.js     GET /api/products, GET /api/products/:id
    routes/orders.js       POST /api/orders. Recomputes prices server side
    routes/subscribers.js  POST /api/subscribers
    lib/supabase.js        Two clients: anon for reads, service role for writes
    db/schema.sql          Tables, RLS policies, grants, seed data
```

---

## Design decisions worth knowing

**Tokens, not hardcoded colors.** Every color and font in the site reads from
the `@theme` block at the top of `src/index.css`. Rebranding for a different
client is editing that one block. No component contains a hex value.

**Palette: high contrast monochromatic.** Pure white ground, jet black type,
`#E5E5E5` fog gray structure, one crimson accent. The product photography does
the visual work and the interface stays out of its way.

**Two crimsons, on purpose.** White text on `#E63946` measures 4.17:1, which is
below the 4.5:1 WCAG AA floor for normal size text. So the brand crimson is used
for decoration only (the nav underline, hover rules) and everything carrying text
uses `--color-accent-deep` `#C1121F` at 6.22:1. Same visual identity, no
accessibility debt.

**Crimson is reserved for the single highest intent action.** Checkout and Place
Order are crimson. Everything else is black. One accent used once means it
actually signals something.

**All contrast ratios verified, not eyeballed.** Fourteen text pairs measured;
the lowest is 5.25:1 on input placeholders. WCAG AA passes throughout. The first
pass had placeholders at 2.92:1, which the check caught and which eyeballing
would not have.

**Full bleed hero.** The image column runs to the edge of the viewport while the
copy column stays aligned to the 1280px container the rest of the page uses. An
image boxed inside the container leaves a strip of background beside it on wide
screens, which reads as a mistake.

**No two sections share a layout family.** Asymmetric split hero, uneven
category grid, four column product grid, full bleed image with an offset panel,
divided horizontal band, horizontal scroll rail, centered form band. Repeating
one layout three times down a page is the fastest way to make a site look
templated.

**Every CTA has its own interaction identity.** The hero arrow travels, quick
add rises from the image edge, add to bag fills cobalt, read our approach grows
an underline, subscribe lifts. A page of identical pills reads as a template.

**Motion is transform and opacity only, and never fades to zero.** Content that
sits at `opacity: 0` waiting for an IntersectionObserver vanishes in print, in
screenshots, and for anyone whose observer never fires. `Reveal` starts at 40%
instead. The whole system is behind one `prefers-reduced-motion` block.

**Fonts load in the browser, not during the build.** A build-time font fetch on
a filtered or slow network makes a dev server print "ready" and then never
answer a request, which looks exactly like a firewall problem and is not. The
CSS font stack falls back to system fonts if Google never responds.

**Prices are recomputed on the server.** `POST /api/orders` re-reads every price
from the database and ignores whatever the client sent. A client that can post
its own totals can post its own discount.

**Nothing white-screens.** No backend, no database, no network: the site still
loads and browses. Images that fail to load become a tinted panel carrying the
item name rather than a broken image icon.

---

## Before showing this to a paying client

1. **Replace the imagery.** The photos are Unsplash placeholders. They are the
   single biggest tell that a site came off a template. Real product photography
   changes the impression more than any amount of code polish.
2. **Replace the copy.** Product names, fabric compositions and the studio story
   are written to be plausible, not true.
3. **Wire real payments.** Checkout writes an order row and returns a reference.
   It does not take money. Stripe Checkout is the usual next step and has a free
   test mode.

---

## Deploying free

Front end: `npm run build`, then drop the `dist` folder on Netlify or Vercel.
Both have a free tier and give you a live URL you can put in a Fiverr gig.

Back end: Render and Railway both run a small Node service free. Set the same
environment variables there, then point the Vite proxy target at the deployed
URL.

Supabase free tier covers the database.

---

## If the dev server says ready but the page is blank

Check in this order. It is the order that finds the cause fastest.

1. `npm run build`. If it passes, the code is not the problem, full stop.
2. Make sure the browser is a real browser window, not VS Code's Simple Browser.
   That embedded webview fails silently with no error at all.
3. `curl.exe -v --max-time 30 http://127.0.0.1:5173`. This removes the browser
   as a variable. HTML coming back means the server is fine.
4. `Get-Process node`. More than one stale process fighting over the same port
   or cache will produce a server that never finishes starting. Kill them all
   and start exactly one.
5. Only after all of the above: firewall, VPN, antivirus. Checking those first
   turns a five minute problem into an afternoon.
