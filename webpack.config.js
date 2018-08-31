const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const chokidar = require('chokidar');

const isProduction = !process.env.WEBPACK_SERVE;

module.exports = {
  mode: isProduction ? 'production' : 'development',

  entry: {
    app: ['@babel/polyfill', './src/js/app.js']
  },

  output: {
    path: path.join(__dirname, './dist'),
    filename: './assets/js/[name].js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
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
                minifyJS: true
              }
            }
          }
        ]
      },

      {
        test: /\.s?css$/,
        use: [
          'css-hot-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2
            }
          },
          'postcss-loader',
          'sass-loader'
        ]
      },

      {
        test: /\.(jpe?g|png|gif|svg|ico)$/,
        include: [path.resolve(__dirname, 'src', 'img')],
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: '[hash].[ext]',
              outputPath: 'assets/img/',
              publicPath: '/assets/img/'
            }
          }
        ]
      },

      {
        test: /\.(woff|woff2|eot|otf|ttf|svg)$/,
        include: [
          path.resolve(__dirname, 'src', 'font'),
          path.resolve(__dirname, 'node_modules')
        ],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/fonts/[hash].[ext]',
              publicPath: path => {
                return '../' + path;
              }
            }
          }
        ]
      }
    ]
  },

  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'initial'
    },
    minimizer: isProduction
      ? [
          new UglifyJSPlugin({
            uglifyOptions: {
              compress: {
                drop_console: true
              }
            }
          })
        ]
      : []
  },

  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      filename: 'index.html',
      template: './src/views/index.ejs'
    }),
    new MiniCssExtractPlugin({
      filename: './assets/css/style.css'
    })
  ],

  serve: {
    content: path.resolve(__dirname, 'dist'),
    open: true,
    add: (app, middleware) => {
      middleware.webpack().then(result => {
        const server = result.hotClient.server;
        const watchPath = path.resolve(__dirname, 'src', '**', '*.ejs');
        const options = { ignoreInitial: true };
        const watcher = chokidar.watch(watchPath, options);
        watcher.on('change', () => {
          server.broadcast('{ "type": "window-reload", "data": {} }');
        });
      });
    }
  }
};

if (isProduction) {
  module.exports.plugins.push(new CleanWebpackPlugin(['dist']));
}
