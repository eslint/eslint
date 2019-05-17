/**
 * @fileoverview Tests for complexity rule.
 * @author Gyandeep Singh
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/accessor-pairs"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

const getterError = { messageId: "getter" };
const setterError = { messageId: "setter" };

ruleTester.run("accessor-pairs", rule, {
    valid: [
        "var o = { a: 1 };",
        "var o = {\n get a() {\n return val; \n} \n};",
        "var o = {\n set a(value) {\n val = value; \n},\n get a() {\n return val; \n} \n};",
        "var o = {a: 1};\n Object.defineProperty(o, 'b', \n{set: function(value) {\n val = value; \n},\n get: function() {\n return val; \n} \n});",
        {
            code: "var expr = 'foo';  var o = { set [expr](value) { val = value; }, get [expr]() { return val; } };",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var o = {\n set a(value) {\n val = value; \n} \n};",
            options: [{
                setWithoutGet: false
            }]
        },

        // https://github.com/eslint/eslint/issues/3262
        "var o = {set: function() {}}",
        "Object.defineProperties(obj, {set: {value: function() {}}});",
        "Object.create(null, {set: {value: function() {}}});",
        { code: "var o = {get: function() {}}", options: [{ getWithoutSet: true }] },
        { code: "var o = {[set]: function() {}}", parserOptions: { ecmaVersion: 6 } },
        { code: "var set = 'value'; Object.defineProperty(obj, 'foo', {[set]: function(value) {}});", parserOptions: { ecmaVersion: 6 } }
    ],
    invalid: [
        {
            code: "var o = {\n set a(value) {\n val = value; \n} \n};",
            errors: [getterError]
        },
        {
            code: "var o = {\n get a() {\n return val; \n} \n};",
            options: [{
                getWithoutSet: true
            }],
            errors: [setterError]
        },
        {
            code: "var o = {d: 1};\n Object.defineProperty(o, 'c', \n{set: function(value) {\n val = value; \n} \n});",
            errors: [getterError]
        },
        {
            code: "Reflect.defineProperty(obj, 'foo', {set: function(value) {}});",
            errors: [getterError]
        },
        {
            code: "Object.defineProperties(obj, {foo: {set: function(value) {}}});",
            errors: [getterError]
        },
        {
            code: "Object.create(null, {foo: {set: function(value) {}}});",
            errors: [getterError]
        },
        {
            code: "var expr = 'foo';  var o = { set [expr](value) { val = value; } };",
            parserOptions: { ecmaVersion: 6 },
            errors: [getterError]
        }
    ]
});
