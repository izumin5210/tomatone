
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
