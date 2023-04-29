const path = require('path');

module.exports = {
    entry: './src/index.js',
    mode: 'production',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
                test: /\.(csv|tsv)$/,
                loader: 'csv-loader',
                options: {
                    header: true,
                }
            },
            {
                test: /\.variables.css$/,
                use: [
                    'postcss-variables-loader'
                ]
            },
            {
                test: /\.css$/,
                exclude: /\.variables.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                    test: /\.html$/i,
                    loader: 'html-loader',
            }
        ]
    }
};
