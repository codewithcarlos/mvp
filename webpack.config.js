var path = require("path");
var SRC_DIR = path.join(__dirname, "client/src");
var DIST_DIR = path.join(__dirname, "public");

module.exports = {
  entry: ["@babel/polyfill", `${SRC_DIR}/index.js`],
  output: {
    filename: "bundle.js",
    path: DIST_DIR
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"]
        }
      }
    ]
  }
};
