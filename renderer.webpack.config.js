const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

const babelConfig = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          electron: '7.1.3'
        }
      }
    ],
    '@babel/preset-react'
  ],
  plugins: [
    "@babel/plugin-proposal-export-default-from",
    "@babel/plugin-proposal-export-namespace-from",
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-syntax-import-meta",
    ["@babel/plugin-proposal-class-properties", { "loose": true }],
    "react-hot-loader/babel"
  ]
}

module.exports = {
  target: 'electron-renderer',
  mode: process.env.NODE_ENV,
  entry: './src/renderer/index.js',
  output: {
    path: path.resolve(__dirname, 'dist/renderer'),
    publicPath: '/dist/renderer',
    filename: 'renderer.bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/renderer/index.html',
      filename: 'index.html',
      title: 'Ledger Live',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/i,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: babelConfig
      },
    ],
  },
  devServer: {
    contentBase: './dist/renderer',
    hot: true,
},
  resolve: {
    alias: { 'react-dom': '@hot-loader/react-dom'  }
  }
}