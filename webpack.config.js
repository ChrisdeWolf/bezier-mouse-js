const path = require("path");

module.exports = {
  entry: "./docs/example.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "example.bundle.js",
    clean: true,
  },
  resolve: {
    alias: {
      node_modules: path.join(__dirname, "node_modules"),
    },
  },
  target: "web",
  mode: "development",
  devServer: {
    static: ".",
  },
};
