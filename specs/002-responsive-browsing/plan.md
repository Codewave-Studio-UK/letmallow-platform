# Implementation plan

1. Baseline the published Sites source and reconcile it with the canonical GitHub development branch.
2. Define the five CSS tiers, shared type and spacing variables, and reusable browser layouts. Keep existing search URLs and the native dialog. Distinguish approved adverts from publisher links.
3. Implement a first-party interactive area map with locally hosted Natural Earth geometry. Import the map when its pane becomes visible. Use supported named areas only and keep enquiry data out of the map.
4. Produce smaller WebP variants from existing assets. Defer the smart-search model and avoid replacing the first render or resetting filters while public adverts load.
5. Check both build targets and the existing tests, then verify breakpoint boundaries and the main interactions in a browser before publishing the alpha. Open a feature pull request into dev.
