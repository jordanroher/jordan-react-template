const debug = process.env.NODE_ENV !== "production";

const webpack = require("webpack");
const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

let plugins = [
    new webpack.optimize.CommonsChunkPlugin({
        names: ["vendor1", "vendor2"]
    }),
    new CleanWebpackPlugin(["dist"], null),
    new HtmlWebpackPlugin({
        template: './src/index.html',
        inject: 'body'
    })
];

module.exports = {
    entry: {
        app: "./src/index.tsx",
        vendor1: ["react", "react-dom"],
        vendor2: ["moment"]
    },
    output: {
        filename: "[name].[chunkhash].js",
        path: __dirname + "/dist"
    },

    plugins: plugins,

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: {
                    compilerOptions: {
                        "sourceMap": debug
                    }
                }
            },

            {
                test: /\.tpl.html/,
                loader: "html"
            },

            debug
                ? {
                    enforce: "pre",
                    test: /\.js$/,
                    loader: "source-map-loader"
                }
                : null,

            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    }
};