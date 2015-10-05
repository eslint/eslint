/**
 * @fileoverview Tests for no-empty-pattern rule.
 * @author Alberto Rodríguez
 * @copyright 2015 Alberto Rodríguez. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-empty-pattern"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-empty-pattern", rule, {

    // Examples of code that should not trigger the rule
    valid: [
        { code: "var {a = {}} = foo;", ecmaFeatures: { destructuring: true, defaultParams: true}},
        { code: "var {a, b = {}} = foo;", ecmaFeatures: { destructuring: true, defaultParams: true}},
        { code: "var {a = []} = foo;", ecmaFeatures: { destructuring: true, defaultParams: true}},
        { code: "function foo({a = {}}) {}", ecmaFeatures: { destructuring: true, defaultParams: true}},
        { code: "function foo({a = []}) {}", ecmaFeatures: { destructuring: true, defaultParams: true}}
    ],

    // Examples of code that should trigger the rule
    invalid: [
        {
            code: "var {} = foo",
            ecmaFeatures: {destructuring: true, defaultParams: true},
            errors: [{
                message: "Unexpected empty object pattern.",
                type: "ObjectPattern"
            }]
        },
        {
            code: "var [] = foo",
            ecmaFeatures: {destructuring: true, defaultParams: true},
            errors: [{
                message: "Unexpected empty array pattern.",
                type: "ArrayPattern"
            }]
        },
        {
            code: "var {a: {}} = foo",
            ecmaFeatures: {destructuring: true, defaultParams: true},
            errors: [{
                message: "Unexpected empty object pattern.",
                type: "ObjectPattern"
            }]
        },
        {
            code: "var {a, b: {}} = foo",
            ecmaFeatures: {destructuring: true, defaultParams: true},
            errors: [{
                message: "Unexpected empty object pattern.",
                type: "ObjectPattern"
            }]
        },
        {
            code: "var {a: []} = foo",
            ecmaFeatures: {destructuring: true, defaultParams: true},
            errors: [{
                message: "Unexpected empty array pattern.",
                type: "ArrayPattern"
            }]
        },
        {
            code: "function foo({}) {}",
            ecmaFeatures: {destructuring: true, defaultParams: true},
            errors: [{
                message: "Unexpected empty object pattern.",
                type: "ObjectPattern"
            }]
        },
        {
            code: "function foo([]) {}",
            ecmaFeatures: {destructuring: true, defaultParams: true},
            errors: [{
                message: "Unexpected empty array pattern.",
                type: "ArrayPattern"
            }]
        },
        {
            code: "function foo({a: {}}) {}",
            ecmaFeatures: {destructuring: true, defaultParams: true},
            errors: [{
                message: "Unexpected empty object pattern.",
                type: "ObjectPattern"
            }]
        },
        {
            code: "function foo({a: []}) {}",
            ecmaFeatures: {destructuring: true, defaultParams: true},
            errors: [{
                message: "Unexpected empty array pattern.",
                type: "ArrayPattern"
            }]
        }
    ]
});
