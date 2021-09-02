const color = '#f5f4f4'

const iconsProps = {
  // background: color,
}

module.exports = {
  appName: 'Karibe',
  appShortName: 'Karibe',
  appDescription: 'Karibe',

  developerName: '',
  developerURL: '',

  path: '/favicons/',

  background: color,
  theme_color: color,
  appleStatusBarStyle: 'default',

  scope: '/',
  start_url: '/',

  display: 'standalone',
  orientation: 'portrait',

  logging: false,
  html: 'icons.html',
  pipeHTML: true,
  replace: true,

  icons: {
    android: {
      ...iconsProps,
    },
    appleIcon: {
      ...iconsProps,
    },
    appleStartup: {
      ...iconsProps,
    },
    favicons: {
      ...iconsProps,
    },
    firefox: {
      ...iconsProps,
      overlayGlow: false
    },
    windows: {
      ...iconsProps,
    },
  }
}
