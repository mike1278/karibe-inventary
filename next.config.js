const withPWA = require('next-pwa')
const withPlugins = require('next-compose-plugins')
const { PHASE_PRODUCTION_BUILD, PHASE_PRODUCTION_SERVER } = require('next/constants')

const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
      })
    }
    config.module.rules.push({
      test: /\.svg$/,
      use: [{
        loader: '@svgr/webpack',
        options: {
          svgoConfig: {
            plugins: {
              removeViewBox: false
            }
          }
        }
      }]
    })
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: "/_next/static/images",
          outputPath: "static/images/",
        }
      },
    })

    return config
  }
}

module.exports = withPlugins([
  [withPWA, {
    pwa: {
      dest: 'public',
      cacheOnFrontEndNav: true,
    },
  }, [PHASE_PRODUCTION_BUILD, PHASE_PRODUCTION_SERVER]]
], nextConfig)
