"use strict";

const baseConfigs = require("./base");
const { esmConfigs, cjsConfigs } = require("./nodejs");

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
