# LetMallow responsive browsing sprint

Date 21/11/2026

App version `0.1.0-alpha.4`, following the iconography sprint (`0.1.0-alpha.3`).

## Renter stories and acceptance

1. At 320–639 CSS px, I can scan one-column cards, edit my filters in a full-screen dialog and switch between list and map with one bottom control. Only the active view is visible or focusable. Filters survive view changes and browser history.
2. At 640–767 CSS px, I get compact horizontal cards and a sticky search bar. At 768–1023 CSS px, I get two listing columns, a filter drawer and an advert detail layout with photos above the enquiry section.
3. At 1024–1439 CSS px, I get a 50/50 split with horizontal cards in a scrollable feed, a map that stays in view and horizontal filter controls. At 1440 CSS px and above, I get two vertical listing cards per row beside the map. Non-map pages have a centred maximum width of 1440 CSS px.
4. At all widths, I can use the keyboard and tell community adverts from links to other rental sites. The map labels approximate areas, preserves the search and keeps results with unmapped locations available in the list. Adverts without photos explicitly say so. Existing enquiry and advertiser flows remain usable.
5. The branded site uses a moderate rem scale and spacing in quarter increments of its 24px body line box at default text size. The first mobile list view requests no map code or imagery. The supplied hero and area images use responsive WebP sizes. Repeatable network checks use a cold cache, record the test conditions and treat live mobile performance as a separate measurement.

## Constraints

Keep the current alpha, brand, account and enquiry service, privacy boundary and £0 additional spend. Use only public area names for map matching. Do not fabricate individual property locations, photographs, room details, availability or prices. Maintain the hosted Sites and portable Netlify builds.
