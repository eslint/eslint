/**
 * @fileoverview Tests for eqeqeq rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/eqeqeq"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("eqeqeq", rule, {
    valid: [
        "a === b",
        "a !== b",
        { code: "a === b", options: ["always"] },
        { code: "typeof a == 'number'", options: ["smart"] },
        { code: "'string' != typeof a", options: ["smart"] },
        { code: "'hello' != 'world'", options: ["smart"] },
        { code: "2 == 3", options: ["smart"] },
        { code: "true == true", options: ["smart"] },
        { code: "null == a", options: ["smart"] },
        { code: "a == null", options: ["smart"] },
        { code: "null == a", options: ["allow-null"] },
        { code: "a == null", options: ["allow-null"] }
    ],
    invalid: [
        { code: "a == b", errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression"}] },
        { code: "a != b", errors: [{ message: "Expected '!==' and instead saw '!='.", type: "BinaryExpression"}] },
        { code: "typeof a == 'number'", errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression"}] },
        { code: "typeof a == 'number'", options: ["always"], errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression"}] },
        { code: "'string' != typeof a", errors: [{ message: "Expected '!==' and instead saw '!='.", type: "BinaryExpression"}] },
        { code: "true == true", errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression"}] },
        { code: "2 == 3", errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression"}] },
        { code: "2 == 3", options: ["always"], errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression"}] },
        { code: "'hello' != 'world'", errors: [{ message: "Expected '!==' and instead saw '!='.", type: "BinaryExpression"}] },
        { code: "'hello' != 'world'", options: ["always"], errors: [{ message: "Expected '!==' and instead saw '!='.", type: "BinaryExpression"}] },
        { code: "a == null", errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression"}] },
        { code: "a == null", options: ["always"], errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression"}] },
        { code: "null != a", errors: [{ message: "Expected '!==' and instead saw '!='.", type: "BinaryExpression"}] },
        { code: "true == 1", options: ["smart"], errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression"}] },
        { code: "0 != '1'", options: ["smart"], errors: [{ message: "Expected '!==' and instead saw '!='.", type: "BinaryExpression"}] },
        { code: "'wee' == /wee/", options: ["smart"], errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression"}] },
        { code: "typeof a == 'number'", options: ["allow-null"], errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression"}] },
        { code: "'string' != typeof a", options: ["allow-null"], errors: [{ message: "Expected '!==' and instead saw '!='.", type: "BinaryExpression"}] },
        { code: "'hello' != 'world'", options: ["allow-null"], errors: [{ message: "Expected '!==' and instead saw '!='.", type: "BinaryExpression"}] },
        { code: "2 == 3", options: ["allow-null"], errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression"}] },
        { code: "true == true", options: ["allow-null"], errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression"}] },
        { code: "a\n==\nb", errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression", line: 2 }] },
        { code: "(a) == b", errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression", line: 1 }] },
        { code: "(a) != b", errors: [{ message: "Expected '!==' and instead saw '!='.", type: "BinaryExpression", line: 1 }] },
        { code: "a == (b)", errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression", line: 1 }] },
        { code: "a != (b)", errors: [{ message: "Expected '!==' and instead saw '!='.", type: "BinaryExpression", line: 1 }] },
        { code: "(a) == (b)", errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression", line: 1 }] },
        { code: "(a) != (b)", errors: [{ message: "Expected '!==' and instead saw '!='.", type: "BinaryExpression", line: 1 }] },
        { code: "(a == b) == (c)", errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression", line: 1 }, { message: "Expected '===' and instead saw '=='.", type: "BinaryExpression", line: 1 }] },
        { code: "(a != b) != (c)", errors: [{ message: "Expected '!==' and instead saw '!='.", type: "BinaryExpression", line: 1 }, { message: "Expected '!==' and instead saw '!='.", type: "BinaryExpression", line: 1 }] }
    ]
});
