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
                header: true
            }
        }]
    }
};