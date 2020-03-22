module.exports = api => {
  api.cache(true);

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          useBuiltIns: 'usage',
          corejs: 3,
          // debug: true
        },
      ],
      '@babel/preset-typescript',
    ],
    plugins: [],
  };
};
