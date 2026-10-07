# Sources

No current national estimates or surprising factual lines have been published.
This is a historical engineering sample. Sources below share CPSC provenance;
they do not constitute two independent factual sources.

## Immutable historical data

- https://raw.githubusercontent.com/hadley/neiss/09ed9eba12e10732efb83ef82b4213a020521cc5/data/injuries.rda
  SHA256 `5e903769575e4d3ec5a2b6298cea22414d0a0216f4527a1428b2876cc81a142f`; 72,317,774 bytes.
- https://raw.githubusercontent.com/hadley/neiss/09ed9eba12e10732efb83ef82b4213a020521cc5/data/products.rda
  SHA256 `c028c506eaca1bb9a9bcc459594b37970d466f00601822e84cfc48e1c947eef2`; 12,504 bytes.

The mirror declares CC0 in DESCRIPTION; facts originate in CPSC NEISS.
The selected fixture uses only 90 real 2017 cases (three each for 30 products).
Selection is deterministic by case number, excludes second-product cases, and
exports only anonymous case IDs, codes and original weights. Labels are exact
source titles. No narratives, demographics, art or portraits are exported.
This subset does not support national estimation.

## Pinned documentation read live

- https://raw.githubusercontent.com/hadley/neiss/09ed9eba12e10732efb83ef82b4213a020521cc5/README.md
  Read 2026-10-07T15:14:32.094684+00:00; origin HTTP 200, verified TLS, repeated bytes identical.
  SHA256 `42a3f1edce764c46777ce1fca29000c25e8a7bb539fcd8b959f2ee8edbb3c8a1`.
  Taken: Historical scope and upstream CPSC provenance.
- https://raw.githubusercontent.com/hadley/neiss/09ed9eba12e10732efb83ef82b4213a020521cc5/DESCRIPTION
  Read 2026-10-07T15:14:32.095407+00:00; origin HTTP 200, verified TLS, repeated bytes identical.
  SHA256 `3ce3bea888428114ae1c0ecc4e5040c9af34a6866417f42f0f6876ed4ebca372`.
  Taken: Live-read package declaration License: CC0; separate license file absent.
- https://raw.githubusercontent.com/hadley/neiss/09ed9eba12e10732efb83ef82b4213a020521cc5/man/injuries.Rd
  Read 2026-10-07T15:14:32.096138+00:00; origin HTTP 200, verified TLS, repeated bytes identical.
  SHA256 `68651fe09ea1f3d77969c8f60e69323477dc15e47daf954b096b0941b1098f5e`.
  Taken: Historical weights and product-slot documentation; stated row count differs from actual decoded artifact.
- https://raw.githubusercontent.com/hadley/neiss/09ed9eba12e10732efb83ef82b4213a020521cc5/man/products.Rd
  Read 2026-10-07T15:14:32.098383+00:00; origin HTTP 200, verified TLS, repeated bytes identical.
  SHA256 `30d88fd71f907adf6fa42022636fabff419175026f46536dce0a35f1ba76db16`.
  Taken: Product title/code documentation; documented deleted field is absent in actual artifact.
- https://raw.githubusercontent.com/hadley/neiss/09ed9eba12e10732efb83ef82b4213a020521cc5/data-raw/injuries.R
  Read 2026-10-07T15:14:32.345605+00:00; origin HTTP 200, verified TLS, repeated bytes identical.
  SHA256 `2927ea3f4bb3a68734334cba687776d3cb02b255ef0b5d754589956acada3610`.
  Taken: Archived source construction and historical extraction methodology.
- https://raw.githubusercontent.com/hadley/neiss/09ed9eba12e10732efb83ef82b4213a020521cc5/data-raw/products.R
  Read 2026-10-07T15:14:32.400722+00:00; origin HTTP 200, verified TLS, repeated bytes identical.
  SHA256 `cc2e43d0a0b1b25204b1c273f730a06130b56dcb3a1241194481fab729232c32`.
  Taken: Historical product-lookup extraction methodology.
- https://raw.githubusercontent.com/hadley/neiss/09ed9eba12e10732efb83ef82b4213a020521cc5/coding-manual.pdf
  Read 2026-10-07T15:14:57.722622+00:00; origin HTTP 200, verified TLS, repeated bytes identical.
  SHA256 `d147937289620eef72c5dd40bc05255fa4ef62456cef20b75bc8504b67384021`.
  Taken: January 2016 CPSC coding manual: associated products need not be at fault; product-slot ordering and same-product handling.

The mirrored manual identifies CPSC and January 2016. Package CC0 is the
observed declaration; a separate license for the PDF was not established, so
the PDF is not redistributed. GitHub snapshots do not verify modern rules.

## Current sources not retrieved

- https://www.cpsc.gov/Research--Statistics/NEISS-Injury-Data
  Intended use: Current annual source, schema and reliability documentation. Proxy CONNECT 403; no contents or license verified.
- https://www.cpsc.gov/cgibin/NEISSQuery/home.aspx
  Intended use: Candidate current query route; path not verified. Proxy CONNECT 403; no contents or license verified.
- https://www.cpsc.gov/cgibin/NEISSQuery/Data/2025/NEISS2025.zip
  Intended use: Guessed 2025 ZIP path, not an established download URL. Proxy CONNECT 403; no contents or license verified.
- https://injuryfacts.nsc.org/home-and-community/safety-topics/sports-and-recreational-injuries/
  Intended use: Prospective corroboration publisher; underlying data independence still needs investigation. Proxy CONNECT 403; no contents or license verified.

## From knowledge, unverified

No gameplay facts have been supplied from knowledge. Current-year publication,
national estimates, familiar labels and fact lines remain unverified and are
listed in NEXT under “Re-verify when web works.”
