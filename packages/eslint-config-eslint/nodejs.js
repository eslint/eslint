"use strict";

const recommendedScriptConfig = require("eslint-plugin-n/configs/recommended-script");
const recommendedModuleConfig = require("eslint-plugin-n/configs/recommended-module");

const sharedRules = {
    "n/callback-return": ["error", ["cb", "callback", "next"]],
    "n/handle-callback-err": ["error", "err"],
    "n/prefer-node-protocol": "error"
};

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
