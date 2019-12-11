const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const babelConfig = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          electron: '7.1.3',
        },
        modules: 'commonjs',
      },
    ],
    '@babel/preset-react',
    '@babel/preset-flow',
  ],
  plugins: [
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    'react-hot-loader/babel',
  ],
}

module.exports = {
  target: 'electron-renderer',
  entry: ['./src/renderer/index.js'],
  output: {
    path: path.resolve(__dirname, '.webpack'),
    filename: 'renderer.bundle.js',
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
        options: babelConfig,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        use: ['file-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: ['file-loader'],
      },
    ],
  },
  resolve: {
    alias: {},
  },
}
