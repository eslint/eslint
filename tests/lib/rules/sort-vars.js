/**
 * @fileoverview Tests for sort-vars rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/sort-vars"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester(),
    expectedError = {
        message: "Variables within the same declaration block should be sorted alphabetically",
        type: "VariableDeclarator"
    },
    ignoreCaseArgs = [ { ignoreCase: true } ];

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
        { code: "var {a, b, c};", options: ignoreCaseArgs, ecmaFeatures: { destructuring: true }},
        { code: "var {A, b, C};", options: ignoreCaseArgs, ecmaFeatures: { destructuring: true }},
        { code: "var test = [1,2,3];", ecmaFeatures: { destructuring: true }},
        { code: "var {a,b} = [1,2];", ecmaFeatures: { destructuring: true }},
        { code: "var [a, B, c] = [1, 2, 3];", options: ignoreCaseArgs,
            ecmaFeatures: { destructuring: true }},
        { code: "var [A, B, c] = [1, 2, 3];", options: ignoreCaseArgs,
            ecmaFeatures: { destructuring: true }},
        { code: "var [A, b, C] = [1, 2, 3];", options: ignoreCaseArgs,
            ecmaFeatures: { destructuring: true }},
        { code: "let {a, b, c};", ecmaFeatures: { blockBindings: true,
            destructuring: true}},
        { code: "let [a, b, c] = [1, 2, 3];",
            ecmaFeatures: { blockBindings: true, destructuring: true }},
        { code: "const {a, b, c} = {a: 1, b: true, c: \"Moo\"};", options: ignoreCaseArgs,
            ecmaFeatures: { blockBindings: true, destructuring: true }},
        { code: "const [a, b, c] = [1, true, \"Moo\"];", options: ignoreCaseArgs,
            ecmaFeatures: { blockBindings: true, destructuring: true }},
        { code: "const [c, a, b] = [1, true, \"Moo\"];", options: ignoreCaseArgs,
            ecmaFeatures: { blockBindings: true, destructuring: true }},
        { code: "var {a, x: {b, c}} = {};", ecmaFeatures: { destructuring: true }},
        { code: "var {c, x: {a, c}} = {};", ecmaFeatures: { destructuring: true }},
        { code: "var {a, x: [b, c]} = {};", ecmaFeatures: { destructuring: true }},
        { code: "var [a, {b, c}] = {};", ecmaFeatures: { destructuring: true }},
        { code: "var [a, {x: {b, c}}] = {};", ecmaFeatures: { destructuring: true }},
        { code: "var a = 42, {b, c } = {};", ecmaFeatures: { destructuring: true }},
        { code: "var b = 42, {a, c } = {};", ecmaFeatures: { destructuring: true }},
        { code: "var [b, {x: {a, c}}] = {};", ecmaFeatures: { destructuring: true }},
        { code: "var [b, d, a, c] = {};", ecmaFeatures: { destructuring: true }},
        { code: "var e, [a, c, d] = {};", ecmaFeatures: { destructuring: true }},
        { code: "var a, [E, c, D] = [];", options: ignoreCaseArgs,
            ecmaFeatures: { destructuring: true }},
        { code: "var a, f, [e, c, d] = [1,2,3];", ecmaFeatures: { destructuring: true }},
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
        ].join("\n"), env: { es6: true }, ecmaFeatures: { modules: true }}
    ],
    invalid: [
        { code: "var b, a", errors: [ expectedError ] },
        { code: "var b=10, a=20;", errors: [ expectedError ] },
        { code: "var all=10, a = 1", errors: [ expectedError ] },
        { code: "var b, c, a, d", errors: [ expectedError ] },
        { code: "var c, d, a, b", errors: 2 },
        { code: "var a, A;", errors: [ expectedError ] },
        { code: "var a, B;", errors: [ expectedError ] },
        { code: "var a, B, c;", errors: [ expectedError ] },
        { code: "var B, a;", options: ignoreCaseArgs, errors: [ expectedError ] },
        { code: "var B, A, c;", options: ignoreCaseArgs, errors: [ expectedError ] },
        { code: "var d, a, [b, c] = {};", options: ignoreCaseArgs,
            ecmaFeatures: { destructuring: true }, errors: [ expectedError ] },
        { code: "var d, a, [b, {x: {c, e}}] = {};", options: ignoreCaseArgs,
            ecmaFeatures: { destructuring: true }, errors: [ expectedError ] }
    ]
});
