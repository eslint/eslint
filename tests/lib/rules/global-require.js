/**
 * @fileoverview Tests for global-require
 * @author Jamund Ferguson
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/global-require"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
const ruleTester = new RuleTester();

const valid = [
    { code: "var x = require('y');" },
    { code: "if (x) { x.require('y'); }" },
    { code: "var x;\nx = require('y');" },
    { code: "var x = 1, y = require('y');" },
    { code: "var x = require('y'), y = require('y'), z = require('z');" },
    { code: "var x = require('y').foo;" },
    { code: "require('y').foo();" },
    { code: "require('y');" },
    { code: "function x(){}\n\n\nx();\n\n\nif (x > y) {\n\tdoSomething()\n\n}\n\nvar x = require('y').foo;" },
    { code: "var logger = require(DEBUG ? 'dev-logger' : 'logger');" },
    { code: "var logger = DEBUG ? require('dev-logger') : require('logger');" },
    { code: "function localScopedRequire(require) { require('y'); }" },
    { code: "var someFunc = require('./someFunc'); someFunc(function(require) { return('bananas'); });" }
];

const error = { messageId: "unexpected", type: "CallExpression" };

const invalid = [

    // block statements
    {
        code: "if (process.env.NODE_ENV === 'DEVELOPMENT') {\n\trequire('debug');\n}",
        errors: [error]
    },
    {
        code: "var x; if (y) { x = require('debug'); }",
        errors: [error]
    },
    {
        code: "var x; if (y) { x = require('debug').baz; }",
        errors: [error]
    },
    {
        code: "function x() { require('y') }",
        errors: [error]
    },
    {
        code: "try { require('x'); } catch (e) { console.log(e); }",
        errors: [error]
    },

    // non-block statements
    {
        code: "var getModule = x => require(x);",
        parserOptions: { ecmaVersion: 6 },
        errors: [error]
    },
    {
        code: "var x = (x => require(x))('weird')",
        parserOptions: { ecmaVersion: 6 },
        errors: [error]
    },
    {
        code: "switch(x) { case '1': require('1'); break; }",
        errors: [error]
    }
];

ruleTester.run("global-require", rule, {
    valid,
    invalid
});
