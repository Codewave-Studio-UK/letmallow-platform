# Second-pass evidence on 21/11/2026

App version `0.1.0-alpha.7`. The original responsive sprint was `0.1.0-alpha.4`. This follow-up builds on the published `0.1.0-alpha.5` controls and `0.1.0-alpha.6` themes.

| Acceptance | Observation |
| --- | --- |
| Five tiers and shared rhythm | Chromium at 320, 390, 639, 640, 767, 768, 1023, 1024, 1439, 1440 and 1680 CSS px. All layouts displayed without horizontal page overflow. Body line height was 24px with default font settings. The desktop panes measured about 484px each at 1024px with a visible browser scrollbar. |
| Filters and focus | At 390 × 800, the filter dialog filled the viewport and Escape restored focus to the trigger. At 639 × 360, the full-screen dialog scrolled and the apply button remained reachable. At 768px, the tablet drawer reached the right and full height of its viewport. |
| Map and enquiry layout | Tested with synthetic Bristol and Cardiff adverts. The phone showed one pane at a time and moved keyboard focus to the map on opening. The map area chooser independently selected both cities and their matching counts. The laptop feed scrolled independently with the map below the search toolbar. The tablet photo area preceded the enquiry panel. The desktop detail was 1440px wide and the enquiry panel stayed 24px below the sticky navbar while scrolling. |
| Mobile transfer | Chromium preview at 390 CSS px and device pixel ratio 1 selected the 19,150-byte home hero and a 480px Bristol hero. Initial home and list traces contained no map, smart-search or account-session requests. The regression test confirmed the biggest phone hero candidate is 32,522 bytes, 63% smaller than the 87,940-byte desktop original. Physical handset and cellular field timings were unavailable. |
| Building and tests | All 14 Node tests and both build targets passed. Both targets take the app version from `package.json` and include it in their HTML. Browser fixtures were local to QA. |

The map uses the existing six approximate areas. Listing records have no property-photo attachments, so the photo area handles the empty state with a clear message. See the delivery pull request for the verified dev commit and public rollout.
