/**
 * @fileoverview Tests for no-inline-require rule.
 * @author Robert Rossmann
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
var eslintTester = new ESLintTester(eslint),
    expectedMessage = "Inline require() statements not allowed; declare your dependency first",
    expectedError = { message: expectedMessage, type: "CallExpression" };

eslintTester.addRuleTest("lib/rules/no-inline-require", {
    valid: [
        "var util = require('util');",
        "var util = require('util');\nutil.inspect({});",
        "var insp = require('util').inspect;",
        "var a = 1,\ninsp = require('util').inspect;",
        "var util = require('util');\nmodule.exports = function f () {}"
    ],
    invalid: [
        { code: "require('util').inspect({})", errors: [expectedError] },
        { code: "function f () {};\nf(require('util'));", errors: [expectedError] },
        { code: "function f () {};\nf(require('util').inspect);", errors: [expectedError] },
        { code: "function f () {};\nf(require('util').inspect({}));", errors: [expectedError] },
        { code: "function f () {};\nvar util = require('util');", errors: [expectedError] },
        { code: "function f () {\nvar util = require('util');\n};", errors: [expectedError] },
        { code: "var result = require('util').inspect({})", errors: [expectedError] },
        { code: "var result;\nresult = require('util').inspect({})", errors: [expectedError] },
        { code: "var insp;\ninsp = require('util').inspect;", errors: [expectedError] }
    ]
});
