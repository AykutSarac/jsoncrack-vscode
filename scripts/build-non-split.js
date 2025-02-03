#!/usr/bin/env node

const rewire = require("rewire");
const defaults = rewire("react-scripts/scripts/build.js");
let config = defaults.__get__("config");

// Disable source maps
config.devtool = false;

// Disable code splitting
config.optimization.splitChunks = {
  cacheGroups: {
    default: false
  }
};

config.optimization.runtimeChunk = false;

// Enable tree shaking
config.optimization.usedExports = true;

// Ensure production optimizations are enabled
config.mode = 'production';
config.optimization.minimize = true;
