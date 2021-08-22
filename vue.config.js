module.exports = {
    lintOnSave: false,
    css: {
        // 是否使用css分离插件 ExtractTextPlugin
        extract: true,
        // 开启 CSS source maps?
        sourceMap: false,
        // css预设器配置项
        loaderOptions: {
            less: {
                globalVars: {
                    'theme-color': '#421466'
                }
            }
        }
    }
}
