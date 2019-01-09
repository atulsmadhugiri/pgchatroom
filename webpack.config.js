require("babel-polyfill");
var webpack = require("webpack");

module.exports = {
    entry: {
        polyfill: ["babel-polyfill"],
        chat: ["babel-polyfill", "./src/js/chat.js"],
        json_to_csv: ["./src/js/json_to_csv.js"],
        admin: ["./src/js/admin.js"],
    },
    resolve: {
        extensions: ["", ".webpack.js", ".web.js", ".js", ".jsx"]
    },
    output: {
        path: __dirname + "/build",
        publicPath: "/build/",
        filename: "[name].bundle.js"
    },
    watchOptions: {
        ignored: /node_modules/,
    },
    module: {
        preLoaders: [
            { test: /\.jsx?$/, loader: "eslint", exclude: /node_modules/ }
        ],
        loaders: [
            { test: require.resolve("react"), loader: "expose?React" },
            { test: require.resolve("firebase"), loader: "expose?Firebase" },
            { test: /\.s?css$/, loader: "style!css!sass" },
            {   test: /\.jsx?$/, 
                loaders: ["react-hot", "babel-loader"], 
                exclude: /node_modules/ ,
                presets: ["env"],
                plugins: [
                    ["transform-regenerator", "transform-runtime"],
                ]
            }
        ]
    },
    plugins: [
        new webpack.NoErrorsPlugin(), 
    //   babel-plugin-transform-runtime"
    ],
    eslint: {
        configFile: ".eslintrc"
    },
    node: {
        fs: 'empty'
    }
};
