/**
 * @fileoverview Tests for eqeqeq rule.
 * @author Nicholas C. Zakas
 * @copyright 2013 Matt DuVall. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/eqeqeq"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("eqeqeq", rule, {
    valid: [
        "a === b",
        "a !== b",
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
        { code: "a == b", output: "a === b", errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression"}] },
        { code: "a != b", output: "a !== b", errors: [{ message: "Expected '!==' and instead saw '!='.", type: "BinaryExpression"}] },
        { code: "typeof a == 'number'", output: "typeof a === 'number'", errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression"}] },
        { code: "'string' != typeof a", output: "'string' !== typeof a", errors: [{ message: "Expected '!==' and instead saw '!='.", type: "BinaryExpression"}] },
        { code: "true == true", output: "true === true", errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression"}] },
        { code: "2 == 3", output: "2 === 3", errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression"}] },
        { code: "'hello' != 'world'", output: "'hello' !== 'world'", errors: [{ message: "Expected '!==' and instead saw '!='.", type: "BinaryExpression"}] },
        { code: "a == null", output: "a === null", errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression"}] },
        { code: "null != a", output: "null !== a", errors: [{ message: "Expected '!==' and instead saw '!='.", type: "BinaryExpression"}] },
        { code: "true == 1", output: "true === 1", options: ["smart"], errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression"}] },
        { code: "0 != '1'", output: "0 !== '1'", options: ["smart"], errors: [{ message: "Expected '!==' and instead saw '!='.", type: "BinaryExpression"}] },
        { code: "'wee' == /wee/", output: "'wee' === /wee/", options: ["smart"], errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression"}] },
        { code: "typeof a == 'number'", output: "typeof a === 'number'", options: ["allow-null"], errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression"}] },
        { code: "'string' != typeof a", output: "'string' !== typeof a", options: ["allow-null"], errors: [{ message: "Expected '!==' and instead saw '!='.", type: "BinaryExpression"}] },
        { code: "'hello' != 'world'", output: "'hello' !== 'world'", options: ["allow-null"], errors: [{ message: "Expected '!==' and instead saw '!='.", type: "BinaryExpression"}] },
        { code: "2 == 3", output: "2 === 3", options: ["allow-null"], errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression"}] },
        { code: "true == true", output: "true === true", options: ["allow-null"], errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression"}] },
        { code: "a\n==\nb", output: "a\n===\nb", errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression", line: 2 }] },
        { code: "(a) == b", output: "(a) === b", errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression", line: 1 }] },
        { code: "(a) != b", output: "(a) !== b", errors: [{ message: "Expected '!==' and instead saw '!='.", type: "BinaryExpression", line: 1 }] },
        { code: "a == (b)", output: "a === (b)", errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression", line: 1 }] },
        { code: "a != (b)", output: "a !== (b)", errors: [{ message: "Expected '!==' and instead saw '!='.", type: "BinaryExpression", line: 1 }] },
        { code: "(a) == (b)", output: "(a) === (b)", errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression", line: 1 }] },
        { code: "(a) != (b)", output: "(a) !== (b)", errors: [{ message: "Expected '!==' and instead saw '!='.", type: "BinaryExpression", line: 1 }] },
        { code: "(a == b) == (c)", output: "(a === b) === (c)", errors: [{ message: "Expected '===' and instead saw '=='.", type: "BinaryExpression", line: 1 }, { message: "Expected '===' and instead saw '=='.", type: "BinaryExpression", line: 1 }] },
        { code: "(a != b) != (c)", output: "(a !== b) !== (c)", errors: [{ message: "Expected '!==' and instead saw '!='.", type: "BinaryExpression", line: 1 }, { message: "Expected '!==' and instead saw '!='.", type: "BinaryExpression", line: 1 }] }
    ]
});
