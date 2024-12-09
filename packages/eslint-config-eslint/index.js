"use strict";

const baseConfigs = require("./base");
const { esmConfigs, cjsConfigs } = require("./nodejs");

/**
 * @type {import("eslint").Linter.Config[]}
 */
module.exports = [
    ...baseConfigs,
    ...esmConfigs.map(config => ({
        files: ["**/*.js"],
        ...config
    })),
    ...cjsConfigs.map(config => ({
        files: ["**/*.cjs"],
        ...config
    }))
];
