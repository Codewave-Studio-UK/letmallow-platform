# Feature specification · LetMallow brand kit

**Feature branch** `feature/letmallow-brand-kit`

**Created** 20/11/2026

## User scenarios and testing

### P1 · Browse and search on the branded site

Visitors recognise LetMallow by its two-mascot lockup, Cobalt actions and Nunito type. On a phone or desktop they can search, open results, save an area and use a keyboard to open and dismiss the smart search dialog.

### P2 · Use the site in either colour scheme

Visitors who prefer a dark interface see the Night palette and dark logo. Visitors who prefer a light interface see the Cloud palette and light logo. Main text, links, controls, forms and notices stay legible in both. Membership tabs distinguish the renter and landlord choices by label, selected state and the corresponding Sky or Teal tint.

### P3 · Recognise the brand beyond the landing page

The [product mock-ups](https://claude.ai/artifact/MPR5UqG6jxKJ9W43LGPm2r#artboard-3d8175ac14d9) show how renters scan a listing and how advertisers read and answer enquiries. Community results use cards with the actual title, monthly amount, location, type and bills. The account uses the illustrated sidebar and grouped enquiry rows for its existing sections.

## Requirements

- FR-001 · Apply the LetMallow kit’s logo, favicon, Nunito type scale, Lucide icons, colour roles, card and control radii to the shared marketplace interface.
- FR-002 · Follow the browser colour preference and support narrow screens and keyboard navigation.
- FR-003 · Keep England and Wales coverage and the working alpha journeys. Brand mock-up adverts and product claims are illustrative.
- FR-004 · Advance the repository package to `0.1.0-alpha.2` and deliver through a feature branch from `dev`.
- FR-005 · Apply the artboard’s card, filter, and account patterns to search, details, adverts, plans and existing account actions. Only show listing and enquiry facts supplied by the marketplace. Use the studio-review state on public adverts.

- FR-006 · Use the shared hero across page headings. Allow a separate photo and desktop and mobile crops for each hero. Use the dark gradient, Nunito type and compact spacing for pages such as accounts and advert details where a photo would add little or imply an unverified property image.

- FR-007 · Apply the kit’s Nunito type scale, tabular figures and sentence case to all LetMallow interface text. Use British English, lead with known rental facts, label test features clearly and give users a practical next step when something goes wrong. The uppercase Alpha badge follows the kit’s label treatment.

## Success criteria

- Both host builds use the same logo, theme and interface. All referenced brand assets load from the site itself.
- At a 320px viewport there is no horizontal scroll, and primary actions and navigation are reachable.
- Buttons, forms, adverts, account pages and system messages follow the copy rules. Existing adverts and enquiry text retain the wording their authors submitted.
- Search, saved areas, plans and the advert form work in browser smoke checks. The existing service suite passes.

## Second pass · 0.1.0-alpha.6

The initial branding sprint shipped as `0.1.0-alpha.2`. This follow-up applies its acceptance criteria to the current `0.1.0-alpha.5` baseline, which includes responsive browsing and the sticky navbar. The review build is `0.1.0-alpha.6`.

- FR-008 · Use the kit’s Cloud and Night palettes across marketplace pages, forms, dialogs and result views. Follow the browser’s colour preference. The navbar keeps its separately agreed light artboard styling.
- FR-009 · Show the kit’s cobalt Alpha label with a Lucide flask beside the logo on wide desktops. Keep it in the menu at narrower widths so the mobile navbar contains only the logo and hamburger.
- FR-010 · Match the supplied landing hero’s desktop type, spacing and photo treatment. Preserve the mobile type scale, responsive image sources, page-specific crops and gradient-only heroes where there is no suitable image.
- FR-011 · Keep sentence case and British English across the app, including list and map controls. Keep type readable when it reflows at 320 CSS px and with longer advert or location names.
