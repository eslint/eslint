/**
 * @fileoverview Tests for no-multi-assign rule.
 * @author Stewart Rand
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-multi-assign"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Fixtures
//------------------------------------------------------------------------------

/**
 * Returns an error object at the specified line and column
 * @private
 * @param {int} line - line number
 * @param {int} column - column number
 * @param {string} type - Type of node
 * @returns {Oject} Error object
 */
function errorAt(line, column, type) {
    return {
        message: "Unexpected chained assignment.",
        type,
        line,
        column
    };
}


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-mutli-assign", rule, {
    valid: [
        "var a, b, c,\nd = 0;",
        "var a = 1; var b = 2; var c = 3;\nvar d = 0;",
        "var a = 1 + (b === 10 ? 5 : 4);",
        { code: "const a = 1, b = 2, c = 3;", parserOptions: { ecmaVersion: 6 } },
        { code: "const a = 1;\nconst b = 2;\n const c = 3;", parserOptions: { ecmaVersion: 6 } },
        "for(var a = 0, b = 0;;){}",
        { code: "for(let a = 0, b = 0;;){}", parserOptions: { ecmaVersion: 6 } },
        { code: "for(const a = 0, b = 0;;){}", parserOptions: { ecmaVersion: 6 } },
        { code: "export let a, b;", parserOptions: { sourceType: "module" } },
        { code: "export let a,\n b = 0;", parserOptions: { sourceType: "module" } }
    ],

    invalid: [
        {
            code: "var a = b = c;",
            errors: [
                errorAt(1, 9, "AssignmentExpression")
            ]
        },
        {
            code: "var a = b = c = d;",
            errors: [
                errorAt(1, 9, "AssignmentExpression"),
                errorAt(1, 13, "AssignmentExpression")
            ]
        },
        {
            code: "let foo = bar = cee = 100;",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                errorAt(1, 11, "AssignmentExpression"),
                errorAt(1, 17, "AssignmentExpression")
            ]
        },
        {
            code: "a=b=c=d=e",
            errors: [
                errorAt(1, 3, "AssignmentExpression"),
                errorAt(1, 5, "AssignmentExpression"),
                errorAt(1, 7, "AssignmentExpression")
            ]
        },
        {
            code: "a=b=c",
            errors: [
                errorAt(1, 3, "AssignmentExpression")
            ]
        },

        {
            code: "a\n=b\n=c",
            errors: [
                errorAt(2, 2, "AssignmentExpression")
            ]
        },

        {
            code: "var a = (b) = (((c)))",
            errors: [
                errorAt(1, 9, "AssignmentExpression")
            ]
        },

        {
            code: "var a = ((b)) = (c)",
            errors: [
                errorAt(1, 9, "AssignmentExpression")
            ]
        },

        {
            code: "var a = b = ( (c * 12) + 2)",
            errors: [
                errorAt(1, 9, "AssignmentExpression")
            ]
        },

        {
            code: "var a =\n((b))\n = (c)",
            errors: [
                errorAt(2, 1, "AssignmentExpression")
            ]
        },

        {
            code: "a = b = '=' + c + 'foo';",
            errors: [
                errorAt(1, 5, "AssignmentExpression")
            ]
        },
        {
            code: "a = b = 7 * 12 + 5;",
            errors: [
                errorAt(1, 5, "AssignmentExpression")
            ]
        }
    ]
});
