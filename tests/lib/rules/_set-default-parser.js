/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 *
 * This file must be loaded before rule files.
 *
 * This file configures the default config of RuleTester to use TestParser
 * instead of espree. The TestParser parses the given source code by espree,
 * then remove the `start` and `end` properties of nodes, tokens, and comments.
 *
 * We have not endorsed that the properties exist on the AST of custom parsers,
 * so we should check that core rules don't use the properties.
 */
"use strict";

const path = require("path");
const RuleTester = require("../../../lib/testers/rule-tester");

RuleTester.setDefaultConfig({
    parser: path.resolve(__dirname, "../../../tools/internal-testers/test-parser")
});
