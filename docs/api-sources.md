# LetMallow — API discovery and candidate register

**Owner decision recorded 09/11/2026 · LM-R18 · Research and planned integration**

## Agreed discovery sources

Use the following repositories to find relevant free APIs for LetMallow. They are discovery catalogues; the providers' current documentation, licences and account entitlements determine whether an API can actually be used.

| Repository | Use within LetMallow | README snapshot reviewed |
| --- | --- | --- |
| [public-apis/public-apis](https://github.com/public-apis/public-apis) | Discover postcode, address/location, transport, amenities and other public-data APIs for LM-R16 and LM-AI04. | README blob `340599b11181467835c66b38581f066f9b1671e4`, retrieved 09/11/2026. |
| [IdoY12/awesome-free-ai-apis](https://github.com/IdoY12/awesome-free-ai-apis) | Discover recurring free inference and supporting AI services for LM-R17, approved help and evidence-grounded area summaries. | README blob `689db6db7f27a85ab8818cbfa8f22c03c94a6fc4`, retrieved 09/11/2026. |

Prefer recurring free allowances and permitted commercial use within the existing **£0 additional-spend limit**. A directory badge, a working documentation link or an existing chatbot subscription does not establish a LetMallow API entitlement. Keep the existing official statistical/local sources in the [AI roadmap](ai-roadmap.md#primary-source-register); these catalogues supplement them.

## Initial shortlist

The following entries were found in the selected catalogues and checked against the primary references below on **09/11/2026**. These are candidates for evaluation, not enabled integrations. No provider account, application key, authenticated model call or LetMallow-specific free allowance was verified.

| ID / delivery link | Candidate and intended use | Published access / cost evidence | Remaining fit and release checks |
| --- | --- | --- | --- |
| LM-API01 · LM-R16 / first data candidate | **Postcodes.io** — validate/normalise postcodes and obtain approximate coordinates and administrative geography. | Official documentation describes a free API with no authentication. Great Britain data have separate open-data licence terms from the MIT-licensed code. [P1] | Restrict listing geography to England/Wales, including their islands; preserve required attribution. Coordinates represent a postcode, not an exact dwelling. This does **not** fulfil the first-line/full-address selector, confirm a flat, prove authority to advertise or replace Google Maps confirmation. Test Welsh/island/new-build/missing/terminated records, boundary ambiguity, timeout and manual correction. |
| LM-API02 · LM-R16 / conditional location candidate | **Geoapify** — evaluate address autocomplete/geocoding and later amenity/places data. | Pricing lists **3,000 credits/day**, no card to start, and commercial production use on Free with attribution and feature/usage limits. [P2] | Verify actual premise/flat coverage and API-specific credit costs. Pricing describes soft quotas and the terms reserve suspension/overage rights; establish application caps and verified no-charge account settings before activation. The owner's **Google Maps** requirement remains: evaluate its own entitlement and cross-provider display/licence compatibility separately. No substitute map or billing activation is approved here. |
| LM-API03 · LM-AI04 / area-guide pilot | **data.police.uk** — monthly recorded-crime context for area guides. | Public JSON API; site data are published under Open Government Licence v3.0. [P3] | Preserve data month, actual force coverage, anonymisation, missing-data and methodology caveats. Cache shared area snapshots within provider limits. Do not label old data live, claim an exact property location from anonymised points, infer personal risk or turn area data into tenant scores. |
| LM-API04 · LM-R17 / first inference comparison | **Groq** — evaluate structured extraction of deliberately stated search criteria and approved-help answers. | Official documentation provides a Free Plan with model-specific request/token limits; account limits can differ. Paid Developer access is a separate upgrade requiring a payment method. [P4] | Verify the actual free account, selected model availability/licence, structured-output support, data terms and rate limits. Keep secrets server-side. Compare correctness, latency and measured quota use with the existing local interpreter using synthetic queries before selecting any model. No paid upgrade or automatic provider switching. |
| LM-API05 · LM-R17 / second inference comparison | **Cloudflare Workers AI** — compare an eligible free text model for the same bounded search task. | Workers Free includes **10,000 Neurons/day**; further operations fail at the free limit. Some models require a paid billing method and are excluded from this £0 comparison. [P5] | Verify actual account access, eligible model/licence, hosting integration and shared allowance. A Cloudflare-backed Site does not itself prove an available Workers AI binding or entitlement. Treat Neurons as compute units, not a fixed number of searches. No paid Workers plan or prepaid credits. |

The comparison order is a proposed implementation sequence, not a claim that one model is better. Keep provider and model choice open until the LM-R17 evaluation has evidence.

**Gemini status:** hold for public UK deployment rather than assuming it is a £0 production option. Retrieved Google Additional Terms include a Paid Services condition for API clients offered to UK users, while billing documentation also describes developer free-tier access. The direct terms URL redirected to a page unavailable to the research tool, so current deployment entitlement remains unresolved. Verify that condition and the current regional data terms before reconsidering; no billing account or paid service is authorised by this register. [P6]

## Delivery and acceptance

LM-R18 supplies the API/source decisions needed by existing work; it does not change the brand-kit, corrections, LM-R16 then LM-R17 sprint order.

1. **Before LM-R16 location integration:** verify Postcodes.io behaviour with synthetic/public sample locations; evaluate Geoapify's address coverage and Google's separate map entitlement. Record schema, attribution, quota, account plan and failure/manual-entry behaviour. Do not advertise verified premise-level coverage without evidence.
2. **During LM-R17:** compare Groq and an eligible Cloudflare model on the owner's multi-city BTR/balcony/parking query, follow-up corrections, Welsh/island locations, ambiguous budgets, missing features, malicious input, quota exhaustion and timeout. Validate returned structured criteria on the server. Models must not invent listings, relax hard requirements or replace the authoritative inventory query.
3. **During LM-AI04 and LM-AI05:** pilot Police.uk alongside the already registered official sources. Store source URL/licence, geography, data period, retrieval time, schema and last valid snapshot. Give each future Colin job an appropriate release-aware refresh rule; no schedule is activated here.

Keep external calls disabled until their capability has passed its existing implementation gates. Keys, account evidence and private processing details belong outside the public repository. Do not send private addresses/evidence, advert/enquiry text, contact details or affordability inputs to external inference services. Start model evaluation with synthetic data; any later real-data processing needs the documented privacy decision and permitted inputs.

Internal search must continue from explicit criteria and authorised LetMallow inventory when a model or source is unavailable. Preserve the conversational entry point, own-results priority and clearly labelled external search links. No selected catalogue grants permission to scrape housing platforms or treat a search link as a confirmed matching property.

## Primary references and verification limits

| Reference | Primary material checked on 09/11/2026 |
| --- | --- |
| P1 | Postcodes.io [overview](https://postcodes.io/docs/overview/) and [licences](https://postcodes.io/docs/licences/). Check the current upstream attribution text when integrating. |
| P2 | Geoapify [pricing and Free-plan FAQ](https://www.geoapify.com/pricing/) and [terms](https://www.geoapify.com/terms-and-conditions/). Published pricing is not a verified account-level spending cap. |
| P3 | Police.uk [API documentation](https://data.police.uk/docs/), [licence statement](https://data.police.uk/) and [methodology](https://data.police.uk/about/). |
| P4 | Groq [rate limits](https://console.groq.com/docs/rate-limits), [billing FAQs](https://console.groq.com/docs/billing-faqs) and [services agreement](https://console.groq.com/docs/legal/services-agreement). Model and account approval remain outstanding. |
| P5 | Cloudflare Workers AI [pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/), including the Free-plan cap and paid-method model exceptions. Exact model/data terms remain an implementation check. |
| P6 | Google [Additional Terms](https://ai.google.dev/gemini-api/terms?authuser=00) retrieved through official search, and [billing guidance](https://ai.google.dev/gemini-api/docs/billing). The direct terms fetch redirected and failed; current public-UK entitlement was not established. |

Verification in this update is documentary only. No provider endpoint response, address-coverage result, model evaluation, new connector, live deployment or active update job is claimed. Recheck provider facts at implementation and when terms, models or entitlements change; do not auto-enable services from catalogue updates.
