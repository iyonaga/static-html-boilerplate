module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
  plugins: ['stylelint-scss', 'stylelint-order'],
  rules: {
    'at-rule-no-unknown': null,
    'at-rule-empty-line-before': [
      'always',
      {
        ignore: [
          'after-comment',
          'blockless-after-same-name-blockless',
          'first-nested',
        ],
        ignoreAtRules: ['else'],
      },
    ],
    'declaration-empty-line-before': null,
    'font-family-no-missing-generic-family-keyword': null,
    // indentation: 2,
    'length-zero-no-unit': true,
    'no-descending-specificity': null,
    'number-leading-zero': 'always',
    // 'number-leading-zero': 'never',
    'value-list-comma-space-after': 'always-single-line',
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global'],
      },
    ],
    'value-keyword-case': null,
    'no-duplicate-selectors': null,
    'declaration-block-no-duplicate-properties': null,
    'order/order': ['custom-properties', 'declarations'],
    'order/properties-alphabetical-order': true,
  },
};
