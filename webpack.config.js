const path = require('path');
module.exports = {
    mode: 'development',
    devtool: 'none',
    entry: './src/js/scripts.js',
    output: {
        filename: 'scripts.js',
        path: path.resolve(__dirname, 'build')
    },
    module: {
        rules: [
            {
            test: /\.css$/,
            use: [
                "style-loader",
                "css-loader"
            ]
            }
        ]
    }
};