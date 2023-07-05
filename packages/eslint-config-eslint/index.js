"use strict";

const baseConfigs = require("./base");
const { esmConfigs } = require("./node");

module.exports = [
    ...baseConfigs,
    ...esmConfigs
];
