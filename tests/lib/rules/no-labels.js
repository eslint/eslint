/**
 * @fileoverview Disallow Labeled Statements
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-labels"),
    { RuleTester } = require("../../../lib/rule-tester");

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
                messageId: "unexpectedLabel",
                type: "LabeledStatement"
            }]
        },
        {
            code: "label: while (true) { break label; }",
            errors: [
                {
                    messageId: "unexpectedLabel",
                    type: "LabeledStatement"
                },
                {
                    messageId: "unexpectedLabelInBreak",
                    type: "BreakStatement"
                }
            ]
        },
        {
            code: "label: while (true) { continue label; }",
            errors: [
                {
                    messageId: "unexpectedLabel",
                    type: "LabeledStatement"
                },
                {
                    messageId: "unexpectedLabelInContinue",
                    type: "ContinueStatement"
                }
            ]
        },

        {
            code: "A: var foo = 0;",
            errors: [{
                messageId: "unexpectedLabel",
                type: "LabeledStatement"
            }]
        },
        {
            code: "A: break A;",
            errors: [
                {
                    messageId: "unexpectedLabel",
                    type: "LabeledStatement"
                },
                {
                    messageId: "unexpectedLabelInBreak",
                    type: "BreakStatement"
                }
            ]
        },
        {
            code: "A: { if (foo()) { break A; } bar(); };",
            errors: [
                {
                    messageId: "unexpectedLabel",
                    type: "LabeledStatement"
                },
                {
                    messageId: "unexpectedLabelInBreak",
                    type: "BreakStatement"
                }
            ]
        },
        {
            code: "A: if (a) { if (foo()) { break A; } bar(); };",
            errors: [
                {
                    messageId: "unexpectedLabel",
                    type: "LabeledStatement"
                },
                {
                    messageId: "unexpectedLabelInBreak",
                    type: "BreakStatement"
                }
            ]
        },
        {
            code: "A: switch (a) { case 0: break A; default: break; };",
            errors: [
                {
                    messageId: "unexpectedLabel",
                    type: "LabeledStatement"
                },
                {
                    messageId: "unexpectedLabelInBreak",
                    type: "BreakStatement"
                }
            ]
        },
        {
            code: "A: switch (a) { case 0: B: { break A; } default: break; };",
            errors: [
                {
                    messageId: "unexpectedLabel",
                    type: "LabeledStatement"
                },
                {
                    messageId: "unexpectedLabel",
                    type: "LabeledStatement"
                },
                {
                    messageId: "unexpectedLabelInBreak",
                    type: "BreakStatement"
                }
            ]
        },

        // {allowLoop: true} option.
        {
            code: "A: var foo = 0;",
            options: [{ allowLoop: true }],
            errors: [{
                messageId: "unexpectedLabel",
                type: "LabeledStatement"
            }]
        },
        {
            code: "A: break A;",
            options: [{ allowLoop: true }],
            errors: [
                {
                    messageId: "unexpectedLabel",
                    type: "LabeledStatement"
                },
                {
                    messageId: "unexpectedLabelInBreak",
                    type: "BreakStatement"
                }
            ]
        },
        {
            code: "A: { if (foo()) { break A; } bar(); };",
            options: [{ allowLoop: true }],
            errors: [
                {
                    messageId: "unexpectedLabel",
                    type: "LabeledStatement"
                },
                {
                    messageId: "unexpectedLabelInBreak",
                    type: "BreakStatement"
                }
            ]
        },
        {
            code: "A: if (a) { if (foo()) { break A; } bar(); };",
            options: [{ allowLoop: true }],
            errors: [
                {
                    messageId: "unexpectedLabel",
                    type: "LabeledStatement"
                },
                {
                    messageId: "unexpectedLabelInBreak",
                    type: "BreakStatement"
                }
            ]
        },
        {
            code: "A: switch (a) { case 0: break A; default: break; };",
            options: [{ allowLoop: true }],
            errors: [
                {
                    messageId: "unexpectedLabel",
                    type: "LabeledStatement"
                },
                {
                    messageId: "unexpectedLabelInBreak",
                    type: "BreakStatement"
                }
            ]
        },

        // {allowSwitch: true} option.
        {
            code: "A: var foo = 0;",
            options: [{ allowSwitch: true }],
            errors: [{
                messageId: "unexpectedLabel",
                type: "LabeledStatement"
            }]
        },
        {
            code: "A: break A;",
            options: [{ allowSwitch: true }],
            errors: [
                {
                    messageId: "unexpectedLabel",
                    type: "LabeledStatement"
                }, {
                    messageId: "unexpectedLabelInBreak",
                    type: "BreakStatement"
                }
            ]
        },
        {
            code: "A: { if (foo()) { break A; } bar(); };",
            options: [{ allowSwitch: true }],
            errors: [
                {
                    messageId: "unexpectedLabel",
                    type: "LabeledStatement"
                }, {
                    messageId: "unexpectedLabelInBreak",
                    type: "BreakStatement"
                }
            ]
        },
        {
            code: "A: if (a) { if (foo()) { break A; } bar(); };",
            options: [{ allowSwitch: true }],
            errors: [
                {
                    messageId: "unexpectedLabel",
                    type: "LabeledStatement"
                }, {
                    messageId: "unexpectedLabelInBreak",
                    type: "BreakStatement"
                }
            ]
        },
        {
            code: "A: while (a) { break A; }",
            options: [{ allowSwitch: true }],
            errors: [
                {
                    messageId: "unexpectedLabel",
                    type: "LabeledStatement"
                }, {
                    messageId: "unexpectedLabelInBreak",
                    type: "BreakStatement"
                }
            ]
        },
        {
            code: "A: do { if (b) { break A; } } while (a);",
            options: [{ allowSwitch: true }],
            errors: [
                {
                    messageId: "unexpectedLabel",
                    type: "LabeledStatement"
                }, {
                    messageId: "unexpectedLabelInBreak",
                    type: "BreakStatement"
                }
            ]
        },
        {
            code: "A: for (var a in obj) { for (;;) { switch (a) { case 0: break A; } } }",
            options: [{ allowSwitch: true }],
            errors: [
                {
                    messageId: "unexpectedLabel",
                    type: "LabeledStatement"
                }, {
                    messageId: "unexpectedLabelInBreak",
                    type: "BreakStatement"
                }
            ]
        }
    ]
});
