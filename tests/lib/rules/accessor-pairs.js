/**
 * @fileoverview Tests for complexity rule.
 * @author Gyandeep Singh
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/accessor-pairs"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("accessor-pairs", rule, {
    valid: [
        "var o = { a: 1 };",
        "var o = {\n get a() {\n return val; \n} \n};",
        "var o = {\n set a(value) {\n val = value; \n},\n get a() {\n return val; \n} \n};",
        "var o = {a: 1};\n Object.defineProperty(o, 'b', \n{set: function(value) {\n val = value; \n},\n get: function() {\n return val; \n} \n});",
        {
            code: "var expr = 'foo';  var o = { set [expr](value) { val = value; }, get [expr]() { return val; } };",
            ecmaFeatures: {
                objectLiteralComputedProperties: true
            }
        },
        {
            code: "var o = {\n set a(value) {\n val = value; \n} \n};",
            options: [{
                setWithoutGet: false
            }]
        },

        // https://github.com/eslint/eslint/issues/3262
        {code: "var o = {set: function() {}}"},
        {code: "Object.defineProperties(obj, {set: {value: function() {}}});"},
        {code: "Object.create(null, {set: {value: function() {}}});"},
        {code: "var o = {get: function() {}}", options: [{getWithoutSet: true}]},
        {code: "var o = {[set]: function() {}}", ecmaFeatures: {objectLiteralComputedProperties: true}},
        {code: "var set = 'value'; Object.defineProperty(obj, 'foo', {[set]: function(value) {}});", ecmaFeatures: {objectLiteralComputedProperties: true}}
    ],
    invalid: [
        {
            code: "var o = {\n set a(value) {\n val = value; \n} \n};",
            errors: [{
                message: "Getter is not present"
            }]
        },
        {
            code: "var o = {\n get a() {\n return val; \n} \n};",
            options: [{
                getWithoutSet: true
            }],
            errors: [{
                message: "Setter is not present"
            }]
        },
        {
            code: "var o = {d: 1};\n Object.defineProperty(o, 'c', \n{set: function(value) {\n val = value; \n} \n});",
            errors: [{
                message: "Getter is not present"
            }]
        },
        {
            code: "Reflect.defineProperty(obj, 'foo', {set: function(value) {}});",
            errors: [{
                message: "Getter is not present"
            }]
        },
        {
            code: "Object.defineProperties(obj, {foo: {set: function(value) {}}});",
            errors: [{
                message: "Getter is not present"
            }]
        },
        {
            code: "Object.create(null, {foo: {set: function(value) {}}});",
            errors: [{
                message: "Getter is not present"
            }]
        },
        {
            code: "var expr = 'foo';  var o = { set [expr](value) { val = value; } };",
            ecmaFeatures: {
                objectLiteralComputedProperties: true
            },
            errors: [{
                message: "Getter is not present"
            }]
        }
    ]
});
