module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:vue/vue3-recommended'],
  // plugins: ['vitest', 'cypress'],
  globals: {
    ga: 'readonly', // Google Analytics
    __statics: 'readonly',
    process: 'readonly',
    chrome: 'readonly',
  },
  rules: {
    'no-unused-vars': 'warn',
    
    'vue/no-unused-vars': 'warn',
    'vue/multi-word-component-names': 'off',
    "vue/max-attributes-per-line": ["error", {
      // the number of attributes per line when
      "singleline": {
        "max": 4
      },      
      "multiline": {
        "max": 1
      }
    }],
    "vue/first-attribute-linebreak": ["error", {
      "singleline": "beside",
      "multiline": "below"
    }],
    "vue/attribute-hyphenation": "off",
    'space-before-function-paren': ['error', 'never'],
    'comma-dangle': ['warn', 'only-multiline'],
    'vue/require-default-prop': 'error',
    'vue/require-valid-default-prop': 'warn',
    'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 1 }],
    'indent': ['error', 2],

    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
  overrides: [
    {
      files: ['**/*.spec.{js}'],
    },
  ],
}
