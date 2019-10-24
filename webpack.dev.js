const path = require('path');
const common = require('./webpack.common');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'none',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'build')
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/assessment.handlebars',
            templateParameters: require('./src/assessment-data.json')
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    "style-loader", //2. Injects styles into DOM
                    "css-loader" // 1. Turns CSS into common JS
                ]
            },
        ]
    }
});