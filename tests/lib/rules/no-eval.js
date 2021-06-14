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
        "globalThis.eval('foo')",
        { code: "globalThis.eval('foo')", env: { es2017: true } },
        { code: "globalThis.eval('foo')", env: { browser: true } },
        { code: "globalThis.noneval('foo')", env: { es2020: true } },
        { code: "function foo() { var eval = 'foo'; globalThis[eval]('foo') }", env: { es2020: true } },
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
        { code: "function foo() { this.eval('foo') }", options: [{ allowIndirect: true }] },
        { code: "(0, globalThis.eval)('foo')", options: [{ allowIndirect: true }], env: { es2020: true } },
        { code: "(0, globalThis['eval'])('foo')", options: [{ allowIndirect: true }], env: { es2020: true } },
        { code: "var EVAL = globalThis.eval; EVAL('foo')", options: [{ allowIndirect: true }] },
        { code: "function foo() { globalThis.eval('foo') }", options: [{ allowIndirect: true }], env: { es2020: true } },
        { code: "globalThis.globalThis.eval('foo');", options: [{ allowIndirect: true }], env: { es2020: true } },
        { code: "eval?.('foo')", options: [{ allowIndirect: true }], parserOptions: { ecmaVersion: 2020 } },
        { code: "window?.eval('foo')", options: [{ allowIndirect: true }], parserOptions: { ecmaVersion: 2020 }, env: { browser: true } },
        { code: "(window?.eval)('foo')", options: [{ allowIndirect: true }], parserOptions: { ecmaVersion: 2020 }, env: { browser: true } }
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
        { code: "(0, window.eval)('foo')", errors: [{ messageId: "unexpected", type: "MemberExpression", column: 12, endColumn: 16 }], env: { browser: true } },
        { code: "(0, window['eval'])('foo')", errors: [{ messageId: "unexpected", type: "MemberExpression", column: 12, endColumn: 18 }], env: { browser: true } },
        { code: "var EVAL = eval; EVAL('foo')", errors: [{ messageId: "unexpected", type: "Identifier", column: 12, endColumn: 16 }] },
        { code: "var EVAL = this.eval; EVAL('foo')", errors: [{ messageId: "unexpected", type: "MemberExpression", column: 17, endColumn: 21 }] },
        { code: "(function(exe){ exe('foo') })(eval);", errors: [{ messageId: "unexpected", type: "Identifier", column: 31, endColumn: 35 }] },
        { code: "window.eval('foo')", errors: [{ messageId: "unexpected", type: "CallExpression", column: 8, endColumn: 12 }], env: { browser: true } },
        { code: "window.window.eval('foo')", errors: [{ messageId: "unexpected", type: "CallExpression", column: 15, endColumn: 19 }], env: { browser: true } },
        { code: "window.window['eval']('foo')", errors: [{ messageId: "unexpected", type: "CallExpression", column: 15, endColumn: 21 }], env: { browser: true } },
        { code: "global.eval('foo')", errors: [{ messageId: "unexpected", type: "CallExpression", column: 8, endColumn: 12 }], env: { node: true } },
        { code: "global.global.eval('foo')", errors: [{ messageId: "unexpected", type: "CallExpression", column: 15, endColumn: 19 }], env: { node: true } },
        { code: "global.global[`eval`]('foo')", parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpected", type: "CallExpression", column: 15, endColumn: 21 }], env: { node: true } },
        { code: "this.eval('foo')", errors: [{ messageId: "unexpected", type: "CallExpression", column: 6, endColumn: 10 }] },
        { code: "function foo() { this.eval('foo') }", errors: [{ messageId: "unexpected", type: "CallExpression", column: 23, endColumn: 27 }] },
        { code: "var EVAL = globalThis.eval; EVAL('foo')", errors: [{ messageId: "unexpected", type: "MemberExpression", column: 23, endColumn: 27 }], env: { es2020: true } },
        { code: "globalThis.eval('foo')", errors: [{ messageId: "unexpected", type: "CallExpression", column: 12, endColumn: 16 }], env: { es2020: true } },
        { code: "globalThis.globalThis.eval('foo')", errors: [{ messageId: "unexpected", type: "CallExpression", column: 23, endColumn: 27 }], env: { es2020: true } },
        { code: "globalThis.globalThis['eval']('foo')", errors: [{ messageId: "unexpected", type: "CallExpression", column: 23, endColumn: 29 }], env: { es2020: true } },
        { code: "(0, globalThis.eval)('foo')", errors: [{ messageId: "unexpected", type: "MemberExpression", column: 16, endColumn: 20 }], env: { es2020: true } },
        { code: "(0, globalThis['eval'])('foo')", errors: [{ messageId: "unexpected", type: "MemberExpression", column: 16, endColumn: 22 }], env: { es2020: true } },

        // Optional chaining
        {
            code: "window?.eval('foo')",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpected" }],
            globals: { window: "readonly" }
        },
        {
            code: "(window?.eval)('foo')",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpected" }],
            globals: { window: "readonly" }
        },
        {
            code: "(window?.window).eval('foo')",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpected" }],
            globals: { window: "readonly" }
        }
    ]
});
