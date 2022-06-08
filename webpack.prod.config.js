var baseConfig = require('./webpack.base.config');
// const pkg = require("./package.json");

// SASS 
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractCssPlugin = new ExtractTextPlugin("[name].style.css");
const sasLoader = {
    test: /\.scss$/,
    exclude: /node_modules/,
    use: ExtractTextPlugin.extract({
        fallback: 'style-loader', // creates style nodes from JS strings
        //resolve-url-loader may be chained before sass-loader if necessary
        use: [
            'css-loader',	// creates style nodes from JS strings
            'sass-loader'	// compiles Sass to CSS
        ]
      })
};
// Agrego hash
baseConfig.output.filename = '[name].bundle.[hash].js';
// Extrae los estilos en style.css
baseConfig.plugins.push(extractCssPlugin);
baseConfig.module.rules.push(sasLoader);
baseConfig.devtool = false;

module.exports = baseConfig;