const TerserPlugin = require("terser-webpack-plugin");

const base = require("./webpack.config")

module.exports = {
  ...base,
  mode: "production",
  devtool: "source-map",
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        safari10: true
      }
    })],
  }
}