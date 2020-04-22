const { ContextReplacementPlugin } = require('webpack');
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const glob = require('glob')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin')
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;
const CopyWebpackPlugin = require('copy-webpack-plugin');

const PATHS = {
  src: path.join(__dirname, 'src'),
  views: path.join(__dirname, 'src', 'views'),
  style: path.resolve(__dirname, 'src', "style.scss"),
}

module.exports = {
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      _appRoot: path.join(PATHS.src, 'app'),
    }
  },
  entry: {
    main: PATHS.src + '/main.ts',
    // criticalCss: PATHS.style, // this's a chunk, source from a file with my critical CSS I wanna inline!
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },

  module: {
    rules: [
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            ignoreCustomFragments: [/<%=.*%>/],
            attrs: [/* ':data-src' */]
          }
        }
      },
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [{ loader: "ts-loader" }]
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              sourceMap: true,
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          "css-loader",
          {
            loader: 'resolve-url-loader',
            // options: {...}
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            }
          }
        ],
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          mimetype: 'application/font-woff'
        }
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        query: {
          limit: '10000',
          mimetype: 'application/octet-stream'
        }
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader',
        query: {
          limit: 8192
        }
      },
      {
        test: /\.ico(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader'
      },

      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'svg-url-loader',
        query: {
          limit: '10000',
          mimetype: 'application/svg+xml'
        }
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [{
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',
                outputPath: 'assets/'
            }
        }]
    },
      /* {
        test: /\.json$/,
        loader: 'json-loader'
      }, */
    ]
  },


  plugins: [
    // new ContextReplacementPlugin(/pages/, '*.controller.(ts|js)'),
    new CleanWebpackPlugin(),
    ...getHWPConfig(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
      whitelist: function() { return ['sal-animate']},
    }),
    // new HTMLInlineCSSWebpackPlugin(),
    new CopyWebpackPlugin([
      {from:'src/assets',to:'assets'}
    ]),
  ],

  optimization: {
    splitChunks: {
      // chunks: 'all',
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    },
  },
  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  externals: {
      // "ParticlesJs": "./node_modules/particles.js/particles.js"
  }
};

function getHWPConfig() {
  let data = [];
  const isMultiPage = fs.existsSync(PATHS.views) && fs.readdirSync(PATHS.views).length;
  if (isMultiPage) {
    const viewsList = fs.readdirSync(PATHS.views);
    viewsList.forEach(viewFileName => data.push(
      new HtmlWebpackPlugin({
        template: path.join(PATHS.views, viewFileName),
        filename: viewFileName, //relative to root of the application
        hash: true,
        minify: {
          removeComments: true,
        },
        favicon: path.join(PATHS.src, 'assets', 'favicon.ico'),

      }),
    ))
  } else {
    data.push(
      new HtmlWebpackPlugin({
        template: path.join(PATHS.src, 'index.html'),
        filename: 'index.html', //relative to root of the application
        hash: true,
        minify: {
          removeComments: true,
        },
        favicon: path.join(PATHS.src, 'assets', 'favicon.ico'),

      })
    );
  }

  return data;
}