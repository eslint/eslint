/**
 * @fileoverview Tests for no-try-catch rule.
 * @author Andrew de Andrade
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

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-try-catch", {
    valid: [
        "var err = foo(); handleError(err); cleanup();"
    ],
    invalid: [
        {
            code: "try {\n  foo();\n} catch (err) {\n  handleError(err)\n} finally {\n  cleanup();\n}",
            errors: [
                {
                    message: "Unexpected use of 'try' statement.",
                    type: "TryStatement",
                    line: 1,
                    column: 0
                }
            ]
        }
    ]
});
