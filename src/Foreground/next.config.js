// next.config.js
module.exports = {
  webpack5: true,
  modern: true,
  basePath: '/_extension/Foreground',
  optimizeFonts: true,
  experimental: {
    workerThreads: true,
    concurrentFeatures: true
  }
};