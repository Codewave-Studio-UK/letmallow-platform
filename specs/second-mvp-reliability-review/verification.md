# Verification on 21/11/2026

| Check | Result |
| --- | --- |
| GitHub baseline | PRs #4, #6 and #7 are in `dev`. The branch reviewed identified itself as `0.1.0-alpha.4`. Stable `main` pointed to the initial commit. |
| Retry regression | The original account retry called `/api/homes` and stalled before loading the account. Synthetic tests show the corrected account retry reaches the account even when the adverts endpoint would stall, and the advert retry recovers without rechecking the session. |
| Tests and builds | All 16 tests passed on Node 24. Both the Netlify static build and the Vinext framework build passed. The generated Netlify rewrite targets only the canonical public homes endpoint. The generated headers and rewrite contain real line breaks. |
| Public Sites alpha | The current URL and previous URL reached the same home page. Sites recorded a successful publication for deployment version 15. The public homes and session endpoints returned HTTP 200. The account and moderation queue endpoints returned HTTP 401 for anonymous requests. |
| Browser | Searching for Ynys Môn and selecting houses led to an Anglesey search with a Rightmove referral. At 390 px, the filter dialog received focus, Escape restored focus and switching to the map hid the results until List View was selected. The anonymous account page showed the ChatGPT sign-in link. |
| Netlify | The build passed locally. The project summary reports team sign-in and a current deploy. The deployment list returned no active deploys and the public URL returned HTTP 404. The underlying Git/build configuration and visitor access remain unverified. |
| Feedback and database | The existing Tally form is published and returned HTTP 200. Sites lists the D1 binding and expected tables. No private records were read and no data was submitted. |

The signed-in advertiser, reviewer and renter journeys require consenting participants and separate accounts. Neon Free connectivity, migration and restore require an authorised Neon connection. An authentic Stripe sandbox Checkout and webhook require an authorised Stripe connection. See issues [#1](https://github.com/Codewave-Studio-UK/letmallow-platform/issues/1), [#2](https://github.com/Codewave-Studio-UK/letmallow-platform/issues/2) and [#3](https://github.com/Codewave-Studio-UK/letmallow-platform/issues/3).

The retry fix is prepared for integration into `dev`. Publishing the branch directly would replace newer UI changes already on Sites. Publish the fix with a source revision that incorporates those changes.
