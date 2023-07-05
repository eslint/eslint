"use strict";

const baseConfigs = require("./base");
const { cjsConfigs } = require("./node");

module.exports = [
    ...baseConfigs,
    ...cjsConfigs
];
