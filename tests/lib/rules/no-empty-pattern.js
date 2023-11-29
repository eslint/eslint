/**
 * @fileoverview Tests for no-empty-pattern rule.
 * @author Alberto Rodríguez
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-empty-pattern"),
    RuleTester = require("../../../lib/rule-tester/flat-rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-empty-pattern", rule, {

    // Examples of code that should not trigger the rule
    valid: [
        { code: "var {a = {}} = foo;", languageOptions: { ecmaVersion: 6 } },
        { code: "var {a, b = {}} = foo;", languageOptions: { ecmaVersion: 6 } },
        { code: "var {a = []} = foo;", languageOptions: { ecmaVersion: 6 } },
        { code: "function foo({a = {}}) {}", languageOptions: { ecmaVersion: 6 } },
        { code: "function foo({a = []}) {}", languageOptions: { ecmaVersion: 6 } },
        { code: "var [a] = foo", languageOptions: { ecmaVersion: 6 } },
        { code: "function foo({}) {}", options: [{ allowObjectPatternsAsParameters: true }], languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = function({}) {}", options: [{ allowObjectPatternsAsParameters: true }], languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = ({}) => {}", options: [{ allowObjectPatternsAsParameters: true }], languageOptions: { ecmaVersion: 6 } },
        { code: "function foo({} = {}) {}", options: [{ allowObjectPatternsAsParameters: true }], languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = function({} = {}) {}", options: [{ allowObjectPatternsAsParameters: true }], languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = ({} = {}) => {}", options: [{ allowObjectPatternsAsParameters: true }], languageOptions: { ecmaVersion: 6 } }
    ],

    // Examples of code that should trigger the rule
    invalid: [
        {
            code: "var {} = foo",
            errors: [{
                messageId: "unexpected",
                data: { type: "object" },
                type: "ObjectPattern"
            }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "var [] = foo",
            errors: [{
                messageId: "unexpected",
                data: { type: "array" },
                type: "ArrayPattern"
            }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "var {a: {}} = foo",
            errors: [{
                messageId: "unexpected",
                data: { type: "object" },
                type: "ObjectPattern"
            }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "var {a, b: {}} = foo",
            errors: [{
                messageId: "unexpected",
                data: { type: "object" },
                type: "ObjectPattern"
            }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "var {a: []} = foo",
            errors: [{
                messageId: "unexpected",
                data: { type: "array" },
                type: "ArrayPattern"
            }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo({}) {}",
            errors: [{
                messageId: "unexpected",
                data: { type: "object" },
                type: "ObjectPattern"
            }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo([]) {}",
            errors: [{
                messageId: "unexpected",
                data: { type: "array" },
                type: "ArrayPattern"
            }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo({a: {}}) {}",
            errors: [{
                messageId: "unexpected",
                data: { type: "object" },
                type: "ObjectPattern"
            }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo({a: []}) {}",
            errors: [{
                messageId: "unexpected",
                data: { type: "array" },
                type: "ArrayPattern"
            }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo({}) {}",
            options: [{}],
            errors: [{
                messageId: "unexpected",
                data: { type: "object" },
                type: "ObjectPattern"
            }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = function({}) {}",
            options: [{}],
            errors: [{
                messageId: "unexpected",
                data: { type: "object" },
                type: "ObjectPattern"
            }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = ({}) => {}",
            options: [{}],
            errors: [{
                messageId: "unexpected",
                data: { type: "object" },
                type: "ObjectPattern"
            }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo({} = {}) {}",
            options: [{}],
            errors: [{
                messageId: "unexpected",
                data: { type: "object" },
                type: "ObjectPattern"
            }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = function({} = {}) {}",
            options: [{}],
            errors: [{
                messageId: "unexpected",
                data: { type: "object" },
                type: "ObjectPattern"
            }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = ({} = {}) => {}",
            options: [{}],
            errors: [{
                messageId: "unexpected",
                data: { type: "object" },
                type: "ObjectPattern"
            }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = ({a: {}}) => {}",
            options: [{ allowObjectPatternsAsParameters: true }],
            errors: [{
                messageId: "unexpected",
                data: { type: "object" },
                type: "ObjectPattern"
            }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = ({} = bar) => {}",
            options: [{ allowObjectPatternsAsParameters: true }],
            errors: [{
                messageId: "unexpected",
                data: { type: "object" },
                type: "ObjectPattern"
            }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = ({} = { bar: 1 }) => {}",
            options: [{ allowObjectPatternsAsParameters: true }],
            errors: [{
                messageId: "unexpected",
                data: { type: "object" },
                type: "ObjectPattern"
            }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = ([]) => {}",
            options: [{ allowObjectPatternsAsParameters: true }],
            errors: [{
                messageId: "unexpected",
                data: { type: "array" },
                type: "ArrayPattern"
            }],
            languageOptions: { ecmaVersion: 6 }
        }
    ]
});
