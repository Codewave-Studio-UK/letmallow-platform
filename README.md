# LetMallow

Residential rental alpha for England and Wales, including islands, by Codewave Studio. LetMallow is the selected project name; commercial trade mark clearance remains outstanding. Visitors can explore current third-party rental searches immediately. Authorised first-party adverts appear only after studio review.

[Canonical GitHub repository](https://github.com/Codewave-Studio-UK/letmallow-platform) · [Project status and next steps](docs/project-status.md) · [Open the alpha](https://codewave-rental-alpha.hollowcarat.chatgpt.site) · [Feedback and reports](https://tally.so/r/8NzzzY) · [Delivery specification](docs/alpha-specification.md) · [Name checks](docs/research/brand-screen.md)

## Running the project

Use Node 24. The portable static front end and the service tests use Node built-ins. The framework build uses the tracked pnpm lockfile and the Sites starter toolchain. The test suite creates a fresh SQLite database in memory for each scenario.

```sh
node --test tests/*.test.mjs
node scripts/build-netlify.mjs
```

The second command produces `netlify-dist/`. It contains the public search, local preference model, fonts, photos and routing configuration. Serve that directory at the web root. Netlify proxies only public community adverts. Signed-in actions run on the canonical Sites origin. Only that origin trusts the platform's authenticated identity headers.

## Hosting and operating the alpha

| Setting | Value |
| --- | --- |
| Netlify project | [letmallow](https://app.netlify.com/projects/letmallow) |
| Netlify base | Repository root (leave blank) |
| Netlify build | `node scripts/build-netlify.mjs` |
| Netlify publish | `netlify-dist` |
| Netlify functions | None required by this front end |
| Branches | Feature branches into `dev`. Test branch deploys from `dev`. Reserve `main` for a separately accepted stable release. |
| Public build variables | None. The public client contains no credentials. |
| Account service | Sites sign-in, authenticated server endpoints and one authoritative database |
| Initial database | Built-in D1. The alpha uses this until Neon is connected and a migration is rehearsed. |
| Neon cutover | Apply `db/neon-001.sql` to a new empty Neon branch. Rehearse export/import, compare counts and enforce a write freeze for the final copy. Set the backend secret `DATABASE_URL` and `DATABASE_BACKEND=neon`. Reverting after new writes requires reconciliation. |
| Stripe | Configure server-only `STRIPE_TEST_SECRET_KEY` and `STRIPE_TEST_WEBHOOK_SECRET`. Register `/api/stripe-webhook` for completed/async-success Checkout events in the Stripe sandbox. Test return, cancellation, replay and failure. Live keys are rejected. |
| Review access | Server-only `REVIEWER_EMAIL` must exactly match the authorised sign-in identity, compared case-insensitively. |

On Sites, generate schema changes with `pnpm db:generate`, inspect the SQL and append migrations. The hosting workflow applies migrations. Keep secrets in the hosting dashboard. Never put private evidence, email addresses, keys, tenant details or checkout receipts in repository issues.

## Moderation

Sign in, open **Your account → Review adverts**. Check the advert is genuine and current, obtain evidence of authority to advertise and verify the material particulars. Review the fixed rent, what bills include, tenancy or licence type, EPC and any applicable licence or exemption. For Wales, check Rent Smart Wales registration and who is licensed to let or manage the home where required. A register address or a tick box alone does not establish authority. Hold an advert while more evidence is needed. Reject discriminatory terms, bids above the advertised rent and requests for unpermitted payments. Use the report form to investigate and unpublish quickly.

Membership simulations and paid test passes never grant housing access or restrict real enquiries. Initial deploy, account connection, supplier approval and paid launch are separate acceptance decisions.

## Assets

[Location photographs and source checks](docs/research/places.md) · [Interior photography](docs/research/interiors.md). DM Sans and Newsreader are self-hosted Google Fonts. Their SIL Open Font licences accompany the assets. No competitor adverts, images, logos, layout code or marketing copy are reproduced.
