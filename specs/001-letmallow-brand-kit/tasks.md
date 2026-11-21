# Tasks · LetMallow brand kit

- [x] T001 Confirm the reference, alpha baseline and branch workflow.
- [x] T002 Apply shared light and dark tokens, fonts, logo, icons and photography.
- [x] T003 Check the responsive interface and key visitor journeys in both themes.
- [x] T004 Bump the alpha version and verify both builds and the service suite.
- [x] T005 Prepare the feature branch for a pull request into `dev`.

- [x] T006 Apply the artboard patterns to results, advert details and the account workspace.
- [x] T007 Exercise empty, populated and error states plus the existing actions in both themes.

- [x] T008 Apply the type scale and voice rules to navigation, search, plans, forms, account pages and system messages.

## Verification

- The Sites and Netlify builds, lint and all eight service tests passed.
- Chromium exercised the shared shell at 320px, 360px, 741px and 1440px on both builds in light and dark. Checks covered asset loading, search results, saved areas, keyboard focus, dialog dismissal, plan selection, and the advert form or account hand-off.
- Account and advert replies in the browser used synthetic fixtures. Live sign-in, payments and marketplace suppliers were outside this sprint.
- The supplied SVG wordmark was outlined in Nunito ExtraBold and its canvas was widened so the last letter fits.
- The artboard follow-up checked the same 16 host, theme and viewport combinations. It covered selected search filters, advert facts and layout, provider fallback and retry, wanted adverts, the account sidebar, enquiry submission, advert review and the advertiser form. The browser used synthetic data and intercepted marketplace API requests for these checks.
- The copy and typography follow-up checked 22 synthetic page states across the two source trees, including advert details, waiting and empty states, the submission form and the review queue. The bundled Nunito digits have equal widths at all four brand weights.

## Second pass

- [x] T009 Confirm the current GitHub and live baselines. Add acceptance criteria for the branding regressions.
- [x] T010 Restore the theme roles, Alpha badge and desktop hero styling. Apply the remaining wording corrections.
- [x] T011 Run both builds and verify the brand criteria across the existing journeys.

### Verification on 21/11/2026

- Chromium checked the homepage in Cloud and Night at 320, 767, 768, 1023, 1024 and 1440 CSS px. All cases reflowed without horizontal scrolling and showed the expected logo, type, theme and sticky navbar. The desktop heading was 56px and the Alpha badge was 13px.
- At 320px, Enter opened the hamburger menu and Escape closed it. The Cardiff smart-search example opened results. List and map switched without overlap, and the filter dialog fit the viewport. At 1440px, the dark footer logo loaded, the plans page used its own image and the messages hero used a gradient.
- Thirteen palette text pairs passed the 4.5:1 contrast check. Ten synthetic view checks covered advert details, posting, account, messages and review across the two source trees. All 14 automated tests passed in both checkouts. Lint, the portable Netlify build and the Sites build passed.
- Signed-in state, enquiries, checkout and account operations were checked with fixtures. Browser checks used the public interface in preview. Third-party providers were not revalidated.
