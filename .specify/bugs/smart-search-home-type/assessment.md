# Smart search drops an explicit home type

**Assessed 21/11/2026** · confirmed on GitHub `dev` at `c1d288b` and the public Site version 14.

Enter `A house in Ynys Môn for up to £1,000` in Try smart search and select Suggest search filters. LetMallow preserves Anglesey and £1,000 and opens all property categories. The same input passed to `interpret()` returns `kind: 'any'`. A second case, `A flat or house in Cardiff`, currently returns `room`, a type the renter did not ask for.

The type classifier scores individual words. Its training set contains “house” for rooms and whole houses, so a clear single-word category can fall below the confidence threshold. Combining alternative types can favour a third category. The model should still handle wording without an explicit category.

| ID | Acceptance criterion |
| --- | --- |
| AC1 | A request for a house in Ynys Môn up to £1,000 selects Houses, Anglesey and £1,000. A two-bed house request also selects Houses. |
| AC2 | A house share, flatshare or room in a shared house selects Rooms. An explicit flat or studio selects Flats. |
| AC3 | Multiple different types such as “flat or house” leave the property filter open. Unknown language can still return All properties. |
| AC4 | The suggestion stays editable and runs locally. Existing search routes, service behaviour and both build targets remain supported. |

Scope covers `public/market/smart-search.mjs`, the existing search test suite, release version and evidence. The broader AI search sprint remains separately specified. Use a feature branch based on `dev` and compare the current Site snapshot before publishing.

Assessment, fix and test record follow GitHub Spec Kit’s [bug workflow](https://github.com/github/spec-kit/blob/a4d571229e164e440f8950cac034607bae7b7518/docs/guides/bugfix.md).
