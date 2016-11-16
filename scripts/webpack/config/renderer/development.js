import webpack  from "webpack";
import merge    from "webpack-merge";

import baseConfig from "../base";

const PORT = process.env.PORT || 8888;

const publicPath = `http://localhost:${PORT}/dist/`;

const config = merge.smart(baseConfig, {
  devtool: 'inline-source-map',

  entry: [
    "react-hot-loader/patch",
    `webpack-hot-middleware/client?path=http://localhost:${PORT}/__webpack_hmr`,
    "babel-polyfill",
    "./src/index",
  ],

  output: {
    filename: "bundle.js",
    publicPath: publicPath,
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        loaders: [
          "style-loader",
          { loader: "css-loader" },
          { loader: "postcss-loader?sourceMap=inline" },
        ],
      }
    ]
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: true,
      minimize: false,
      options: {
        postcss: (bundle) => [
          require("postcss-smart-import")({
            addDependencyTo: bundle,
            plugins: [
              require("stylelint"),
            ],
          }),
          require("postcss-custom-properties"),
          require("postcss-apply"),
          require("postcss-color-function"),
          require("postcss-nesting"),
          require("postcss-reporter"),
        ],
      },
    }),

    new webpack.HotModuleReplacementPlugin(),

    new webpack.NoErrorsPlugin(),

    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development")
    }),
  ],

  target: "electron-renderer",
});

export default config;
