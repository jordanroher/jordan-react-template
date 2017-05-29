const path = require("path");

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const sourcePath = path.resolve(__dirname, "src");
const destPath = path.resolve(__dirname, "dist");

module.exports = {
	entry: {
		"js/app": [
			"./src/index.tsx"
		]
	},
	output: {
		path: destPath,
		filename: "[name].[chunkhash].js"
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".json", ".scss"]
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				include: sourcePath,
				loader: ["ts-loader"]
			},
			{
				test: /\.scss$/,
				include: sourcePath,
				use: ExtractTextPlugin.extract({
					use: ["css-loader", "sass-loader"]
				})
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
			inject: 'body'
		}),
		new ExtractTextPlugin({
			filename: "css/app.[chunkhash].css",
			allChunks: true
		}),
	],
	cache: false,
	externals: {
		"react": "React",
		"react-dom": "ReactDOM",
		"moment": "moment"
	},
};