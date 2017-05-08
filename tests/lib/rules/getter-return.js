/**
 * @fileoverview Enforces that a return statement is present in property getters.
 * @author Aladdin-ADD(hh_2013@foxmail.com)
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/getter-return");
const RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

// data is not working, so specify a name: "getter 'bar'"
const name = "getter 'bar'";
const noReturnMessage = `Expected to return a value in ${name}.`;
const noLastReturnMessage = `Expected to return a value at the end of ${name}.`;
const parserOptions = { ecmaVersion: 6 };
const options = [{ noImplicit: true }];

ruleTester.run("getter-return", rule, {

    valid: [

        // test obj: get, option: {noImplicit: false}
        { code: "var foo = { get bar(){return true;} };" },
        { code: "var foo = { get bar(){return;} };" },
        { code: "var foo = { bar: function(){return true;} };" },
        { code: "var foo = { bar: function(){return;} };" },
        { code: "var foo = { bar(){return true;} };", parserOptions },
        { code: "var foo = { bar(){return;} };", parserOptions },
        { code: "var foo = { bar(){~function (){}();return;} };", parserOptions },
        { code: "var foo = { bar(){~function (){return true;}();return;} };", parserOptions },

        // test class: get, option: {noImplicit: false}
        { code: "class foo { get bar(){return true;} }", parserOptions },
        { code: "class foo { get bar(){if(baz){return true;} else {return false;} } }", parserOptions },
        { code: "class foo { get bar(){if(baz){return;} else {return false;} } }", parserOptions },
        { code: "class foo { get(){return true;} }", parserOptions },
        { code: "var foo = { get bar(){if(bar) {return;} return true;} };", parserOptions, errors: [] },
        { code: "var foo = { get bar(){ ~function (){ return true; }(); return; } };", parserOptions, errors: [] },
        { code: "var foo = { get bar(){ ~function (){}(); return; } };", parserOptions, errors: [] },

        // test object.defineProperty(s), option: {noImplicit: false}
        { code: "Object.defineProperty(foo, \"bar\", { get: function () {return true;}});" },
        { code: "Object.defineProperty(foo, \"bar\", { get: function () {return;}});" },
        { code: "Object.defineProperies(foo, { bar: { get: function () {return true;}} });" },
        { code: "Object.defineProperies(foo, { bar: { get: function () {return;}} });" },
        { code: "Object.defineProperty(foo, \"bar\", { get: function () { ~function (){ return true; }();return true;}});" },
        { code: "Object.defineProperty(foo, \"bar\", { get: function () { ~function (){}();return;}});" },
        { code: "Object.defineProperies(foo, { bar: { get: function () { ~function (){ return true; }(); return true;}} });" },
        { code: "Object.defineProperies(foo, { bar: { get: function () { ~function (){}(); return;}} });" },

        // test option: {noImplicit: true}
        { code: "var foo = { get bar(){return true;} };", options },
        { code: "class foo { get bar(){return true;} }", options, parserOptions },
        { code: "Object.defineProperty(foo, \"bar\", { get: function () {return true;}});", options },
        { code: "Object.defineProperies(foo, { bar: { get: function () {return true;}} });", options },

        // not getter.
        { code: "var get = function(){};" },
        { code: "var get = function(){ return true; };" },
        { code: "var foo = { bar: function(){} };" },
        { code: "var foo = { bar: function(){ return true; } };" },
        { code: "var foo = { bar(){} };", parserOptions },
        { code: "var foo = { bar(){ return true; } };", parserOptions }
    ],

    invalid: [

        // test obj: get, option: {noImplicit: false}
        { code: "var foo = { get bar() {} };", parserOptions, errors: [{ message: noReturnMessage }] },
        { code: "var foo = { get bar(){if(bar) {return true;}} };", parserOptions, errors: [{ message: noLastReturnMessage }] },
        { code: "var foo = { get bar(){if(bar) {return true;} ;} };", parserOptions, errors: [{ message: noLastReturnMessage }] },

        // test class: get, option: {noImplicit: false}
        { code: "class foo { get bar(){} }", parserOptions, errors: [{ message: noReturnMessage }] },

        // test object.defineProperty, option: {noImplicit: false}
        { code: "Object.defineProperty(foo, \"bar\", { get: function (){if(bar) {return true;}}});", errors: [{ message: "Expected to return a value at the end of method 'get'." }] },

        // test option: {noImplicit: true}
        { code: "var foo = { get bar() {return;} };", options, parserOptions, errors: [{ message: noReturnMessage }] },
        { code: "var foo = { get bar() {return; ;} };", options, parserOptions, errors: [{ message: noReturnMessage }] },
        { code: "var foo = { get bar() {return; return 1;} };", options, parserOptions, errors: [{ message: noReturnMessage }] },
        { code: "var foo = { get bar(){if(bar) {return true;} return;} };", options, parserOptions, errors: [{ message: noReturnMessage }] },
        { code: "var foo = { get bar(){if(bar) {return;} return true;} };", options, parserOptions, errors: [{ message: noReturnMessage }] },
        { code: "class foo { get bar(){return;} }", options, parserOptions, errors: [{ message: noReturnMessage }] },
        { code: "class foo { get bar(){if(bar) {return true;}} }", options, parserOptions, errors: [{ message: noLastReturnMessage }] },
        { code: "class foo { get bar(){if(bar) {return;} return true;} }", options, parserOptions, errors: [{ message: noReturnMessage }] },
        { code: "Object.defineProperty(foo, \"bar\", { get: function (){return;}});", options, errors: [{ message: "Expected to return a value in method 'get'." }] },
        { code: "Object.defineProperty(foo, \"bar\", { get: function (){if(bar) {return;} return true;}});", options, errors: [{ message: "Expected to return a value in method 'get'." }] },
        { code: "Object.defineProperies(foo, { bar: { get: function () {return;}} });", options, errors: [{ message: "Expected to return a value in method 'get'." }] },

        { code: "class foo { get bar(){} }", options, parserOptions, errors: [{ message: noReturnMessage }] }

    ]
});
