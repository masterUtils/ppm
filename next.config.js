const path = require("path");

/** @type {import("next").NextConfig} */
module.exports = {
  reactStrictMode: false,
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, "./node_modules/apexcharts-clevision")
    };

    return config;
  },
  compiler: {
    styledComponents: true,
  },
};
