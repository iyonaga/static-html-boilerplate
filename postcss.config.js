/* eslint-disable @typescript-eslint/no-var-requires */
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
/* eslint-enable @typescript-eslint/no-var-requires */

module.exports = {
  plugins: [
    autoprefixer(),
    cssnano({
      preset: [
        'default',
        {
          discardComments: {
            removeAll: true,
          },
        },
      ],
    }),
  ],
};
