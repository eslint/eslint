/**
 * @fileoverview Tests for regex-spaces rule.
 * @author Matt DuVall <http://www.mattduvall.com/>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("../../../lib/testers/eslint-tester");

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-regex-spaces", {
    valid: [
        "var foo = /bar {3}baz/;",
        "var foo = /bar\t\t\tbaz/;"
    ],

    invalid: [
        {
            code: "var foo = /bar    baz/;",
            errors: [
                {
                    message: "Spaces are hard to count. Use {4}.",
                    type: "Literal"
                }
            ]
        }
    ]
});
