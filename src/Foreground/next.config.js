// next.config.js
module.exports = {
  swcMinify: true,
  modern: true,
  basePath: '/_ext/Foreground',
  optimizeFonts: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    workerThreads: true
  }
};