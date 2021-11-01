// next.config.js
module.exports = {
  swcMinify: true,
  modern: true,
  basePath: '/_extension/Foreground',
  optimizeFonts: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    workerThreads: true
  }
};