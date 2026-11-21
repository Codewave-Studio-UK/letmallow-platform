# LetMallow — alpha project status

Source-import checkpoint: **06/11/2026**. See the [later alpha increment evidence](alpha-increment-2026-11-06.md) for subsequent runtime observations and checks. This is a delivery checkpoint, not a stable-release approval.

## Product baseline

LetMallow is Codewave Studio’s residential rental alpha for England and Wales, including their islands. It combines clearly labelled external housing searches with owner-authorised adverts that require human review. The selected project name is LetMallow; commercial trade mark clearance remains outstanding.

Real enquiries remain free. The membership simulator and Stripe handlers are test-only. Their example prices and entitlements are unapproved hypotheses. Neon is the requested database destination; the current backend remains on D1 pending a rehearsed migration.

See the [delivery specification](alpha-specification.md), [brand screening](research/brand-screen.md) and [README](../README.md) for requirements, historical research, operating instructions and build settings.

## Source and delivery

The source import brings the existing tracked application, tests, migrations, build scripts, configuration and licensed assets into the canonical [GitHub repository](https://github.com/Codewave-Studio-UK/letmallow-platform). Its source baseline was Sites commit `c525ac2`. Generated builds, local databases, installed dependencies and runtime credentials are excluded.

Use topic branches and pull requests into `dev`. Keep `main` for a separately accepted stable release. Importing source and passing local checks do not establish production readiness or deploy a new Site version.

## Connected resources

| Resource | Observed state on 06/11/2026 |
| --- | --- |
| Sites | Project `appgprj_6aec6af44ebc8191b33e4aab1476c3a6`, title LetMallow, public access, version 1. [Existing alpha](https://codewave-rental-alpha.hollowcarat.chatgpt.site). Its content was not browser-tested during this source import. |
| Netlify | Project `30613796-69bc-46be-8229-ce6ee9a66570`, now named `letmallow`. [Dashboard](https://app.netlify.com/projects/letmallow). Metadata returned `http://letmallow.netlify.app` and a current deploy. Team SSO is still required for all visitors. Public visitor access, active build settings and the Git connection need checking. |
| Tally | Published form `8NzzzY`: [LetMallow · feedback and reports](https://tally.so/r/8NzzzY). Reuse it for feedback, advert/safety reports and data-removal requests. |
| Neon | Account connection, live adapter operation, migration and backup/restore are unverified. The adapter test uses a fake connection and mocked transport. |
| Stripe | A genuine sandbox Checkout and provider webhook have not been demonstrated. Synthetic tests pass; live-payment credentials are rejected. |

Keep deployment origins separate: the Sites URL is still the canonical authenticated service. A Netlify project rename does not rename the Sites origin or authorise trusting identity headers from another host.

## Verification for this source import

| Check | Observed result |
| --- | --- |
| `node --test tests/*.test.mjs` | Eight passed, zero failed. Synthetic/in-memory fixtures cover visibility, expiry/limits, authorisation, free enquiries, account isolation/deletion, test payments, search parsing and the Neon adapter contract. |
| `node scripts/build-netlify.mjs` | Passed; generated the standalone public front end in `netlify-dist`. |
| `node scripts/run-framework.mjs build` | Passed all five Vinext build stages. The tool reported static route-classification and plugin-timing limitations. |

These results do not prove live identity isolation, Neon connectivity, a Stripe account integration, legal clearance, a restore drill or a genuine advertiser/renter outcome. Those checks remain open. Private evidence and production records belong outside this public repository.

## Next work

1. [Issue #1](https://github.com/Codewave-Studio-UK/letmallow-platform/issues/1): demonstrate a genuine authorised advert and free enquiry in each nation, including island and Welsh-name checks; verify moderation, consent, ownership and removal with separate participants.
2. [Issue #2](https://github.com/Codewave-Studio-UK/letmallow-platform/issues/2): connect Neon on an appropriate free plan, rehearse migration and restore with synthetic data, reconcile records and preserve a single authoritative writer.
3. [Issue #3](https://github.com/Codewave-Studio-UK/letmallow-platform/issues/3): exercise authentic Stripe sandbox events, replay/failure handling and commercial entitlement decisions. Resolve the jurisdiction-specific renter-charge and consumer questions before real charges.
4. Check Netlify visitor access, renamed links, Git integration and branch deployment settings without changing the audience or enabling chargeable services without an applicable decision.

Continue from current repository state. Do not recreate existing projects or treat dated brand/domain checks as current availability.

## Second pass on 21/11/2026

The entries above describe the source import on 06/11/2026. The following observations are current as of this review.

| Check | Observed evidence |
| --- | --- |
| Source and branch policy | [PR #6](https://github.com/Codewave-Studio-UK/letmallow-platform/pull/6) and [PR #7](https://github.com/Codewave-Studio-UK/letmallow-platform/pull/7) are merged. The audited `dev` baseline was `c1d288bc00582f5864f1306dfb53cf0fb64cfc94` (`0.1.0-alpha.4`). [CI for that commit](https://github.com/Codewave-Studio-UK/letmallow-platform/actions/runs/44888192369) passed. `main` still pointed to `23bc9432eedc3b28e10341cb3a687301f99fc749`. |
| Live alpha | [LetMallow](https://cws-demo-letmallow-alpha.hollowcarat.chatgpt.site/) is public on the existing Site ID. The original URL redirects there. Browser and endpoint checks ran on Sites version 14 (`04715aa4abd3c171ff997a73598f2b6bd0d2de8f`). A separate styling update reached public version 15 (`e875d7c22314cda61ba565d4e022c53f1c3ea6b5`) during the review. Both use app version `0.1.0-alpha.5` and contain the original search interpreter. Some public assets differ from GitHub `dev`. Reconcile [styling PR #10](https://github.com/Codewave-Studio-UK/letmallow-platform/pull/10) and the Site branch before publishing this fix. The Site metadata still describes fictional homes. |
| Account and moderation | Anonymous homes and session endpoints returned HTTP 200. The homes response contained zero approved adverts at the check. Anonymous account and reviewer queue requests both returned 401. The reviewer setting is present as a masked secret. Signed-in reviewer access, separate account isolation and actual renter and advertiser outcomes remain open in issue #1. |
| Browser and referrals | Live Chrome verified that the skip link focused main content and Escape returned focus to the smart search trigger. At 390 CSS px the filters dialog opened by keyboard, retained the budget and returned focus on Escape. The map toggle worked and the page had no horizontal overflow at that width. Ynys Môn resolved to Anglesey. The [Anglesey houses](https://www.rightmove.co.uk/property-to-rent/Isle-Of-Anglesey/houses.html) and [Isle of Wight rooms](https://www.spareroom.co.uk/flatshare/isle_of_wight) referrals returned 200 with the expected titles. This is a sampled check, and does not establish accessibility conformance or a rental outcome. |
| Search repair | The original input “A house in Ynys Môn for up to £1,000” selected All properties. The [assessment](../.specify/bugs/smart-search-home-type/assessment.md), [fix record](../.specify/bugs/smart-search-home-type/fix.md) and [verification](../.specify/bugs/smart-search-home-type/test.md) document the patch and test evidence. |
| Netlify | The `letmallow` project still reports team sign-in and a current deploy in its summary. Its deploy list returned no entries and `https://letmallow.netlify.app/` returned 404. Git linkage, active build settings and a usable public deployment remain unverified. |
| Database, payments and feedback | The interim D1 binding and its four tables are present. Neon and Stripe plugins are available but uninstalled. The live anonymous session reports Stripe unavailable. A live Neon connection, restore rehearsal and authentic Stripe sandbox checkout remain open in issues #2–#3. The existing Tally form returned HTTP 200 with the expected title. |

The decision to keep genuine enquiries free still applies. The existing legal sources remain in the [delivery specification](alpha-specification.md). No commercial clearance is inferred from this review.
