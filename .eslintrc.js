module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['plugin:react/recommended', 'plugin:flowtype/recommended', 'standard'],
  globals: {
    __DEV__: 'readonly',
    INDEX_URL: 'readonly',
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    __SENTRY_URL__: 'readonly',
    __APP_VERSION__: 'readonly',
    __GIT_REVISION__: 'readonly',
    __GLOBAL_STYLES__: 'readonly',
    __PROD__: 'readonly',
    __static: 'readonly',
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
    'no-prototype-builtins': 0,
    'promise/param-names': 0,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
