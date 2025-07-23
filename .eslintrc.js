module.exports = {
  root: true,
  extends: 'airbnb-base',
  env: {
    browser: true,
    jquery: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    requireConfigFile: false,
  },
  rules: {
    // allow reassigning param
    'no-param-reassign': [2, { props: false }],
    'linebreak-style': ['error', 'unix'],
    'import/extensions': ['error', {
      js: 'always',
    }],
    'no-plusplus': ['error', {
      allowForLoopAfterthoughts: true,
    }],
    'prefer-destructuring': ['error', {
      array: false,
      object: false,
    }],
    'import/prefer-default-export': ['off', {
      target: 'single',
    }],
  },
  overrides: [
    {
      files: ['*.test.js'],
      rules: {
        'no-unused-expressions': 'off',
      },
    },
  ],
};
