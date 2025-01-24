/**
 * @fileoverview Main package entrypoint.
 * @author Nicholas C. Zakas
 */

"use strict";

const { name, version } = require("../package.json");

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        name,
        version
    },
    configs: {
        all: Object.freeze({
            ...require("./configs/eslint-all"),
            name: "eslint/defaults/js/all"
        }),
        recommended: Object.freeze({
            ...require("./configs/eslint-recommended"),
            name: "eslint/defaults/js/recommended"
        })
    }
};
