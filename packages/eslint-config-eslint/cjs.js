"use strict";

const baseConfigs = require("./base");
const { cjsConfigs } = require("./nodejs");

module.exports = [
    ...baseConfigs,
    ...cjsConfigs
];
