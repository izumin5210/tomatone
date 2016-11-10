import webpack  from "webpack";
import merge    from "webpack-merge";
import validate from "webpack-validator";

import baseConfig from "../base";

const PORT = process.env.PORT || 8080;

const config = validate(merge(baseConfig, {
  debug: true,
  devtool: 'inline-source-map',

  entry: [
    "react-hot-loader/patch",
    `webpack-hot-middleware/client?path=http://localhost:${PORT}/__webpack_hmr`,
    "babel-polyfill",
    "./src/index",
  ],

  output: {
    filename: "bundle.js",
    publicPath: `http://localhost:${PORT}/dist/`,
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),

    new webpack.NoErrorsPlugin(),

    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development")
    }),
  ],

  target: "electron-renderer",
}));

export default config;
