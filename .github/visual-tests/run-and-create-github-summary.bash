#!/usr/bin/env bash


for var in GITHUB_SERVER_URL GITHUB_REPOSITORY GITHUB_RUN_ID GITHUB_STEP_SUMMARY GITHUB_ENV DOMAIN_MAIN DOMAIN_BRANCH; do
  if [ -z "${!var}" ]; then
    echo "WARN: $var is not set. Link to artifacts will not be added."
  fi
done

export TEST_PATHS=""
TEST_PATHS="$(cat generated-test-paths.txt)"
mkdir -p test-results

# we ignore the exit code of the test command because we want to continue
npx playwright test
set -e

if grep -q "difference" test-results/visual-diff.md; then
  echo "Diffs found"
  SUMMARY="$(cat test-results/visual-diff.md)"

  echo "$SUMMARY" >> "$GITHUB_STEP_SUMMARY"

  # using multi-line-vars from  https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#example-of-a-multiline-string
  EOF=$(dd if=/dev/urandom bs=15 count=1 status=none | base64)
  echo "SUMMARY<<$EOF" >> "$GITHUB_ENV"
  echo "$SUMMARY" >> "$GITHUB_ENV"
  echo "$EOF" >> "$GITHUB_ENV"
else
  echo "No diffs found"
  cat test-results/visual-diff.md >> "$GITHUB_STEP_SUMMARY"
  echo "SUMMARY=" >> "$GITHUB_ENV"
fi

npm run optimize-screenshots
