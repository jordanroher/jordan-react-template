const webpack = require("webpack");
const path = require("path");
const { assign, concat } = require("lodash");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const EnvironmentPlugin = require("inline-environment-variables-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const debug = process.env.NODE_ENV !== "production";
const sourcePath = path.resolve(__dirname, "src");
const destPath = path.resolve(__dirname, "dist");

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
        "js/app": [
            "./src/index.tsx"
        ],
        "js/lib1": [
             "react",
             "react-dom",
        ],
        "js/lib2": [
             "moment"
        ]
    },
    plugins: [
        new CleanWebpackPlugin(["./dist"], null),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'body'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ["js/lib1", "js/lib2"],
            filename: "js/lib.[chunkhash].js",
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
        historyApiFallback: true
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
        new ExtractTextPlugin({
            filename: "css/app.css",
            allChunks: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            comments: false
        }),
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

module.exports = debug
    ? devConfig
    : prodConfig;