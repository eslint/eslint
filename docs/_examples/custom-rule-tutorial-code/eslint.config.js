/** 
 * @fileoverview Example ESLint config file that uses the custom rule from this tutorial.
 * @author Ben Perlmutter
*/
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
        // Using the eslint-plugin-example plugin defined locally
        plugins: {"example": eslintPluginExample},
        rules: {
            "example/enforce-foo-bar": "error",
        },
    }
]
