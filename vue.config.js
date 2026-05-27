const path = require('path');

module.exports = {
  // 输出到 dist/，与原项目保持一致
  outputDir: 'dist',
  // 静态资源目录命名为 static/，与原项目保持一致
  assetsDir: 'static',
  // 部署到任意路径都能跑（使用相对路径）
  publicPath: './',
  productionSourceMap: false,

  configureWebpack: {
    resolve: {
      alias: {
        '@api': path.resolve(__dirname, 'src/api'),
        '@': path.resolve(__dirname, 'src'),
      },
    },
  },

  devServer: {
    port: 8080,
    // 开发环境代理外部接口，规避 CORS 问题
    proxy: {
      '/diving-fish': {
        target: 'https://www.diving-fish.com',
        changeOrigin: true,
        secure: true,
        pathRewrite: { '^/diving-fish': '' },
      },
      '/yuzu-alias': {
        target: 'https://www.yuzuchan.moe',
        changeOrigin: true,
        secure: true,
        pathRewrite: { '^/yuzu-alias': '' },
      },
    },
  },
};
