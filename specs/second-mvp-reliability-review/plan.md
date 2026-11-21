# Implementation plan

1. Inspect the generated Netlify files from `dev` and trace the retry behaviour through the account and community screens.
2. Give the two retry paths their own request and status updates.
3. Run the service tests and both builds. Verify the generated configuration, exercise retries with synthetic responses, and check public browsing against the live site. Open a pull request targeting `dev`.
