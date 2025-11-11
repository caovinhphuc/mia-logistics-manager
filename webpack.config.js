const path = require("path");
const webpack = require("webpack");

module.exports = {
  // Webpack configuration for MIA Logistics Manager
  resolve: {
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      buffer: require.resolve("buffer"),
      process: require.resolve("process/browser"),
      util: require.resolve("util"),
      path: require.resolve("path-browserify"),
      fs: false,
      os: require.resolve("os-browserify/browser"),
      url: require.resolve("url"),
      querystring: require.resolve("querystring-es3"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      net: false,
      tls: false,
      child_process: false,
    },
  },
  plugins: [
    // Define environment variables for service accounts
    new webpack.DefinePlugin({
      "process.env.GOOGLE_SERVICE_ACCOUNT_MIA_VN": JSON.stringify(
        process.env.GOOGLE_SERVICE_ACCOUNT_MIA_VN ||
          "mia-vn-google-integration@sinuous-aviary-474820-e3.iam.gserviceaccount.com"
      ),
      "process.env.GOOGLE_SERVICE_ACCOUNT_NUQ74": JSON.stringify(
        process.env.GOOGLE_SERVICE_ACCOUNT_NUQ74 || "nuq74@[PROJECT_ID].iam.gserviceaccount.com"
      ),
      "process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH_MIA_VN": JSON.stringify(
        process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH_MIA_VN ||
          "./backend/sinuous-aviary-474820-e3-c442968a0e87.json"
      ),
      "process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH_NUQ74": JSON.stringify(
        process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH_NUQ74 ||
          "./backend/nuq74-service-account-key.json"
      ),
    }),
  ],
};
