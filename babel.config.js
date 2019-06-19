module.exports = api => {
  api.cache(true);

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          useBuiltIns: 'usage',
          corejs: 3
          // debug: true
        }
      ]
    ],
    plugins: [
      '@babel/transform-async-to-generator',
      '@babel/proposal-class-properties',
      '@babel/proposal-object-rest-spread',
      '@babel/plugin-proposal-function-bind'
    ]
  };
};
