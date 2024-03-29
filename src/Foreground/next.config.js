// next.config.js
module.exports = {
  swcMinify: true,
  basePath: '/_ext/Foreground',
  optimizeFonts: true,
  output: 'export',
  distDir: '../../dist/Foreground',
  httpAgentOptions: {
    keepAlive: false,
  },
  images: {
    unoptimized: true
  }
};