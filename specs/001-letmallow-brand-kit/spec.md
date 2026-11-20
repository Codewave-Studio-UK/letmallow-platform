# Feature specification · LetMallow brand kit

**Feature branch** `feature/letmallow-brand-kit`

**Created** 20/11/2026

## User scenarios and testing

### P1 · Browse and search on the branded site

Visitors recognise LetMallow by its two-mascot lockup, Cobalt actions and Nunito type. On a phone or desktop they can search, open results, save an area and use a keyboard to open and dismiss the smart search dialog.

### P2 · Use the site in either colour scheme

Visitors who prefer a dark interface see the Night palette and dark logo. Visitors who prefer a light interface see the Cloud palette and light logo. Main text, links, controls, forms and notices stay legible in both. Membership tabs distinguish the renter and landlord choices by label, selected state and the corresponding Sky or Teal tint.

## Requirements

- FR-001 · Apply the LetMallow kit’s logo, favicon, Nunito type scale, Lucide icons, colour roles, card and control radii to the shared marketplace interface.
- FR-002 · Follow the browser colour preference and support narrow screens and keyboard navigation.
- FR-003 · Keep England and Wales coverage and the working alpha journeys. Brand mock-up adverts and product claims are illustrative.
- FR-004 · Advance the repository package to `0.1.0-alpha.2` and deliver through a feature branch from `dev`.

## Success criteria

- Both host builds use the same logo, theme and interface. All referenced brand assets load from the site itself.
- At a 320px viewport there is no horizontal scroll, and primary actions and navigation are reachable.
- Search, saved areas, plans and the advert form work in browser smoke checks. The existing service suite passes.
