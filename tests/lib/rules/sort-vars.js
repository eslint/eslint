/**
 * @fileoverview Tests for sort-vars rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/sort-vars"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester(),
    expectedError = {
        message: "Variables within the same declaration block should be sorted alphabetically.",
        type: "VariableDeclarator"
    },
    ignoreCaseArgs = [{ ignoreCase: true }];

ruleTester.run("sort-vars", rule, {
    valid: [
        "var a=10, b=4, c='abc'",
        "var a, b, c, d",
        "var b; var a; var d;",
        "var _a, a",
        "var A, a",
        "var A, b",
        { code: "var a, A;", options: ignoreCaseArgs },
        { code: "var A, a;", options: ignoreCaseArgs },
        { code: "var a, B, c;", options: ignoreCaseArgs },
        { code: "var A, b, C;", options: ignoreCaseArgs },
        { code: "var {a, b, c} = x;", options: ignoreCaseArgs, parserOptions: { ecmaVersion: 6 } },
        { code: "var {A, b, C} = x;", options: ignoreCaseArgs, parserOptions: { ecmaVersion: 6 } },
        { code: "var test = [1,2,3];", parserOptions: { ecmaVersion: 6 } },
        { code: "var {a,b} = [1,2];", parserOptions: { ecmaVersion: 6 } },
        { code: "var [a, B, c] = [1, 2, 3];", options: ignoreCaseArgs,
            parserOptions: { ecmaVersion: 6 } },
        { code: "var [A, B, c] = [1, 2, 3];", options: ignoreCaseArgs,
            parserOptions: { ecmaVersion: 6 } },
        { code: "var [A, b, C] = [1, 2, 3];", options: ignoreCaseArgs,
            parserOptions: { ecmaVersion: 6 } },
        { code: "let {a, b, c} = x;", parserOptions: { ecmaVersion: 6 } },
        { code: "let [a, b, c] = [1, 2, 3];",
            parserOptions: { ecmaVersion: 6 } },
        { code: "const {a, b, c} = {a: 1, b: true, c: \"Moo\"};", options: ignoreCaseArgs,
            parserOptions: { ecmaVersion: 6 } },
        { code: "const [a, b, c] = [1, true, \"Moo\"];", options: ignoreCaseArgs,
            parserOptions: { ecmaVersion: 6 } },
        { code: "const [c, a, b] = [1, true, \"Moo\"];", options: ignoreCaseArgs,
            parserOptions: { ecmaVersion: 6 } },
        { code: "var {a, x: {b, c}} = {};", parserOptions: { ecmaVersion: 6 } },
        { code: "var {c, x: {a, c}} = {};", parserOptions: { ecmaVersion: 6 } },
        { code: "var {a, x: [b, c]} = {};", parserOptions: { ecmaVersion: 6 } },
        { code: "var [a, {b, c}] = {};", parserOptions: { ecmaVersion: 6 } },
        { code: "var [a, {x: {b, c}}] = {};", parserOptions: { ecmaVersion: 6 } },
        { code: "var a = 42, {b, c } = {};", parserOptions: { ecmaVersion: 6 } },
        { code: "var b = 42, {a, c } = {};", parserOptions: { ecmaVersion: 6 } },
        { code: "var [b, {x: {a, c}}] = {};", parserOptions: { ecmaVersion: 6 } },
        { code: "var [b, d, a, c] = {};", parserOptions: { ecmaVersion: 6 } },
        { code: "var e, [a, c, d] = {};", parserOptions: { ecmaVersion: 6 } },
        { code: "var a, [E, c, D] = [];", options: ignoreCaseArgs,
            parserOptions: { ecmaVersion: 6 } },
        { code: "var a, f, [e, c, d] = [1,2,3];", parserOptions: { ecmaVersion: 6 } },
        { code: [
            "export default class {",
            "    render () {",
            "        let {",
            "            b",
            "        } = this,",
            "            a,",
            "            c;",
            "    }",
            "}"
        ].join("\n"), env: { es6: true }, parserOptions: { sourceType: "module" } },

        {
            code: "var {} = 1, a",
            options: ignoreCaseArgs,
            parserOptions: { ecmaVersion: 6 }
        }
    ],
    invalid: [
        { code: "var b, a", errors: [expectedError] },
        { code: "var b=10, a=20;", errors: [expectedError] },
        { code: "var all=10, a = 1", errors: [expectedError] },
        { code: "var b, c, a, d", errors: [expectedError] },
        { code: "var c, d, a, b", errors: 2 },
        { code: "var a, A;", errors: [expectedError] },
        { code: "var a, B;", errors: [expectedError] },
        { code: "var a, B, c;", errors: [expectedError] },
        { code: "var B, a;", options: ignoreCaseArgs, errors: [expectedError] },
        { code: "var B, A, c;", options: ignoreCaseArgs, errors: [expectedError] },
        { code: "var d, a, [b, c] = {};", options: ignoreCaseArgs,
            parserOptions: { ecmaVersion: 6 }, errors: [expectedError] },
        { code: "var d, a, [b, {x: {c, e}}] = {};", options: ignoreCaseArgs,
            parserOptions: { ecmaVersion: 6 }, errors: [expectedError] },

        {
            code: "var {} = 1, b, a",
            options: ignoreCaseArgs,
            parserOptions: { ecmaVersion: 6 },
            errors: [expectedError]
        }
    ]
});
