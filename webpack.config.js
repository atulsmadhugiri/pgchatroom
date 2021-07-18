module.exports = {
  entry: {
    chat: ['./src/js/chat.js'],
    json_to_csv: ['./src/js/json_to_csv.js'],
    admin: ['./src/js/admin.js'],
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx'],
  },
  output: {
    path: __dirname + '/build',
    publicPath: '/build/',
    filename: '[name].bundle.js',
  },
  watchOptions: {
    ignored: /node_modules/,
  },
  module: {
    rules: [
      { test: /\.s?css$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            cacheCompression: false,
          },
        },
      },
    ],
  },
};
