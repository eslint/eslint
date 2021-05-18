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

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

ruleTester.run("arrow-body-style", rule, {
    valid: [
        "var foo = () => {};",
        "var foo = () => 0;",
        "var addToB = (a) => { b =  b + a };",
        "var foo = () => { /* do nothing */ };",
        "var foo = () => {\n /* do nothing */ \n};",
        "var foo = (retv, name) => {\nretv[name] = true;\nreturn retv;\n};",
        "var foo = () => ({});",
        "var foo = () => bar();",
        "var foo = () => { bar(); };",
        "var foo = () => { b = a };",
        "var foo = () => { bar: 1 };",
        { code: "var foo = () => { return 0; };", options: ["always"] },
        { code: "var foo = () => { return bar(); };", options: ["always"] },
        { code: "var foo = () => 0;", options: ["never"] },
        { code: "var foo = () => ({ foo: 0 });", options: ["never"] },
        { code: "var foo = () => {};", options: ["as-needed", { requireReturnForObjectLiteral: true }] },
        { code: "var foo = () => 0;", options: ["as-needed", { requireReturnForObjectLiteral: true }] },
        { code: "var addToB = (a) => { b =  b + a };", options: ["as-needed", { requireReturnForObjectLiteral: true }] },
        { code: "var foo = () => { /* do nothing */ };", options: ["as-needed", { requireReturnForObjectLiteral: true }] },
        { code: "var foo = () => {\n /* do nothing */ \n};", options: ["as-needed", { requireReturnForObjectLiteral: true }] },
        { code: "var foo = (retv, name) => {\nretv[name] = true;\nreturn retv;\n};", options: ["as-needed", { requireReturnForObjectLiteral: true }] },
        { code: "var foo = () => bar();", options: ["as-needed", { requireReturnForObjectLiteral: true }] },
        { code: "var foo = () => { bar(); };", options: ["as-needed", { requireReturnForObjectLiteral: true }] },
        { code: "var foo = () => { return { bar: 0 }; };", options: ["as-needed", { requireReturnForObjectLiteral: true }] }
    ],
    invalid: [
        {
            code: "var foo = () => 0;",
            output: "var foo = () => {return 0};",
            options: ["always"],
            errors: [
                {
                    line: 1,
                    column: 17,
                    type: "ArrowFunctionExpression",
                    messageId: "expectedBlock"
                }
            ]
        },
        {
            code: "var foo = () => ({});",
            output: "var foo = () => {return {}};",
            options: ["always"],
            errors: [
                {
                    line: 1,
                    column: 18,
                    type: "ArrowFunctionExpression",
                    messageId: "expectedBlock"
                }
            ]
        },
        {
            code: "var foo = () => { return 0; };",
            output: "var foo = () => 0;",
            options: ["as-needed"],
            errors: [
                {
                    line: 1,
                    column: 17,
                    type: "ArrowFunctionExpression",
                    messageId: "unexpectedSingleBlock"
                }
            ]
        },
        {
            code: "var foo = () => { return 0 };",
            output: "var foo = () => 0;",
            options: ["as-needed"],
            errors: [
                {
                    line: 1,
                    column: 17,
                    type: "ArrowFunctionExpression",
                    messageId: "unexpectedSingleBlock"
                }
            ]
        },
        {
            code: "var foo = () => { return bar(); };",
            output: "var foo = () => bar();",
            options: ["as-needed"],
            errors: [
                {
                    line: 1,
                    column: 17,
                    type: "ArrowFunctionExpression",
                    messageId: "unexpectedSingleBlock"
                }
            ]
        },
        {
            code: "var foo = () => {};",
            output: null,
            options: ["never"],
            errors: [
                {
                    line: 1,
                    column: 17,
                    type: "ArrowFunctionExpression",
                    messageId: "unexpectedEmptyBlock"
                }
            ]
        },
        {
            code: "var foo = () => {\nreturn 0;\n};",
            output: "var foo = () => 0;",
            options: ["never"],
            errors: [
                {
                    line: 1,
                    column: 17,
                    type: "ArrowFunctionExpression",
                    messageId: "unexpectedSingleBlock"
                }
            ]
        },
        {
            code: "var foo = () => { return { bar: 0 }; };",
            output: "var foo = () => ({ bar: 0 });",
            options: ["as-needed"],
            errors: [
                {
                    line: 1,
                    column: 17,
                    type: "ArrowFunctionExpression",
                    messageId: "unexpectedObjectBlock"
                }
            ]
        },
        {
            code: "var foo = () => { return ({ bar: 0 }); };",
            output: "var foo = () => ({ bar: 0 });",
            options: ["as-needed"],
            errors: [
                {
                    line: 1,
                    column: 17,
                    type: "ArrowFunctionExpression",
                    messageId: "unexpectedSingleBlock"
                }
            ]
        },
        {
            code: "var foo = () => { return };",
            output: null, // not fixed
            options: ["as-needed", { requireReturnForObjectLiteral: true }],
            errors: [
                {
                    line: 1,
                    column: 17,
                    type: "ArrowFunctionExpression",
                    messageId: "unexpectedSingleBlock"
                }
            ]
        },
        {
            code: "var foo = () => { return; };",
            output: null, // not fixed
            options: ["as-needed", { requireReturnForObjectLiteral: true }],
            errors: [
                {
                    line: 1,
                    column: 17,
                    type: "ArrowFunctionExpression",
                    messageId: "unexpectedSingleBlock"
                }
            ]
        },
        {
            code: "var foo = () => { return ( /* a */ {ok: true} /* b */ ) };",
            output: "var foo = () => ( /* a */ {ok: true} /* b */ );",
            options: ["as-needed"],
            errors: [
                {
                    line: 1,
                    column: 17,
                    type: "ArrowFunctionExpression",
                    messageId: "unexpectedSingleBlock"
                }
            ]
        },
        {
            code: "var foo = () => { return '{' };",
            output: "var foo = () => '{';",
            options: ["as-needed"],
            errors: [
                {
                    line: 1,
                    column: 17,
                    type: "ArrowFunctionExpression",
                    messageId: "unexpectedSingleBlock"
                }
            ]
        },
        {
            code: "var foo = () => { return { bar: 0 }.bar; };",
            output: "var foo = () => ({ bar: 0 }.bar);",
            options: ["as-needed"],
            errors: [
                {
                    line: 1,
                    column: 17,
                    type: "ArrowFunctionExpression",
                    messageId: "unexpectedObjectBlock"
                }
            ]
        },
        {
            code: "var foo = (retv, name) => {\nretv[name] = true;\nreturn retv;\n};",
            output: null, // not fixed
            options: ["never"],
            errors: [
                { line: 1, column: 27, type: "ArrowFunctionExpression", messageId: "unexpectedOtherBlock" }
            ]
        },
        {
            code: "var foo = () => { return 0; };",
            output: "var foo = () => 0;",
            options: ["as-needed", { requireReturnForObjectLiteral: true }],
            errors: [
                {
                    line: 1,
                    column: 17,
                    type: "ArrowFunctionExpression",
                    messageId: "unexpectedSingleBlock"
                }
            ]
        },
        {
            code: "var foo = () => { return bar(); };",
            output: "var foo = () => bar();",
            options: ["as-needed", { requireReturnForObjectLiteral: true }],
            errors: [
                {
                    line: 1,
                    column: 17,
                    type: "ArrowFunctionExpression",
                    messageId: "unexpectedSingleBlock"
                }
            ]
        },
        {
            code: "var foo = () => ({});",
            output: "var foo = () => {return {}};",
            options: ["as-needed", { requireReturnForObjectLiteral: true }],
            errors: [
                {
                    line: 1,
                    column: 18,
                    type: "ArrowFunctionExpression",
                    messageId: "expectedBlock"
                }
            ]
        },
        {
            code: "var foo = () => ({ bar: 0 });",
            output: "var foo = () => {return { bar: 0 }};",
            options: ["as-needed", { requireReturnForObjectLiteral: true }],
            errors: [
                {
                    line: 1,
                    column: 18,
                    type: "ArrowFunctionExpression",
                    messageId: "expectedBlock"
                }
            ]
        },
        {
            code: "var foo = () => (((((((5)))))));",
            output: "var foo = () => {return (((((((5)))))))};",
            options: ["always"],
            errors: [
                {
                    line: 1,
                    column: 24,
                    type: "ArrowFunctionExpression",
                    messageId: "expectedBlock"
                }
            ]
        },
        {

            // Not fixed; fixing would cause ASI issues.
            code:
            "var foo = () => { return bar }\n" +
            "[1, 2, 3].map(foo)",
            output: null,
            options: ["never"],
            errors: [
                { line: 1, column: 17, type: "ArrowFunctionExpression", messageId: "unexpectedSingleBlock" }
            ]
        },
        {

            // Not fixed; fixing would cause ASI issues.
            code:
            "var foo = () => { return bar }\n" +
            "(1).toString();",
            output: null,
            options: ["never"],
            errors: [
                { line: 1, column: 17, type: "ArrowFunctionExpression", messageId: "unexpectedSingleBlock" }
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
            options: ["never"],
            errors: [
                {
                    line: 1,
                    column: 17,
                    type: "ArrowFunctionExpression",
                    messageId: "unexpectedSingleBlock"
                }
            ]
        },
        {
            code: "var foo = /* a */ ( /* b */ ) /* c */ => /* d */ { /* e */ return /* f */ 5 /* g */ ; /* h */ } /* i */ ;",
            output: "var foo = /* a */ ( /* b */ ) /* c */ => /* d */  /* e */  /* f */ 5 /* g */  /* h */  /* i */ ;",
            options: ["as-needed"],
            errors: [
                {
                    line: 1,
                    column: 50,
                    type: "ArrowFunctionExpression",
                    messageId: "unexpectedSingleBlock"
                }
            ]
        },
        {
            code: "var foo = /* a */ ( /* b */ ) /* c */ => /* d */ ( /* e */ 5 /* f */ ) /* g */ ;",
            output: "var foo = /* a */ ( /* b */ ) /* c */ => /* d */ {return ( /* e */ 5 /* f */ )} /* g */ ;",
            options: ["always"],
            errors: [
                {
                    line: 1,
                    column: 60,
                    type: "ArrowFunctionExpression",
                    messageId: "expectedBlock"
                }
            ]
        },
        {
            code: "var foo = () => {\nreturn bar;\n};",
            output: "var foo = () => bar;",
            errors: [
                {
                    line: 1,
                    column: 17,
                    type: "ArrowFunctionExpression",
                    messageId: "unexpectedSingleBlock"
                }
            ]
        },
        {
            code: "var foo = () => {\nreturn bar;};",
            output: "var foo = () => bar;",
            errors: [
                {
                    line: 1,
                    column: 17,
                    type: "ArrowFunctionExpression",
                    messageId: "unexpectedSingleBlock"
                }
            ]
        },
        {
            code: "var foo = () => {return bar;\n};",
            output: "var foo = () => bar;",
            errors: [
                {
                    line: 1,
                    column: 17,
                    type: "ArrowFunctionExpression",
                    messageId: "unexpectedSingleBlock"
                }
            ]
        },
        {
            code: `
              var foo = () => {
                return foo
                  .bar;
              };
            `,
            output: `
              var foo = () => foo
                  .bar;
            `,
            errors: [
                {
                    line: 2,
                    column: 31,
                    type: "ArrowFunctionExpression",
                    messageId: "unexpectedSingleBlock"
                }
            ]
        },
        {
            code: `
              var foo = () => {
                return {
                  bar: 1,
                  baz: 2
                };
              };
            `,
            output: `
              var foo = () => ({
                  bar: 1,
                  baz: 2
                });
            `,
            errors: [
                {
                    line: 2,
                    column: 31,
                    type: "ArrowFunctionExpression",
                    messageId: "unexpectedObjectBlock"
                }
            ]
        },
        {
            code: "var foo = () => ({foo: 1}).foo();",
            output: "var foo = () => {return {foo: 1}.foo()};",
            options: ["always"],
            errors: [{ messageId: "expectedBlock" }]
        },
        {
            code: "var foo = () => ({foo: 1}.foo());",
            output: "var foo = () => {return {foo: 1}.foo()};",
            options: ["always"],
            errors: [{ messageId: "expectedBlock" }]
        }
    ]
});
