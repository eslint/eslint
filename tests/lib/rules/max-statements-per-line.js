/**
 * @fileoverview Tests for max-statements-per-line rule.
 * @author Kenneth Williams
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/max-statements-per-line"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("max-statements-per-line", rule, {
    valid: [
        { code: "{ }", options: [{ max: 1 }] },
        "var bar = 1;",
        { code: "var bar = 1;", options: [{ max: 1 }] },
        "var bar = 1;;",
        ";(function foo() {\n})()",
        { code: "if (condition) var bar = 1;", options: [{ max: 1 }] },
        { code: "if (condition) { }", options: [{ max: 1 }] },
        { code: "if (condition) { } else { }", options: [{ max: 1 }] },
        { code: "if (condition) {\nvar bar = 1;\n} else {\nvar bar = 1;\n}", options: [{ max: 1 }] },
        { code: "for (var i = 0; i < length; ++i) { }", options: [{ max: 1 }] },
        { code: "for (var i = 0; i < length; ++i) {\nvar bar  = 1;\n}", options: [{ max: 1 }] },
        { code: "switch (discriminant) { default: }", options: [{ max: 1 }] },
        { code: "switch (discriminant) {\ndefault: break;\n}", options: [{ max: 1 }] },
        { code: "function foo() { }", options: [{ max: 1 }] },
        { code: "function foo() {\nif (condition) var bar = 1;\n}", options: [{ max: 1 }] },
        { code: "function foo() {\nif (condition) {\nvar bar = 1;\n}\n}", options: [{ max: 1 }] },
        { code: "(function() { })();", options: [{ max: 1 }] },
        { code: "(function() {\nvar bar = 1;\n})();", options: [{ max: 1 }] },
        { code: "var foo = function foo() { };", options: [{ max: 1 }] },
        { code: "var foo = function foo() {\nvar bar = 1;\n};", options: [{ max: 1 }] },
        { code: "var foo = { prop: () => { } };", options: [{ max: 1 }], parserOptions: { ecmaVersion: 6 } },
        { code: "var bar = 1; var baz = 2;", options: [{ max: 2 }] },
        { code: "if (condition) { var bar = 1; }", options: [{ max: 2 }] },
        { code: "if (condition) {\nvar bar = 1; var baz = 2;\n} else {\nvar bar = 1; var baz = 2;\n}", options: [{ max: 2 }] },
        { code: "for (var i = 0; i < length; ++i) { var bar = 1; }", options: [{ max: 2 }] },
        { code: "for (var i = 0; i < length; ++i) {\nvar bar = 1; var baz = 2;\n}", options: [{ max: 2 }] },
        { code: "switch (discriminant) { default: break; }", options: [{ max: 2 }] },
        { code: "switch (discriminant) {\ncase 'test': var bar = 1; break;\ndefault: var bar = 1; break;\n}", options: [{ max: 2 }] },
        { code: "function foo() { var bar = 1; }", options: [{ max: 2 }] },
        { code: "function foo() {\nvar bar = 1; var baz = 2;\n}", options: [{ max: 2 }] },
        { code: "function foo() {\nif (condition) { var bar = 1; }\n}", options: [{ max: 2 }] },
        { code: "function foo() {\nif (condition) {\nvar bar = 1; var baz = 2;\n}\n}", options: [{ max: 2 }] },
        { code: "(function() { var bar = 1; })();", options: [{ max: 2 }] },
        { code: "(function() {\nvar bar = 1; var baz = 2;\n})();", options: [{ max: 2 }] },
        { code: "var foo = function foo() { var bar = 1; };", options: [{ max: 2 }] },
        { code: "var foo = function foo() {\nvar bar = 1; var baz = 2;\n};", options: [{ max: 2 }] },
        { code: "var foo = { prop: () => { var bar = 1; } };", options: [{ max: 2 }], parserOptions: { ecmaVersion: 6 } },
        { code: "var bar = 1; var baz = 2; var qux = 3;", options: [{ max: 3 }] },
        { code: "if (condition) { var bar = 1; var baz = 2; }", options: [{ max: 3 }] },
        { code: "if (condition) { var bar = 1; } else { var bar = 1; }", options: [{ max: 3 }] },
        { code: "switch (discriminant) { case 'test1': ; case 'test2': ; }", options: [{ max: 3 }] },
        { code: "let bar = bar => { a; }, baz = baz => { b; };", options: [{ max: 3 }], parserOptions: { ecmaVersion: 6 } },
        { code: "function foo({[bar => { a; }]: baz = qux => { b; }}) { }", options: [{ max: 3 }], parserOptions: { ecmaVersion: 6 } },
        { code: "bar => { a; }, baz => { b; }, qux => { c; };", options: [{ max: 4 }], parserOptions: { ecmaVersion: 6 } },
        { code: "[bar => { a; }, baz => { b; }, qux => { c; }];", options: [{ max: 4 }], parserOptions: { ecmaVersion: 6 } },
        { code: "foo(bar => { a; }, baz => { c; }, qux => { c; });", options: [{ max: 4 }], parserOptions: { ecmaVersion: 6 } },
        { code: "({ bar: bar => { a; }, baz: baz => { c; }, qux: qux => { ; }});", options: [{ max: 4 }], parserOptions: { ecmaVersion: 6 } },
        { code: "(bar => { a; }) ? (baz => { b; }) : (qux => { c; });", options: [{ max: 4 }], parserOptions: { ecmaVersion: 6 } },
        {
            code: [
                "const name = 'ESLint'",
                "",
                ";(function foo() {",
                "})()"
            ].join("\n"),
            options: [{ max: 1 }],
            parserOptions: { ecmaVersion: 6 }
        },
        [
            "if (foo > 1)",
            "    foo--;",
            "else",
            "    foo++;"
        ].join("\n"),
        {
            code: "export default foo = 0;",
            options: [{ max: 1 }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: [
                "export default function foo() {",
                "   console.log('test');",
                "}"
            ].join("\n"),
            options: [{ max: 1 }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "export let foo = 0;",
            options: [{ max: 1 }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: [
                "export function foo() {",
                "   console.log('test');",
                "}"
            ].join("\n"),
            options: [{ max: 1 }],
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
        }
    ],
    invalid: [
        { code: "var foo; var bar;", options: [{ max: 1 }], errors: [{ messageId: "exceed" }] },
        { code: "var bar = 1; var foo = 3;", options: [{ max: 1 }], errors: [{ messageId: "exceed" }] },
        { code: "var bar = 1; var baz = 2;", errors: [{ messageId: "exceed" }] },
        { code: "var bar = 1; var baz = 2;", options: [{ max: 1 }], errors: [{ messageId: "exceed" }] },
        { code: "if (condition) var bar = 1; if (condition) var baz = 2;", options: [{ max: 1 }], errors: [{ messageId: "exceed" }] },
        { code: "if (condition) var bar = 1; else var baz = 1;", options: [{ max: 1 }], errors: [{ messageId: "exceed" }] },
        { code: "if (condition) { } if (condition) { }", options: [{ max: 1 }], errors: [{ messageId: "exceed" }] },
        { code: "if (condition) { var bar = 1; } else { }", options: [{ max: 1 }], errors: [{ messageId: "exceed" }] },
        { code: "if (condition) { } else { var bar = 1; }", options: [{ max: 1 }], errors: [{ messageId: "exceed" }] },
        { code: "if (condition) { var bar = 1; } else { var bar = 1; }", options: [{ max: 1 }], errors: [{ messageId: "exceed" }] },
        { code: "for (var i = 0; i < length; ++i) { var bar = 1; }", options: [{ max: 1 }], errors: [{ messageId: "exceed" }] },
        { code: "switch (discriminant) { default: break; }", options: [{ max: 1 }], errors: [{ messageId: "exceed" }] },
        { code: "function foo() { var bar = 1; }", options: [{ max: 1 }], errors: [{ messageId: "exceed" }] },
        { code: "function foo() { if (condition) var bar = 1; }", options: [{ max: 1 }], errors: [{ messageId: "exceed" }] },
        { code: "function foo() { if (condition) { var bar = 1; } }", options: [{ max: 1 }], errors: [{ messageId: "exceed" }] },
        { code: "(function() { var bar = 1; })();", options: [{ max: 1 }], errors: [{ messageId: "exceed" }] },
        { code: "var foo = function foo() { var bar = 1; };", options: [{ max: 1 }], errors: [{ messageId: "exceed" }] },
        { code: "var foo = { prop: () => { var bar = 1; } };", options: [{ max: 1 }], parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "exceed" }] },
        { code: "var bar = 1; var baz = 2; var qux = 3;", options: [{ max: 2 }], errors: [{ messageId: "exceed", data: { numberOfStatementsOnThisLine: 3, statements: "statements", maxStatementsPerLine: 2.0 } }] },
        { code: "if (condition) { var bar = 1; var baz = 2; }", options: [{ max: 2 }], errors: [{ messageId: "exceed", data: { numberOfStatementsOnThisLine: 3, statements: "statements", maxStatementsPerLine: 2.0 } }] },
        { code: "if (condition) { var bar = 1; } else { var bar = 1; }", options: [{ max: 2 }], errors: [{ messageId: "exceed", data: { numberOfStatementsOnThisLine: 3, statements: "statements", maxStatementsPerLine: 2.0 } }] },
        { code: "if (condition) { var bar = 1; var baz = 2; } else { var bar = 1; var baz = 2; }", options: [{ max: 2 }], errors: [{ messageId: "exceed", data: { numberOfStatementsOnThisLine: 5, statements: "statements", maxStatementsPerLine: 2.0 } }] },
        { code: "for (var i = 0; i < length; ++i) { var bar = 1; var baz = 2; }", options: [{ max: 2 }], errors: [{ messageId: "exceed", data: { numberOfStatementsOnThisLine: 3, statements: "statements", maxStatementsPerLine: 2.0 } }] },
        { code: "switch (discriminant) { case 'test': break; default: break; }", options: [{ max: 2 }], errors: [{ messageId: "exceed", data: { numberOfStatementsOnThisLine: 3, statements: "statements", maxStatementsPerLine: 2.0 } }] },
        { code: "function foo() { var bar = 1; var baz = 2; }", options: [{ max: 2 }], errors: [{ messageId: "exceed", data: { numberOfStatementsOnThisLine: 3, statements: "statements", maxStatementsPerLine: 2.0 } }] },
        { code: "function foo() { if (condition) { var bar = 1; } }", options: [{ max: 2 }], errors: [{ messageId: "exceed", data: { numberOfStatementsOnThisLine: 3, statements: "statements", maxStatementsPerLine: 2.0 } }] },
        { code: "(function() { var bar = 1; var baz = 2; })();", options: [{ max: 2 }], errors: [{ messageId: "exceed", data: { numberOfStatementsOnThisLine: 3, statements: "statements", maxStatementsPerLine: 2.0 } }] },
        { code: "var foo = function foo() { var bar = 1; var baz = 2; };", options: [{ max: 2 }], errors: [{ messageId: "exceed", data: { numberOfStatementsOnThisLine: 3, statements: "statements", maxStatementsPerLine: 2.0 } }] },
        { code: "var foo = { prop: () => { var bar = 1; var baz = 2; } };", options: [{ max: 2 }], parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "exceed", data: { numberOfStatementsOnThisLine: 3, statements: "statements", maxStatementsPerLine: 2.0 } }] },
        { code: "var bar = 1; var baz = 2; var qux = 3; var waldo = 4;", options: [{ max: 3 }], errors: [{ messageId: "exceed", data: { numberOfStatementsOnThisLine: 4, statements: "statements", maxStatementsPerLine: 3.0 } }] },
        { code: "if (condition) { var bar = 1; var baz = 2; var qux = 3; }", options: [{ max: 3 }], errors: [{ messageId: "exceed", data: { numberOfStatementsOnThisLine: 4, statements: "statements", maxStatementsPerLine: 3.0 } }] },
        { code: "if (condition) { var bar = 1; var baz = 2; } else { var bar = 1; var baz = 2; }", options: [{ max: 3 }], errors: [{ messageId: "exceed", data: { numberOfStatementsOnThisLine: 5, statements: "statements", maxStatementsPerLine: 3.0 } }] },
        { code: "switch (discriminant) { case 'test': var bar = 1; break; default: var bar = 1; break; }", options: [{ max: 3 }], errors: [{ messageId: "exceed", data: { numberOfStatementsOnThisLine: 5, statements: "statements", maxStatementsPerLine: 3.0 } }] },
        { code: "let bar = bar => { a; }, baz = baz => { b; }, qux = qux => { c; };", options: [{ max: 3 }], parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "exceed", data: { numberOfStatementsOnThisLine: 4, statements: "statements", maxStatementsPerLine: 3.0 } }] },
        { code: "(bar => { a; }) ? (baz => { b; }) : (qux => { c; });", options: [{ max: 3 }], parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "exceed", data: { numberOfStatementsOnThisLine: 4, statements: "statements", maxStatementsPerLine: 3.0 } }] },
        { code: "bar => { a; }, baz => { b; }, qux => { c; }, quux => { d; };", options: [{ max: 4 }], parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "exceed", data: { numberOfStatementsOnThisLine: 5, statements: "statements", maxStatementsPerLine: 4.0 } }] },
        { code: "[bar => { a; }, baz => { b; }, qux => { c; }, quux => { d; }];", options: [{ max: 4 }], parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "exceed", data: { numberOfStatementsOnThisLine: 5, statements: "statements", maxStatementsPerLine: 4.0 } }] },
        { code: "foo(bar => { a; }, baz => { b; }, qux => { c; }, quux => { d; });", options: [{ max: 4 }], parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "exceed", data: { numberOfStatementsOnThisLine: 5, statements: "statements", maxStatementsPerLine: 4.0 } }] },
        { code: "({ bar: bar => { a; }, baz: baz => { b; }, qux: qux => { c; }, quux: quux => { d; }});", options: [{ max: 4 }], parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "exceed", data: { numberOfStatementsOnThisLine: 5, statements: "statements", maxStatementsPerLine: 4.0 } }] },
        { code: "a; if (b) { c; d; }\nz;", options: [{ max: 2 }], errors: [{ messageId: "exceed", data: { numberOfStatementsOnThisLine: 4, statements: "statements", maxStatementsPerLine: 2.0 } }] },
        { code: "export default function foo() { console.log('test') }", options: [{ max: 1 }], parserOptions: { ecmaVersion: 6, sourceType: "module" }, errors: [{ messageId: "exceed" }] },
        { code: "export function foo() { console.log('test') }", options: [{ max: 1 }], parserOptions: { ecmaVersion: 6, sourceType: "module" }, errors: [{ messageId: "exceed" }] }
    ]
});
