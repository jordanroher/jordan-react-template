const debug = process.env.NODE_ENV !== "production";

const webpack = require("webpack");
const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

var config = {
    entry: {
        app: "./src/index.tsx",
        vendor1: ["react", "react-dom"],
        vendor2: ["moment"]
    },
    output: {
        filename: "[name].[chunkhash].js",
        path: __dirname + "/dist"
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
        names: ["vendor1", "vendor2"]
        }),
        new CleanWebpackPlugin(["dist"], null),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'body'
        })
    ],

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    devServer: {
        historyApiFallback: true,
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

            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            },

            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    }
};

if (!debug) {
    config.plugins.push(
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new webpack.optimize.UglifyJsPlugin()
    );
}

module.exports = config;