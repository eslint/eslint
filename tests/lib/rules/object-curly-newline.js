/**
 * @fileoverview Tests for object-curly-newline rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const resolvePath = require("path").resolve,
    rule = require("../../../lib/rules/object-curly-newline"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6, sourceType: "module" } });

ruleTester.run("object-curly-newline", rule, {
    valid: [

        // default ------------------------------------------------------------
        [
            "var a = {",
            "};"
        ].join("\n"),

        [
            "var a = {",
            "   foo",
            "};"
        ].join("\n"),

        "var a = { foo }",

        // "always" ------------------------------------------------------------
        {
            code: [
                "var a = {",
                "};"
            ].join("\n"),
            options: ["always"]
        },
        {
            code: [
                "var b = {",
                "    a: 1",
                "};"
            ].join("\n"),
            options: ["always"]
        },
        {
            code: [
                "var c = {",
                "    a: 1, b: 2",
                "};"
            ].join("\n"),
            options: ["always"]
        },
        {
            code: [
                "var d = {",
                "    a: 1,",
                "    b: 2",
                "};"
            ].join("\n"),
            options: ["always"]
        },
        {
            code: [
                "var e = {",
                "    a: function foo() {",
                "        dosomething();",
                "    }",
                "};"
            ].join("\n"),
            options: ["always"]
        },
        {
            code: [
                "function foo({",
                " a,",
                " b",
                "} : MyType) {}"
            ].join("\n"),
            options: ["always"],
            parser: resolvePath(__dirname, "../../fixtures/parsers/object-curly-newline/flow-stub-parser-multiline")
        },
        {
            code: [
                "function foo({",
                " a,",
                " b",
                "} : { a : string, b : string }) {}"
            ].join("\n"),
            options: ["always"],
            parser: resolvePath(__dirname, "../../fixtures/parsers/object-curly-newline/flow-stub-parser-multiline-type-literal")
        },

        // "never" -------------------------------------------------------------
        {
            code: [
                "var a = {};"
            ].join("\n"),
            options: ["never"]
        },
        {
            code: [
                "var b = {a: 1};"
            ].join("\n"),
            options: ["never"]
        },
        {
            code: [
                "var c = {a: 1, b: 2};"
            ].join("\n"),
            options: ["never"]
        },
        {
            code: [
                "var d = {a: 1,",
                "    b: 2};"
            ].join("\n"),
            options: ["never"]
        },
        {
            code: [
                "var e = {a: function foo() {",
                "    dosomething();",
                "}};"
            ].join("\n"),
            options: ["never"]
        },
        {
            code: "function foo({ a, b } : MyType) {}",
            options: ["never"],
            parser: resolvePath(__dirname, "../../fixtures/parsers/object-curly-newline/flow-stub-parser-singleline")
        },
        {
            code: "function foo({ a, b } : { a : string, b : string }) {}",
            options: ["never"],
            parser: resolvePath(__dirname, "../../fixtures/parsers/object-curly-newline/flow-stub-parser-singleline-type-literal")
        },

        // "multiline" ---------------------------------------------------------
        {
            code: [
                "var a = {};"
            ].join("\n"),
            options: [{ multiline: true }]
        },
        {
            code: [
                "var b = {a: 1};"
            ].join("\n"),
            options: [{ multiline: true }]
        },
        {
            code: [
                "var c = {a: 1, b: 2};"
            ].join("\n"),
            options: [{ multiline: true }]
        },
        {
            code: [
                "var d = {",
                "    a: 1,",
                "    b: 2",
                "};"
            ].join("\n"),
            options: [{ multiline: true }]
        },
        {
            code: [
                "var e = {",
                "    a: function foo() {",
                "        dosomething();",
                "    }",
                "};"
            ].join("\n"),
            options: [{ multiline: true }]
        },
        {
            code: [
                "var obj = {",
                "    // comment",
                "    a: 1",
                "};"
            ].join("\n"),
            options: [{ multiline: true }]
        },
        {
            code: [
                "var obj = { // comment",
                "    a: 1",
                "};"
            ].join("\n"),
            options: [{ multiline: true }]
        },

        // "minProperties" ----------------------------------------------------------
        {
            code: [
                "var a = {};"
            ].join("\n"),
            options: [{ minProperties: 2 }]
        },
        {
            code: [
                "var b = {a: 1};"
            ].join("\n"),
            options: [{ minProperties: 2 }]
        },
        {
            code: [
                "var c = {",
                "    a: 1, b: 2",
                "};"
            ].join("\n"),
            options: [{ minProperties: 2 }]
        },
        {
            code: [
                "var d = {",
                "    a: 1,",
                "    b: 2",
                "};"
            ].join("\n"),
            options: [{ minProperties: 2 }]
        },
        {
            code: [
                "var e = {a: function foo() {",
                "    dosomething();",
                "}};"
            ].join("\n"),
            options: [{ minProperties: 2 }]
        },

        // "multiline" and "minProperties" ------------------------------------------
        {
            code: [
                "var a = {};"
            ].join("\n"),
            options: [{ multiline: true, minProperties: 2 }]
        },
        {
            code: [
                "var b = {a: 1};"
            ].join("\n"),
            options: [{ multiline: true, minProperties: 2 }]
        },
        {
            code: [
                "var c = {",
                "    a: 1, b: 2",
                "};"
            ].join("\n"),
            options: [{ multiline: true, minProperties: 2 }]
        },
        {
            code: [
                "var d = {",
                "    a: 1, ",
                "    b: 2",
                "};"
            ].join("\n"),
            options: [{ multiline: true, minProperties: 2 }]
        },
        {
            code: [
                "var e = {",
                "    a: function foo() {",
                "        dosomething();",
                "    }",
                "};"
            ].join("\n"),
            options: [{ multiline: true, minProperties: 2 }]
        },

        // "consistent" ------------------------------------------
        {
            code: [
                "var b = {",
                "    a: 1",
                "};"
            ].join("\n"),
            options: [{ multiline: true, consistent: true }]
        },
        {
            code: [
                "var c = {a: 1, b: 2};"
            ].join("\n"),
            options: [{ multiline: true, consistent: true }]
        },
        {
            code: [
                "var c = {",
                "    a: 1,",
                "    b: 2",
                "};"
            ].join("\n"),

            options: [{ multiline: true, consistent: true }]
        },
        {
            code: [
                "var e = {a: function() { dosomething();}};"
            ].join("\n"),
            options: [{ multiline: true, consistent: true }]
        },
        {
            code: [
                "var e = {",
                "    a: function() { dosomething();}",
                "};"
            ].join("\n"),
            options: [{ multiline: true, consistent: true }]
        },
        {
            code: [
                "let {} = {a: 1};"
            ].join("\n"),
            options: [{ multiline: true, consistent: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: [
                "let {a} = {a: 1};"
            ].join("\n"),
            options: [{ multiline: true, consistent: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: [
                "let {",
                "} = {a: 1};"
            ].join("\n"),
            options: [{ multiline: true, consistent: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: [
                "let {",
                "    a",
                "} = {a: 1};"
            ].join("\n"),
            options: [{ multiline: true, consistent: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: [
                "let {a, b} = {a: 1, b: 1};"
            ].join("\n"),
            options: [{ multiline: true, consistent: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: [
                "let {",
                "    a, b",
                "} = {a: 1, b: 1};"
            ].join("\n"),
            options: [{ multiline: true, consistent: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: [
                "let {k = function() {dosomething();}} = obj;"
            ].join("\n"),
            options: [{ multiline: true, consistent: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: [
                "let {",
                "    k = function() {",
                "        dosomething();",
                "    }",
                "} = obj;"
            ].join("\n"),
            options: [{ multiline: true, consistent: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: [
                "var c = {a: 1,",
                "b: 2};"
            ].join("\n"),
            options: [{ multiline: false, consistent: true }]
        },
        {
            code: [
                "let {a,",
                "b} = {a: 1, b: 1};"
            ].join("\n"),
            options: [{ multiline: false, consistent: true }],
            parserOptions: { ecmaVersion: 6 }
        },

        // "consistent" and "minProperties" ------------------------------------------
        {
            code: [
                "var c = { a: 1 };"
            ].join("\n"),
            options: [{ multiline: true, consistent: true, minProperties: 2 }]
        },
        {
            code: [
                "var c = {",
                "a: 1",
                "};"
            ].join("\n"),
            options: [{ multiline: true, consistent: true, minProperties: 2 }]
        },
        {
            code: [
                "let {a} = {",
                "a: 1",
                "};"
            ].join("\n"),
            options: [{ multiline: true, consistent: true, minProperties: 2 }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: [
                "let {",
                "a",
                "} = {",
                "a: 1",
                "};"
            ].join("\n"),
            options: [{ multiline: true, consistent: true, minProperties: 2 }],
            parserOptions: { ecmaVersion: 6 }
        },

        // "ObjectExpression" and "ObjectPattern" ---------------------------------------------
        {
            code: [
                "let {a, b} = {",
                "    a: 1, b: 2",
                "};"
            ].join("\n"),
            options: [{ ObjectExpression: "always", ObjectPattern: "never" }],
            parserOptions: { ecmaVersion: 6 }
        },

        // "ImportDeclaration" ---------------------------------------------
        {
            code: [
                "import {",
                "    a,",
                " b",
                "} from 'module';"
            ].join("\n"),
            options: [{ ImportDeclaration: "always" }]
        },
        {
            code: [
                "import {a as a, b} from 'module';"
            ].join("\n"),
            options: [{ ImportDeclaration: "never" }]
        },
        {
            code: [
                "import { a, } from 'module';"
            ].join("\n"),
            options: [{ ImportDeclaration: { multiline: true } }]
        },
        {
            code: [
                "import {",
                "a, ",
                "b",
                "} from 'module';"
            ].join("\n"),
            options: [{ ImportDeclaration: { multiline: true } }]
        },
        {
            code: [
                "import {",
                " a,",
                "} from 'module';"
            ].join("\n"),
            options: [{ ImportDeclaration: { consistent: true } }]
        },
        {
            code: [
                "import { a } from 'module';"
            ].join("\n"),
            options: [{ ImportDeclaration: { consistent: true } }]
        },
        {
            code: [
                "import {",
                "a, b",
                "} from 'module';"
            ].join("\n"),
            options: [{ ImportDeclaration: { minProperties: 2 } }]
        },
        {
            code: [
                "import {a, b} from 'module';"
            ].join("\n"),
            options: [{ ImportDeclaration: { minProperties: 3 } }]
        },
        {
            code: "import DefaultExport, {a} from 'module';",
            options: [{ ImportDeclaration: { minProperties: 2 } }]
        },

        // "ExportDeclaration" ---------------------------------------------
        {
            code: [
                "var a = 0, b = 0;",
                "export {a,",
                "b};"
            ].join("\n"),
            options: [{ ExportDeclaration: "never" }]
        },
        {
            code: [
                "var a = 0, b = 0;",
                "export {",
                "a as a, b",
                "} from 'module';"
            ].join("\n"),
            options: [{ ExportDeclaration: "always" }]
        },
        {
            code: [
                "export { a } from 'module';"
            ].join("\n"),
            options: [{ ExportDeclaration: { multiline: true } }]
        },
        {
            code: [
                "export {",
                "a, ",
                "b",
                "} from 'module';"
            ].join("\n"),
            options: [{ ExportDeclaration: { multiline: true } }]
        },
        {
            code: [
                "export {a, ",
                "b} from 'module';"
            ].join("\n"),
            options: [{ ExportDeclaration: { consistent: true } }]
        },
        {
            code: [
                "export {",
                "a, b",
                "} from 'module';"
            ].join("\n"),
            options: [{ ExportDeclaration: { minProperties: 2 } }]
        },
        {
            code: [
                "export {a, b} from 'module';"
            ].join("\n"),
            options: [{ ExportDeclaration: { minProperties: 3 } }]
        }
    ],
    invalid: [

        // default ------------------------------------------------------------
        {
            code: [
                "var a = { a",
                "};"
            ].join("\n"),
            output: "var a = { a};",
            errors: [
                { line: 2, column: 1, messageId: "unexpectedLinebreakBeforeClosingBrace" }
            ]
        },

        // "always" ------------------------------------------------------------
        {
            code: [
                "var a = {};"
            ].join("\n"),
            output: [
                "var a = {",
                "};"
            ].join("\n"),
            options: ["always"],
            errors: [
                { line: 1, column: 9, messageId: "expectedLinebreakAfterOpeningBrace" },
                { line: 1, column: 10, messageId: "expectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "var b = {a: 1};"
            ].join("\n"),
            output: [
                "var b = {",
                "a: 1",
                "};"
            ].join("\n"),
            options: ["always"],
            errors: [
                {
                    line: 1,
                    column: 9,
                    endLine: 1,
                    endColumn: 10,
                    messageId: "expectedLinebreakAfterOpeningBrace"
                },
                {
                    line: 1,
                    column: 14,
                    endLine: 1,
                    endColumn: 15,
                    messageId: "expectedLinebreakBeforeClosingBrace"
                }
            ]
        },
        {
            code: [
                "var c = {a: 1, b: 2};"
            ].join("\n"),
            output: [
                "var c = {",
                "a: 1, b: 2",
                "};"
            ].join("\n"),
            options: ["always"],
            errors: [
                { line: 1, column: 9, messageId: "expectedLinebreakAfterOpeningBrace" },
                { line: 1, column: 20, messageId: "expectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "var d = {a: 1,",
                "    b: 2};"
            ].join("\n"),
            output: [
                "var d = {",
                "a: 1,",
                "    b: 2",
                "};"
            ].join("\n"),
            options: ["always"],
            errors: [
                { line: 1, column: 9, messageId: "expectedLinebreakAfterOpeningBrace" },
                { line: 2, column: 9, messageId: "expectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "var e = {a: function foo() {",
                "    dosomething();",
                "}};"
            ].join("\n"),
            output: [
                "var e = {",
                "a: function foo() {",
                "    dosomething();",
                "}",
                "};"
            ].join("\n"),
            options: ["always"],
            errors: [
                { line: 1, column: 9, messageId: "expectedLinebreakAfterOpeningBrace" },
                { line: 3, column: 2, messageId: "expectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: "function foo({ a, b } : MyType) {}",
            output: [
                "function foo({",
                " a, b ",
                "} : MyType) {}"
            ].join("\n"),
            options: ["always"],
            parser: resolvePath(__dirname, "../../fixtures/parsers/object-curly-newline/flow-stub-parser-singleline"),
            errors: [
                { line: 1, column: 14, messageId: "expectedLinebreakAfterOpeningBrace" },
                { line: 1, column: 21, messageId: "expectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: "function foo({ a, b } : { a : string, b : string }) {}",
            output: [
                "function foo({",
                " a, b ",
                "} : { a : string, b : string }) {}"
            ].join("\n"),
            options: ["always"],
            parser: resolvePath(__dirname, "../../fixtures/parsers/object-curly-newline/flow-stub-parser-singleline-type-literal"),
            errors: [
                { line: 1, column: 14, messageId: "expectedLinebreakAfterOpeningBrace" },
                { line: 1, column: 21, messageId: "expectedLinebreakBeforeClosingBrace" }
            ]
        },

        // "never" ------------------------------------------------------------
        {
            code: [
                "var a = {",
                "};"
            ].join("\n"),
            output: [
                "var a = {};"
            ].join("\n"),
            options: ["never"],
            errors: [
                { line: 1, column: 9, messageId: "unexpectedLinebreakAfterOpeningBrace" },
                { line: 2, column: 1, messageId: "unexpectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "var b = {",
                "    a: 1",
                "};"
            ].join("\n"),
            output: [
                "var b = {a: 1};"
            ].join("\n"),
            options: ["never"],
            errors: [
                {
                    line: 1,
                    column: 9,
                    endLine: 1,
                    endColumn: 10,
                    messageId: "unexpectedLinebreakAfterOpeningBrace"
                },
                {
                    line: 3,
                    column: 1,
                    endLine: 3,
                    endColumn: 2,
                    messageId: "unexpectedLinebreakBeforeClosingBrace"
                }
            ]
        },
        {
            code: [
                "var c = {",
                "    a: 1, b: 2",
                "};"
            ].join("\n"),
            output: [
                "var c = {a: 1, b: 2};"
            ].join("\n"),
            options: ["never"],
            errors: [
                { line: 1, column: 9, messageId: "unexpectedLinebreakAfterOpeningBrace" },
                { line: 3, column: 1, messageId: "unexpectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "var d = {",
                "    a: 1,",
                "    b: 2",
                "};"
            ].join("\n"),
            output: [
                "var d = {a: 1,",
                "    b: 2};"
            ].join("\n"),
            options: ["never"],
            errors: [
                { line: 1, column: 9, messageId: "unexpectedLinebreakAfterOpeningBrace" },
                { line: 4, column: 1, messageId: "unexpectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "var e = {",
                "    a: function foo() {",
                "        dosomething();",
                "    }",
                "};"
            ].join("\n"),
            output: [
                "var e = {a: function foo() {",
                "        dosomething();",
                "    }};"
            ].join("\n"),
            options: ["never"],
            errors: [
                { line: 1, column: 9, messageId: "unexpectedLinebreakAfterOpeningBrace" },
                { line: 5, column: 1, messageId: "unexpectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "function foo({",
                " a,",
                " b",
                "} : MyType) {}"
            ].join("\n"),
            output: [
                "function foo({a,",
                " b} : MyType) {}"
            ].join("\n"),
            options: ["never"],
            parser: resolvePath(__dirname, "../../fixtures/parsers/object-curly-newline/flow-stub-parser-multiline"),
            errors: [
                { line: 1, column: 14, messageId: "unexpectedLinebreakAfterOpeningBrace" },
                { line: 4, column: 1, messageId: "unexpectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "function foo({",
                " a,",
                " b",
                "} : { a : string, b : string }) {}"
            ].join("\n"),
            output: [
                "function foo({a,",
                " b} : { a : string, b : string }) {}"
            ].join("\n"),
            options: ["never"],
            parser: resolvePath(__dirname, "../../fixtures/parsers/object-curly-newline/flow-stub-parser-multiline-type-literal"),
            errors: [
                { line: 1, column: 14, messageId: "unexpectedLinebreakAfterOpeningBrace" },
                { line: 4, column: 1, messageId: "unexpectedLinebreakBeforeClosingBrace" }
            ]
        },

        // "multiline" ---------------------------------------------------------
        {
            code: [
                "var a = {",
                "};"
            ].join("\n"),
            output: [
                "var a = {};"
            ].join("\n"),
            options: [{ multiline: true }],
            errors: [
                { line: 1, column: 9, messageId: "unexpectedLinebreakAfterOpeningBrace" },
                { line: 2, column: 1, messageId: "unexpectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "var a = {",
                " /* comment */ ",
                "};"
            ].join("\n"),
            output: null,
            options: [{ multiline: true }],
            errors: [
                { line: 1, column: 9, messageId: "unexpectedLinebreakAfterOpeningBrace" },
                { line: 3, column: 1, messageId: "unexpectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "var a = { // comment",
                "};"
            ].join("\n"),
            output: null,
            options: [{ multiline: true }],
            errors: [
                { line: 1, column: 9, messageId: "unexpectedLinebreakAfterOpeningBrace" },
                { line: 2, column: 1, messageId: "unexpectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "var b = {",
                "    a: 1",
                "};"
            ].join("\n"),
            output: [
                "var b = {a: 1};"
            ].join("\n"),
            options: [{ multiline: true }],
            errors: [
                { line: 1, column: 9, messageId: "unexpectedLinebreakAfterOpeningBrace" },
                { line: 3, column: 1, messageId: "unexpectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "var b = {",
                "   a: 1 // comment",
                "};"
            ].join("\n"),
            output: [
                "var b = {a: 1 // comment",
                "};"
            ].join("\n"),
            options: [{ multiline: true }],
            errors: [
                { line: 1, column: 9, messageId: "unexpectedLinebreakAfterOpeningBrace" },
                { line: 3, column: 1, messageId: "unexpectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "var c = {",
                "    a: 1, b: 2",
                "};"
            ].join("\n"),
            output: [
                "var c = {a: 1, b: 2};"
            ].join("\n"),
            options: [{ multiline: true }],
            errors: [
                { line: 1, column: 9, messageId: "unexpectedLinebreakAfterOpeningBrace" },
                { line: 3, column: 1, messageId: "unexpectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "var c = {",
                "    a: 1, b: 2 // comment",
                "};"
            ].join("\n"),
            output: [
                "var c = {a: 1, b: 2 // comment",
                "};"
            ].join("\n"),
            options: [{ multiline: true }],
            errors: [
                { line: 1, column: 9, messageId: "unexpectedLinebreakAfterOpeningBrace" },
                { line: 3, column: 1, messageId: "unexpectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "var d = {a: 1,",
                "    b: 2};"
            ].join("\n"),
            output: [
                "var d = {",
                "a: 1,",
                "    b: 2",
                "};"
            ].join("\n"),
            options: [{ multiline: true }],
            errors: [
                { line: 1, column: 9, messageId: "expectedLinebreakAfterOpeningBrace" },
                { line: 2, column: 9, messageId: "expectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "var d = {a: 1, // comment",
                "    b: 2};"
            ].join("\n"),
            output: [
                "var d = {",
                "a: 1, // comment",
                "    b: 2",
                "};"
            ].join("\n"),
            options: [{ multiline: true }],
            errors: [
                { line: 1, column: 9, messageId: "expectedLinebreakAfterOpeningBrace" },
                { line: 2, column: 9, messageId: "expectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "var e = {a: function foo() {",
                "    dosomething();",
                "}};"
            ].join("\n"),
            output: [
                "var e = {",
                "a: function foo() {",
                "    dosomething();",
                "}",
                "};"
            ].join("\n"),
            options: [{ multiline: true }],
            errors: [
                { line: 1, column: 9, messageId: "expectedLinebreakAfterOpeningBrace" },
                { line: 3, column: 2, messageId: "expectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "var e = {a: function foo() { // comment",
                "    dosomething();",
                "}};"
            ].join("\n"),
            output: [
                "var e = {",
                "a: function foo() { // comment",
                "    dosomething();",
                "}",
                "};"
            ].join("\n"),
            options: [{ multiline: true }],
            errors: [
                { line: 1, column: 9, messageId: "expectedLinebreakAfterOpeningBrace" },
                { line: 3, column: 2, messageId: "expectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "var e = {a: 1, /* comment */",
                "    b: 2, // another comment",
                "};"
            ].join("\n"),
            output: [
                "var e = {",
                "a: 1, /* comment */",
                "    b: 2, // another comment",
                "};"
            ].join("\n"),
            options: [{ multiline: true }],
            errors: [
                { line: 1, column: 9, messageId: "expectedLinebreakAfterOpeningBrace" }
            ]
        },
        {
            code: [
                "var f = { /* comment */ a:",
                "2",
                "};"
            ].join("\n"),
            output: null,
            options: [{ multiline: true }],
            errors: [
                { line: 1, column: 9, messageId: "expectedLinebreakAfterOpeningBrace" }
            ]
        },
        {
            code: [
                "var f = {",
                "/* comment */",
                "a: 1};"
            ].join("\n"),
            output: [
                "var f = {",
                "/* comment */",
                "a: 1",
                "};"
            ].join("\n"),
            options: [{ multiline: true }],
            errors: [
                { line: 3, column: 5, messageId: "expectedLinebreakBeforeClosingBrace" }
            ]
        },

        // "minProperties" ----------------------------------------------------------
        {
            code: [
                "var a = {",
                "};"
            ].join("\n"),
            output: [
                "var a = {};"
            ].join("\n"),
            options: [{ minProperties: 2 }],
            errors: [
                { line: 1, column: 9, messageId: "unexpectedLinebreakAfterOpeningBrace" },
                { line: 2, column: 1, messageId: "unexpectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "var b = {",
                "    a: 1",
                "};"
            ].join("\n"),
            output: [
                "var b = {a: 1};"
            ].join("\n"),
            options: [{ minProperties: 2 }],
            errors: [
                { line: 1, column: 9, messageId: "unexpectedLinebreakAfterOpeningBrace" },
                { line: 3, column: 1, messageId: "unexpectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "var c = {a: 1, b: 2};"
            ].join("\n"),
            output: [
                "var c = {",
                "a: 1, b: 2",
                "};"
            ].join("\n"),
            options: [{ minProperties: 2 }],
            errors: [
                { line: 1, column: 9, messageId: "expectedLinebreakAfterOpeningBrace" },
                { line: 1, column: 20, messageId: "expectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "var d = {a: 1,",
                "    b: 2};"
            ].join("\n"),
            output: [
                "var d = {",
                "a: 1,",
                "    b: 2",
                "};"
            ].join("\n"),
            options: [{ minProperties: 2 }],
            errors: [
                { line: 1, column: 9, messageId: "expectedLinebreakAfterOpeningBrace" },
                { line: 2, column: 9, messageId: "expectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "var e = {",
                "    a: function foo() {",
                "        dosomething();",
                "    }",
                "};"
            ].join("\n"),
            output: [
                "var e = {a: function foo() {",
                "        dosomething();",
                "    }};"
            ].join("\n"),
            options: [{ minProperties: 2 }],
            errors: [
                { line: 1, column: 9, messageId: "unexpectedLinebreakAfterOpeningBrace" },
                { line: 5, column: 1, messageId: "unexpectedLinebreakBeforeClosingBrace" }
            ]
        },

        // "multiline" and "minProperties" ------------------------------------------
        {
            code: [
                "var a = {",
                "};"
            ].join("\n"),
            output: [
                "var a = {};"
            ].join("\n"),
            options: [{ multiline: true, minProperties: 2 }],
            errors: [
                { line: 1, column: 9, messageId: "unexpectedLinebreakAfterOpeningBrace" },
                { line: 2, column: 1, messageId: "unexpectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "var b = {",
                "    a: 1",
                "};"
            ].join("\n"),
            output: [
                "var b = {a: 1};"
            ].join("\n"),
            options: [{ multiline: true, minProperties: 2 }],
            errors: [
                { line: 1, column: 9, messageId: "unexpectedLinebreakAfterOpeningBrace" },
                { line: 3, column: 1, messageId: "unexpectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "var c = {a: 1, b: 2};"
            ].join("\n"),
            output: [
                "var c = {",
                "a: 1, b: 2",
                "};"
            ].join("\n"),
            options: [{ multiline: true, minProperties: 2 }],
            errors: [
                { line: 1, column: 9, messageId: "expectedLinebreakAfterOpeningBrace" },
                { line: 1, column: 20, messageId: "expectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "var d = {a: 1, ",
                "    b: 2};"
            ].join("\n"),
            output: [
                "var d = {",
                "a: 1, ",
                "    b: 2",
                "};"
            ].join("\n"),
            options: [{ multiline: true, minProperties: 2 }],
            errors: [
                { line: 1, column: 9, messageId: "expectedLinebreakAfterOpeningBrace" },
                { line: 2, column: 9, messageId: "expectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "var e = {a: function foo() {",
                "    dosomething();",
                "}};"
            ].join("\n"),
            output: [
                "var e = {",
                "a: function foo() {",
                "    dosomething();",
                "}",
                "};"
            ].join("\n"),
            options: [{ multiline: true, minProperties: 2 }],
            errors: [
                { line: 1, column: 9, messageId: "expectedLinebreakAfterOpeningBrace" },
                { line: 3, column: 2, messageId: "expectedLinebreakBeforeClosingBrace" }
            ]
        },

        // "consistent" ------------------------------------------
        {
            code: [
                "var b = {a: 1",
                "};"
            ].join("\n"),
            output: [
                "var b = {a: 1};"
            ].join("\n"),
            options: [{ multiline: true, consistent: true }],
            errors: [
                { line: 2, column: 1, messageId: "unexpectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "var b = {",
                "a: 1};"
            ].join("\n"),
            output: [
                "var b = {a: 1};"
            ].join("\n"),
            options: [{ multiline: true, consistent: true }],
            errors: [
                { line: 1, column: 9, messageId: "unexpectedLinebreakAfterOpeningBrace" }
            ]
        },
        {
            code: [
                "var c = {a: 1, b: 2",
                "};"
            ].join("\n"),
            output: [
                "var c = {a: 1, b: 2};"
            ].join("\n"),
            options: [{ multiline: true, consistent: true }],
            errors: [
                { line: 2, column: 1, messageId: "unexpectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "var c = {",
                "a: 1, b: 2};"
            ].join("\n"),
            output: [
                "var c = {a: 1, b: 2};"
            ].join("\n"),
            options: [{ multiline: true, consistent: true }],
            errors: [
                { line: 1, column: 9, messageId: "unexpectedLinebreakAfterOpeningBrace" }
            ]
        },
        {
            code: [
                "var c = {a: 1,",
                "b: 2};"
            ].join("\n"),
            output: [
                "var c = {",
                "a: 1,",
                "b: 2",
                "};"
            ].join("\n"),
            options: [{ multiline: true, consistent: true }],
            errors: [
                { line: 1, column: 9, messageId: "expectedLinebreakAfterOpeningBrace" },
                { line: 2, column: 5, messageId: "expectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "var e = {a: function() {",
                "dosomething();",
                "}};"
            ].join("\n"),
            output: [
                "var e = {",
                "a: function() {",
                "dosomething();",
                "}",
                "};"
            ].join("\n"),
            options: [{ multiline: true, consistent: true }],
            errors: [
                { line: 1, column: 9, messageId: "expectedLinebreakAfterOpeningBrace" },
                { line: 3, column: 2, messageId: "expectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "let {a",
                "} = {a: 1}"
            ].join("\n"),
            output: [
                "let {a} = {a: 1}"
            ].join("\n"),
            options: [{ multiline: true, consistent: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { line: 2, column: 1, messageId: "unexpectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "let {",
                "a} = {a: 1}"
            ].join("\n"),
            output: [
                "let {a} = {a: 1}"
            ].join("\n"),
            options: [{ multiline: true, consistent: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { line: 1, column: 5, messageId: "unexpectedLinebreakAfterOpeningBrace" }
            ]
        },
        {
            code: [
                "let {a, b",
                "} = {a: 1, b: 2}"
            ].join("\n"),
            output: [
                "let {a, b} = {a: 1, b: 2}"
            ].join("\n"),
            options: [{ multiline: true, consistent: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { line: 2, column: 1, messageId: "unexpectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "let {",
                "a, b} = {a: 1, b: 2}"
            ].join("\n"),
            output: [
                "let {a, b} = {a: 1, b: 2}"
            ].join("\n"),
            options: [{ multiline: true, consistent: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { line: 1, column: 5, messageId: "unexpectedLinebreakAfterOpeningBrace" }
            ]
        },
        {
            code: [
                "let {a,",
                "b} = {a: 1, b: 2}"
            ].join("\n"),
            output: [
                "let {",
                "a,",
                "b",
                "} = {a: 1, b: 2}"
            ].join("\n"),
            options: [{ multiline: true, consistent: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { line: 1, column: 5, messageId: "expectedLinebreakAfterOpeningBrace" },
                { line: 2, column: 2, messageId: "expectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "let {e = function() {",
                "dosomething();",
                "}} = a;"
            ].join("\n"),
            output: [
                "let {",
                "e = function() {",
                "dosomething();",
                "}",
                "} = a;"
            ].join("\n"),
            options: [{ multiline: true, consistent: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { line: 1, column: 5, messageId: "expectedLinebreakAfterOpeningBrace" },
                { line: 3, column: 2, messageId: "expectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "var c = {",
                "a: 1,",
                "b: 2};"
            ].join("\n"),
            output: [
                "var c = {a: 1,",
                "b: 2};"
            ].join("\n"),
            options: [{ multiline: false, consistent: true }],
            errors: [
                { line: 1, column: 9, messageId: "unexpectedLinebreakAfterOpeningBrace" }
            ]
        },
        {
            code: [
                "var c = {a: 1,",
                "b: 2",
                "};"
            ].join("\n"),
            output: [
                "var c = {a: 1,",
                "b: 2};"
            ].join("\n"),
            options: [{ multiline: false, consistent: true }],
            errors: [
                { line: 3, column: 1, messageId: "unexpectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "let {",
                "a,",
                "b} = {a: 1, b: 2};"
            ].join("\n"),
            output: [
                "let {a,",
                "b} = {a: 1, b: 2};"
            ].join("\n"),
            options: [{ multiline: false, consistent: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { line: 1, column: 5, messageId: "unexpectedLinebreakAfterOpeningBrace" }
            ]
        },
        {
            code: [
                "let {a,",
                "b",
                "} = {a: 1, b: 2};"
            ].join("\n"),
            output: [
                "let {a,",
                "b} = {a: 1, b: 2};"
            ].join("\n"),
            options: [{ multiline: false, consistent: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { line: 3, column: 1, messageId: "unexpectedLinebreakBeforeClosingBrace" }
            ]
        },

        // "consistent" and "minProperties" ------------------------------------------
        {
            code: [
                "var c = {a: 1, b: 2};"
            ].join("\n"),
            output: [
                "var c = {",
                "a: 1, b: 2",
                "};"
            ].join("\n"),
            options: [{ multiline: true, consistent: true, minProperties: 2 }],
            errors: [
                { line: 1, column: 9, messageId: "expectedLinebreakAfterOpeningBrace" },
                { line: 1, column: 20, messageId: "expectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "let {a, b} = {",
                "a: 1, b: 2",
                "};"
            ].join("\n"),
            output: [
                "let {",
                "a, b",
                "} = {",
                "a: 1, b: 2",
                "};"
            ].join("\n"),
            options: [{ multiline: true, consistent: true, minProperties: 2 }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { line: 1, column: 5, messageId: "expectedLinebreakAfterOpeningBrace" },
                { line: 1, column: 10, messageId: "expectedLinebreakBeforeClosingBrace" }
            ]
        },

        // "ObjectExpression" and "ObjectPattern" ---------------------------------------------
        {
            code: [
                "let {",
                "    a, b",
                "} = {a: 1, b: 2};"
            ].join("\n"),
            output: [
                "let {a, b} = {",
                "a: 1, b: 2",
                "};"
            ].join("\n"),
            options: [{ ObjectExpression: "always", ObjectPattern: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { line: 1, column: 5, messageId: "unexpectedLinebreakAfterOpeningBrace" },
                { line: 3, column: 1, messageId: "unexpectedLinebreakBeforeClosingBrace" },
                { line: 3, column: 5, messageId: "expectedLinebreakAfterOpeningBrace" },
                { line: 3, column: 16, messageId: "expectedLinebreakBeforeClosingBrace" }
            ]
        },

        // "ImportDeclaration" ---------------------------------------------
        {
            code: [
                "import {",
                "    a,",
                " b",
                "} from 'module';"
            ].join("\n"),
            output: [
                "import {a,",
                " b} from 'module';"
            ].join("\n"),
            options: [{ ImportDeclaration: "never" }],
            errors: [
                { line: 1, column: 8, messageId: "unexpectedLinebreakAfterOpeningBrace" },
                { line: 4, column: 1, messageId: "unexpectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "import {a, b} from 'module';"
            ].join("\n"),
            output: [
                "import {",
                "a, b",
                "} from 'module';"
            ].join("\n"),
            options: [{ ImportDeclaration: "always" }],
            errors: [
                { line: 1, column: 8, messageId: "expectedLinebreakAfterOpeningBrace" },
                { line: 1, column: 13, messageId: "expectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "import {a as c, b} from 'module';"
            ].join("\n"),
            output: [
                "import {",
                "a as c, b",
                "} from 'module';"
            ].join("\n"),
            options: [{ ImportDeclaration: "always" }],
            errors: [
                { line: 1, column: 8, messageId: "expectedLinebreakAfterOpeningBrace" },
                { line: 1, column: 18, messageId: "expectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "import {a, ",
                "b} from 'module';"
            ].join("\n"),
            output: [
                "import {",
                "a, ",
                "b",
                "} from 'module';"
            ].join("\n"),
            options: [{ ImportDeclaration: { multiline: true } }],
            errors: [
                { line: 1, column: 8, messageId: "expectedLinebreakAfterOpeningBrace" },
                { line: 2, column: 2, messageId: "expectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "import {a, ",
                "b",
                "} from 'module';"
            ].join("\n"),
            output: [
                "import {a, ",
                "b} from 'module';"
            ].join("\n"),
            options: [{ ImportDeclaration: { consistent: true } }],
            errors: [
                { line: 3, column: 1, messageId: "unexpectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "import {a, b",
                "} from 'module';"
            ].join("\n"),
            output: [
                "import {a, b} from 'module';"
            ].join("\n"),
            options: [{ ImportDeclaration: { consistent: true } }],
            errors: [
                { line: 2, column: 1, messageId: "unexpectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "import {a, b} from 'module';"
            ].join("\n"),
            output: [
                "import {",
                "a, b",
                "} from 'module';"
            ].join("\n"),
            options: [{ ImportDeclaration: { minProperties: 2 } }],
            errors: [
                { line: 1, column: 8, messageId: "expectedLinebreakAfterOpeningBrace" },
                { line: 1, column: 13, messageId: "expectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "import {",
                "a, b",
                "} from 'module';"
            ].join("\n"),
            output: [
                "import {a, b} from 'module';"
            ].join("\n"),
            options: [{ ImportDeclaration: { minProperties: 3 } }],
            errors: [
                { line: 1, column: 8, messageId: "unexpectedLinebreakAfterOpeningBrace" },
                { line: 3, column: 1, messageId: "unexpectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: "import DefaultExport, {a, b} from 'module';",
            output: [
                "import DefaultExport, {",
                "a, b",
                "} from 'module';"
            ].join("\n"),
            options: [{ ImportDeclaration: { minProperties: 2 } }],
            errors: [
                { line: 1, column: 23, messageId: "expectedLinebreakAfterOpeningBrace" },
                { line: 1, column: 28, messageId: "expectedLinebreakBeforeClosingBrace" }
            ]
        },

        // "ExportDeclaration" ---------------------------------------------
        {
            code: [
                "var a = 0; var b = 0;",
                "export {",
                "    a,",
                "    b",
                "};"
            ].join("\n"),
            output: [
                "var a = 0; var b = 0;",
                "export {a,",
                "    b};"
            ].join("\n"),
            options: [{ ExportDeclaration: "never" }],
            errors: [
                { line: 2, column: 8, messageId: "unexpectedLinebreakAfterOpeningBrace" },
                { line: 5, column: 1, messageId: "unexpectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "export {a as a, b} from 'module';"
            ].join("\n"),
            output: [
                "export {",
                "a as a, b",
                "} from 'module';"
            ].join("\n"),
            options: [{ ExportDeclaration: "always" }],
            errors: [
                { line: 1, column: 8, messageId: "expectedLinebreakAfterOpeningBrace" },
                { line: 1, column: 18, messageId: "expectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "export {a, ",
                "b} from 'module';"
            ].join("\n"),
            output: [
                "export {",
                "a, ",
                "b",
                "} from 'module';"
            ].join("\n"),
            options: [{ ExportDeclaration: { multiline: true } }],
            errors: [
                { line: 1, column: 8, messageId: "expectedLinebreakAfterOpeningBrace" },
                { line: 2, column: 2, messageId: "expectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "export {a, ",
                "b,",
                "} from 'module';"
            ].join("\n"),
            output: [
                "export {a, ",
                "b,} from 'module';"
            ].join("\n"),
            options: [{ ExportDeclaration: { consistent: true } }],
            errors: [
                { line: 3, column: 1, messageId: "unexpectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "export {a, b",
                "} from 'module';"
            ].join("\n"),
            output: [
                "export {a, b} from 'module';"
            ].join("\n"),
            options: [{ ExportDeclaration: { consistent: true } }],
            errors: [
                { line: 2, column: 1, messageId: "unexpectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "export {a, b,} from 'module';"
            ].join("\n"),
            output: [
                "export {",
                "a, b,",
                "} from 'module';"
            ].join("\n"),
            options: [{ ExportDeclaration: { minProperties: 2 } }],
            errors: [
                { line: 1, column: 8, messageId: "expectedLinebreakAfterOpeningBrace" },
                { line: 1, column: 14, messageId: "expectedLinebreakBeforeClosingBrace" }
            ]
        },
        {
            code: [
                "export {",
                "a, b",
                "} from 'module';"
            ].join("\n"),
            output: [
                "export {a, b} from 'module';"
            ].join("\n"),
            options: [{ ExportDeclaration: { minProperties: 3 } }],
            errors: [
                { line: 1, column: 8, messageId: "unexpectedLinebreakAfterOpeningBrace" },
                { line: 3, column: 1, messageId: "unexpectedLinebreakBeforeClosingBrace" }
            ]
        }
    ]
});
