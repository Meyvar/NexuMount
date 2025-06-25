const { defineConfig } = require('@vue/cli-service')


module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    port: process.env.VUE_APP_BASE_PORT,
    open: true,
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: process.env.VUE_APP_BASE_IP + process.env.VUE_APP_BASE_API,
        pathRewrite: {
          [process.env.VUE_APP_BASE_API]: ''
        }
      }
    }
  },
})