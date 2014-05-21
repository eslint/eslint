/**
 * @fileoverview Tests for no-script-url rule.
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-script-url", {
    valid: [
        "var a = 'Hello World!';",
        "var a = 10;",
        "var url = 'xjavascript:'"
    ],
    invalid: [
        {
            code: "var a = 'javascript:void(0);';",
            errors: [
                { message: "Script URL is a form of eval.", type: "Literal"}
            ]
        },
        {
            code: "var a = 'javascript:';",
            errors: [
                { message: "Script URL is a form of eval.", type: "Literal"}
            ]
        }
    ]
});
