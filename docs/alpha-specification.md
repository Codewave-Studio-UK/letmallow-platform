# LetMallow alpha · product and delivery specification

**05/11/2026 · product baseline 0.1 · Codewave Studio.** The first outcome is a real renter reaching relevant housing adverts while the studio builds a supply of owner-authorised listings. A successful search is observable when a tester selects the intended location and home type and reaches a provider or an approved community advert. A booking, viewing or successful tenancy is a separate outcome and must be evidenced by the participants.

## Product decisions and evidence

| ID | Requirement and acceptance | State |
| --- | --- | --- |
| R01 | Visitors browse England and Wales without an account. Include islands and Welsh place aliases. Each destination identifies the provider. Do not reproduce, scrape, imply partnerships or invent supply, count, rent or availability. | Six curated destinations plus nationwide provider search forms for other towns/islands. |
| R02 | A signed-in advertiser can hold one active or pending free home advert. A renter can have one wanted advert. Each expires 30 days after submission. Competing inserts and retries must not defeat the limit. | Database constraint, publication filtering and withdrawal. |
| R03 | Staff check permission to advertise, material terms and applicable licensing before publication. Public responses exclude proof URLs and identifiers. An unapproved or expired advert cannot receive an enquiry. | Reviewer-only API and queue; a real owner must operate it. |
| R04 | A signed-in renter can enquire without paying. The advertiser replies privately and may expressly share their contact address. A participant can withdraw an advert or erase their records. | Ownership checks, scoped inboxes, fixed-choice messages and cascaded removal. |
| R05 | Both roles can test free and paid limits. Proposed renter pass £6 per 30 days moves three responses to 30, allows early access to test ads and raises wanted slots from one to three. Proposed landlord pass £12 moves one slot to five and gives test analytics; extra advert £3. | Hypotheses in separate simulator. Prices and entitlements are not approved commercial offers. The thank-you page cannot award a test pass. |
| R06 | Natural-language search proposes editable place, type and budget. It may abstain. Never rank, screen or select tenants, infer protected attributes or send advert/enquiry text to an AI provider. | Local trained classifier and explicit parsing. Advert drafting templates use only user-entered fields. |
| R07 | £0 additional spend. Keep one authoritative writer and never switch data stores on a failing request. Escalate any chargeable dependency before it is enabled. | Free alpha and frontend without paid inference. Neon and Stripe are separate connection gates. |
| R08 | Ship small increments on feature branches; use dev integration, checks and published evidence. Preserve stable main until the owner accepts the production gates. | GitHub issues 1–3 and review branch. |

## Adaptation of the studio’s Terry baseline

| Terry specification | Rental equivalent |
| --- | --- |
| DOC-01 · Engineering and AI coding | Small reversible changes, reproducible commands, independent source checks, explicit assumptions and a tested branch. Never include user data in diagnostics. |
| DOC-02 · Architecture | Public search separate from marketplace writes; one authenticated account service and one authoritative database. Netlify can serve the standalone public front end. |
| DOC-03 · Security and privacy | Authenticated identity on Sites only, least-privilege review, same-origin JSON writes, bounded bodies, parameterised SQL, deliberate contact sharing, retention and removal. |
| DOC-04 · Functional experience | Anonymous search and saving, review-before-publication for supply, inbox and withdrawal. Accessible native controls and dialog, UK copy, GBP, London dates, responsive light design. |
| DOC-05 · Data and interfaces | Adverts, enquiries, test orders and grants. Public JSON is an explicit field allowlist. Immutable migrations, uniqueness, conflict statuses and owner deletion. |
| DOC-06 · AI behaviour | Small supervised multinomial Naive Bayes home-type classifier trained on fixture phrases. Place aliases and budget parsing are deterministic. A user can override the result. No external model keys or calls. |
| DOC-07 · Verification | Repeatable SQLite service tests plus actual browser checks and negative cases. Test outcomes below are distinct from sales, product-market fit or supplier approval. |
| DOC-08 · Operations | Separate deploy paths, server-only secrets, migration rehearsal, report handling, withdrawal, rollback and release gates. A backup/restore exercise is required before expanding data collection. |

## Sprints, implementation and release checks

1. **Alpha 0 – evidence and discovery.** Screen names and obtain asset licences. Test the legal assumption that every renter contact can be sold. Choose a free live contact route and test commercial hypotheses separately.
2. **Alpha 1 – first useful journey.** Verify genuine provider searches. Test listings, expiry, authorisation, moderation and enquiry ownership with synthetic records. Recruit consenting landlords in each nation, including an island case, and obtain first live supply. Track qualitative feedback and aggregate outcomes without site-wide trackers.
3. **Alpha 2 – account integrations.** Prove Neon Free, source and destination reconciliation and a restore drill. Exercise an authentic Stripe test Checkout, verified webhook, idempotency, refunds/expiry decisions and tier UX. Collect no card details directly.
4. **Release decision.** Optional real charges need jurisdiction-specific legal and consumer review, supplier/data-transfer approval and an operational refund/cancellation route. Agree abuse response coverage, deletion schedules and accessibility testing. Only then release a stable version.

| Check | What counts as evidence |
| --- | --- |
| Isolation and data integrity | `node --test tests/*.test.mjs` exercises pending visibility, duplicate offers, 30-day expiry, blocked origins, invalid authority/fees, protected moderation, account separation and deletion. |
| Billing | Signed synthetic events cover test-only keys, amounts, freshness and replay; a real provider sandbox event remains an open account proof. |
| AI | Held-out paraphrases, weekly-to-monthly conversion, Welsh place alias and unsupported intent covered. The small fixture set does not establish population accuracy. |
| Operations | Check actual output of both builds, smoke-test the published search and compare database table presence. Rehearse restore with synthetic data before any Neon cutover. |
| Outcome | Time from first visit to opening a relevant source, first approved advert, first real reply or viewing. Report these only if observed; there is no seeded production demand or supply. |

## Sources and legal boundaries

The Accommodation Agencies Act 1953 restricts certain payments from people seeking accommodation and the unauthorised advertisement of property. Its original expiry provision was removed. A competitor's pricing does not establish that this platform may charge for equivalent contact. Whether a digital service qualifies as pure advertising is fact-specific. The pilot keeps real enquiries free and never intermediates rent or deposits. [1953 Act](https://www.legislation.gov.uk/ukpga/Eliz2/1-2/23) · [1969 Act](https://www.legislation.gov.uk/ukpga/1969/61/section/1) · [Shelter guidance](https://england.shelter.org.uk/professional_resources/legal/costs_of_renting/tenant_fees_and_other_costs/letting_agency_services_charges_and_regulation)

In England, permitted payments and the changes to advertising and rent bidding require a fixed asking rent for covered adverts. Wales has its own fees and licensing regime. Publication and direct contact can fall outside the Welsh definition of lettings work subject to the other activities undertaken. Screen registration/licensing or a genuine exemption, including the different position of some resident landlords. Confirm facts about the particular property privately before approving it. [England fees](https://www.gov.uk/guidance/fees-you-can-charge-as-part-of-a-tenancy) · [English advertising and bidding rules](https://www.gov.uk/government/publications/rental-bidding-a-guide-for-local-authorities-and-councils/rental-bidding-a-guide-for-local-authorities-and-councils) · [Housing (Wales) Act 2014, s.10](https://www.legislation.gov.uk/anaw/2014/7/section/10) · [Welsh fees, s.8](https://www.legislation.gov.uk/anaw/2019/2/section/8) · [Rent Smart Wales](https://rentsmart.gov.wales/en/landlord/landlord-registration/)

The brand and asset registers document dated checks. LetMallow uses original navigation, copy, iconography and searchable community records. Search links lead visitors to the publisher. The Crown Dependencies and the other UK nations are outside the alpha’s listing territory. [SpareRoom](https://www.spareroom.co.uk/) · [Spotrental](https://spotrental.co.uk/) · [UK IPO search](https://www.gov.uk/search-for-trademark) · [Photograph licence](https://www.pexels.com/license/)

Free plans and test environments have limits. Netlify Free has a credit cap. Verify Neon account region, quota and the active plan before migration. Tally feedback is processed on Tally under its fair-use conditions. Stripe sandbox transactions do not move funds. Remove or pause optional integrations before incurring any new charge. [Netlify](https://www.netlify.com/pricing/) · [Neon](https://neon.com/pricing) · [Tally](https://tally.so/pricing) · [Stripe testing](https://docs.stripe.com/testing) · [Stripe fulfilment](https://docs.stripe.com/checkout/fulfillment)

## Increment on 06/11/2026

[Current observations, verification and open gates](alpha-increment-2026-11-06.md). The client separates account checks from advert loading, bounds API waits and distinguishes loading, unavailable and empty results. It never automatically retries a write after a timeout. Database selection rejects unknown backend names and never substitutes D1 for a failed Neon request. The default remains the existing D1 writer; no migration is included.
