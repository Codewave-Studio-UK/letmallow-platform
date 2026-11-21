# Tasks

- [x] Read the artboard and audit the current button and link markup.
- [x] Apply the button and link styles, including selected, disabled and keyboard focus states.
- [x] Set the sprint version in the GitHub and hosted builds.
- [x] Verify the service suite, both builds and the controls in a browser.

## Verification

All 14 tests passed and both the Sites and Netlify builds succeeded. Chromium on the Sites preview confirmed the artboard's button colour, font weight and corner radius, keyboard focus and Escape, the selected plan and filter treatments, the map zoom limit and reset, and the destination and styling of an external provider link. Verification used local service data and a public provider link target. It did not submit an advert, enquiry, payment or moderation action.

## Navbar follow-up

- [x] Reproduce the artboard's marketplace navbar and fit the controls at mobile widths.
- [x] Keep search, saved areas, enquiries and all previous navigation destinations accessible.
- [x] Verify the navbar on both builds and in Chromium.

Both builds and all 14 tests passed again. The Chromium preview confirmed the one-row desktop layout, keyboard opening and Escape dismissal, filter values in the navbar, the Saved and signed-out Messages destinations, and access to every previous menu destination. Account and enquiry service checks used synthetic records.

## Responsive navigation

- [x] Replace navbar search with horizontal navigation on desktop and a dropdown on smaller screens.
- [x] Retain homepage and results search.
- [x] Keep the navbar visible while scrolling and place the sticky results toolbar below it.

## Second pass

- [x] Review the brand reference, sprint acceptance criteria, Git branch and deployed baseline.
- [x] Close the keyboard, filter and iconography gaps.
- [x] Verify the changes in both builds, run the tests and check the published site.

The Sites and Netlify builds passed with all 14 service and browsing tests. The live Chromium checks covered the sticky header, mobile dropdown dismissal and focus return, desktop menu, selected filter and chevrons, homepage and results search, map zoom icon, cobalt saved state and button and link styles. At the tablet breakpoint the toolbar pinned directly below the header. Public favicon, Apple touch icon, manifest and manifest PNGs matched the built bytes. Authenticated service tests used synthetic records. Physical-device installation was outside this verification.
