/**
 * @fileoverview Rule to disallow use of void operator.
 * @author Mike Sidorov
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    validate = require("../../../lib/validate-options"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint, validate);
eslintTester.addRuleTest("lib/rules/no-void", {

    valid: [
        "var foo = bar()",
        "foo.void()",
        "foo.void = bar"
    ],

    invalid: [
        {
            code: "void 0",
            errors: [{
                message: "Expected 'undefined' and instead saw 'void'."
            }]
        },
        {
            code: "void(0)",
            errors: [{
                message: "Expected 'undefined' and instead saw 'void'."
            }]
        },
        {
            code: "var foo = void 0",
            errors: [{
                message: "Expected 'undefined' and instead saw 'void'."
            }]
        }
    ]
});
