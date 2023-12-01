module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    '@babel/plugin-transform-export-namespace-from',
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.js', '.jsx', '.tsx', '.json'],
        alias: {
          '@': ['./src'],
        },
      },
    ],
  ],
};
