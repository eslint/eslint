/**
 * @fileoverview Tests for undefined rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-undef-init"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-undef-init", rule, {
    valid: [
        "var a;",
        { code: "const foo = undefined", parserOptions: { ecmaVersion: 6 } },
        "var undefined = 5; var foo = undefined;",

        // doesn't apply to class fields
        { code: "class C { field = undefined; }", parserOptions: { ecmaVersion: 2022 } }

    ],
    invalid: [
        {
            code: "var a = undefined;",
            output: null,
            errors: [{ messageId: "unnecessaryUndefinedInit", data: { name: "a" }, type: "VariableDeclarator" }]
        },
        {
            code: "var a = undefined, b = 1;",
            output: null,
            errors: [{ messageId: "unnecessaryUndefinedInit", data: { name: "a" }, type: "VariableDeclarator" }]
        },
        {
            code: "var a = 1, b = undefined, c = 5;",
            output: null,
            errors: [{ messageId: "unnecessaryUndefinedInit", data: { name: "b" }, type: "VariableDeclarator" }]
        },
        {
            code: "var [a] = undefined;",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unnecessaryUndefinedInit", data: { name: "[a]" }, type: "VariableDeclarator" }]
        },
        {
            code: "var {a} = undefined;",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unnecessaryUndefinedInit", data: { name: "{a}" }, type: "VariableDeclarator" }]
        },
        {
            code: "for(var i in [1,2,3]){var a = undefined; for(var j in [1,2,3]){}}",
            output: null,
            errors: [{ messageId: "unnecessaryUndefinedInit", data: { name: "a" }, type: "VariableDeclarator" }]
        },
        {
            code: "let a = undefined;",
            output: "let a;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unnecessaryUndefinedInit", data: { name: "a" }, type: "VariableDeclarator" }]
        },
        {
            code: "let a = undefined, b = 1;",
            output: "let a, b = 1;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unnecessaryUndefinedInit", data: { name: "a" }, type: "VariableDeclarator" }]
        },
        {
            code: "let a = 1, b = undefined, c = 5;",
            output: "let a = 1, b, c = 5;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unnecessaryUndefinedInit", data: { name: "b" }, type: "VariableDeclarator" }]
        },
        {
            code: "let [a] = undefined;",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unnecessaryUndefinedInit", data: { name: "[a]" }, type: "VariableDeclarator" }]
        },
        {
            code: "let {a} = undefined;",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unnecessaryUndefinedInit", data: { name: "{a}" }, type: "VariableDeclarator" }]
        },
        {
            code: "for(var i in [1,2,3]){let a = undefined; for(var j in [1,2,3]){}}",
            output: "for(var i in [1,2,3]){let a; for(var j in [1,2,3]){}}",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unnecessaryUndefinedInit", data: { name: "a" }, type: "VariableDeclarator" }]
        },

        // Should not autofix if it would remove comments
        {
            code: "let /* comment */a = undefined;",
            output: "let /* comment */a;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unnecessaryUndefinedInit", data: { name: "a" }, type: "VariableDeclarator" }]
        },
        {
            code: "let a/**/ = undefined;",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unnecessaryUndefinedInit", data: { name: "a" }, type: "VariableDeclarator" }]
        },
        {
            code: "let a /**/ = undefined;",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unnecessaryUndefinedInit", data: { name: "a" }, type: "VariableDeclarator" }]
        },
        {
            code: "let a//\n= undefined;",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unnecessaryUndefinedInit", data: { name: "a" }, type: "VariableDeclarator" }]
        },
        {
            code: "let a = /**/undefined;",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unnecessaryUndefinedInit", data: { name: "a" }, type: "VariableDeclarator" }]
        },
        {
            code: "let a = //\nundefined;",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unnecessaryUndefinedInit", data: { name: "a" }, type: "VariableDeclarator" }]
        },
        {
            code: "let a = undefined/* comment */;",
            output: "let a/* comment */;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unnecessaryUndefinedInit", data: { name: "a" }, type: "VariableDeclarator" }]
        },
        {
            code: "let a = undefined/* comment */, b;",
            output: "let a/* comment */, b;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unnecessaryUndefinedInit", data: { name: "a" }, type: "VariableDeclarator" }]
        },
        {
            code: "let a = undefined//comment\n, b;",
            output: "let a//comment\n, b;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unnecessaryUndefinedInit", data: { name: "a" }, type: "VariableDeclarator" }]
        }
    ]
});
