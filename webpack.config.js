const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: "production",
  // Where files should be sent once they are bundled
  entry: {
    roadrunner: './js/roadrunner.js',
  },
  output: {
    path: path.join(__dirname, 'rr/static/roadrunner'),
    filename: '[name].js',
    chunkFilename: '[name]-[id].chunk.js'
  },
  externals: {
    jquery: 'jQuery',
  },
  // webpack 5 comes with devServer which loads in development mode
  devServer: {
    port: 3000,
    watchContentBase: true
  },
  devtool: "eval",
  // Rules of how webpack will take our files, complie & bundle them for the browser 
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /nodeModules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'roadrunner.css'
    }),
    // new HtmlWebpackPlugin({ template: './src/index.html' })
  ],
}