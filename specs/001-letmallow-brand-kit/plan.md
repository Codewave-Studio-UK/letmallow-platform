# Implementation plan · LetMallow brand kit

**Branch** `feature/letmallow-brand-kit`

**Spec** [Feature specification](spec.md)

- Use the LetMallow Brand Kit v0.1 export from the supplied ZIP as the reference. Use its light and dark themes and product layouts throughout the existing alpha flows.
- Keep shared markup in `public/market/shell.mjs` and apply theme tokens across `public/market/style.css`. The Netlify build and Sites framework render this same shell.
- Bundle the logo, favicon, Nunito font subsets and the Lucide icons used by the shell. Use the kit’s bedroom photo as illustrative landing imagery.
- Share the advert metadata, badges and account rows across the views that render them. Use the existing marketplace data and working navigation.
- Read the theme from `prefers-color-scheme`. Keep native focus and form semantics and verify contrasting foreground and background pairs. Retain in-app state and account handling.
- Run both builds, the existing service tests and browser smoke checks with synthetic fixtures. Review the staged diff, then commit and open a pull request into `dev`.
