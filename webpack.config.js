const HTMLWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    mode: process.env.NODE_ENV,
    entry: './src/client/index.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.jsx', '.js']
    },
    devServer: {
        port: 8080,
        static: {
            directory: path.join(__dirname, './public')
        },
        proxy: {
            '/api': 'http://localhost:3000',
            secure: false
        }
    },
    plugins: [
        new HTMLWebpackPlugin({
            title: 'Development',
            template: './public/index.html'
        })
    ]
}
