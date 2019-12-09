module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['plugin:react/recommended', 'plugin:flowtype/recommended', 'standard'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', 'flowtype'],
  rules: {
    'space-before-function-paren': 0,
    'comma-dangle': 0,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
