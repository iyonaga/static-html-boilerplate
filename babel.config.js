module.exports = api => {
  api.cache(true);

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          targets: {
            ie: '11'
          },
          useBuiltIns: 'usage',
          debug: true
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
