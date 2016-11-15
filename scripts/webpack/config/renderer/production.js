import webpack            from "webpack";
import merge              from "webpack-merge";
import HtmlWebpackPlugin  from "html-webpack-plugin";
import ExtractTextPlugin  from "extract-text-webpack-plugin";

import baseConfig from "../base";

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
        test: /style\.css$/,
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
      debug: false,
      minimize: true,
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

    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),

    styleExtractor,

    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false
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

export default config;
