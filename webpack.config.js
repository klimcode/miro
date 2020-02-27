const path = require("path");
const UglifyCss = require("uglifycss");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const name = "emails-editor";
const _path = path.join.bind(path, __dirname);

module.exports = {
  mode: "production",
  entry: _path("src", `${name}.js`),
  output: {
    path: __dirname,
    filename: `${name}.min.js`
  },
  // // ES5 transpiling can be activated to support IE but who cares
  // module: {
  //   rules: [
  //     {
  //       test: /\.m?js$/,
  //       use: {
  //         loader: "babel-loader",
  //         options: {
  //           presets: ["@babel/preset-env"]
  //         }
  //       }
  //     }
  //   ]
  // },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: _path("src", `${name}.css`),
        to: _path(`${name}.min.css`),
        transform(content) {
          return UglifyCss.processString(content.toString());
        }
      }
    ])
  ]
};
