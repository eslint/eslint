/**
 * @fileoverview Tests for no-script-url rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-script-url"),
    RuleTester = require("../../../lib/rule-tester/flat-rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-script-url", rule, {
    valid: [
        "var a = 'Hello World!';",
        "var a = 10;",
        "var url = 'xjavascript:'",
        {
            code: "var url = `xjavascript:`",
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "var url = `${foo}javascript:`",
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "var a = foo`javaScript:`;",
            languageOptions: { ecmaVersion: 6 }
        }
    ],
    invalid: [
        {
            code: "var a = 'javascript:void(0);';",
            errors: [
                { messageId: "unexpectedScriptURL", type: "Literal" }
            ]
        },
        {
            code: "var a = 'javascript:';",
            errors: [
                { messageId: "unexpectedScriptURL", type: "Literal" }
            ]
        },
        {
            code: "var a = `javascript:`;",
            languageOptions: { ecmaVersion: 6 },
            errors: [
                { messageId: "unexpectedScriptURL", type: "TemplateLiteral" }
            ]
        },
        {
            code: "var a = `JavaScript:`;",
            languageOptions: { ecmaVersion: 6 },
            errors: [
                { messageId: "unexpectedScriptURL", type: "TemplateLiteral" }
            ]
        }
    ]
});
