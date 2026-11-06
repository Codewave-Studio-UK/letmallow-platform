# LetMallow — AI feature roadmap

**Owner-requested scope · Updated 06/11/2026 · Planned, not yet implemented**

Part of [LM-R10 in the future roadmap](../ROADMAP.md). The owner requested AI-powered sitewide search, optional auto-filtering, customer service and listing-page area information. Area information must receive automatic source updates from the future system agent, **SystemBot#Colin**.

The current small browser-based home-type classifier and advert templates are a starting point. They do not provide sitewide semantic search, generative customer service or sourced area guides. Model/provider selection and release dates remain open; no inference entitlement, source API or ongoing free allowance is assumed.

## LM-AI01 — AI-powered sitewide search

- Search published adverts, wanted adverts, area guides, approved help/policy content and navigation. Cover meaning and synonyms as well as exact terms; support Welsh place aliases and islands.
- Return recognisable result types, direct links and the relevant source/update date. Generated answers must be supported by the retrieved material; say when information is missing rather than inventing properties, availability or partnerships.
- Enforce permissions before retrieval and generation. Public search must exclude pending/withdrawn adverts, private proof, inboxes and other users' account data. Any future search of the user's own records must remain authenticated and separately scoped.
- Keep conventional search available during model failure, rate limits or exhausted free allowances. Refresh the index after publication, expiry, withdrawal and deletion; essential access restrictions must not wait for a periodic crawl.

**Acceptance:** evaluate a held-out set of realistic queries across the supported content types, including misspellings, Welsh aliases, unsupported questions, stale records, permission boundaries and instructions embedded in retrieved text. Record relevance, source support, response time and actual cost; agree targets before release.

## LM-AI02 — Optional AI-powered auto-filtering

- The default is **off** for a new user or missing preference. Show a clearly labelled switch; only an explicit user action enables it. Any remembered setting must reflect that choice and be easy to reset.
- When enabled, interpret the user's stated housing requirements into visible filters, with a short explanation of each inferred choice. Users can edit, remove, lock or reset every applied filter and disable further automatic changes.
- Manual overrides take priority over later inference, refreshes and updates from SystemBot#Colin. Do not silently relax a stated budget or location, restore a removed filter or widen a zero-result search.
- When disabled, ordinary manual filters remain available. Sitewide search may offer a preview of interpreted criteria for the user to apply explicitly; it must not silently apply inferred preferences.
- Infer housing requirements from deliberate input. Do not infer a person's income, politics or protected characteristics, or use area income/crime/political summaries to silently steer their housing search.

**Acceptance:** verify first-use off, explicit opt-in, preference reset, visible explanations, conflicting criteria, manual edits/locks, navigation/reload and disabling mid-session. Test that model failure and empty results preserve the user's last explicit settings.

## LM-AI03 — AI-powered customer service

- Provide an identifiable AI support assistant grounded in approved, versioned information about searching, posting, moderation, accounts, enquiries, privacy and test memberships.
- Link answers to the relevant help page or action, and distinguish general guidance from an actual account lookup or completed action. Authenticated lookups require ownership checks; support logs must minimise personal data.
- Start with answers and guided navigation. Any later ability to alter adverts, disclose contact information, erase data or change payments requires a separately authorised, confirmed workflow.
- Offer the existing feedback/report route and a defined human escalation process when the answer is unsupported, disputed or requires staff action. Do not promise response times until someone owns them.
- Do not invent account status, payment outcomes or professional legal advice. Keep private advert/enquiry text out of external model processing unless a later privacy decision explicitly permits that use.

**Acceptance:** test answers against the approved knowledge base, refusals/uncertainty, stale policies, account isolation, malicious inputs and successful escalation. Retain useful help links when the model is unavailable.

## LM-AI04 — AI-powered area information

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

## Delivery and budget

Proposed sequence: (1) approved-source catalogue and normal sitewide retrieval; (2) evaluated AI search with the opt-in filter controls; (3) bounded customer-service pilot; (4) a sourced Horfield area-guide pilot; (5) SystemBot#Colin refresh validation and gradual England/Wales coverage. Establish the updates registry during source work so the guide pilot can use it. This is a proposed sequence, not a dated commitment.

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
