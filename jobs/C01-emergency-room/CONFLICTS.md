# Source disagreements and limits

- Mirrored `man/injuries.Rd` describes 2,332,957 historical rows; the actual pinned
  RData artifact contains 1,865,651. Extraction uses the decoded, hash-verified
  artifact and selects treatment year 2017 explicitly (386,906 source cases),
  without adopting the stale documentation row count.
- Documentation mentions a deleted flag for product lookup; the actual pinned
  product artifact contains only code/title. No deletion flag is inferred.
- Product titles contain source truncations. The fixture preserves the source
  strings; a production familiar-name mapping remains unverified.
- “Because of” in the proposed game question implies causation. The historical
  CPSC manual records associated products without requiring product fault;
  production wording should say “associated with.”
- Same-origin mirrors can independently test transcription but cannot satisfy
  independent factual provenance. Current two-source evidence remains pending.
