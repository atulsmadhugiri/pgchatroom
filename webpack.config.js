var webpack = require("webpack");

module.exports = {
    entry: {
        chat: ["./src/js/chat.jsx"],
        json_to_csv: ["./src/js/json_to_csv.jsx"],
        admin: ["./src/js/admin.jsx"],
    },
    resolve: {
        extensions: ["*", ".webpack.js", ".web.js", ".js", ".jsx"]
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
        rules: [
            {
                enforce: 'pre',
                test: /\.jsx?$/,
                loader: 'eslint-loader',
                exclude: /node_modules/,
                options: {
                    configFile: ".eslintrc"
                }
            },
            {
                test: require.resolve("react"),
                loader: "expose-loader?React"
            },
            {
                test: require.resolve("firebase"),
                loader: "expose-loader?Firebase"
            },
            {
                test: /\.s?css$/, 
                loader: "style-loader!css-loader!sass-loader"
            },
            {
                test: /\.jsx?$/,
                loaders: ["react-hot-loader/webpack", "babel-loader"],
                exclude: /node_modules/
            }
        ],

        // loaders: [
        //     { test: require.resolve("react"), loader: "expose?React" },
        //     { test: require.resolve("firebase"), loader: "expose?Firebase" },
        //     { test: /\.s?css$/, loader: "style!css!sass" },
        //     { test: /\.jsx?$/, loaders: ["react-hot", "babel?optional=runtime"], exclude: /node_modules/ }
        // ]
    },
    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),

    ],
    node: {
        fs: 'empty',
      }
    // eslint: {
    //     configFile: ".eslintrc"
    // }
};
