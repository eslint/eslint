"use strict";

const webpack = require("webpack");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const path = require('path');

/** @type {import("webpack").Configuration} */
module.exports = {
    mode: "production", // Changed from "none" to "production" for optimizations
    entry: {
        eslint: ["core-js/stable", "regenerator-runtime/runtime", "./lib/linter/linter.js"]
    },
    output: {
        filename: "[name].js",
        library: "[name]",
        libraryTarget: "umd",
        globalObject: "this",
        path: path.resolve(__dirname, 'dist') // Added output path
    },
    module: {
        rules: [
            {
                test: /\.m?js$/u,
                loader: "babel-loader",
                options: {
                    presets: [
                        ["@babel/preset-env", {
                            debug: true, // ← to print actual browser versions
                            targets: ">0.5%, not chrome 49, not ie 11, not safari 5.1"
                        }]
                    ]
                }
            }
        ]
    },
    plugins: [
        new webpack.NormalModuleReplacementPlugin(
            /^node:/u,
            resource => {
                resource.request = resource.request.replace(/^node:/u, "");
            }
        ),
        new NodePolyfillPlugin()
    ],
    resolve: {
        mainFields: ["browser", "main", "module"]
    },
    stats: "errors-only",
    optimization: {
        minimize: true // Added minimization
    }
};
