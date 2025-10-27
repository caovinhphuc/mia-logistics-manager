const path = require('path');
const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Resolve fallbacks for Node.js core modules
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "assert": require.resolve("assert"),
        "buffer": require.resolve("buffer"),
        "crypto": require.resolve("crypto-browserify"),
        "events": require.resolve("events"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "path": require.resolve("path-browserify"),
        "process": require.resolve("process/browser"),
        "querystring": require.resolve("querystring-es3"),
        "stream": require.resolve("stream-browserify"),
        "url": require.resolve("url"),
        "util": require.resolve("util"),
        "vm": require.resolve("vm-browserify"),
        "zlib": require.resolve("browserify-zlib"),
        "fs": false,
        "net": false,
        "tls": false,
        "child_process": false
      };

      // Handle node: scheme imports
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        "node:assert": require.resolve("assert"),
        "node:buffer": require.resolve("buffer"),
        "node:crypto": require.resolve("crypto-browserify"),
        "node:events": require.resolve("events"),
        "node:http": require.resolve("stream-http"),
        "node:https": require.resolve("https-browserify"),
        "node:os": require.resolve("os-browserify/browser"),
        "node:path": require.resolve("path-browserify"),
        "node:process": require.resolve("process/browser"),
        "node:querystring": require.resolve("querystring-es3"),
        "node:stream": require.resolve("stream-browserify"),
        "node:url": require.resolve("url"),
        "node:util": require.resolve("util"),
        "node:vm": require.resolve("vm-browserify"),
        "node:zlib": require.resolve("browserify-zlib")
      };

      // Add plugins
      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        })
      );

      // Ignore warnings about missing source maps and node: schemes
      webpackConfig.ignoreWarnings = [
        /Failed to parse source map/,
        /Can't resolve.*node:/,
        /UnhandledSchemeError/
      ];

      return webpackConfig;
    }
  }
};
