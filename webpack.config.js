const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackAdditionalTemplatePlugin = require('html-webpack-additional-template-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');
const imageminWebp = require('imagemin-webp');

const src = path.join(__dirname, 'src');
const dist = path.join(__dirname, 'dist');
const isProduction =
  process.argv[process.argv.indexOf('--mode') + 1] === 'production';

const pages = require(path.join(src, 'views/pages.json'));
const additionalTemplate = pages.map(page => {
  return {
    template: path.join(src, 'views', page.template),
    filename: page.filename,
  };
});

module.exports = {
  entry: {
    app: path.join(src, 'js/app.js'),
  },

  output: {
    path: dist,
    filename: 'assets/js/[name].js',
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },

      {
        test: /\.ejs$/,
        use: [
          {
            loader: 'ejs-templates-loader',
            options: {
              delimiter: '$',
              minify: isProduction,
              minifyOptions: {
                collapseInlineTagWhitespace: true,
                collapseWhitespace: true,
                minifyJS: true,
              },
            },
          },
        ],
      },

      {
        test: /\.njk$/,
        use: [
          {
            loader: 'nunjucks-render-loader',
            options: {
              path: path.join(src, 'views'),
              context: {
                img_dir: path.join(src, 'img'),
              },
            },
          },
        ],
      },

      {
        test: /\.s?css$/,
        use: [
          'css-hot-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 3,
              url: true,
              modules: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: path.resolve(__dirname, './postcss.config.js'),
              },
            },
          },
          'sass-loader',
          'import-glob-loader',
        ],
      },

      {
        test: /\.svg$/,
        exclude: path.resolve(src, 'fonts'),
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              noquotes: true,
            },
          },
        ],
      },

      {
        test: /\.(jpe?g|png|gif|webp|ico)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10 * 1024,
              outputPath: 'assets/img',
            },
          },
        ],
      },

      {
        test: /\.(woff|woff2|eot|otf|ttf|svg)$/,
        exclude: path.join(src, 'img'),
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets/fonts',
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/css/styles.css',
    }),
    new HtmlWebpackPlugin({
      hash: true,
      additionalTemplate: additionalTemplate,
      alwaysWriteToDisk: true,
    }),
    new HtmlWebpackAdditionalTemplatePlugin(),
    new HtmlWebpackHarddiskPlugin(),
    new ImageminPlugin({
      bail: false,
      // cache: true,
      imageminOptions: {
        plugins: [
          imageminGifsicle(),
          imageminMozjpeg({
            progressive: true,
            quality: 75,
          }),
          imageminPngquant({
            quality: '65-90',
          }),
          imageminSvgo(),
          imageminWebp({
            quality: 75,
          }),
        ],
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new WebpackBuildNotifierPlugin({
      suppressSuccess: true,
      sound: false,
    }),
    new webpack.ProgressPlugin(),
  ],

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/].*\.js$/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
    minimizer: isProduction
      ? [
          new TerserPlugin({
            parallel: true,
            terserOptions: {
              compress: {
                drop_console: true,
              },
            },
          }),
        ]
      : [],
  },

  devServer: {
    contentBase: dist,
    watchContentBase: true,
    open: true,
    compress: true,
    hot: true,
    host: '0.0.0.0',
    disableHostCheck: true,
    useLocalIp: true,
  },
};

if (isProduction) {
  module.exports.plugins.push(new CleanWebpackPlugin());
}
