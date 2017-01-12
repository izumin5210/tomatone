const webpack            = require("webpack");
const merge              = require("webpack-merge");
const HtmlWebpackPlugin  = require("html-webpack-plugin");
const ExtractTextPlugin  = require("extract-text-webpack-plugin");

const baseConfig = require("../base");

const styleExtractor = new ExtractTextPlugin({ filename: "style.css", allChunks: true });

const config = merge.smart(baseConfig, {
  devtool: 'cheap-module-source-map',

  entry: [
    "babel-polyfill",
    "./src/index",
  ],

  output: {
    filename: "bundle.js",
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        loader: styleExtractor.extract({
          loader: [
            "css-loader",
            "postcss-loader",
          ],
        }),
      }
    ]
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      test: /\.css$/,
      options: {
        postcss: (bundle) => {
          return [
          require("postcss-smart-import")({
            addDependencyTo: bundle,
            plugins: [
              require("stylelint"),
            ]
          }),
          require("postcss-custom-properties"),
          require("postcss-apply"),
          require("postcss-color-function"),
          require("postcss-nesting"),
          require("postcss-csso"),
          require("postcss-reporter"),
        ]},
      },
    }),

    new webpack.optimize.OccurrenceOrderPlugin(),

    styleExtractor,

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
      output: {
        comments: false
      },
    }),

    new HtmlWebpackPlugin({
      title: "tomatone",
      filename: "index.html",
      template: "src/index.html",
      inject: true
    }),
  ],

  target: "electron-renderer",
});

module.exports = config;
