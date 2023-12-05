// webpack.config.js
module.exports = {
    entry: './src/background/background.js',
    output: {
        filename: 'background.bundle.js',
        path: __dirname + '/dist'
    },
    mode: 'production'
};
