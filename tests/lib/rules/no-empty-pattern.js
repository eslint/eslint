/**
 * @fileoverview Tests for no-empty-pattern rule.
 * @author Alberto Rodríguez
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-empty-pattern"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-empty-pattern", rule, {

    // Examples of code that should not trigger the rule
    valid: [
        { code: "var {a = {}} = foo;", parserOptions: { ecmaVersion: 6 } },
        { code: "var {a, b = {}} = foo;", parserOptions: { ecmaVersion: 6 } },
        { code: "var {a = []} = foo;", parserOptions: { ecmaVersion: 6 } },
        { code: "function foo({a = {}}) {}", parserOptions: { ecmaVersion: 6 } },
        { code: "function foo({a = []}) {}", parserOptions: { ecmaVersion: 6 } },
        { code: "var [a] = foo", parserOptions: { ecmaVersion: 6 } }
    ],

    // Examples of code that should trigger the rule
    invalid: [
        {
            code: "var {} = foo",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unexpected",
                data: { type: "object" },
                type: "ObjectPattern"
            }]
        },
        {
            code: "var [] = foo",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unexpected",
                data: { type: "array" },
                type: "ArrayPattern"
            }]
        },
        {
            code: "var {a: {}} = foo",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unexpected",
                data: { type: "object" },
                type: "ObjectPattern"
            }]
        },
        {
            code: "var {a, b: {}} = foo",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unexpected",
                data: { type: "object" },
                type: "ObjectPattern"
            }]
        },
        {
            code: "var {a: []} = foo",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unexpected",
                data: { type: "array" },
                type: "ArrayPattern"
            }]
        },
        {
            code: "function foo({}) {}",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unexpected",
                data: { type: "object" },
                type: "ObjectPattern"
            }]
        },
        {
            code: "function foo([]) {}",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unexpected",
                data: { type: "array" },
                type: "ArrayPattern"
            }]
        },
        {
            code: "function foo({a: {}}) {}",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unexpected",
                data: { type: "object" },
                type: "ObjectPattern"
            }]
        },
        {
            code: "function foo({a: []}) {}",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unexpected",
                data: { type: "array" },
                type: "ArrayPattern"
            }]
        }
    ]
});
