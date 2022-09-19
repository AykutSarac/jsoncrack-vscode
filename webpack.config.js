/* eslint-disable no-undef */
//@ts-check
"use strict";
const path = require("path");

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

/** @type WebpackConfig */
const extensionConfig = {
  target: "node",
  mode: "none",

  entry: "./ext-src/extension.ts",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "extension.js",
    libraryTarget: "commonjs2",
  },
  externals: {
    vscode: "commonjs vscode",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
    ],
  },
  devtool: "nosources-source-map",
  infrastructureLogging: {
    level: "log",
  },
};

module.exports = extensionConfig;
