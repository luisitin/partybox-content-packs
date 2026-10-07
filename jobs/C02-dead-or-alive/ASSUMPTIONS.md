# Assumptions

- Build date is passed explicitly as 2026-10-07; production logic never reads a clock. Dates use the proleptic Gregorian calendar and UTC epoch days.
- Deaths less than 30 whole days before the build date are excluded; exactly30 days is eligible once all other evidence is verified. Future death dates are errors.
- Current status requires evidence verified as of the supplied build date. A historical missing death date never implies currently alive.
- The historical Nobel sample is an engineering fallback under RULES, not a substitute for Wikidata selection. It lacks Wikidata IDs, sitelinks and Commons metadata.
- The sample's source repository declares CC0; upstream Nobel/Kaggle license has not been independently read. Only basic normalized factual fields are reproduced, without source motivation quotations.
- Original generated image test patterns exercise the complete offline transform; they are not portraits and are never attached to actual people. Caller-supplied license metadata is not independent license verification.
- Unknown gameplay fields remain null. No fact line or alive/dead answer is invented from knowledge.
- Pillow is a build-time image dependency. TypeScript aggregation/status logic remains strict ES2022, deterministic and without runtime dependencies or network calls.
- Use the existing isolated checkout, preserve concurrent claims and main updates, and do not create a worktree unless explicitly requested.
