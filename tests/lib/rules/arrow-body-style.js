/**
 * @fileoverview Tests for arrow-body-style
 * @author Alberto Rodríguez
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/arrow-body-style"),
    { RuleTester } = require("../../../lib/rule-tester");

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
            code: "for (var foo = () => { return a in b ? bar : () => {} } ;;);",
            output: "for (var foo = () => (a in b ? bar : () => {}) ;;);",
            options: ["as-needed"],
            errors: [
                {
                    line: 1,
                    column: 22,
                    messageId: "unexpectedSingleBlock"
                }
            ]
        },
        {
            code: "a in b; for (var f = () => { return c };;);",
            output: "a in b; for (var f = () => c;;);",
            options: ["as-needed"],
            errors: [
                {
                    line: 1,
                    column: 28,
                    messageId: "unexpectedSingleBlock"
                }
            ]
        },
        {
            code: "for (a = b => { return c in d ? e : f } ;;);",
            output: "for (a = b => (c in d ? e : f) ;;);",
            options: ["as-needed"],
            errors: [
                {
                    line: 1,
                    column: 15,
                    messageId: "unexpectedSingleBlock"
                }
            ]
        },
        {
            code: "for (var f = () => { return a };;);",
            output: "for (var f = () => a;;);",
            options: ["as-needed"],
            errors: [
                {
                    line: 1,
                    column: 20,
                    messageId: "unexpectedSingleBlock"
                }
            ]
        },
        {
            code: "for (var f;f = () => { return a };);",
            output: "for (var f;f = () => a;);",
            options: ["as-needed"],
            errors: [
                {
                    line: 1,
                    column: 22,
                    messageId: "unexpectedSingleBlock"
                }
            ]
        },
        {
            code: "for (var f = () => { return a in c };;);",
            output: "for (var f = () => (a in c);;);",
            options: ["as-needed"],
            errors: [
                {
                    line: 1,
                    column: 20,
                    messageId: "unexpectedSingleBlock"
                }
            ]
        },
        {
            code: "for (var f;f = () => { return a in c };);",
            output: "for (var f;f = () => a in c;);",
            options: ["as-needed"],
            errors: [
                {
                    line: 1,
                    column: 22,
                    messageId: "unexpectedSingleBlock"
                }
            ]
        },
        {
            code: "for (;;){var f = () => { return a in c }}",
            output: "for (;;){var f = () => a in c}",
            options: ["as-needed"],
            errors: [
                {
                    line: 1,
                    column: 24,
                    messageId: "unexpectedSingleBlock"
                }
            ]
        },
        {
            code: "for (a = b => { return c = d in e } ;;);",
            output: "for (a = b => (c = d in e) ;;);",
            options: ["as-needed"],
            errors: [
                {
                    line: 1,
                    column: 15,
                    messageId: "unexpectedSingleBlock"
                }
            ]
        },
        {
            code: "for (var a;;a = b => { return c = d in e } );",
            output: "for (var a;;a = b => c = d in e );",
            options: ["as-needed"],
            errors: [
                {
                    line: 1,
                    column: 22,
                    messageId: "unexpectedSingleBlock"
                }
            ]
        },
        {
            code: "for (let a = (b, c, d) => { return vb && c in d; }; ;);",
            output: "for (let a = (b, c, d) => (vb && c in d); ;);",
            errors: [
                {
                    line: 1,
                    column: 27,
                    messageId: "unexpectedSingleBlock"
                }
            ]
        },
        {
            code: "for (let a = (b, c, d) => { return v in b && c in d; }; ;);",
            output: "for (let a = (b, c, d) => (v in b && c in d); ;);",
            errors: [
                {
                    line: 1,
                    column: 27,
                    messageId: "unexpectedSingleBlock"
                }
            ]
        },
        {
            code: "function foo(){ for (let a = (b, c, d) => { return v in b && c in d; }; ;); }",
            output: "function foo(){ for (let a = (b, c, d) => (v in b && c in d); ;); }",
            errors: [
                {
                    line: 1,
                    column: 43,
                    messageId: "unexpectedSingleBlock"
                }
            ]
        },
        {
            code: "for ( a = (b, c, d) => { return v in b && c in d; }; ;);",
            output: "for ( a = (b, c, d) => (v in b && c in d); ;);",
            errors: [
                {
                    line: 1,
                    column: 24,
                    messageId: "unexpectedSingleBlock"
                }
            ]
        },
        {
            code: "for ( a = (b) => { return (c in d) }; ;);",
            output: "for ( a = (b) => (c in d); ;);",
            errors: [
                {
                    line: 1,
                    column: 18,
                    messageId: "unexpectedSingleBlock"
                }
            ]
        },
        {
            code: "for (let a = (b, c, d) => { return vb in dd ; }; ;);",
            output: "for (let a = (b, c, d) => (vb in dd ); ;);",
            errors: [
                {
                    line: 1,
                    column: 27,
                    messageId: "unexpectedSingleBlock"
                }
            ]
        },
        {
            code: "for (let a = (b, c, d) => { return vb in c in dd ; }; ;);",
            output: "for (let a = (b, c, d) => (vb in c in dd ); ;);",
            errors: [
                {
                    line: 1,
                    column: 27,
                    messageId: "unexpectedSingleBlock"
                }
            ]
        },
        {
            code: "do{let a = () => {return f in ff}}while(true){}",
            output: "do{let a = () => f in ff}while(true){}",
            errors: [{
                line: 1,
                column: 18,
                messageId: "unexpectedSingleBlock"
            }]
        },
        {
            code: "do{for (let a = (b, c, d) => { return vb in c in dd ; }; ;);}while(true){}",
            output: "do{for (let a = (b, c, d) => (vb in c in dd ); ;);}while(true){}",
            errors: [{
                line: 1,
                column: 30,
                messageId: "unexpectedSingleBlock"
            }]
        },
        {
            code: "scores.map(score => { return x in +(score / maxScore).toFixed(2)});",
            output: "scores.map(score => x in +(score / maxScore).toFixed(2));",
            errors: [{
                line: 1,
                column: 21,
                messageId: "unexpectedSingleBlock"
            }]
        },
        {
            code: "const fn = (a, b) => { return a + x in Number(b) };",
            output: "const fn = (a, b) => a + x in Number(b);",
            errors: [{
                line: 1,
                column: 22,
                messageId: "unexpectedSingleBlock"
            }]
        },
        {
            code: "var foo = () => 0",
            output: "var foo = () => {return 0}",
            options: ["always"],
            errors: [
                {
                    line: 1,
                    column: 17,
                    endLine: 1,
                    endColumn: 18,
                    type: "ArrowFunctionExpression",
                    messageId: "expectedBlock"
                }
            ]
        },
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
            code: "var foo = () => (  {});",
            output: "var foo = () => {return   {}};",
            options: ["always"],
            errors: [
                {
                    line: 1,
                    column: 20,
                    type: "ArrowFunctionExpression",
                    messageId: "expectedBlock"
                }
            ]
        },
        {
            code: "(() => ({}))",
            output: "(() => {return {}})",
            options: ["always"],
            errors: [
                {
                    line: 1,
                    column: 9,
                    type: "ArrowFunctionExpression",
                    messageId: "expectedBlock"
                }
            ]
        },
        {
            code: "(() => ( {}))",
            output: "(() => {return  {}})",
            options: ["always"],
            errors: [
                {
                    line: 1,
                    column: 10,
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
            code: "var foo = () => { return a, b }",
            output: "var foo = () => (a, b)",
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
                    endLine: 3,
                    endColumn: 2,
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
                    endLine: 2,
                    endColumn: 13,
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
                    endLine: 2,
                    endColumn: 2,
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
                    endLine: 7,
                    endColumn: 16,
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
        },
        {
            code: "var foo = () => ( {foo: 1} ).foo();",
            output: "var foo = () => {return  {foo: 1} .foo()};",
            options: ["always"],
            errors: [{ messageId: "expectedBlock" }]
        },
        {
            code: `
              var foo = () => ({
                  bar: 1,
                  baz: 2
                });
            `,
            output: `
              var foo = () => {return {
                  bar: 1,
                  baz: 2
                }};
            `,
            options: ["always"],
            errors: [{ messageId: "expectedBlock" }]
        },
        {
            code: `
              parsedYears = _map(years, (year) => (
                  {
                      index : year,
                      title : splitYear(year)
                  }
              ));
            `,
            output: `
              parsedYears = _map(years, (year) => {
                  return {
                      index : year,
                      title : splitYear(year)
                  }
              });
            `,
            options: ["always"],
            errors: [{ messageId: "expectedBlock" }]
        },

        // https://github.com/eslint/eslint/issues/14633
        {
            code: "const createMarker = (color) => ({ latitude, longitude }, index) => {};",
            output: "const createMarker = (color) => {return ({ latitude, longitude }, index) => {}};",
            options: ["always"],
            errors: [{ messageId: "expectedBlock" }]
        }
    ]
});
