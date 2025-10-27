const { override, addWebpackResolve, addWebpackPlugin } = require('customize-cra');
const webpack = require('webpack');

module.exports = override(
  (config) => {
    // Complete polyfill setup with fallbacks and aliases
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "buffer": require.resolve("buffer"),
      "process": require.resolve("process/browser"),
      "util": require.resolve("util"),
      "path": require.resolve("path-browserify"),
      "fs": false,
      "os": require.resolve("os-browserify/browser"),
      "url": require.resolve("url"),
      "querystring": require.resolve("querystring-es3"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "net": false,
      "tls": false,
      "child_process": false,
      "assert": require.resolve("assert"),
      "events": require.resolve("events"),
      "zlib": require.resolve("browserify-zlib"),
      "vm": require.resolve("vm-browserify")
    };

    // Handle both regular and node: scheme imports
    config.resolve.alias = {
      ...config.resolve.alias,
      'node:events': require.resolve('events'),
      'node:process': require.resolve('process/browser'),
      'node:util': require.resolve('util'),
      'node:stream': require.resolve('stream-browserify'),
      'node:crypto': require.resolve('crypto-browserify'),
      'node:path': require.resolve('path-browserify'),
      'node:buffer': require.resolve('buffer'),
      'node:url': require.resolve('url'),
      'node:querystring': require.resolve('querystring-es3'),
      'node:os': require.resolve('os-browserify/browser'),
      'node:http': require.resolve('stream-http'),
      'node:https': require.resolve('https-browserify'),
      'node:zlib': require.resolve('browserify-zlib'),
      'node:vm': require.resolve('vm-browserify')
    };

    // Add plugins
    config.plugins.push(
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      })
    );

    // Ignore warnings
    config.ignoreWarnings = [
      /Failed to parse source map/,
      /Can't resolve.*node:/,
      /UnhandledSchemeError/
    ];

    return config;
  }
);
