// next.config.js
module.exports = {
  swcMinify: true,
  basePath: '/_ext/Foreground',
  optimizeFonts: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // experimental: {
  //   workerThreads: true
  // }
};