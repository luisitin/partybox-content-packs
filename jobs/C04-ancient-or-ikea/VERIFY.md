# Verification

Recorded on 2026-10-07 UTC. Source-access and sample-pipeline evidence is
distinct from the outstanding complete content checks. Normal TLS was
preserved. No original museum photographs are included.

## GitHub and registry fallback research

```sh
curl --silent --show-error --location --max-time 25 --dump-header /tmp/c04-fallback/aic-search.headers --output /tmp/c04-fallback/aic-search.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' 'https://github.com/search?q=artic-api-data&type=repositories'
```

Time: 2026-10-07T15:13:57.751687+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 25 --dump-header /tmp/c04-fallback/met-image-search.headers --output /tmp/c04-fallback/met-image-search.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' 'https://github.com/search?q=metmuseum+images&type=repositories'
```

Time: 2026-10-07T15:13:58.335247+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 25 --dump-header /tmp/c04-fallback/si-image-search.headers --output /tmp/c04-fallback/si-image-search.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' 'https://github.com/search?q=Smithsonian+CC0+images&type=repositories'
```

Time: 2026-10-07T15:13:59.242511+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 25 --dump-header /tmp/c04-fallback/aic-official-data-readme.headers --output /tmp/c04-fallback/aic-official-data-readme.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/art-institute-of-chicago/artic-api-data/master/README.md
```

Time: 2026-10-07T15:13:59.688080+00:00; exit 0; HTTP 404, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 25 --dump-header /tmp/c04-fallback/aic-official-api-readme.headers --output /tmp/c04-fallback/aic-official-api-readme.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/art-institute-of-chicago/artic-api/develop/README.md
```

Time: 2026-10-07T15:14:00.016536+00:00; exit 0; HTTP 404, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 25 --dump-header /tmp/c04-fallback/cooperhewitt-collection-readme.headers --output /tmp/c04-fallback/cooperhewitt-collection-readme.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/master/README.md
```

Time: 2026-10-07T15:14:00.188134+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/aic-org.headers --output /tmp/c04-fallback/aic-org.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' 'https://github.com/orgs/art-institute-of-chicago/repositories?type=all'
```

Time: 2026-10-07T15:14:41.482705+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/aic-dataset-search.headers --output /tmp/c04-fallback/aic-dataset-search.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' 'https://github.com/search?q=%22art+institute+chicago%22+dataset&type=repositories'
```

Time: 2026-10-07T15:14:41.484921+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/met-cc0-search.headers --output /tmp/c04-fallback/met-cc0-search.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' 'https://github.com/search?q=metmuseum+CC0&type=repositories'
```

Time: 2026-10-07T15:14:41.486647+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/si-images-search.headers --output /tmp/c04-fallback/si-images-search.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' 'https://github.com/search?q=smithsonian+images&type=repositories'
```

Time: 2026-10-07T15:14:41.487127+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/enhanced-met-readme.headers --output /tmp/c04-fallback/enhanced-met-readme.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/graslowsnail/metmuseum-api-dump-enhanced/main/README.md
```

Time: 2026-10-07T15:14:41.490634+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/cooperhewitt-objects.headers --output /tmp/c04-fallback/cooperhewitt-objects.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://github.com/cooperhewitt/collection/tree/master/objects/187/042
```

Time: 2026-10-07T15:14:41.864056+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/met-latest-csv.headers --output /tmp/c04-fallback/met-latest-csv.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/metmuseum/openaccess/master/MetObjects.csv
```

Time: 2026-10-07T15:14:42.214798+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/aic-data-page.headers --output /tmp/c04-fallback/aic-data-page.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://github.com/art-institute-of-chicago/api-data
```

Time: 2026-10-07T15:15:27.119603+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/aic-data-readme.headers --output /tmp/c04-fallback/aic-data-readme.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/art-institute-of-chicago/api-data/master/README.md
```

Time: 2026-10-07T15:15:27.120277+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/aic-aggregator-readme.headers --output /tmp/c04-fallback/aic-aggregator-readme.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/art-institute-of-chicago/data-aggregator/master/README.md
```

Time: 2026-10-07T15:15:27.121604+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/aic-embeddings-page.headers --output /tmp/c04-fallback/aic-embeddings-page.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://github.com/art-institute-of-chicago/aic-embeddings-demo
```

Time: 2026-10-07T15:15:27.122442+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/aic-static-page.headers --output /tmp/c04-fallback/aic-static-page.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://github.com/art-institute-of-chicago/static-archive
```

Time: 2026-10-07T15:15:27.123178+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/si-third-party-images-page.headers --output /tmp/c04-fallback/si-third-party-images-page.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://github.com/dqgorelick/smithsonian-images
```

Time: 2026-10-07T15:15:27.465903+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/si-third-party-dataset-page.headers --output /tmp/c04-fallback/si-third-party-dataset-page.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://github.com/TaeyanG4/smithsonian-image-text
```

Time: 2026-10-07T15:15:27.528175+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/aic-image-search.headers --output /tmp/c04-fallback/aic-image-search.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' 'https://github.com/search?q=%22art+institute%22+images&type=repositories'
```

Time: 2026-10-07T15:15:28.211178+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/aic-some-artworks.headers --output /tmp/c04-fallback/aic-some-artworks.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/art-institute-of-chicago/api-data/8936f25879fd688fc2412436e5df4e30402bd081/getting-started/someArtworks.csv
```

Time: 2026-10-07T15:16:00.064550+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/aic-all-artworks.headers --output /tmp/c04-fallback/aic-all-artworks.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/art-institute-of-chicago/api-data/8936f25879fd688fc2412436e5df4e30402bd081/getting-started/allArtworks.jsonl
```

Time: 2026-10-07T15:16:00.065126+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/aic-info.headers --output /tmp/c04-fallback/aic-info.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/art-institute-of-chicago/api-data/8936f25879fd688fc2412436e5df4e30402bd081/json/info.json
```

Time: 2026-10-07T15:16:00.065503+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/aic-data-version.headers --output /tmp/c04-fallback/aic-data-version.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/art-institute-of-chicago/api-data/8936f25879fd688fc2412436e5df4e30402bd081/VERSION
```

Time: 2026-10-07T15:16:00.066012+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/aic-embeddings-public.headers --output /tmp/c04-fallback/aic-embeddings-public.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://github.com/art-institute-of-chicago/aic-embeddings-demo/tree/1cc966a631d52f0a97528a8f19b4f53c095dcf09/public
```

Time: 2026-10-07T15:16:00.074247+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/aic-artworks-tree.headers --output /tmp/c04-fallback/aic-artworks-tree.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://github.com/art-institute-of-chicago/api-data/tree/8936f25879fd688fc2412436e5df4e30402bd081/json/artworks
```

Time: 2026-10-07T15:17:12.989348+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/aic-data-commits.headers --output /tmp/c04-fallback/aic-data-commits.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://github.com/art-institute-of-chicago/api-data/commits/master
```

Time: 2026-10-07T15:17:12.990272+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/si-dataset-archive.headers --output /tmp/c04-fallback/si-dataset-archive.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://codeload.github.com/TaeyanG4/smithsonian-image-text/tar.gz/ff0d2ccf31017a19de4dfae8654f6c54554dbeff
```

Time: 2026-10-07T15:17:12.990559+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/aic-docs-tree.headers --output /tmp/c04-fallback/aic-docs-tree.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://github.com/art-institute-of-chicago/data-aggregator/tree/master/docs
```

Time: 2026-10-07T15:17:12.991112+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 25 --request POST --header 'Accept: application/vnd.git-lfs+json' --header 'Content-Type: application/vnd.git-lfs+json' --data-binary @- --output /tmp/c04-fallback/met-lfs-response.private --dump-header /tmp/c04-fallback/met-lfs-batch.headers --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result}' https://github.com/metmuseum/openaccess.git/info/lfs/objects/batch
```

Time: 2026-10-07T15:17:14.589648+00:00; exit 0; HTTP 403, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/met-csv-direct.headers --output /tmp/c04-fallback/met-csv-direct.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://github.com/metmuseum/openaccess/raw/master/MetObjects.csv
```

Time: 2026-10-07T15:18:04.851004+00:00; exit 56; HTTP 000, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/met-npm-search.headers --output /tmp/c04-fallback/met-npm-search.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' 'https://registry.npmjs.org/-/v1/search?text=metmuseum&size=20'
```

Time: 2026-10-07T15:18:04.851641+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/aic-npm-search.headers --output /tmp/c04-fallback/aic-npm-search.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' 'https://registry.npmjs.org/-/v1/search?text=artic%20museum%20dataset&size=20'
```

Time: 2026-10-07T15:18:04.852134+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/cooperhewitt-root-objects.headers --output /tmp/c04-fallback/cooperhewitt-root-objects.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://github.com/cooperhewitt/collection/tree/master/objects/187
```

Time: 2026-10-07T15:18:04.852597+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/cooperhewitt-roomba.headers --output /tmp/c04-fallback/cooperhewitt-roomba.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/master/objects/187/042/35/18704235.json
```

Time: 2026-10-07T15:18:04.858400+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/cooperhewitt-sample-tree.headers --output /tmp/c04-fallback/cooperhewitt-sample-tree.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://github.com/cooperhewitt/collection/tree/4272b8fa73697845507ff40cafeb19310218c896/objects/187/003
```

Time: 2026-10-07T15:18:48.210717+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/cooperhewitt-commits.headers --output /tmp/c04-fallback/cooperhewitt-commits.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://github.com/cooperhewitt/collection/commits/master
```

Time: 2026-10-07T15:18:48.211283+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/met-npm-package.headers --output /tmp/c04-fallback/met-npm-package.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://registry.npmjs.org/metmuseum/0.0.1-0
```

Time: 2026-10-07T15:18:48.212325+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/aic-artworks-11.headers --output /tmp/c04-fallback/aic-artworks-11.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/art-institute-of-chicago/api-data/8936f25879fd688fc2412436e5df4e30402bd081/json/artworks/11.json
```

Time: 2026-10-07T15:18:48.213271+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/aic-docs-license.headers --output /tmp/c04-fallback/aic-docs-license.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/art-institute-of-chicago/data-aggregator/780e6c86025d5f80387dac7574d0f056bf26ff1a/docs/guide/README.md
```

Time: 2026-10-07T15:18:48.213990+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/met-npm-tar.headers --output /tmp/c04-fallback/met-npm-tar.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://registry.npmjs.org/metmuseum/-/metmuseum-0.0.1-0.tgz
```

Time: 2026-10-07T15:19:54.232958+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/cooperhewitt-sample184001.headers --output /tmp/c04-fallback/cooperhewitt-sample184001.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://github.com/cooperhewitt/collection/tree/4272b8fa73697845507ff40cafeb19310218c896/objects/184/001
```

Time: 2026-10-07T15:19:54.469382+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/cooperhewitt-sample183826.headers --output /tmp/c04-fallback/cooperhewitt-sample183826.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://github.com/cooperhewitt/collection/tree/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826
```

Time: 2026-10-07T15:19:54.470002+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/cooperhewitt-readme-pinned.headers --output /tmp/c04-fallback/cooperhewitt-readme-pinned.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/README.md
```

Time: 2026-10-07T15:19:54.470869+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/met-dataset-search.headers --output /tmp/c04-fallback/met-dataset-search.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' 'https://github.com/search?q=metmuseum+dataset&type=repositories'
```

Time: 2026-10-07T15:20:24.263960+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/aic-data-licensing-guide.headers --output /tmp/c04-fallback/aic-data-licensing-guide.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://github.com/art-institute-of-chicago/data-aggregator/tree/780e6c86025d5f80387dac7574d0f056bf26ff1a/docs/guide
```

Time: 2026-10-07T15:20:24.264600+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/aic-static-vangogh.headers --output /tmp/c04-fallback/aic-static-vangogh.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://github.com/art-institute-of-chicago/static-archive/tree/42e48f843b7eeb4e3bb175487121fffd817b805a/vangogh
```

Time: 2026-10-07T15:20:24.266228+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382601.headers --output /tmp/c04-fallback/ch-object-18382601.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/01/18382601.json
```

Time: 2026-10-07T15:20:57.325816+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382603.headers --output /tmp/c04-fallback/ch-object-18382603.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/03/18382603.json
```

Time: 2026-10-07T15:20:57.326720+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382605.headers --output /tmp/c04-fallback/ch-object-18382605.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/05/18382605.json
```

Time: 2026-10-07T15:20:57.327544+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382607.headers --output /tmp/c04-fallback/ch-object-18382607.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/07/18382607.json
```

Time: 2026-10-07T15:20:57.329768+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382609.headers --output /tmp/c04-fallback/ch-object-18382609.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/09/18382609.json
```

Time: 2026-10-07T15:20:57.330955+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382611.headers --output /tmp/c04-fallback/ch-object-18382611.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/11/18382611.json
```

Time: 2026-10-07T15:20:57.613701+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382613.headers --output /tmp/c04-fallback/ch-object-18382613.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/13/18382613.json
```

Time: 2026-10-07T15:20:57.684889+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382615.headers --output /tmp/c04-fallback/ch-object-18382615.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/15/18382615.json
```

Time: 2026-10-07T15:20:57.694688+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382617.headers --output /tmp/c04-fallback/ch-object-18382617.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/17/18382617.json
```

Time: 2026-10-07T15:20:57.796652+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382619.headers --output /tmp/c04-fallback/ch-object-18382619.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/19/18382619.json
```

Time: 2026-10-07T15:20:57.829225+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382623.headers --output /tmp/c04-fallback/ch-object-18382623.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/23/18382623.json
```

Time: 2026-10-07T15:20:57.943138+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382625.headers --output /tmp/c04-fallback/ch-object-18382625.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/25/18382625.json
```

Time: 2026-10-07T15:20:58.091333+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382627.headers --output /tmp/c04-fallback/ch-object-18382627.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/27/18382627.json
```

Time: 2026-10-07T15:20:58.144161+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382629.headers --output /tmp/c04-fallback/ch-object-18382629.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/29/18382629.json
```

Time: 2026-10-07T15:20:58.168590+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382631.headers --output /tmp/c04-fallback/ch-object-18382631.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/31/18382631.json
```

Time: 2026-10-07T15:20:58.178350+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382633.headers --output /tmp/c04-fallback/ch-object-18382633.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/33/18382633.json
```

Time: 2026-10-07T15:20:58.286100+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382635.headers --output /tmp/c04-fallback/ch-object-18382635.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/35/18382635.json
```

Time: 2026-10-07T15:20:58.423789+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382637.headers --output /tmp/c04-fallback/ch-object-18382637.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/37/18382637.json
```

Time: 2026-10-07T15:20:58.434209+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382639.headers --output /tmp/c04-fallback/ch-object-18382639.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/39/18382639.json
```

Time: 2026-10-07T15:20:58.454679+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382641.headers --output /tmp/c04-fallback/ch-object-18382641.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/41/18382641.json
```

Time: 2026-10-07T15:20:58.501663+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18400101.headers --output /tmp/c04-fallback/ch-object-18400101.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/184/001/01/18400101.json
```

Time: 2026-10-07T15:20:58.576865+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18400103.headers --output /tmp/c04-fallback/ch-object-18400103.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/184/001/03/18400103.json
```

Time: 2026-10-07T15:20:58.709222+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18400105.headers --output /tmp/c04-fallback/ch-object-18400105.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/184/001/05/18400105.json
```

Time: 2026-10-07T15:20:58.731275+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18400107.headers --output /tmp/c04-fallback/ch-object-18400107.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/184/001/07/18400107.json
```

Time: 2026-10-07T15:20:58.773383+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18400109.headers --output /tmp/c04-fallback/ch-object-18400109.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/184/001/09/18400109.json
```

Time: 2026-10-07T15:20:58.800786+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18400111.headers --output /tmp/c04-fallback/ch-object-18400111.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/184/001/11/18400111.json
```

Time: 2026-10-07T15:20:58.813336+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18400113.headers --output /tmp/c04-fallback/ch-object-18400113.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/184/001/13/18400113.json
```

Time: 2026-10-07T15:20:58.983030+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18400115.headers --output /tmp/c04-fallback/ch-object-18400115.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/184/001/15/18400115.json
```

Time: 2026-10-07T15:20:59.039416+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18400117.headers --output /tmp/c04-fallback/ch-object-18400117.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/184/001/17/18400117.json
```

Time: 2026-10-07T15:20:59.066359+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18400119.headers --output /tmp/c04-fallback/ch-object-18400119.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/184/001/19/18400119.json
```

Time: 2026-10-07T15:20:59.110762+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18400121.headers --output /tmp/c04-fallback/ch-object-18400121.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/184/001/21/18400121.json
```

Time: 2026-10-07T15:20:59.189265+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18400123.headers --output /tmp/c04-fallback/ch-object-18400123.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/184/001/23/18400123.json
```

Time: 2026-10-07T15:20:59.285831+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18400125.headers --output /tmp/c04-fallback/ch-object-18400125.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/184/001/25/18400125.json
```

Time: 2026-10-07T15:20:59.306963+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18400127.headers --output /tmp/c04-fallback/ch-object-18400127.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/184/001/27/18400127.json
```

Time: 2026-10-07T15:20:59.351674+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18400129.headers --output /tmp/c04-fallback/ch-object-18400129.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/184/001/29/18400129.json
```

Time: 2026-10-07T15:20:59.398833+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18400131.headers --output /tmp/c04-fallback/ch-object-18400131.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/184/001/31/18400131.json
```

Time: 2026-10-07T15:20:59.466051+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18400133.headers --output /tmp/c04-fallback/ch-object-18400133.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/184/001/33/18400133.json
```

Time: 2026-10-07T15:20:59.563648+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18400135.headers --output /tmp/c04-fallback/ch-object-18400135.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/184/001/35/18400135.json
```

Time: 2026-10-07T15:20:59.619305+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18400137.headers --output /tmp/c04-fallback/ch-object-18400137.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/184/001/37/18400137.json
```

Time: 2026-10-07T15:20:59.627015+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18400139.headers --output /tmp/c04-fallback/ch-object-18400139.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/184/001/39/18400139.json
```

Time: 2026-10-07T15:20:59.732092+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382647.headers --output /tmp/c04-fallback/ch-object-18382647.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/47/18382647.json
```

Time: 2026-10-07T15:22:12.216388+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382649.headers --output /tmp/c04-fallback/ch-object-18382649.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/49/18382649.json
```

Time: 2026-10-07T15:22:12.217110+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382651.headers --output /tmp/c04-fallback/ch-object-18382651.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/51/18382651.json
```

Time: 2026-10-07T15:22:12.217900+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382653.headers --output /tmp/c04-fallback/ch-object-18382653.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/53/18382653.json
```

Time: 2026-10-07T15:22:12.218203+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382655.headers --output /tmp/c04-fallback/ch-object-18382655.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/55/18382655.json
```

Time: 2026-10-07T15:22:12.218445+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382657.headers --output /tmp/c04-fallback/ch-object-18382657.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/57/18382657.json
```

Time: 2026-10-07T15:22:12.581405+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382659.headers --output /tmp/c04-fallback/ch-object-18382659.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/59/18382659.json
```

Time: 2026-10-07T15:22:12.594240+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382661.headers --output /tmp/c04-fallback/ch-object-18382661.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/61/18382661.json
```

Time: 2026-10-07T15:22:12.601393+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382663.headers --output /tmp/c04-fallback/ch-object-18382663.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/63/18382663.json
```

Time: 2026-10-07T15:22:12.620444+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382665.headers --output /tmp/c04-fallback/ch-object-18382665.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/65/18382665.json
```

Time: 2026-10-07T15:22:12.739109+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382667.headers --output /tmp/c04-fallback/ch-object-18382667.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/67/18382667.json
```

Time: 2026-10-07T15:22:13.010403+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382669.headers --output /tmp/c04-fallback/ch-object-18382669.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/69/18382669.json
```

Time: 2026-10-07T15:22:13.069214+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382671.headers --output /tmp/c04-fallback/ch-object-18382671.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/71/18382671.json
```

Time: 2026-10-07T15:22:13.075347+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382673.headers --output /tmp/c04-fallback/ch-object-18382673.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/73/18382673.json
```

Time: 2026-10-07T15:22:13.082146+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382675.headers --output /tmp/c04-fallback/ch-object-18382675.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/75/18382675.json
```

Time: 2026-10-07T15:22:13.272712+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382677.headers --output /tmp/c04-fallback/ch-object-18382677.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/77/18382677.json
```

Time: 2026-10-07T15:22:13.783517+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382679.headers --output /tmp/c04-fallback/ch-object-18382679.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/79/18382679.json
```

Time: 2026-10-07T15:22:13.787293+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382681.headers --output /tmp/c04-fallback/ch-object-18382681.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/81/18382681.json
```

Time: 2026-10-07T15:22:13.789940+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382683.headers --output /tmp/c04-fallback/ch-object-18382683.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/83/18382683.json
```

Time: 2026-10-07T15:22:13.812926+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382685.headers --output /tmp/c04-fallback/ch-object-18382685.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/85/18382685.json
```

Time: 2026-10-07T15:22:13.846392+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382689.headers --output /tmp/c04-fallback/ch-object-18382689.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/89/18382689.json
```

Time: 2026-10-07T15:22:14.051056+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382691.headers --output /tmp/c04-fallback/ch-object-18382691.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/91/18382691.json
```

Time: 2026-10-07T15:22:14.122199+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382693.headers --output /tmp/c04-fallback/ch-object-18382693.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/93/18382693.json
```

Time: 2026-10-07T15:22:14.135163+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382695.headers --output /tmp/c04-fallback/ch-object-18382695.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/95/18382695.json
```

Time: 2026-10-07T15:22:14.147900+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382697.headers --output /tmp/c04-fallback/ch-object-18382697.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/97/18382697.json
```

Time: 2026-10-07T15:22:14.157617+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/ch-object-18382699.headers --output /tmp/c04-fallback/ch-object-18382699.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/objects/183/826/99/18382699.json
```

Time: 2026-10-07T15:22:14.298177+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/github-museum-cc0-search.headers --output /tmp/c04-fallback/github-museum-cc0-search.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' 'https://github.com/search?q=museum+CC0&type=repositories'
```

Time: 2026-10-07T15:22:14.589168+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/met-org-repos.headers --output /tmp/c04-fallback/met-org-repos.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' 'https://github.com/orgs/metmuseum/repositories?type=all'
```

Time: 2026-10-07T15:22:14.589835+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/aic-aggregator-archive.headers --output /tmp/c04-fallback/aic-aggregator-archive.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://codeload.github.com/art-institute-of-chicago/data-aggregator/tar.gz/780e6c86025d5f80387dac7574d0f056bf26ff1a
```

Time: 2026-10-07T15:22:14.591345+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/home-museum-page.headers --output /tmp/c04-fallback/home-museum-page.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://github.com/typewriter/home-museum
```

Time: 2026-10-07T15:23:12.061443+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/museum-scraper-page.headers --output /tmp/c04-fallback/museum-scraper-page.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://github.com/drewlustro/museum-scraper
```

Time: 2026-10-07T15:23:12.062302+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/met-image-search-page.headers --output /tmp/c04-fallback/met-image-search-page.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://github.com/metmuseum/image-search-mvp
```

Time: 2026-10-07T15:23:12.063234+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/moodboard-museum-page.headers --output /tmp/c04-fallback/moodboard-museum-page.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://github.com/livieburton/moodboard-museum
```

Time: 2026-10-07T15:23:12.063621+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/aic-artworks-4.headers --output /tmp/c04-fallback/aic-artworks-4.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/art-institute-of-chicago/api-data/8936f25879fd688fc2412436e5df4e30402bd081/json/artworks/4.json
```

Time: 2026-10-07T15:23:34.742808+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/aic-artworks-9.headers --output /tmp/c04-fallback/aic-artworks-9.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/art-institute-of-chicago/api-data/8936f25879fd688fc2412436e5df4e30402bd081/json/artworks/9.json
```

Time: 2026-10-07T15:23:34.743686+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/aic-artworks-16.headers --output /tmp/c04-fallback/aic-artworks-16.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/art-institute-of-chicago/api-data/8936f25879fd688fc2412436e5df4e30402bd081/json/artworks/16.json
```

Time: 2026-10-07T15:23:34.744248+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/aic-artworks-19.headers --output /tmp/c04-fallback/aic-artworks-19.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/art-institute-of-chicago/api-data/8936f25879fd688fc2412436e5df4e30402bd081/json/artworks/19.json
```

Time: 2026-10-07T15:23:34.744892+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/aic-artworks-20.headers --output /tmp/c04-fallback/aic-artworks-20.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/art-institute-of-chicago/api-data/8936f25879fd688fc2412436e5df4e30402bd081/json/artworks/20.json
```

Time: 2026-10-07T15:23:34.745088+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/pillow-images-readme.headers --output /tmp/c04-fallback/pillow-images-readme.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/python-pillow/Pillow/main/Tests/images/README.txt
```

Time: 2026-10-07T15:24:52.172444+00:00; exit 0; HTTP 404, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/matplotlib-sample-readme.headers --output /tmp/c04-fallback/matplotlib-sample-readme.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/matplotlib/matplotlib/main/lib/matplotlib/mpl-data/sample_data/README.txt
```

Time: 2026-10-07T15:24:52.173061+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/matplotlib-hopper-image.headers --output /tmp/c04-fallback/matplotlib-hopper-image.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/matplotlib/matplotlib/main/lib/matplotlib/mpl-data/sample_data/grace_hopper.jpg
```

Time: 2026-10-07T15:24:52.173895+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/si-dpo-voyager-page.headers --output /tmp/c04-fallback/si-dpo-voyager-page.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://github.com/Smithsonian/dpo-voyager
```

Time: 2026-10-07T15:24:52.174253+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/matplotlib-license.headers --output /tmp/c04-fallback/matplotlib-license.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/matplotlib/matplotlib/main/LICENSE/LICENSE
```

Time: 2026-10-07T15:25:14.612328+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/pillow-copyright.headers --output /tmp/c04-fallback/pillow-copyright.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/python-pillow/Pillow/main/Tests/images/hopper.txt
```

Time: 2026-10-07T15:25:14.612983+00:00; exit 0; HTTP 404, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/matplotlib-hopper-source-search.headers --output /tmp/c04-fallback/matplotlib-hopper-source-search.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' 'https://github.com/search?q=grace_hopper.jpg+public+domain&type=repositories'
```

Time: 2026-10-07T15:25:14.614924+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/matplotlib-image-demo.headers --output /tmp/c04-fallback/matplotlib-image-demo.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/matplotlib/matplotlib/main/galleries/examples/images_contours_and_fields/image_demo.py
```

Time: 2026-10-07T15:25:14.615590+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/hopper-license-github-search.headers --output /tmp/c04-fallback/hopper-license-github-search.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' 'https://github.com/search?q=%22Grace+Hopper%22+%22public+domain%22+in%3Areadme&type=repositories'
```

Time: 2026-10-07T15:26:22.438927+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/hopper-gallery-license.headers --output /tmp/c04-fallback/hopper-gallery-license.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/node-on-fhir/accounts-famous-dead-people/master/README.md
```

Time: 2026-10-07T15:26:56.340974+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/hopper-biography-license.headers --output /tmp/c04-fallback/hopper-biography-license.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/YoussefWael2028/Grace-Hopper/main/README.md
```

Time: 2026-10-07T15:26:56.341694+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/hopper-usgov-license.headers --output /tmp/c04-fallback/hopper-usgov-license.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/DSACMS/dsacms.github.io/main/README.md
```

Time: 2026-10-07T15:26:56.342286+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/si-voyager-attributions.headers --output /tmp/c04-fallback/si-voyager-attributions.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/Smithsonian/dpo-voyager/0ed663383e45693fb31c02cc3cc6067768d44c6a/ATTRIBUTIONS.md
```

Time: 2026-10-07T15:26:56.342602+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/si-voyager-hdr-fixture.headers --output /tmp/c04-fallback/si-voyager-hdr-fixture.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://raw.githubusercontent.com/Smithsonian/dpo-voyager/0ed663383e45693fb31c02cc3cc6067768d44c6a/assets/images/spruit_sunrise_1k_HDR.hdr
```

Time: 2026-10-07T15:27:31.478619+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/si-voyager-images-tree.headers --output /tmp/c04-fallback/si-voyager-images-tree.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://github.com/Smithsonian/dpo-voyager/tree/0ed663383e45693fb31c02cc3cc6067768d44c6a/assets/images
```

Time: 2026-10-07T15:27:31.479914+00:00; exit 0; HTTP 200, TLS verification result 0. Catches reachability, documentation and archive availability. A successful search/download does not establish data/image permission or independent facts.

```sh
curl --silent --show-error --location --max-time 20 --dump-header - --output /dev/null --write-out '\nhttp_code=%{http_code} ssl_verify_result=%{ssl_verify_result} remote_ip=%{remote_ip} url_effective=%{url_effective}\n' 'https://collectionapi.metmuseum.org/public/collection/v1/objects/436121'
```

Time: 2026-10-07 15:05:47 UTC; exit 56; proxy CONNECT 403, origin 000. Catches canonical policy blockage before origin TLS.

```sh
curl --silent --show-error --location --max-time 20 --dump-header - --output /dev/null --write-out '\nhttp_code=%{http_code} ssl_verify_result=%{ssl_verify_result} remote_ip=%{remote_ip} url_effective=%{url_effective}\n' 'https://www.metmuseum.org/art/collection/search/436121'
```

Time: 2026-10-07 15:05:47 UTC; exit 56; proxy CONNECT 403, origin 000. Catches canonical policy blockage before origin TLS.

```sh
curl --silent --show-error --location --max-time 20 --dump-header - --output /dev/null --write-out '\nhttp_code=%{http_code} ssl_verify_result=%{ssl_verify_result} remote_ip=%{remote_ip} url_effective=%{url_effective}\n' 'https://api.artic.edu/api/v1/artworks/129884'
```

Time: 2026-10-07 15:05:47 UTC; exit 56; proxy CONNECT 403, origin 000. Catches canonical policy blockage before origin TLS.

```sh
curl --silent --show-error --location --max-time 20 --dump-header - --output /dev/null --write-out '\nhttp_code=%{http_code} ssl_verify_result=%{ssl_verify_result} remote_ip=%{remote_ip} url_effective=%{url_effective}\n' 'https://www.artic.edu/artworks/129884'
```

Time: 2026-10-07 15:05:47 UTC; exit 56; proxy CONNECT 403, origin 000. Catches canonical policy blockage before origin TLS.

```sh
curl --silent --show-error --location --max-time 20 --dump-header - --output /dev/null --write-out '\nhttp_code=%{http_code} ssl_verify_result=%{ssl_verify_result} remote_ip=%{remote_ip} url_effective=%{url_effective}\n' 'https://www.si.edu/openaccess'
```

Time: 2026-10-07 15:05:47 UTC; exit 56; proxy CONNECT 403, origin 000. Catches canonical policy blockage before origin TLS.

```sh
curl --silent --show-error --location --max-time 20 --dump-header - --output /dev/null --write-out '\nhttp_code=%{http_code} ssl_verify_result=%{ssl_verify_result} remote_ip=%{remote_ip} url_effective=%{url_effective}\n' 'https://api.si.edu/openaccess/api/v1.0/search?q=chair'
```

Time: 2026-10-07 15:05:47 UTC; exit 56; proxy CONNECT 403, origin 000. Catches canonical policy blockage before origin TLS.

```sh
curl --silent --show-error --location --max-time 20 --dump-header - --output /dev/null --write-out '\nhttp_code=%{http_code} ssl_verify_result=%{ssl_verify_result} remote_ip=%{remote_ip} url_effective=%{url_effective}\n' 'https://ids.si.edu/ids/manifest/NMAH-2009-39732'
```

Time: 2026-10-07 15:05:47 UTC; exit 56; proxy CONNECT 403, origin 000. Catches canonical policy blockage before origin TLS.

```sh
curl --silent --show-error --location --max-time 20 --dump-header - --output /dev/null --write-out '\nhttp_code=%{http_code} ssl_verify_result=%{ssl_verify_result} remote_ip=%{remote_ip} url_effective=%{url_effective}\n' 'https://smithsonian-open-access.s3-us-west-2.amazonaws.com/metadata/edan/index.txt'
```

Time: 2026-10-07 15:06:38 UTC; exit 56; proxy CONNECT 403, origin 000. Catches canonical policy blockage before origin TLS.

```sh
curl --silent --show-error --location --max-time 20 --dump-header - --output /dev/null --write-out '\nhttp_code=%{http_code} ssl_verify_result=%{ssl_verify_result} remote_ip=%{remote_ip} url_effective=%{url_effective}\n' 'https://edan.si.edu/openaccess/docs/'
```

Time: 2026-10-07 15:06:38 UTC; exit 56; proxy CONNECT 403, origin 000. Catches canonical policy blockage before origin TLS.

```sh
curl --silent --show-error --location --max-time 20 --dump-header - --output /dev/null --write-out '\nhttp_code=%{http_code} ssl_verify_result=%{ssl_verify_result} remote_ip=%{remote_ip} url_effective=%{url_effective}\n' 'https://images.metmuseum.org/'
```

Time: 2026-10-07 15:06:38 UTC; exit 56; proxy CONNECT 403, origin 000. Catches canonical policy blockage before origin TLS.

```sh
curl --silent --show-error --location --max-time 35 --dump-header /tmp/c04-fallback/met-csv-direct.headers --output /tmp/c04-fallback/met-csv-direct.body --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} url_effective=%{url_effective}' https://github.com/metmuseum/openaccess/raw/master/MetObjects.csv
```

Result: Redirect to media.githubusercontent.com; CONNECT403 curl exit56. No origin data downloaded; not retried. The LFS operation was a read/download batch; its stdin request body is not reproduced here. No credential extraction or identity change was attempted.

```sh
curl --silent --show-error --location --max-time 25 --request POST --header 'Accept: application/vnd.git-lfs+json' --header 'Content-Type: application/vnd.git-lfs+json' --data-binary @- --output /tmp/c04-fallback/met-lfs-response.private --dump-header /tmp/c04-fallback/met-lfs-batch.headers --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result}' https://github.com/metmuseum/openaccess.git/info/lfs/objects/batch
```

Result: GitHub origin403: Resource not accessible by integration. Did not extract credentials, change identity, or retry. The LFS operation was a read/download batch; its stdin request body is not reproduced here. No credential extraction or identity change was attempted.

## Claim and dependency setup

```sh
python3 /tmp/queue_blockers.py claim
git fetch origin main
git show origin/main:CLAIMS.md
git pull --ff-only origin main
git push origin main
git switch -c job/C04-ancient-or-ikea
```

Initial claim push returned RPC HTTP 503 and left main one local commit ahead;
the dependent scaffold step had not checked the failure. Root stopped
implementation, fetched/re-read main (C04 still absent), pulled/rechecked and
retried. Claim d406037 then pushed and the branch was created. No implementation
was delegated before successful claim verification. These checks catch ambiguous
remote writes and competing claims.

```sh
npm --cache=/workspace/.npm-cache ci --ignore-scripts --no-fund --no-audit
```

Result: exit 0; eight locked development packages installed. Catches dependency
availability and avoids the unwritable default cache.

Runtime status still reports current observations at spec revision 1,
restricted/package-manager preset and no custom domains. Source hosts,
including the documented AIC full-dump host, are saved in the draft. Saving
does not apply networking or publish a snapshot.

## Outstanding complete content checks

Unrun: 30 actually paired museum image/license checks, roughly 500+ visually
curated objects, <=90-character facts from two independent sources, 30 random
manual second-source checks, actual green CI/PR and post-green KEEP GOING.
Catalogue processing and synthetic image tests never substitute for them.
Exact engineering results follow after execution.

## Core compilation, schema and catalogue smoke checks

```sh
./node_modules/.bin/tsc --target ES2022 --module NodeNext --moduleResolution NodeNext --strict --noUncheckedIndexedAccess --exactOptionalPropertyTypes --skipLibCheck --noEmitOnError --outDir /tmp/c04-core-check src/build.ts src/cli.ts
```

Result: exit 0. Strict ES2022 compilation of the two source files, without modifying shared dist or claiming test compilation.

```sh
node /tmp/c04-core-check/cli.js fixtures/source.json /tmp/c04-core-check/sample.json --sample
```

Result: exit 0. End-to-end actual fixture parsing, metadata mapping, century inference from structured ranges only, and stable JSON output.

```sh
node --input-type=module - <<'JS'
import {readFileSync} from 'node:fs';
import {Ajv} from 'ajv';
import assert from 'node:assert/strict';
import {parseFixture,buildSample,serializeSample,centuriesPrimary,centuriesReference} from '/tmp/c04-core-check/build.js';
const fixture=JSON.parse(readFileSync('fixtures/source.json','utf8'));
const before=JSON.stringify(fixture);
assert.deepEqual(parseFixture(fixture),fixture);
const sample=buildSample(fixture);
assert.equal(JSON.stringify(fixture),before);
assert.equal(sample.rows.length,30);
assert.equal(sample.rows.filter(row=>row.dateRange!==null).length,6);
assert.equal(sample.rows.filter(row=>row.dateRange===null&&row.centuries===null).length,24);
for(const[start,end]of [[1,100],[100,101],[-100,-1],[-101,-100],[-101,101],[-9999,9999]])assert.deepEqual(centuriesPrimary(start,end),centuriesReference(start,end));
const ajv=new Ajv({strict:true,allErrors:true});
for(const[path,value]of [['schemas/fixture.schema.json',fixture],['schemas/pack.schema.json',sample]]){
 const validate=ajv.compile(JSON.parse(readFileSync(path,'utf8')));
 assert.ok(validate(value),JSON.stringify(validate.errors));
}
assert.equal(serializeSample(sample),readFileSync('/tmp/c04-core-check/sample.json','utf8'));
console.log(JSON.stringify({rows:sample.rows.length,structuredRanges:6,unstructuredLabels:24,schemasValid:true,sourceUnchanged:true,sourceCopyDeepEqual:true,cliBytesMatch:true,crossEraCenturyImplementationsEqual:true}));
JS
```

Result: exit 0. Actual fixture and pack pass strict AJV schema compilation/validation; source input remains byte-identical in memory, parse returns equal source values, six numeric and24null ranges retained, fixed century cases agree, CLI bytes equal pure serialization.
Limits: Fixed-case smoke is separate from required10,000 random differential cases and mutation tests. Schemas validate shape and provenance constraints; runtime checks enforce real timestamp calendars, range ordering, and object identity uniqueness.

```sh
node /tmp/c04-core-check/src/cli.js fixtures/source.json data/sample.json --sample
```

Initial root attempt: exit 1, MODULE_NOT_FOUND; source-only compiler output is flat, not under src/. No data was written. Corrected after rg --files inspection:

```sh
node /tmp/c04-core-check/cli.js fixtures/source.json data/sample.json --sample
```

Result: exit 0; 30-row golden metadata pack generated. Catches source-to-pack/serialization integration without touching shared test/mutation dist.

## Pinned source extraction and preservation

```sh
/opt/codex/runtimes/codex-primary-runtime/dependencies/python/bin/python /workspace/partybox-content-packs/jobs/C04-ancient-or-ikea/tools/extract_sample.py --source-dir /workspace/.partybox-source-cache/c04 --output /tmp/c04-refresh-a.json
```

Result: exit 0, expected and passed; regeneration-a. Catches source/manifest checksum drift, source escapes/aliases, invalid output destinations or repeat-generation drift according to the named check.

```sh
/opt/codex/runtimes/codex-primary-runtime/dependencies/python/bin/python /workspace/partybox-content-packs/jobs/C04-ancient-or-ikea/tools/extract_sample.py --source-dir /workspace/.partybox-source-cache/c04 --output /tmp/c04-refresh-b.json
```

Result: exit 0, expected and passed; regeneration-b. Catches source/manifest checksum drift, source escapes/aliases, invalid output destinations or repeat-generation drift according to the named check.

```sh
cmp /tmp/c04-refresh-a.json /tmp/c04-refresh-b.json
```

Result: exit 0, expected and passed; two-regenerations-identical. Catches source/manifest checksum drift, source escapes/aliases, invalid output destinations or repeat-generation drift according to the named check.

```sh
cmp /tmp/c04-refresh-a.json /workspace/partybox-content-packs/jobs/C04-ancient-or-ikea/fixtures/source.json
```

Result: exit 0, expected and passed; committed-fixture-identical. Catches source/manifest checksum drift, source escapes/aliases, invalid output destinations or repeat-generation drift according to the named check.

```sh
cmp /tmp/c04-refresh-a.json /workspace/.partybox-research/c04-c04-metadata-sample30.json
```

Result: exit 0, expected and passed; retained-research-fixture-identical. Catches source/manifest checksum drift, source escapes/aliases, invalid output destinations or repeat-generation drift according to the named check.

```sh
/opt/codex/runtimes/codex-primary-runtime/dependencies/python/bin/python /workspace/partybox-content-packs/jobs/C04-ancient-or-ikea/tools/extract_sample.py --source-dir /workspace/.partybox-source-cache/c04-validation-_0wic3z6/sources --output /workspace/.partybox-source-cache/c04-validation-_0wic3z6/out.json
```

Result: exit 1, expected and passed; corrupt-raw-rejected-before-JSON-parse. Catches source/manifest checksum drift, source escapes/aliases, invalid output destinations or repeat-generation drift according to the named check.

```sh
/opt/codex/runtimes/codex-primary-runtime/dependencies/python/bin/python /workspace/partybox-content-packs/jobs/C04-ancient-or-ikea/tools/extract_sample.py --source-dir /workspace/.partybox-source-cache/c04-validation-_0wic3z6/sources --output /workspace/.partybox-source-cache/c04-validation-_0wic3z6/sources/ch-object-18382603.json
```

Result: exit 1, expected and passed; source-output-exact-alias. Catches source/manifest checksum drift, source escapes/aliases, invalid output destinations or repeat-generation drift according to the named check.

```sh
/opt/codex/runtimes/codex-primary-runtime/dependencies/python/bin/python /workspace/partybox-content-packs/jobs/C04-ancient-or-ikea/tools/extract_sample.py --source-dir /workspace/.partybox-source-cache/c04-validation-_0wic3z6/sources --output /workspace/.partybox-source-cache/c04-validation-_0wic3z6/sources/unused/../ch-object-18382603.json
```

Result: exit 1, expected and passed; source-output-normalized-alias. Catches source/manifest checksum drift, source escapes/aliases, invalid output destinations or repeat-generation drift according to the named check.

```sh
/opt/codex/runtimes/codex-primary-runtime/dependencies/python/bin/python /workspace/partybox-content-packs/jobs/C04-ancient-or-ikea/tools/extract_sample.py --source-dir /workspace/.partybox-source-cache/c04-validation-_0wic3z6/sources --output /workspace/.partybox-source-cache/c04-validation-_0wic3z6/source-output-symlink.json
```

Result: exit 1, expected and passed; source-output-symlink-alias. Catches source/manifest checksum drift, source escapes/aliases, invalid output destinations or repeat-generation drift according to the named check.

```sh
/opt/codex/runtimes/codex-primary-runtime/dependencies/python/bin/python /workspace/partybox-content-packs/jobs/C04-ancient-or-ikea/tools/extract_sample.py --source-dir /workspace/.partybox-source-cache/c04-validation-_0wic3z6/sources --output /workspace/.partybox-source-cache/c04-validation-_0wic3z6/source-output-hardlink.json
```

Result: exit 1, expected and passed; source-output-hardlink-alias. Catches source/manifest checksum drift, source escapes/aliases, invalid output destinations or repeat-generation drift according to the named check.

```sh
/opt/codex/runtimes/codex-primary-runtime/dependencies/python/bin/python /workspace/partybox-content-packs/jobs/C04-ancient-or-ikea/tools/extract_sample.py --source-dir /workspace/.partybox-source-cache/c04-validation-_0wic3z6/sources --output /workspace/partybox-content-packs/jobs/C04-ancient-or-ikea/fixtures/manifest.json
```

Result: exit 1, expected and passed; manifest-output-exact-alias. Catches source/manifest checksum drift, source escapes/aliases, invalid output destinations or repeat-generation drift according to the named check.

```sh
/opt/codex/runtimes/codex-primary-runtime/dependencies/python/bin/python /workspace/partybox-content-packs/jobs/C04-ancient-or-ikea/tools/extract_sample.py --source-dir /workspace/.partybox-source-cache/c04-validation-_0wic3z6/sources --output /workspace/.partybox-source-cache/c04-validation-_0wic3z6/manifest-output-symlink.json
```

Result: exit 1, expected and passed; manifest-output-symlink-alias. Catches source/manifest checksum drift, source escapes/aliases, invalid output destinations or repeat-generation drift according to the named check.

```sh
/opt/codex/runtimes/codex-primary-runtime/dependencies/python/bin/python /workspace/partybox-content-packs/jobs/C04-ancient-or-ikea/tools/extract_sample.py --source-dir /workspace/.partybox-source-cache/c04-validation-_0wic3z6/sources --output /workspace/.partybox-source-cache/c04-validation-_0wic3z6/manifest-output-hardlink.json
```

Result: exit 1, expected and passed; manifest-output-hardlink-alias. Catches source/manifest checksum drift, source escapes/aliases, invalid output destinations or repeat-generation drift according to the named check.

```sh
/opt/codex/runtimes/codex-primary-runtime/dependencies/python/bin/python /workspace/partybox-content-packs/jobs/C04-ancient-or-ikea/tools/extract_sample.py --source-dir /workspace/.partybox-source-cache/c04-validation-_0wic3z6/sources --output /workspace/.partybox-source-cache/c04-validation-_0wic3z6/destination-directory
```

Result: exit 1, expected and passed; output-directory-rejected. Catches source/manifest checksum drift, source escapes/aliases, invalid output destinations or repeat-generation drift according to the named check.

```sh
/opt/codex/runtimes/codex-primary-runtime/dependencies/python/bin/python /workspace/partybox-content-packs/jobs/C04-ancient-or-ikea/tools/extract_sample.py --source-dir /workspace/.partybox-source-cache/c04-validation-_0wic3z6/sources --output /workspace/.partybox-source-cache/c04-validation-_0wic3z6/out.json
```

Result: exit 1, expected and passed; raw-source-symlink-escape-rejected. Catches source/manifest checksum drift, source escapes/aliases, invalid output destinations or repeat-generation drift according to the named check.

```sh
/opt/codex/runtimes/codex-primary-runtime/dependencies/python/bin/python /workspace/.partybox-source-cache/c04-validation-_0wic3z6/tampered-manifest-tool/tools/extract_sample.py --source-dir /workspace/.partybox-source-cache/c04-validation-_0wic3z6/sources --output /workspace/.partybox-source-cache/c04-validation-_0wic3z6/out.json
```

Result: exit 1, expected and passed; tampered-manifest-rejected-before-JSON-parse. Catches source/manifest checksum drift, source escapes/aliases, invalid output destinations or repeat-generation drift according to the named check.

```sh
node /tmp/c04-manifest-validation.mjs
```

Result: exit 0, expected and passed; strict-Ajv-manifest-validation-and-negative-cases. Catches source/manifest checksum drift, source escapes/aliases, invalid output destinations or repeat-generation drift according to the named check.

Result: 17/17 source checks passed, two regenerations byte-identical to each other and fixtures/source.json (SHA256 cf2478592bc1dfb7a30cb94a9e75296bf4c8357d86ac23ba5fca53e34001b27d). Thirty raw sources are checksum-verified (164,271 bytes total); no AIC descriptions or image pixels exported. All source and manifest inputs preserved.

## Original-image baseline

```sh
./node_modules/.bin/tsc --target ES2022 --module NodeNext --moduleResolution NodeNext --strict --noUncheckedIndexedAccess --exactOptionalPropertyTypes --noEmitOnError --forceConsistentCasingInFileNames --skipLibCheck --rootDir . --outDir dist test/portrait.test.ts
```

Result: exit 0; strict targeted compilation passed.

```sh
PARTYBOX_PORTRAIT_PYTHON=/workspace/.partybox-source-venv/bin/python node --test dist/test/portrait.test.js
```

Result: exit 0; 10/10 tests passed in 36.986 seconds.

Image baseline: 141 converter invocations, 72 successful and 69 rejected. Thirty original patterns are transformed twice; independent decodes check geometry, no upscaling, strict <40,000 bytes, alpha, aspect, source/metadata hash and exact attribution. Random-RGBA/RGB stress cases, valid palette/partial alpha, EXIF orientation and populated sRGB ICC/XMP input are covered. Unsafe HTTPS authorities/credentials/ports/query/fragment/control fields, aliases, source-root escapes, corrupt/animated files and directory destinations must reject before existing output modification. Caller-supplied metadata is never verified museum permission.

## Complete baseline before colour-profile correction

```sh
PARTYBOX_PORTRAIT_PYTHON=/workspace/.partybox-source-venv/bin/python npm test > /tmp/c04-final-npm-test.log 2>&1
```

Result: exit 0; strict build, 23/23 tests, all eight checksums; mutation baseline also 23/23. Core compares independent century implementations over 10,000 ranges and runs properties with seeds 1–3 plus 1,000 saved random seeds. It catches signed century/year-zero/domain/range errors, unknown dates accidentally inferred, fixture/schema/source hash/identity/provenance drift, source mutation, serialization/timezone drift and CLI alias/output damage.

Review found ICC metadata is stripped without converting tagged pixels to sRGB. The sRGB-tagged fixture verifies stripping but does not expose colour-space conversion. Correcting this with a synthetic tagged-image regression is the next engineering milestone; baseline success does not claim colour-managed conversion.

## One-at-a-time semantic mutations

```sh
node test/mutations.mjs
```

Full 23-test baseline; each syntax-valid compiled core/CLI bug then runs all 13 core tests. Image tool code is unchanged during mutation runs. Syntax errors, timeouts, cancellation or zero-test outcomes cannot count as catches.

| ID | Bug | Result | Failed tests |
| --- | --- | --- | --- |
| 1 | historical year zero accepted | caught | 2 |
| 2 | fractional historical year accepted | caught | 2 |
| 3 | unsupported BCE year -10000 accepted | caught | 1 |
| 4 | reversed historical range accepted | caught | 2 |
| 5 | primary exact CE century boundary moved forward | caught | 3 |
| 6 | primary BCE starting century made positive | caught | 4 |
| 7 | primary final century omitted | caught | 7 |
| 8 | primary includes nonexistent century zero | caught | 4 |
| 9 | reference CE lower boundary starts one year early | caught | 3 |
| 10 | reference BCE upper boundary extends one year | caught | 3 |
| 11 | reference century intersection accepts either bound | caught | 4 |
| 12 | duplicate museum catalogue IDs accepted | caught | 1 |
| 13 | source hash pin mismatch accepted | caught | 1 |
| 14 | input falsely claims image bytes downloaded | caught | 1 |
| 15 | unstructured date labels guessed as 1900 | caught | 5 |
| 16 | structured source date range extended by 100 years | caught | 3 |
| 17 | unstructured label called catalogue range evidence | caught | 4 |
| 18 | missing image replaced by unlicensed object | caught | 4 |
| 19 | unsupported fact inserted | caught | 4 |
| 20 | unverified fact declared verified | caught | 4 |
| 21 | unverified image license declared verified | caught | 4 |
| 22 | metadata sample declared complete | caught | 4 |
| 23 | metadata sample called production | caught | 4 |
| 24 | CLI explicit sample opt-in ignored | caught | 1 |
| 25 | CLI source overwrite protection removed | caught | 1 |

Result: 25/25 caught; all syntax-valid, no timeout/cancellation/errors. Both compiled files restored byte-for-byte with matching SHA256. Complete source/media/manual/CI checks remain outstanding.
