const webpack        = require("webpack");
const FlowtypePlugin = require("flowtype-loader/plugin");
const path = require("path");

const nodeEnv = process.env.NODE_ENV;
const isProduction = nodeEnv === "production";

const config = {
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.jsx?$/,
        use: [
          { loader: "eslint-loader" },
          { loader: "flowtype-loader" },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$/,
        use: [
          { loader: "babel-loader" },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        use: [
          { loader: "json-loader" },
        ],
      },
      {
        test: /\.mp3$/,
        loader: "file-loader"
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=application/octet-stream"
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader"
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=image/svg+xml"
      }
    ]
  },

  output: {
    path: path.join(__dirname, "../../../dist"),
    libraryTarget: "commonjs2",
  },

  resolve: {
    modules: [
      path.resolve(__dirname, './src'),
      'node_modules',
    ],
    extensions: [".js", ".jsx", ".json"],
  },

  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(nodeEnv),
    }),

    new webpack.LoaderOptionsPlugin({
      debug: !isProduction,
      minimize: isProduction,
    }),

    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

    new FlowtypePlugin(),
  ],

  externals: [
  ],
};

module.exports = config;
