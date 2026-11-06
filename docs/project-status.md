# LetMallow — alpha project status

Updated: **06/11/2026**. This is a delivery checkpoint, not a stable-release approval.

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
