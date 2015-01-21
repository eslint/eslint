/**
 * @fileoverview Tests for quote-props rule.
 * @author Mathias Bynens <http://mathiasbynens.be/>
 */

"use strict";

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
        { code: "({ a: 0, '0x0': 0 })", args: [2, "as-needed"] }
    ],
    invalid: [{
        code: "({ a: 0 })",
        errors: [{
            message: "Unquoted property `a` found.", type: "Property"
        }]
    }, {
        code: "({ 0: '0' })",
        errors: [{
            message: "Unquoted property `0` found.", type: "Property"
        }]
    }, {
        code: "({ 'a': 0 })",
        args: [2, "as-needed"],
        errors: [{
            message: "Unnecessarily quoted property `a` found.", type: "Property"
        }]
    }, {
        code: "({ 'null': 0 })",
        args: [2, "as-needed"],
        errors: [{
            message: "Unnecessarily quoted property `null` found.", type: "Property"
        }]
    }, {
        code: "({ 'true': 0 })",
        args: [2, "as-needed"],
        errors: [{
            message: "Unnecessarily quoted property `true` found.", type: "Property"
        }]
    }, {
        code: "({ '0': 0 })",
        args: [2, "as-needed"],
        errors: [{
            message: "Unnecessarily quoted property `0` found.", type: "Property"
        }]
    }]
});
