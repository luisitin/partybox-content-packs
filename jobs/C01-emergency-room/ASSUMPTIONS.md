# Assumptions

- This task began on 2026-10-07; “last year” means 2025. Latest published NEISS year remains unverified.
- Main added the binding web-blocked fallback rule while research was running. The historical GitHub fallback is used to build/test the whole sample pipeline rather than abandoning research at a 403.
- Sample-only output cannot answer the game question: a selected subset is not a national estimate. It has explicit historical year, incomplete status, null national estimates and null fact lines.
- CPSC records products associated with injuries; association does not prove causation. Player wording must preserve this distinction.
- Mirrored manuals, product lookups and injury records share CPSC provenance. They are useful checks of extraction but not independent evidence for national estimates.
- NEISS source labels are preserved exactly, including truncations. No unsupported fun labels or facts are invented.
- TypeScript implements the offline pipeline; Python is a build-time RData extraction tool, not game/runtime logic. Runtime dependencies are zero; schema validation and compilation dependencies are development-only.
- Random property seeds were generated once with cryptographic randomness and committed. Every test reuses them deterministically; production aggregation contains no random or wall-clock behavior.
- The existing checkout is isolated; no Git worktree is needed. Preserve unrelated main updates and other chats’ claims.
- Current-source access, two independent factual sources, 30 manual second-source spot checks, the full balanced pack, and green CI remain prerequisites to completion.
