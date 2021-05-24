/**
 * @fileoverview Tests for the default-case-last rule
 * @author Milos Djermanovic
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/default-case-last");
const { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Creates an error object.
 * @param {number} [column] Reported column.
 * @returns {Object} The error object.
 */
function error(column) {
    const errorObject = {
        messageId: "notLast",
        type: "SwitchCase"
    };

    if (column) {
        errorObject.column = column;
    }

    return errorObject;
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("default-case-last", rule, {
    valid: [
        "switch (foo) {}",
        "switch (foo) { case 1: bar(); break; }",
        "switch (foo) { case 1: break; }",
        "switch (foo) { case 1: }",
        "switch (foo) { case 1: bar(); break; case 2: baz(); break; }",
        "switch (foo) { case 1: break; case 2: break; }",
        "switch (foo) { case 1: case 2: break; }",
        "switch (foo) { case 1: case 2: }",
        "switch (foo) { default: bar(); break; }",
        "switch (foo) { default: bar(); }",
        "switch (foo) { default: break; }",
        "switch (foo) { default: }",
        "switch (foo) { case 1: break; default: break; }",
        "switch (foo) { case 1: break; default: }",
        "switch (foo) { case 1: default: break; }",
        "switch (foo) { case 1: default: }",
        "switch (foo) { case 1: baz(); break; case 2: quux(); break; default: quuux(); break; }",
        "switch (foo) { case 1: break; case 2: break; default: break; }",
        "switch (foo) { case 1: break; case 2: break; default: }",
        "switch (foo) { case 1: case 2: break; default: break; }",
        "switch (foo) { case 1: break; case 2: default: break; }",
        "switch (foo) { case 1: break; case 2: default: }",
        "switch (foo) { case 1: case 2: default: }"
    ],

    invalid: [
        {
            code: "switch (foo) { default: bar(); break; case 1: baz(); break; }",
            errors: [error(16)]
        },
        {
            code: "switch (foo) { default: break; case 1: break; }",
            errors: [error(16)]
        },
        {
            code: "switch (foo) { default: break; case 1: }",
            errors: [error(16)]
        },
        {
            code: "switch (foo) { default: case 1: break; }",
            errors: [error(16)]
        },
        {
            code: "switch (foo) { default: case 1: }",
            errors: [error(16)]
        },
        {
            code: "switch (foo) { default: break; case 1: break; case 2: break; }",
            errors: [error(16)]
        },
        {
            code: "switch (foo) { default: case 1: break; case 2: break; }",
            errors: [error(16)]
        },
        {
            code: "switch (foo) { default: case 1: case 2: break; }",
            errors: [error(16)]
        },
        {
            code: "switch (foo) { default: case 1: case 2: }",
            errors: [error(16)]
        },
        {
            code: "switch (foo) { case 1: break; default: break; case 2: break; }",
            errors: [error(31)]
        },
        {
            code: "switch (foo) { case 1: default: break; case 2: break; }",
            errors: [error(24)]
        },
        {
            code: "switch (foo) { case 1: break; default: case 2: break; }",
            errors: [error(31)]
        },
        {
            code: "switch (foo) { case 1: default: case 2: break; }",
            errors: [error(24)]
        },
        {
            code: "switch (foo) { case 1: default: case 2: }",
            errors: [error(24)]
        }
    ]
});
