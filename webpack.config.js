const path = require('path');
const autoprefixer = require('autoprefixer');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'eval-source-map',
    entry: './frontend/index.js',
    output: {
        path: path.join(__dirname, '/frontend/output'),
        filename: 'bundle.js'
    },
    plugins: [
        new HTMLWebpackPlugin({template: './static/index.html'}),
    ],
    module: {
        rules: [
            {
                test: /.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {presets: ['@babel/preset-env', '@babel/preset-react']}
                }
            },
            {
                test: /\.(css)$/,
                use: {loader: 'css-loader'},
            },
            {
                test: /\.(scss)$/,
                use: [
                {loader: 'style-loader'},
                {loader: 'css-loader'},
                {
                    loader: 'postcss-loader',
                    options: {postcssOptions: {plugins: () => [autoprefixer]}}
                },
                {loader: 'sass-loader'},
                ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                use: {loader: 'file-loader'}
            },
        ]
     }
};
