var baseConfig = require('./webpack.base.config');
// const pkg = require("./package.json");
const sasLoader = {
    test: /\.scss$/,
    exclude: /node_modules/,
    use : ['style-loader', 'css-loader', 'sass-loader']
};
baseConfig.module.rules.push(sasLoader);

baseConfig.devtool = "source-map";

module.exports = baseConfig;