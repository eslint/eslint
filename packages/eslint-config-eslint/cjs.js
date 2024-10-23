"use strict";

const baseConfigs = require("./base");
const { cjsConfigs } = require("./nodejs");

/**
 * @type {import("eslint").Linter.Config[]}
 */
module.exports = [
    ...baseConfigs,
    ...cjsConfigs
];
