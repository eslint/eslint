/**
 * @fileoverview Tests for no-implicit-coercion rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-implicit-coercion");
const RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-implicit-coercion", rule, {
    valid: [
        "Boolean(foo)",
        "foo.indexOf(1) !== -1",
        "Number(foo)",
        "parseInt(foo)",
        "parseFloat(foo)",
        "String(foo)",
        "!foo",
        "~foo",
        "-foo",
        "+1234",
        "-1234",
        "+Number(lol)",
        "-parseFloat(lol)",
        "2 * foo",
        "1 * 1234",
        "1 * Number(foo)",
        "1 * parseInt(foo)",
        "1 * parseFloat(foo)",
        "Number(foo) * 1",
        "parseInt(foo) * 1",
        "parseFloat(foo) * 1",
        "1 * 1234 * 678 * Number(foo)",
        "1 * 1234 * 678 * parseInt(foo)",
        "1234 * 1 * 678 * Number(foo)",
        "1234 * 1 * Number(foo) * Number(bar)",
        "1234 * 1 * Number(foo) * parseInt(bar)",
        "1234 * 1 * Number(foo) * parseFloat(bar)",
        "1234 * 1 * parseInt(foo) * parseFloat(bar)",
        "1234 * 1 * parseInt(foo) * Number(bar)",
        "1234 * 1 * parseFloat(foo) * Number(bar)",
        "1234 * Number(foo) * 1 * Number(bar)",
        "1234 * parseInt(foo) * 1 * Number(bar)",
        "1234 * parseFloat(foo) * 1 * parseInt(bar)",
        "1234 * parseFloat(foo) * 1 * Number(bar)",
        "1234*foo*1",
        "1234*1*foo",
        "1234*bar*1*foo",
        "1234*1*foo*bar",
        "1234*1*foo*Number(bar)",
        "1234*1*Number(foo)*bar",
        "1234*1*parseInt(foo)*bar",
        "0 + foo",
        "~foo.bar()",
        "foo + 'bar'",
        { code: "foo + `${bar}`", parserOptions: { ecmaVersion: 6 } },

        { code: "!!foo", options: [{ boolean: false }] },
        { code: "~foo.indexOf(1)", options: [{ boolean: false }] },
        { code: "+foo", options: [{ number: false }] },
        { code: "1*foo", options: [{ number: false }] },
        { code: "\"\"+foo", options: [{ string: false }] },
        { code: "foo += \"\"", options: [{ string: false }] },
        { code: "var a = !!foo", options: [{ boolean: true, allow: ["!!"] }] },
        { code: "var a = ~foo.indexOf(1)", options: [{ boolean: true, allow: ["~"] }] },
        { code: "var a = ~foo", options: [{ boolean: true }] },
        { code: "var a = 1 * foo", options: [{ boolean: true, allow: ["*"] }] },
        { code: "var a = +foo", options: [{ boolean: true, allow: ["+"] }] },
        { code: "var a = \"\" + foo", options: [{ boolean: true, string: true, allow: ["+"] }] },

        // https://github.com/eslint/eslint/issues/7057
        "'' + 'foo'",
        { code: "`` + 'foo'", parserOptions: { ecmaVersion: 6 } },
        { code: "'' + `${foo}`", parserOptions: { ecmaVersion: 6 } },
        "'foo' + ''",
        { code: "'foo' + ``", parserOptions: { ecmaVersion: 6 } },
        { code: "`${foo}` + ''", parserOptions: { ecmaVersion: 6 } },
        "foo += 'bar'",
        { code: "foo += `${bar}`", parserOptions: { ecmaVersion: 6 } },
        "+42"
    ],
    invalid: [
        {
            code: "!!foo",
            output: "Boolean(foo)",
            errors: [{ message: "use `Boolean(foo)` instead.", type: "UnaryExpression" }]
        },
        {
            code: "!!(foo + bar)",
            output: "Boolean(foo + bar)",
            errors: [{ message: "use `Boolean(foo + bar)` instead.", type: "UnaryExpression" }]
        },
        {
            code: "~foo.indexOf(1)",
            output: null,
            errors: [{ message: "use `foo.indexOf(1) !== -1` instead.", type: "UnaryExpression" }]
        },
        {
            code: "~foo.bar.indexOf(2)",
            output: null,
            errors: [{ message: "use `foo.bar.indexOf(2) !== -1` instead.", type: "UnaryExpression" }]
        },
        {
            code: "+foo",
            output: "Number(foo)",
            errors: [{ message: "use `Number(foo)` instead.", type: "UnaryExpression" }]
        },
        {
            code: "+foo.bar",
            output: "Number(foo.bar)",
            errors: [{ message: "use `Number(foo.bar)` instead.", type: "UnaryExpression" }]
        },
        {
            code: "1*foo",
            output: "Number(foo)",
            errors: [{ message: "use `Number(foo)` instead.", type: "BinaryExpression" }]
        },
        {
            code: "foo*1",
            output: "Number(foo)",
            errors: [{ message: "use `Number(foo)` instead.", type: "BinaryExpression" }]
        },
        {
            code: "1*foo.bar",
            output: "Number(foo.bar)",
            errors: [{ message: "use `Number(foo.bar)` instead.", type: "BinaryExpression" }]
        },
        {
            code: "\"\"+foo",
            output: "String(foo)",
            errors: [{ message: "use `String(foo)` instead.", type: "BinaryExpression" }]
        },
        {
            code: "``+foo",
            output: "String(foo)",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "use `String(foo)` instead.", type: "BinaryExpression" }]
        },
        {
            code: "foo+\"\"",
            output: "String(foo)",
            errors: [{ message: "use `String(foo)` instead.", type: "BinaryExpression" }]
        },
        {
            code: "foo+``",
            output: "String(foo)",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "use `String(foo)` instead.", type: "BinaryExpression" }]
        },
        {
            code: "\"\"+foo.bar",
            output: "String(foo.bar)",
            errors: [{ message: "use `String(foo.bar)` instead.", type: "BinaryExpression" }]
        },
        {
            code: "``+foo.bar",
            output: "String(foo.bar)",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "use `String(foo.bar)` instead.", type: "BinaryExpression" }]
        },
        {
            code: "foo.bar+\"\"",
            output: "String(foo.bar)",
            errors: [{ message: "use `String(foo.bar)` instead.", type: "BinaryExpression" }]
        },
        {
            code: "foo.bar+``",
            output: "String(foo.bar)",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "use `String(foo.bar)` instead.", type: "BinaryExpression" }]
        },
        {
            code: "foo += \"\"",
            output: "foo = String(foo)",
            errors: [{ message: "use `foo = String(foo)` instead.", type: "AssignmentExpression" }]
        },
        {
            code: "foo += ``",
            output: "foo = String(foo)",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "use `foo = String(foo)` instead.", type: "AssignmentExpression" }]
        },
        {
            code: "var a = !!foo",
            output: "var a = Boolean(foo)",
            options: [{ boolean: true, allow: ["~"] }],
            errors: [{ message: "use `Boolean(foo)` instead.", type: "UnaryExpression" }]
        },
        {
            code: "var a = ~foo.indexOf(1)",
            output: null,
            options: [{ boolean: true, allow: ["!!"] }],
            errors: [{ message: "use `foo.indexOf(1) !== -1` instead.", type: "UnaryExpression" }]
        },
        {
            code: "var a = 1 * foo",
            output: "var a = Number(foo)",
            options: [{ boolean: true, allow: ["+"] }],
            errors: [{ message: "use `Number(foo)` instead.", type: "BinaryExpression" }]
        },
        {
            code: "var a = +foo",
            output: "var a = Number(foo)",
            options: [{ boolean: true, allow: ["*"] }],
            errors: [{ message: "use `Number(foo)` instead.", type: "UnaryExpression" }]
        },
        {
            code: "var a = \"\" + foo",
            output: "var a = String(foo)",
            options: [{ boolean: true, allow: ["*"] }],
            errors: [{ message: "use `String(foo)` instead.", type: "BinaryExpression" }]
        },
        {
            code: "var a = `` + foo",
            output: "var a = String(foo)",
            options: [{ boolean: true, allow: ["*"] }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "use `String(foo)` instead.", type: "BinaryExpression" }]
        },
        {
            code: "typeof+foo",
            output: "typeof Number(foo)",
            errors: [{ message: "use `Number(foo)` instead.", type: "UnaryExpression" }]
        },
        {
            code: "typeof +foo",
            output: "typeof Number(foo)",
            errors: [{ message: "use `Number(foo)` instead.", type: "UnaryExpression" }]
        }
    ]
});
