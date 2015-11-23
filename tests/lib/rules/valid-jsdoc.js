/**
 * @fileoverview Validates JSDoc comments are syntactically correct
 * @author Nicholas C. Zakas
 * @copyright 2014 Nicholas C. Zakas. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/valid-jsdoc"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("valid-jsdoc", rule, {

    valid: [
        "/**\n* Description\n * @param {Object[]} screenings Array of screenings.\n * @param {Number} screenings[].timestamp its a time stamp \n @return {void} */\nfunction foo(){}",
        "/**\n* Description\n */\nvar x = new Foo(function foo(){})",
        "/**\n* Description\n* @returns {void} */\nfunction foo(){}",
        "/**\n* Description\n* @returns {undefined} */\nfunction foo(){}",
        "/**\n* Description\n* @alias Test#test\n* @returns {void} */\nfunction foo(){}",
        "/**\n* Description\n*@extends MyClass\n* @returns {void} */\nfunction foo(){}",
        "/**\n* Description\n* @constructor */\nfunction Foo(){}",
        "/**\n* Description\n* @class */\nfunction Foo(){}",
        "/**\n* Description\n* @param {string} p bar\n* @returns {string} desc */\nfunction foo(p){}",
        "/**\n* Description\n* @arg {string} p bar\n* @returns {string} desc */\nfunction foo(p){}",
        "/**\n* Description\n* @argument {string} p bar\n* @returns {string} desc */\nfunction foo(p){}",
        "/**\n* Description\n* @param {string} [p] bar\n* @returns {string} desc */\nfunction foo(p){}",
        "/**\n* Description\n* @param {Object} p bar\n* @param {string} p.name bar\n* @returns {string} desc */\nFoo.bar = function(p){};",
        "(function(){\n/**\n* Description\n* @param {string} p bar\n* @returns {string} desc */\nfunction foo(p){}\n}())",
        "var o = {\n/**\n* Description\n* @param {string} p bar\n* @returns {string} desc */\nfoo: function(p){}\n};",
        "/**\n* Description\n* @param {Object} p bar\n* @param {string[]} p.files qux\n* @param {Function} cb baz\n* @returns {void} */\nfunction foo(p, cb){}",
        "/**\n* Description\n* @override */\nfunction foo(arg1, arg2){ return ''; }",
        "/**\n* Description\n* @inheritdoc */\nfunction foo(arg1, arg2){ return ''; }",
        {
            code: "/**\n* Description\n* @return {void} */\nfunction foo(){}",
            options: [{}]
        },
        {
            code: "/**\n* Description\n* @param {string} p bar\n*/\nFoo.bar = (p) => {};",
            options: [{requireReturn: false}],
            ecmaFeatures: { arrowFunctions: true }
        },
        {
            code: "/**\n* Description\n* @param {string} p bar\n*/\nFoo.bar = function({p}){};",
            options: [{requireReturn: false}],
            ecmaFeatures: { destructuring: true }
        },
        {
            code: "/**\n* Description\n* @param {string} p bar\n*/\nFoo.bar = function(p){};",
            options: [{requireReturn: false}]
        },
        {
            code: "/**\n* Description\n* @param {string} p mytest\n*/\nFoo.bar = function(p){var t = function(){return p;}};",
            options: [{requireReturn: false}]
        },
        {
            code: "/**\n* Description\n* @param {string} p mytest\n*/\nFoo.bar = function(p){function func(){return p;}};",
            options: [{requireReturn: false}]
        },
        {
            code: "/**\n* Description\n* @param {string} p mytest\n*/\nFoo.bar = function(p){var t = false; if(t){ return; }};",
            options: [{requireReturn: false}]
        },
        {
            code: "/**\n* Description\n* @param {string} p mytest\n* @returns {void} */\nFoo.bar = function(p){var t = false; if(t){ return; }};",
            options: [{requireReturn: false}]
        },
        {
            code: "/**\n* Description\n* @param {string} p mytest\n*/\nFoo.bar = function(p){var t = function(){function name(){return p;}}};",
            options: [{requireReturn: false}]
        },
        {
            code: "/**\n* Description\n* @param {string} p mytest\n*/\nFoo.bar = function(p){var t = function(){function name(){}; return name;}};",
            options: [{requireReturn: false}]
        },
        {
            code: "/**\n* Description\n* @param {string} p\n* @returns {void}*/\nFoo.bar = function(p){var t = function(){function name(){}; return name;}};",
            options: [{requireParamDescription: false}]
        },
        {
            code: "/**\n* Description\n* @param {string} p mytest\n* @returns {Object}*/\nFoo.bar = function(p){return name;};",
            options: [{requireReturnDescription: false}]
        },
        "var obj = {\n /**\n * Getter\n * @type {string}\n */\n get location() {\n return this._location;\n }\n }",
        {
            code: "/**\n * Description for A.\n */\n class A {\n /**\n * Description for constructor.\n * @param {object[]} xs - xs\n */\n constructor(xs) {\n /**\n * Description for this.xs;\n * @type {object[]}\n */\n this.xs = xs.filter(x => x != null);\n }\n}",
            options: [{requireReturn: false}],
            ecmaFeatures: {
                arrowFunctions: true,
                classes: true
            }
        },
        {
            code: "/** @returns {object} foo */ var foo = () => bar();",
            options: [{requireReturn: false}],
            ecmaFeatures: {arrowFunctions: true}
        },
        {
            code: "/** @returns {object} foo */ var foo = () => { return bar(); };",
            options: [{requireReturn: false}],
            ecmaFeatures: {arrowFunctions: true}
        },
        {
            code: "/** foo */ var foo = () => { bar(); };",
            options: [{requireReturn: false}],
            ecmaFeatures: {arrowFunctions: true}
        },
        {
            code: "/**\n* Start with caps and end with period.\n* @return {void} */\nfunction foo(){}",
            options: [{
                "matchDescription": "^[A-Z][A-Za-z0-9\\s]*[.]$"
            }]
        },
        {
            code: "/** Foo \n@return {void} Foo\n */\nfunction foo(){}",
            options: [{ prefer: { "return": "return" }}]
        },
        {
            code: "/** Foo \n@return Foo\n */\nfunction foo(){}",
            options: [{ requireReturnType: false }]
        },

        // classes
        {
            code:
                "/**\n" +
                " * Description for A.\n" +
                " */\n" +
                "class A {\n" +
                "    /**\n" +
                "     * Description for constructor.\n" +
                "     * @param {object[]} xs - xs\n" +
                "     */\n" +
                "    constructor(xs) {\n" +
                "        this.a = xs;" +
                "    }\n" +
                "}",
            options: [{requireReturn: false}],
            ecmaFeatures: {
                classes: true
            }
        },
        {
            code:
                "/**\n" +
                " * Description for A.\n" +
                " */\n" +
                "class A {\n" +
                "    /**\n" +
                "     * Description for constructor.\n" +
                "     * @param {object[]} xs - xs\n" +
                "     * @returns {void}\n" +
                "     */\n" +
                "    constructor(xs) {\n" +
                "        this.a = xs;" +
                "    }\n" +
                "}",
            options: [{requireReturn: true}],
            ecmaFeatures: {
                classes: true
            }
        },
        {
            code:
                "/**\n" +
                " * Description for A.\n" +
                " */\n" +
                "class A {\n" +
                "    /**\n" +
                "     * Description for constructor.\n" +
                "     * @param {object[]} xs - xs\n" +
                "     * @returns {void}\n" +
                "     */\n" +
                "    constructor(xs) {\n" +
                "        this.a = xs;" +
                "    }\n" +
                "    /**\n" +
                "     * Description for method.\n" +
                "     * @param {object[]} xs - xs\n" +
                "     * @returns {void}\n" +
                "     */\n" +
                "    print(xs) {\n" +
                "        this.a = xs;" +
                "    }\n" +
                "}",
            options: [],
            ecmaFeatures: {
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
            options: [{ prefer: { "return": "returns" }}],
            errors: [{
                message: "Use @returns instead.",
                type: "Block"
            }]
        },
        {
            code: "/** Foo \n@argument {int} bar baz\n */\nfunction foo(bar){}",
            options: [{ prefer: { "argument": "arg" }}],
            errors: [{
                message: "Use @arg instead.",
                type: "Block"
            }, {
                message: "Missing JSDoc @returns for function.",
                type: "Block"
            }]
        },
        {
            code: "/** Foo \n */\nfunction foo(){}",
            options: [{ prefer: { "returns": "return" }}],
            errors: [{
                message: "Missing JSDoc @return for function.",
                type: "Block"
            }]
        },
        {
            code: "/** Foo \n@return {void} Foo\n */\nfoo.bar = () => {}",
            options: [{ prefer: { "return": "returns" }}],
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
            code: "/**\n* Foo\n* @override\n* @param {string} a desc\n */\nfunction foo(b){}",
            errors: [{
                message: "Expected JSDoc for 'b' but found 'a'.",
                type: "Block"
            }]
        },
        {
            code: "/**\n* Foo\n* @inheritdoc\n* @param {string} a desc\n */\nfunction foo(b){}",
            errors: [{
                message: "Expected JSDoc for 'b' but found 'a'.",
                type: "Block"
            }]
        },
        {
            code: "/**\n* Foo\n* @param {string} a desc\n*/\nfunction foo(a){var t = false; if(t) {return t;}}",
            options: [{requireReturn: false}],
            errors: [{
                message: "Missing JSDoc @returns for function.",
                type: "Block"
            }]
        },
        {
            code: "/**\n* Foo\n* @param {string} a desc\n*/\nfunction foo(a){var t = false; if(t) {return null;}}",
            options: [{requireReturn: false}],
            errors: [{
                message: "Missing JSDoc @returns for function.",
                type: "Block"
            }]
        },
        {
            code: "/**\n* Foo\n* @param {string} a desc\n@returns {MyClass}*/\nfunction foo(a){var t = false; if(t) {process(t);}}",
            options: [{requireReturn: false}],
            errors: [{
                message: "Unexpected @returns tag; function has no return statement.",
                type: "Block"
            }]
        },
        {
            code: "/**\n * Does something. \n* @param {string} a - this is a \n* @return {Array<number>} The result of doing it \n*/\n export function doSomething(a) { }",
            options: [{"prefer": { "return": "returns" }}],
            ecmaFeatures: { modules: true },
            errors: [{
                message: "Use @returns instead.",
                type: "Block"
            }]
        },
        {
            code: "/**\n * Does something. \n* @param {string} a - this is a \n* @return {Array<number>} The result of doing it \n*/\n export default function doSomething(a) { }",
            options: [{"prefer": { "return": "returns" }}],
            ecmaFeatures: { modules: true },
            errors: [{
                message: "Use @returns instead.",
                type: "Block"
            }]
        },
        {
            code: "/** foo */ var foo = () => bar();",
            options: [{requireReturn: false}],
            ecmaFeatures: {arrowFunctions: true},
            errors: [{
                message: "Missing JSDoc @returns for function.",
                type: "Block"
            }]
        },
        {
            code: "/** foo */ var foo = () => { return bar(); };",
            options: [{requireReturn: false}],
            ecmaFeatures: {arrowFunctions: true},
            errors: [{
                message: "Missing JSDoc @returns for function.",
                type: "Block"
            }]
        },
        {
            code: "/** @returns {object} foo */ var foo = () => { bar(); };",
            options: [{requireReturn: false}],
            ecmaFeatures: {arrowFunctions: true},
            errors: [{
                message: "Unexpected @returns tag; function has no return statement.",
                type: "Block"
            }]
        },
        {
            code: "/**\n* @param fields [Array]\n */\n function foo(){}",
            errors: [
                {
                    message: "Missing JSDoc parameter type for 'fields'.",
                    type: "Block"
                },
                {
                    message: "Missing JSDoc @returns for function.",
                    type: "Block"
                }
            ]
        },
        {
            code: "/**\n* Start with caps and end with period\n* @return {void} */\nfunction foo(){}",
            options: [{
                "matchDescription": "^[A-Z][A-Za-z0-9\\s]*[.]$"
            }],
            errors: [{
                message: "JSDoc description does not satisfy the regex pattern.",
                type: "Block"
            }]
        },
        {
            code: "/** Foo \n@return Foo\n */\nfunction foo(){}",
            options: [{ prefer: { "return": "return" }}],
            errors: [{
                message: "Missing JSDoc return type.",
                type: "Block"
            }]
        },
        {
            code: "/** Foo \n@return sdf\n */\nfunction foo(){}",
            options: [{
                prefer: { "return": "return" },
                requireReturn: false
            }],
            errors: [{
                message: "Unexpected @return tag; function has no return statement.",
                type: "Block"
            }]
        },
        // classes
        {
            code:
                "/**\n" +
                " * Description for A\n" +
                " */\n" +
                "class A {\n" +
                "    /**\n" +
                "     * Description for constructor\n" +
                "     * @param {object[]} xs - xs\n" +
                "     */\n" +
                "    constructor(xs) {\n" +
                "        this.a = xs;" +
                "    }\n" +
                "}",
            options: [{
                requireReturn: false,
                "matchDescription": "^[A-Z][A-Za-z0-9\\s]*[.]$"
            }],
            errors: [
                {
                    message: "JSDoc description does not satisfy the regex pattern.",
                    type: "Block"
                },
                {
                    message: "JSDoc description does not satisfy the regex pattern.",
                    type: "Block"
                }
            ],
            ecmaFeatures: {
                classes: true
            }
        },
        {
            code:
                "/**\n" +
                " * Description for a\n" +
                " */\n" +
                "var A = class {\n" +
                "    /**\n" +
                "     * Description for constructor.\n" +
                "     * @param {object[]} xs - xs\n" +
                "     */\n" +
                "    constructor(xs) {\n" +
                "        this.a = xs;" +
                "    }\n" +
                "};",
            options: [{
                requireReturn: true,
                "matchDescription": "^[A-Z][A-Za-z0-9\\s]*[.]$"
            }],
            errors: [
                {
                    message: "JSDoc description does not satisfy the regex pattern.",
                    type: "Block"
                },
                {
                    message: "Missing JSDoc @returns for function.",
                    type: "Block"
                }
            ],
            ecmaFeatures: {
                classes: true
            }
        },
        {
            code:
                "/**\n" +
                " * Description for A.\n" +
                " */\n" +
                "class A {\n" +
                "    /**\n" +
                "     * Description for constructor.\n" +
                "     * @param {object[]} xs - xs\n" +
                "     * @returns {void}\n" +
                "     */\n" +
                "    constructor(xs) {\n" +
                "        this.a = xs;" +
                "    }\n" +
                "    /**\n" +
                "     * Description for method.\n" +
                "     */\n" +
                "    print(xs) {\n" +
                "        this.a = xs;" +
                "    }\n" +
                "}",
            options: [],
            errors: [
                {
                    message: "Missing JSDoc @returns for function.",
                    type: "Block"
                },
                {
                    message: "Missing JSDoc for parameter 'xs'.",
                    type: "Block"
                }
            ],
            ecmaFeatures: {
                classes: true
            }
        }
    ]
});
