var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: [path.resolve(__dirname, './js/app.js')],
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    // new webpack.ProvidePlugin({
    //   $: "jquery",
    //   jQuery: "jquery"
    // }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [path.join(__dirname, 'js/')],
        use: [
          {
            loader: 'react-hot-loader'
          },
          {
            loader: 'babel-loader',
          }
        ]
      }
    ]
  }
};
