/**
 * @fileoverview require default case in switch statements
 * @author Aliaksei Shytkin
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/default-case"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("default-case", rule, {

    valid: [
        "switch (a) { case 1: break; default: break; }",
        "switch (a) { case 1: break; case 2: default: break; }",
        "switch (a) { case 1: break; default: break; \n //no default \n }",
        "switch (a) { \n    case 1: break; \n\n//oh-oh \n // no default\n }",
        "switch (a) { \n    case 1: \n\n// no default\n }",
        "switch (a) { \n    case 1: \n\n// No default\n }",
        "switch (a) { \n    case 1: \n\n// no deFAUlt\n }",
        "switch (a) { \n    case 1: \n\n// NO DEFAULT\n }",
        "switch (a) { \n    case 1: a = 4; \n\n// no default\n }",
        "switch (a) { \n    case 1: a = 4; \n\n/* no default */\n }",
        "switch (a) { \n    case 1: a = 4; break; break; \n\n// no default\n }",
        "switch (a) { // no default\n }",
        "switch (a) { }",
        {
            code: "switch (a) { case 1: break; default: break; }",
            options: [{
                commentPattern: "default case omitted"
            }]
        },
        {
            code: "switch (a) { case 1: break; \n // skip default case \n }",
            options: [{
                commentPattern: "^skip default"
            }]
        },
        {
            code: "switch (a) { case 1: break; \n /*\nTODO:\n throw error in default case\n*/ \n }",
            options: [{
                commentPattern: "default"
            }]
        },
        {
            code: "switch (a) { case 1: break; \n// \n }",
            options: [{
                commentPattern: ".?"
            }]
        }
    ],

    invalid: [
        {
            code: "switch (a) { case 1: break; }",
            errors: [{
                messageId: "missingDefaultCase",
                type: "SwitchStatement"
            }]
        },
        {
            code: "switch (a) { \n // no default \n case 1: break;  }",
            errors: [{
                messageId: "missingDefaultCase",
                type: "SwitchStatement"
            }]
        },
        {
            code: "switch (a) { case 1: break; \n // no default \n // nope \n  }",
            errors: [{
                messageId: "missingDefaultCase",
                type: "SwitchStatement"
            }]
        },
        {
            code: "switch (a) { case 1: break; \n // no default \n }",
            options: [{
                commentPattern: "skipped default case"
            }],
            errors: [{
                messageId: "missingDefaultCase",
                type: "SwitchStatement"
            }]
        },
        {
            code: "switch (a) {\ncase 1: break; \n// default omitted intentionally \n// TODO: add default case \n}",
            options: [{
                commentPattern: "default omitted"
            }],
            errors: [{
                messageId: "missingDefaultCase",
                type: "SwitchStatement"
            }]
        },
        {
            code: "switch (a) {\ncase 1: break;\n}",
            options: [{
                commentPattern: ".?"
            }],
            errors: [{
                messageId: "missingDefaultCase",
                type: "SwitchStatement"
            }]
        }
    ]
});
