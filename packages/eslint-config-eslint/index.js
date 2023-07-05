"use strict";

const baseConfigs = require("./base");
const { esmConfigs } = require("./nodejs");

module.exports = [
    ...baseConfigs,
    ...esmConfigs
];
