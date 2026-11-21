# Fix record

On 21/11/2026 the existing on-device interpreter gained a rule for explicit housing categories. It looks for type words before the first common location or feature phrase. It treats flatshares, house shares and shared homes as rooms. If this part of the query mentions two different types, it leaves the type open. If there are no explicit terms, the existing classifier still handles paraphrases. Location, budget and editable suggestions keep their existing paths.

- `public/market/smart-search.mjs` applies the category check before classifier scoring.
- `tests/alpha.test.mjs` covers the live Anglesey reproduction, house wording, room and flatshare wording, studios and alternatives.
- `docs/project-status.md` records the second pass and links its evidence.

GitHub `dev` used `0.1.0-alpha.4` at the baseline. The separate styling sprint already uses `0.1.0-alpha.5` on Sites and in [PR #10](https://github.com/Codewave-Studio-UK/letmallow-platform/pull/10). The fix has no release version yet. Assign one after reconciling the styling branch and current Site source. The styling sprint reached Sites version 15 during the review. Publishing directly from this branch would replace parts of the live styling with the older GitHub snapshot.
