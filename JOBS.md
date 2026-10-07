# JOBS: content packs

Every pack is JSON data built by a script from open sources, offline-safe (no fetching at play time), with a JSON Schema, about 500+ rows unless the job says otherwise, and a "huh!" fact line per row (one short, surprising, true sentence, max 90 characters, sourced).

## C01 Emergency Room
"How many people went to US emergency rooms because of this last year?" From NEISS (CPSC) public data: product, national estimate, year, plus a fun short label ("Toilets", "Ladders"). Balance: spread from tens to millions, no gross-out rows.

## C02 Dead or Alive
Famous people from Wikidata (sitelinks >= 60 so most people know them), alive or dead as of the build date, plus a portrait with a free licence from Wikimedia Commons (store URL, author, licence; download and resize to 512 px webp under 40 KB each). Exclude anyone who died in the last 30 days. Rebuild script refreshes status.

## C03 Internet Famous
Pairs of Wikipedia articles with last-month pageviews (Wikimedia REST API), chosen so pairs are close enough to be hard (ratio 1.2-3x) and both are household names.

## C04 Ancient or IKEA
Open-access museum objects (Met Open Access CC0, Art Institute of Chicago CC0, Smithsonian CC0): image, title, date range, century. Prefer objects that look surprisingly modern or surprisingly old. Same image rules as C02.

## C05 Name Your Baby
US SSA baby names: name, peak decade, peak count, and a sparkline series per decade. Pick names with a clear peak and broad recognition.

## C06 Real Town or Fake
Real oddly-named places (GeoNames, CC-BY) with country and population, plus 300 original fake names you wrote that sound equally plausible. Blind-test: list mixed names, and drop any fake that a fresh model instance can spot at over 70%.

## C07 Patent Pending
Public-domain US patent drawings (pre-1927 or USPTO public data) with the real title and a plain-English one-liner; pick weird, funny inventions. Same image rules.

## C08 Do Not Use
Real product recalls (CPSC, NHTSA public data): product, plain-English reason, year. Funny or surprising only; nothing involving child deaths.

## C09 How-to-play scripts
A 60-90 second spoken how-to-play script for each game: Uno, Ticket to Ride, Clue, Yahtzee, Rummikub, Phase 10, Battleship, Chess, Secret Hitler, then the party games (a drawing telephone game, a fill-in-the-blank comedy game, a trivia lightning round, a hidden-imposter word game, a bluffing auction, a guess-the-crowd survey game, a quote-guessing game, a fake-answer bluff game). For each: the script split into 6-10 beats, each beat with what the TV should show and what the phone should show, plus 3 "common mistakes" lines. Read the official rules (2 sources) and the best-rated teaching videos' structure first; never copy their wording.
