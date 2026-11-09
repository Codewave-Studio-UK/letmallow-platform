# LetMallow — future roadmap

**Working draft v0.5 · Updated 09/11/2026 · Codewave Studio**

This document records the direction of LetMallow beyond the current alpha. It is a prioritised backlog, not a promise of delivery dates. Existing work, owner-requested features and proposed ideas are distinguished below. The requested AI enhancements and SystemBot#Colin are planned, not implemented by this documentation update.

## Product outcome and agreed boundaries

Help real renters find relevant housing opportunities and help authorised advertisers receive genuine enquiries, starting with rooms, flatshares and whole homes in England and Wales, including their islands.

- Keep real enquiries free during alpha. Test commercial hypotheses separately from genuine housing access; do not collect rent or tenancy deposits through this alpha.
- Stay within £0 additional spend using existing resources or verified ongoing free entitlements. No paid services, domain purchases or free trials are assumed.
- Require human review before publishing adverts. Keep private evidence, personal details and secrets out of this public repository.
- Add AI where its usefulness, accuracy, privacy and cost can be demonstrated. Never score or rank people for housing or infer protected characteristics.
- Develop on feature branches from `dev`, with PRs into `dev`. Promotion to stable `main` requires a separate owner decision.

## Starting point

The initial source-sync gap has been closed on `dev`: [rename PR #4](https://github.com/Codewave-Studio-UK/letmallow-platform/pull/4) and [source-import PR #6](https://github.com/Codewave-Studio-UK/letmallow-platform/pull/6) are merged. `main` still contains the initial README at the 06/11/2026 check; stable promotion remains a separate decision.

The imported source includes basic search, moderated adverts, free enquiries, account controls and a separate payment simulator. Source-import PR #6 records eight local tests and both builds passing. The later, open [resilience PR #7](https://github.com/Codewave-Studio-UK/letmallow-platform/pull/7) records 12 tests, both builds and publication/HTTP checks for Site version 2. These are dated delivery records, not new runtime checks by this roadmap update, and do not establish real participant outcomes or all account integrations.

Neon connection and migration, authentic Stripe sandbox evidence, full browser/authenticated journeys and the first genuine advert/enquiry outcomes remain verification work. PR #7 also records an unresolved Netlify metadata/visitor-access discrepancy. Reuse the existing Site, Netlify project named `letmallow` and feedback form; do not create replacements as part of roadmap delivery.

## Prioritised delivery

The IDs below are stable roadmap references. “Now” and “Next” express priority rather than fixed sprints. Account-dependent work may proceed in parallel where it does not compromise the working alpha.

| ID / priority | Increment | Evidence needed to complete it | Tracking |
| --- | --- | --- | --- |
| LM-R01 · Now | Maintain the imported source baseline and finish practical deployment/access verification. Keep build, deployment and moderation setup reproducible. | Source import is delivered; retain passing service/build evidence and complete the outstanding runtime, browser and authenticated checks with their limits recorded. | Merged [PR #4](https://github.com/Codewave-Studio-UK/letmallow-platform/pull/4) and [PR #6](https://github.com/Codewave-Studio-UK/letmallow-platform/pull/6); follow-up [PR #7](https://github.com/Codewave-Studio-UK/letmallow-platform/pull/7). |
| LM-R02 · Now | Prove the first useful real rental journey. Check provider search routes and operate the reviewed first-party advert and free enquiry flow. | One authorised advertiser in England and one in Wales; a separate renter enquires for free, the advertiser replies and chooses whether to share contact, and both parties can remove their data. Include island and Welsh-name search checks. Publish only aggregate evidence. | [Alpha 1 · Issue #1](https://github.com/Codewave-Studio-UK/letmallow-platform/issues/1). |
| LM-R03 · Next | Connect Neon and rehearse the database change while preserving the working backend. | Actual account/free entitlement and data-handling decisions verified; synthetic migration reconciles records and permissions; backup/restore and rollback rehearsed; final cutover uses a write freeze and one authoritative writer. | [Alpha 2 · Issue #2](https://github.com/Codewave-Studio-UK/letmallow-platform/issues/2). |
| LM-R04 · Next | Prove Stripe sandbox fulfilment and test the commercial assumptions. | Authentic sandbox Checkout and verified server webhook; retry, replay, amount/currency mismatch and cancellation checks. Browser return pages cannot grant entitlements. Prices and paid benefits remain hypotheses; live charges stay disabled. | [Alpha 3 · Issue #3](https://github.com/Codewave-Studio-UK/letmallow-platform/issues/3). |
| LM-R05 · After alpha evidence | Prepare an owner-reviewed stable release. | Practical security, account-isolation, accessibility and mobile checks; working reporting, moderation, deletion and recovery procedures; current privacy/consumer documentation; known limits and rollback recorded. Owner accepts the release before promotion to `main`. | Proposed release checklist; no release date agreed. |

Genuine participant recruitment or contact requires explicit owner instructions. Synthetic records can verify software behaviour but cannot satisfy LM-R02's real-world outcome.

## Owner-directed next alpha increments

The following requirements were added by the owner on **06/11/2026**. The next alpha MVP version should apply the temporary brand kit and design system once supplied; minor changes, improvements and corrections should ideally follow in the next sprint. This is the current sprint preference alongside the existing alpha acceptance work. No sprint dates, duration or release number are assumed.

| ID / intended timing | Requirement and current state | Dependencies and completion evidence |
| --- | --- | --- |
| LM-R13 · Next alpha MVP / brand kit sprint | The owner is creating a **temporary LetMallow brand kit and design system**. Apply the supplied kit to the next alpha version. Its scope covers the website, future apps, email newsletters/campaigns and other brand communications. | Await the kit/assets and usage guidance. Implement shared design tokens, components and documented channel-specific patterns so future surfaces use the same identity. Check the applied website across responsive layouts, keyboard use, focus, contrast and forms; run affected builds/checks. Version the temporary system so it can be replaced or refined later. No supplied kit or completed application is claimed yet. |
| LM-R14 · When prototype source is available | The owner is building an **AI-powered rent affordability calculator prototype for renters in Claude**. Once it is pushed to the repository, ChatGPT can review and integrate the actual implementation. | Integrate as a **webpage** when the prototype source is ready. Integrate as a **widget when the widget has been built**, and as an **API when the API has been built**. Treat these as three separate delivery surfaces with their own readiness checks; no widget, API, contract or repo path is assumed to exist. |
| LM-R15 · Ideally the sprint after the brand kit sprint | Make **minor changes, improvements and corrections** drawn from the owner's feedback and observed alpha issues. The detailed item list is still to be supplied/triaged. | Maintain a scoped backlog with a concrete expected result for each selected item. Verify the affected journeys and record the changes in the next alpha release notes. Address critical defects when identified; the preferred follow-up sprint is not a reason to defer an urgent fix. |

**Calculator integration checks:** inspect the pushed source, licence/dependencies, inputs, calculations, AI behaviour, assumptions, data handling and actual runtime requirements before choosing the integration approach. Check calculations against worked examples, make assumptions/results editable or explainable as appropriate, and protect renter-entered financial information. Keep this a renter self-assessment tool with no automatic tenant scoring or eligibility decisions. Apply the existing £0 constraint; neither a calculation formula, affordability threshold nor permission to send financial inputs to an external model is established by this roadmap entry.

The calculator's integration timing depends on source and surface readiness; it is not automatically a prerequisite for the brand kit release or the following corrections sprint. Creating new apps, running email campaigns and integrating unbuilt widget/API surfaces are future work beyond applying the supplied design system to the next website alpha.

## Dedicated advert and search sprints

**Owner feedback added 09/11/2026 · Planning only.** The owner is viewing the alpha on a **Samsung Galaxy phone in Chrome**. Use that environment for acceptance checks; record the actual model, Android/Chrome versions and viewport during testing. No physical-device check is claimed by this roadmap update.

Keep the existing next-alpha brand kit sprint (LM-R13), then ideally its corrections sprint (LM-R15). Schedule the following as **two separate dedicated feature sprints**, with advert creation first because structured property and cost data are dependencies of reliable search. Discovery and query evaluation can start earlier. Existing access, moderation and genuine-journey gates remain active; triage incorrect costs, misleading source presentation or broken mobile journeys promptly rather than waiting for a feature sprint. Dates, duration and capacity have not been agreed.

| ID / feature priority | Sprint goal | Dependencies / completion evidence |
| --- | --- | --- |
| LM-R16 · P1 / first dedicated feature sprint | Separate landlord and renter advert journeys, with structured property, address and rental-cost data. | Deliver the two paths and the acceptance checks below. Reconcile existing adverts through an additive migration; preserve review, expiry, deletion and free enquiries. Feed the structured fields into LM-R17. |
| LM-R17 · P2 / second dedicated feature sprint | Context-aware, intuitive conversational AI search, prioritising LetMallow's own matching listings and using external discovery as a fallback. | Depends on LM-R16's searchable fields and cost contract, an authorised source catalogue and a verified £0 inference approach. Evaluate the owner's multi-city BTR query, corrections, source hierarchy and failure states. Full behaviour is specified in [LM-AI01](docs/ai-roadmap.md#lm-ai01--ai-powered-sitewide-search). |

### LM-R16 — Separate landlord and renter advert creation

Start **Create an ad** with an explicit choice: **I have a place to rent out** or **I am looking for a place**. Keep the paths distinct even when the same account uses both roles. Both need clear steps, saved drafts, validation, preview, submission, review status and edit/withdrawal. The renter path creates a wanted advert and must not require a property address, landlord authority evidence or rent being charged. Proposed renter fields for sprint discovery are desired areas, home type, budget and period, preferred payment frequency, move-in window and must-haves; agree the final renter questions without requesting public benefit or health evidence.

| Landlord requirement | Planned behaviour |
| --- | --- |
| Weekly rent and collection frequency | Require **weekly base rent in £**, and a choice of **per calendar month** or **every four weeks** for payment collection. Preview the contractual amount before submission. Keep the source amount, period, collection frequency and calculation rule explicit. |
| Viewer settings | Let viewers set a budget/display basis of **per calendar month or per week**, independently of a payment preference of **calendar monthly or four-weekly**. Show the equivalent in their chosen unit plus the landlord's actual collection amount/frequency and any preference mismatch. Changing the viewer's preference never changes the landlord's terms or asserts an alternative is accepted. |
| Itemised costs | Require separate **base rent, mandatory service charges, optional service charges and bills**. Record each named item's amount, period, whether included in the advertised total, and whether fixed, estimated, variable or unknown. Allow an explicit zero/no-charge answer. Identify which bills are included, partly included or excluded, any cap/fair-use terms, and who pays excluded bills. Reconcile components to the advertised total without double counting included items. Show the inclusion statement on the result card and an expandable breakdown on the advert; show required recurring totals separately from optional costs and one-off deposits. |
| Public advert link | Remove the external/public-advert-link input from the landlord form; an advertiser must be able to create a complete LetMallow advert without a link to another platform. Retain LetMallow's generated advert permalink and any separate, private moderation evidence route. |
| Structured rental details | Replace reliance on one large description box with labelled sections and conditional questions. Cover room/flatshare/whole home; property type and BTR (build to rent) status; bedrooms/bathrooms; furnished status; availability; minimum/maximum term; household/shared facilities; floor/lift and factual accessibility details; balcony/outdoor space; parking availability, allocation and cost; pets/smoking terms; heating and connectivity; EPC, council tax and applicable tenancy/licence/registration information. Keep a final **Description / anything else** text field for a human description and details the structured sections miss. Use unknown/not applicable where appropriate and validate legal/material-information questions for England and Wales at implementation. |
| Address entry and selection | Instruct: **Enter the postcode and first line of the address, then select the correct address.** Show an accessible drop-down of matching addresses, including flat/unit identifiers. Confirm the selected full address and an accompanying **Google Maps** preview/pin so the landlord can check the location and correct a mismatch. Check England/Wales scope separately; a UK-wide suggestion alone is insufficient. |
| Address gaps and privacy | Support missing/new-build/rural/Welsh/island addresses and a manual-entry route when lookup fails, with review before publication. Keep the full address/private evidence separate from the location detail approved for public display. A map pin or address suggestion is not proof of ownership or authority to let. Google Maps display, address lookup and address validation are separate capabilities; verify coverage, licensing, key restrictions, account entitlements and quotas before choosing the integration. Retain the requested Google Maps requirement if it cannot yet meet £0; record the dependency rather than substituting an unapproved paid service. |

**Rent comparison contract:** for an ordinary 52-week comparison, weekly amount × 52 ÷ 12 gives the calendar-monthly equivalent; weekly amount × 4 gives a four-weekly amount. Conversely, calendar-monthly × 12 ÷ 52 gives the weekly equivalent. A four-weekly amount is not a calendar-monthly amount. Preserve exact amounts/decimal precision and round displayed currency consistently to pennies at the final step; test round-trip and total reconciliation. For example, **£300/week = £1,300/calendar month = £1,200/every four weeks**. Separate these comparisons from contractual payment dates, part-period calculations and any rent-free weeks; do not treat four weeks as a month.

**Address implementation evidence:** [Google's address-form documentation](https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform), checked 09/11/2026, demonstrates address selection and component handling, with separate validation and request-cost considerations. It does not establish complete UK address coverage or an available free entitlement for LetMallow. Verify the selected mapping and address-lookup services during this sprint.

**Benefit-related purpose:** make the breakdown understandable to people receiving **Housing Benefit or Universal Credit housing costs**, without requiring them to disclose a claim. Mandatory does not itself mean benefit-eligible, and an itemised advert is not a benefit decision or a guarantee of payment. Do not add service charges on top of an LHA limit or reuse social-sector eligibility rules as a universal private-sector rule. Any later benefit calculation needs separate, current, jurisdiction- and accommodation-specific verification. [DWP landlord guidance](https://www.gov.uk/government/publications/universal-credit-and-landlords/universal-credit-and-rented-housing-guide-for-landlords) was checked on 09/11/2026 for rent-period calculations and the distinction between private and social renting.

**Acceptance for LM-R16:** test each role from entry to preview/submission and edit/withdrawal; weekly/calendar-monthly/four-weekly conversions; mismatched viewer payment preferences; mandatory/optional/included/excluded/unknown costs; no double counting; structured details and free description; no external advert URL requirement; correct address/flat selection, map mismatch and lookup outage; private-address protection; and migration of legacy adverts with missing fields marked unknown. Verify API validation as well as the form. On Galaxy/Chrome check on-screen keyboard overlap, numeric input, drop-down selection, map scrolling, back navigation, draft recovery, validation/focus and no horizontal overflow. Record emulated and physical-device evidence separately.

### LM-R17 — Conversational AI search

Use the owner's acceptance query: **“I'm looking for a two-bed BTR apartment with a balcony in Oxford, London, Manchester, or Leeds, costing up to £1,500 a month. I need parking with it.”** Extract the four places as alternatives, two bedrooms, apartment/BTR, balcony, the stated budget/period and parking. Resolve whether parking is required to be included in the budget and whether “month” means a calendar month when not established by user settings; ask a short clarification for material ambiguity. Do not invent matching inventory or silently treat unknown BTR/balcony/parking data as a match.

Replace the traditional search-plus-filter-panel journey with natural-language entry, a concise readable summary of the understood requirements and conversational corrections. Keep essential controls accessible and usable without generative inference. Distinguish requirements deliberately stated by the user from any additional optional AI suggestions; automatic inference beyond explicit instructions remains off by default under LM-AI02.

**Supply rule:** keep external discovery while LetMallow builds its own inventory, without making core search depend on another platform. Search published, current, relevant LetMallow adverts first. With matching own listings, show those as the primary results and external options in a smaller, clearly separated, lower-emphasis section. With no matching own listings, state that clearly and give external discovery greater prominence. Decide this **per query**, not simply because any advert exists in the database or an undefined site-wide “plenty” threshold is reached. External failure must not break internal search. Provider search links must be labelled as links to search elsewhere, never presented as confirmed matching properties. Keep unapproved scraping, invented results and implied partnerships out of scope.

**Context and acceptance:** remember the current conversation's locations, hard requirements, explicit corrections, budget period and chosen display/payment preferences; support “Leeds only”, “increase to £1,600” and “parking must be included” without losing other requirements. Let users inspect, correct and reset context, and opt in before saving it across sessions. Ask focused questions, explain unavailable data, and propose relaxations without applying them silently. Test the multi-city query, zero/some own matches, irrelevant/pending/expired listings, unknown features/costs, third-party outage, model outage, context reset, permission boundaries and mobile recovery. See [the AI roadmap](docs/ai-roadmap.md) for the source hierarchy and evaluation requirements.

**Decisions to resolve during sprint discovery:** the meaning of an unqualified budget (base rent, required recurring total or all-in costs), the final renter-advert questions and the cost/coverage evidence for Google Maps plus address lookup. Make budget scope visible and clarify it when missing; do not guess that excluded bills or parking fit inside a stated maximum. These open implementation choices do not block recording the two sprints.

## API discovery and provider selection

**Owner decision added 09/11/2026.** Use [public-apis/public-apis](https://github.com/public-apis/public-apis) and [IdoY12/awesome-free-ai-apis](https://github.com/IdoY12/awesome-free-ai-apis) as LetMallow's preferred API discovery repositories. Provider documentation, licences and actual account entitlements remain the authority for permitted use and cost.

| ID / intended timing | Requirement | Completion evidence |
| --- | --- | --- |
| LM-R18 · Discovery dependency for LM-R16, LM-R17 and area guides | Maintain the [API candidate/source register](docs/api-sources.md). Evaluate postcode/address/location and public-area sources from the first repository, and recurring free inference candidates from the second. | Prove commercial-use/licence fit, England/Wales coverage where applicable, actual free entitlement, bounded quotas, permitted inputs and outage/manual-correction behaviour. Record live checks separately from documentary or synthetic checks. Select a provider/model only after the relevant sprint evaluation. |

The initial register shortlists Postcodes.io, conditional Geoapify location services, Police.uk, and a Groq/Cloudflare Workers AI comparison. Its entries are planned candidates, not completed integrations. Keep the existing sprint order and £0 additional-spend limit; this decision activates no provider account, billing, model call or Colin schedule.

## Owner-requested AI programme

**LM-R10 — confirmed feature direction, requested 06/11/2026.** The owner has requested the following capabilities. This expands the earlier search/drafting candidate into a defined AI programme; delivery still depends on source quality, evaluation, privacy and the £0 budget. The basic local classifier and template helper do not fulfil this programme.

| Reference | Required capability | Key behaviour |
| --- | --- | --- |
| LM-AI01 | AI-powered sitewide search / LM-R17 | Conversational, context-aware search of authorised content; relevant own listings first, external discovery secondary or prominent when no own matches. Replace the traditional search/filter-panel journey. |
| LM-AI02 | Optional AI preference suggestions | Additional inferred preferences stay off by default; explicit opt-in, visible editable criteria and conversational overrides replace reliance on a traditional filter panel. |
| LM-AI03 | AI-powered customer service | Answer from approved support information, explain uncertainty and provide a working human escalation route. |
| LM-AI04 | AI-powered area information | A listing-page guide to the property's area and verified nearby areas, covering amenities, civic/political facts, nature, transport/traffic, crime, utilities, living costs, income and employment. |
| LM-AI05 | SystemBot#Colin updates agent | Maintain a system-wide update inventory and refresh jobs on the owner's requested cadences, including area-guide data. |

See the [AI feature roadmap](docs/ai-roadmap.md) and [SystemBot#Colin roadmap](docs/systembot-colin-roadmap.md) for acceptance criteria, the Horfield example, source checks and schedule definitions. No scheduled jobs or external AI integrations are activated by these documents.

## Future candidates

These are proposals for discovery, not approved implementation work. Promote a small increment only after alpha feedback demonstrates a problem worth solving.

| ID | Candidate | Validation and dependencies before commitment |
| --- | --- | --- |
| LM-R06 | Ongoing search coverage and freshness after LM-R17: more place aliases and handling for stale or unavailable adverts. | Use failed-query evidence to improve the conversational search backlog; implementation belongs to LM-R17 rather than a duplicate filter-panel sprint. Check source links and inventory without inventing availability or partnerships. |
| LM-R07 | Cross-device saved searches and optional alerts. | Confirm repeat-search demand; agree minimal stored preferences and removal rules. Verify delivery costs, consent and unsubscribe controls before enabling notifications. |
| LM-R08 | Advertiser management: clearer advert status, edits, renewal and eventual multi-advert tools. | Test the workflow with genuine advertisers. Preserve review, authority checks, expiry and auditability; agree any paid entitlement separately. |
| LM-R09 | Stronger moderation and support: report triage, case status and proportionate abuse controls. | Use pilot incidents and moderation workload to set priorities. Agree response ownership and private evidence handling; do not imply identity or property verification beyond actual checks. |
| LM-R11 | Sustainable premium features for advertisers and renters. | Interview both roles and test willingness to pay. Explore additional advertiser slots, richer tools and aggregate analytics; explore renter convenience or wanted-advert benefits. Verify current requirements separately for England and Wales and approve pricing, cancellation and refunds before live money. |
| LM-R12 | Commercial brand readiness and possible wider coverage. | Refresh LetMallow trade mark/domain/handle checks before commercial commitments. Wider geography, paid domains and new tenancy/payment activities each require a separate owner decision; the current scope remains England and Wales. |

The original commercial hypothesis included limited renter responses and paid access to more adverts, alongside advertiser upgrades. That hypothesis remains visible for research; it is not permission to restrict real alpha enquiries. The simulator's £6 renter pass, £12 advertiser pass and £3 additional advert are test settings, not approved commercial prices.

## Evidence and review

Establish a baseline before setting numerical targets. Track only what can be observed, using aggregate records and minimal personal data:

- Time to reach a relevant search result; distinguish an external-provider visit from a first-party enquiry.
- Approved genuine adverts, genuine enquiries and replies. Record viewings or tenancies only when participants confirm them.
- Search failures, stale links, moderation turnaround, reports and successful data removal.
- Actual running costs and provider limits, together with build, access and recovery evidence.

Review this roadmap after each accepted increment. Add new ideas as candidates, link an issue when work is selected and record why priorities change. Mark completion only with dated evidence and a merged PR or other appropriate acceptance record. Keep existing issues as the delivery source of truth and avoid duplicate backlog entries.

## Project references

- [Canonical repository](https://github.com/Codewave-Studio-UK/letmallow-platform).
- [Existing delivery issues](https://github.com/Codewave-Studio-UK/letmallow-platform/issues).
- [Existing feedback and reports form](https://tally.so/r/8NzzzY).
- Source baseline used: current `dev` guidance, README, alpha specification and project-status document; PRs #4, #6 and #7; the owner's AI, SystemBot#Colin, temporary brand kit, calculator and follow-up sprint requirements of 06/11/2026, and the Galaxy/Chrome search and advert-flow feedback of 09/11/2026. The shared conversation URL could not be fetched in this run; current repository documents and the owner's supplied requirements ground this update. This roadmap does not claim legal clearance, production readiness or completed account integration.
