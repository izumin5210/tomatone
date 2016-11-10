import webpack  from "webpack";
import merge    from "webpack-merge";
import validate from "webpack-validator";
import HtmlWebpackPlugin from "html-webpack-plugin";

import baseConfig from "../base";

const config = validate(merge(baseConfig, {
  debug: false,
  devtool: 'cheap-module-source-map',

  entry: [
    "babel-polyfill",
    "./src/index",
  ],

  output: {
    filename: "bundle.js",
  },

  plugins: [
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

    new HtmlWebpackPlugin({
      title: "tomatone",
      filename: "index.html",
      template: "src/index.html",
      inject: true
    }),
  ],

  target: "electron-renderer",
}));

export default config;
