# LetMallow — AI feature roadmap

**Owner-requested scope · Updated 09/11/2026 · Planned, not yet implemented**

Part of [LM-R10 in the future roadmap](../ROADMAP.md). The owner requested AI-powered sitewide search, optional auto-filtering, customer service and listing-page area information. The 09/11/2026 search feedback is scheduled as LM-R17 and updates the auto-filter presentation to optional preference suggestions within conversational search. Area information must receive automatic source updates from the future system agent, **SystemBot#Colin**.

The current small browser-based home-type classifier and advert templates are a starting point. They do not provide sitewide semantic search, generative customer service or sourced area guides. Model/provider selection and release dates remain open; no inference entitlement, source API or ongoing free allowance is assumed.

## LM-AI01 — AI-powered sitewide search

**Own dedicated sprint: [LM-R17](../ROADMAP.md#lm-r17--conversational-ai-search), also referenced as LM-AI01.** The current roadmap sequence places the separate landlord (LM-R16), renter (LM-R19) and compatibility/buddy-up (LM-R20) sprints before search; LM-R20 is its own feature rather than an implementation task in search. Property search uses LM-R16's data contract; wanted-content search also uses LM-R19's. LM-R17 does not include delivery of optional preference suggestions, customer service, area guides or SystemBot#Colin. The owner's 09/11/2026 direction replaces the earlier conventional-search/filter fallback: use one conversational search experience, visible interpreted requirements and direct corrections. Do not reinstate a separate traditional filter-panel journey to satisfy an older roadmap clause.

- Search published adverts, appropriately public wanted adverts, area guides, approved help/policy content and navigation. Match meaning and synonyms, Welsh aliases and islands. Distinguish property offers from wanted adverts; a wanted advert cannot count as an available home.
- Parse the owner's two-bedroom BTR apartment/balcony/parking example across **Oxford OR London OR Manchester OR Leeds**, with a **£1,500/month maximum**. Preserve the stated budget period and hard requirements. Ask about material ambiguity, including budget inclusions and parking costs; do not infer a precise location, all-in budget or feature availability without evidence.
- Search **LetMallow's own relevant published inventory first**. With own matches, use the primary results area for those adverts; put third-party discovery in a separately labelled, lower-emphasis section. With zero own matches, explain the absence and make external discovery prominent. Apply this per query and current availability, not a global listing-count threshold. Keep external discovery while own supply grows without requiring another platform for internal search.
- Distinguish actual authorised third-party listing data from an outbound **Search on [provider]** link. A provider search link does not establish a matching home, result count, rent or availability. Never scrape or imply a partnership without permission. An unrelated own advert must not displace relevant fallback information or be presented as a match.
- Maintain **context from deliberate input**: selected areas, property type, budget scope/period, payment/display preferences and prior corrections. “Leeds only” changes location; “increase to £1,600” changes budget; both retain the other requirements. Show a readable requirement summary with simple correction/reset actions. Ask short questions only when an answer changes the result.
- Use session context by default. Saving conversation/preferences across sessions is opt-in and removable. Do not infer benefit status, income, politics, health or protected characteristics from housing requests. Enforce permissions before retrieval or generation; exclude private addresses/evidence, pending/withdrawn/expired adverts, inboxes and other users' account data. Any own-account search remains separately authenticated.
- Rank against explicit housing requirements and verified listing fields. Unknown BTR, balcony, parking or cost data remain unknown, not a satisfied requirement. Explain partial matches separately and offer relaxations without applying them. Never silently raise the budget, widen locations or drop a requirement.
- Return recognisable content/source types, direct links and useful freshness information. Ground any generated answer in retrieved material. Refresh publication/expiry/withdrawal/deletion access immediately rather than awaiting a scheduled crawl.
- When a model, external source or quota fails, keep the same entry point and last explicit criteria. Use a bounded deterministic interpreter/direct correction route where it can honour the request; explain unsupported parts and preserve browsable own listings. Do not pretend this degraded route provides the full AI capability. Additional AI preference inference remains off under LM-AI02.

**Acceptance:** evaluate held-out realistic queries, the exact owner example and paraphrases; multiple alternative places; Welsh/island aliases; follow-up edits and reset; rent-unit/payment-preference handling; unknown or excluded costs/features; some/zero relevant own listings; unrelated, expired, pending and wanted-only records; third-party and model outages; permission boundaries and hostile retrieved text. Check source prominence on Galaxy/Android Chrome, keyboard/scroll behaviour, clear loading/error/empty states and accessible correction controls. Record relevance, hard-constraint violations, source support, response time and actual cost. Set targets from an observed baseline before release; synthetic evaluations do not establish genuine supply or rental outcomes.

## LM-AI02 — Optional AI preference suggestions

**Own dedicated sprint, after core search LM-R17.** Add opt-in suggestions to the existing conversation and requirement summary, with independent acceptance. Core search can be accepted using explicit user instructions before this feature is delivered.

The 09/11/2026 conversational-search direction supersedes the old traditional filter-panel presentation. Preserve the existing **off by default / opt-in / override** rules for suggestions beyond what the user explicitly requested.

- Applying “two bedrooms, Leeds, up to £1,500” from the user's search is following an explicit instruction. Adding a commute radius, inferred lifestyle preference or other unstated constraint is optional AI inference and must not happen silently.
- For new users or a missing preference, additional automatic suggestions are off. Offer a clearly labelled optional control; only an explicit action enables it. A remembered choice must be inspectable and easy to reset.
- Show suggested criteria and why they were suggested. Let users accept, correct, lock, remove or reset them in the requirement summary or conversation, without needing a traditional filter panel.
- Explicit corrections and locked requirements take priority over inference, reloads and SystemBot#Colin updates. Turning suggestions off or losing the model preserves the user's explicit requirements.
- Do not infer income, benefit status, politics or protected characteristics, or use area statistics to silently steer housing choices. Do not silently relax constraints or broaden a zero-result search.

**Acceptance:** verify initial off, explicit opt-in, reset, explanations, conflicting criteria, correction/locking, reload and disabling mid-session. Confirm that model failure and empty results preserve explicit requirements and that controls remain usable by touch and keyboard.

## LM-AI03 — AI-powered customer service

**Own dedicated sprint.** Deliver the bounded support assistant and its acceptance independently of search, preference suggestions, area information and the updates agent. Depend on approved support content and verified provider/privacy entitlements.

- Provide an identifiable AI support assistant grounded in approved, versioned information about searching, posting, moderation, accounts, enquiries, privacy and test memberships.
- Link answers to the relevant help page or action, and distinguish general guidance from an actual account lookup or completed action. Authenticated lookups require ownership checks; support logs must minimise personal data.
- Start with answers and guided navigation. Any later ability to alter adverts, disclose contact information, erase data or change payments requires a separately authorised, confirmed workflow.
- Offer the existing feedback/report route and a defined human escalation process when the answer is unsupported, disputed or requires staff action. Do not promise response times until someone owns them.
- Do not invent account status, payment outcomes or professional legal advice. Keep private advert/enquiry text out of external model processing unless a later privacy decision explicitly permits that use.

**Acceptance:** test answers against the approved knowledge base, refusals/uncertainty, stale policies, account isolation, malicious inputs and successful escalation. Retain useful help links when the model is unavailable.

## LM-AI04 — AI-powered area information

**Own dedicated sprint.** Deliver and evaluate a sourced area-guide pilot independently of customer service, search and SystemBot#Colin. Store versioned evidence with checked manual/fixture refreshes during the pilot; production automatic refresh is the separately accepted LM-AI05 dependency, not completion claimed within this sprint. Later independent coverage expansions get their own entries.

Each rental listing should offer an **About the area** section with a concise sourced overview, expandable topics, useful maps/links and supplementary cards for relevant nearby areas. An optional area question interface may answer only from the same approved evidence. Summaries explain facts; they must not fabricate local knowledge.

### Horfield example and geographic scope

Use **Horfield, Bristol** as an initial design/test example. The owner's suggested nearby-area candidates include **Cotham, Henleaze, Southmead, Filton and Fishponds**. These are examples to investigate, not an assertion that each is an immediate neighbour or among the closest areas to every listing.

Resolve the listing's location and the named neighbourhood, electoral ward, local authority and statistical geographies separately. Validate nearby-area selection using boundaries, distance and useful transport connections. Show the method, travel mode and reference point; do not invent travel times. A neighbourhood name must not silently substitute for a same-named ward. A supplementary area may fall under a different council.

Use only location detail authorised for public display. Address-specific utility checks must not expose a private address or imply that an area-level result proves service at the rental.

### Required topic coverage

| Topic | Information to provide | Evidence and presentation requirements |
| --- | --- | --- |
| Amenities and essential services | Shops, food, healthcare, pharmacies, schools/childcare, community facilities and accessibility information where verified. | Council, service-provider and licensed mapping sources; source dates and confirmed opening/eligibility information. Nearby does not mean accepting new patients or offering places. |
| Political and civic information | Relevant council/ward, councillors, MP and, in Wales, Senedd representation; official party affiliations, council control, election results and relevant planning/consultations. | Neutral facts from official bodies, with geography and effective dates. Explain official proposals versus adopted decisions. Do not infer how an individual resident votes or provide partisan housing recommendations. |
| Green space and nature | Parks, public open space, walking/cycling routes and nature access. | Verified public access, route/distance method and any known restrictions. Additional flood/air/noise information can be added when an appropriate source is validated. |
| Traffic and public transport | Stops, stations, routes, timetables, connections, parking, roadworks and congestion/disruptions where available. | Separate timetabled service, measured traffic and genuinely live feeds. Give source timestamp, travel mode and freshness; never present a scheduled snapshot as live traffic. |
| Crime | Recorded crime counts by category and period; rates/trends only when the geographic boundary, population denominator and comparison method are valid. | Police data are monthly and locations are anonymised [S3]. Explain coverage/recording limits; do not label a specific home safe or unsafe from a nearby map point. |
| Utilities and connectivity | Electricity/gas network and supplier information, water/sewerage, heating arrangements where verified, broadband and mobile coverage, and relevant provider links. | Distinguish infrastructure operator, existing supplier and available retail options. Use postcode/address checks when needed. Ofcom coverage is predictive [S4]; an area summary is not a property-level service or speed guarantee. |
| Average cost of living | Available published averages plus an editable monthly household budget for rent, council tax, energy, water, connectivity, transport and other supported categories. | Label averages, tariffs and calculated scenarios separately. Show date, geography, household assumptions and bill inclusions; avoid double counting. If no credible Horfield-specific average exists, state that and label any broader proxy. |
| Income levels | Available average earnings or household income, with definitions. | State mean/median, individual/household, gross/net, period, geography and uncertainty. The ONS small-area income model does not support disaggregation below its MSOA geography [S5]; do not relabel it as a street or arbitrary neighbourhood average. |
| Employment and commuting | Resident industries/occupations, local jobs/employment centres, and supported workplace/commuting patterns. | Distinguish where residents work from jobs located in the area. Use ONS/Nomis or Welsh official data with release/coverage limits; Census 2021 workplace data have pandemic-related limitations [S6]. Do not infer an individual's employer. |

### Sources, freshness and the updates agent

Store evidence before writing a summary: source URL/publisher, dataset/version, licence, covered geography, units/definitions, data period, publication/effective date, retrieval time and validation status. Link claims to their evidence; retain a clear distinction between source facts, calculations and AI-generated explanation.

Show **data period**, **last checked** and any stale/unavailable status. A successful fetch today does not make an older income survey or monthly crime series current-day information. Missing categories must say unavailable; the model must not fill gaps from memory. Conflicting or unexpectedly changed records need review.

[SystemBot#Colin](systembot-colin-roadmap.md) maintains the source/update inventory, checks for new releases, validates changes and refreshes approved area snapshots and search indexes. Reuse a versioned area profile across listings rather than independently generating conflicting facts for each property. Validate routine updates automatically; hold unsupported claims, anomalous statistics and source conflicts for human review.

**Acceptance:** test one Horfield guide and an equivalent Welsh/island fixture; verify boundaries/nearby-area claims, source-linked summaries, correct units/denominators, unavailable-data states, source conflicts, stale data, corrections and reversible refreshes. Test that area statistics never become automatic tenant scores or political/demographic filters.

## API discovery and provider evaluation

Use the owner's selected [public-apis/public-apis](https://github.com/public-apis/public-apis) and [IdoY12/awesome-free-ai-apis](https://github.com/IdoY12/awesome-free-ai-apis) catalogues through the [LM-R18 API candidate/source register](api-sources.md). They supply discovery leads alongside the official sources below; a directory's free-tier or data-use badge is not a provider entitlement or privacy decision.

For LM-R17, first compare Groq and a free-eligible Cloudflare Workers AI model using synthetic search queries, structured criteria validation and quota/outage tests. Provider/model selection remains open. Location candidates support LM-R16; Police.uk is for the later area-guide pilot. The register records primary-source checks, remaining Google Maps/address-coverage work and the unresolved Gemini public-UK entitlement. No external inference, private-data transfer or paid upgrade is enabled.

## Delivery and budget

Apply the [one-feature-per-sprint rule](../ROADMAP.md#sprint-scope-rule). Follow the roadmap's separately scoped landlord LM-R16, renter LM-R19 and compatibility/buddy-up LM-R20 priorities. The default AI sequence is **LM-R17/LM-AI01 search → LM-AI02 optional preference suggestions → LM-AI03 customer service → LM-AI04 sourced area-guide pilot → LM-AI05 SystemBot#Colin**. Each feature has its own sprint and completion evidence. Preparing approved sources and shared contracts can support a feature, but does not combine delivery goals. Establish the updates registry during source work; enable automated area refresh only after LM-AI05 is accepted. Independent work may proceed when its actual dependencies are ready. Dates, timeboxes and further coverage increments remain to be planned.

Use cached, shared evidence and bounded model calls. Check account-level free entitlements, data licences, automation permission, quotas and outage behaviour before selecting a provider. Existing AI subscriptions do not establish application API entitlement. If a capability cannot run within £0, record the gap and obtain a budget decision before enabling costs; do not silently substitute ordinary automation and call it generative AI.

## Primary-source register

Sources checked on **06/11/2026**. These establish candidate evidence sources and important limitations; they do not prove a working LetMallow connector, a complete local dataset or permission to automate every service.

| ID | Primary source | Relevance / limit |
| --- | --- | --- |
| S1 | [Bristol ward profiles](https://www.bristol.gov.uk/council/statistics-census-information/ward-profile-data) and [ward lookup](https://www.bristol.gov.uk/council/voting-and-elections/find-your-ward) | Ward comparison data and boundary mapping; do not assume a neighbourhood equals a ward. |
| S2 | [Bristol local information, open data and maps](https://www.bristol.gov.uk/council/local-information-open-data-and-maps) | Local facilities and map layers; check the licence of each dataset. |
| S3 | [data.police.uk methodology](https://data.police.uk/about/) | Monthly recorded-crime publication and anonymisation; retain data-quality caveats. |
| S4 | [Ofcom mobile methodology](https://www.ofcom.org.uk/mobile-coverage-checker/frequently-asked-questions) and [broadband checker notes](https://checker.ofcom.org.uk/en-gb/about-checker) | Predicted coverage and gaps; provider/property checks remain necessary. |
| S5 | [ONS small-area income QMI](https://www.ons.gov.uk/peoplepopulationandcommunity/personalandhouseholdfinances/incomeandwealth/methodologies/incomeestimatesforsmallareasqmi) | Modelled MSOA household means, uncertainty and geographic restrictions. |
| S6 | [Nomis workplace Census 2021](https://www.nomisweb.co.uk/sources/census_2021_wp) | Workplace industry/occupation/travel datasets and pandemic caveats; select resident-based evidence separately. |
| S7 | [UK Parliament lookup guidance](https://members.parliament.uk/Help/FindYourMp) | Constituency lookup, postcode-boundary limitations and links to other representatives. |
| S8 | [DfT bus open data](https://www.gov.uk/guidance/find-and-use-bus-open-data) and [Travelwest journey-planner sources](https://travelwest.info/help-centre/journey-planner-faqs/) | Route/timetable and feed discovery; local real-time integration terms/access remain unverified. |
| S9 | [Water UK supplier lookup](https://www.water.org.uk/customers/find-your-supplier) | Postcode lookup for water/wastewater; the tool is operated by Landlord TAP and is not a verified LetMallow API. |
| S10 | [Welsh Government labour-market statistics](https://www.gov.wales/labour-market-statistics-annual-population-survey-july-2025-june-2026-html) | Welsh coverage and sampling uncertainty; select suitable geography and current release at integration time. |
