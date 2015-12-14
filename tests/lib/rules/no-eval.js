/**
 * @fileoverview Tests for no-eval rule.
 * @author Nicholas C. Zakas
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * @copyright 2013 Nicholas C. Zakas. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-eval"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-eval", rule, {
    valid: [
        "Eval(foo)",
        "setTimeout('foo')",
        "setInterval('foo')",
        "window.setTimeout('foo')",
        "window.setInterval('foo')",

        // User-defined eval methods.
        "window.eval('foo')",
        { code: "window.eval('foo')", env: {"node": true} },
        { code: "window.noeval('foo')", env: {"browser": true} },
        { code: "function foo() { var eval = 'foo'; window[eval]('foo') }", env: {"browser": true} },
        "global.eval('foo')",
        { code: "global.eval('foo')", env: {"browser": true} },
        { code: "global.noeval('foo')", env: {"node": true} },
        { code: "function foo() { var eval = 'foo'; global[eval]('foo') }", env: {"node": true} },
        "this.noeval('foo');",
        "function foo() { 'use strict'; this.eval('foo'); }",
        "var obj = {foo: function() { this.eval('foo'); }}",
        "var obj = {}; obj.foo = function() { this.eval('foo'); }",
        { code: "class A { foo() { this.eval(); } }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A { static foo() { this.eval(); } }", parserOptions: { ecmaVersion: 6 } },

        // Allows indirect eval
        { code: "(0, eval)('foo')", options: [{"allowIndirect": true}] },
        { code: "(0, window.eval)('foo')", env: {"browser": true}, options: [{"allowIndirect": true}] },
        { code: "(0, window['eval'])('foo')", env: {"browser": true}, options: [{"allowIndirect": true}] },
        { code: "var EVAL = eval; EVAL('foo')", options: [{"allowIndirect": true}] },
        { code: "var EVAL = this.eval; EVAL('foo')", options: [{"allowIndirect": true}] },
        { code: "(function(exe){ exe('foo') })(eval);", options: [{"allowIndirect": true}] },
        { code: "window.eval('foo')", env: {"browser": true}, options: [{"allowIndirect": true}] },
        { code: "window.window.eval('foo')", env: {"browser": true}, options: [{"allowIndirect": true}] },
        { code: "window.window['eval']('foo')", env: {"browser": true}, options: [{"allowIndirect": true}] },
        { code: "global.eval('foo')", env: {"node": true}, options: [{"allowIndirect": true}] },
        { code: "global.global.eval('foo')", env: {"node": true}, options: [{"allowIndirect": true}] },
        { code: "this.eval('foo')", options: [{"allowIndirect": true}] },
        { code: "function foo() { this.eval('foo') }", options: [{"allowIndirect": true}] }
    ],

    invalid: [
        // Direct eval
        { code: "eval(foo)", errors: [{ message: "eval can be harmful.", type: "CallExpression"}] },
        { code: "eval('foo')", errors: [{ message: "eval can be harmful.", type: "CallExpression"}] },
        { code: "function foo(eval) { eval('foo') }", errors: [{ message: "eval can be harmful.", type: "CallExpression"}] },
        { code: "eval(foo)", options: [{"allowIndirect": true}], errors: [{ message: "eval can be harmful.", type: "CallExpression"}] },
        { code: "eval('foo')", options: [{"allowIndirect": true}], errors: [{ message: "eval can be harmful.", type: "CallExpression"}] },
        { code: "function foo(eval) { eval('foo') }", options: [{"allowIndirect": true}], errors: [{ message: "eval can be harmful.", type: "CallExpression"}] },

        // Indirect eval
        { code: "(0, eval)('foo')", errors: [{ message: "eval can be harmful.", type: "Identifier"}] },
        { code: "(0, window.eval)('foo')", env: {"browser": true}, errors: [{ message: "eval can be harmful.", type: "MemberExpression"}] },
        { code: "(0, window['eval'])('foo')", env: {"browser": true}, errors: [{ message: "eval can be harmful.", type: "MemberExpression"}] },
        { code: "var EVAL = eval; EVAL('foo')", errors: [{ message: "eval can be harmful.", type: "Identifier"}] },
        { code: "var EVAL = this.eval; EVAL('foo')", errors: [{ message: "eval can be harmful.", type: "MemberExpression"}] },
        { code: "(function(exe){ exe('foo') })(eval);", errors: [{ message: "eval can be harmful.", type: "Identifier"}] },
        { code: "window.eval('foo')", env: {"browser": true}, errors: [{ message: "eval can be harmful.", type: "CallExpression"}] },
        { code: "window.window.eval('foo')", env: {"browser": true}, errors: [{ message: "eval can be harmful.", type: "CallExpression"}] },
        { code: "window.window['eval']('foo')", env: {"browser": true}, errors: [{ message: "eval can be harmful.", type: "CallExpression"}] },
        { code: "global.eval('foo')", env: {"node": true}, errors: [{ message: "eval can be harmful.", type: "CallExpression"}] },
        { code: "global.global.eval('foo')", env: {"node": true}, errors: [{ message: "eval can be harmful.", type: "CallExpression"}] },
        { code: "global.global[`eval`]('foo')", env: {"node": true}, parserOptions: { ecmaVersion: 6 }, errors: [{ message: "eval can be harmful.", type: "CallExpression"}] },
        { code: "this.eval('foo')", errors: [{ message: "eval can be harmful.", type: "CallExpression"}] },
        { code: "function foo() { this.eval('foo') }", errors: [{ message: "eval can be harmful.", type: "CallExpression"}] }
    ]
});
