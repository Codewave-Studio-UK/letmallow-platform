# Second MVP build reliability review

The 06/11/2026 increment separated account checks from community-advert loading and added a standalone Netlify build. The second pass uses the current `dev` branch to preserve later sprints.

1. A failed account check can be retried without making or waiting for a community-advert request. A failed advert load can be retried without restarting the account check. Provider links remain available during a community-advert outage.
2. The Netlify build emits a valid rewrite for the public homes endpoint and valid response headers for the static front end. All authenticated activity continues at the canonical LetMallow origin.
3. Record live public observations, synthetic checks and account-dependent acceptance separately. Keep genuine enquiries free and review adverts before publication. Issues #1–#3 track participant, Neon and Stripe acceptance.
