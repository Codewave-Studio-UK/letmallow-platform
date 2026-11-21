# Verification on 21/11/2026

**Verdict: verified locally, live fix pending.** The exact original request failed a targeted regression test on the baseline and passed after the patch. The live browser reproduced the original behaviour before the fix. The review branch is the source of the proposed repair.

| Acceptance | Evidence |
| --- | --- |
| AC1 | The failing test returned `any` before the fix. The same query now returns `house`, Anglesey and 1000. Two-bed Bristol house wording also returns `house`. |
| AC2 | The test covers a house share, a room in a shared house, a flatshare and a studio. The existing Cardiff flat test also passes. |
| AC3 | The test covers flat or house and house or flatshare. The existing unknown-language case continues to leave the type open. |
| AC4 | The existing local interpreter and search input contract are retained. Node 24 checks and both builds pass. The full browser journey with the patch is pending a release from the reconciled source. |

Reproduce the test with `node --test --test-name-pattern='preserves explicit home types' tests/alpha.test.mjs`. After publication, repeat the Anglesey example from the home page and confirm that the Houses filter is selected and the Rightmove house link remains available. Then repeat with “A flat or house in Cardiff” and check that All properties stays selected.
