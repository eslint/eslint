"use strict";

const {
    configs: {
        "flat/recommended-script": recommendedScriptConfig,
        "flat/recommended-module": recommendedModuleConfig
    }
} = require("eslint-plugin-n");

/**
 * @type {import("eslint").Linter.RulesRecord}
 */
const sharedRules = {
    "n/callback-return": ["error", ["cb", "callback", "next"]],
    "n/handle-callback-err": ["error", "err"],
    "n/prefer-node-protocol": "error"
};

/**
 * @type {import("eslint").Linter.Config[]}
 */
const cjsConfigs = [
    recommendedScriptConfig,
    {
        name: "eslint-config-eslint/cjs",
        rules: {
            ...sharedRules,
            "n/no-mixed-requires": "error",
            "n/no-new-require": "error",
            "n/no-path-concat": "error"
        }
    }
];

/**
 * @type {import("eslint").Linter.Config[]}
 */
const esmConfigs = [
    recommendedModuleConfig,
    {
        name: "eslint-config-eslint/esm",
        rules: sharedRules
    }
];

module.exports = {
    cjsConfigs,
    esmConfigs
};
