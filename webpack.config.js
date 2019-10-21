const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'none',
    entry: './src/js/scripts.js',
    output: {
        filename: 'scripts.[contentHash].js',
        path: path.resolve(__dirname, 'build')
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Custom template using Handlebars',
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
            }
        ]
    }
};