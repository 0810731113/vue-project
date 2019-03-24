const path = require('path')
function resolve (dir) {
    return path.join(__dirname,  dir)
}

module.exports = {
    configureWebpack: {
        // plugins: [
        //     new MyAwesomeWebpackPlugin()
        // ],
        resolve: {
            extensions: ['.js', '.vue', '.json'],
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
                '@': resolve('src'),
                'src': path.resolve(__dirname, './src'),
                'assets': path.resolve(__dirname, './src/assets'),
                'components': path.resolve(__dirname, './src/components'),
                'constant': path.resolve(__dirname, './src/constant'),
                'views': path.resolve(__dirname, './src/views'),
                'common': path.resolve(__dirname, './src/views/common'),
                'shop': path.resolve(__dirname, './src/views/shop'),
                'company': path.resolve(__dirname, './src/views/company'),
                'system': path.resolve(__dirname, './src/views/system'),
                'scss': path.resolve(__dirname, './src/scss'),
                'api': path.resolve(__dirname, './src/api'),
                'utils': path.resolve(__dirname, './src/utils'),
                'store': path.resolve(__dirname, './src/store'),
                'router': path.resolve(__dirname, './src/router'),
                'static': path.resolve(__dirname, './static'),
                'myd/static': path.resolve(__dirname, './static')
            }
        },
        // output:{
        //     path:path.resolve(__dirname, './dist/myd'),
        //     filename: '[name].js',
        // },
    },
    lintOnSave: false,
    publicPath: process.env.NODE_ENV === 'development'
    ? '/'
    : '/myd/'
    // outputDir: path.resolve(__dirname, './dist/'),
    //assetsDir: './myd/',
    //indexPath: 'index.html',

}