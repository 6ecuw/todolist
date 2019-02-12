const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
    entry: [
        './src/js/app.js',
        './src/css/style.css'
    ],
    output: {
        filename: './js/bundle.js'
    },
    devtool: devMode ? 'inline-source-map' : '',
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            include: path.resolve(__dirname, 'src/js'),
            use: {
                loader: 'babel-loader',
                options: {
                    presets: 'env'
                }
            }
        },
        {
            test: /\.css$/,
            include: path.resolve(__dirname, 'src/css'),
            use: [
                devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                'css-loader',
                'postcss-loader'
            ],
        },
        {
            test: /\.html$/,
            use: {
                loader: 'raw-loader'
            }
        }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: devMode ? '[name].css' : '[name].[contenthash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[contenthash].css',
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/html/index.html'
        })
    ],
    optimization: {
        minimizer: [new UglifyJsPlugin()]
    }
};