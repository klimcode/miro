/** @typedef {import('webpack').Configuration} Config */
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const name = "emails-editor";
const _path = path.join.bind(path, __dirname);
const isDev = process.env.NODE_ENV !== "production";

/** @type {Config} */
const cfg = {
  mode: isDev ? "development" : "production",
  devtool: isDev ? "source-map" : false,
  entry: {
    [name]: _path("src", `${name}.js`)
  },
  output: {
    path: _path("dist"),
    // publicPath: "/dist/",
    filename: "[name].js",
    library: "emailsEditor",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "linaria/babel"]
            }
          },
          {
            loader: "linaria/loader",
            options: { sourceMap: isDev }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { hmr: isDev }
          },
          {
            loader: "css-loader",
            options: { sourceMap: isDev }
          }
        ]
      },
      {
        test: /\.(jpg|png|gif|woff|woff2|eot|ttf|svg)$/,
        use: [{ loader: "file-loader" }]
      }
    ]
  },
  plugins: [new MiniCssExtractPlugin()],
  devServer: {
    open: true,
    publicPath: "/dist/",
    historyApiFallback: true
  }
};

module.exports = cfg;
