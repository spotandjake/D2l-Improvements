// next.config.js
module.exports = {
  webpack5: true,
  modern: true,
  basePath: '/_extension/Foreground',
  optimizeFonts: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    workerThreads: true,
    concurrentFeatures: true
  }
};