const path = require('path')
module.exports =
{
    entry: './app/index.js',
    output:
    {
        path: path.resolve(__dirname + '../../../../', 'client_packages'),
        filename: 'index.js'
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
            }
        ]
    }
}