// Webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// config.entry.unshift("webpack-dev-server/client?http://localhost:8080/");

module.exports = {
    mode: "development",
    watch: true,
    entry: "./src/index.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },

    devtool: "eval-source-map",
    devServer: {
        watchFiles: ["./src/template.html"],
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/template.html",
        }),
    ],

    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },

            {
                test: /\.html$/i,
                loader: "html-loader",
            },

            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
            },

            {
                test: /\.(mp4|webm|ogg|avi)$/i,
                type: "asset/resource",
            },
        ],
    },
};