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
    // devServer: {
    //     contentBase: './dist',
    //     hot: true,
    //     open: true,
    //     port: 8080,
    //     watchFiles: ["./src/template.html"],
    //     watchContentBase: true,
    // },

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

            {
                test: /\.(woff2?|eot|ttf|otf)$/i,
                type: "asset/resource",
            },

            {
                test: /\.(mp3|wav|ogg)$/i,
                type: "asset/resource",
            },
        ],
    },
};