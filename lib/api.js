/**
 * @fileoverview Expose out ESLint and CLI to require.
 * @author Ian Christian Myers
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const { ESLint, shouldUseFlatConfig } = require("./eslint/eslint");
const { LegacyESLint } = require("./eslint/legacy-eslint");
const { Linter } = require("./linter");
const { RuleTester } = require("./rule-tester");
const { SourceCode } = require("./source-code");

/**
 * Loads the appropriate ESLint class based on the provided options.
 * @param {Object} options The options for loading ESLint.
 * @param {boolean} options.useFlatConfig Whether to use flat configuration.
 * @returns {Object} - The ESLint class to use.
 */
async function loadESLint(options = {}) {
    const useFlatConfig = options.useFlatConfig ?? (await shouldUseFlatConfig());

    return useFlatConfig ? ESLint : LegacyESLint;
}

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

module.exports = {
    Linter,
    ESLint,
    RuleTester,
    SourceCode,
    loadESLint
};
