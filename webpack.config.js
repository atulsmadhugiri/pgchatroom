var webpack = require("webpack");

module.exports = {
    entry: {
        app: ["./src/chat.js"]
    },
    output: {
        path: __dirname + "/build",
        publicPath: "/build/",
        filename: "bundle.js"
    },
    module: {
        preLoaders: [
            { test: /\.jsx?$/, loader: "eslint", exclude: /node_modules/ }
        ],
        loaders: [
            { test: /\.s?css$/, loader: "style!css!sass" },
            { test: /\.jsx?$/, loader: "babel", exclude: /node_modules/ }
        ]
    },
    plugins: [
      new webpack.NoErrorsPlugin()
    ],
    eslint: {
        configFile: ".eslintrc"
    }
};
