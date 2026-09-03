# Renovate dependency management — jmp-da

Renovate keeps this repo's dependencies current. Configuration lives in
[`.renovaterc.json`](../.renovaterc.json). This document is the inventory: every
dependency in the repo, and how (or whether) Renovate manages it.

Jira: AEM-1071 (implementation) — builds on AEM-1063 (research).

## How it behaves

| Setting | Value | Why |
| --- | --- | --- |
| Schedule | Mondays before 6am, America/New_York | Batches the week's noise into one window. The `Build` workflow runs on every push, so unscheduled PRs mean unscheduled CI. |
| Release age hold | 3 days | Skips packages that get unpublished or hot-fixed within days of release. |
| Concurrent PRs | 5 (max 2/hour) | Keeps the PR list reviewable. |
| Rebase | On conflict only | `Build` triggers on `push`, so rebasing on every base-branch commit would burn CI minutes for nothing. |
| Semantic commits | Disabled | This repo does not use conventional commits. |
| Automerge | Off everywhere | CI only runs `npm run lint` — no unit or visual tests — so nothing merges without a human. Revisit once tests run in CI. |
| PR creation | Dashboard approval required | `dependencyDashboardApproval: true` is set repo-wide, so no update opens a PR on its own. Security fixes are the one exception. |
| Security fixes | Immediate, ignores schedule, release-age hold and the dashboard gate | Via GitHub advisories and OSV. |
| Lockfile maintenance | Monthly, 1st of the month — needs approval like everything else | Refreshes transitive pins in `package-lock.json`. |

The **Dependency Dashboard** issue is the control surface, and with the repo-wide
approval gate on it is the only way a PR gets created (security fixes aside). It
lists every detected dependency, every pending update, held-back majors, and
anything Renovate failed to parse. Tick a checkbox and Renovate opens that PR on
its next scheduled run.

## Automatically managed

Renovate's built-in managers find these with no extra configuration.

### `npm` — `package.json` / `package-lock.json`

Grouped so related packages move together in one PR:

| Group | Packages | Notes |
| --- | --- | --- |
| `lint tooling` | `eslint`, `eslint-config-airbnb-base`, `eslint-plugin-import`, `@babel/core`, `@babel/eslint-parser`, `stylelint`, `stylelint-config-standard`, `prettier`, `prettier-eslint` | Gated by `npm run lint` in CI. Safest group to merge. |
| `unit test tooling` | `@web/test-runner`, `@web/test-runner-commands`, `@web/test-runner-playwright`, `@open-wc/testing`, `@esm-bundle/chai`, `chai`, `sinon`, `mocha` | Run `npm run unittest` locally before merging. |
| `visual regression tooling` | `playwright`, `puppeteer`, `pixelmatch`, `pngjs` | Labelled `needs-screenshot-rebaseline`. Browser-engine bumps shift rendering — run `npm run visual` and refresh `test/screenshots` if diffs appear. |
| `node script dependencies` | `jsdom`, `esm` | Runtime deps of `scripts/post-event-processing.mjs`, used by the `process-past-events-*` workflows. |
| `lit` | `lit` | Grouped across managers — see the CDN section below. |

Anything added to `package.json` that matches none of these groups is still
tracked; it just appears on the dashboard as its own entry rather than inside a
group.

### `github-actions` — `.github/workflows/*.y*ml`

Grouped as `GitHub Actions`:

| Action | Current | Used by |
| --- | --- | --- |
| `actions/checkout` | `v4` | all five workflows |
| `actions/setup-node` | `v4` | `main`, `cleanup-on-create`, both `process-past-events-*` |
| `actions/github-script` | `v7` | `update-index-configuration`, both `process-past-events-*` |

`node-version: 20` on the `actions/setup-node` steps is also picked up here
(datasource `node-version`). It is grouped separately as `Node.js runtime` and
requires dashboard approval, so the team chooses the LTS line deliberately
rather than getting an automatic jump.

## Custom managed (regex)

These are version-pinned libraries loaded from a CDN at runtime. They are **not**
in `package-lock.json`, so `npm ci` and CI cannot catch a breaking change — every
PR in this group is labelled `needs-manual-verification` and needs a look at the
rendered page or tool before merging.

| Dependency | Version | Location | Manager |
| --- | --- | --- | --- |
| `date-fns` | `4.1.0` | [blocks/listgroup-custom/listgroup-custom.js:467](../blocks/listgroup-custom/listgroup-custom.js#L467) | jsDelivr |
| `mathjax` | `4` | [scripts/scripts.js:425](../scripts/scripts.js#L425) | jsDelivr |
| `dompurify` | `3.0.11` | [scripts/search.js:2](../scripts/search.js#L2) | jsDelivr |
| `lit` | `3.2.1` | [tools/preflight-check/preflight.js:5](../tools/preflight-check/preflight.js#L5) | esm.sh |
| `jquery` | `3.7.1` | [tools/search.html:8](../tools/search.html#L8), [tools/restore-version.html:8](../tools/restore-version.html#L8) | Google Hosted Libraries |

Three managers cover them:

1. **jsDelivr** — matches `https://cdn.jsdelivr.net/npm/<pkg>@<version>/...` in
   any tracked `.js`, `.mjs` or `.html` file. Handles scoped packages.
2. **esm.sh** — matches `https://esm.sh/<pkg>@<version>` in the same file set.
3. **Google Hosted Libraries** — matches the jQuery path explicitly. Library
   names on this CDN do not reliably map to npm package names (`jqueryui` vs.
   `jquery-ui`, for example), so a new library on this CDN needs its own manager
   entry rather than a generic capture.

All three resolve versions from the npm registry.

### Notes on specific entries

- **`mathjax@4`** is a major-only range, not an exact pin — jsDelivr serves the
  latest v4 build. With `rangeStrategy: replace` Renovate stays quiet until v5
  ships, which is the intended behaviour. Do not "fix" this to an exact version
  unless you want to own patch bumps by hand.
- **`lit`** is pinned at `3.2.1` from esm.sh but sits at `^3.3.3` in
  `package.json`. The npm copy is not imported anywhere — the esm.sh import in
  `tools/preflight-check` is the real one. Both are grouped under `lit` so the
  drift stays visible in one PR.
- **`dompurify`** is a security-relevant sanitiser. Its updates come through the
  vulnerability path immediately when an advisory exists, bypassing the dashboard
  gate.

## Not managed

Deliberate exclusions. Each needs a manual process, listed here so nothing is
silently forgotten.

| What | Why | How it gets updated |
| --- | --- | --- |
| `plugins/experimentation/**` | Vendored copy of `adobe/aem-experimentation`, including its own `package.json`, lockfile and workflows. Excluded via `ignorePaths` so Renovate does not open PRs against a third-party tree. | Re-vendor from upstream. |
| `scripts/aem.js` | Vendored from `adobe/aem-boilerplate`. No version marker in the file to match on. | Diff against boilerplate `main` periodically. |
| `https://da.live/nx/utils/sdk.js` | The DA SDK is served always-latest with no version in the URL. Used by `tools/search.html`, `tools/restore-version.html`, `tools/preflight-check/preflight.js`. | Nothing to pin; breakage surfaces at runtime. |
| `cinotify/github-action@main` | Pinned to a branch, not a tag, in both `process-past-events-*` workflows. Renovate cannot version a moving branch ref. | **Recommend pinning to a release tag** so Renovate can manage it. |
| VWO SmartCode (`head.html`) | Inline vendor snippet, self-versioning (`version=2.1`). | Vendor-supplied replacement snippet. |
| New Relic browser agent (`scripts/newrelic.js`) | Vendor-generated bundle, also in `.eslintignore`. | Regenerate from the New Relic UI. |
| HubSpot, Google Tag Manager, Vidyard, YouTube, Vimeo, Twitter embeds | Unversioned third-party script URLs. | Vendor-managed. |
| `coverage/`, `node_modules/` | Build artefacts. | n/a |

## Findings to raise with the team

Turned up while building the inventory — not fixed here:

1. **`esm` and `puppeteer` appear unused.** No import of either exists outside
   `node_modules`; `playwright` replaced `puppeteer` in
   `test/page/visual-regression.test.mjs`. Removing them cuts Renovate noise and
   install time.
2. **`lit` in `package.json` is unused** — the real dependency is the esm.sh
   import (see above). Either drop the npm entry or switch `preflight.js` to a
   bundled import so there is one source of truth.
3. **`cinotify/github-action@main` should be pinned to a tag** — currently
   unversioned *and* unpinned, which is both an update gap and a supply-chain
   risk.
4. **CI only runs lint.** Until `npm run unittest` runs in the `Build` workflow,
   automerge cannot be enabled safely for any group.
5. **The repo-wide approval gate is a rollout setting, not a permanent one.** It
   keeps the first weeks quiet while the team confirms the inventory is right.

## Access and onboarding

Renovate runs as the Mend Renovate GitHub App on the `jmphlx` org.

- **App installation** must include `jmphlx/jmp-da` with read/write on Contents,
  Pull requests and Issues (the last one is required for the Dependency
  Dashboard).
- **Reviewers/assignees** are intentionally not set in `.renovaterc.json` yet —
  add a `reviewers` array of GitHub handles or a `team:` entry once the team
  confirms who owns these PRs. Without it, PRs land unassigned.
- Anyone with write access to the repo can tick dashboard checkboxes to force a
  PR, retry a failed branch, or rebase.

## Changing the config

Validate before committing:

```sh
npx --yes --package renovate -- renovate-config-validator .renovaterc.json
```

Renovate also opens a config-migration PR automatically (`configMigration: true`)
when an option in this file is renamed or deprecated upstream.
