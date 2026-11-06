# LetMallow — SystemBot#Colin roadmap

**LM-AI05 · Owner-requested system agent · Updated 06/11/2026 · Planned**

**SystemBot#Colin** is the proposed system agent for scheduled updates across LetMallow. It covers the site's update needs through an explicit inventory of jobs, including the evidence and area profiles used by [AI-powered area information](ai-roadmap.md). It is a future product capability: this document creates no running agent, cron job, subscription or external scheduled task.

## Coverage and responsibilities

Maintain an inventory of everything that needs scheduled refresh, with an owner, source, purpose and appropriate cadence. Initial coverage should include:

- Area-guide amenities, civic/political facts, nature, transport/traffic, crime, utilities, living costs, income and employment data.
- Public search indexes, area summaries, approved help content, source/link health, geographic aliases/boundaries and dataset/licence metadata.
- Advert freshness/expiry reconciliation, operational health and permitted housekeeping. Enforce publication, expiry, withdrawal, authorisation and deletion rules at request/event time as well; a scheduled job is not a substitute for immediate access controls.
- Provider entitlement/quota changes, dependency/security advisories and research or policy sources that may require a product/documentation update. Route code changes through reviewed PRs; route legal/policy interpretation to the owner or appropriate reviewer rather than silently rewriting rules.
- Model/data evaluation refreshes and detection of material changes that invalidate existing AI answers.

“Covers everything” means each update need is accounted for, including jobs that must be event-driven, manually reviewed or unsupported. It does not grant the agent unrestricted authority over accounts, billing, publication, private records or code deployment.

## Requested schedule catalogue

Support every cadence requested by the owner. Jobs must store an exact interval or calendar rule, not an ambiguous display label. The meanings of **bi-hourly**, **bi-weekly** and **bi-monthly** remain unresolved until confirmed; do not silently choose a meaning or enable such a job.

| Requested label | Exact rule to record before activation |
| --- | --- |
| Bi-hourly | Confirm **every 30 minutes** (twice an hour) or **every 2 hours**. |
| Hourly | Every 1 hour. |
| Three-hourly | Every 3 hours. |
| Six-hourly | Every 6 hours. |
| 12-hourly | Every 12 hours. |
| Daily | Once per calendar day at a specified local time, or an explicitly selected fixed 24-hour interval. |
| Bi-weekly | Confirm **twice each week** on named weekdays or **every 14 days**. |
| Weekly | A named weekday and time, or an explicitly selected fixed 7-day interval. |
| Bi-monthly | Confirm **twice per calendar month** with two date rules or **every 2 calendar months**. |
| Monthly | A specified calendar day/time and a short-month/month-end rule. |
| Quarterly | Every 3 calendar months with a chosen anchor date/time. |
| Bi-annually | Twice per year / every 6 calendar months, with chosen anchor dates/times. |
| Annually | Each calendar year on a specified date/time, with a leap-day rule where relevant. |

Use **Europe/London** for calendar schedules and user-facing next-run times. Store execution timestamps in UTC. Distinguish elapsed-time intervals from calendar schedules across daylight-saving changes; define missed-run, duplicate-run, short-month and leap-year behaviour. Show dates as dd/mm/yyyy and times as hh:mm with the applicable timezone/offset.

Cadence is a per-job choice, not a requirement to run all jobs at every frequency. Assign it according to the source's publication pattern, user need, licence, quota and measured cost. No job assignments or specific execution times have yet been approved.

## Update workflow

1. Determine which enabled jobs are due. Acquire a lock and use a unique job/version/due-time key so overlapping workers or retries cannot publish twice.
2. Retrieve permitted changes from registered sources with timeouts, rate limits and bounded retries. Treat source content as untrusted data, not agent instructions; restrict fetch destinations and do not execute downloaded code.
3. Retain source snapshots and metadata. Check data periods, boundaries, units, completeness, licences and anomalous changes against the previous valid version.
4. Apply authorised deterministic transformations and, where justified, AI summaries grounded in the checked evidence. The agent must not invent a newer statistic when a source has not published one.
5. Automatically publish routine updates that pass approved checks. Hold source conflicts, unsupported summaries, unexpected statistical changes and consequential policy/code changes for review. Atomically version accepted output and invalidate the affected caches/search index.
6. Record the result, last successful check, actual source period and next due run. Keep the prior valid snapshot on failure, visibly mark stale content, and support correction/rollback without discarding evidence.

## Source-aware refresh policy

| Update type | Required behaviour |
| --- | --- |
| Traffic, public transport and outages | Use a verified live feed only where access, quota and cost allow. Otherwise show the time of the scheduled snapshot or a provider link; do not call cached observations live. |
| Crime | Look for the next published monthly release; repeat checks cannot create newer underlying data. Preserve anonymisation and coverage explanations. |
| Income, employment and living costs | Refresh when a relevant source release changes. Retain the reference period, statistical geography, measure definition and uncertainty. A recalculated household budget remains an estimate. |
| Amenities, nature, utilities and civic/political information | Check official/provider changes at an appropriate configured cadence. Verify boundaries and effective dates before replacing facts; preserve address-level availability limits. |
| Help, policies, licensing and dependencies | Detect change and prepare a review task or PR where interpretation/implementation is needed. A source update is not automatic permission to change product rules or deploy code. |

This is an initial allocation policy, not an activated timetable. The data limitations and primary references are in the [AI roadmap source register](ai-roadmap.md#primary-source-register).

## Controls, operations and cost

Each job record should include a stable ID, update category, source/connector, covered geography/content, exact schedule, timezone, version, enabled/paused state, owner/reviewer, freshness threshold, retry/catch-up policy, request/model budget and output destination. Keep sensitive credentials in server-side secret management.

Provide an authorised operator view to inspect last/next runs, failures, stale outputs and review queues; pause/resume jobs; request a bounded manual run; and inspect or roll back output versions. Record configuration changes and give the operator a global stop control. Do not publish secrets, private property evidence or support transcripts in logs.

Use bounded concurrency, backoff for failures/429s, circuit breakers and deduplication. After an outage, coalesce obsolete refreshes where appropriate rather than firing every missed poll. Some housekeeping/event jobs need different reconciliation semantics and must declare them explicitly.

Batch and cache shared area data, avoid generating unchanged summaries and prove scheduler/provider free entitlements before activation. Stop optional jobs before they incur new spend. A paid plan change, external message, new data-processing permission or stable deployment needs its own existing authorisation; SystemBot#Colin must not make such decisions autonomously.

## Delivery and acceptance

1. Create the inventory and schedule engine with disabled-by-default configuration and deterministic fixture jobs.
2. Prove every schedule rule using a synthetic clock, including the alternative meanings of unresolved “bi-” labels, London DST changes, short months and leap years.
3. Pilot a small number of approved source connectors and a shared Horfield area profile. Test unchanged data, new releases, invalid geography/units, missing data, source conflicts, schema changes, malicious source instructions and rollback.
4. Test timeout, quota exhaustion, retries, overlapping runs, restart/missed-run recovery, stop/pause controls, private-data isolation and cost caps. Verify that stale information is never relabelled as fresh.
5. Obtain explicit cadence choices and operational ownership, then enable only the reviewed jobs. Expand coverage as actual reliability and cost evidence allow.

No implementation completion, model integration, live update feed or active schedule is claimed by this roadmap.
