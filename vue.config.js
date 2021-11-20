// const webpack = require('webpack')

// 代码压缩
// const TerserPlugin = require('terser-webpack-plugin')
// "compression-webpack-plugin": "^1.1.12",
// "sass": "^1.35.2",
//     "sass-loader": "^12.1.0", "style-loader": "^3.1.0",
// const compressionWebpackPlugin = require('compression-webpack-plugin')
// const productionGzipExtensions = ['js', 'css', 'ttf']

module.exports = {
    lintOnSave: false,
    productionSourceMap: false,
    configureWebpack: {
        plugins: [
            // 开启Gzip压缩
            // new compressionWebpackPlugin({
            //     //[file] 会被替换成原始资源。[path] 会被替换成原始资源的路径， [query] 会被替换成查询字符串。默认值是 "[path].gz[query]"。
            //     filename: '[path].gz[query]', // 提示compression-webpack-plugin@3.0.0的话asset改为filename
            //     //可以是 function(buf, callback) 或者字符串。对于字符串来说依照 zlib 的算法(或者 zopfli 的算法)。默认值是 "gzip"。
            //     algorithm: 'gzip',
            //     //所有匹配该正则的资源都会被处理。默认值是全部资源。
            //     test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
            //     //只有大小大于该值的资源会被处理。单位是 bytes。默认值是 0。
            //     threshold: 10240,
            //     //只有压缩率小于这个值的资源才会被处理。默认值是 0.8。
            //     minRatio: 0.8
            // }),
        ],
        // optimization: {
        //     minimizer: [
        //         new TerserPlugin({
        //             terserOptions: {
        //                 ecma: undefined,
        //                 warnings: false,
        //                 parse: {},
        //                 compress: {
        //                     drop_console: true,
        //                     drop_debugger: false,
        //                     pure_funcs: ['console.log'], // 移除console
        //                 },
        //             },
        //         }),
        //     ],
        // }
    },
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
