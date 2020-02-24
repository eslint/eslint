/**
 * @fileoverview Tests for no-eval rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-eval"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-eval", rule, {
    valid: [
        "Eval(foo)",
        "setTimeout('foo')",
        "setInterval('foo')",
        "window.setTimeout('foo')",
        "window.setInterval('foo')",

        // User-defined eval methods.
        "window.eval('foo')",
        { code: "window.eval('foo')", env: { node: true } },
        { code: "window.noeval('foo')", env: { browser: true } },
        { code: "function foo() { var eval = 'foo'; window[eval]('foo') }", env: { browser: true } },
        "global.eval('foo')",
        { code: "global.eval('foo')", env: { browser: true } },
        { code: "global.noeval('foo')", env: { node: true } },
        { code: "function foo() { var eval = 'foo'; global[eval]('foo') }", env: { node: true } },
        "this.noeval('foo');",
        "function foo() { 'use strict'; this.eval('foo'); }",
        { code: "function foo() { this.eval('foo'); }", parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "function foo() { this.eval('foo'); }", parserOptions: { ecmaFeatures: { impliedStrict: true } } },
        "var obj = {foo: function() { this.eval('foo'); }}",
        "var obj = {}; obj.foo = function() { this.eval('foo'); }",
        { code: "class A { foo() { this.eval(); } }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A { static foo() { this.eval(); } }", parserOptions: { ecmaVersion: 6 } },

        // Allows indirect eval
        { code: "(0, eval)('foo')", options: [{ allowIndirect: true }] },
        { code: "(0, window.eval)('foo')", options: [{ allowIndirect: true }], env: { browser: true } },
        { code: "(0, window['eval'])('foo')", options: [{ allowIndirect: true }], env: { browser: true } },
        { code: "var EVAL = eval; EVAL('foo')", options: [{ allowIndirect: true }] },
        { code: "var EVAL = this.eval; EVAL('foo')", options: [{ allowIndirect: true }] },
        { code: "(function(exe){ exe('foo') })(eval);", options: [{ allowIndirect: true }] },
        { code: "window.eval('foo')", options: [{ allowIndirect: true }], env: { browser: true } },
        { code: "window.window.eval('foo')", options: [{ allowIndirect: true }], env: { browser: true } },
        { code: "window.window['eval']('foo')", options: [{ allowIndirect: true }], env: { browser: true } },
        { code: "global.eval('foo')", options: [{ allowIndirect: true }], env: { node: true } },
        { code: "global.global.eval('foo')", options: [{ allowIndirect: true }], env: { node: true } },
        { code: "this.eval('foo')", options: [{ allowIndirect: true }] },
        { code: "function foo() { this.eval('foo') }", options: [{ allowIndirect: true }] }
    ],

    invalid: [

        // Direct eval
        { code: "eval(foo)", errors: [{ messageId: "unexpected", type: "CallExpression", column: 1, endColumn: 5 }] },
        { code: "eval('foo')", errors: [{ messageId: "unexpected", type: "CallExpression", column: 1, endColumn: 5 }] },
        { code: "function foo(eval) { eval('foo') }", errors: [{ messageId: "unexpected", type: "CallExpression", column: 22, endColumn: 26 }] },
        { code: "eval(foo)", options: [{ allowIndirect: true }], errors: [{ messageId: "unexpected", type: "CallExpression", column: 1, endColumn: 5 }] },
        { code: "eval('foo')", options: [{ allowIndirect: true }], errors: [{ messageId: "unexpected", type: "CallExpression", column: 1, endColumn: 5 }] },
        { code: "function foo(eval) { eval('foo') }", options: [{ allowIndirect: true }], errors: [{ messageId: "unexpected", type: "CallExpression", column: 22, endColumn: 26 }] },

        // Indirect eval
        { code: "(0, eval)('foo')", errors: [{ messageId: "unexpected", type: "Identifier", column: 5, endColumn: 9 }] },
        { code: "(0, window.eval)('foo')", env: { browser: true }, errors: [{ messageId: "unexpected", type: "MemberExpression", column: 12, endColumn: 16 }] },
        { code: "(0, window['eval'])('foo')", env: { browser: true }, errors: [{ messageId: "unexpected", type: "MemberExpression", column: 12, endColumn: 18 }] },
        { code: "var EVAL = eval; EVAL('foo')", errors: [{ messageId: "unexpected", type: "Identifier", column: 12, endColumn: 16 }] },
        { code: "var EVAL = this.eval; EVAL('foo')", errors: [{ messageId: "unexpected", type: "MemberExpression", column: 17, endColumn: 21 }] },
        { code: "(function(exe){ exe('foo') })(eval);", errors: [{ messageId: "unexpected", type: "Identifier", column: 31, endColumn: 35 }] },
        { code: "window.eval('foo')", env: { browser: true }, errors: [{ messageId: "unexpected", type: "CallExpression", column: 8, endColumn: 12 }] },
        { code: "window.window.eval('foo')", env: { browser: true }, errors: [{ messageId: "unexpected", type: "CallExpression", column: 15, endColumn: 19 }] },
        { code: "window.window['eval']('foo')", env: { browser: true }, errors: [{ messageId: "unexpected", type: "CallExpression", column: 15, endColumn: 21 }] },
        { code: "global.eval('foo')", env: { node: true }, errors: [{ messageId: "unexpected", type: "CallExpression", column: 8, endColumn: 12 }] },
        { code: "global.global.eval('foo')", env: { node: true }, errors: [{ messageId: "unexpected", type: "CallExpression", column: 15, endColumn: 19 }] },
        { code: "global.global[`eval`]('foo')", parserOptions: { ecmaVersion: 6 }, env: { node: true }, errors: [{ messageId: "unexpected", type: "CallExpression", column: 15, endColumn: 21 }] },
        { code: "this.eval('foo')", errors: [{ messageId: "unexpected", type: "CallExpression", column: 6, endColumn: 10 }] },
        { code: "function foo() { this.eval('foo') }", errors: [{ messageId: "unexpected", type: "CallExpression", column: 23, endColumn: 27 }] }
    ]
});
