#!/usr/bin/env node

const rewire = require("rewire");
const defaults = rewire("react-scripts/scripts/build.js");
let config = defaults.__get__("config");

// Enable source maps for debugging
config.devtool = 'source-map';

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

// Configure resolve to handle missing extensions for ES modules
config.resolve = config.resolve || {};
config.resolve.fullySpecified = false;

// Apply fullySpecified: false to all module rules
if (config.module && config.module.rules) {
  config.module.rules.forEach(rule => {
    if (rule.oneOf) {
      rule.oneOf.forEach(oneOfRule => {
        if (oneOfRule.resolve) {
          oneOfRule.resolve.fullySpecified = false;
        } else {
          oneOfRule.resolve = { fullySpecified: false };
        }
      });
    }
    if (rule.resolve) {
      rule.resolve.fullySpecified = false;
    }
  });
}
