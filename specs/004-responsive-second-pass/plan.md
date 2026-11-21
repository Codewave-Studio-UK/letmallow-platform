# Implementation plan · Responsive browsing second pass

## Summary

Reconcile the shipped navbar and button baseline, fix sticky layout interactions, cap phone hero variants and add a native map area chooser. Record the application build as `0.1.0-alpha.7`.

## Technical context

Shared HTML, CSS and JavaScript under `public/market/`, with a Vinext Worker and a portable Netlify build. Keep existing routes, database, privacy boundaries and dependencies. Start from GitHub `dev` and keep the published controls changes in a separate baseline commit.

## Constitution check

Use current brand assets, £0 additional spend and synthetic advert fixtures. Use conditional image sources and existing local map data. Keep deployment evidence and fixture results distinct. Verify the feature branch, then integrate with `dev`.

## Verification

Check both sides of each breakpoint, the stacked sticky offsets, map controls and keyboard dialog focus. Inspect initial browser resource requests and the mobile image limits. Run the existing Node suite and both build targets. Confirm the public search, map and app build version after rollout.

[Responsive images](https://web.dev/learn/images/responsive-images/) · [W3C dialog practices](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) · [Web Vitals](https://web.dev/articles/vitals).
