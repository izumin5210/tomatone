
import path from "path";

const config = {
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.jsx?$/,
        use: [
          { loader: "eslint-loader" },
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
    extensions: [".js", ".jsx", ".json"],
  },

  plugins: [
  ],

  externals: [
  ],
};

export default config;
