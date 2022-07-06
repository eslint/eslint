/**
 * @fileoverview Tests for block-spacing rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/block-spacing");
const { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("block-spacing", rule, {
    valid: [

        // default/always
        { code: "{ foo(); }", options: ["always"] },
        "{ foo(); }",
        "{ foo();\n}",
        "{\nfoo(); }",
        "{\r\nfoo();\r\n}",
        "if (a) { foo(); }",
        "if (a) {} else { foo(); }",
        "switch (a) {}",
        "switch (a) { case 0: foo(); }",
        "while (a) { foo(); }",
        "do { foo(); } while (a);",
        "for (;;) { foo(); }",
        "for (var a in b) { foo(); }",
        { code: "for (var a of b) { foo(); }", parserOptions: { ecmaVersion: 6 } },
        "try { foo(); } catch (e) { foo(); }",
        "function foo() { bar(); }",
        "(function() { bar(); });",
        { code: "(() => { bar(); });", parserOptions: { ecmaVersion: 6 } },
        "if (a) { /* comment */ foo(); /* comment */ }",
        "if (a) { //comment\n foo(); }",
        { code: "class C { static {} }", parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { foo; } }", parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { /* comment */foo;/* comment */ } }", parserOptions: { ecmaVersion: 2022 } },

        // never
        { code: "{foo();}", options: ["never"] },
        { code: "{foo();\n}", options: ["never"] },
        { code: "{\nfoo();}", options: ["never"] },
        { code: "{\r\nfoo();\r\n}", options: ["never"] },
        { code: "if (a) {foo();}", options: ["never"] },
        { code: "if (a) {} else {foo();}", options: ["never"] },
        { code: "switch (a) {}", options: ["never"] },
        { code: "switch (a) {case 0: foo();}", options: ["never"] },
        { code: "while (a) {foo();}", options: ["never"] },
        { code: "do {foo();} while (a);", options: ["never"] },
        { code: "for (;;) {foo();}", options: ["never"] },
        { code: "for (var a in b) {foo();}", options: ["never"] },
        { code: "for (var a of b) {foo();}", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "try {foo();} catch (e) {foo();}", options: ["never"] },
        { code: "function foo() {bar();}", options: ["never"] },
        { code: "(function() {bar();});", options: ["never"] },
        { code: "(() => {bar();});", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "if (a) {/* comment */ foo(); /* comment */}", options: ["never"] },
        { code: "if (a) { //comment\n foo();}", options: ["never"] },
        { code: "class C { static { } }", options: ["never"], parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { static {foo;} }", options: ["never"], parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { static {/* comment */ foo; /* comment */} }", options: ["never"], parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { // line comment is allowed\n foo;\n} }", options: ["never"], parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { static {\nfoo;\n} }", options: ["never"], parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { \n foo; \n } }", options: ["never"], parserOptions: { ecmaVersion: 2022 } }
    ],

    invalid: [

        // default/always
        {
            code: "{foo();}",
            output: "{ foo(); }",
            options: ["always"],
            errors: [
                { type: "BlockStatement", line: 1, column: 1, messageId: "missing", data: { location: "after", token: "{" } },
                { type: "BlockStatement", line: 1, column: 8, messageId: "missing", data: { location: "before", token: "}" } }
            ]
        },
        {
            code: "{foo();}",
            output: "{ foo(); }",
            errors: [
                { type: "BlockStatement", line: 1, column: 1, messageId: "missing", data: { location: "after", token: "{" } },
                { type: "BlockStatement", line: 1, column: 8, messageId: "missing", data: { location: "before", token: "}" } }
            ]
        },
        {
            code: "{ foo();}",
            output: "{ foo(); }",
            errors: [
                { type: "BlockStatement", line: 1, column: 9, messageId: "missing", data: { location: "before", token: "}" } }
            ]
        },
        {
            code: "{foo(); }",
            output: "{ foo(); }",
            errors: [
                { type: "BlockStatement", line: 1, column: 1, messageId: "missing", data: { location: "after", token: "{" } }
            ]
        },
        {
            code: "{\nfoo();}",
            output: "{\nfoo(); }",
            errors: [
                { type: "BlockStatement", line: 2, column: 7, messageId: "missing", data: { location: "before", token: "}" } }
            ]
        },
        {
            code: "{foo();\n}",
            output: "{ foo();\n}",
            errors: [
                { type: "BlockStatement", line: 1, column: 1, messageId: "missing", data: { location: "after", token: "{" } }
            ]
        },
        {
            code: "if (a) {foo();}",
            output: "if (a) { foo(); }",
            errors: [
                { type: "BlockStatement", line: 1, column: 8, messageId: "missing", data: { location: "after", token: "{" } },
                { type: "BlockStatement", line: 1, column: 15, messageId: "missing", data: { location: "before", token: "}" } }
            ]
        },
        {
            code: "if (a) {} else {foo();}",
            output: "if (a) {} else { foo(); }",
            errors: [
                { type: "BlockStatement", line: 1, column: 16, messageId: "missing", data: { location: "after", token: "{" } },
                { type: "BlockStatement", line: 1, column: 23, messageId: "missing", data: { location: "before", token: "}" } }
            ]
        },
        {
            code: "switch (a) {case 0: foo();}",
            output: "switch (a) { case 0: foo(); }",
            errors: [
                { type: "SwitchStatement", line: 1, column: 12, messageId: "missing", data: { location: "after", token: "{" } },
                { type: "SwitchStatement", line: 1, column: 27, messageId: "missing", data: { location: "before", token: "}" } }
            ]
        },
        {
            code: "while (a) {foo();}",
            output: "while (a) { foo(); }",
            errors: [
                { type: "BlockStatement", line: 1, column: 11, messageId: "missing", data: { location: "after", token: "{" } },
                { type: "BlockStatement", line: 1, column: 18, messageId: "missing", data: { location: "before", token: "}" } }
            ]
        },
        {
            code: "do {foo();} while (a);",
            output: "do { foo(); } while (a);",
            errors: [
                { type: "BlockStatement", line: 1, column: 4, messageId: "missing", data: { location: "after", token: "{" } },
                { type: "BlockStatement", line: 1, column: 11, messageId: "missing", data: { location: "before", token: "}" } }
            ]
        },
        {
            code: "for (;;) {foo();}",
            output: "for (;;) { foo(); }",
            errors: [
                { type: "BlockStatement", line: 1, column: 10, messageId: "missing", data: { location: "after", token: "{" } },
                { type: "BlockStatement", line: 1, column: 17, messageId: "missing", data: { location: "before", token: "}" } }
            ]
        },
        {
            code: "for (var a in b) {foo();}",
            output: "for (var a in b) { foo(); }",
            errors: [
                { type: "BlockStatement", line: 1, column: 18, messageId: "missing", data: { location: "after", token: "{" } },
                { type: "BlockStatement", line: 1, column: 25, messageId: "missing", data: { location: "before", token: "}" } }
            ]
        },
        {
            code: "for (var a of b) {foo();}",
            output: "for (var a of b) { foo(); }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "BlockStatement", line: 1, column: 18, messageId: "missing", data: { location: "after", token: "{" } },
                { type: "BlockStatement", line: 1, column: 25, messageId: "missing", data: { location: "before", token: "}" } }
            ]
        },
        {
            code: "try {foo();} catch (e) {foo();} finally {foo();}",
            output: "try { foo(); } catch (e) { foo(); } finally { foo(); }",
            errors: [
                {
                    type: "BlockStatement",
                    messageId: "missing",
                    data: { location: "after", token: "{" },
                    line: 1,
                    column: 5,
                    endLine: 1,
                    endColumn: 6
                },
                {
                    type: "BlockStatement",
                    messageId: "missing",
                    data: { location: "before", token: "}" },
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 13
                },
                {
                    type: "BlockStatement",
                    messageId: "missing",
                    data: { location: "after", token: "{" },
                    line: 1,
                    column: 24,
                    endLine: 1,
                    endColumn: 25
                },
                {
                    type: "BlockStatement",
                    messageId: "missing",
                    data: { location: "before", token: "}" },
                    line: 1,
                    column: 31,
                    endLine: 1,
                    endColumn: 32
                },
                {
                    type: "BlockStatement",
                    messageId: "missing",
                    data: { location: "after", token: "{" },
                    line: 1,
                    column: 41,
                    endLine: 1,
                    endColumn: 42
                },
                {
                    type: "BlockStatement",
                    messageId: "missing",
                    data: { location: "before", token: "}" },
                    line: 1,
                    column: 48,
                    endLine: 1,
                    endColumn: 49
                }
            ]
        },
        {
            code: "function foo() {bar();}",
            output: "function foo() { bar(); }",
            errors: [
                { type: "BlockStatement", line: 1, column: 16, messageId: "missing", data: { location: "after", token: "{" } },
                { type: "BlockStatement", line: 1, column: 23, messageId: "missing", data: { location: "before", token: "}" } }
            ]
        },
        {
            code: "(function() {bar();});",
            output: "(function() { bar(); });",
            errors: [
                { type: "BlockStatement", line: 1, column: 13, messageId: "missing", data: { location: "after", token: "{" } },
                { type: "BlockStatement", line: 1, column: 20, messageId: "missing", data: { location: "before", token: "}" } }
            ]
        },
        {
            code: "(() => {bar();});",
            output: "(() => { bar(); });",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "BlockStatement", line: 1, column: 8, messageId: "missing", data: { location: "after", token: "{" } },
                { type: "BlockStatement", line: 1, column: 15, messageId: "missing", data: { location: "before", token: "}" } }
            ]
        },
        {
            code: "if (a) {/* comment */ foo(); /* comment */}",
            output: "if (a) { /* comment */ foo(); /* comment */ }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "BlockStatement", line: 1, column: 8, messageId: "missing", data: { location: "after", token: "{" } },
                { type: "BlockStatement", line: 1, column: 43, messageId: "missing", data: { location: "before", token: "}" } }
            ]
        },
        {
            code: "if (a) {//comment\n foo(); }",
            output: "if (a) { //comment\n foo(); }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    type: "BlockStatement",
                    messageId: "missing",
                    data: {
                        location: "after",
                        token: "{"
                    },
                    line: 1,
                    column: 8,
                    endLine: 1,
                    endColumn: 9
                }
            ]
        },

        // class static blocks
        {
            code: "class C { static {foo; } }",
            output: "class C { static { foo; } }",
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                {
                    type: "StaticBlock",
                    messageId: "missing",
                    data: {
                        location: "after",
                        token: "{"
                    },
                    line: 1,
                    column: 18,
                    endLine: 1,
                    endColumn: 19
                }
            ]
        },
        {
            code: "class C { static { foo;} }",
            output: "class C { static { foo; } }",
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                {
                    type: "StaticBlock",
                    messageId: "missing",
                    data: {
                        location: "before",
                        token: "}"
                    },
                    line: 1,
                    column: 24,
                    endLine: 1,
                    endColumn: 25
                }
            ]
        },
        {
            code: "class C { static {foo;} }",
            output: "class C { static { foo; } }",
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                {
                    type: "StaticBlock",
                    messageId: "missing",
                    data: {
                        location: "after",
                        token: "{"
                    },
                    line: 1,
                    column: 18,
                    endLine: 1,
                    endColumn: 19
                },
                {
                    type: "StaticBlock",
                    messageId: "missing",
                    data: {
                        location: "before",
                        token: "}"
                    },
                    line: 1,
                    column: 23,
                    endLine: 1,
                    endColumn: 24
                }
            ]
        },
        {
            code: "class C { static {/* comment */} }",
            output: "class C { static { /* comment */ } }",
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                {
                    type: "StaticBlock",
                    messageId: "missing",
                    data: {
                        location: "after",
                        token: "{"
                    },
                    line: 1,
                    column: 18,
                    endLine: 1,
                    endColumn: 19
                },
                {
                    type: "StaticBlock",
                    messageId: "missing",
                    data: {
                        location: "before",
                        token: "}"
                    },
                    line: 1,
                    column: 32,
                    endLine: 1,
                    endColumn: 33
                }
            ]
        },
        {
            code: "class C { static {/* comment 1 */ foo; /* comment 2 */} }",
            output: "class C { static { /* comment 1 */ foo; /* comment 2 */ } }",
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                {
                    type: "StaticBlock",
                    messageId: "missing",
                    data: {
                        location: "after",
                        token: "{"
                    },
                    line: 1,
                    column: 18,
                    endLine: 1,
                    endColumn: 19
                },
                {
                    type: "StaticBlock",
                    messageId: "missing",
                    data: {
                        location: "before",
                        token: "}"
                    },
                    line: 1,
                    column: 55,
                    endLine: 1,
                    endColumn: 56
                }
            ]
        },
        {
            code: "class C {\n static {foo()\nbar()} }",
            output: "class C {\n static { foo()\nbar() } }",
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                {
                    type: "StaticBlock",
                    messageId: "missing",
                    data: {
                        location: "after",
                        token: "{"
                    },
                    line: 2,
                    column: 9,
                    endLine: 2,
                    endColumn: 10
                },
                {
                    type: "StaticBlock",
                    messageId: "missing",
                    data: {
                        location: "before",
                        token: "}"
                    },
                    line: 3,
                    column: 6,
                    endLine: 3,
                    endColumn: 7
                }
            ]
        },

        //----------------------------------------------------------------------
        // never
        {
            code: "{ foo(); }",
            output: "{foo();}",
            options: ["never"],
            errors: [
                {
                    type: "BlockStatement",
                    messageId: "extra",
                    data: { location: "after", token: "{" },
                    line: 1,
                    column: 2,
                    endLine: 1,
                    endColumn: 3
                },
                {
                    type: "BlockStatement",
                    messageId: "extra",
                    data: { location: "before", token: "}" },
                    line: 1,
                    column: 9,
                    endLine: 1,
                    endColumn: 10
                }
            ]
        },
        {
            code: "{ foo();}",
            output: "{foo();}",
            options: ["never"],
            errors: [
                {
                    type: "BlockStatement",
                    messageId: "extra",
                    data: {
                        location: "after",
                        token: "{"
                    },
                    line: 1,
                    column: 2,
                    endLine: 1,
                    endColumn: 3
                }
            ]
        },
        {
            code: "{foo(); }",
            output: "{foo();}",
            options: ["never"],
            errors: [
                {
                    type: "BlockStatement",
                    messageId: "extra",
                    data: {
                        location: "before",
                        token: "}"
                    },
                    line: 1,
                    column: 8,
                    endLine: 1,
                    endColumn: 9
                }
            ]
        },
        {
            code: "{\nfoo(); }",
            output: "{\nfoo();}",
            options: ["never"],
            errors: [
                {
                    type: "BlockStatement",
                    messageId: "extra",
                    data: {
                        location: "before",
                        token: "}"
                    },
                    line: 2,
                    column: 7,
                    endLine: 2,
                    endColumn: 8
                }
            ]
        },
        {
            code: "{ foo();\n}",
            output: "{foo();\n}",
            options: ["never"],
            errors: [
                {
                    type: "BlockStatement",
                    messageId: "extra",
                    data: {
                        location: "after",
                        token: "{"
                    },
                    line: 1,
                    column: 2,
                    endLine: 1,
                    endColumn: 3
                }
            ]
        },
        {
            code: "if (a) { foo(); }",
            output: "if (a) {foo();}",
            options: ["never"],
            errors: [
                {
                    type: "BlockStatement",
                    messageId: "extra",
                    data: { location: "after", token: "{" },
                    line: 1,
                    column: 9,
                    endLine: 1,
                    endColumn: 10
                },
                {
                    type: "BlockStatement",
                    messageId: "extra",
                    data: { location: "before", token: "}" },
                    line: 1,
                    column: 16,
                    endLine: 1,
                    endColumn: 17
                }
            ]
        },
        {
            code: "if (a) {} else { foo(); }",
            output: "if (a) {} else {foo();}",
            options: ["never"],
            errors: [
                {
                    type: "BlockStatement",
                    messageId: "extra",
                    data: { location: "after", token: "{" },
                    line: 1,
                    column: 17,
                    endLine: 1,
                    endColumn: 18
                },
                {
                    type: "BlockStatement",
                    messageId: "extra",
                    data: { location: "before", token: "}" },
                    line: 1,
                    column: 24,
                    endLine: 1,
                    endColumn: 25
                }
            ]
        },
        {
            code: "switch (a) { case 0: foo(); }",
            output: "switch (a) {case 0: foo();}",
            options: ["never"],
            errors: [
                {
                    type: "SwitchStatement",
                    messageId: "extra",
                    data: { location: "after", token: "{" },
                    line: 1,
                    column: 13,
                    endLine: 1,
                    endColumn: 14
                },
                {
                    type: "SwitchStatement",
                    messageId: "extra",
                    data: { location: "before", token: "}" },
                    line: 1,
                    column: 28,
                    endLine: 1,
                    endColumn: 29
                }
            ]
        },
        {
            code: "while (a) { foo(); }",
            output: "while (a) {foo();}",
            options: ["never"],
            errors: [
                {
                    type: "BlockStatement",
                    messageId: "extra",
                    data: { location: "after", token: "{" },
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 13
                },
                {
                    type: "BlockStatement",
                    messageId: "extra",
                    data: { location: "before", token: "}" },
                    line: 1,
                    column: 19,
                    endLine: 1,
                    endColumn: 20
                }
            ]
        },
        {
            code: "do { foo(); } while (a);",
            output: "do {foo();} while (a);",
            options: ["never"],
            errors: [
                {
                    type: "BlockStatement",
                    messageId: "extra",
                    data: { location: "after", token: "{" },
                    line: 1,
                    column: 5,
                    endLine: 1,
                    endColumn: 6
                },
                {
                    type: "BlockStatement",
                    messageId: "extra",
                    data: { location: "before", token: "}" },
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 13
                }
            ]
        },
        {
            code: "for (;;) { foo(); }",
            output: "for (;;) {foo();}",
            options: ["never"],
            errors: [
                {
                    type: "BlockStatement",
                    messageId: "extra",
                    data: { location: "after", token: "{" },
                    line: 1,
                    column: 11,
                    endLine: 1,
                    endColumn: 12
                },
                {
                    type: "BlockStatement",
                    messageId: "extra",
                    data: { location: "before", token: "}" },
                    line: 1,
                    column: 18,
                    endLine: 1,
                    endColumn: 19
                }
            ]
        },
        {
            code: "for (var a in b) { foo(); }",
            output: "for (var a in b) {foo();}",
            options: ["never"],
            errors: [
                {
                    type: "BlockStatement",
                    messageId: "extra",
                    data: { location: "after", token: "{" },
                    line: 1,
                    column: 19,
                    endLine: 1,
                    endColumn: 20
                },
                {
                    type: "BlockStatement",
                    messageId: "extra",
                    data: { location: "before", token: "}" },
                    line: 1,
                    column: 26,
                    endLine: 1,
                    endColumn: 27
                }
            ]
        },
        {
            code: "for (var a of b) { foo(); }",
            output: "for (var a of b) {foo();}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    type: "BlockStatement",
                    messageId: "extra",
                    data: { location: "after", token: "{" },
                    line: 1,
                    column: 19,
                    endLine: 1,
                    endColumn: 20
                },
                {
                    type: "BlockStatement",
                    messageId: "extra",
                    data: { location: "before", token: "}" },
                    line: 1,
                    column: 26,
                    endLine: 1,
                    endColumn: 27
                }
            ]
        },
        {
            code: "try { foo(); } catch (e) { foo(); } finally { foo(); }",
            output: "try {foo();} catch (e) {foo();} finally {foo();}",
            options: ["never"],
            errors: [
                {
                    type: "BlockStatement",
                    messageId: "extra",
                    data: { location: "after", token: "{" },
                    line: 1,
                    column: 6,
                    endLine: 1,
                    endColumn: 7
                },
                {
                    type: "BlockStatement",
                    messageId: "extra",
                    data: { location: "before", token: "}" },
                    line: 1,
                    column: 13,
                    endLine: 1,
                    endColumn: 14
                },
                {
                    type: "BlockStatement",
                    messageId: "extra",
                    data: { location: "after", token: "{" },
                    line: 1,
                    column: 27,
                    endLine: 1,
                    endColumn: 28
                },
                {
                    type: "BlockStatement",
                    line: 1,
                    column: 34,
                    messageId: "extra",
                    data: { location: "before", token: "}" },
                    endLine: 1,
                    endColumn: 35
                },
                {
                    type: "BlockStatement",
                    messageId: "extra",
                    data: { location: "after", token: "{" },
                    line: 1,
                    column: 46,
                    endLine: 1,
                    endColumn: 47
                },
                {
                    type: "BlockStatement",
                    messageId: "extra",
                    data: { location: "before", token: "}" },
                    line: 1,
                    column: 53,
                    endLine: 1,
                    endColumn: 54
                }
            ]
        },
        {
            code: "function foo() { bar(); }",
            output: "function foo() {bar();}",
            options: ["never"],
            errors: [
                {
                    type: "BlockStatement",
                    messageId: "extra",
                    data: { location: "after", token: "{" },
                    line: 1,
                    column: 17,
                    endLine: 1,
                    endColumn: 18
                },
                {
                    type: "BlockStatement",
                    messageId: "extra",
                    data: { location: "before", token: "}" },
                    line: 1,
                    column: 24,
                    endLine: 1,
                    endColumn: 25
                }
            ]
        },
        {
            code: "(function() { bar(); });",
            output: "(function() {bar();});",
            options: ["never"],
            errors: [
                {
                    type: "BlockStatement",
                    messageId: "extra",
                    data: { location: "after", token: "{" },
                    line: 1,
                    column: 14,
                    endLine: 1,
                    endColumn: 15
                },
                {
                    type: "BlockStatement",
                    messageId: "extra",
                    data: { location: "before", token: "}" },
                    line: 1,
                    column: 21,
                    endLine: 1,
                    endColumn: 22
                }
            ]
        },
        {
            code: "(() => { bar(); });",
            output: "(() => {bar();});",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    type: "BlockStatement",
                    messageId: "extra",
                    data: { location: "after", token: "{" },
                    line: 1,
                    column: 9,
                    endLine: 1,
                    endColumn: 10
                },
                {
                    type: "BlockStatement",
                    messageId: "extra",
                    data: { location: "before", token: "}" },
                    line: 1,
                    column: 16,
                    endLine: 1,
                    endColumn: 17
                }
            ]
        },
        {
            code: "if (a) { /* comment */ foo(); /* comment */ }",
            output: "if (a) {/* comment */ foo(); /* comment */}",
            options: ["never"],
            errors: [
                {
                    type: "BlockStatement",
                    messageId: "extra",
                    data: { location: "after", token: "{" },
                    line: 1,
                    column: 9,
                    endLine: 1,
                    endColumn: 10
                },
                {
                    type: "BlockStatement",
                    messageId: "extra",
                    data: { location: "before", token: "}" },
                    line: 1,
                    column: 44,
                    endLine: 1,
                    endColumn: 45
                }
            ]
        },
        {
            code: "(() => {   bar();});",
            output: "(() => {bar();});",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    type: "BlockStatement",
                    messageId: "extra",
                    data: { location: "after", token: "{" },
                    line: 1,
                    column: 9,
                    endLine: 1,
                    endColumn: 12
                }
            ]
        },
        {
            code: "(() => {bar();   });",
            output: "(() => {bar();});",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    type: "BlockStatement",
                    messageId: "extra",
                    data: { location: "before", token: "}" },
                    line: 1,
                    column: 15,
                    endLine: 1,
                    endColumn: 18
                }
            ]
        },
        {
            code: "(() => {   bar();   });",
            output: "(() => {bar();});",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    type: "BlockStatement",
                    messageId: "extra",
                    data: { location: "after", token: "{" },
                    line: 1,
                    column: 9,
                    endLine: 1,
                    endColumn: 12
                },
                {
                    type: "BlockStatement",
                    messageId: "extra",
                    data: { location: "before", token: "}" },
                    line: 1,
                    column: 18,
                    endLine: 1,
                    endColumn: 21
                }
            ]
        },

        // class static blocks
        {
            code: "class C { static { foo;} }",
            output: "class C { static {foo;} }",
            options: ["never"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                {
                    type: "StaticBlock",
                    messageId: "extra",
                    data: {
                        location: "after",
                        token: "{"
                    },
                    line: 1,
                    column: 19,
                    endLine: 1,
                    endColumn: 20
                }
            ]
        },
        {
            code: "class C { static {foo; } }",
            output: "class C { static {foo;} }",
            options: ["never"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                {
                    type: "StaticBlock",
                    messageId: "extra",
                    data: {
                        location: "before",
                        token: "}"
                    },
                    line: 1,
                    column: 23,
                    endLine: 1,
                    endColumn: 24
                }
            ]
        },
        {
            code: "class C { static { foo; } }",
            output: "class C { static {foo;} }",
            options: ["never"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                {
                    type: "StaticBlock",
                    messageId: "extra",
                    data: {
                        location: "after",
                        token: "{"
                    },
                    line: 1,
                    column: 19,
                    endLine: 1,
                    endColumn: 20
                },
                {
                    type: "StaticBlock",
                    messageId: "extra",
                    data: {
                        location: "before",
                        token: "}"
                    },
                    line: 1,
                    column: 24,
                    endLine: 1,
                    endColumn: 25
                }
            ]
        },
        {
            code: "class C { static { /* comment */ } }",
            output: "class C { static {/* comment */} }",
            options: ["never"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                {
                    type: "StaticBlock",
                    messageId: "extra",
                    data: {
                        location: "after",
                        token: "{"
                    },
                    line: 1,
                    column: 19,
                    endLine: 1,
                    endColumn: 20
                },
                {
                    type: "StaticBlock",
                    messageId: "extra",
                    data: {
                        location: "before",
                        token: "}"
                    },
                    line: 1,
                    column: 33,
                    endLine: 1,
                    endColumn: 34
                }
            ]
        },
        {
            code: "class C { static { /* comment 1 */ foo; /* comment 2 */ } }",
            output: "class C { static {/* comment 1 */ foo; /* comment 2 */} }",
            options: ["never"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                {
                    type: "StaticBlock",
                    messageId: "extra",
                    data: {
                        location: "after",
                        token: "{"
                    },
                    line: 1,
                    column: 19,
                    endLine: 1,
                    endColumn: 20
                },
                {
                    type: "StaticBlock",
                    messageId: "extra",
                    data: {
                        location: "before",
                        token: "}"
                    },
                    line: 1,
                    column: 56,
                    endLine: 1,
                    endColumn: 57
                }
            ]
        },
        {
            code: "class C { static\n{   foo()\nbar()  } }",
            output: "class C { static\n{foo()\nbar()} }",
            options: ["never"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                {
                    type: "StaticBlock",
                    messageId: "extra",
                    data: {
                        location: "after",
                        token: "{"
                    },
                    line: 2,
                    column: 2,
                    endLine: 2,
                    endColumn: 5
                },
                {
                    type: "StaticBlock",
                    messageId: "extra",
                    data: {
                        location: "before",
                        token: "}"
                    },
                    line: 3,
                    column: 6,
                    endLine: 3,
                    endColumn: 8
                }
            ]
        }
    ]
});
