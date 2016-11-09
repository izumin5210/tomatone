import webpack  from "webpack";
import merge    from "webpack-merge";
import validate from "webpack-validator";

import baseConfig from "../base";

const config = validate(merge(baseConfig, {
  debug: false,

  entry: [
    "babel-polyfill",
    "./src/main",
  ],

  output: {
    filename: "main.js",
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
  ],

  node: {
    __dirname: false,
    __filename: false
  },

  target: "electron-main",
}));

export default config;
