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
const expectedError = { messageId: "expected", data: { name: "getter 'bar'" } };
const expectedAlwaysError = { messageId: "expectedAlways", data: { name: "getter 'bar'" } };
const options = [{ allowImplicit: true }];

ruleTester.run("getter-return", rule, {

    valid: [

        /*
         * test obj: get
         * option: {allowImplicit: false}
         */
        "var foo = { get bar(){return true;} };",

        // option: {allowImplicit: true}
        { code: "var foo = { get bar() {return;} };", options },
        { code: "var foo = { get bar(){return true;} };", options },
        { code: "var foo = { get bar(){if(bar) {return;} return true;} };", options },

        /*
         * test class: get
         * option: {allowImplicit: false}
         */
        "class foo { get bar(){return true;} }",
        "class foo { get bar(){if(baz){return true;} else {return false;} } }",
        "class foo { get(){return true;} }",

        // option: {allowImplicit: true}
        { code: "class foo { get bar(){return true;} }", options },
        { code: "class foo { get bar(){return;} }", options },

        /*
         * test object.defineProperty(s)
         * option: {allowImplicit: false}
         */
        "Object.defineProperty(foo, \"bar\", { get: function () {return true;}});",
        "Object.defineProperty(foo, \"bar\", { get: function () { ~function (){ return true; }();return true;}});",
        "Object.defineProperties(foo, { bar: { get: function () {return true;}} });",
        "Object.defineProperties(foo, { bar: { get: function () { ~function (){ return true; }(); return true;}} });",

        // option: {allowImplicit: true}
        { code: "Object.defineProperty(foo, \"bar\", { get: function () {return true;}});", options },
        { code: "Object.defineProperty(foo, \"bar\", { get: function (){return;}});", options },
        { code: "Object.defineProperties(foo, { bar: { get: function () {return true;}} });", options },
        { code: "Object.defineProperties(foo, { bar: { get: function () {return;}} });", options },

        // not getter.
        "var get = function(){};",
        "var get = function(){ return true; };",
        "var foo = { bar(){} };",
        "var foo = { bar(){ return true; } };",
        "var foo = { bar: function(){} };",
        "var foo = { bar: function(){return;} };",
        "var foo = { bar: function(){return true;} };",
        "var foo = { get: function () {} }",
        "var foo = { get: () => {}};"
    ],

    invalid: [

        /*
         * test obj: get
         * option: {allowImplicit: false}
         */
        { code: "var foo = { get bar() {} };", errors: [expectedError] },
        { code: "var foo = { get bar(){if(baz) {return true;}} };", errors: [expectedAlwaysError] },
        { code: "var foo = { get bar() { ~function () {return true;}} };", errors: [expectedError] },

        // option: {allowImplicit: true}
        { code: "var foo = { get bar() {} };", options, errors: [expectedError] },
        { code: "var foo = { get bar() {if (baz) {return;}} };", options, errors: [expectedAlwaysError] },

        /*
         * test class: get
         * option: {allowImplicit: false}
         */
        { code: "class foo { get bar(){} }", errors: [expectedError] },
        { code: "class foo { get bar(){ if (baz) { return true; }}}", errors: [expectedAlwaysError] },
        { code: "class foo { get bar(){ ~function () { return true; }()}}", errors: [expectedError] },

        // option: {allowImplicit: true}
        { code: "class foo { get bar(){} }", options, errors: [expectedError] },
        { code: "class foo { get bar(){if (baz) {return true;} } }", options, errors: [expectedAlwaysError] },

        /*
         * test object.defineProperty(s)
         * option: {allowImplicit: false}
         */
        { code: "Object.defineProperty(foo, \"bar\", { get: function (){}});", errors: [{ messageId: "expected", data: { name: "method 'get'" } }] },
        { code: "Object.defineProperty(foo, \"bar\", { get: () => {}});", errors: [{ messageId: "expected", data: { name: "arrow function 'get'" } }] },
        { code: "Object.defineProperty(foo, \"bar\", { get: function (){if(bar) {return true;}}});", errors: [{ messageId: "expectedAlways" }] },
        { code: "Object.defineProperty(foo, \"bar\", { get: function (){ ~function () { return true; }()}});", errors: [{ messageId: "expected" }] },
        { code: "Object.defineProperties(foo, { bar: { get: function () {}} });", options, errors: [{ messageId: "expected" }] },
        { code: "Object.defineProperties(foo, { bar: { get: function (){if(bar) {return true;}}}});", options, errors: [{ messageId: "expectedAlways" }] },
        { code: "Object.defineProperties(foo, { bar: { get: function () {~function () { return true; }()}} });", options, errors: [{ messageId: "expected" }] },

        // option: {allowImplicit: true}
        { code: "Object.defineProperty(foo, \"bar\", { get: function (){}});", options, errors: [{ messageId: "expected" }] }
    ]
});
