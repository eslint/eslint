/**
 * @fileoverview Main package entrypoint.
 * @author Nicholas C. Zakas
 */

"use strict";

const { version } = require("../package.json");

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

const all = require("./configs/eslint-all");
const recommended = require("./configs/eslint-recommended");

const configs = {
    all,
    recommended
};

const meta = {
    name: "@eslint/js",
    version
};

module.exports = {
    meta,
    configs
};
