"use strict";

module.exports = {
    mode: "none",
    entry: {
        eslint: ["core-js/stable", "regenerator-runtime/runtime", "./lib/linter/linter.js"],
        espree: ["core-js/stable", "regenerator-runtime/runtime", "espree"]
    },
    output: {
        filename: "[name].js",
        library: "[name]",
        libraryTarget: "umd",
        globalObject: "this"
    },
    module: {
        rules: [
            {
                test: /\.m?js$/u,
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env"]
                },
                exclude: /node_modules\/lodash/u
            }
        ]
    },
    stats: "errors-only"
};
