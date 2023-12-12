/**
 * @fileoverview Tests for no-alert rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-alert"),
    RuleTester = require("../../../lib/rule-tester/flat-rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    languageOptions: {
        ecmaVersion: 5,
        sourceType: "script"
    }
});

ruleTester.run("no-alert", rule, {
    valid: [
        "a[o.k](1)",
        "foo.alert(foo)",
        "foo.confirm(foo)",
        "foo.prompt(foo)",
        "function alert() {} alert();",
        "var alert = function() {}; alert();",
        "function foo() { var alert = bar; alert(); }",
        "function foo(alert) { alert(); }",
        "var alert = function() {}; function test() { alert(); }",
        "function foo() { var alert = function() {}; function test() { alert(); } }",
        "function confirm() {} confirm();",
        "function prompt() {} prompt();",
        "window[alert]();",
        "function foo() { this.alert(); }",
        "function foo() { var window = bar; window.alert(); }",
        "globalThis.alert();",
        { code: "globalThis['alert']();", languageOptions: { ecmaVersion: 6 } },
        { code: "globalThis.alert();", languageOptions: { ecmaVersion: 2017 } },
        { code: "var globalThis = foo; globalThis.alert();", languageOptions: { ecmaVersion: 2020 } },
        { code: "function foo() { var globalThis = foo; globalThis.alert(); }", languageOptions: { ecmaVersion: 2020 } }
    ],
    invalid: [
        {
            code: "alert(foo)",
            errors: [{ messageId: "unexpected", data: { name: "alert" }, type: "CallExpression", line: 1, column: 1 }]
        },
        {
            code: "window.alert(foo)",
            errors: [{ messageId: "unexpected", data: { name: "alert" }, type: "CallExpression", line: 1, column: 1 }]
        },
        {
            code: "window['alert'](foo)",
            errors: [{ messageId: "unexpected", data: { name: "alert" }, type: "CallExpression", line: 1, column: 1 }]
        },
        {
            code: "confirm(foo)",
            errors: [{ messageId: "unexpected", data: { name: "confirm" }, type: "CallExpression", line: 1, column: 1 }]
        },
        {
            code: "window.confirm(foo)",
            errors: [{ messageId: "unexpected", data: { name: "confirm" }, type: "CallExpression", line: 1, column: 1 }]
        },
        {
            code: "window['confirm'](foo)",
            errors: [{ messageId: "unexpected", data: { name: "confirm" }, type: "CallExpression", line: 1, column: 1 }]
        },
        {
            code: "prompt(foo)",
            errors: [{ messageId: "unexpected", data: { name: "prompt" }, type: "CallExpression", line: 1, column: 1 }]
        },
        {
            code: "window.prompt(foo)",
            errors: [{ messageId: "unexpected", data: { name: "prompt" }, type: "CallExpression", line: 1, column: 1 }]
        },
        {
            code: "window['prompt'](foo)",
            errors: [{ messageId: "unexpected", data: { name: "prompt" }, type: "CallExpression", line: 1, column: 1 }]
        },
        {
            code: "function alert() {} window.alert(foo)",
            errors: [{ messageId: "unexpected", data: { name: "alert" }, type: "CallExpression", line: 1, column: 21 }]
        },
        {
            code: "var alert = function() {};\nwindow.alert(foo)",
            errors: [{ messageId: "unexpected", data: { name: "alert" }, type: "CallExpression", line: 2, column: 1 }]
        },
        {
            code: "function foo(alert) { window.alert(); }",
            errors: [{ messageId: "unexpected", data: { name: "alert" }, type: "CallExpression", line: 1, column: 23 }]
        },
        {
            code: "function foo() { alert(); }",
            errors: [{ messageId: "unexpected", data: { name: "alert" }, type: "CallExpression", line: 1, column: 18 }]
        },
        {
            code: "function foo() { var alert = function() {}; }\nalert();",
            errors: [{ messageId: "unexpected", data: { name: "alert" }, type: "CallExpression", line: 2, column: 1 }]
        },
        {
            code: "this.alert(foo)",
            errors: [{ messageId: "unexpected", data: { name: "alert" }, type: "CallExpression", line: 1, column: 1 }]
        },
        {
            code: "this['alert'](foo)",
            errors: [{ messageId: "unexpected", data: { name: "alert" }, type: "CallExpression", line: 1, column: 1 }]
        },
        {
            code: "function foo() { var window = bar; window.alert(); }\nwindow.alert();",
            errors: [{ messageId: "unexpected", data: { name: "alert" }, type: "CallExpression", line: 2, column: 1 }]
        },
        {
            code: "globalThis['alert'](foo)",
            languageOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpected", data: { name: "alert" }, type: "CallExpression", line: 1, column: 1 }]
        },
        {
            code: "globalThis.alert();",
            languageOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpected", data: { name: "alert" }, type: "CallExpression", line: 1, column: 1 }]
        },
        {
            code: "function foo() { var globalThis = bar; globalThis.alert(); }\nglobalThis.alert();",
            languageOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpected", data: { name: "alert" }, type: "CallExpression", line: 2, column: 1 }]
        },

        // Optional chaining
        {
            code: "window?.alert(foo)",
            languageOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpected", data: { name: "alert" } }]
        },
        {
            code: "(window?.alert)(foo)",
            languageOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpected", data: { name: "alert" } }]
        }
    ]
});
