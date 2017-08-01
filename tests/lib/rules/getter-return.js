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

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

// data is not working, so specify a name: "getter 'bar'"
const name = "getter 'bar'";
const noReturnMessage = `Expected to return a value in ${name}.`;
const noLastReturnMessage = `Expected ${name} to always return a value.`;
const options = [{ allowImplicit: true }];

ruleTester.run("getter-return", rule, {

    valid: [

        // test obj: get
        // option: {allowImplicit: false}
        { code: "var foo = { get bar(){return true;} };" },

        // option: {allowImplicit: true}
        { code: "var foo = { get bar() {return;} };", options },
        { code: "var foo = { get bar(){return true;} };", options },
        { code: "var foo = { get bar(){if(bar) {return;} return true;} };", options },

        // test class: get
        // option: {allowImplicit: false}
        { code: "class foo { get bar(){return true;} }" },
        { code: "class foo { get bar(){if(baz){return true;} else {return false;} } }" },
        { code: "class foo { get(){return true;} }" },

        // option: {allowImplicit: true}
        { code: "class foo { get bar(){return true;} }", options },
        { code: "class foo { get bar(){return;} }", options },

        // test object.defineProperty(s)
        // option: {allowImplicit: false}
        { code: "Object.defineProperty(foo, \"bar\", { get: function () {return true;}});" },
        { code: "Object.defineProperty(foo, \"bar\", { get: function () { ~function (){ return true; }();return true;}});" },
        { code: "Object.defineProperties(foo, { bar: { get: function () {return true;}} });" },
        { code: "Object.defineProperties(foo, { bar: { get: function () { ~function (){ return true; }(); return true;}} });" },

        // option: {allowImplicit: true}
        { code: "Object.defineProperty(foo, \"bar\", { get: function () {return true;}});", options },
        { code: "Object.defineProperty(foo, \"bar\", { get: function (){return;}});", options },
        { code: "Object.defineProperties(foo, { bar: { get: function () {return true;}} });", options },
        { code: "Object.defineProperties(foo, { bar: { get: function () {return;}} });", options },

        // not getter.
        { code: "var get = function(){};" },
        { code: "var get = function(){ return true; };" },
        { code: "var foo = { bar(){} };" },
        { code: "var foo = { bar(){ return true; } };" },
        { code: "var foo = { bar: function(){} };" },
        { code: "var foo = { bar: function(){return;} };" },
        { code: "var foo = { bar: function(){return true;} };" },
        { code: "var foo = { get: function () {} }" },
        { code: "var foo = { get: () => {}};" }
    ],

    invalid: [

        // test obj: get
        // option: {allowImplicit: false}
        { code: "var foo = { get bar() {} };", errors: [{ message: noReturnMessage }] },
        { code: "var foo = { get bar(){if(baz) {return true;}} };", errors: [{ message: noLastReturnMessage }] },
        { code: "var foo = { get bar() { ~function () {return true;}} };", errors: [{ message: noReturnMessage }] },

        // option: {allowImplicit: true}
        { code: "var foo = { get bar() {} };", options, errors: [{ message: noReturnMessage }] },
        { code: "var foo = { get bar() {if (baz) {return;}} };", options, errors: [{ message: noLastReturnMessage }] },

        // test class: get
        // option: {allowImplicit: false}
        { code: "class foo { get bar(){} }", errors: [{ message: noReturnMessage }] },
        { code: "class foo { get bar(){ if (baz) { return true; }}}", errors: [{ noLastReturnMessage }] },
        { code: "class foo { get bar(){ ~function () { return true; }()}}", errors: [{ noLastReturnMessage }] },

        // option: {allowImplicit: true}
        { code: "class foo { get bar(){} }", options, errors: [{ message: noReturnMessage }] },
        { code: "class foo { get bar(){if (baz) {return true;} } }", options, errors: [{ message: noLastReturnMessage }] },

        // test object.defineProperty(s)
        // option: {allowImplicit: false}
        { code: "Object.defineProperty(foo, \"bar\", { get: function (){}});", errors: [{ noReturnMessage }] },
        { code: "Object.defineProperty(foo, \"bar\", { get: () => {}});", errors: [{ noReturnMessage }] },
        { code: "Object.defineProperty(foo, \"bar\", { get: function (){if(bar) {return true;}}});", errors: [{ message: "Expected method 'get' to always return a value." }] },
        { code: "Object.defineProperty(foo, \"bar\", { get: function (){ ~function () { return true; }()}});", errors: [{ noReturnMessage }] },
        { code: "Object.defineProperties(foo, { bar: { get: function () {}} });", options, errors: [{ noReturnMessage }] },
        { code: "Object.defineProperties(foo, { bar: { get: function (){if(bar) {return true;}}}});", options, errors: [{ message: "Expected method 'get' to always return a value." }] },
        { code: "Object.defineProperties(foo, { bar: { get: function () {~function () { return true; }()}} });", options, errors: [{ noReturnMessage }] },

        // option: {allowImplicit: true}
        { code: "Object.defineProperty(foo, \"bar\", { get: function (){}});", options, errors: [{ message: "Expected to return a value in method 'get'." }] }
    ]
});
