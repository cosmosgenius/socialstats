const webpack = require('webpack');
const path = require('path');

module.exports = {
    debug: true,
    devtool: '#eval-source-map',
    context: path.join(__dirname, 'src'),

    entry: [
        'webpack/hot/dev-server',
        'webpack-hot-middleware/client',
        './index'
    ],

    output: {
        path: path.join(__dirname),
        publicPath: '/',
        filename: 'app.js'
    },

    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],

    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: ['babel-loader'] }
        ]
    }
};
