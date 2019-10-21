const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/js/scripts.js',
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
            },
            {   test: /\.handlebars$/,
                use: {
                    loader: "handlebars-loader",
                    query: { inlineRequires: '\/images\/' }
                }

            },
            {
                test: /\.(svg|png|jpg)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: '[name].[hash].[ext]',
                        outputPath: 'images'
                    }
                }
            }
        ]
    }
};