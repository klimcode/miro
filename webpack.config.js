/** @typedef {import('webpack').Configuration} Config */
const path = require("path");
const UglifyCss = require("uglifycss");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const name = "emails-editor";
const _path = path.join.bind(path, __dirname);

/** @type {Config} */
const old = {
  mode: "production",
  // mode: "development",
  entry: {
    [name]: _path("src", `${name}.js`)
  },
  output: {
    path: _path("dist"),
    filename: "[name].js",
    library: "emailsEditor",
    libraryTarget: "umd"
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: `src/${name}.css`,
        to: "[path][name].[ext]",
        transform(content) {
          return UglifyCss.processString(content.toString());
        }
      }
    ])
  ]
};

/** @type {Config} */
const _new = {
  mode: "pruduction",
  mode: "development",
  // entry: _path("src", `${name}.js`),
  entry: {
    [name]: _path("src", `${name}.js`)
  },
  output: {
    path: _path("dist"),
    filename: "[name].js",
    library: "EmailsEditor",
    libraryTarget: "var"
  },
  module: {
    rules: [
      // {
      //   test: /\.m?js$/,
      //   use: {
      //     loader: "babel-loader",
      //     options: {
      //       presets: ["@babel/preset-env"]
      //     }
      //   }
      // },
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, "css-loader"] }
    ]
  },
  plugins: [new MiniCssExtractPlugin()]
};

module.exports = old;
