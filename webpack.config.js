const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve('../../app/images/newsnor/cms/js/pc'),
    filename: 'editor.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 2,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2)$/,
        use: {
          loader: 'url-loader',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
  // devtool: 'cheap-module-eval-source-map',
  devtool: 'source-map',
  watchOptions: {
    aggregateTimeout: 200,
    poll: 5000,
    ignored: ['node_modules', '.git'],
  },
};
