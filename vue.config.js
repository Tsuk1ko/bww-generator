module.exports = {
  publicPath: '',
  productionSourceMap: false,
  configureWebpack: {
    externals: {
      vue: 'Vue',
      mdui: 'mdui',
    },
  },
  pwa: {
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      skipWaiting: true,
      runtimeCaching: [
        {
          urlPattern: new RegExp('^https://cdn\\.bootcss\\.com/'),
          handler: 'CacheFirst',
          options: {
            cacheableResponse: {
              statuses: [200],
            },
          },
        },
      ],
    },
    name: '黑白生草图制作器',
    themeColor: '#212121',
    backgroundColor: '#212121',
    msTileColor: '#212121',
    appleMobileWebAppStatusBarStyle: 'black',
    manifestOptions: {
      lang: 'zh-Hans',
      background_color: '#212121',
    },
  },
};
