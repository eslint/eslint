/**
 * @fileoverview Tests for quote-props rule.
 * @author Mathias Bynens <http://mathiasbynens.be/>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/quote-props", {
    valid: [
        "({ '0': 0 })",
        "({ 'a': 0 })",
        "({ \"a\": 0 })",
        "({ 'null': 0 })",
        "({ 'true': 0 })",
        "({ 'a-b': 0 })",
        "({ 'if': 0 })",
        "({ '@': 0 })",
        { code: "({ a: 0, b: 0 })", args: [2, "as-needed"] },
        { code: "({ a: 0, 0: 0 })", args: [2, "as-needed"] },
        { code: "({ a: 0, true: 0 })", args: [2, "as-needed"] },
        { code: "({ a: 0, null: 0 })", args: [2, "as-needed"] },
        { code: "({ a: 0, '-b': 0 })", args: [2, "as-needed"] },
        { code: "({ a: 0, 'if': 0 })", args: [2, "as-needed"] },
        { code: "({ a: 0, '@': 0 })", args: [2, "as-needed"] },
        { code: "({ a: 0, 0: 0 })", args: [2, "as-needed"] },
        { code: "({ a: 0, '0x0': 0 })", args: [2, "as-needed"] },
    ],
    invalid: [
        {
            code: "({ a: 0 })",
            errors: [
                { message: "Unquoted property `a` found.", type: "Property"}
            ]
        }
    ]
});
