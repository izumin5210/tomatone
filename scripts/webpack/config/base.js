import validate from "webpack-validator";

import path from "path";

const config = validate({
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loaders: ["eslint-loader"],
        exclude: /node_modules/,
      },
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ["babel-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        loader: "json-loader",
      },
    ]
  },

  output: {
    path: path.join(__dirname, "../../../dist"),
    libraryTarget: "commonjs2",
  },

  resolve: {
    extensions: ["", ".js", ".jsx", ".json"],
  },

  plugins: [
  ],

  externals: [
  ],
});

export default config;
