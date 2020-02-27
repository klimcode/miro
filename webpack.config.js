const path = require('path');
const UglifyCss = require('uglifycss');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const name = 'emails-editor';
const _path = path.join.bind(path, __dirname);

module.exports = {
  mode: 'production',
  entry: _path('src', `${name}.js`),
  output: {
    path: __dirname,
    filename: `${name}.min.js`
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: _path('src', `${name}.css`),
        to: _path(`${name}.min.css`),
        transform(content) {
          return UglifyCss.processString(content.toString());
        },
      }
    ]),
  ],
};