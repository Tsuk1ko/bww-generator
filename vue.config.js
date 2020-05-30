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
          urlPattern: /^https:\/\/cdn\.jsdelivr\.net\//,
          handler: 'CacheFirst',
          options: {
            cacheableResponse: {
              statuses: [200],
            },
          },
        },
      ],
    },
    name: '黑白图制作器',
    themeColor: '#212121',
    backgroundColor: '#212121',
    msTileColor: '#212121',
    appleMobileWebAppStatusBarStyle: 'black',
    iconPaths: {
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-touch-icon-180x180.png',
      msTileImage: 'img/icons/msapplication-icon-144x144.png',
      maskIcon: 'img/icons/mask-icon-16x16.svg',
    },
    manifestOptions: {
      name: '黑白图制作器',
      short_name: '黑白图制作',
      lang: 'zh-Hans',
      background_color: '#212121',
      description: '快速制作，一键生草',
      icons: [
        {
          src: 'img/icons/default-icon-192x192-maskable.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: 'img/icons/default-icon-512x512-maskable.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
  },
};
