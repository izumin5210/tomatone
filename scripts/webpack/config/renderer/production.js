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
    "./src/renderer/index",
  ],

  output: {
    filename: "renderer.js",
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
      inject: false
    }),
  ],

  target: "electron-renderer",
}));

export default config;
