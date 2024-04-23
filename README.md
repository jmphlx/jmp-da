# JMP EDS POC
This is the initial POC instance of JMP Edge Delivery running against Sharepoint with merge workflow.  

## Environments
- Preview: https://main--jmpeds--jmphlx.hlx.page/
- Live: https://main--jmpeds--jmphlx.hlx.live/

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Local development

1. Create a new repository based on the `aem-boilerplate` template and add a mountpoint in the `fstab.yaml`
1. Add the [AEM Code Sync GitHub App](https://github.com/apps/aem-code-sync) to the repository
1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
1. Start AEM Proxy: `aem up` (opens your browser at `http://localhost:3000`)
1. Open the `{repo}` directory in your favorite IDE and start coding :)

## Pull Requests:
1. Pull requests should be prefixed with `feature-<FEATURE_NAME>` for net new functionality or `bugfix-<BUGNAME>` for bug fixes. EDS Fastly does not support using underscores in branch names for AEM PSI Automated testing.
1. Always run ```npm run lint``` before opening a pull request. This will ensure any formatting issues are caught before automated PR testing
