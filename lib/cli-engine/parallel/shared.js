"use strict";

const semver = require("semver");

module.exports = {
    isThreadSupported: semver.gte(process.versions.node, "12.11.0")
};
