# DAM Asset References

## Overview

The **DAM Asset References** tool lists every asset in AEM Assets that Document Authoring
content links to, how many documents link each one, and which documents those are. Results
export to CSV and to Excel.

It is **read only**. It opens DA documents and reports what they reference; it writes nothing
to DA and nothing to AEM. Because it never calls AEM, it needs no author CORS policy, no
metadata schema and no AEM credentials — it runs today with nothing but a DA session.

Open it from Document Authoring at `/tools/asset-references/asset-references.html`.

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
- **Locations** — expand any asset to see each referencing document, with links to edit it in
  DA and to view it live.
- **Folder picker** — browse the DAM folder tree and narrow the list to a folder. The tree is
  built from the scan results rather than from AEM, which keeps the tool credential-free and is
  the right source anyway: the picker filters the results, so it should only offer folders the
  results contain. Each folder shows the assets at or below it and the references they account
  for, so its weight is visible before you open it. A folder containing no referenced assets has
  no node at all, for the same reason — the tree is derived from the results.
- **Sort** — most referenced, fewest references, or path A–Z. Fewest-first surfaces the
  single-use tail, which is where cleanup candidates cluster.
- **Export scope** — the exports cover the selected folder by default, or everything.
- **CSV export** — two files: the asset list, and the long-form asset/document pairs.
- **Excel export** — one workbook: Summary, Referenced assets, References.

---

## Scope: why the crawl is never narrowed

The crawl always runs against the whole repository. "Which assets are referenced" is a property
of the entire site: an asset used only by `/de` looks unreferenced if the crawl stopped at
`/en`, and a false negative is the failure mode that gets a live asset deleted.

---

## What this tool does not tell you

An asset absent from this report is unreferenced **by DA**. That is not the same as unused.

DAM assets are publicly reachable at `www.jmp.com/content/dam/...`, so anything can link them —
email campaigns, the JMP Community, the JMP application, documentation, a partner site. None of
that is visible here.

Measured on this repository, roughly **2,700 assets that DA does not reference were still being
fetched**, including 92% of the `.jsl` scripts. Treat this report as a candidate list, and
confirm against CDN request logs before deleting anything.

---

## Exports

| File | Contents |
| --- | --- |
| `da-referenced-assets.csv` | One row per asset: path, folder, type, documents, published documents |
| `da-asset-references.csv` | One row per asset/document pair, with edit and live URLs |
| `da-asset-references.xlsx` | Summary, Referenced assets, References |

The Summary sheet records the crawl stats, the export scope and the DA-only limitation, so an
exported file explains itself to whoever opens it next and cannot be mistaken for the full set.

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
| `asset-tree.js` | DAM folder tree for the folder picker |
| `scan.js` | Repository crawl and the usage map |
| `dam-refs.js` | Reference extraction and path canonicalization |
| `export.js` | CSV and Excel builders |
| `asset-references.css` | Styles |

Unit tests for `dam-refs.js`, `export.js` and `asset-tree.js` are in `test/tools/asset-references/`. `scan.js`
is not unit tested because it imports `crawl` from `da.live` at runtime, following the same
convention as `tools/search/search.js`.
