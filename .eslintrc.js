module.exports = {
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',  
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
  ],
  plugins: [
    'vue',
    'jest',
    'prettier', 
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'off',
    'prettier/prettier': 'error',
  },
};
