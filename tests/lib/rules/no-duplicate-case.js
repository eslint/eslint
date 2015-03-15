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
    ESLintTester = require("eslint-tester");

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
        }
    ]
});
