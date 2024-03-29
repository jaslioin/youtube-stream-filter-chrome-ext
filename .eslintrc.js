module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: ['eslint:recommended', 'react-app', 'prettier'],
  parserOptions: {
    ecmaVersion: 11,
  },
  globals: {
    chrome: 'readonly',
  },
};
