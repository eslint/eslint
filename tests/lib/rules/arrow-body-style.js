/**
 * @fileoverview Tests for arrow-body-style
 * @author Alberto Rodríguez
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/arrow-body-style"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("arrow-body-style", rule, {
    valid: [
        { code: "var foo = () => {};", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = () => 0;", parserOptions: { ecmaVersion: 6 } },
        { code: "var addToB = (a) => { b =  b + a };", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = () => { /* do nothing */ };", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = () => {\n /* do nothing */ \n};", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = (retv, name) => {\nretv[name] = true;\nreturn retv;\n};", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = () => ({});", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = () => bar();", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = () => { bar(); };", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = () => { b = a };", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = () => { bar: 1 };", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = () => { return 0; };", parserOptions: { ecmaVersion: 6 }, options: ["always"] },
        { code: "var foo = () => { return bar(); };", parserOptions: { ecmaVersion: 6 }, options: ["always"] },
        { code: "var foo = () => 0;", parserOptions: { ecmaVersion: 6 }, options: ["never"] },
        { code: "var foo = () => ({ foo: 0 });", parserOptions: { ecmaVersion: 6 }, options: ["never"] },
        { code: "var foo = () => {};", parserOptions: { ecmaVersion: 6 }, options: ["as-needed", {requireReturnForObjectLiteral: true }] },
        { code: "var foo = () => 0;", parserOptions: { ecmaVersion: 6 }, options: ["as-needed", {requireReturnForObjectLiteral: true }] },
        { code: "var addToB = (a) => { b =  b + a };", parserOptions: { ecmaVersion: 6 }, options: ["as-needed", {requireReturnForObjectLiteral: true }] },
        { code: "var foo = () => { /* do nothing */ };", parserOptions: { ecmaVersion: 6 }, options: ["as-needed", {requireReturnForObjectLiteral: true }] },
        { code: "var foo = () => {\n /* do nothing */ \n};", parserOptions: { ecmaVersion: 6 }, options: ["as-needed", {requireReturnForObjectLiteral: true }] },
        { code: "var foo = (retv, name) => {\nretv[name] = true;\nreturn retv;\n};", parserOptions: { ecmaVersion: 6 }, options: ["as-needed", {requireReturnForObjectLiteral: true }] },
        { code: "var foo = () => bar();", parserOptions: { ecmaVersion: 6 }, options: ["as-needed", {requireReturnForObjectLiteral: true }] },
        { code: "var foo = () => { bar(); };", parserOptions: { ecmaVersion: 6 }, options: ["as-needed", {requireReturnForObjectLiteral: true }] },
        { code: "var addToB = (a) => { b =  b + a };", parserOptions: { ecmaVersion: 6 }, options: ["as-needed", {requireReturnForObjectLiteral: true }] },
        { code: "var foo = () => { return { bar: 0 }; };", parserOptions: { ecmaVersion: 6 }, options: ["as-needed", {requireReturnForObjectLiteral: true }] }
    ],
    invalid: [
        {
            code: "var foo = () => 0;",
            output: "var foo = () => {return 0};",
            parserOptions: { ecmaVersion: 6 },
            options: ["always"],
            errors: [
                { line: 1, column: 17, type: "ArrowFunctionExpression", message: "Expected block statement surrounding arrow body." }
            ]
        },
        {
            code: "var foo = () => ({});",
            output: "var foo = () => {return ({})};",
            parserOptions: { ecmaVersion: 6 },
            options: ["always"],
            errors: [
                { line: 1, column: 18, type: "ArrowFunctionExpression", message: "Expected block statement surrounding arrow body." }
            ]
        },
        {
            code: "var foo = () => { return 0; };",
            output: "var foo = () => 0;",
            parserOptions: { ecmaVersion: 6 },
            options: ["as-needed"],
            errors: [
                { line: 1, column: 17, type: "ArrowFunctionExpression", message: "Unexpected block statement surrounding arrow body." }
            ]
        },
        {
            code: "var foo = () => { return 0 };",
            output: "var foo = () => 0;",
            parserOptions: { ecmaVersion: 6 },
            options: ["as-needed"],
            errors: [
                { line: 1, column: 17, type: "ArrowFunctionExpression", message: "Unexpected block statement surrounding arrow body." }
            ]
        },
        {
            code: "var foo = () => { return bar(); };",
            output: "var foo = () => bar();",
            parserOptions: { ecmaVersion: 6 },
            options: ["as-needed"],
            errors: [
                { line: 1, column: 17, type: "ArrowFunctionExpression", message: "Unexpected block statement surrounding arrow body." }
            ]
        },
        {
            code: "var foo = () => {\nreturn 0;\n};",
            output: "var foo = () => \n 0\n;",
            parserOptions: { ecmaVersion: 6 },
            options: ["never"],
            errors: [
                { line: 1, column: 17, type: "ArrowFunctionExpression", message: "Unexpected block statement surrounding arrow body." }
            ]
        },
        {
            code: "var foo = () => { return { bar: 0 }; };",
            output: "var foo = () => ({ bar: 0 });",
            parserOptions: { ecmaVersion: 6 },
            options: ["as-needed"],
            errors: [
                { line: 1, column: 17, type: "ArrowFunctionExpression", message: "Unexpected block statement surrounding arrow body." }
            ]
        },
        {
            code: "var foo = () => { return; };",
            output: "var foo = () => { return; };", // not fixed
            parserOptions: { ecmaVersion: 6 },
            options: ["as-needed", {requireReturnForObjectLiteral: true}],
            errors: [
                { line: 1, column: 17, type: "ArrowFunctionExpression", message: "Unexpected block statement surrounding arrow body." }
            ]
        },
        {
            code: "var foo = () => { return ( /* a */ {ok: true} /* b */ ) };",
            output: "var foo = () => ( /* a */ {ok: true} /* b */ );",
            parserOptions: { ecmaVersion: 6 },
            options: ["as-needed"],
            errors: [
                { line: 1, column: 17, type: "ArrowFunctionExpression", message: "Unexpected block statement surrounding arrow body." }
            ]
        },
        {
            code: "var foo = () => { return '{' };",
            output: "var foo = () => '{';",
            parserOptions: { ecmaVersion: 6 },
            options: ["as-needed"],
            errors: [
                { line: 1, column: 17, type: "ArrowFunctionExpression", message: "Unexpected block statement surrounding arrow body." }
            ]
        },
        {
            code: "var foo = () => { return { bar: 0 }.bar; };",
            output: "var foo = () => ({ bar: 0 }.bar);",
            parserOptions: { ecmaVersion: 6 },
            options: ["as-needed"],
            errors: [
                { line: 1, column: 17, type: "ArrowFunctionExpression", message: "Unexpected block statement surrounding arrow body." }
            ]
        },
        {
            code: "var foo = (retv, name) => {\nretv[name] = true;\nreturn retv;\n};",
            output: "var foo = (retv, name) => {\nretv[name] = true;\nreturn retv;\n};", // not fixed
            parserOptions: { ecmaVersion: 6 },
            options: ["never"],
            errors: [
                { line: 1, column: 27, type: "ArrowFunctionExpression", message: "Unexpected block statement surrounding arrow body." }
            ]
        },
        {
            code: "var foo = () => { return 0; };",
            output: "var foo = () => 0;",
            parserOptions: { ecmaVersion: 6 },
            options: ["as-needed", {requireReturnForObjectLiteral: true }],
            errors: [
                { line: 1, column: 17, type: "ArrowFunctionExpression", message: "Unexpected block statement surrounding arrow body." }
            ]
        },
        {
            code: "var foo = () => { return bar(); };",
            output: "var foo = () => bar();",
            parserOptions: { ecmaVersion: 6 },
            options: ["as-needed", {requireReturnForObjectLiteral: true }],
            errors: [
                { line: 1, column: 17, type: "ArrowFunctionExpression", message: "Unexpected block statement surrounding arrow body." }
            ]
        },
        {
            code: "var foo = () => ({});",
            output: "var foo = () => {return ({})};",
            parserOptions: { ecmaVersion: 6 },
            options: ["as-needed", {requireReturnForObjectLiteral: true }],
            errors: [
                { line: 1, column: 18, type: "ArrowFunctionExpression", message: "Expected block statement surrounding arrow body." }
            ]
        },
        {
            code: "var foo = () => ({ bar: 0 });",
            output: "var foo = () => {return ({ bar: 0 })};",
            parserOptions: { ecmaVersion: 6 },
            options: ["as-needed", {requireReturnForObjectLiteral: true }],
            errors: [
                { line: 1, column: 18, type: "ArrowFunctionExpression", message: "Expected block statement surrounding arrow body." }
            ]
        },
        {
            code: "var foo = () => (((((((5)))))));",
            output: "var foo = () => {return (((((((5)))))))};",
            parserOptions: { ecmaVersion: 6 },
            options: ["always"],
            errors: [
                { line: 1, column: 24, type: "ArrowFunctionExpression", message: "Expected block statement surrounding arrow body." }
            ]
        },
        {

            // Not fixed; fixing would cause ASI issues.
            code:
            "var foo = () => { return bar }\n" +
            "[1, 2, 3].map(foo)",
            output:
            "var foo = () => { return bar }\n" +
            "[1, 2, 3].map(foo)",
            parserOptions: { ecmaVersion: 6 },
            options: ["never"],
            errors: [
                { line: 1, column: 17, type: "ArrowFunctionExpression", message: "Unexpected block statement surrounding arrow body." }
            ]
        },
        {

            // Not fixed; fixing would cause ASI issues.
            code:
            "var foo = () => { return bar }\n" +
            "(1).toString();",
            output:
            "var foo = () => { return bar }\n" +
            "(1).toString();",
            parserOptions: { ecmaVersion: 6 },
            options: ["never"],
            errors: [
                { line: 1, column: 17, type: "ArrowFunctionExpression", message: "Unexpected block statement surrounding arrow body." }
            ]
        },
        {

            // Fixing here is ok because the arrow function has a semicolon afterwards.
            code:
            "var foo = () => { return bar };\n" +
            "[1, 2, 3].map(foo)",
            output:
            "var foo = () => bar;\n" +
            "[1, 2, 3].map(foo)",
            parserOptions: { ecmaVersion: 6 },
            options: ["never"],
            errors: [
                { line: 1, column: 17, type: "ArrowFunctionExpression", message: "Unexpected block statement surrounding arrow body." }
            ]
        },
        {
            code: "var foo = /* a */ ( /* b */ ) /* c */ => /* d */ { /* e */ return /* f */ 5 /* g */ ; /* h */ } /* i */ ;",
            output: "var foo = /* a */ ( /* b */ ) /* c */ => /* d */  /* e */  /* f */ 5 /* g */  /* h */  /* i */ ;",
            parserOptions: { ecmaVersion: 6 },
            options: ["as-needed"],
            errors: [
                { line: 1, column: 50, type: "ArrowFunctionExpression", message: "Unexpected block statement surrounding arrow body." }
            ]
        },
        {
            code: "var foo = /* a */ ( /* b */ ) /* c */ => /* d */ ( /* e */ 5 /* f */ ) /* g */ ;",
            output: "var foo = /* a */ ( /* b */ ) /* c */ => /* d */ {return ( /* e */ 5 /* f */ )} /* g */ ;",
            parserOptions: { ecmaVersion: 6 },
            options: ["always"],
            errors: [
                { line: 1, column: 60, type: "ArrowFunctionExpression", message: "Expected block statement surrounding arrow body." }
            ]
        }
    ]
});
