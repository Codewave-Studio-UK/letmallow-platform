# Feature specification · Responsive browsing second pass

**Feature branch** `feature/responsive-second-pass`
**Date** 21/11/2026
**App version** `0.1.0-alpha.7`
**Baseline** [Responsive sprint](../002-responsive-browsing/spec.md) and published `0.1.0-alpha.5` controls and `0.1.0-alpha.6` themes.

## User scenarios and testing

### US1 · Use sticky controls without losing content (P1)

A renter can scroll results or an advert while the navbar stays available. At the five agreed tiers, the search bar, map and enquiry panel stay below any sticky controls above them. On a phone, the view switch and fixed controls do not obscure the focused content.

**Independent test** Use a populated results fixture at 320, 639, 640, 767, 768, 1023, 1024, 1439 and 1440 CSS px. Scroll the laptop results and a long advert. Test the layout by keyboard and in a short mobile landscape viewport.

### US2 · Start browsing over a constrained connection (P1)

A high-density phone receives a mobile-sized hero and can browse without loading the map, smart-search model or account session first.

**Independent test** Inspect the browser's initial resource requests and verify the available mobile hero candidates. Open Map View and verify the map assets load on demand.

### US3 · Select an area when pins are close together (P2)

A renter can choose any displayed map area with a labelled native control even if pins overlap or have moved outside the visible map.

**Independent test** Open the national map at 390 CSS px. Select Cardiff and Bristol, verify the selected pin and advert count agree, then return to the list.

## Requirements

- **FR-001** Preserve the five tiers, keyboard and touch interactions, and the shared type and spacing scale.
- **FR-002** Use the actual rendered height of stacked sticky controls when positioning results, map and enquiry content.
- **FR-003** Cap the first phone hero at its mobile image variants. Defer map and other optional requests until needed.
- **FR-004** Select supported map areas without requiring a map gesture. Maintain approximate area pins and the existing no-photo state.
- **FR-005** Record the app version in the source, integrate through a feature branch from `dev`, and verify the same source in both builds. Keep the newer navbar and button changes.

## Success criteria

- **SC-001** All breakpoint transitions and mobile list/map exclusivity pass in Chromium, with no page overflow. During list scrolling, sticky panel tops stay at or below the bottom edge of the controls above them. At the page footer, the desktop results workspace can scroll away as a unit.
- **SC-002** At 390 CSS px, initial list loads contain zero map, smart-search or session requests. Phone hero candidates are no larger than 32,522 bytes on the landing page.
- **SC-003** Both fixture areas can be selected independently. Existing service tests and both build targets pass.
