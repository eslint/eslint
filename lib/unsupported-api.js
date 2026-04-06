/**
 * @fileoverview APIs that are not officially supported by ESLint.
 *      These APIs may change or be removed at any time. Use at your
 *      own risk.
 * @author Nicholas C. Zakas
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const { shouldUseFlatConfig } = require("./eslint/eslint");
const builtinRules = require("./rules");

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

module.exports = { builtinRules, shouldUseFlatConfig };
