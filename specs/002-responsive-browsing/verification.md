# Verification on 21/11/2026

| Check | Evidence |
| --- | --- |
| Responsive boundaries | Chromium preview at 320, 390, 639, 640, 767, 768, 1023, 1024, 1439, 1440 and 1680 CSS px. Checked result grid columns, card orientation, sticky search, filter pills, map visibility and page overflow. At 1024px the list and map panes were 483.5px each in the portable build with browser scrollbars. |
| Filters and map | A 390 × 800 viewport used a full-screen dialog. Applying a budget preserved the location. List and map were mutually exclusive and zoom changed the map scale. At 768px the right-hand drawer was full height and closed with Escape. The laptop budget pill moved focus to the budget select. A 639 × 360 landscape viewport retained the mobile toggle. |
| Advert detail | A synthetic £725 Bristol room appeared with bills and an enquiry link. The photo area was above contact at 768px. At 1680px the page was 1440px wide and the enquiry panel was sticky alongside the detail. No fixture data was included in the deployed source. |
| Network footprint | The 390px Chromium preview loaded the 19,150-byte hero, down 78% from the 87,940-byte original. The 840px alternative is 32,522 bytes. Map module and geometry are on-demand below 1024px and together weigh 17.5 kB before compression. Public list/search does not initialise the smart-search model or request the account session. Cellular and field Core Web Vitals measurements were outside the browser fixture checks. |
| Service and packaging | 14 Node tests passed with synthetic or in-memory data. The standalone Netlify and five-stage Sites builds passed. The Netlify mirror points directly at the current Sites origin. |

The current alpha has no property-photo or coordinate fields. The detail layout explicitly handles absent photos. The map draws from six supported approximate area centres and leaves any unmatched adverts available in list view.

Map geometry is simplified and cropped from [Natural Earth 1:10m map subunits](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_10m_admin_0_map_subunits.geojson) under its [public-domain terms](https://www.naturalearthdata.com/about/terms-of-use/). City centres are rounded from the [Natural Earth populated places dataset](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_10m_populated_places.geojson). Island pins are approximate centres.
