module.exports = {
    filenameHashing: false,
    productionSourceMap: false,
    devServer: { host: 'localhost' },
    runtimeCompiler: true,
    configureWebpack: {
        //devtool: 'inline-source-map',
        /* resolve: {
            alias: {
              'vue$': 'vue/dist/vue.runtime.js' // 'vue/dist/vue.common.js' for webpack 1
            }
          } */
    }
}