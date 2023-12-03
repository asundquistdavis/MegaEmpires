const path = require('path');
const autoprefixer = require('autoprefixer');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'eval-source-map',
    entry: { play: './frontend/pages/play.ts'},
    output: {
        publicPath: '/web',
        filename: '[name].js',
        path: path.join(__dirname, '/web/static'),
    },
    resolve: {extensions: ['.ts', '.tsx']},
    module: {
        rules: [

            {
                test: /.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                    // options: {presets: ['@babel/preset-env', '@babel/preset-react']}
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
