"use strict";

// Import the ESLint plugin
const eslintPluginFooBar = require("./eslint-plugin-foo-bar");

module.exports = [
    {
        files: ["**/*.js"],
        languageOptions: {
            sourceType: "commonjs",
            ecmaVersion: "latest",
        },
        // Using the eslint-plugin-foo-bar plugin downloaded from npm
        plugins: {"foo-bar": eslintPluginFooBar},
        rules: {
            "foo-bar/foo-bar": "error",
        },
    }
]
