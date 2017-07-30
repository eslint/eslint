/**
 * @fileoverview Disallow Labeled Statements
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-labels"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-labels", rule, {

    valid: [
        "var f = { label: foo ()}",
        "while (true) {}",
        "while (true) { break; }",
        "while (true) { continue; }",

        // {allowLoop: true} option.
        { code: "A: while (a) { break A; }", options: [{ allowLoop: true }] },
        { code: "A: do { if (b) { break A; } } while (a);", options: [{ allowLoop: true }] },
        { code: "A: for (var a in obj) { for (;;) { switch (a) { case 0: continue A; } } }", options: [{ allowLoop: true }] },

        // {allowSwitch: true} option.
        { code: "A: switch (a) { case 0: break A; }", options: [{ allowSwitch: true }] }
    ],

    invalid: [
        {
            code: "label: while(true) {}",
            errors: [{
                message: "Unexpected labeled statement.",
                type: "LabeledStatement"
            }]
        },
        {
            code: "label: while (true) { break label; }",
            errors: [{
                message: "Unexpected labeled statement.",
                type: "LabeledStatement"
            }, {
                message: "Unexpected label in break statement.",
                type: "BreakStatement"
            }]
        },
        {
            code: "label: while (true) { continue label; }",
            errors: [{
                message: "Unexpected labeled statement.",
                type: "LabeledStatement"
            }, {
                message: "Unexpected label in continue statement.",
                type: "ContinueStatement"
            }]
        },

        {
            code: "A: var foo = 0;",
            errors: [{ message: "Unexpected labeled statement.", type: "LabeledStatement" }]
        },
        {
            code: "A: break A;",
            errors: [{ message: "Unexpected labeled statement.", type: "LabeledStatement" }, { message: "Unexpected label in break statement.", type: "BreakStatement" }]
        },
        {
            code: "A: { if (foo()) { break A; } bar(); };",
            errors: [{ message: "Unexpected labeled statement.", type: "LabeledStatement" }, { message: "Unexpected label in break statement.", type: "BreakStatement" }]
        },
        {
            code: "A: if (a) { if (foo()) { break A; } bar(); };",
            errors: [{ message: "Unexpected labeled statement.", type: "LabeledStatement" }, { message: "Unexpected label in break statement.", type: "BreakStatement" }]
        },
        {
            code: "A: switch (a) { case 0: break A; default: break; };",
            errors: [{ message: "Unexpected labeled statement.", type: "LabeledStatement" }, { message: "Unexpected label in break statement.", type: "BreakStatement" }]
        },
        {
            code: "A: switch (a) { case 0: B: { break A; } default: break; };",
            errors: [{ message: "Unexpected labeled statement.", type: "LabeledStatement" }, { message: "Unexpected labeled statement.", type: "LabeledStatement" }, { message: "Unexpected label in break statement.", type: "BreakStatement" }]
        },

        // {allowLoop: true} option.
        {
            code: "A: var foo = 0;",
            options: [{ allowLoop: true }],
            errors: [{ message: "Unexpected labeled statement.", type: "LabeledStatement" }]
        },
        {
            code: "A: break A;",
            options: [{ allowLoop: true }],
            errors: [{ message: "Unexpected labeled statement.", type: "LabeledStatement" }, { message: "Unexpected label in break statement.", type: "BreakStatement" }]
        },
        {
            code: "A: { if (foo()) { break A; } bar(); };",
            options: [{ allowLoop: true }],
            errors: [{ message: "Unexpected labeled statement.", type: "LabeledStatement" }, { message: "Unexpected label in break statement.", type: "BreakStatement" }]
        },
        {
            code: "A: if (a) { if (foo()) { break A; } bar(); };",
            options: [{ allowLoop: true }],
            errors: [{ message: "Unexpected labeled statement.", type: "LabeledStatement" }, { message: "Unexpected label in break statement.", type: "BreakStatement" }]
        },
        {
            code: "A: switch (a) { case 0: break A; default: break; };",
            options: [{ allowLoop: true }],
            errors: [{ message: "Unexpected labeled statement.", type: "LabeledStatement" }, { message: "Unexpected label in break statement.", type: "BreakStatement" }]
        },

        // {allowSwitch: true} option.
        {
            code: "A: var foo = 0;",
            options: [{ allowSwitch: true }],
            errors: [{ message: "Unexpected labeled statement.", type: "LabeledStatement" }]
        },
        {
            code: "A: break A;",
            options: [{ allowSwitch: true }],
            errors: [{ message: "Unexpected labeled statement.", type: "LabeledStatement" }, { message: "Unexpected label in break statement.", type: "BreakStatement" }]
        },
        {
            code: "A: { if (foo()) { break A; } bar(); };",
            options: [{ allowSwitch: true }],
            errors: [{ message: "Unexpected labeled statement.", type: "LabeledStatement" }, { message: "Unexpected label in break statement.", type: "BreakStatement" }]
        },
        {
            code: "A: if (a) { if (foo()) { break A; } bar(); };",
            options: [{ allowSwitch: true }],
            errors: [{ message: "Unexpected labeled statement.", type: "LabeledStatement" }, { message: "Unexpected label in break statement.", type: "BreakStatement" }]
        },
        {
            code: "A: while (a) { break A; }",
            options: [{ allowSwitch: true }],
            errors: [{ message: "Unexpected labeled statement.", type: "LabeledStatement" }, { message: "Unexpected label in break statement.", type: "BreakStatement" }]
        },
        {
            code: "A: do { if (b) { break A; } } while (a);",
            options: [{ allowSwitch: true }],
            errors: [{ message: "Unexpected labeled statement.", type: "LabeledStatement" }, { message: "Unexpected label in break statement.", type: "BreakStatement" }]
        },
        {
            code: "A: for (var a in obj) { for (;;) { switch (a) { case 0: break A; } } }",
            options: [{ allowSwitch: true }],
            errors: [{ message: "Unexpected labeled statement.", type: "LabeledStatement" }, { message: "Unexpected label in break statement.", type: "BreakStatement" }]
        }
    ]
});
