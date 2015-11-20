/**
 * @fileoverview Tests for block-spacing rule.
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/block-spacing");
var RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("block-spacing", rule, {
    valid: [
        // default/always
        {code: "{ foo(); }", options: ["always"]},
        {code: "{ foo(); }"},
        {code: "{ foo();\n}"},
        {code: "{\nfoo(); }"},
        {code: "{\r\nfoo();\r\n}"},
        {code: "if (a) { foo(); }"},
        {code: "if (a) {} else { foo(); }"},
        {code: "switch (a) {}"},
        {code: "switch (a) { case 0: foo(); }"},
        {code: "while (a) { foo(); }"},
        {code: "do { foo(); } while (a);"},
        {code: "for (;;) { foo(); }"},
        {code: "for (var a in b) { foo(); }"},
        {code: "for (var a of b) { foo(); }", ecmaFeatures: {forOf: true}},
        {code: "try { foo(); } catch (e) { foo(); }"},
        {code: "function foo() { bar(); }"},
        {code: "(function() { bar(); });"},
        {code: "(() => { bar(); });", ecmaFeatures: {arrowFunctions: true}},
        {code: "if (a) { /* comment */ foo(); /* comment */ }"},
        {code: "if (a) { //comment\n foo(); }"},

        // never
        {code: "{foo();}", options: ["never"]},
        {code: "{foo();\n}", options: ["never"]},
        {code: "{\nfoo();}", options: ["never"]},
        {code: "{\r\nfoo();\r\n}", options: ["never"]},
        {code: "if (a) {foo();}", options: ["never"]},
        {code: "if (a) {} else {foo();}", options: ["never"]},
        {code: "switch (a) {}", options: ["never"]},
        {code: "switch (a) {case 0: foo();}", options: ["never"]},
        {code: "while (a) {foo();}", options: ["never"]},
        {code: "do {foo();} while (a);", options: ["never"]},
        {code: "for (;;) {foo();}", options: ["never"]},
        {code: "for (var a in b) {foo();}", options: ["never"]},
        {code: "for (var a of b) {foo();}", ecmaFeatures: {forOf: true}, options: ["never"]},
        {code: "try {foo();} catch (e) {foo();}", options: ["never"]},
        {code: "function foo() {bar();}", options: ["never"]},
        {code: "(function() {bar();});", options: ["never"]},
        {code: "(() => {bar();});", ecmaFeatures: {arrowFunctions: true}, options: ["never"]},
        {code: "if (a) {/* comment */ foo(); /* comment */}", options: ["never"]},
        {code: "if (a) { //comment\n foo();}", options: ["never"]}
    ],
    invalid: [
        // default/always
        {
            code: "{foo();}",
            output: "{ foo(); }",
            options: ["always"],
            errors: [
                {type: "BlockStatement", line: 1, column: 1, message: "Requires a space after \"{\"."},
                {type: "BlockStatement", line: 1, column: 8, message: "Requires a space before \"}\"."}
            ]
        },
        {
            code: "{foo();}",
            output: "{ foo(); }",
            errors: [
                {type: "BlockStatement", line: 1, column: 1, message: "Requires a space after \"{\"."},
                {type: "BlockStatement", line: 1, column: 8, message: "Requires a space before \"}\"."}
            ]
        },
        {
            code: "{ foo();}",
            output: "{ foo(); }",
            errors: [
                {type: "BlockStatement", line: 1, column: 9, message: "Requires a space before \"}\"."}
            ]
        },
        {
            code: "{foo(); }",
            output: "{ foo(); }",
            errors: [
                {type: "BlockStatement", line: 1, column: 1, message: "Requires a space after \"{\"."}
            ]
        },
        {
            code: "{\nfoo();}",
            output: "{\nfoo(); }",
            errors: [
                {type: "BlockStatement", line: 2, column: 7, message: "Requires a space before \"}\"."}
            ]
        },
        {
            code: "{foo();\n}",
            output: "{ foo();\n}",
            errors: [
                {type: "BlockStatement", line: 1, column: 1, message: "Requires a space after \"{\"."}
            ]
        },
        {
            code: "if (a) {foo();}",
            output: "if (a) { foo(); }",
            errors: [
                {type: "BlockStatement", line: 1, column: 8, message: "Requires a space after \"{\"."},
                {type: "BlockStatement", line: 1, column: 15, message: "Requires a space before \"}\"."}
            ]
        },
        {
            code: "if (a) {} else {foo();}",
            output: "if (a) {} else { foo(); }",
            errors: [
                {type: "BlockStatement", line: 1, column: 16, message: "Requires a space after \"{\"."},
                {type: "BlockStatement", line: 1, column: 23, message: "Requires a space before \"}\"."}
            ]
        },
        {
            code: "switch (a) {case 0: foo();}",
            output: "switch (a) { case 0: foo(); }",
            errors: [
                {type: "SwitchStatement", line: 1, column: 12, message: "Requires a space after \"{\"."},
                {type: "SwitchStatement", line: 1, column: 27, message: "Requires a space before \"}\"."}
            ]
        },
        {
            code: "while (a) {foo();}",
            output: "while (a) { foo(); }",
            errors: [
                {type: "BlockStatement", line: 1, column: 11, message: "Requires a space after \"{\"."},
                {type: "BlockStatement", line: 1, column: 18, message: "Requires a space before \"}\"."}
            ]
        },
        {
            code: "do {foo();} while (a);",
            output: "do { foo(); } while (a);",
            errors: [
                {type: "BlockStatement", line: 1, column: 4, message: "Requires a space after \"{\"."},
                {type: "BlockStatement", line: 1, column: 11, message: "Requires a space before \"}\"."}
            ]
        },
        {
            code: "for (;;) {foo();}",
            output: "for (;;) { foo(); }",
            errors: [
                {type: "BlockStatement", line: 1, column: 10, message: "Requires a space after \"{\"."},
                {type: "BlockStatement", line: 1, column: 17, message: "Requires a space before \"}\"."}
            ]
        },
        {
            code: "for (var a in b) {foo();}",
            output: "for (var a in b) { foo(); }",
            errors: [
                {type: "BlockStatement", line: 1, column: 18, message: "Requires a space after \"{\"."},
                {type: "BlockStatement", line: 1, column: 25, message: "Requires a space before \"}\"."}
            ]
        },
        {
            code: "for (var a of b) {foo();}",
            output: "for (var a of b) { foo(); }",
            ecmaFeatures: {forOf: true},
            errors: [
                {type: "BlockStatement", line: 1, column: 18, message: "Requires a space after \"{\"."},
                {type: "BlockStatement", line: 1, column: 25, message: "Requires a space before \"}\"."}
            ]
        },
        {
            code: "try {foo();} catch (e) {foo();} finally {foo();}",
            output: "try { foo(); } catch (e) { foo(); } finally { foo(); }",
            errors: [
                {type: "BlockStatement", line: 1, column: 5, message: "Requires a space after \"{\"."},
                {type: "BlockStatement", line: 1, column: 12, message: "Requires a space before \"}\"."},
                {type: "BlockStatement", line: 1, column: 24, message: "Requires a space after \"{\"."},
                {type: "BlockStatement", line: 1, column: 31, message: "Requires a space before \"}\"."},
                {type: "BlockStatement", line: 1, column: 41, message: "Requires a space after \"{\"."},
                {type: "BlockStatement", line: 1, column: 48, message: "Requires a space before \"}\"."}
            ]
        },
        {
            code: "function foo() {bar();}",
            output: "function foo() { bar(); }",
            errors: [
                {type: "BlockStatement", line: 1, column: 16, message: "Requires a space after \"{\"."},
                {type: "BlockStatement", line: 1, column: 23, message: "Requires a space before \"}\"."}
            ]
        },
        {
            code: "(function() {bar();});",
            output: "(function() { bar(); });",
            errors: [
                {type: "BlockStatement", line: 1, column: 13, message: "Requires a space after \"{\"."},
                {type: "BlockStatement", line: 1, column: 20, message: "Requires a space before \"}\"."}
            ]
        },
        {
            code: "(() => {bar();});",
            output: "(() => { bar(); });",
            ecmaFeatures: {arrowFunctions: true},
            errors: [
                {type: "BlockStatement", line: 1, column: 8, message: "Requires a space after \"{\"."},
                {type: "BlockStatement", line: 1, column: 15, message: "Requires a space before \"}\"."}
            ]
        },
        {
            code: "if (a) {/* comment */ foo(); /* comment */}",
            output: "if (a) { /* comment */ foo(); /* comment */ }",
            ecmaFeatures: {arrowFunctions: true},
            errors: [
                {type: "BlockStatement", line: 1, column: 8, message: "Requires a space after \"{\"."},
                {type: "BlockStatement", line: 1, column: 43, message: "Requires a space before \"}\"."}
            ]
        },
        {
            code: "if (a) {//comment\n foo(); }",
            output: "if (a) { //comment\n foo(); }",
            ecmaFeatures: {arrowFunctions: true},
            errors: [
                {type: "BlockStatement", line: 1, column: 8, message: "Requires a space after \"{\"."}
            ]
        },

        //----------------------------------------------------------------------
        // never
        {
            code: "{ foo(); }",
            output: "{foo();}",
            options: ["never"],
            errors: [
                {type: "BlockStatement", line: 1, column: 1, message: "Unexpected space(s) after \"{\"."},
                {type: "BlockStatement", line: 1, column: 10, message: "Unexpected space(s) before \"}\"."}
            ]
        },
        {
            code: "{ foo();}",
            output: "{foo();}",
            options: ["never"],
            errors: [
                {type: "BlockStatement", line: 1, column: 1, message: "Unexpected space(s) after \"{\"."}
            ]
        },
        {
            code: "{foo(); }",
            output: "{foo();}",
            options: ["never"],
            errors: [
                {type: "BlockStatement", line: 1, column: 9, message: "Unexpected space(s) before \"}\"."}
            ]
        },
        {
            code: "{\nfoo(); }",
            output: "{\nfoo();}",
            options: ["never"],
            errors: [
                {type: "BlockStatement", line: 2, column: 8, message: "Unexpected space(s) before \"}\"."}
            ]
        },
        {
            code: "{ foo();\n}",
            output: "{foo();\n}",
            options: ["never"],
            errors: [
                {type: "BlockStatement", line: 1, column: 1, message: "Unexpected space(s) after \"{\"."}
            ]
        },
        {
            code: "if (a) { foo(); }",
            output: "if (a) {foo();}",
            options: ["never"],
            errors: [
                {type: "BlockStatement", line: 1, column: 8, message: "Unexpected space(s) after \"{\"."},
                {type: "BlockStatement", line: 1, column: 17, message: "Unexpected space(s) before \"}\"."}
            ]
        },
        {
            code: "if (a) {} else { foo(); }",
            output: "if (a) {} else {foo();}",
            options: ["never"],
            errors: [
                {type: "BlockStatement", line: 1, column: 16, message: "Unexpected space(s) after \"{\"."},
                {type: "BlockStatement", line: 1, column: 25, message: "Unexpected space(s) before \"}\"."}
            ]
        },
        {
            code: "switch (a) { case 0: foo(); }",
            output: "switch (a) {case 0: foo();}",
            options: ["never"],
            errors: [
                {type: "SwitchStatement", line: 1, column: 12, message: "Unexpected space(s) after \"{\"."},
                {type: "SwitchStatement", line: 1, column: 29, message: "Unexpected space(s) before \"}\"."}
            ]
        },
        {
            code: "while (a) { foo(); }",
            output: "while (a) {foo();}",
            options: ["never"],
            errors: [
                {type: "BlockStatement", line: 1, column: 11, message: "Unexpected space(s) after \"{\"."},
                {type: "BlockStatement", line: 1, column: 20, message: "Unexpected space(s) before \"}\"."}
            ]
        },
        {
            code: "do { foo(); } while (a);",
            output: "do {foo();} while (a);",
            options: ["never"],
            errors: [
                {type: "BlockStatement", line: 1, column: 4, message: "Unexpected space(s) after \"{\"."},
                {type: "BlockStatement", line: 1, column: 13, message: "Unexpected space(s) before \"}\"."}
            ]
        },
        {
            code: "for (;;) { foo(); }",
            output: "for (;;) {foo();}",
            options: ["never"],
            errors: [
                {type: "BlockStatement", line: 1, column: 10, message: "Unexpected space(s) after \"{\"."},
                {type: "BlockStatement", line: 1, column: 19, message: "Unexpected space(s) before \"}\"."}
            ]
        },
        {
            code: "for (var a in b) { foo(); }",
            output: "for (var a in b) {foo();}",
            options: ["never"],
            errors: [
                {type: "BlockStatement", line: 1, column: 18, message: "Unexpected space(s) after \"{\"."},
                {type: "BlockStatement", line: 1, column: 27, message: "Unexpected space(s) before \"}\"."}
            ]
        },
        {
            code: "for (var a of b) { foo(); }",
            output: "for (var a of b) {foo();}",
            options: ["never"],
            ecmaFeatures: {forOf: true},
            errors: [
                {type: "BlockStatement", line: 1, column: 18, message: "Unexpected space(s) after \"{\"."},
                {type: "BlockStatement", line: 1, column: 27, message: "Unexpected space(s) before \"}\"."}
            ]
        },
        {
            code: "try { foo(); } catch (e) { foo(); } finally { foo(); }",
            output: "try {foo();} catch (e) {foo();} finally {foo();}",
            options: ["never"],
            errors: [
                {type: "BlockStatement", line: 1, column: 5, message: "Unexpected space(s) after \"{\"."},
                {type: "BlockStatement", line: 1, column: 14, message: "Unexpected space(s) before \"}\"."},
                {type: "BlockStatement", line: 1, column: 26, message: "Unexpected space(s) after \"{\"."},
                {type: "BlockStatement", line: 1, column: 35, message: "Unexpected space(s) before \"}\"."},
                {type: "BlockStatement", line: 1, column: 45, message: "Unexpected space(s) after \"{\"."},
                {type: "BlockStatement", line: 1, column: 54, message: "Unexpected space(s) before \"}\"."}
            ]
        },
        {
            code: "function foo() { bar(); }",
            output: "function foo() {bar();}",
            options: ["never"],
            errors: [
                {type: "BlockStatement", line: 1, column: 16, message: "Unexpected space(s) after \"{\"."},
                {type: "BlockStatement", line: 1, column: 25, message: "Unexpected space(s) before \"}\"."}
            ]
        },
        {
            code: "(function() { bar(); });",
            output: "(function() {bar();});",
            options: ["never"],
            errors: [
                {type: "BlockStatement", line: 1, column: 13, message: "Unexpected space(s) after \"{\"."},
                {type: "BlockStatement", line: 1, column: 22, message: "Unexpected space(s) before \"}\"."}
            ]
        },
        {
            code: "(() => { bar(); });",
            output: "(() => {bar();});",
            ecmaFeatures: {arrowFunctions: true},
            options: ["never"],
            errors: [
                {type: "BlockStatement", line: 1, column: 8, message: "Unexpected space(s) after \"{\"."},
                {type: "BlockStatement", line: 1, column: 17, message: "Unexpected space(s) before \"}\"."}
            ]
        },
        {
            code: "if (a) { /* comment */ foo(); /* comment */ }",
            output: "if (a) {/* comment */ foo(); /* comment */}",
            options: ["never"],
            errors: [
                {type: "BlockStatement", line: 1, column: 8, message: "Unexpected space(s) after \"{\"."},
                {type: "BlockStatement", line: 1, column: 45, message: "Unexpected space(s) before \"}\"."}
            ]
        }
    ]
});
