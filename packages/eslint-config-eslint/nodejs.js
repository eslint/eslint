"use strict";

const recommendedScriptConfig = require("eslint-plugin-n/configs/recommended-script");
const recommendedModuleConfig = require("eslint-plugin-n/configs/recommended-module");

const sharedRules = {
    "n/callback-return": ["error", ["cb", "callback", "next"]],
    "n/handle-callback-err": ["error", "err"]
};

const cjsConfigs = [
    recommendedScriptConfig,
    {
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
        rules: sharedRules
    }
];

module.exports = {
    cjsConfigs,
    esmConfigs
};
