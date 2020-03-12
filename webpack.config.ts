import path from 'path';
import webpack from 'webpack';
import sass from 'sass';
import fibers from 'fibers';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackAdditionalTemplatePlugin from 'html-webpack-additional-template-plugin';
import HtmlWebpackHarddiskPlugin from 'html-webpack-harddisk-plugin';
import ScriptExtHtmlWebpackPlugin from 'script-ext-html-webpack-plugin';
import WebpackBuildNotifierPlugin from 'webpack-build-notifier';
import WebpackBar from 'webpackbar';
import TerserPlugin from 'terser-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ImageminPlugin from 'imagemin-webpack';
import pages from './src/views/pages.json';

const config: webpack.ConfigurationFactory = (env, argv) => {
  const src = path.join(__dirname, 'src');
  const dist = path.join(__dirname, 'dist');
  const isProduction = argv.mode === 'production';
  const additionalTemplate = pages.map(page => ({
    template: path.join(src, 'views', page.template),
    filename: page.filename,
  }));

  return {
    entry: {
      app: path.join(src, 'scripts/app.ts'),
    },

    output: {
      path: dist,
      filename: 'assets/scripts/[name].js',
      publicPath: '/',
    },

    module: {
      rules: [
        {
          test: /\.(j|t)sx?$/,
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
                  img_dir: path.join(src, 'images'),
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
            {
              loader: 'sass-loader',
              options: {
                implementation: sass,
                sassOptions: {
                  fiber: fibers,
                },
              },
            },
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
                outputPath: 'assets/images',
              },
            },
          ],
        },

        {
          test: /\.(woff|woff2|eot|otf|ttf|svg)$/,
          exclude: path.join(src, 'images'),
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

    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json'],
    },

    plugins: [
      new MiniCssExtractPlugin({
        filename: 'assets/styles/styles.css',
      }),
      new HtmlWebpackPlugin({
        inject: 'head',
        hash: true,
        additionalTemplate,
        alwaysWriteToDisk: true,
      }),
      new HtmlWebpackAdditionalTemplatePlugin(),
      new HtmlWebpackHarddiskPlugin(),
      new ScriptExtHtmlWebpackPlugin({
        defaultAttribute: 'defer',
      }),
      new ImageminPlugin({
        bail: false,
        // cache: true,
        imageminOptions: {
          plugins: [
            'gifsicle',
            [
              'mozjpeg',
              {
                progressive: true,
                quality: 75,
              },
            ],
            [
              'pngquant',
              {
                quality: [0.65, 0.9],
              },
            ],
            'svgo',
            [
              'webp',
              {
                quality: 75,
              },
            ],
          ],
        },
      }),
      new webpack.HotModuleReplacementPlugin(),
      new WebpackBuildNotifierPlugin({
        suppressSuccess: true,
        sound: false,
      }),
      new WebpackBar(),
      ...(isProduction ? [new CleanWebpackPlugin()] : []),
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
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            compress: {
              drop_console: true,
            },
          },
        }),
      ],
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
};

export default config;
