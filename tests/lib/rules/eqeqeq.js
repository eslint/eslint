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

const wantedEqEqEq = { expectedOperator: "===", actualOperator: "==" };
const wantedNotEqEq = { expectedOperator: "!==", actualOperator: "!=" };
const wantedEqEq = { expectedOperator: "==", actualOperator: "===" };
const wantedNotEq = { expectedOperator: "!=", actualOperator: "!==" };

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
        { code: "a == null", options: ["allow-null"] },
        { code: "a == null", options: ["always", { null: "ignore" }] },
        { code: "a != null", options: ["always", { null: "ignore" }] },
        { code: "a !== null", options: ["always", { null: "ignore" }] },
        { code: "a === null", options: ["always", { null: "always" }] },
        { code: "a !== null", options: ["always", { null: "always" }] },
        { code: "null === null", options: ["always", { null: "always" }] },
        { code: "null !== null", options: ["always", { null: "always" }] },
        { code: "a == null", options: ["always", { null: "never" }] },
        { code: "a != null", options: ["always", { null: "never" }] },
        { code: "null == null", options: ["always", { null: "never" }] },
        { code: "null != null", options: ["always", { null: "never" }] },

        // https://github.com/eslint/eslint/issues/8020
        { code: "foo === /abc/u", options: ["always", { null: "never" }], parserOptions: { ecmaVersion: 6 } }
    ],
    invalid: [
        { code: "a == b", errors: [{ messageId: "unexpected", data: wantedEqEqEq, type: "BinaryExpression" }] },
        { code: "a != b", errors: [{ messageId: "unexpected", data: wantedNotEqEq, type: "BinaryExpression" }] },
        { code: "typeof a == 'number'", output: "typeof a === 'number'", errors: [{ messageId: "unexpected", data: wantedEqEqEq, type: "BinaryExpression" }] },
        { code: "typeof a == 'number'", output: "typeof a === 'number'", options: ["always"], errors: [{ messageId: "unexpected", data: wantedEqEqEq, type: "BinaryExpression" }] },
        { code: "'string' != typeof a", output: "'string' !== typeof a", errors: [{ messageId: "unexpected", data: wantedNotEqEq, type: "BinaryExpression" }] },
        { code: "true == true", output: "true === true", errors: [{ messageId: "unexpected", data: wantedEqEqEq, type: "BinaryExpression" }] },
        { code: "2 == 3", output: "2 === 3", errors: [{ messageId: "unexpected", data: wantedEqEqEq, type: "BinaryExpression" }] },
        { code: "2 == 3", output: "2 === 3", options: ["always"], errors: [{ messageId: "unexpected", data: wantedEqEqEq, type: "BinaryExpression" }] },
        { code: "'hello' != 'world'", output: "'hello' !== 'world'", errors: [{ messageId: "unexpected", data: wantedNotEqEq, type: "BinaryExpression" }] },
        { code: "'hello' != 'world'", output: "'hello' !== 'world'", options: ["always"], errors: [{ messageId: "unexpected", data: wantedNotEqEq, type: "BinaryExpression" }] },
        { code: "a == null", errors: [{ messageId: "unexpected", data: wantedEqEqEq, type: "BinaryExpression" }] },
        { code: "a == null", options: ["always"], errors: [{ messageId: "unexpected", data: wantedEqEqEq, type: "BinaryExpression" }] },
        { code: "null != a", errors: [{ messageId: "unexpected", data: wantedNotEqEq, type: "BinaryExpression" }] },
        { code: "true == 1", options: ["smart"], errors: [{ messageId: "unexpected", data: wantedEqEqEq, type: "BinaryExpression" }] },
        { code: "0 != '1'", options: ["smart"], errors: [{ messageId: "unexpected", data: wantedNotEqEq, type: "BinaryExpression" }] },
        { code: "'wee' == /wee/", options: ["smart"], errors: [{ messageId: "unexpected", data: wantedEqEqEq, type: "BinaryExpression" }] },
        { code: "typeof a == 'number'", output: "typeof a === 'number'", options: ["allow-null"], errors: [{ messageId: "unexpected", data: wantedEqEqEq, type: "BinaryExpression" }] },
        { code: "'string' != typeof a", output: "'string' !== typeof a", options: ["allow-null"], errors: [{ messageId: "unexpected", data: wantedNotEqEq, type: "BinaryExpression" }] },
        { code: "'hello' != 'world'", output: "'hello' !== 'world'", options: ["allow-null"], errors: [{ messageId: "unexpected", data: wantedNotEqEq, type: "BinaryExpression" }] },
        { code: "2 == 3", output: "2 === 3", options: ["allow-null"], errors: [{ messageId: "unexpected", data: wantedEqEqEq, type: "BinaryExpression" }] },
        { code: "true == true", output: "true === true", options: ["allow-null"], errors: [{ messageId: "unexpected", data: wantedEqEqEq, type: "BinaryExpression" }] },
        { code: "true == null", options: ["always", { null: "always" }], errors: [{ messageId: "unexpected", data: wantedEqEqEq, type: "BinaryExpression" }] },
        { code: "true != null", options: ["always", { null: "always" }], errors: [{ messageId: "unexpected", data: wantedNotEqEq, type: "BinaryExpression" }] },
        { code: "null == null", output: "null === null", options: ["always", { null: "always" }], errors: [{ messageId: "unexpected", data: wantedEqEqEq, type: "BinaryExpression" }] },
        { code: "null != null", output: "null !== null", options: ["always", { null: "always" }], errors: [{ messageId: "unexpected", data: wantedNotEqEq, type: "BinaryExpression" }] },
        { code: "true === null", options: ["always", { null: "never" }], errors: [{ messageId: "unexpected", data: wantedEqEq, type: "BinaryExpression" }] },
        { code: "true !== null", options: ["always", { null: "never" }], errors: [{ messageId: "unexpected", data: wantedNotEq, type: "BinaryExpression" }] },
        { code: "null === null", output: "null == null", options: ["always", { null: "never" }], errors: [{ messageId: "unexpected", data: wantedEqEq, type: "BinaryExpression" }] },
        { code: "null !== null", output: "null != null", options: ["always", { null: "never" }], errors: [{ messageId: "unexpected", data: wantedNotEq, type: "BinaryExpression" }] },
        { code: "a\n==\nb", errors: [{ messageId: "unexpected", data: wantedEqEqEq, type: "BinaryExpression", line: 2 }] },
        { code: "(a) == b", errors: [{ messageId: "unexpected", data: wantedEqEqEq, type: "BinaryExpression", line: 1 }] },
        { code: "(a) != b", errors: [{ messageId: "unexpected", data: wantedNotEqEq, type: "BinaryExpression", line: 1 }] },
        { code: "a == (b)", errors: [{ messageId: "unexpected", data: wantedEqEqEq, type: "BinaryExpression", line: 1 }] },
        { code: "a != (b)", errors: [{ messageId: "unexpected", data: wantedNotEqEq, type: "BinaryExpression", line: 1 }] },
        { code: "(a) == (b)", errors: [{ messageId: "unexpected", data: wantedEqEqEq, type: "BinaryExpression", line: 1 }] },
        { code: "(a) != (b)", errors: [{ messageId: "unexpected", data: wantedNotEqEq, type: "BinaryExpression", line: 1 }] },
        {
            code: "(a == b) == (c)",
            errors: [
                { messageId: "unexpected", data: wantedEqEqEq, type: "BinaryExpression", line: 1 },
                { messageId: "unexpected", data: wantedEqEqEq, type: "BinaryExpression", line: 1 }
            ]
        },
        {
            code: "(a != b) != (c)",
            errors: [
                { messageId: "unexpected", data: wantedNotEqEq, type: "BinaryExpression", line: 1 },
                { messageId: "unexpected", data: wantedNotEqEq, type: "BinaryExpression", line: 1 }
            ]
        }

    // If no output is provided, assert that no output is produced.
    ].map(invalidCase => Object.assign({ output: null }, invalidCase))
});
