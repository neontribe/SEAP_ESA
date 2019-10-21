const path = require('path');
const common = require('./webpack.common');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = merge(common, {
    mode: 'production',
    output: {
        filename: 'scripts.[contentHash].js',
        path: path.resolve(__dirname, 'build')
    },
    plugins: [new CleanWebpackPlugin()]
});