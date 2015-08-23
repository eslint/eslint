/**
 * @fileoverview Tests for quote-props rule.
 * @author Mathias Bynens <http://mathiasbynens.be/>
 * @copyright 2015 Tomasz Olędzki. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/quote-props"),
    RuleTester = require("../../../lib/testers/rule-tester");

var ruleTester = new RuleTester();
ruleTester.run("quote-props", rule, {
    valid: [
        "({ '0': 0 })",
        "({ 'a': 0 })",
        "({ \"a\": 0 })",
        "({ 'null': 0 })",
        "({ 'true': 0 })",
        "({ 'a-b': 0 })",
        "({ 'if': 0 })",
        "({ '@': 0 })",

        { code: "({ 'a': 0, b(){} })", ecmaFeatures: { objectLiteralShorthandMethods: true }},
        { code: "({ a: 0, b(){} })", options: ["as-needed"], ecmaFeatures: { objectLiteralShorthandMethods: true } },
        { code: "({ a: 0, b: 0 })", options: ["as-needed"] },
        { code: "({ a: 0, 0: 0 })", options: ["as-needed"] },
        { code: "({ a: 0, true: 0 })", options: ["as-needed"] },
        { code: "({ a: 0, null: 0 })", options: ["as-needed"] },
        { code: "({ a: 0, if: 0 })", options: ["as-needed"] },
        { code: "({ a: 0, while: 0 })", options: ["as-needed"] },
        { code: "({ a: 0, volatile: 0 })", options: ["as-needed"] },
        { code: "({ a: 0, '-b': 0 })", options: ["as-needed"] },
        { code: "({ a: 0, '@': 0 })", options: ["as-needed"] },
        { code: "({ a: 0, 0: 0 })", options: ["as-needed"] },
        { code: "({ a: 0, '0x0': 0 })", options: ["as-needed"] },
        { code: "({ 'a': 0, '-b': 0 })", options: ["consistent"] },
        { code: "({ 'true': 0, 'b': 0 })", options: ["consistent"] },
        { code: "({ null: 0, a: 0 })", options: ["consistent"] },
        { code: "({ a: 0, b: 0 })", options: ["consistent"] },
        { code: "({ a: 0, b: 0 })", options: ["consistent-as-needed"] },
        { code: "({ a: 0, null: 0 })", options: ["consistent-as-needed"] },
        { code: "({ 'a': 0, '-b': 0 })", options: ["consistent-as-needed"] },
        { code: "({ '@': 0, 'B': 0 })", options: ["consistent-as-needed"] },
        { code: "({ a: 0, 'if': 0 })", options: ["as-needed", {keywords: true}] },
        { code: "({ a: 0, 'while': 0 })", options: ["as-needed", {keywords: true}] },
        { code: "({ a: 0, 'volatile': 0 })", options: ["as-needed", {keywords: true}] },
        { code: "({'unnecessary': 1, 'if': 0})", options: ["as-needed", {keywords: true, unnecessary: false}] }
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
        options: ["as-needed"],
        errors: [{
            message: "Unnecessarily quoted property `a` found.", type: "Property"
        }]
    }, {
        code: "({ 'null': 0 })",
        options: ["as-needed"],
        errors: [{
            message: "Unnecessarily quoted property `null` found.", type: "Property"
        }]
    }, {
        code: "({ 'true': 0 })",
        options: ["as-needed"],
        errors: [{
            message: "Unnecessarily quoted property `true` found.", type: "Property"
        }]
    }, {
        code: "({ '0': 0 })",
        options: ["as-needed"],
        errors: [{
            message: "Unnecessarily quoted property `0` found.", type: "Property"
        }]
    }, {
        code: "({ '-a': 0, b: 0 })",
        options: ["consistent"],
        errors: [{
            message: "Inconsistently quoted property `b` found.", type: "ObjectExpression"
        }]
    }, {
        code: "({ a: 0, 'b': 0 })",
        options: ["consistent"],
        errors: [{
            message: "Inconsistently quoted property `b` found.", type: "ObjectExpression"
        }]
    }, {
        code: "({ '-a': 0, b: 0 })",
        options: ["consistent-as-needed"],
        errors: [{
            message: "Inconsistently quoted property `b` found.", type: "ObjectExpression"
        }]
    }, {
        code: "({ 'a': 0, 'b': 0 })",
        options: ["consistent-as-needed"],
        errors: [{
            message: "Properties shouldn't be quoted as all quotes are redundant.", type: "ObjectExpression"
        }]
    }, {
        code: "({ 'true': 0, 'null': 0 })",
        options: ["consistent-as-needed"],
        errors: [{
            message: "Properties shouldn't be quoted as all quotes are redundant.", type: "ObjectExpression"
        }]
    }, {
        code: "({'if': 0})",
        options: ["as-needed"],
        errors: [{
            message: "Unnecessarily quoted property `if` found.", type: "Property"
        }]
    }, {
        code: "({'synchronized': 0})",
        options: ["as-needed"],
        errors: [{
            message: "Unnecessarily quoted property `synchronized` found.", type: "Property"
        }]
    }, {
        code: "({while: 0})",
        options: ["as-needed", {keywords: true}],
        errors: [{
            message: "Unquoted reserved word `while` used as key.", type: "Property"
        }]
    }, {
        code: "({'unnecessary': 1, if: 0})",
        options: ["as-needed", {keywords: true, unnecessary: false}],
        errors: [{
            message: "Unquoted reserved word `if` used as key.", type: "Property"
        }]
    }]
});
