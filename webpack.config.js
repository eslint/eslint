"use strict";

module.exports = {
    mode: "none",
    entry: ["@babel/polyfill", "./lib/linter.js"],
    output: {
        filename: "eslint.js",
        library: "eslint",
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
