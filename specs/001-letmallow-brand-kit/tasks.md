# Tasks · LetMallow brand kit

- [x] T001 Confirm the reference, alpha baseline and branch workflow.
- [x] T002 Apply shared light and dark tokens, fonts, logo, icons and photography.
- [x] T003 Check the responsive interface and key visitor journeys in both themes.
- [x] T004 Bump the alpha version and verify both builds and the service suite.
- [x] T005 Prepare the feature branch for a pull request into `dev`.

- [x] T006 Apply the artboard patterns to results, advert details and the account workspace.
- [x] T007 Exercise empty, populated and error states plus the existing actions in both themes.

## Verification

- The Sites and Netlify builds, lint and all eight service tests passed.
- Chromium exercised the shared shell at 320px, 360px, 741px and 1440px on both builds in light and dark. Checks covered asset loading, search results, saved areas, keyboard focus, dialog dismissal, plan selection, and the advert form or account hand-off.
- Account and advert replies in the browser used synthetic fixtures. Live sign-in, payments and marketplace suppliers were outside this sprint.
- The supplied SVG wordmark was outlined in Nunito ExtraBold and its canvas was widened so the last letter fits.
- The artboard follow-up checked the same 16 host, theme and viewport combinations. It covered selected search filters, advert facts and layout, provider fallback and retry, wanted adverts, the account sidebar, enquiry submission, advert review and the advertiser form. The browser used synthetic data and intercepted marketplace API requests for these checks.
