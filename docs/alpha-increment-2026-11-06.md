# LetMallow alpha increment — 06/11/2026

This checkpoint separates observed behaviour from outstanding acceptance gates. It is not a stable-release approval. The product remains LetMallow, for England and Wales including their islands, with £0 additional spend and free genuine enquiries. Selected branding does not establish trade mark clearance.

## Source and scope

Recovered source: Site version 1, commit `c525ac2b577bb6c40bf770806115ae0f23a74582`. The existing source import is [PR #6](https://github.com/Codewave-Studio-UK/letmallow-platform/pull/6), from `feature/repository-sync` into `dev`; its initial head was `f3c3402354e5660ebe3e4e043d60439f55e50b70`. Branding [PR #4](https://github.com/Codewave-Studio-UK/letmallow-platform/pull/4) has been merged into `dev` at `5c5b1fa4f164a8a1bd2c617db8e78e26de9a7bf2`. Source import PR #6 was subsequently merged into `dev` at `7ead26b046e2a7496b16a3fee4ab69e59111088a`. This reliability increment continues from that commit on `feature/alpha-resilience`. The separate roadmap PR #5 is preserved. No merge to `main` is included.

Concurrent work changed the original recovery checkout. This increment uses `/workspace/scratch/2396ff33c191/letmallow-platform`; the separate Sites publication checkout is `/workspace/scratch/2396ff33c191/site-publish`. Scratch paths are recovery hints. GitHub and the native Sites source repository retain the deliverable.

Changes in this increment:

- Account-session checks finish independently of community-advert loading. Slow search data no longer delays the initial account state.
- Community search distinguishes loading, unavailable and a successfully loaded empty result. A failed advert fetch no longer appears to prove there are no matching adverts. The external provider routes remain available.
- API requests have a 12-second client deadline. A write is never retried automatically after a timeout; the user is asked to check their account because the server may have saved it.
- Unknown database backend names fail closed. An absent setting retains the established D1 writer; explicitly selected Neon failures never substitute D1. No database switch or migration is included.
- A Netlify mirror directs checkout availability checks to the canonical account service instead of claiming an unqueried sandbox is disconnected.
- Refreshed the rental-bidding and Rent Smart Wales reference links. This is a targeted source refresh, not legal clearance.

## Runtime and account observations before publication

| Resource or check | Observed result | Limit |
| --- | --- | --- |
| Existing Site | Public, title LetMallow, version 1 at `https://codewave-rental-alpha.hollowcarat.chatgpt.site`. The home and account entry rendered. | Preserve the audience and URL. The native metadata description still says fictional homes; the available metadata operation only changes the title. |
| Public marketplace API | `/api/homes` returned HTTP 200 with zero approved adverts. | This is an observation at the check, not a permanent inventory claim or a rental outcome. No synthetic advert was added to the live database. |
| Identity boundary | Anonymous `/api/account` and `/api/queue` returned HTTP 401. A `/api/session` request bearing forged synthetic identity headers remained signed out. | Does not prove separation between two authenticated users. |
| Sign-in | The account link reached OpenAI's login page. | No authenticated session was supplied; posting, reviewer access and separate-user live enquiries remain unverified. |
| D1 | Native database overview returned binding `DB` and tables `ads`, `enquiries`, `orders`, `passes`. | Table presence is not a restore drill. Private table rows were not retrieved. |
| Runtime configuration | The secret-key listing contains `REVIEWER_EMAIL`, with its value withheld. `/api/session` reported Stripe unavailable. | A withheld reviewer value is not evidence that it is empty or that it matches the intended operator. Reviewer access needs an authenticated check. No Neon/Stripe configuration was added. |
| Netlify | Same project ID `30613796-69bc-46be-8229-ce6ee9a66570`, now named `letmallow`; Codewave Studio team reports Free. Metadata reports team SSO for all visitors. | `https://letmallow.netlify.app/` rendered Netlify's “Site not found”. The deployment-list operation returned no deploys, conflicting with the project's current-deploy summary. Active build settings, Git linkage, quota and public access are unproved. No access or billing change was made. |
| Neon and Stripe | Plugin discovery returned both integrations as available but not installed. | Actual accounts, quotas, Neon connectivity and genuine Stripe sandbox Checkout/webhooks remain blocked on connection. Existing in-memory/synthetic tests are not provider proof. |
| Tally | Retained `https://tally.so/r/8NzzzY`, form `8NzzzY`. | No feedback or personal data was submitted. |

## Verification

| Check | Result and meaning |
| --- | --- |
| Service and client tests | `node --test tests/*.test.mjs`: 12 passed, zero failed. Eight existing SQLite/synthetic scenarios plus denied client writes, timeouts without retries, unavailable/non-JSON responses and no database fallback. |
| Static build | `node scripts/build-netlify.mjs`: passed. Includes the new client module. This does not deploy Netlify. |
| Framework build | `node scripts/run-framework.mjs build`: all five Vinext stages passed. Route-classification limitations remain a tool warning, not evidence of a runtime failure. |
| Source hygiene | Reviewed tracked source and file modes; no private runtime databases, dependencies, generated builds or credentials are included. Credential-pattern scan found no candidate live secrets. |
| Initial GitHub CI | PR #6's original source-import head completed Alpha checks successfully. The revised head needs its own CI observation, recorded in the PR. |
| Browser QA | Existing version's home/account route and Netlify error page were observed. Managed preview failed its health deadline; the browser connection subsequently disconnected. |

Updated-layout, mobile, focus and keyboard checks are therefore unverified. The synthetic tests do not establish authentic Stripe events, a live Neon connection, lawful monetisation, restoration, a genuine advertiser, a viewing or a tenancy. Publication IDs and subsequent smoke-check results belong in the release record/PR after the deployment responds.

## Targeted external checks

On 06/11/2026 the search service retrieved area/category pages for [London rooms](https://www.spareroom.co.uk/flatshare/london), [Manchester rooms](https://www.spareroom.co.uk/flatshare/manchester), [Bristol rooms](https://www.spareroom.co.uk/flatshare/bristol), [Cardiff flats](https://www.openrent.co.uk/properties-to-rent/cardiff/flats), [Isle of Wight rooms](https://www.spareroom.co.uk/flatshare/isle_of_wight) and [Anglesey houses](https://www.rightmove.co.uk/property-to-rent/Isle-Of-Anglesey/houses.html). These are source-page checks, not six completed browser referrals. Other category routes retain their earlier dated evidence. No provider listings, counts, photographs or prices were copied into the product.

The [English government enforcement guidance](https://www.gov.uk/government/publications/rental-bidding-a-guide-for-local-authorities-and-councils/rental-bidding-a-guide-for-local-authorities-and-councils) states that the fixed-price and rental-bidding measures apply to covered assured periodic tenancies from 01/05/2026; it also distinguishes websites that only host adverts. The platform's own activities still require review. [Rent Smart Wales registration](https://rentsmart.gov.wales/en/landlord/landlord-registration/) distinguishes registration, licensing and exemptions; the former `/en/landlord/` page now returns a not-found message. See also its [licensing guidance](https://rentsmart.gov.wales/en/licensing/).

The [Expiring Laws Act 1969, section 1](https://www.legislation.gov.uk/ukpga/1969/61/pdfs/ukpga_19690061_en.pdf) made the Accommodation Agencies Act 1953 permanent. Its original expiry clause is not a basis for dismissing the renter-charge concern. A full consolidated applicability/amendment and commercial-model review remains open. Real housing contact stays free.

## Remaining acceptance gates

1. [Issue #1](https://github.com/Codewave-Studio-UK/letmallow-platform/issues/1): authenticated reviewer operation and consenting advertiser/renter journeys in each nation; real authority checks, deliberate contact sharing, withdrawal/removal and island/Welsh-alias cases. No participant outreach is authorised by this increment.
2. [Issue #2](https://github.com/Codewave-Studio-UK/letmallow-platform/issues/2): connect the actual Neon account; confirm a continuing free entitlement and no chargeable configuration; apply/rehearse schema, migration, permissions, restore, write freeze and reconciliation before a single-writer cutover.
3. [Issue #3](https://github.com/Codewave-Studio-UK/letmallow-platform/issues/3): authentic Stripe sandbox Checkout and verified webhook, cancellation, amount/currency mismatches, replay/retry; validate pricing and lawful premium benefits before any real charges.
4. Reconcile Netlify's deployment discrepancy, then verify Git/build configuration and usage before a new deploy. Preserve visitor-access settings unless the owner authorises a change.
5. Complete responsive keyboard/focus/contrast and authenticated browser checks when preview/browser access is restored. Keep `main` reserved for a separate owner-accepted stable release.
