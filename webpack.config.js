// npm install --save cross-env
// RUN: cross-env NODE_ENV=production webpack

const webpack = require("webpack");
const path = require("path");
const { assign, concat } = require("lodash");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const EnvironmentPlugin = require("inline-environment-variables-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const debug = process.env.NODE_ENV !== "production";
const sourcePath = path.resolve(__dirname, "src"); // or .resolve()
const destPath = path.resolve(__dirname, "dist"); // or .resolve()

function styleLoaders() {
    const styleLoader = {
        loader: "style-loader",
        options: {
            singleton: true
        }
    };

    const cssLoader = {
        loader: "css-loader",
        options: { minimize: true }
    };

    const sassLoader = {
        loader: "sass-loader"
    };

    if(debug) {
        return [styleLoader, cssLoader, sassLoader];
    }

    return ExtractTextPlugin.extract({
        fallback: styleLoader,
        use: [cssLoader, sassLoader]
    });
}

const baseConfig = {
    cache: false,
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json", "*"]
    },
    output: {
        path: destPath,
        filename: "[name].[chunkhash].js"
    },
    entry: {
        "assets/app": [
            "./src/index.tsx"
        ],
        "assets/vendor": [
             "react",
             "react-dom",
             "moment",
             //"redux"
        ]
    },
    plugins: [
        new CleanWebpackPlugin(["dist"], null),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'body'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "assets/vendor",
            filename: "assets/vendor.js",
            minChunks: Infinity
        }),
        new EnvironmentPlugin(["NODE_ENV"], {
            warnings: false
        }),
    ],
    module: {
        rules: [
            {
                test: /\.tpl.html/,
                include: sourcePath,
                loader: "html-loader",
            },
            {
                enforce: "pre",
                test: /\.js$/,
                include: sourcePath,
                loader: "source-map-loader",
            },
            {
                test: /\.scss$/,
                include: sourcePath,
                use: styleLoaders(),
            }
        ]
    }
};

const devConfig = assign({}, baseConfig, {
    devtool: "cheap-module-eval-source-map",
    output: assign({}, baseConfig.output, {
        publicPath: "http://localhost:8080",
        devtoolModuleFilenameTemplate: "webpack:///[absolute-resource-path]"
    }),
    devServer: {
        port: 8080,
        inline: true,
        historyApiFallback: true,
        publicPath: "http://localhost:8080",
        contentBase: baseConfig.output.path,
        stats: "errors-only",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credential": "*",
            "Access-Control-Max-Age": "1",
        },
    },
    module: {
        rules: concat(baseConfig.module.rules, [
            {
                test: /\.tsx?$/,
                include: sourcePath,
                loader: ["awesome-typescript-loader"]
            }
        ])
    }
});

const prodConfig = assign({}, baseConfig, {
    bail: true,
    devtool: false,
    plugins: concat(baseConfig.plugins, [
        /*
        new webpack.LoaderOptionsPlugin({
            debug: false,
            minimize: true
        }),
        */
        new ExtractTextPlugin({
            filename: "assets/app.css",
            allChunks: true
        }),
        new webpack.optimize.UglifyJsPlugin(),
    ]),
    module: {
        rules: concat(baseConfig.module.rules, [
            {
                test: /\.tsx?$/,
                include: sourcePath,
                loader: ["awesome-typescript-loader"]
            }
        ])
    }
});

const finalConfig = debug
    ? devConfig
    : prodConfig;

//console.log(finalConfig);

module.exports = finalConfig;