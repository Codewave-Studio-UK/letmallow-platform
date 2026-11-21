# Implementation plan · LetMallow brand kit

**Branch** `feature/letmallow-brand-kit`

**Spec** [Feature specification](spec.md)

- Use the LetMallow Brand Kit v0.1 export from the supplied ZIP as the reference. Use its light and dark themes and product layouts throughout the existing alpha flows.
- Keep shared markup in `public/market/shell.mjs` and apply theme tokens across `public/market/style.css`. The Netlify build and Sites framework render this same shell.
- Bundle the logo, favicon, Nunito font subsets and the Lucide icons used by the shell. Use the kit’s bedroom photo as illustrative landing imagery.
- Share the advert metadata, badges and account rows across the views that render them. Use the existing marketplace data and working navigation.
- Read the theme from `prefers-color-scheme`. Keep native focus and form semantics and verify contrasting foreground and background pairs. Retain in-app state and account handling.
- Review titles, labels and messages across the existing journeys. Keep rent and bills easy to scan and describe what LetMallow has checked in plain language.
- Run both builds, the existing service tests and browser smoke checks with synthetic fixtures. Review the staged diff, then commit and open a pull request into `dev`.

## Second pass

- Extend the current responsive browsing and sticky navigation source. Compare the current live checkout to the GitHub branch before applying the same marketplace changes to both.
- Use theme roles for shared surfaces, text, focus and feedback. Keep the navbar on the light palette and use the supplied dark-background lockup in the footer when the visitor prefers dark.
- Use the responsive type rhythm below wide desktop and the kit’s desktop display treatment at the widest tier. Keep page-specific photos and sizes.
- Check the built pages, theme pairs, small-screen reflow and a synthetic advert and account journey. Record the version, branch and what was tested before delivery.

[GitHub Spec Kit workflow](https://github.github.com/spec-kit/index.html) · [WCAG 2.2 reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
