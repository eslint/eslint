/**
 * @fileoverview Tests for switch-colon-spacing rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/switch-colon-spacing"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("switch-colon-spacing", rule, {
    valid: [
        "switch(a){}",
        "({foo:1,bar : 2});",
        "A:foo(); B : foo();",
        "switch(a){case 0: break;}",
        "switch(a){case 0:}",
        "switch(a){case 0\n:\nbreak;}",
        "switch(a){default: break;}",
        "switch(a){default:}",
        "switch(a){default\n:\nbreak;}",
        { code: "switch(a){case 0:break;}", options: [{ before: false, after: false }] },
        { code: "switch(a){case 0:}", options: [{ before: false, after: false }] },
        { code: "switch(a){case 0\n:\nbreak;}", options: [{ before: false, after: false }] },
        { code: "switch(a){default:break;}", options: [{ before: false, after: false }] },
        { code: "switch(a){default:}", options: [{ before: false, after: false }] },
        { code: "switch(a){default\n:\nbreak;}", options: [{ before: false, after: false }] },
        { code: "switch(a){case 0: break;}", options: [{ before: false, after: true }] },
        { code: "switch(a){case 0:}", options: [{ before: false, after: true }] },
        { code: "switch(a){case 0\n:\nbreak;}", options: [{ before: false, after: true }] },
        { code: "switch(a){default: break;}", options: [{ before: false, after: true }] },
        { code: "switch(a){default:}", options: [{ before: false, after: true }] },
        { code: "switch(a){default\n:\nbreak;}", options: [{ before: false, after: true }] },
        { code: "switch(a){case 0 :break;}", options: [{ before: true, after: false }] },
        { code: "switch(a){case 0 :}", options: [{ before: true, after: false }] },
        { code: "switch(a){case 0\n:\nbreak;}", options: [{ before: true, after: false }] },
        { code: "switch(a){default :break;}", options: [{ before: true, after: false }] },
        { code: "switch(a){default :}", options: [{ before: true, after: false }] },
        { code: "switch(a){default\n:\nbreak;}", options: [{ before: true, after: false }] },
        { code: "switch(a){case 0 : break;}", options: [{ before: true, after: true }] },
        { code: "switch(a){case 0 :}", options: [{ before: true, after: true }] },
        { code: "switch(a){case 0\n:\nbreak;}", options: [{ before: true, after: true }] },
        { code: "switch(a){default : break;}", options: [{ before: true, after: true }] },
        { code: "switch(a){default :}", options: [{ before: true, after: true }] },
        { code: "switch(a){default\n:\nbreak;}", options: [{ before: true, after: true }] }
    ],
    invalid: [
        {
            code: "switch(a){case 0 :break;}",
            output: "switch(a){case 0: break;}",
            errors: [
                "Unexpected space(s) before this colon.",
                "Expected space(s) after this colon."
            ]
        },
        {
            code: "switch(a){default :break;}",
            output: "switch(a){default: break;}",
            errors: [
                "Unexpected space(s) before this colon.",
                "Expected space(s) after this colon."
            ]
        },
        {
            code: "switch(a){case 0 : break;}",
            output: "switch(a){case 0:break;}",
            options: [{ before: false, after: false }],
            errors: [
                "Unexpected space(s) before this colon.",
                "Unexpected space(s) after this colon."
            ]
        },
        {
            code: "switch(a){default : break;}",
            output: "switch(a){default:break;}",
            options: [{ before: false, after: false }],
            errors: [
                "Unexpected space(s) before this colon.",
                "Unexpected space(s) after this colon."
            ]
        },
        {
            code: "switch(a){case 0 :break;}",
            output: "switch(a){case 0: break;}",
            options: [{ before: false, after: true }],
            errors: [
                "Unexpected space(s) before this colon.",
                "Expected space(s) after this colon."
            ]
        },
        {
            code: "switch(a){default :break;}",
            output: "switch(a){default: break;}",
            options: [{ before: false, after: true }],
            errors: [
                "Unexpected space(s) before this colon.",
                "Expected space(s) after this colon."
            ]
        },
        {
            code: "switch(a){case 0: break;}",
            output: "switch(a){case 0 :break;}",
            options: [{ before: true, after: false }],
            errors: [
                "Expected space(s) before this colon.",
                "Unexpected space(s) after this colon."
            ]
        },
        {
            code: "switch(a){default: break;}",
            output: "switch(a){default :break;}",
            options: [{ before: true, after: false }],
            errors: [
                "Expected space(s) before this colon.",
                "Unexpected space(s) after this colon."
            ]
        },
        {
            code: "switch(a){case 0:break;}",
            output: "switch(a){case 0 : break;}",
            options: [{ before: true, after: true }],
            errors: [
                "Expected space(s) before this colon.",
                "Expected space(s) after this colon."
            ]
        },
        {
            code: "switch(a){default:break;}",
            output: "switch(a){default : break;}",
            options: [{ before: true, after: true }],
            errors: [
                "Expected space(s) before this colon.",
                "Expected space(s) after this colon."
            ]
        },
        {
            code: "switch(a){case 0 /**/ :break;}",
            output: "switch(a){case 0 /**/ : break;}",
            errors: [
                "Unexpected space(s) before this colon.",
                "Expected space(s) after this colon."
            ]
        },
        {
            code: "switch(a){case 0 :/**/break;}",
            output: "switch(a){case 0:/**/break;}",
            errors: [
                "Unexpected space(s) before this colon.",
                "Expected space(s) after this colon."
            ]
        },
        {
            code: "switch(a){case (0) :break;}",
            output: "switch(a){case (0): break;}",
            errors: [
                "Unexpected space(s) before this colon.",
                "Expected space(s) after this colon."
            ]
        }
    ]
});
