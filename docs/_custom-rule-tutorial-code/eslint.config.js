"use strict";

// Import the ESLint plugin
const eslintPluginExample = require("./eslint-plugin-example");

module.exports = [
    {
        files: ["**/*.js"],
        languageOptions: {
            sourceType: "commonjs",
            ecmaVersion: "latest",
        },
        // Using the eslint-plugin-example plugin downloaded from npm
        plugins: {"example": eslintPluginExample},
        rules: {
            "example/foo-bar": "error",
        },
    }
]
