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

// TODO: data is not working, so specify a name: "getter 'bar'"
const name = "getter 'bar'";
const noReturnMessage = `Expected to return a value in ${name}.`;
const noLastReturnMessage = `Expected to return a value at the end of ${name}.`;
const parserOptions = { ecmaVersion: 6 };

ruleTester.run("enforce-return-in-getter", rule, {

    valid: [

        // test obj: get
        { code: "var foo = { get bar(){return true;} };" },
        { code: "var foo = { bar: function(){return true;} };" },
        { code: "var foo = { bar(){return true;} };", parserOptions },
        { code: "var foo = { bar: function(){} };" },
        { code: "var foo = { bar(){} };", parserOptions },

        // test class: get
        { code: "class foo { get bar(){return true;} }", parserOptions },
        { code: "class foo { get bar(){if(baz){return true;} else {return false;} } }", parserOptions },
        { code: "class foo { get(){return true;} }", parserOptions },

        // add object.defineProperty
        { code: "Object.defineProperty(foo, \"bar\", { get: function () {return true;}});" },

        // not getter.
        { code: "var get = function(){};" }
    ],

    invalid: [

        // TODO: why data: { name: "getter 'bar'"} is not working?
        // test obj: get
        { code: "var foo = { get bar() {} };", parserOptions, errors: [{ message: noReturnMessage, data: { name: "getter 'bar'" } }] },
        { code: "var foo = { get bar() {return;} };", parserOptions, errors: [{ message: noReturnMessage, data: { name: "getter 'bar'" } }] },
        { code: "var foo = { get bar() {return; ;} };", parserOptions, errors: [{ message: noReturnMessage, data: { name: "getter 'bar'" } }] },
        { code: "var foo = { get bar() {return 1; return;} };", parserOptions, errors: [{ message: noReturnMessage, data: { name: "getter 'bar'" } }] },
        { code: "var foo = { get bar() {return; return 1;} };", parserOptions, errors: [{ message: noReturnMessage, data: { name: "getter 'bar'" } }] },
        { code: "var foo = { get bar(){if(bar) {return true;}} };", parserOptions, errors: [{ message: noLastReturnMessage, data: { name: "getter 'bar'" } }] },
        { code: "var foo = { get bar(){if(bar) {return true;} return;} };", parserOptions, errors: [{ message: noReturnMessage, data: { name: "getter 'bar'" } }] },
        { code: "var foo = { get bar(){if(bar) {return true;} ;} };", parserOptions, errors: [{ message: noLastReturnMessage, data: { name: "getter 'bar'" } }] },
        { code: "var foo = { get bar(){if(bar) {return;} return true;} };", parserOptions, errors: [{ message: noReturnMessage, data: { name: "getter 'bar'" } }] },

        // test class: get
        { code: "class foo { get bar(){} }", parserOptions, errors: [{ message: noReturnMessage, data: { name: "getter 'bar'" } }] },
        { code: "class foo { get bar(){return;} }", parserOptions, errors: [{ message: noReturnMessage, data: { name: "getter 'bar'" } }] },
        { code: "class foo { get bar(){if(bar) {return true;}} }", parserOptions, errors: [{ message: noLastReturnMessage, data: { name: "getter 'bar'" } }] },
        { code: "class foo { get bar(){if(bar) {return;} return true;} }", parserOptions, errors: [{ message: noReturnMessage, data: { name: "getter 'bar'" } }] },

        // add object.defineProperty
        { code: "Object.defineProperty(foo, \"bar\", { get: function (){return;}});", errors: [{ message: "Expected to return a value in method 'get'.", data: { name: "getter 'bar'" } }] },
        { code: "Object.defineProperty(foo, \"bar\", { get: function (){if(bar) {return true;}}});", errors: [{ message: "Expected to return a value at the end of method 'get'.", data: { name: "getter 'bar'" } }] },
        { code: "Object.defineProperty(foo, \"bar\", { get: function (){if(bar) {return;} return true;}});", errors: [{ message: "Expected to return a value in method 'get'.", data: { name: "getter 'bar'" } }] }

    ]
});
