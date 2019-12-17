/**
 * @fileoverview Tests for lines-between-class-members rule.
 * @author 薛定谔的猫<hh_2013@foxmail.com>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/lines-between-class-members");
const { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
const alwaysError = { messageId: "always" };
const neverError = { messageId: "never" };

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

ruleTester.run("lines-between-class-members", rule, {
    valid: [
        "class foo{}",
        "class foo{;;}",
        "class foo{\n\n}",
        "class foo{constructor(){}\n}",
        "class foo{\nconstructor(){}}",

        "class foo{ bar(){}\n\nbaz(){}}",
        "class foo{ bar(){}\n\n/*comments*/baz(){}}",
        "class foo{ bar(){}\n\n//comments\nbaz(){}}",
        "class foo{ bar(){}\n//comments\n\nbaz(){}}",
        "class A{ foo() {} // a comment\n\nbar() {}}",
        "class A{ foo() {}\n/* a */ /* b */\n\nbar() {}}",
        "class A{ foo() {}/* a */ \n\n /* b */bar() {}}",

        "class A {\nfoo() {}\n/* comment */;\n;\n\nbar() {}\n}",
        "class A {\nfoo() {}\n// comment\n\n;\n;\nbar() {}\n}",

        "class foo{ bar(){}\n\n;;baz(){}}",
        "class foo{ bar(){};\n\nbaz(){}}",

        { code: "class foo{ bar(){}\nbaz(){}}", options: ["never"] },
        { code: "class foo{ bar(){}\n/*comments*/baz(){}}", options: ["never"] },
        { code: "class foo{ bar(){}\n//comments\nbaz(){}}", options: ["never"] },
        { code: "class foo{ bar(){}/* comments\n\n*/baz(){}}", options: ["never"] },
        { code: "class foo{ bar(){}/* \ncomments\n*/baz(){}}", options: ["never"] },
        { code: "class foo{ bar(){}\n/* \ncomments\n*/\nbaz(){}}", options: ["never"] },

        { code: "class foo{ bar(){}\n\nbaz(){}}", options: ["always"] },
        { code: "class foo{ bar(){}\n\n/*comments*/baz(){}}", options: ["always"] },
        { code: "class foo{ bar(){}\n\n//comments\nbaz(){}}", options: ["always"] },

        { code: "class foo{ bar(){}\nbaz(){}}", options: ["always", { exceptAfterSingleLine: true }] },
        { code: "class foo{ bar(){\n}\n\nbaz(){}}", options: ["always", { exceptAfterSingleLine: true }] }
    ],
    invalid: [
        {
            code: "class foo{ bar(){}\nbaz(){}}",
            output: "class foo{ bar(){}\n\nbaz(){}}",
            options: ["always"],
            errors: [alwaysError]
        }, {
            code: "class foo{ bar(){}\n\nbaz(){}}",
            output: "class foo{ bar(){}\nbaz(){}}",
            options: ["never"],
            errors: [neverError]
        }, {
            code: "class foo{ bar(){\n}\nbaz(){}}",
            output: "class foo{ bar(){\n}\n\nbaz(){}}",
            options: ["always", { exceptAfterSingleLine: true }],
            errors: [alwaysError]
        }, {
            code: "class foo{ bar(){\n}\n/* comment */\nbaz(){}}",
            output: "class foo{ bar(){\n}\n\n/* comment */\nbaz(){}}",
            options: ["always", { exceptAfterSingleLine: true }],
            errors: [alwaysError]
        }, {
            code: "class foo{ bar(){}\n\n// comment\nbaz(){}}",
            output: "class foo{ bar(){}\n// comment\nbaz(){}}",
            options: ["never"],
            errors: [neverError]
        }, {
            code: "class foo{ bar(){}\n\n/* comment */\nbaz(){}}",
            output: "class foo{ bar(){}\n/* comment */\nbaz(){}}",
            options: ["never"],
            errors: [neverError]
        }, {
            code: "class foo{ bar(){}\n/* comment-1 */\n\n/* comment-2 */\nbaz(){}}",
            output: "class foo{ bar(){}\n/* comment-1 */\n/* comment-2 */\nbaz(){}}",
            options: ["never"],
            errors: [neverError]
        }, {
            code: "class foo{ bar(){}\n\n/* comment */\n\nbaz(){}}",
            output: null,
            options: ["never"],
            errors: [neverError]
        }, {
            code: "class foo{ bar(){}\n\n// comment\n\nbaz(){}}",
            output: null,
            options: ["never"],
            errors: [neverError]
        }, {
            code: "class foo{ bar(){}\n/* comment-1 */\n\n/* comment-2 */\n\n/* comment-3 */\nbaz(){}}",
            output: null,
            options: ["never"],
            errors: [neverError]
        }, {
            code: "class foo{ bar(){}\n/* comment-1 */\n\n;\n\n/* comment-3 */\nbaz(){}}",
            output: null,
            options: ["never"],
            errors: [neverError]
        }, {
            code: "class A {\nfoo() {}// comment\n;\n/* comment */\nbar() {}\n}",
            output: "class A {\nfoo() {}// comment\n\n;\n/* comment */\nbar() {}\n}",
            options: ["always"],
            errors: [alwaysError]
        }, {
            code: "class A {\nfoo() {}\n/* comment */;\n;\n/* comment */\nbar() {}\n}",
            output: "class A {\nfoo() {}\n\n/* comment */;\n;\n/* comment */\nbar() {}\n}",
            options: ["always"],
            errors: [alwaysError]
        }, {
            code: "class foo{ bar(){};\nbaz(){}}",
            output: "class foo{ bar(){};\n\nbaz(){}}",
            options: ["always"],
            errors: [alwaysError]
        }, {
            code: "class foo{ bar(){} // comment \nbaz(){}}",
            output: "class foo{ bar(){} // comment \n\nbaz(){}}",
            options: ["always"],
            errors: [alwaysError]
        }, {
            code: "class A {\nfoo() {}\n/* comment */;\n;\nbar() {}\n}",
            output: "class A {\nfoo() {}\n\n/* comment */;\n;\nbar() {}\n}",
            options: ["always"],
            errors: [alwaysError]
        }
    ]
});
