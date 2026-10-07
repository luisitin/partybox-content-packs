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

## Explicit selected source contract and 375 reviewed facts

The original top-count candidate contract above is retained as research history. The current fixture now uses `fixtures/selection.json`, an explicit 500-ID editorial manifest with SHA256 `2d61d267cc4e711d3d3d09d5232ba22995447175bfad7dcd3f82118258b6fab2`. Replace only the 13 held spellings with the 13 reserves named in CONFLICTS. The extractor independently rechecks every selected category/name against the complete unchanged official ZIP, using the same >=50,000 total and exact >=115% peak clarity. Selected ordering is published total, ASCII name and category. No counts were hand-edited and no source checksum was weakened.

Fresh source generation actually completed exit 0 and agrees byte-for-byte in SHA with the independently computed off-repository proposal: **64,262** annual rows, **214 M / 286 F** names, total **151,696,279** published occurrences. Normalized fixture SHA256 is now `fd96fecb43209ce8639bc47185c686fcc2157cdae052cbae3c10e582ce88b0e2`, 6,039,221 bytes. Every annual row for all 487 retained identities is unchanged. The same five partial-2020 peaks are retained. The official archive, publisher license declaration, coverage and source limitations are unchanged. Manifest and annual fixture are both strict-schema checked and checksum pinned.

All 13 reserves have separately read fact pairs: eleven from the already attributed public-domain dictionaries/books and two from actually fetched pinned Wikipedia bodies, each compared with the modern dictionary. Reserve curation artifact SHA256 `950d984f96ce46bf2a7edcbd6f3c21612a0de66ce83446799a2f428d16e6c1ca`; audit SHA256 `874b07cd85aecf26cbed0f09040e66172835ce91f2db906e14c6db68317a0285`. The title Homer is conservatively described as traditionally associated with the Odyssey; no certainty about the historical author's identity is asserted. Tabitha's revival is explicitly a biblical story, not a measured historical event.

Six additional source-family gaps used the actual Yonge/dictionary bodies, artifact SHA256 `bc4c9fde7be78f8944d5b5a4600829a13840abaa86888a4c5b403f760b64ee2a`. Five earlier uncertain or weaker facts were upgraded with actually read bearer/film/primary literary bodies, artifact SHA256 `0dc3a33e09470ba247ef848949cdc7ead533157dce7169c5f8460eb7ae23b10c`, with exact pinned URLs retained per row. Primary additions include James Fenimore Cooper's The Last of the Mohicans and Philip Sidney's Astrophel and Stella, using the pinned public-domain deliveries in the curation references. Kate's supporting dictionary excerpt was clarified without changing its fact or count.

Thirteen further original selected identities use actually read independent bearer, city, river, myth or name articles: Carol, Virginia, Arthur, Bruce, Wayne, Shannon, Clyde, Lincoln, Brooklyn, Luna, Trinity, Erin and Camila. Curation artifact SHA256 `5ad179fec96f1246203915fd1d8bbe2badcb205a04a1f642cbcf2fac09c858dd`; full audit SHA256 `5da843bcab4a27a4618c221f071f4ac1be24b0a1323c13eb35ecc57bcfd644a1`. Linked descriptions from the same dictionary are attributed to one author/work, not counted as independent corroboration. Narrow Erin wording avoids its sources' genitive/dative discrepancy; Arthur explicitly retains uncertain meaning.

The current reviewed candidate pack has **375** independently authored fact pairs and **125** missing facts, with **500** explicit editorial recognition accepts. Complete remains false. All 500 numeric rows match its separately regenerated base pack. Older coverage totals above describe their actual earlier milestones; they are not current missing-field claims.

## Additional lexical research and retained reference notice

The next, not-yet-integrated research batch actually read Princeton WordNet3.1 noun synsets from the immutable npm distribution https://registry.npmjs.org/wordnet-db/-/wordnet-db-3.1.14.tgz. Registry integrity and archive members were checked by the researcher; selected data.noun SHA256 is2cad22fe43461ee7ae61a564ae6a518c57445c8597e53542caddb5c26a6a5d94. Root independently checked byte offsets for its selected Dale, Brady and Lynn evidence. The database is Princeton's authored work; the npm wrapper's MIT terms do not license the database. The following complete notice accompanies any redistributed definition excerpts in this folder. Notice SHA256 is5d6a235d57cc076574f81156ff7211c5dff22914219994ffa29f6fd1c30feeb7.

Other actual-read lexical deliveries are pinned Wiktionary corpora and public-domain Webster conversion. Exact article/corpus URLs and provenance are retained in the pending per-row artifacts/audits; accepted references will enter the current URL index. All Wiktionary mirrors are treated as one corporate author group. The unusual Summer arithmetic definition remains held for unclear source dependence; lack of import attribution in a stripped mirror is not proof of independent authorship. No full dictionary or prose dataset is copied into this repository.

```text
This software and database is being provided to you, the LICENSEE, by
Princeton University under the following license.  By obtaining, using
and/or copying this software and database, you agree that you have
read, understood, and will comply with these terms and conditions.:

Permission to use, copy, modify and distribute this software and
database and its documentation for any purpose and without fee or
royalty is hereby granted, provided that you agree to comply with
the following copyright notice and statements, including the disclaimer,
and that the same appear on ALL copies of the software, database and
documentation, including modifications that you make for internal
use or for distribution.

WordNet 3.1 Copyright 2011 by Princeton University.  All rights reserved.

THIS SOFTWARE AND DATABASE IS PROVIDED "AS IS" AND PRINCETON
UNIVERSITY MAKES NO REPRESENTATIONS OR WARRANTIES, EXPRESS OR
IMPLIED.  BY WAY OF EXAMPLE, BUT NOT LIMITATION, PRINCETON
UNIVERSITY MAKES NO REPRESENTATIONS OR WARRANTIES OF MERCHANT-
ABILITY OR FITNESS FOR ANY PARTICULAR PURPOSE OR THAT THE USE
OF THE LICENSED SOFTWARE, DATABASE OR DOCUMENTATION WILL NOT
INFRINGE ANY THIRD PARTY PATENTS, COPYRIGHTS, TRADEMARKS OR
OTHER RIGHTS.

The name of Princeton University or Princeton may not be used in
advertising or publicity pertaining to distribution of the software
and/or database.  Title to copyright in this software, database and
any associated documentation shall at all times remain with
Princeton University and LICENSEE agrees to preserve same.
```

## Current fact-source URL index

Generated from the current curated references. Each entry names the actually read authored work and the selected identities whose narrow facts or supporting quotations were taken. References sharing one dictionary URL remain one authored work, even when linked headwords differ. Licenses and source limitations are described above.

- Wikipedia contributors, Rudolph the Red-Nosed Reindeer (revision 1375906177): https://en.wikipedia.org/w/index.php?oldid=1375906177 — took fact support for ssa:M:Rudolph.
- Wikipedia contributors, James Otis Jr. (revision 1377740774): https://en.wikipedia.org/w/index.php?oldid=1377740774 — took fact support for ssa:M:Otis.
- Wikipedia contributors, Éire: https://en.wikipedia.org/w/index.php?title=%C3%89ire&oldid=1369720917 — took fact support for ssa:F:Erin.
- Wikipedia contributors, A Streetcar Named Desire: https://en.wikipedia.org/w/index.php?title=A+Streetcar+Named+Desire&oldid=1379011972 — took fact support for ssa:M:Stanley.
- Wikipedia contributors, Aaliyah (given name): https://en.wikipedia.org/w/index.php?title=Aaliyah+%28given+name%29&oldid=1376500520 — took fact support for ssa:F:Aaliyah.
- Wikipedia contributors, Abigail (name), revision 1375858862: https://en.wikipedia.org/w/index.php?title=Abigail+%28name%29&oldid=1375858862 — took fact support for ssa:F:Abigail.
- Wikipedia contributors, Addison (given name): https://en.wikipedia.org/w/index.php?title=Addison+%28given+name%29&oldid=1364877729 — took fact support for ssa:F:Addison.
- Wikipedia contributors, Aidan: https://en.wikipedia.org/w/index.php?title=Aidan&oldid=1375425784 — took fact support for ssa:M:Aidan.
- Wikipedia contributors, Alison (given name); Alison (given name), revision 1372892446: https://en.wikipedia.org/w/index.php?title=Alison+%28given+name%29&oldid=1372892446 — took fact support for ssa:F:Alison, ssa:F:Allison.
- Wikipedia contributors, Alvin (given name): https://en.wikipedia.org/w/index.php?title=Alvin+%28given+name%29&oldid=1378438046 — took fact support for ssa:M:Alvin.
- Wikipedia contributors, Amanda, revision 1369199109: https://en.wikipedia.org/w/index.php?title=Amanda&oldid=1369199109 — took fact support for ssa:F:Amanda.
- Wikipedia contributors, Amber (given name), revision 1374380411: https://en.wikipedia.org/w/index.php?title=Amber+%28given+name%29&oldid=1374380411 — took fact support for ssa:F:Amber.
- Wikipedia contributors, Annette (given name): https://en.wikipedia.org/w/index.php?title=Annette+%28given+name%29&oldid=1372814113 — took fact support for ssa:F:Annette.
- Wikipedia contributors, Arthur: https://en.wikipedia.org/w/index.php?title=Arthur&oldid=1371175958 — took fact support for ssa:M:Arthur.
- Wikipedia contributors, Ava (given name), revision 1364096158: https://en.wikipedia.org/w/index.php?title=Ava+%28given+name%29&oldid=1364096158 — took fact support for ssa:F:Ava.
- Wikipedia contributors, Avery (given name): https://en.wikipedia.org/w/index.php?title=Avery+%28given+name%29&oldid=1375088562 — took fact support for ssa:F:Avery.
- Wikipedia contributors, Barry (name): https://en.wikipedia.org/w/index.php?title=Barry+%28name%29&oldid=1377564378 — took fact support for ssa:M:Barry.
- Wikipedia contributors, Billie (given name): https://en.wikipedia.org/w/index.php?title=Billie+%28given+name%29&oldid=1378625822 — took fact support for ssa:F:Billie.
- Wikipedia contributors, Bobby (given name), revision 1375910622: https://en.wikipedia.org/w/index.php?title=Bobby+%28given+name%29&oldid=1375910622 — took fact support for ssa:M:Bobby.
- Wikipedia contributors, Brenda, revision 1375354675: https://en.wikipedia.org/w/index.php?title=Brenda&oldid=1375354675 — took fact support for ssa:F:Brenda.
- Wikipedia contributors, Brett: https://en.wikipedia.org/w/index.php?title=Brett&oldid=1368523097 — took fact support for ssa:M:Brett.
- Wikipedia contributors, Brian Boru: https://en.wikipedia.org/w/index.php?title=Brian+Boru&oldid=1372348261 — took fact support for ssa:M:Brian.
- Wikipedia contributors, Brianna: https://en.wikipedia.org/w/index.php?title=Brianna&oldid=1378589479 — took fact support for ssa:F:Briana.
- Wikipedia contributors, Brooklyn: https://en.wikipedia.org/w/index.php?title=Brooklyn&oldid=1378366685 — took fact support for ssa:F:Brooklyn.
- Wikipedia contributors, Buffalo Bill: https://en.wikipedia.org/w/index.php?title=Buffalo+Bill&oldid=1376840231 — took fact support for ssa:M:Cody.
- Wikipedia contributors, Byron (name): https://en.wikipedia.org/w/index.php?title=Byron+%28name%29&oldid=1376833298 — took fact support for ssa:M:Byron.
- Wikipedia contributors, Caitlin: https://en.wikipedia.org/w/index.php?title=Caitlin&oldid=1373695301 — took fact support for ssa:F:Caitlin.
- Wikipedia contributors, Cameron (given name), revision 1373359678: https://en.wikipedia.org/w/index.php?title=Cameron+%28given+name%29&oldid=1373359678 — took fact support for ssa:M:Cameron.
- Wikipedia contributors, Camilla (given name): https://en.wikipedia.org/w/index.php?title=Camilla+%28given+name%29&oldid=1376621444 — took fact support for ssa:F:Camila.
- Wikipedia contributors, Carmen (given name): https://en.wikipedia.org/w/index.php?title=Carmen+%28given+name%29&oldid=1376802627 — took fact support for ssa:F:Carmen.
- Wikipedia contributors, Chelsea (given name): https://en.wikipedia.org/w/index.php?title=Chelsea+%28given+name%29&oldid=1373977003 — took fact support for ssa:F:Chelsea.
- Wikipedia contributors, Clarence (given name): https://en.wikipedia.org/w/index.php?title=Clarence+%28given+name%29&oldid=1375079949 — took fact support for ssa:M:Clarence.
- Wikipedia contributors, Cory: https://en.wikipedia.org/w/index.php?title=Cory&oldid=1374283337 — took fact support for ssa:M:Cory.
- Wikipedia contributors, Courtney (given name): https://en.wikipedia.org/w/index.php?title=Courtney+%28given+name%29&oldid=1378470962 — took fact support for ssa:F:Courtney.
- Wikipedia contributors, Craig (given name): https://en.wikipedia.org/w/index.php?title=Craig+%28given+name%29&oldid=1378561216 — took fact support for ssa:M:Craig.
- Wikipedia contributors, Crystal (name), revision 1350536925: https://en.wikipedia.org/w/index.php?title=Crystal+%28name%29&oldid=1350536925 — took fact support for ssa:F:Crystal.
- Wikipedia contributors, Cynthia, revision 1374492544: https://en.wikipedia.org/w/index.php?title=Cynthia&oldid=1374492544 — took fact support for ssa:F:Cynthia.
- Wikipedia contributors, Dakota (given name): https://en.wikipedia.org/w/index.php?title=Dakota+%28given+name%29&oldid=1376159100 — took fact support for ssa:M:Dakota.
- Wikipedia contributors, Darlene (given name): https://en.wikipedia.org/w/index.php?title=Darlene+%28given+name%29&oldid=1369328423 — took fact support for ssa:F:Darlene.
- Wikipedia contributors, Darryl: https://en.wikipedia.org/w/index.php?title=Darryl&oldid=1331368383 — took fact support for ssa:M:Darryl.
- Wikipedia contributors, Deanna: https://en.wikipedia.org/w/index.php?title=Deanna&oldid=1375873278 — took fact support for ssa:F:Deanna.
- Wikipedia contributors, Destiny (given name): https://en.wikipedia.org/w/index.php?title=Destiny+%28given+name%29&oldid=1370659265 — took fact support for ssa:F:Destiny.
- Wikipedia contributors, Diana (given name), revision 1373637681: https://en.wikipedia.org/w/index.php?title=Diana+%28given+name%29&oldid=1373637681 — took fact support for ssa:F:Diana.
- Wikipedia contributors, Doris (given name), revision 1370933585: https://en.wikipedia.org/w/index.php?title=Doris+%28given+name%29&oldid=1370933585 — took fact support for ssa:F:Doris.
- Wikipedia contributors, Dustin (name): https://en.wikipedia.org/w/index.php?title=Dustin+%28name%29&oldid=1363198364 — took fact support for ssa:M:Dustin.
- Wikipedia contributors, Earl (given name): https://en.wikipedia.org/w/index.php?title=Earl+%28given+name%29&oldid=1375956668 — took fact support for ssa:M:Earl.
- Wikipedia contributors, Eli (name): https://en.wikipedia.org/w/index.php?title=Eli+%28name%29&oldid=1376067645 — took fact support for ssa:M:Eli.
- Wikipedia contributors, Elmer: https://en.wikipedia.org/w/index.php?title=Elmer&oldid=1373655972 — took fact support for ssa:M:Elmer.
- Wikipedia contributors, Erika (given name): https://en.wikipedia.org/w/index.php?title=Erika+%28given+name%29&oldid=1374081191 — took fact support for ssa:F:Erica.
- Wikipedia contributors, Eugene (given name), revision 1374198892: https://en.wikipedia.org/w/index.php?title=Eugene+%28given+name%29&oldid=1374198892 — took fact support for ssa:M:Eugene.
- Wikipedia contributors, Evelyn (name), revision 1370229928: https://en.wikipedia.org/w/index.php?title=Evelyn+%28name%29&oldid=1370229928 — took fact support for ssa:F:Evelyn.
- Wikipedia contributors, Francis (given name): https://en.wikipedia.org/w/index.php?title=Francis+%28given+name%29&oldid=1373690698 — took fact support for ssa:M:Francis.
- Wikipedia contributors, Gary Cooper: https://en.wikipedia.org/w/index.php?title=Gary+Cooper&oldid=1377500722 — took fact support for ssa:M:Gary.
- Wikipedia contributors, Giovanni (name): https://en.wikipedia.org/w/index.php?title=Giovanni+%28name%29&oldid=1379042424 — took fact support for ssa:M:Giovanni.
- Wikipedia contributors, Gloria (given name), revision 1372872648: https://en.wikipedia.org/w/index.php?title=Gloria+%28given+name%29&oldid=1372872648 — took fact support for ssa:F:Gloria.
- Wikipedia contributors, Guy (given name): https://en.wikipedia.org/w/index.php?title=Guy+%28given+name%29&oldid=1369372447 — took fact support for ssa:M:Guy.
- Wikipedia contributors, Gwendolyn: https://en.wikipedia.org/w/index.php?title=Gwendolyn&oldid=1372452288 — took fact support for ssa:F:Gwendolyn.
- Wikipedia contributors, Haley (given name): https://en.wikipedia.org/w/index.php?title=Haley+%28given+name%29&oldid=1373187707 — took fact support for ssa:F:Haley.
- Wikipedia contributors, Harper (name): https://en.wikipedia.org/w/index.php?title=Harper+%28name%29&oldid=1375702321 — took fact support for ssa:F:Harper.
- Wikipedia contributors, Harrison (name): https://en.wikipedia.org/w/index.php?title=Harrison+%28name%29&oldid=1376380422 — took fact support for ssa:M:Harrison.
- Wikipedia contributors, Hayden (given name): https://en.wikipedia.org/w/index.php?title=Hayden+%28given+name%29&oldid=1369785778 — took fact support for ssa:M:Hayden.
- Wikipedia contributors, Hayley: https://en.wikipedia.org/w/index.php?title=Hayley&oldid=1343360687 — took fact support for ssa:F:Hailey.
- Wikipedia contributors, Helen (given name), revision 1377605126: https://en.wikipedia.org/w/index.php?title=Helen+%28given+name%29&oldid=1377605126 — took fact support for ssa:F:Helen.
- Wikipedia contributors, Hope (given name): https://en.wikipedia.org/w/index.php?title=Hope+%28given+name%29&oldid=1373212860 — took fact support for ssa:F:Hope.
- Wikipedia contributors, Howard, revision 1375917056: https://en.wikipedia.org/w/index.php?title=Howard&oldid=1375917056 — took fact support for ssa:M:Howard.
- Wikipedia contributors, Irene (given name), revision 1378410208: https://en.wikipedia.org/w/index.php?title=Irene+%28given+name%29&oldid=1378410208 — took fact support for ssa:F:Irene.
- Wikipedia contributors, Ivy (name): https://en.wikipedia.org/w/index.php?title=Ivy+%28name%29&oldid=1363689710 — took fact support for ssa:F:Ivy.
- Wikipedia contributors, Jackson (given name): https://en.wikipedia.org/w/index.php?title=Jackson+%28given+name%29&oldid=1375286805 — took fact support for ssa:M:Jackson.
- Wikipedia contributors, James Stewart: https://en.wikipedia.org/w/index.php?title=James+Stewart&oldid=1378188306 — took fact support for ssa:M:Jimmy.
- Wikipedia contributors, Jasmine (given name): https://en.wikipedia.org/w/index.php?title=Jasmine+%28given+name%29&oldid=1377970744 — took fact support for ssa:F:Jasmine.
- Wikipedia contributors, Jay (given name): https://en.wikipedia.org/w/index.php?title=Jay+%28given+name%29&oldid=1377760036 — took fact support for ssa:M:Jay.
- Wikipedia contributors, Jayden: https://en.wikipedia.org/w/index.php?title=Jayden&oldid=1378377910 — took fact support for ssa:M:Jayden.
- Wikipedia contributors, Jeanne (given name): https://en.wikipedia.org/w/index.php?title=Jeanne+%28given+name%29&oldid=1372352886 — took fact support for ssa:F:Jeanne.
- Wikipedia contributors, Jennifer (given name), revision 1378217807: https://en.wikipedia.org/w/index.php?title=Jennifer+%28given+name%29&oldid=1378217807 — took fact support for ssa:F:Jennifer.
- Wikipedia contributors, Joan (given name), revision 1373221583: https://en.wikipedia.org/w/index.php?title=Joan+%28given+name%29&oldid=1373221583 — took fact support for ssa:F:Joan.
- Wikipedia contributors, John Wayne: https://en.wikipedia.org/w/index.php?title=John+Wayne&oldid=1373511227 — took fact support for ssa:F:Marion.
- Wikipedia contributors, Joyce (name), revision 1376104618: https://en.wikipedia.org/w/index.php?title=Joyce+%28name%29&oldid=1376104618 — took fact support for ssa:F:Joyce.
- Wikipedia contributors, Julie (given name), revision 1378861771: https://en.wikipedia.org/w/index.php?title=Julie+%28given+name%29&oldid=1378861771 — took fact support for ssa:F:Julie.
- Wikipedia contributors, June (given name): https://en.wikipedia.org/w/index.php?title=June+%28given+name%29&oldid=1377135405 — took fact support for ssa:F:June.
- Wikipedia contributors, Kara (name): https://en.wikipedia.org/w/index.php?title=Kara+%28name%29&oldid=1374069771 — took fact support for ssa:F:Kara.
- Wikipedia contributors, Karen (name), revision 1378735009: https://en.wikipedia.org/w/index.php?title=Karen+%28name%29&oldid=1378735009 — took fact support for ssa:F:Karen.
- Wikipedia contributors, Katherine, revision 1362740352: https://en.wikipedia.org/w/index.php?title=Katherine&oldid=1362740352 — took fact support for ssa:F:Catherine.
- Wikipedia contributors, Kay (Arthurian legend): https://en.wikipedia.org/w/index.php?title=Kay+%28Arthurian+legend%29&oldid=1376692431 — took fact support for ssa:F:Kay.
- Wikipedia contributors, Keith (given name), revision 1378696496: https://en.wikipedia.org/w/index.php?title=Keith+%28given+name%29&oldid=1378696496 — took fact support for ssa:M:Keith.
- Wikipedia contributors, Kelly (given name): https://en.wikipedia.org/w/index.php?title=Kelly+%28given+name%29&oldid=1376830143 — took fact support for ssa:M:Kelly.
- Wikipedia contributors, Kennedy (given name): https://en.wikipedia.org/w/index.php?title=Kennedy+%28given+name%29&oldid=1365657341 — took fact support for ssa:F:Kennedy.
- Wikipedia contributors, Kenneth, revision 1368128603: https://en.wikipedia.org/w/index.php?title=Kenneth&oldid=1368128603 — took fact support for ssa:M:Kenneth.
- Wikipedia contributors, Kevin, revision 1378375374: https://en.wikipedia.org/w/index.php?title=Kevin&oldid=1378375374 — took fact support for ssa:M:Kevin.
- Wikipedia contributors, King of Romania: https://en.wikipedia.org/w/index.php?title=King+of+Romania&oldid=1377721785 — took fact support for ssa:F:Carol.
- Wikipedia contributors, Kyle (given name), revision 1375512007: https://en.wikipedia.org/w/index.php?title=Kyle+%28given+name%29&oldid=1375512007 — took fact support for ssa:M:Kyle.
- Wikipedia contributors, Kylie (name): https://en.wikipedia.org/w/index.php?title=Kylie+%28name%29&oldid=1368634401 — took fact support for ssa:F:Kylie.
- Wikipedia contributors, Leila (name): https://en.wikipedia.org/w/index.php?title=Leila+%28name%29&oldid=1378627164 — took fact support for ssa:F:Layla.
- Wikipedia contributors, Leonardo (given name): https://en.wikipedia.org/w/index.php?title=Leonardo+%28given+name%29&oldid=1367466461 — took fact support for ssa:M:Leonardo.
- Wikipedia contributors, Levi (given name): https://en.wikipedia.org/w/index.php?title=Levi+%28given+name%29&oldid=1375448238 — took fact support for ssa:M:Levi.
- Wikipedia contributors, Liam, revision 1377250999: https://en.wikipedia.org/w/index.php?title=Liam&oldid=1377250999 — took fact support for ssa:M:Liam.
- Wikipedia contributors, Lily (name): https://en.wikipedia.org/w/index.php?title=Lily+%28name%29&oldid=1375379358 — took fact support for ssa:F:Lily.
- Wikipedia contributors, Lincoln, England: https://en.wikipedia.org/w/index.php?title=Lincoln%2C+England&oldid=1378838526 — took fact support for ssa:M:Lincoln.
- Wikipedia contributors, Lindsay (name): https://en.wikipedia.org/w/index.php?title=Lindsay+%28name%29&oldid=1363758511 — took fact support for ssa:F:Lindsay, ssa:F:Lindsey.
- Wikipedia contributors, Lloyd (name): https://en.wikipedia.org/w/index.php?title=Lloyd+%28name%29&oldid=1360415808 — took fact support for ssa:M:Lloyd.
- Wikipedia contributors, Lorraine (given name): https://en.wikipedia.org/w/index.php?title=Lorraine+%28given+name%29&oldid=1361767807 — took fact support for ssa:F:Lorraine.
- Wikipedia contributors, Luna (goddess): https://en.wikipedia.org/w/index.php?title=Luna+%28goddess%29&oldid=1354733662 — took fact support for ssa:F:Luna.
- Wikipedia contributors, Lydia (name): https://en.wikipedia.org/w/index.php?title=Lydia+%28name%29&oldid=1378899819 — took fact support for ssa:F:Lydia.
- Wikipedia contributors, Maid Marian: https://en.wikipedia.org/w/index.php?title=Maid+Marian&oldid=1373414662 — took fact support for ssa:F:Marian.
- Wikipedia contributors, Marlene (given name): https://en.wikipedia.org/w/index.php?title=Marlene+%28given+name%29&oldid=1366784374 — took fact support for ssa:F:Marlene.
- Wikipedia contributors, Maxine (given name): https://en.wikipedia.org/w/index.php?title=Maxine+%28given+name%29&oldid=1366334644 — took fact support for ssa:F:Maxine.
- Wikipedia contributors, Melissa, revision 1377075115: https://en.wikipedia.org/w/index.php?title=Melissa&oldid=1377075115 — took fact support for ssa:F:Melissa.
- Wikipedia contributors, Mia (given name), revision 1378323300: https://en.wikipedia.org/w/index.php?title=Mia+%28given+name%29&oldid=1378323300 — took fact support for ssa:F:Mia.
- Wikipedia contributors, Milton (given name): https://en.wikipedia.org/w/index.php?title=Milton+%28given+name%29&oldid=1374243513 — took fact support for ssa:M:Milton.
- Wikipedia contributors, Neil: https://en.wikipedia.org/w/index.php?title=Neil&oldid=1378783744 — took fact support for ssa:M:Neil.
- Wikipedia contributors, Nora (name): https://en.wikipedia.org/w/index.php?title=Nora+%28name%29&oldid=1369543125 — took fact support for ssa:F:Nora.
- Wikipedia contributors, Olivia (name), revision 1377954221: https://en.wikipedia.org/w/index.php?title=Olivia+%28name%29&oldid=1377954221 — took fact support for ssa:F:Olivia.
- Wikipedia contributors, Penelope (given name): https://en.wikipedia.org/w/index.php?title=Penelope+%28given+name%29&oldid=1367467119 — took fact support for ssa:F:Penelope.
- Wikipedia contributors, Peyton Randolph: https://en.wikipedia.org/w/index.php?title=Peyton+Randolph&oldid=1377866405 — took fact support for ssa:F:Peyton.
- Wikipedia contributors, Randall (given name): https://en.wikipedia.org/w/index.php?title=Randall+%28given+name%29&oldid=1375087394 — took fact support for ssa:M:Randall.
- Wikipedia contributors, Riley (given name): https://en.wikipedia.org/w/index.php?title=Riley+%28given+name%29&oldid=1348670075 — took fact support for ssa:F:Riley.
- Wikipedia contributors, River Clyde: https://en.wikipedia.org/w/index.php?title=River+Clyde&oldid=1371217205 — took fact support for ssa:M:Clyde.
- Wikipedia contributors, River Shannon: https://en.wikipedia.org/w/index.php?title=River+Shannon&oldid=1378098391 — took fact support for ssa:F:Shannon.
- Wikipedia contributors, Robert the Bruce: https://en.wikipedia.org/w/index.php?title=Robert+the+Bruce&oldid=1374637320 — took fact support for ssa:M:Bruce.
- Wikipedia contributors, Rodney (name): https://en.wikipedia.org/w/index.php?title=Rodney+%28name%29&oldid=1373913217 — took fact support for ssa:M:Rodney.
- Wikipedia contributors, Ruby (given name), revision 1375235272: https://en.wikipedia.org/w/index.php?title=Ruby+%28given+name%29&oldid=1375235272 — took fact support for ssa:F:Ruby.
- Wikipedia contributors, Ryan (given name), revision 1373620743: https://en.wikipedia.org/w/index.php?title=Ryan+%28given+name%29&oldid=1373620743 — took fact support for ssa:M:Ryan.
- Wikipedia contributors, Samantha, revision 1373051492: https://en.wikipedia.org/w/index.php?title=Samantha&oldid=1373051492 — took fact support for ssa:F:Samantha.
- Wikipedia contributors, Savannah (given name): https://en.wikipedia.org/w/index.php?title=Savannah+%28given+name%29&oldid=1366329102 — took fact support for ssa:F:Savannah.
- Wikipedia contributors, Scarlett (given name): https://en.wikipedia.org/w/index.php?title=Scarlett+%28given+name%29&oldid=1375428344 — took fact support for ssa:F:Scarlett.
- Wikipedia contributors, Shelby (given name): https://en.wikipedia.org/w/index.php?title=Shelby+%28given+name%29&oldid=1320151576 — took fact support for ssa:F:Shelby.
- Wikipedia contributors, Sherri (name): https://en.wikipedia.org/w/index.php?title=Sherri+%28name%29&oldid=1376200054 — took fact support for ssa:F:Sherri.
- Wikipedia contributors, Shirley (name), revision 1360921110: https://en.wikipedia.org/w/index.php?title=Shirley+%28name%29&oldid=1360921110 — took fact support for ssa:F:Shirley.
- Wikipedia contributors, Skyler: https://en.wikipedia.org/w/index.php?title=Skyler&oldid=1364810114 — took fact support for ssa:F:Skylar.
- Wikipedia contributors, Sophia (given name): https://en.wikipedia.org/w/index.php?title=Sophia+%28given+name%29&oldid=1378939956 — took fact support for ssa:F:Sofia.
- Wikipedia contributors, Splash (film): https://en.wikipedia.org/w/index.php?title=Splash+%28film%29&oldid=1372106737 — took fact support for ssa:F:Madison.
- Wikipedia contributors, Tanya (name): https://en.wikipedia.org/w/index.php?title=Tanya+%28name%29&oldid=1372695048 — took fact support for ssa:F:Tanya.
- Wikipedia contributors, Tara (given name): https://en.wikipedia.org/w/index.php?title=Tara+%28given+name%29&oldid=1370379579 — took fact support for ssa:F:Tara.
- Wikipedia contributors, Terry Fox: https://en.wikipedia.org/w/index.php?title=Terry+Fox&oldid=1376524572 — took fact support for ssa:M:Terry.
- Wikipedia contributors, Thelma: https://en.wikipedia.org/w/index.php?title=Thelma&oldid=1377274805 — took fact support for ssa:F:Thelma.
- Wikipedia contributors, Tiffany (given name), revision 1372929220: https://en.wikipedia.org/w/index.php?title=Tiffany+%28given+name%29&oldid=1372929220 — took fact support for ssa:F:Tiffany.
- Wikipedia contributors, Tina (given name): https://en.wikipedia.org/w/index.php?title=Tina+%28given+name%29&oldid=1372368306 — took fact support for ssa:F:Tina.
- Wikipedia contributors, Todd (surname): https://en.wikipedia.org/w/index.php?title=Todd+%28surname%29&oldid=1367054641 — took fact support for ssa:M:Todd.
- Wikipedia contributors, Trevor: https://en.wikipedia.org/w/index.php?title=Trevor&oldid=1362832345 — took fact support for ssa:M:Trevor.
- Wikipedia contributors, Trinity: https://en.wikipedia.org/w/index.php?title=Trinity&oldid=1378148702 — took fact support for ssa:F:Trinity.
- Wikipedia contributors, Troy Donahue: https://en.wikipedia.org/w/index.php?title=Troy+Donahue&oldid=1373457192 — took fact support for ssa:M:Troy.
- Wikipedia contributors, Tyler (name), revision 1378275292: https://en.wikipedia.org/w/index.php?title=Tyler+%28name%29&oldid=1378275292 — took fact support for ssa:M:Tyler.
- Wikipedia contributors, Verginia: https://en.wikipedia.org/w/index.php?title=Verginia&oldid=1368376827 — took fact support for ssa:F:Virginia.
- Wikipedia contributors, Vernon (given name): https://en.wikipedia.org/w/index.php?title=Vernon+%28given+name%29&oldid=1376095402 — took fact support for ssa:M:Vernon.
- Wikipedia contributors, Wanda: https://en.wikipedia.org/w/index.php?title=Wanda&oldid=1376322476 — took fact support for ssa:F:Wanda.
- Wikipedia contributors, Wayne Gretzky: https://en.wikipedia.org/w/index.php?title=Wayne+Gretzky&oldid=1378862813 — took fact support for ssa:M:Wayne.
- Wikipedia contributors, Wendy: https://en.wikipedia.org/w/index.php?title=Wendy&oldid=1374073146 — took fact support for ssa:F:Wendy.
- Wikipedia contributors, Yvonne: https://en.wikipedia.org/w/index.php?title=Yvonne&oldid=1372718483 — took fact support for ssa:F:Yvonne.
- Charles Dickens, A Christmas Carol: https://raw.githubusercontent.com/GITenberg/A-Christmas-Carol_46/b173bd3787848ecbded8d036ed9f5326c738da19/46-0.txt — took fact support for ssa:M:Tim.
- Johanna Spyri, Heidi: https://raw.githubusercontent.com/GITenberg/Heidi_1448/3bbd4c3c6c5486bc199ae7da210cf3f9f8a70f54/1448.txt — took fact support for ssa:F:Heidi.
- Charlotte Mary Yonge, History of Christian Names; History of Christian Names (1884); History of Christian Names, revised edition 1884: https://raw.githubusercontent.com/GITenberg/History-of-Christian-names_70419/e78bed0f0ab05ce6447247be0874dcc502778439/70419-0.txt — took fact support for ssa:F:Alicia, ssa:F:Angelina, ssa:F:Annie, ssa:F:Aubrey, ssa:F:Becky, ssa:F:Bianca, ssa:F:Charlotte, ssa:F:Christine, ssa:F:Claire, ssa:F:Diane, ssa:F:Dolores, ssa:F:Elise, ssa:F:Eliza, ssa:F:Eunice, ssa:F:Gracie, ssa:F:Hilda, ssa:F:Isabelle, ssa:F:Jacqueline, ssa:F:Jamie, ssa:F:Janet, ssa:F:Jenny, ssa:F:Jill, ssa:F:Joanna, ssa:F:Juanita, ssa:F:Judy, ssa:F:Kathleen, ssa:F:Katie, ssa:F:Kristina, ssa:F:Kristine, ssa:F:Laura, ssa:F:Leah, ssa:F:Lisa, ssa:F:Louise, ssa:F:Mabel, ssa:F:Madeline, ssa:F:Maggie, ssa:F:Marie, ssa:F:Meredith, ssa:F:Miranda, ssa:F:Miriam, ssa:F:Monica, ssa:F:Natalie, ssa:F:Pamela, ssa:F:Pauline, ssa:F:Peggy, ssa:F:Penny, ssa:F:Rita, ssa:F:Robin, ssa:F:Sabrina, ssa:F:Sarah, ssa:F:Sophie, ssa:F:Teresa, ssa:F:Valeria, ssa:F:Vera, ssa:F:Willie, ssa:F:Zoe, ssa:M:Alan, ssa:M:Alejandro, ssa:M:Allen, ssa:M:Andy, ssa:M:Bill, ssa:M:Caleb, ssa:M:Charlie, ssa:M:Chris, ssa:M:Colin, ssa:M:Elijah, ssa:M:Fernando, ssa:M:Floyd, ssa:M:Gavin, ssa:M:Harry, ssa:M:Jack, ssa:M:Jeff, ssa:M:Jeffrey, ssa:M:Jeremiah, ssa:M:Jessie, ssa:M:Jesus, ssa:M:Johnny, ssa:M:Jonah, ssa:M:Joshua, ssa:M:Kurt, ssa:M:Lewis, ssa:M:Lucas, ssa:M:Malcolm, ssa:M:Mark, ssa:M:Mateo, ssa:M:Max, ssa:M:Mike, ssa:M:Nathan, ssa:M:Nicolas, ssa:M:Owen, ssa:M:Pablo, ssa:M:Reginald, ssa:M:Shawn, ssa:M:Thomas, ssa:M:Tony.
- Rudyard Kipling, Kim: https://raw.githubusercontent.com/GITenberg/Kim_2226/d6cc0b6a23b03f7de8fb79d361b315fdd0512c17/2226.txt — took fact support for ssa:F:Kim.
- Philip Sidney, Sir P.S.: His Astrophel and Stella: https://raw.githubusercontent.com/GITenberg/Sir-PS-His-Astrophel-and-Stella_56375/efc029e852908516267672ad37699af2e7d68e4c/56375-0.txt — took fact support for ssa:F:Stella.
- James Fenimore Cooper, The Last of the Mohicans: https://raw.githubusercontent.com/GITenberg/The-Last-of-the-Mohicans--A-narrative-of-1757_940/c6c9bcee671cc7ace8e429a7e0e023b12f316fb2/940-0.txt — took fact support for ssa:F:Cora.
- William Shakespeare, The Merchant of Venice: https://raw.githubusercontent.com/GITenberg/The-Merchant-of-Venice_1515/ff93cfa08e815939603801148ca8ccfa7eba78ff/1515.txt — took fact support for ssa:F:Jessica.
- Ernest Weekley, The Romance of Names, third revised edition (1922): https://raw.githubusercontent.com/GITenberg/The-Romance-of-Names_24374/6c60c4f96f0ca92df4eadb3fbbb052a37a1bd6d3/24374.txt — took fact support for ssa:F:Stacey, ssa:M:Bradley, ssa:M:Chester, ssa:M:Cole, ssa:M:Dean, ssa:M:Emmett, ssa:M:Franklin, ssa:M:Garrett, ssa:M:Glen, ssa:M:Grayson, ssa:M:Kirk, ssa:M:Lee, ssa:M:Lester, ssa:M:Parker, ssa:M:Preston, ssa:M:Rick, ssa:M:Spencer, ssa:M:Warren.
- William Shakespeare, The Taming of the Shrew: https://raw.githubusercontent.com/GITenberg/The-Taming-of-the-Shrew_1508/96e0ca4610a55aecfd8be731c82ba50021829e4c/1508-0.txt — took fact support for ssa:F:Kate.
- Leo Tolstoy; English translation by Louise and Aylmer Maude, War and Peace: https://raw.githubusercontent.com/GITenberg/War-and-Peace_2600/fa22ab90f00f627e83d14acabe32d91602d2365d/2600-0.txt — took fact support for ssa:F:Natasha.
- Behind the Name, Behind the Name first-name dictionary, pinned 2021 research distribution: https://raw.githubusercontent.com/jeremander/baby_names/64575a0a450382fc6be272bf87a789a5de7c2bab/names.json — took fact support for ssa:F:Aaliyah, ssa:F:Abigail, ssa:F:Addison, ssa:F:Adeline, ssa:F:Adriana, ssa:F:Alexandra, ssa:F:Alexandria, ssa:F:Alice, ssa:F:Alicia, ssa:F:Alison, ssa:F:Allison, ssa:F:Amanda, ssa:F:Amber, ssa:F:Amelia, ssa:F:Amy, ssa:F:Angela, ssa:F:Angelica, ssa:F:Angelina, ssa:F:Annette, ssa:F:Annie, ssa:F:Ariel, ssa:F:Aubrey, ssa:F:Audrey, ssa:F:Ava, ssa:F:Avery, ssa:F:Barbara, ssa:F:Becky, ssa:F:Bernice, ssa:F:Bianca, ssa:F:Billie, ssa:F:Brenda, ssa:F:Briana, ssa:F:Brooklyn, ssa:F:Caitlin, ssa:F:Camila, ssa:F:Candace, ssa:F:Carla, ssa:F:Carmen, ssa:F:Carol, ssa:F:Catherine, ssa:F:Cecilia, ssa:F:Charlotte, ssa:F:Chelsea, ssa:F:Christina, ssa:F:Christine, ssa:F:Claire, ssa:F:Claudia, ssa:F:Cora, ssa:F:Courtney, ssa:F:Crystal, ssa:F:Cynthia, ssa:F:Darlene, ssa:F:Deanna, ssa:F:Deborah, ssa:F:Destiny, ssa:F:Diana, ssa:F:Diane, ssa:F:Dolores, ssa:F:Donna, ssa:F:Doris, ssa:F:Dorothy, ssa:F:Eleanor, ssa:F:Elise, ssa:F:Eliza, ssa:F:Elizabeth, ssa:F:Ellen, ssa:F:Erica, ssa:F:Erin, ssa:F:Eunice, ssa:F:Evelyn, ssa:F:Faith, ssa:F:Frances, ssa:F:Genesis, ssa:F:Gertrude, ssa:F:Gloria, ssa:F:Grace, ssa:F:Gracie, ssa:F:Gwendolyn, ssa:F:Hailey, ssa:F:Haley, ssa:F:Harper, ssa:F:Harriet, ssa:F:Heidi, ssa:F:Helen, ssa:F:Hilda, ssa:F:Hope, ssa:F:Irene, ssa:F:Isabel, ssa:F:Isabelle, ssa:F:Ivy, ssa:F:Jacqueline, ssa:F:Jamie, ssa:F:Janet, ssa:F:Jasmine, ssa:F:Jeanne, ssa:F:Jennifer, ssa:F:Jenny, ssa:F:Jessica, ssa:F:Jill, ssa:F:Joan, ssa:F:Joanna, ssa:F:Joyce, ssa:F:Juanita, ssa:F:Judith, ssa:F:Judy, ssa:F:Julia, ssa:F:Julie, ssa:F:June, ssa:F:Kara, ssa:F:Karen, ssa:F:Kate, ssa:F:Kathleen, ssa:F:Katie, ssa:F:Kay, ssa:F:Kennedy, ssa:F:Kim, ssa:F:Kristina, ssa:F:Kristine, ssa:F:Kylie, ssa:F:Laura, ssa:F:Layla, ssa:F:Leah, ssa:F:Lily, ssa:F:Lindsay, ssa:F:Lindsey, ssa:F:Lisa, ssa:F:Lorraine, ssa:F:Louise, ssa:F:Lucy, ssa:F:Luna, ssa:F:Lydia, ssa:F:Mabel, ssa:F:Madeline, ssa:F:Madison, ssa:F:Maggie, ssa:F:Marcia, ssa:F:Margaret, ssa:F:Maria, ssa:F:Marian, ssa:F:Marie, ssa:F:Marion, ssa:F:Marlene, ssa:F:Maxine, ssa:F:Melanie, ssa:F:Melissa, ssa:F:Meredith, ssa:F:Mia, ssa:F:Mildred, ssa:F:Miranda, ssa:F:Miriam, ssa:F:Monica, ssa:F:Naomi, ssa:F:Natalie, ssa:F:Natasha, ssa:F:Nicole, ssa:F:Nora, ssa:F:Olivia, ssa:F:Pamela, ssa:F:Pauline, ssa:F:Peggy, ssa:F:Penelope, ssa:F:Penny, ssa:F:Peyton, ssa:F:Regina, ssa:F:Renee, ssa:F:Riley, ssa:F:Rita, ssa:F:Robin, ssa:F:Ruby, ssa:F:Ruth, ssa:F:Sabrina, ssa:F:Samantha, ssa:F:Sara, ssa:F:Sarah, ssa:F:Savannah, ssa:F:Scarlett, ssa:F:Shannon, ssa:F:Shelby, ssa:F:Sherri, ssa:F:Shirley, ssa:F:Skylar, ssa:F:Sofia, ssa:F:Sophia, ssa:F:Sophie, ssa:F:Stacey, ssa:F:Stella, ssa:F:Stephanie, ssa:F:Susan, ssa:F:Tabitha, ssa:F:Tanya, ssa:F:Tara, ssa:F:Teresa, ssa:F:Thelma, ssa:F:Tiffany, ssa:F:Tina, ssa:F:Trinity, ssa:F:Valeria, ssa:F:Vera, ssa:F:Victoria, ssa:F:Virginia, ssa:F:Vivian, ssa:F:Wanda, ssa:F:Wendy, ssa:F:Willie, ssa:F:Yvonne, ssa:F:Zoe, ssa:M:Adam, ssa:M:Aidan, ssa:M:Alan, ssa:M:Albert, ssa:M:Alejandro, ssa:M:Alfred, ssa:M:Allen, ssa:M:Alvin, ssa:M:Andy, ssa:M:Angel, ssa:M:Arthur, ssa:M:Austin, ssa:M:Barry, ssa:M:Bernard, ssa:M:Bill, ssa:M:Bobby, ssa:M:Bradley, ssa:M:Brett, ssa:M:Brian, ssa:M:Bruce, ssa:M:Byron, ssa:M:Caleb, ssa:M:Calvin, ssa:M:Cameron, ssa:M:Cecil, ssa:M:Charlie, ssa:M:Chester, ssa:M:Chris, ssa:M:Christopher, ssa:M:Clarence, ssa:M:Claude, ssa:M:Clyde, ssa:M:Cody, ssa:M:Cole, ssa:M:Colin, ssa:M:Cory, ssa:M:Craig, ssa:M:Dakota, ssa:M:Damian, ssa:M:Daniel, ssa:M:Darryl, ssa:M:Dean, ssa:M:Dennis, ssa:M:Dustin, ssa:M:Earl, ssa:M:Edwin, ssa:M:Eli, ssa:M:Elijah, ssa:M:Elmer, ssa:M:Emmett, ssa:M:Ernest, ssa:M:Ethan, ssa:M:Eugene, ssa:M:Ezra, ssa:M:Fernando, ssa:M:Floyd, ssa:M:Francis, ssa:M:Frank, ssa:M:Franklin, ssa:M:Garrett, ssa:M:Gary, ssa:M:Gavin, ssa:M:George, ssa:M:Gerald, ssa:M:Giovanni, ssa:M:Glen, ssa:M:Grayson, ssa:M:Guy, ssa:M:Harold, ssa:M:Harrison, ssa:M:Harry, ssa:M:Hayden, ssa:M:Herbert, ssa:M:Herman, ssa:M:Homer, ssa:M:Howard, ssa:M:Hugh, ssa:M:Isaiah, ssa:M:Jack, ssa:M:Jackson, ssa:M:Jason, ssa:M:Jay, ssa:M:Jayden, ssa:M:Jeff, ssa:M:Jeffrey, ssa:M:Jeremiah, ssa:M:Jerome, ssa:M:Jesse, ssa:M:Jessie, ssa:M:Jesus, ssa:M:Jimmy, ssa:M:Joel, ssa:M:Johnny, ssa:M:Jonah, ssa:M:Jonathan, ssa:M:Jordan, ssa:M:Josiah, ssa:M:Julian, ssa:M:Justin, ssa:M:Keith, ssa:M:Kelly, ssa:M:Kenneth, ssa:M:Kevin, ssa:M:Kirk, ssa:M:Kurt, ssa:M:Kyle, ssa:M:Lee, ssa:M:Leonard, ssa:M:Leonardo, ssa:M:Lester, ssa:M:Levi, ssa:M:Lewis, ssa:M:Liam, ssa:M:Lincoln, ssa:M:Lloyd, ssa:M:Louis, ssa:M:Lucas, ssa:M:Malcolm, ssa:M:Mark, ssa:M:Mateo, ssa:M:Matthew, ssa:M:Max, ssa:M:Micah, ssa:M:Mike, ssa:M:Milton, ssa:M:Nathan, ssa:M:Nathaniel, ssa:M:Neil, ssa:M:Nicholas, ssa:M:Nicolas, ssa:M:Noah, ssa:M:Omar, ssa:M:Otis, ssa:M:Owen, ssa:M:Pablo, ssa:M:Parker, ssa:M:Philip, ssa:M:Preston, ssa:M:Ralph, ssa:M:Randall, ssa:M:Reginald, ssa:M:Rick, ssa:M:Rodney, ssa:M:Roman, ssa:M:Rudolph, ssa:M:Ryan, ssa:M:Scott, ssa:M:Sebastian, ssa:M:Shawn, ssa:M:Spencer, ssa:M:Stanley, ssa:M:Stephen, ssa:M:Terry, ssa:M:Theodore, ssa:M:Tim, ssa:M:Timothy, ssa:M:Todd, ssa:M:Tony, ssa:M:Trevor, ssa:M:Troy, ssa:M:Tyler, ssa:M:Vernon, ssa:M:Vincent, ssa:M:Walter, ssa:M:Warren, ssa:M:Wayne, ssa:M:Zachary.
- William Smith, Smith's Bible Dictionary; Smith's Bible Dictionary: Alexandria, Or Alexandria; Smith's Bible Dictionary: Bernice, Or Berenice; Smith's Bible Dictionary: Candace, Or Candace; Smith's Bible Dictionary: Ethan; Smith's Bible Dictionary: Ezra; Smith's Bible Dictionary: Genesis; Smith's Bible Dictionary: Jesse; Smith's Bible Dictionary: Joel; Smith's Bible Dictionary: Joshua; Smith's Bible Dictionary: Judith; Smith's Bible Dictionary: Matthew; Smith's Bible Dictionary: Omar; Smith's Bible Dictionary: Ruth; Smith's Bible Dictionary: Thomas and Didymus: https://raw.githubusercontent.com/neuu-org/bible-dictionary-dataset/b8e82aa7ca847f4d97fb432cd965e398a111333c/data/00_raw/ccel/xml/smith_bibledict.xml — took fact support for ssa:F:Alexandria, ssa:F:Ariel, ssa:F:Bernice, ssa:F:Candace, ssa:F:Genesis, ssa:F:Judith, ssa:F:Ruth, ssa:F:Tabitha, ssa:M:Ethan, ssa:M:Ezra, ssa:M:Homer, ssa:M:Jesse, ssa:M:Joel, ssa:M:Joshua, ssa:M:Matthew, ssa:M:Omar, ssa:M:Thomas.
- A. Brown, R. Le Get, N. Shiel, M. Slíz, J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Adam, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Adam — took fact support for ssa:M:Adam.
- J. Pepe, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Adeline, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Adeline — took fact support for ssa:F:Adeline.
- S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Adriana, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Adriana — took fact support for ssa:F:Adriana.
- A. Brown, G. Grim, R. Le Get, J. Pepe, J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Albert, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Albert — took fact support for ssa:M:Albert.
- S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Alexandra, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Alexandra — took fact support for ssa:F:Alexandra.
- S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Alfred, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Alfred — took fact support for ssa:M:Alfred.
- A. Brown, R. Le Get, J. Pepe, N. Shiel, J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Alice, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Alice — took fact support for ssa:F:Alice.
- S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Amelia, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Amelia — took fact support for ssa:F:Amelia.
- J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Amy, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Amy — took fact support for ssa:F:Amy.
- G. Grim, M. Slíz, J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Angel, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Angel — took fact support for ssa:M:Angel.
- S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Angela, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Angela — took fact support for ssa:F:Angela.
- S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Angelica, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Angelica — took fact support for ssa:F:Angelica.
- S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Audrey, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Audrey — took fact support for ssa:F:Audrey.
- A. Brown, G. Grim, J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Austin, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Austin — took fact support for ssa:M:Austin.
- A. Brown, R. Le Get, M. Slíz, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Barbara, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Barbara — took fact support for ssa:F:Barbara.
- A. Brown, G. Grim, R. Le Get, J. Pepe, J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Bernard, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Bernard — took fact support for ssa:M:Bernard.
- S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Calvin, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Calvin — took fact support for ssa:M:Calvin.
- S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Carla, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Carla — took fact support for ssa:F:Carla.
- S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Cecil, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Cecil — took fact support for ssa:M:Cecil.
- A. Brown, R. Le Get, N. Shiel, J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Cecilia, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Cecilia — took fact support for ssa:F:Cecilia.
- R. Le Get, N. Shiel, J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Christina, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Christina — took fact support for ssa:F:Christina.
- R. Le Get, J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Christopher, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Christopher — took fact support for ssa:M:Christopher.
- J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Claude, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Claude — took fact support for ssa:M:Claude.
- S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Claudia, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Claudia — took fact support for ssa:F:Claudia.
- M. Slíz, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Damian, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Damian — took fact support for ssa:M:Damian.
- R. Le Get, M. Slíz, J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Daniel, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Daniel — took fact support for ssa:M:Daniel.
- S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Deborah, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Deborah — took fact support for ssa:F:Deborah.
- A. Brown, G. Grim, R. Le Get, J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Dennis, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Dennis — took fact support for ssa:M:Dennis.
- A. Brown, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Donna, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Donna — took fact support for ssa:F:Donna.
- A. Brown, R. Le Get, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Dorothy, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Dorothy — took fact support for ssa:F:Dorothy.
- S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Edwin, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Edwin — took fact support for ssa:M:Edwin.
- A. Brown, J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Eleanor, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Eleanor — took fact support for ssa:F:Eleanor.
- A. Brown, R. Le Get, J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Elizabeth, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Elizabeth — took fact support for ssa:F:Elizabeth.
- A. Brown, R. Le Get, N. Shiel, J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Ellen, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Ellen — took fact support for ssa:F:Ellen.
- S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Ernest, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Ernest — took fact support for ssa:M:Ernest.
- S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Faith, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Faith — took fact support for ssa:F:Faith.
- A. Brown, J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Frances, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Frances — took fact support for ssa:F:Frances.
- S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Frank, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Frank — took fact support for ssa:M:Frank.
- A. Brown, R. Le Get, N. Shiel, J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: George, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/George — took fact support for ssa:M:George.
- A. Brown, J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Gerald, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Gerald — took fact support for ssa:M:Gerald.
- R. Le Get, J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Gertrude, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Gertrude — took fact support for ssa:F:Gertrude.
- A. Brown, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Grace, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Grace — took fact support for ssa:F:Grace.
- J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Harold, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Harold — took fact support for ssa:M:Harold.
- S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Harriet, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Harriet — took fact support for ssa:F:Harriet.
- S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Herbert, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Herbert — took fact support for ssa:M:Herbert.
- R. Le Get, J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Herman, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Herman — took fact support for ssa:M:Herman.
- G. Grim, J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Hugh, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Hugh — took fact support for ssa:M:Hugh.
- A. Brown, J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Isabel, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Isabel — took fact support for ssa:F:Isabel.
- S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Isaiah, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Isaiah — took fact support for ssa:M:Isaiah.
- S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Jason, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Jason — took fact support for ssa:M:Jason.
- A. Brown, J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Jerome, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Jerome — took fact support for ssa:M:Jerome.
- S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Jonathan, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Jonathan — took fact support for ssa:M:Jonathan.
- J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Jordan, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Jordan — took fact support for ssa:M:Jordan.
- S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Josiah, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Josiah — took fact support for ssa:M:Josiah.
- S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Julia, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Julia — took fact support for ssa:F:Julia.
- J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Julian, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Julian — took fact support for ssa:M:Julian.
- R. Le Get, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Justin, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Justin — took fact support for ssa:M:Justin.
- A. Brown, J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Leonard, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Leonard — took fact support for ssa:M:Leonard.
- R. Le Get, J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Louis, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Louis — took fact support for ssa:M:Louis.
- A. Brown, R. Le Get, J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Lucy, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Lucy — took fact support for ssa:F:Lucy.
- S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Marcia, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Marcia — took fact support for ssa:F:Marcia.
- A. Brown, R. Le Get, N. Shiel, J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Margaret, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Margaret — took fact support for ssa:F:Margaret.
- S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Maria, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Maria — took fact support for ssa:F:Maria.
- S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Melanie, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Melanie — took fact support for ssa:F:Melanie.
- S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Micah, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Micah — took fact support for ssa:M:Micah.
- A. Brown, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Mildred, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Mildred — took fact support for ssa:F:Mildred.
- S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Naomi, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Naomi — took fact support for ssa:F:Naomi.
- R. Le Get, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Nathaniel, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Nathaniel — took fact support for ssa:M:Nathaniel.
- A. Brown, R. Le Get, J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Nicholas, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Nicholas — took fact support for ssa:M:Nicholas.
- J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Nicole, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Nicole — took fact support for ssa:F:Nicole.
- S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Noah, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Noah — took fact support for ssa:M:Noah.
- A. Brown, G. Grim, R. Le Get, J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Philip, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Philip — took fact support for ssa:M:Philip.
- N. Shiel, J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Ralph, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Ralph — took fact support for ssa:M:Ralph.
- S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Regina, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Regina — took fact support for ssa:F:Regina.
- S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Renee, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Renee — took fact support for ssa:F:Renee.
- A. Brown, R. Le Get, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Roman, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Roman — took fact support for ssa:M:Roman.
- A. Brown, J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Sara, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Sara — took fact support for ssa:F:Sara.
- S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Scott, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Scott — took fact support for ssa:M:Scott.
- A. Brown, G. Grim, R. Le Get, J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Sebastian, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Sebastian — took fact support for ssa:M:Sebastian.
- S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Sophia, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Sophia — took fact support for ssa:F:Sophia.
- A. Brown, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Stephanie, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Stephanie — took fact support for ssa:F:Stephanie.
- A. Brown, G. Grim, R. Le Get, J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Stephen, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Stephen — took fact support for ssa:M:Stephen.
- A. Brown, J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Susan, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Susan — took fact support for ssa:F:Susan.
- J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Theodore, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Theodore — took fact support for ssa:M:Theodore.
- R. Le Get, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Timothy, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Timothy — took fact support for ssa:M:Timothy.
- S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Victoria, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Victoria — took fact support for ssa:F:Victoria.
- R. Le Get, J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Vincent, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Vincent — took fact support for ssa:M:Vincent.
- J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Vivian, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Vivian — took fact support for ssa:F:Vivian.
- A. Brown, N. Shiel, J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Walter, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Walter — took fact support for ssa:M:Walter.
- J. Uckelman, S.L. Uckelman, The Dictionary of Medieval Names from European Sources: Zachary, edition 2023.1: https://raw.githubusercontent.com/uckelman/dmnes-dump/f91cf47fa790c3d67e6f028dbae8ebb9a3e35625/2023/1/name/Zachary — took fact support for ssa:M:Zachary.
