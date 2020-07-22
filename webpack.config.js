const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: './src/index.js',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                  {
                    loader: 'file-loader',
                    options: {
                      name: '[name].[ext]',
                      outputPath: 'fonts/'
                    }
                  }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|mp3|otf)$/i,
                use: [
                  {
                    loader: 'file-loader',
                  },
                ],
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({  
            template: "./src/index.html",
            filename: "./index.html"})
    ],
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    output: {
        filename: 'main.js',
        publicPath: '',
        path: path.resolve(__dirname, 'dist'),
    }
};
