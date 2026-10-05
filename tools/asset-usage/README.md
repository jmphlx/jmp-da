# DAM Asset Usage

Compares assets in AEM Assets against the assets actually referenced by pages in Document
Authoring, and writes a usage indicator back onto each asset so unused assets can be found
and cleaned up from within the DAM.

Open it from Document Authoring at `/tools/asset-usage/asset-usage.html`.

## How it works

DA stores DAM references as absolute URLs in the page source, for example:

```html
<img src="https://www.jmp.com/content/dam/jmp/asset.jpg" alt="asset.jpg" loading="lazy">
```

Helix rewrites those to `media_<hash>` blobs at preview/publish time, and the hash cannot be
derived from the asset binary. **Usage must therefore be read from the DA source, never from
a rendered page** — the rendered page has no DAM reference left in it.

Three host prefixes carry DAM paths in this repo: the AEM publish tier and `www.jmp.com` on
existing content, and the AEM author tier on assets inserted through Content Advisor. All
normalize to the same `/content/dam/...` path, which is the key AEM indexes on. Matching is
done on the path, so a new host works without a code change.

### Usage states

| State | Meaning |
| --- | --- |
| `used-published` | Referenced by at least one live page |
| `used-unpublished` | Referenced only by drafts, sandbox or unpublished pages |
| `unused` | Referenced by no page in the DA repository |

`used-unpublished` exists so that an asset placed on an in-flight draft is never presented as
a cleanup candidate.

### Safety properties

- **The DA crawl is always full-repository.** Usage is a property of the whole site; an asset
  referenced only from `/de` would look unused if the crawl stopped at `/en`. The DAM side is
  scoped instead, which is safe. Do not add a DA path filter.
- **Nothing is written until you click Apply.** The scan always produces a reviewable table
  with CSV export first.
- **Only changed assets are written.** Re-running the scan on an unchanged site touches
  nothing, which keeps the DAM's `Modified on` and `Last modifier` fields meaningful.
- **A `<picture>` counts once.** The same asset repeats across two or three `source`/`img`
  elements; references are deduplicated per page, so `usageCount` counts distinct pages.

## AEM prerequisites

These live in the **AEM project repository**, not here, and need a Cloud Manager pipeline run.
Until they are in place the tool can crawl DA but cannot read or write AEM.

### 1. CORS policy on the author tier

The tool runs in the browser at `da.live`, so the author tier must allow that origin. Without
it the AEM calls fail preflight. Configure `com.adobe.granite.cors.impl.CORSPolicyImpl` with:

- `alloworigin`: `https://da.live`
- `allowedpaths`: at least `/bin/querybuilder.json` and `/api/assets/.*`
- `supportscredentials`: `true`
- `allowedheaders`: must include `Authorization`

### 2. Metadata schema fields

Writing a property via the API does not make it visible. Declare these in the asset metadata
schema form so they render in the asset details panel:

| Property | Type |
| --- | --- |
| `jmp:daUsageStatus` | text |
| `jmp:daUsageCount` | number |
| `jmp:daUsageScannedAt` | date |

The `jmp:` namespace must be registered in the repository.

### 3. Search facet

Index `jmp:daUsageStatus` and expose it as a search filter. This is what turns the tool from a
per-asset curiosity into a governance workflow — "show me every unused image in `/jmp/images`"
is the actual cleanup task.

## Configuration

All AEM-specific values are constants at the top of `aem.js`: `AEM_AUTHOR_ORIGIN`,
`QUERY_BUILDER_PATH`, `ASSETS_API_PATH`, `DAM_ROOT` and `USAGE_PROPS`.

## Access control

Gated by `addAppAccessControl` against `.da/da-apps-permissions.json`, the same mechanism the
search tool uses. The tool performs bulk writes to the DAM, so keep the allowlist tight.

## Publish status

By default a page counts as unpublished if its path contains `/drafts/` or `/sandbox/`, which
mirrors the exclusions in `configurations/query.yaml` and costs no extra requests. Ticking
**Verify publish status** confirms each page against the status API instead. That is more
accurate — it catches a non-draft page that was simply never published — but
`admin.hlx.page` is rate limited to 10 requests per 3 seconds. Only pages that actually
reference a DAM asset are ever checked, which keeps the cost proportional to the work.

## Files

| File | Purpose |
| --- | --- |
| `dam-refs.js` | Normalizes DAM references and extracts them from a page |
| `compare.js` | Joins the DAM inventory to the crawled usage map |
| `aem.js` | AEM Assets listing and metadata writes |
| `scan.js` | Crawls the DA repository |
| `asset-usage.js` | UI and orchestration |

Unit tests covering the first three are in `test/tools/asset-usage/`. `scan.js` is not unit
tested because it imports `crawl` from `da.live` at runtime, following the same convention as
`tools/search/search.js`.
