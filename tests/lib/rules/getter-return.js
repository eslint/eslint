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
const noReturnMessage = "Expected to return a value in getter 'bar'.";
const noLastReturnMessage = "Expected to return a value at the end of getter 'bar'.";

ruleTester.run("enforce-return-in-getter", rule, {

    valid: [
        { code: "var foo = { get: function(){} };" },
        { code: "var foo = { get bar(){return true;} };" },
        { code: "var foo = { bar(){return true;} };", env: { es6: true } },
        { code: "var foo = { bar(){} };", env: { es6: true } },

        { code: "class foo { get bar(){return true;} }", env: { es6: true } },
        { code: "class foo { get(){} }", env: { es6: true } },
        { code: "class foo { get(){return true;} }", env: { es6: true } },

        { code: "var get = function(){};" }
    ],

    invalid: [

        // TODO: why data: { name: "getter 'bar'"} is not working?
        { code: "var foo = { get bar() {return;} }", env: { es6: true }, errors: [{ message: noReturnMessage, data: { name: "getter 'bar'" } }] },
        { code: "var foo = { get bar(){if(bar) {return true;}} }", env: { es6: true }, errors: [{ message: noLastReturnMessage, data: { name: "getter 'bar'" } }] },
        { code: "var foo = { get bar(){if(bar) {return;} return true;} }", env: { es6: true }, errors: [{ message: noReturnMessage, data: { name: "getter 'bar'" } }] }

    ]
});
