/**
 * @fileoverview Tests for no-case-declarations rule.
 * @author Erik Arvidsson
 * @copyright 2015 Erik Arvidsson. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-case-declarations"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-case-declarations", rule, {
    valid: [
        {
            code: "switch (a) { case 1: { let x = 1; break; } default: { let x = 2; break; } }",
            ecmaFeatures: { blockBindings: true }
        },
        {
            code: "switch (a) { case 1: { const x = 1; break; } default: { const x = 2; break; } }",
            ecmaFeatures: { blockBindings: true }
        },
        {
            code: "switch (a) { case 1: { function f() {} break; } default: { function f() {} break; } }",
            ecmaFeatures: { blockBindings: true }
        },
        {
            code: "switch (a) { case 1: { class C {} break; } default: { class C {} break; } }",
            ecmaFeatures: { classes: true }
        }
    ],
    invalid: [
        {
            code: "switch (a) { case 1: let x = 1; break; }",
            errors: [{ message: "Unexpected lexical declaration in case block." }],
            ecmaFeatures: { blockBindings: true }
        },
        {
            code: "switch (a) { default: let x = 2; break; }",
            errors: [{ message: "Unexpected lexical declaration in case block." }],
            ecmaFeatures: { blockBindings: true }
        },
        {
            code: "switch (a) { case 1: const x = 1; break; }",
            errors: [{ message: "Unexpected lexical declaration in case block." }],
            ecmaFeatures: { blockBindings: true }
        },
        {
            code: "switch (a) { default: const x = 2; break; }",
            errors: [{ message: "Unexpected lexical declaration in case block." }],
            ecmaFeatures: { blockBindings: true }
        },
        {
            code: "switch (a) { case 1: function f() {} break; }",
            errors: [{ message: "Unexpected lexical declaration in case block." }],
            ecmaFeatures: { blockBindings: true }
        },
        {
            code: "switch (a) { default: function f() {} break; }",
            errors: [{ message: "Unexpected lexical declaration in case block." }],
            ecmaFeatures: { blockBindings: true }
        },
        {
            code: "switch (a) { case 1: class C {} break; }",
            errors: [{ message: "Unexpected lexical declaration in case block." }],
            ecmaFeatures: { classes: true }
        },
        {
            code: "switch (a) { default: class C {} break; }",
            errors: [{ message: "Unexpected lexical declaration in case block." }],
            ecmaFeatures: { classes: true }
        }
    ]
});
