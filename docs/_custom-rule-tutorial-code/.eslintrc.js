"use strict";

module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
    },
    extends: ["eslint:recommended"],
    parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: {
            strict: true,
        }
    },
    // Using the eslint-plugin-foo-bar plugin downloaded from npm
    plugins: ["foo-bar"],
    rules: {
        "foo-bar/foo-bar": "error",
    },
}
