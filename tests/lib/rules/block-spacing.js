/**
 * @fileoverview Tests for block-spacing rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/block-spacing");
const RuleTester = require("../../../lib/testers/rule-tester");

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
        { code: "if (a) { //comment\n foo();}", options: ["never"] }
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
                { type: "BlockStatement", line: 1, column: 5, messageId: "missing", data: { location: "after", token: "{" } },
                { type: "BlockStatement", line: 1, column: 12, messageId: "missing", data: { location: "before", token: "}" } },
                { type: "BlockStatement", line: 1, column: 24, messageId: "missing", data: { location: "after", token: "{" } },
                { type: "BlockStatement", line: 1, column: 31, messageId: "missing", data: { location: "before", token: "}" } },
                { type: "BlockStatement", line: 1, column: 41, messageId: "missing", data: { location: "after", token: "{" } },
                { type: "BlockStatement", line: 1, column: 48, messageId: "missing", data: { location: "before", token: "}" } }
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
                { type: "BlockStatement", line: 1, column: 8, messageId: "missing", data: { location: "after", token: "{" } }
            ]
        },

        //----------------------------------------------------------------------
        // never
        {
            code: "{ foo(); }",
            output: "{foo();}",
            options: ["never"],
            errors: [
                { type: "BlockStatement", line: 1, column: 1, messageId: "extra", data: { location: "after", token: "{" } },
                { type: "BlockStatement", line: 1, column: 10, messageId: "extra", data: { location: "before", token: "}" } }
            ]
        },
        {
            code: "{ foo();}",
            output: "{foo();}",
            options: ["never"],
            errors: [
                { type: "BlockStatement", line: 1, column: 1, messageId: "extra", data: { location: "after", token: "{" } }
            ]
        },
        {
            code: "{foo(); }",
            output: "{foo();}",
            options: ["never"],
            errors: [
                { type: "BlockStatement", line: 1, column: 9, messageId: "extra", data: { location: "before", token: "}" } }
            ]
        },
        {
            code: "{\nfoo(); }",
            output: "{\nfoo();}",
            options: ["never"],
            errors: [
                { type: "BlockStatement", line: 2, column: 8, messageId: "extra", data: { location: "before", token: "}" } }
            ]
        },
        {
            code: "{ foo();\n}",
            output: "{foo();\n}",
            options: ["never"],
            errors: [
                { type: "BlockStatement", line: 1, column: 1, messageId: "extra", data: { location: "after", token: "{" } }
            ]
        },
        {
            code: "if (a) { foo(); }",
            output: "if (a) {foo();}",
            options: ["never"],
            errors: [
                { type: "BlockStatement", line: 1, column: 8, messageId: "extra", data: { location: "after", token: "{" } },
                { type: "BlockStatement", line: 1, column: 17, messageId: "extra", data: { location: "before", token: "}" } }
            ]
        },
        {
            code: "if (a) {} else { foo(); }",
            output: "if (a) {} else {foo();}",
            options: ["never"],
            errors: [
                { type: "BlockStatement", line: 1, column: 16, messageId: "extra", data: { location: "after", token: "{" } },
                { type: "BlockStatement", line: 1, column: 25, messageId: "extra", data: { location: "before", token: "}" } }
            ]
        },
        {
            code: "switch (a) { case 0: foo(); }",
            output: "switch (a) {case 0: foo();}",
            options: ["never"],
            errors: [
                { type: "SwitchStatement", line: 1, column: 12, messageId: "extra", data: { location: "after", token: "{" } },
                { type: "SwitchStatement", line: 1, column: 29, messageId: "extra", data: { location: "before", token: "}" } }
            ]
        },
        {
            code: "while (a) { foo(); }",
            output: "while (a) {foo();}",
            options: ["never"],
            errors: [
                { type: "BlockStatement", line: 1, column: 11, messageId: "extra", data: { location: "after", token: "{" } },
                { type: "BlockStatement", line: 1, column: 20, messageId: "extra", data: { location: "before", token: "}" } }
            ]
        },
        {
            code: "do { foo(); } while (a);",
            output: "do {foo();} while (a);",
            options: ["never"],
            errors: [
                { type: "BlockStatement", line: 1, column: 4, messageId: "extra", data: { location: "after", token: "{" } },
                { type: "BlockStatement", line: 1, column: 13, messageId: "extra", data: { location: "before", token: "}" } }
            ]
        },
        {
            code: "for (;;) { foo(); }",
            output: "for (;;) {foo();}",
            options: ["never"],
            errors: [
                { type: "BlockStatement", line: 1, column: 10, messageId: "extra", data: { location: "after", token: "{" } },
                { type: "BlockStatement", line: 1, column: 19, messageId: "extra", data: { location: "before", token: "}" } }
            ]
        },
        {
            code: "for (var a in b) { foo(); }",
            output: "for (var a in b) {foo();}",
            options: ["never"],
            errors: [
                { type: "BlockStatement", line: 1, column: 18, messageId: "extra", data: { location: "after", token: "{" } },
                { type: "BlockStatement", line: 1, column: 27, messageId: "extra", data: { location: "before", token: "}" } }
            ]
        },
        {
            code: "for (var a of b) { foo(); }",
            output: "for (var a of b) {foo();}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "BlockStatement", line: 1, column: 18, messageId: "extra", data: { location: "after", token: "{" } },
                { type: "BlockStatement", line: 1, column: 27, messageId: "extra", data: { location: "before", token: "}" } }
            ]
        },
        {
            code: "try { foo(); } catch (e) { foo(); } finally { foo(); }",
            output: "try {foo();} catch (e) {foo();} finally {foo();}",
            options: ["never"],
            errors: [
                { type: "BlockStatement", line: 1, column: 5, messageId: "extra", data: { location: "after", token: "{" } },
                { type: "BlockStatement", line: 1, column: 14, messageId: "extra", data: { location: "before", token: "}" } },
                { type: "BlockStatement", line: 1, column: 26, messageId: "extra", data: { location: "after", token: "{" } },
                { type: "BlockStatement", line: 1, column: 35, messageId: "extra", data: { location: "before", token: "}" } },
                { type: "BlockStatement", line: 1, column: 45, messageId: "extra", data: { location: "after", token: "{" } },
                { type: "BlockStatement", line: 1, column: 54, messageId: "extra", data: { location: "before", token: "}" } }
            ]
        },
        {
            code: "function foo() { bar(); }",
            output: "function foo() {bar();}",
            options: ["never"],
            errors: [
                { type: "BlockStatement", line: 1, column: 16, messageId: "extra", data: { location: "after", token: "{" } },
                { type: "BlockStatement", line: 1, column: 25, messageId: "extra", data: { location: "before", token: "}" } }
            ]
        },
        {
            code: "(function() { bar(); });",
            output: "(function() {bar();});",
            options: ["never"],
            errors: [
                { type: "BlockStatement", line: 1, column: 13, messageId: "extra", data: { location: "after", token: "{" } },
                { type: "BlockStatement", line: 1, column: 22, messageId: "extra", data: { location: "before", token: "}" } }
            ]
        },
        {
            code: "(() => { bar(); });",
            output: "(() => {bar();});",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "BlockStatement", line: 1, column: 8, messageId: "extra", data: { location: "after", token: "{" } },
                { type: "BlockStatement", line: 1, column: 17, messageId: "extra", data: { location: "before", token: "}" } }
            ]
        },
        {
            code: "if (a) { /* comment */ foo(); /* comment */ }",
            output: "if (a) {/* comment */ foo(); /* comment */}",
            options: ["never"],
            errors: [
                { type: "BlockStatement", line: 1, column: 8, messageId: "extra", data: { location: "after", token: "{" } },
                { type: "BlockStatement", line: 1, column: 45, messageId: "extra", data: { location: "before", token: "}" } }
            ]
        }
    ]
});
