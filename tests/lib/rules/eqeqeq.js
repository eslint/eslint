/**
 * @fileoverview Tests for eqeqeq rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("../../../lib/testers/eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/eqeqeq", {
    valid: [
        "a === b",
        "a !== b",
        { code: "typeof a == 'number'", args: [1, "smart"] },
        { code: "'string' != typeof a", args: [1, "smart"] },
        { code: "'hello' != 'world'", args: [1, "smart"] },
        { code: "2 == 3", args: [1, "smart"] },
        { code: "true == true", args: [1, "smart"] },
        { code: "null == a", args: [1, "smart"] },
        { code: "a == null", args: [1, "smart"] },
        { code: "null == a", args: [1, "allow-null"] },
        { code: "a == null", args: [1, "allow-null"] }
    ],
    invalid: [
        { code: "a == b", errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression"}] },
        { code: "a != b", errors: [{ message: "Expected '!==' and instead saw '!='.", type: "BinaryExpression"}] },
        { code: "true == 1", args: [1, "smart"], errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression"}] },
        { code: "0 != '1'", args: [1, "smart"], errors: [{ message: "Expected '!==' and instead saw '!='.", type: "BinaryExpression"}] },
        { code: "'wee' == /wee/", args: [1, "smart"], errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression"}] },
        { code: "typeof a == 'number'", args: [1, "allow-null"], errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression"}] },
        { code: "'string' != typeof a", args: [1, "allow-null"], errors: [{ message: "Expected '!==' and instead saw '!='.", type: "BinaryExpression"}] },
        { code: "'hello' != 'world'", args: [1, "allow-null"], errors: [{ message: "Expected '!==' and instead saw '!='.", type: "BinaryExpression"}] },
        { code: "2 == 3", args: [1, "allow-null"], errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression"}] },
        { code: "true == true", args: [1, "allow-null"], errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression"}] },
        { code: "a\n==\nb", errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression", line: 2 }] }
    ]
});
