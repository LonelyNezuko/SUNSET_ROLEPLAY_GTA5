const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports =
{
    entry: './app/index.js',
    output:
    {
        path: path.resolve(__dirname + '../../../../', 'client_packages/ui'),
        filename: 'ui.js'
    },
    performance:
    {
        hints: false
    },
    module:
    {
        noParse: /nativeui/,
        rules:
        [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:
                {
                    loader: '@sucrase/webpack-loader',
                    options:
                    {
                        transforms: ['imports']
                    }
                }
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    plugins:
    [
        new HtmlWebpackPlugin({
            title: 'GTA5 Server UI',
            filename: 'ui.html',
            inject: 'head'
        })
    ],
}