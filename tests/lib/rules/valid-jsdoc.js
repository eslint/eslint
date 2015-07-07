/**
 * @fileoverview Validates JSDoc comments are syntactically correct
 * @author Nicholas C. Zakas
 * @copyright 2014 Nicholas C. Zakas. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/valid-jsdoc", {

    valid: [

        "/**\n* Description\n* @returns {void} */\nfunction foo(){}",
        "/**\n* Description\n* @alias Test#test\n* @returns {void} */\nfunction foo(){}",
        "/**\n* Description\n*@extends MyClass\n* @returns {void} */\nfunction foo(){}",
        "/**\n* Description\n* @constructor */\nfunction Foo(){}",
        "/**\n* Description\n* @class */\nfunction Foo(){}",
        "/**\n* Description\n* @param {string} p bar\n* @returns {string} desc */\nfunction foo(p){}",
        "/**\n* Description\n* @param {string} [p] bar\n* @returns {string} desc */\nfunction foo(p){}",
        "/**\n* Description\n* @param {Object} p bar\n* @param {string} p.name bar\n* @returns {string} desc */\nFoo.bar = function(p){};",
        "(function(){\n/**\n* Description\n* @param {string} p bar\n* @returns {string} desc */\nfunction foo(p){}\n}())",
        "var o = {\n/**\n* Description\n* @param {string} p bar\n* @returns {string} desc */\nfoo: function(p){}\n};",
        "/**\n* Description\n* @param {Object} p bar\n* @param {string[]} p.files qux\n* @param {Function} cb baz\n* @returns {void} */\nfunction foo(p, cb){}",
        {
            code: "/**\n* Description\n* @return {void} */\nfunction foo(){}",
            args: [1, {}]
        },
        {
            code: "/**\n* Description\n* @param {string} p bar\n*/\nFoo.bar = (p) => {};",
            args: [2, {requireReturn: false}],
            ecmaFeatures: { arrowFunctions: true }
        },
        {
            code: "/**\n* Description\n* @param {string} p bar\n*/\nFoo.bar = function({p}){};",
            args: [1, {requireReturn: false}],
            ecmaFeatures: { destructuring: true }
        },
        {
            code: "/**\n* Description\n* @param {string} p bar\n*/\nFoo.bar = function(p){};",
            args: [1, {requireReturn: false}]
        },
        {
            code: "/**\n* Description\n* @param {string} p mytest\n*/\nFoo.bar = function(p){var t = function(){return p;}};",
            args: [1, {requireReturn: false}]
        },
        {
            code: "/**\n* Description\n* @param {string} p mytest\n*/\nFoo.bar = function(p){function func(){return p;}};",
            args: [1, {requireReturn: false}]
        },
        {
            code: "/**\n* Description\n* @param {string} p mytest\n*/\nFoo.bar = function(p){var t = false; if(t){ return; }};",
            args: [1, {requireReturn: false}]
        },
        {
            code: "/**\n* Description\n* @param {string} p mytest\n* @returns {void} */\nFoo.bar = function(p){var t = false; if(t){ return; }};",
            args: [1, {requireReturn: false}]
        },
        {
            code: "/**\n* Description\n* @param {string} p mytest\n*/\nFoo.bar = function(p){var t = function(){function name(){return p;}}};",
            args: [1, {requireReturn: false}]
        },
        {
            code: "/**\n* Description\n* @param {string} p mytest\n*/\nFoo.bar = function(p){var t = function(){function name(){}; return name;}};",
            args: [1, {requireReturn: false}]
        },
        {
            code: "/**\n* Description\n* @param {string} p\n* @returns {void}*/\nFoo.bar = function(p){var t = function(){function name(){}; return name;}};",
            args: [1, {requireParamDescription: false}]
        },
        {
            code: "/**\n* Description\n* @param {string} p mytest\n* @returns {Object}*/\nFoo.bar = function(p){return name;};",
            args: [1, {requireReturnDescription: false}]
        },
        "var obj = {\n /**\n * Getter\n * @type {string}\n */\n get location() {\n return this._location;\n }\n }",
        {
            code: "/**\n * Description for A.\n */\n class A {\n /**\n * Description for constructor.\n * @param {object[]} xs - xs\n */\n constructor(xs) {\n /**\n * Description for this.xs;\n * @type {object[]}\n */\n this.xs = xs.filter(x => x != null);\n }\n}",
            options: [{requireReturn: false}],
            ecmaFeatures: {
                arrowFunctions: true,
                classes: true
            }
        }
    ],

    invalid: [
        {
            code: "/** @@foo */\nfunction foo(){}",
            errors: [{
                message: "JSDoc syntax error.",
                type: "Block"
            }]
        },
        {
            code: "/** @@returns {void} Foo */\nfunction foo(){}",
            errors: [{
                message: "JSDoc syntax error.",
                type: "Block"
            }]
        },
        {
            code: "/** Foo \n@returns {void Foo\n */\nfunction foo(){}",
            errors: [{
                message: "JSDoc type missing brace.",
                type: "Block"
            }]
        },
        {
            code: "/** Foo \n@return {void} Foo\n */\nfunction foo(){}",
            args: [1, { prefer: { "return": "returns" }}],
            errors: [{
                message: "Use @returns instead.",
                type: "Block"
            }]
        },
        {
            code: "/** Foo \n@return {void} Foo\n */\nfoo.bar = () => {}",
            args: [1, { prefer: { "return": "returns" }}],
            ecmaFeatures: { arrowFunctions: true },
            errors: [{
                message: "Use @returns instead.",
                type: "Block"
            }]
        },
        {
            code: "/** Foo \n@param {void Foo\n */\nfunction foo(){}",
            errors: [{
                message: "JSDoc type missing brace.",
                type: "Block"
            }]
        },
        {
            code: "/** Foo \n@param {} p Bar\n */\nfunction foo(){}",
            errors: [{
                message: "JSDoc syntax error.",
                type: "Block"
            }]
        },
        {
            code: "/** Foo \n@param {void Foo */\nfunction foo(){}",
            errors: [{
                message: "JSDoc type missing brace.",
                type: "Block"
            }]
        },
        {
            code: "/** Foo\n* @param p Desc \n*/\nfunction foo(){}",
            errors: [{
                message: "Missing JSDoc parameter type for 'p'.",
                type: "Block"
            }, {
                message: "Missing JSDoc @returns for function.",
                type: "Block"
            }]
        },
        {
            code: "/**\n* Foo\n* @param {string} p \n*/\nfunction foo(){}",
            errors: [{
                message: "Missing JSDoc parameter description for 'p'.",
                type: "Block"
            }, {
                message: "Missing JSDoc @returns for function.",
                type: "Block"
            }]
        },
        {
            code: "/**\n* Foo\n* @returns {string} \n*/\nfunction foo(){}",
            errors: [{
                message: "Missing JSDoc return description.",
                type: "Block"
            }]
        },
        {
            code: "/**\n* Foo\n* @returns {string} something \n*/\nfunction foo(p){}",
            errors: [{
                message: "Missing JSDoc for parameter 'p'.",
                type: "Block"
            }]
        },
        {
            code: "/**\n* Foo\n* @param {string} p desc\n* @param {string} p desc \n*/\nfunction foo(){}",
            errors: [{
                message: "Duplicate JSDoc parameter 'p'.",
                type: "Block"
            }, {
                message: "Missing JSDoc @returns for function.",
                type: "Block"
            }]
        },
        {
            code: "/**\n* Foo\n* @param {string} a desc\n@returns {void}*/\nfunction foo(b){}",
            errors: [{
                message: "Expected JSDoc for 'b' but found 'a'.",
                type: "Block"
            }]
        },
        {
            code: "/**\n* Foo\n* @param {string} a desc\n*/\nfunction foo(a){var t = false; if(t) {return t;}}",
            args: [1, {requireReturn: false}],
            errors: [{
                message: "Missing JSDoc @returns for function.",
                type: "Block"
            }]
        },
        {
            code: "/**\n* Foo\n* @param {string} a desc\n*/\nfunction foo(a){var t = false; if(t) {return null;}}",
            args: [1, {requireReturn: false}],
            errors: [{
                message: "Missing JSDoc @returns for function.",
                type: "Block"
            }]
        },
        {
            code: "/**\n* Foo\n* @param {string} a desc\n@returns {MyClass}*/\nfunction foo(a){var t = false; if(t) {process(t);}}",
            args: [1, {requireReturn: false}],
            errors: [{
                message: "Unexpected @returns tag; function has no return statement.",
                type: "Block"
            }]
        },
        {
            code: "/**\n * Does something. \n* @param {string} a - this is a \n* @return {Array<number>} The result of doing it \n*/\n export function doSomething(a) { }",
            args: [2, {"prefer": { "return": "returns" }}],
            ecmaFeatures: { modules: true },
            errors: [{
                message: "Use @returns instead.",
                type: "Block"
            }]
        },
        {
            code: "/**\n * Does something. \n* @param {string} a - this is a \n* @return {Array<number>} The result of doing it \n*/\n export default function doSomething(a) { }",
            args: [2, {"prefer": { "return": "returns" }}],
            ecmaFeatures: { modules: true },
            errors: [{
                message: "Use @returns instead.",
                type: "Block"
            }]
        }
    ]
});
