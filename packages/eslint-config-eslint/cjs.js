/**
 * @fileoverview the base eslint config for cjs projects.
 * @author 唯然<weiran.zsd@outlook.com>
 */

const base = require("./base.js");

const nodeRecommendedConfig = require("eslint-plugin-n/configs/recommended-script");

// extends eslint-plugin-n's recommended config
const nodeConfigs = [nodeRecommendedConfig, {
    rules: {
        "n/callback-return": ["error", ["cb", "callback", "next"]],
        "n/handle-callback-err": ["error", "err"],
        "n/no-deprecated-api": "error",
        "n/no-mixed-requires": "error",
        "n/no-new-require": "error",
        "n/no-path-concat": "error"
    }
}];

module.exports = [...base, ...nodeConfigs];