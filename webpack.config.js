var webpack = require("webpack");

module.exports = {
    entry: {
        chat: ["./src/js/chat.js"],
        json_to_csv: ["./src/js/json_to_csv.js"],
        admin: ["./src/js/admin.js"]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        path: __dirname + "/build",
        publicPath: "/build/",
        filename: "[name].bundle.js"
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
