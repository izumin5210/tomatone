const webpack    = require("webpack");
const merge      = require("webpack-merge");
const CopyPlugin = require("copy-webpack-plugin");

const path = require("path");

const baseConfig = require("../base");

const config = merge(baseConfig, {
  context: path.join(__dirname, "../../../../src"),

  entry: [
    "babel-polyfill",
    "./main",
  ],

  output: {
    filename: "main.js",
  },

  plugins: [
    new CopyPlugin([
      { from: "./assets/images/icon*.png" },
    ]),

    new webpack.LoaderOptionsPlugin({
      debug: false,
      minimize: true,
    }),

    new webpack.optimize.OccurrenceOrderPlugin(),

    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),

    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false
      },
    }),
  ],

  node: {
    __dirname: false,
    __filename: false
  },

  target: "electron-main",
});

module.exports =  config;
