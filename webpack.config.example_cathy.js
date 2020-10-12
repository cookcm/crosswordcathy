const path = require('path');
const baseConfig = require('./webpack.config');

module.exports = {
  mode: 'development',
  entry: {
    example_cathy: path.join(
      __dirname,
      'examples',
      'exampleCrossword-cathy.js',
    ),
  },
  devServer: {
    contentBase: path.join(__dirname, './examples/'),
    port: 3002,
  },
  output: {
    filename: 'examples.js',
    path: path.join(__dirname, 'examples', 'lib'),
  },
  resolve: baseConfig.resolve,
  resolveLoader: baseConfig.resolveLoader,
  module: baseConfig.module,
};
