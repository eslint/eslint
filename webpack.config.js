"use strict";

module.exports = {
    mode: "none",
    entry: {
        eslint: ["@babel/polyfill", "./lib/linter.js"],
        espree: ["@babel/polyfill", "espree"]
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
                test: /\.js$/u,
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env"]
                },
                exclude: /node_modules/u
            }
        ]
    },
    stats: "errors-only"
};
