const webpack = require('webpack');
const path = require('path');
const pkg = require("./package.json");
const today = new Date();

// Armado de index.html
const HtmlWebpackPlugin = require('html-webpack-plugin');
const indexHtmlPlugin = new HtmlWebpackPlugin({
	title : pkg.title,
	minify : {
		collapseWhitespace: true
	},
	template : './src/index.ejs',
	excludeChunks: ['login', 'error']
});
var ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

var webPackConfig = {
	// context : path.resolve('./src'),
	// entry: 'index',
	// entry: './src/app/app',
	entry: {
		app: './src/index', // Sin extensión revisa los resolves.
		login : './src/login',
		error : './src/error'
	},
	output: {
		filename: '[name].bundle.js',
		// publicPath: 'src/dist',
		path: path.resolve(__dirname, 'dist')
	},
	devServer : {
		contentBase: path.join(__dirname, "dist"),
		compress: true,
		// host: '0.0.0.0',
		port: 8888,
		// public: '0.0.0.0:8888',
		open: true,
		stats: "minimal"
		// stats: 'errors-only'
	},
	resolve: {
		// Add '.ts' and '.tsx' as a resolvable extension.
		extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".html"],
		alias : {
			'baseCss' : path.resolve(__dirname, '/src/css')
		}
	},
	// devtool: "source-map", // enum
	plugins: [
		// Asigna variables globales según librerias package.json
		new webpack.ProvidePlugin({
			"$": "jquery",
			"jQuery": 'jquery',
			"window.jQuery": "jquery"
		}),
		// Typing check for TS
		new ForkTsCheckerWebpackPlugin(),
		// Armado de index
		indexHtmlPlugin,
		// Banner de bundle
		new webpack.BannerPlugin(pkg.name + " - v " + pkg.version + " - by " + pkg.authors + " - + "+ today),
		// Separed bundles
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: function (module) {
				return module.context && module.context.includes('node_modules');
			}
		}),
		// Separed bundles
		new webpack.optimize.CommonsChunkPlugin({
			name: 'manifest',
			minChunks: Infinity
		}),
	],
	watchOptions: {
		aggregateTimeout: 300,
		poll: 500
	},
	module: {
		rules: [
			// all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
			{
				test: /\.(ts|tsx|js)?$/,
				use: {
					loader: 'ts-loader',
					options : {
						transpileOnly: true
						// entryFileIsJs : true
					}
				},
				exclude: /node_modules/
			},
			// { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
			// HTML LOADER
			{
				test: /\.(html)$/,
				use: {
					loader: 'html-loader',
					options: {
						attrs: [':data-src', 'img:src', 'img:data-src']
					}
				}
			},
			// IMAGES LOADER
			{ test: /\.(jpe?g|gif|svg|png|ico)$/i, use: ["url-loader?limit=100000"], exclude: /node_modules/ },
			// ASSET LOADER APP
			{ test: /\.(woff|woff2|ttf|eot|otf)$/, use: ["url-loader?limit=10000"], exclude: /node_modules/},
			// ASSET LOADER NODE
			{ test: /\.(svg|woff|woff2|ttf|eot|otf)$/, use: ["url-loader?limit=10000"], exclude: /src/ },
		]
	},
	// externals: { // object
	// 	angular: "this angular", // this["angular"]
	// }
};
module.exports = webPackConfig;