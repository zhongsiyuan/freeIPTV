module.exports = {
  root: true,
  extends: ['@react-native', 'airbnb-base', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-else-return': 'off',
    'import/extensions': 'off',
    'no-restricted-exports': 'off',
  },
  settings: {
    'import/resolver': {
      'babel-module': { allowExistingDirectories: true },
    },
  },
};
