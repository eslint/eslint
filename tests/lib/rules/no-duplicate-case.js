/**
 * @fileoverview Tests for no-duplicate-case rule.
 * @author Dieter Oberkofler
 * @copyright 2015 Dieter Oberkofler. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("../../../lib/testers/eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-duplicate-case", {
    valid: [
        {
            code: "var a = 1; switch (a) {case 1: break; case 2: break; default: break;}",
            args: 2
        },
        {
            code: "var a = 1; switch (a) {case 1: break; case '1': break; default: break;}",
            args: 2
        },
        {
            code: "var a = 1; switch (a) {case 1: break; case true: break; default: break;}",
            args: 2
        },
        {
            code: "var a = 1; switch (a) {default: break;}",
            args: 2
        },
        {
            code: "var a = 1, p = {p: {p1: 1, p2: 1}}; switch (a) {case p.p.p1: break; case p.p.p2: break; default: break;}",
            args: 2
        },
        {
            code: "var a = 1, f = function(b) { return b ? { p1: 1 } : { p1: 2 }; }; switch (a) {case f(true).p1: break; case f(true, false).p1: break; default: break;}",
            args: 2
        },
        {
            code: "var a = 1, f = function(s) { return { p1: s } }; switch (a) {case f(a + 1).p1: break; case f(a + 2).p1: break; default: break;}",
            args: 2
        },
        {
            code: "var a = 1, f = function(s) { return { p1: s } }; switch (a) {case f(a == 1 ? 2 : 3).p1: break; case f(a === 1 ? 2 : 3).p1: break; default: break;}",
            args: 2
        },
        {
            code: "var a = 1, f1 = function() { return { p1: 1 } }, f2 = function() { return { p1: 2 } }; switch (a) {case f1().p1: break; case f2().p1: break; default: break;}",
            args: 2
        }
    ],
    invalid: [
        {
            code: "var a = 1; switch (a) {case 1: break; case 1: break; case 2: break; default: break;}",
            args: 2,
            errors: [{
                message: "Duplicate case label.",
                type: "SwitchCase"
            }]
        },
        {
            code: "var a = '1'; switch (a) {case '1': break; case '1': break; case '2': break; default: break;}",
            args: 2,
            errors: [{
                message: "Duplicate case label.",
                type: "SwitchCase"
            }]
        },
        {
            code: "var a = 1, one = 1; switch (a) {case one: break; case one: break; case 2: break; default: break;}",
            args: 2,
            errors: [{
                message: "Duplicate case label.",
                type: "SwitchCase"
            }]
        },
        {
            code: "var a = 1, p = {p: {p1: 1, p2: 1}}; switch (a) {case p.p.p1: break; case p.p.p1: break; default: break;}",
            args: 2,
            errors: [{
                message: "Duplicate case label.",
                type: "SwitchCase"
            }]
        },
        {
            code: "var a = 1, f = function(b) { return b ? { p1: 1 } : { p1: 2 }; }; switch (a) {case f(true).p1: break; case f(true).p1: break; default: break;}",
            args: 2,
            errors: [{
                message: "Duplicate case label.",
                type: "SwitchCase"
            }]
        },
        {
            code: "var a = 1, f = function(s) { return { p1: s } }; switch (a) {case f(a + 1).p1: break; case f(a + 1).p1: break; default: break;}",
            args: 2,
            errors: [{
                message: "Duplicate case label.",
                type: "SwitchCase"
            }]
        },
        {
            code: "var a = 1, f = function(s) { return { p1: s } }; switch (a) {case f(a === 1 ? 2 : 3).p1: break; case f(a === 1 ? 2 : 3).p1: break; default: break;}",
            args: 2,
            errors: [{
                message: "Duplicate case label.",
                type: "SwitchCase"
            }]
        },
        {
            code: "var a = 1, f1 = function() { return { p1: 1 } }; switch (a) {case f1().p1: break; case f1().p1: break; default: break;}",
            args: 2,
            errors: [{
                message: "Duplicate case label.",
                type: "SwitchCase"
            }]
        }
    ]
});
