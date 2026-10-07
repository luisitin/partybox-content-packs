# Sources and provenance

Only exact published annual name/count fields from the pinned primary mirror are redistributed.
No source code, PDF wording, illustrative research fact lines or unknown-license media are copied.
All pack short facts remain null.

## Original SSA candidate 1

https://www.ssa.gov/oact/babynames/names.zip

No contents read: proxy CONNECT403 before origin TLS. Candidate path, latest contents, redirects and direct license remain unverified.

## Original SSA candidate 2

https://www.ssa.gov/oact/babynames/background.html

No contents read: proxy CONNECT403 before origin TLS. Candidate path, latest contents, redirects and direct license remain unverified.

## Reachable historical publication 1

https://raw.githubusercontent.com/hadley/babynames/4391c25ea10b8b0589cdbab63067de3bc8b3a628/data/babynames.rda

Commit 4391c25ea10b8b0589cdbab63067de3bc8b3a628; SHA256 1d5c601fa3c5177f4d9edb4c8c2f08fddc8d9bf04372b8a40dc6aecf92bfa324. CC0 declared by package DESCRIPTION.

License evidence: https://raw.githubusercontent.com/hadley/babynames/4391c25ea10b8b0589cdbab63067de3bc8b3a628/DESCRIPTION

SSA extraction provenance: https://raw.githubusercontent.com/hadley/babynames/4391c25ea10b8b0589cdbab63067de3bc8b3a628/data-raw/names.R

Primary annual counts1880–2017 are used, restricted to complete1880–2009 decades. The pinned raw RDA is retained outside the public checkout; selected30-name annual records are redistributed under the package CC0 declaration. Descriptions or code are not copied.

## Reachable historical publication 2

https://raw.githubusercontent.com/hackerb9/ssa-baby-names/0b1a1316457d55447d1a1f7bfe57ee15e53cc2f0/raw-data/names.zip

Commit 0b1a1316457d55447d1a1f7bfe57ee15e53cc2f0; SHA256 67cf9c3fbbbcc18994cc071417267c48545130131112bcda83a9a36b2abcbc7e. Repository LICENSE is LGPL 2.1; copied no implementation code; archive used as verification reference. No independent government copyright statement verified..

License evidence: https://raw.githubusercontent.com/hackerb9/ssa-baby-names/0b1a1316457d55447d1a1f7bfe57ee15e53cc2f0/LICENSE

Archive provenance: https://raw.githubusercontent.com/hackerb9/ssa-baby-names/0b1a1316457d55447d1a1f7bfe57ee15e53cc2f0/README.md

Used only as a verification reference; mirror contains1880–2020 annual files and SSA tabulation date2021-03-07. No LGPL implementation or archive/PDF wording is redistributed. Its original government data license has not been independently verified here.

## Independence and omissions

Both publications derive from SSA. They supply distinct retrieval/transformation paths, not independent original measurements or fact publishers. Automated comparison does not complete the30 manual checks. Missing annual rows may reflect unreported or privacy-suppressed values; source absence is not proven zero births.

The primary publisher reports1924665 annual rows1880–2017. Its CC0 package declaration is read, but the original/current SSA site is unavailable. Historical usage alone does not establish current peaks, broad recognition or surprising facts. No model-recalled name history is presented as verified.

## Development tooling

https://www.npmjs.com/package/typescript
https://www.npmjs.com/package/ajv
https://pypi.org/project/pyreadr/0.5.3/
https://pypi.org/project/pandas/2.2.3/
https://pypi.org/project/numpy/2.3.5/

Compiler, schema validator and build-time decoder only, not gameplay data or fact sources. Frozen dev/source requirements carry their own upstream licenses. Node runtime logic uses no dependencies.

## Original SSA access restored

https://www.ssa.gov/oact/babynames/names.zip

HEAD returned200 at2026-10-07T17:20:22Z. A successful ordinary-TLS GET at17:22:05Z downloaded7,860,026bytes, SHA256 cd78e975ed7bb358e018dd62fbe14ced89295e9581c49172ca4eedcb011b3724. ZIP CRCs all pass;146 annual files cover1880–2025 and includeNationalReadMe.pdf. The full archive is cached outside the checkout. Its source/readme semantics and full500-row expansion remain in progress; the existing committed sample still uses the explicitly historical pinned mirror. Earlier CONNECT403 evidence is historical and is no longer an active block.

GitHub repository API access also now succeeds with existing authentication. A current cloud status reports network enforcement state unknown; direct successful requests establish these destinations work, but do not establish draft publication or new-machine readiness.

## Historical fact references (candidate coverage only)

Charlotte Mary Yonge — History of Christian Names

https://raw.githubusercontent.com/GITenberg/History-of-Christian-names_70419/e78bed0f0ab05ce6447247be0874dcc502778439/70419-0.txt

SHA256 aa58b800d24d941c858d981ca92b103e5409aaf90d6dcc30291097141aef4f6c. Public domain in the USA. Explicit jurisdiction is USA. Project Gutenberg trademark/license conditions apply when distributing its electronic text with its branding. Metadata declaration is recorded; worldwide rights were not independently checked.

William Smith — Smith's Bible Dictionary

https://raw.githubusercontent.com/neuu-org/bible-dictionary-dataset/b8e82aa7ca847f4d97fb432cd965e398a111333c/data/00_raw/ccel/xml/smith_bibledict.xml

SHA256 f0aa85b544f70384e24715dcb172ea0b687f8d5646994335e84c8dc44e5aca43. Embedded DC.Rights: Public Domain; NEUU dataset and scripts: CC BY 4.0.

Roswell D. Hitchcock — Hitchcock's Bible Names Dictionary

https://raw.githubusercontent.com/neuu-org/bible-dictionary-dataset/b8e82aa7ca847f4d97fb432cd965e398a111333c/data/00_raw/ccel/xml/hitchcock_bible_names.xml

SHA256 43390f72248bb3687cc69598b4dc6fd80dc6e406225eed3cd05e66594386d836. Embedded DC.Rights: Public Domain; NEUU README includes all source dictionaries as public domain and dataset/scripts CC BY 4.0.

- Thomas: Thomas and Didymus both mean "twin." (36 characters; corroborated-historical-reference-candidate).
- Joshua: Joshua and Jesus are forms of the same name. (44 characters; corroborated-historical-reference-candidate).
- Jessica: Jessica is Shylock's daughter in Shakespeare's The Merchant of Venice. (70 characters; single-primary-source-supported-candidate).

These are authored historical references, not SSA mirrors. Shared older traditions and disputed historical etymologies still require review. Thomas and Joshua have two authored references; Jessica has one and is not independently corroborated. None is inserted into the current sample, and full 500-name coverage remains unfinished. Modern SQL without license/provenance and an npm scraping package were rejected as authoritative fact sources.

## Current manual spot-check retrieval sources

Read the SSA decade tables at `https://www.ssa.gov/oact/babynames/decades/names<decade>s.html` for 1920, 1950, 1960, 1970, 1980, 1990, 2000, 2010 and 2020. These March 2026 published tables independently expose the peak subtotals through a second retrieval route. All nine HTTP 200/TLS-verified responses are cached under `/workspace/.partybox-source-cache/c05/manual-secondary`; exact commands and SHA256 values are in `/tmp/c05-manual-secondary-fetch-evidence.json`. Took only the 30 displayed name/category/count entries needed for manual comparison and their period labels. The 2020s table explicitly says 2020–2025 and six of ten years. These tables share SSA authorship with the ZIP and do not count as independent authored fact references. No site JavaScript, tracking or web assets are included in the offline pack.

## Official SSA snapshot for current candidates

Read `https://www.ssa.gov/oact/babynames/names.zip` live on 2026-10-07. HTTP 200 and preserved TLS verification; 7,860,026 bytes, SHA256 `cd78e975ed7bb358e018dd62fbe14ced89295e9581c49172ca4eedcb011b3724`. Retain the exact archive in `fixtures/ssa-names-2026-10-07.zip` for reproducibility, including its unmodified one-page NationalReadMe PDF. The archive has 146 annual text files covering 1880–2025, all CRCs valid, and 2,181,032 published aggregate rows. These files contain names, recorded categories and aggregate counts, not individual records. No source images, JavaScript or tracking assets are copied into the pack.

The live SSA catalog `https://www.ssa.gov/data/data.json` identifies this exact national ZIP distribution as **US-GOV-SSA-338**, modified 2026-05-08, temporal coverage 1880-01-01 through 2025-12-31, and explicitly declares `https://creativecommons.org/publicdomain/zero/1.0/` as its license. Thus source-data CC0 is verified from the publisher declaration. The direct Creative Commons deed and government-copyright page remained unavailable; their text was not read and is not the basis of this attribution. Catalog SHA256 `736efc038df85cc673c7893deefe1f53c12986763639cde7e295de4b6ae91091`; extracted national metadata SHA256 `0885f3e488cb6142e495f8b84f054a7ac9264421e16598318be0034e836d0947`.

Read the archive README plus live `https://www.ssa.gov/oact/babynames/background.html` and `https://www.ssa.gov/oact/babynames/limits.html`. The national figures cover the 50 states and District of Columbia; territorial data is excluded. Pre-1937 Social Security applications are incomplete. SSA strips spaces and hyphens from names and leaves other records unedited. Counts below five are omitted for privacy. Therefore the pack preserves publisher spelling and published subtotals without claiming original personal spellings, complete birth totals or zero occurrence when a record is absent.

`tools/extract_current.py` reads this source offline, rejects changed archive bytes before decoding, checks membership/CRC/order/duplicates/field boundaries, ranks qualifying distinct names deterministically, and emits 63,643 annual rows for 500 candidates. The normalized fixture SHA256 is `8dd80f3f6dc38705be47541fb994d073270ffe4d861732471c0c339e385905e9`. There are 9,357 omitted observed cells and 2,000 future unobserved cells across the selected names. Five candidate peaks are partial 2020–2025 subtotals: Theodore, Mateo, Ezra, Luna and Ivy. The current format records these two kinds of missingness separately and never projects counts.

The older 2021 snapshot comparison found revisions for every selected name: 21,576 common annual keys changed, two were added and eight disappeared. All 500 complete-period peak decades agree with that older mirror, while only 47 peak counts agree. This is an automated shape/revision audit, not manual verification or independent fact corroboration. Full research, exact requests and derived hashes are retained in `/tmp/c05-current-source-research.json` and `/workspace/.partybox-source-cache/c05/current-audit/source-research.json`. Recognition and per-name facts remain separate editorial work.

## First independently reviewed fact subset

`fixtures/curation.json` contains 144 explicit fact reviews. Every entry retains the two URLs, publisher, author, title, work identity, brief supporting quotation and review note. These facts feed `data/current-reviewed-candidates.json`; the base current pack remains available without editorial additions. The dictionary/book sources were read as source bodies, not accepted merely from their titles or search snippets. No cached reference dataset is bundled wholesale.

Behind the Name is the first authored work for this subset. Its descriptions were read from the pinned GitHub research mirror at `https://raw.githubusercontent.com/jeremander/baby_names/64575a0a450382fc6be272bf87a789a5de7c2bab/names.json`, SHA256 `3be1cfe9646f062769023015823dee99ba83b4b11c757c8c601f8b84d698fb1b`. The mirror explicitly attributes the dictionary; it is a retrieval route, not a second author. The corporate author is recorded as Behind the Name because individual authorship was not verified. No license for redistributing its scraped descriptions was found. Take only original factual paraphrases and brief supporting excerpts with attribution; make no open-license claim for expressive prose.

For 100 entries, the second work is the Dictionary of Medieval Names from European Sources, edition 2023.1, read through the editors' official archive `https://github.com/uckelman/dmnes-dump/tree/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625`. Individual references link each actual entry and retain the author citation read from that entry. The masthead identifies Sara L. Uckelman as editor; a technical maintainer is not substituted as the entry author. The editors claim copyright, and no open prose license was found. The archive supplies independent authored dictionary entries rather than another copy of Behind the Name. Shared older linguistic authorities can still underlie both works; ultimate scholarly lineage is not claimed to be independently audited.

The remaining 44 entries compare the modern dictionary with Charlotte M. Yonge's 1884 History of Christian Names, using the pinned full book URL and SHA above. The USA public-domain declaration was read. Narrow form relationships are used where older proposed literal meanings conflict with modern accounts. Eight overlaps between the 100-row medieval subset and 52-row book subset retain the medieval pair. Source quotation whitespace was collapsed in 44 book excerpts; words were preserved. No Project Gutenberg branding, source artwork or complete book is bundled.

An independent agent re-read a seeded random sample of 30 medieval fact pairs: 28 accepted, two required narrower wording, none rejected. Audrey and Harriet were narrowed before assembly. This is source-review evidence, not an additional human manual spot-check. The current numeric manual check of 30 SSA rows remains separately documented. Exact artifact hashes and the portable curated input are recorded in VERIFY. Recognition review and the other 356 facts are incomplete.

## Expanded 343-fact and 487-recognition candidate input

The expanded editorial input has 487 rows: 343 carry reviewed facts and 144 carry only an accepted recognition judgment. The other 13 pack rows keep both recognition and fact unresolved. All 500 numeric rows remain identical to the base current pack. Per-name citations and review notes are portable in fixtures/curation.json; complete remains false.

Additional modern Wikipedia entries were actually read from full pinned revision bodies, with each URL, revision identity, brief quotation and relevant citation-scope limitation retained. Entries are attributed to Wikipedia contributors. A different retrieval URL or an underlying unread citation is not counted as a new source. Clauses attributed only to Behind the Name, uncited speculative infoboxes and mismatched citation scopes were held; narrow clauses backed by non-BTN editorial citations were compared with the independently authored dictionary. This is independently authored corroboration, not a claim of independently collected philological evidence. Alan's unsupported century was replaced, and Alvin's named-reference inventory error corrected.

Wikipedia's actual HTML footer was read and declares Creative Commons Attribution-ShareAlike 4.0, with additional terms possible. The linked full license text was actually read over HTTP 200 with TLS verification at `https://en.wikipedia.org/wiki/Wikipedia:Text_of_the_Creative_Commons_Attribution-ShareAlike_4.0_International_License`; body SHA256 `8e2bfc08ef26d62b54154868bf51f67693f1e00c27ee42a85382b137ebfe802c`. Example read footer body SHA256 `ec1af14a0df39e5e59916bd6b98c24ed4fc098992f2838cd831f3a2cc71adc2e`. The brief attributed revision-linked Wikipedia quotations retain CC-BY-SA 4.0; script MIT does not relicense source prose. Six example footers were read; a separate footer fetch for all 487 API articles is not claimed. No Wikipedia art, logos, trackers or full articles are included.

The direct Smith dictionary and Yonge sources above now supply additional biblical narratives and name relationships. Shakespeare's actual cast list in The Merchant of Venice supplies Jessica as Shylock's daughter: `https://raw.githubusercontent.com/GITenberg/The-Merchant-of-Venice_1515/ff93cfa08e815939603801148ca8ccfa7eba78ff/1515.txt`. The primary work was read, and the separate modern dictionary corroborates the role. No assertion that Shakespeare invented the spelling is included. The original play is public domain in the USA; no source branding is copied.

The 500-name recognition audit is a separate editorial judgment, not a source-derived popularity score or human survey. It accepts 487 and holds 13. Research artifact SHA256 `26daa17b898ef00e241506087c8a3053bfabe2a312418dd9a0341bf18f718c37`. Twenty suggested reserves were numerically checked against every annual file of the pinned ZIP; this proves their numeric eligibility only, not their facts or final selection. No replacement has been applied.

Additional directly read reference: Ernest Weekley, The Romance of Names, third revised edition (1922), `https://raw.githubusercontent.com/GITenberg/The-Romance-of-Names_24374/6c60c4f96f0ca92df4eadb3fbbb052a37a1bd6d3/24374.txt`, 418,119 bytes, SHA256 `405d187cce806763855ef121c6d45aa8fdeaeea70d45f9f76349171afc0978ab`. Read metadata declares public domain in the USA; metadata SHA256 `bfee4ddff589f6b2365aa8e65ce3980c4b94748307a1935357f112161f378d2a`. Took narrow original surname/name-root facts compared with the modern dictionary; no complete source book or branding is bundled. The 24-row Weekley/Yonge gap artifact SHA256 is `71daaaa1ab28b71fb634af33f1864d8ddb92262355d0549aa4130bd86d80d995`; its direct-read audit SHA256 is `219c09b1eb699d28f5bfe45e40fa8b2b0fa258e1d3b6329c20ff8e9f9b6defbf`.

Read primary literary works for narrow character facts, each paired with the independently authored modern dictionary. Source texts are public domain in the USA; take brief character-name evidence only, preserving author/translator attribution. Do not redistribute their branding. Pinned URLs are also retained per row:

- Rudyard Kipling, Kim: `https://raw.githubusercontent.com/GITenberg/Kim_2226/d6cc0b6a23b03f7de8fb79d361b315fdd0512c17/2226.txt` — Kimball as the title hero's full first name.
- Johanna Spyri, Heidi: `https://raw.githubusercontent.com/GITenberg/Heidi_1448/3bbd4c3c6c5486bc199ae7da210cf3f9f8a70f54/1448.txt` — Adelheid as Heidi's longer name.
- Leo Tolstoy, War and Peace, Louise and Aylmer Maude translation: `https://raw.githubusercontent.com/GITenberg/War-and-Peace_2600/fa22ab90f00f627e83d14acabe32d91602d2365d/2600-0.txt` — Natasha as a character. No disputed first-publication year is asserted.
- William Shakespeare, The Taming of the Shrew: `https://raw.githubusercontent.com/GITenberg/The-Taming-of-the-Shrew_1508/96e0ca4610a55aecfd8be731c82ba50021829e4c/1508-0.txt` — Kate/Katherine character relation.
- Charles Dickens, A Christmas Carol: `https://raw.githubusercontent.com/GITenberg/A-Christmas-Carol_46/b173bd3787848ecbded8d036ed9f5326c738da19/46-0.txt` — Tiny Tim as Bob Cratchit's son.

Eleven further candidate hooks came from actually read pinned Wikipedia work/bearer articles paired with the dictionary. Twelve new identities and two replacements were selected from the 16-row literary artifact, SHA256 `dd830109e8673bfcc76d70ea6f4cc58ac818310a81a09006c81a793ec5284efe`; its full audit is SHA256 `b4f27f673ba7b05403cc08184a5e1bf6f59631b9fc07cc5f8a22c8888634a654`. Existing Robin/Robert and Garrett/Gerard facts were preferred to duplicate alternate hooks. Todd's surname fox meaning adds one more individually scoped Wikipedia/dictionary pair. Reference prose licenses remain separate from original factual statements and MIT scripts.
