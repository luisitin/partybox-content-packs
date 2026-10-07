# Resume C04

Stage: metadata and colour-managed image pipeline validated locally: 24 tests,
25/25 mutations and eight checksums. Actual museum photos, permissions and
independent verification blocked. Native Git delivered baseline and final correction
milestones. Correction ede3a22 is on remote feature merge 1793b2d; claim refresh
fe27d86 reached main after transient server errors. Source-dependent work remains
blocked and is recorded in BLOCKED.md; no PR or green CI is claimed.

1. Fetch main and job/C04-ancient-or-ikea, read current CLAIMS and all job documents, preserve concurrent changes and refresh the claim when resuming.
2. Run npm test after changes. Confirm both century algorithms, schemas, fixture/pack repeatability, image tests, checksum verification and 25 mutations actually pass; record outcomes in VERIFY.
3. Apply source-domain configuration in environment settings and publish. Retry blocked requests only after an actual runtime-policy change; a saved draft alone does not prove access.
4. Read actual Met/AIC/Smithsonian media permission and download paired CC0/free object photographs. Track URL, author/license and source hashes. Never use Cooper Hewitt metadata CC0 as a grant for its images.
5. Process paired originals to <=512-pixel WebP strictly <40,000 bytes, retain attribution and exercise exact object/image associations. Synthetic tests do not establish this step.
6. Curate roughly 500+ visually surprising modern/ancient objects; resolve catalogue intervals and unknown bounds transparently. Add <=90-character facts with two independent sources and log conflicts.
7. Perform and log 30 seeded random manual second-source object checks. Regenerate every data/media file twice, validate schemas/checksums and confirm actual green C04 PR CI before calling the full job complete.
8. Push each milestone and at least every 30 minutes, refreshing main CLAIMS. Open a PR only after every check passes, then run measured KEEP GOING until three consecutive rounds have no player-noticeable gain and take the next eligible job.

## Re-verify when web works

- Museum-specific original photograph permission, author and redistribution conditions.
- Catalogue dates, BCE/CE interpretation and disputed ranges against independent references.
- Actual object/media associations and visual surprise curation.
- Fact sources, the 30 random manual checks and actual GitHub API/green CI.
