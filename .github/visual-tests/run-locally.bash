#!/usr/bin/env bash

export DOMAIN_MAIN="main--jmp-da--jmphlx.hlx.live"
export DOMAIN_BRANCH="aem-211--jmp-da--jmphlx.hlx.live"

export TEST_PATHS="/en/sandbox/laurel/aem-168 /en/sandbox/laurel/subnav/medical"

# we ignore the exit code of the test command because we want to continue
npx playwright test
set -e

cat test-results/visual-diff.md