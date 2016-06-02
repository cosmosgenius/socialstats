const webpack = require('webpack');
const path = require('path');

module.exports = {
    devtool: 'source-map',
    context: path.join(__dirname, 'src'),

    entry: [
        './index'
    ],

    output: {
        path: path.join(__dirname),
        publicPath: '/',
        filename: 'app.js'
    },

    plugins: [

        new webpack.optimize.OccurenceOrderPlugin(true),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false
            },
            compress: {
                warnings: false,
                screw_ie8: true
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ],

    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'oauthio-web': 'OAuth'
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: ['babel'] }
        ]
    }
};
