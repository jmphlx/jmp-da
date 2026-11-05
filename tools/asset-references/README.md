# DAM Asset References

## Overview

The **DAM Asset References** tool compares the live AEM DAM against what Document Authoring
content links to. For every asset it reports whether DA references it, how many documents do,
and which ones. Results export to CSV and to Excel.

Every asset lands in one of three states:

| Status | Meaning |
| --- | --- |
| **Referenced** | In the DAM, and at least one DA document links it |
| **Unreferenced** | In the DAM, but no DA document links it |
| **Missing from DAM** | A DA document links the path, but the asset is not in the DAM |

It is **read only**. It crawls DA, reads the DAM inventory from AEM author, and joins the two.
Nothing is written to DA or to AEM.

Open it from Document Authoring at `/tools/asset-references/asset-references.html`.

---

## How it reaches the DAM

The tool reads the inventory from AEM author with QueryBuilder, using the IMS token DA already
hands the app. No credential is stored or configured in the tool. Two things on the AEM side make
that work, and both are already in place:

- **Authentication** — the environment sets `ADOBE_PROVIDED_CLIENT_ID=darkalley`, so author
  accepts tokens issued to DA's `darkalley` client. That is the token the tool receives.
- **CORS** — DA does not run the app on `da.live`. It loads it in an iframe from the site's own
  origin: `https://<ref>--jmp-da--jmphlx.preview.da.live`, or `.aem.live` as a fallback. Author
  allowlists those origins, branch refs included, for cross-origin `GET`.

If either stops being true, the tool does not fail the scan. It reports why the DAM could not be
read — for example `AEM refused your session (401)` — and shows the DA references alone, with
the status filter disabled and the Summary sheet saying the comparison was not made.

The inventory is read by paging QueryBuilder by offset. That is only sound when the result order
is stable, so the query is ordered by path and rows are keyed by path. The collected count is
then checked against the server's own total, and a mismatch is reported rather than silently
shrinking the DAM. Copies AEM keeps after a delete (under `jcr:content/cq:discarded`) are
excluded, since they are not part of the DAM anyone manages.

---

## Why the DAM path has to be read from the source

DA stores a DAM reference as an absolute URL:

```html
<img src="https://www.jmp.com/content/dam/jmp/images/why-jmp/hero.png">
```

At preview and publish time Helix downloads the binary and rewrites the reference to a
content-addressed `media_<hash>` blob served from the Edge Delivery origin. The hash is
computed from the file, not from its path, so it cannot be mapped back to an asset.

**A published page therefore contains no DAM reference at all.** Usage has to be read from the
DA source, which is what this tool does.

---

## Features

- **Whole-repository crawl** — every document, not a subtree. See *Scope* below.
- **Pages and sheets** — reads `.html` and `.json`. Sheets matter: `redirects.json` points
  friendly URLs at DAM documents, and an HTML-only crawl reports every one of those targets as
  unreferenced.
- **Multi-host matching** — content references the AEM publish tier, the author tier and
  `www.jmp.com`. All resolve to the same `/content/dam/...` path, so matching keys off the
  pathname and a new host needs no code change.
- **Deduplicated per document** — a `<picture>` emits the same asset across two or three
  `source`/`img` elements. Counting raw matches would inflate usage roughly threefold.
- **Published split** — how many of the referencing documents are live, inferred from path
  (`/drafts/`, `/sandbox/`), mirroring the exclusions in `configurations/query.yaml`.
- **Status filter** — show every asset, or only referenced, unreferenced or missing ones.
- **Locations** — expand a referenced asset to see each document that links it, with links to
  edit it in DA and to view it live.
- **Filter by path** — browse the DAM folder tree and narrow the list to any number of folders.
  With the DAM read, every DAM folder appears, including ones nothing references. Each folder
  shows its asset count and the references those assets account for.
- **Multi-select** — tick any number of folders, then press apply; the list shows their union.
  Ticking does not re-filter and does not re-render the tree, so folders you opened stay open
  and the re-filter happens once. Cancel discards the working selection. Ticking a parent
  drops its already-ticked children, since they change nothing. Each applied folder appears
  as a chip above the table, and clicking a chip removes that folder.
- **Sort** — most referenced, fewest references, or path A–Z, with the ordered column marked
  in the table header. Path order is numeric, so `jmp-9` precedes `jmp-10`.
- **Export scope** — "Export currently selected folders" by default, or "Export everything".
  Filenames carry the date and the folders captured, for example
  `da-assets-2026-10-20-events+screenshots.csv`, and omit the folder part when the export
  covers everything.

---

## Scope: why the crawl is never narrowed

The crawl always runs against the whole repository. "Which assets are referenced" is a property
of the entire site: an asset used only by `/de` looks unreferenced if the crawl stopped at
`/en`, and a false negative is the failure mode that gets a live asset deleted.

---

## What the statuses do not tell you

**Unreferenced is not the same as unused.** DAM assets are publicly reachable at
`www.jmp.com/content/dam/...`, so anything can link them — email campaigns, the JMP Community,
the JMP application, documentation, a partner site. None of that is visible here. Measured on
this repository, roughly **2,700 assets that DA does not reference were still being fetched**,
including 92% of the `.jsl` scripts. Treat Unreferenced as a candidate list, and confirm against
CDN request logs before deleting anything.

**Missing from DAM is not always a broken image.** An asset deleted on author without being
unpublished first stays live on the publish tier, so the page can still render it. For example,
`images/data-viz/jmp-data-viz-bar-chart-background.png` is absent from the author DAM, yet
publish serves it and over 600 pages show it. These orphans cannot be managed from the Assets
console. Deleting on author does not remove the published copy, so cleanup should unpublish
before it deletes.

---

## Exports

| File | Contents |
| --- | --- |
| `da-assets-<date>[-<folders>].csv` | One row per asset: path, status, folder, type, documents, published documents |
| `da-references-<date>[-<folders>].csv` | One row per asset/document pair, with edit and live URLs |
| `da-workbook-<date>[-<folders>].xlsx` | Summary, Assets, References |

The Summary sheet records the crawl stats, the export scope, the count of each status, and
whether the DAM was compared at all, so an exported file explains itself to whoever opens it
next and cannot be mistaken for the full set.

The whole result list is rendered; each asset's document list is built only when expanded,
because 14,000 links up front is what made rendering the full list slow, not the rows themselves.

Asset paths can contain commas, so CSV fields are quoted. Excel export loads SheetJS from cdnjs
on first use rather than on page load, because it is ~880KB and most runs never export.

---

## File organization

| File | Purpose |
| --- | --- |
| `asset-references.html` | App interface |
| `asset-references.js` | UI and orchestration |
| `scan.js` | Repository crawl and the usage map |
| `dam-refs.js` | Reference extraction and path canonicalization |
| `dam-inventory.js` | Reads the live DAM inventory from AEM author |
| `compare.js` | Joins the DA scan to the DAM and assigns each asset a status |
| `asset-tree.js` | DAM folder tree for the folder picker |
| `export.js` | CSV and Excel builders |
| `asset-references.css` | Styles |

Unit tests for `dam-refs.js`, `dam-inventory.js`, `compare.js`, `asset-tree.js` and `export.js`
are in `test/tools/asset-references/`. `scan.js` is not unit tested because it imports `crawl`
from `da.live` at runtime, following the same convention as `tools/search/search.js`.
