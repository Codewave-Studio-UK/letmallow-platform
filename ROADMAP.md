# LetMallow — future roadmap

**Working draft v0.1 · Updated 06/11/2026 · Codewave Studio**

This document records the direction of LetMallow beyond the current alpha. It is a prioritised backlog, not a promise of features or delivery dates. Existing work, unverified capabilities and proposed ideas are distinguished below. No roadmap item is marked complete by this first draft.

## Product outcome and agreed boundaries

Help real renters find relevant housing opportunities and help authorised advertisers receive genuine enquiries, starting with rooms, flatshares and whole homes in England and Wales, including their islands.

- Keep real enquiries free during alpha. Test commercial hypotheses separately from genuine housing access; do not collect rent or tenancy deposits through this alpha.
- Stay within £0 additional spend using existing resources or verified ongoing free entitlements. No paid services, domain purchases or free trials are assumed.
- Require human review before publishing adverts. Keep private evidence, personal details and secrets out of this public repository.
- Add AI where its usefulness, accuracy, privacy and cost can be demonstrated. Never score or rank people for housing or infer protected characteristics.
- Develop on feature branches from `dev`, with PRs into `dev`. Promotion to stable `main` requires a separate owner decision.

## Starting point

Repository checks on 06/11/2026 found that `main` and `dev` still contained the initial README. The full alpha source exists separately and needs synchronising. [PR #4](https://github.com/Codewave-Studio-UK/letmallow-platform/pull/4) proposes the LetMallow README rename and remains open at this check.

The project handover and recovered source describe search, moderated adverts, free enquiries, account controls and a separate payment simulator. This roadmap task has not revalidated those journeys in the deployed service. The handover's eight passing local tests are historical, fixture-based evidence; they do not establish live integrations or real user outcomes.

Neon connection and migration, authentic Stripe sandbox evidence, public visitor access and the first genuine advert/enquiry outcomes remain verification work. Reuse the existing Site, Netlify project named `letmallow` and feedback form; do not create replacements as part of roadmap delivery.

## Prioritised delivery

The IDs below are stable roadmap references. “Now” and “Next” express priority rather than fixed sprints. Account-dependent work may proceed in parallel where it does not compromise the working alpha.

| ID / priority | Increment | Evidence needed to complete it | Tracking |
| --- | --- | --- | --- |
| LM-R01 · Now | Establish a complete, reproducible source baseline. Recover and synchronise the existing implementation, reconcile the rename PR and document build, deployment and moderation setup. | Reviewed source-sync PR into `dev`; service tests and both application builds pass on the recovered source; actual deployment and visitor access are checked and their limits recorded. | [Rename PR #4](https://github.com/Codewave-Studio-UK/letmallow-platform/pull/4); source-sync issue to be created when selected. |
| LM-R02 · Now | Prove the first useful real rental journey. Check provider search routes and operate the reviewed first-party advert and free enquiry flow. | One authorised advertiser in England and one in Wales; a separate renter enquires for free, the advertiser replies and chooses whether to share contact, and both parties can remove their data. Include island and Welsh-name search checks. Publish only aggregate evidence. | [Alpha 1 · Issue #1](https://github.com/Codewave-Studio-UK/letmallow-platform/issues/1). |
| LM-R03 · Next | Connect Neon and rehearse the database change while preserving the working backend. | Actual account/free entitlement and data-handling decisions verified; synthetic migration reconciles records and permissions; backup/restore and rollback rehearsed; final cutover uses a write freeze and one authoritative writer. | [Alpha 2 · Issue #2](https://github.com/Codewave-Studio-UK/letmallow-platform/issues/2). |
| LM-R04 · Next | Prove Stripe sandbox fulfilment and test the commercial assumptions. | Authentic sandbox Checkout and verified server webhook; retry, replay, amount/currency mismatch and cancellation checks. Browser return pages cannot grant entitlements. Prices and paid benefits remain hypotheses; live charges stay disabled. | [Alpha 3 · Issue #3](https://github.com/Codewave-Studio-UK/letmallow-platform/issues/3). |
| LM-R05 · After alpha evidence | Prepare an owner-reviewed stable release. | Practical security, account-isolation, accessibility and mobile checks; working reporting, moderation, deletion and recovery procedures; current privacy/consumer documentation; known limits and rollback recorded. Owner accepts the release before promotion to `main`. | Proposed release checklist; no release date agreed. |

Genuine participant recruitment or contact requires explicit owner instructions. Synthetic records can verify software behaviour but cannot satisfy LM-R02's real-world outcome.

## Future candidates

These are proposals for discovery, not approved implementation work. Promote a small increment only after alpha feedback demonstrates a problem worth solving.

| ID | Candidate | Validation and dependencies before commitment |
| --- | --- | --- |
| LM-R06 | Better search coverage and freshness: more place aliases, clearer editable filters and handling for stale or unavailable adverts. | Observe failed searches and wrong destinations; check source links and actual inventory. Measure relevance without inventing availability or implying provider partnerships. |
| LM-R07 | Cross-device saved searches and optional alerts. | Confirm repeat-search demand; agree minimal stored preferences and removal rules. Verify delivery costs, consent and unsubscribe controls before enabling notifications. |
| LM-R08 | Advertiser management: clearer advert status, edits, renewal and eventual multi-advert tools. | Test the workflow with genuine advertisers. Preserve review, authority checks, expiry and auditability; agree any paid entitlement separately. |
| LM-R09 | Stronger moderation and support: report triage, case status and proportionate abuse controls. | Use pilot incidents and moderation workload to set priorities. Agree response ownership and private evidence handling; do not imply identity or property verification beyond actual checks. |
| LM-R10 | More useful AI search and advert-drafting assistance. | Compare against the existing local classifier/templates on held-out examples, including Welsh aliases and island locations. Keep suggestions editable and allow abstention. Any external model needs a separate cost/privacy decision; private advert or enquiry text is not approved for external processing. |
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
- Source baseline used: the project handover updated 06/11/2026 and the recovered `AGENTS.md`, `README.md` and `docs/alpha-specification.md`. Their descriptions of deployed behaviour require fresh checks; this roadmap does not claim legal clearance, production readiness or completed account integration.
