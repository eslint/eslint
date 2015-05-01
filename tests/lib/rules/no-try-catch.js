/**
 * @fileoverview Tests for no-try-catch rule.
 * @author Nicholas C. Zakas
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
                },
                {
                    message: "Unexpected use of 'catch' clause.",
                    type: "TryStatement",
                    line: 3,
                    column: 2
                },
                {
                    message: "Unexpected use of 'finally' clause.",
                    type: "TryStatement",
                    line: 5,
                    column: 2
                }
            ]
        }
    ]
});
