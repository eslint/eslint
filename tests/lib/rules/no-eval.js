/**
 * @fileoverview Tests for no-eval rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-eval"),
    RuleTester = require("../../../lib/rule-tester/flat-rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    languageOptions: {
        ecmaVersion: 5,
        sourceType: "script"
    }
});

ruleTester.run("no-eval", rule, {
    valid: [
        "Eval(foo)",
        "setTimeout('foo')",
        "setInterval('foo')",
        "window.setTimeout('foo')",
        "window.setInterval('foo')",

        // User-defined eval methods.
        "window.eval('foo')",
        { code: "window.eval('foo')", languageOptions: { sourceType: "commonjs" } },
        { code: "window.noeval('foo')", languageOptions: { globals: { window: "readonly" } } },
        { code: "function foo() { var eval = 'foo'; window[eval]('foo') }", languageOptions: { globals: { window: "readonly" } } },
        "global.eval('foo')",
        { code: "global.noeval('foo')", languageOptions: { sourceType: "commonjs" } },
        { code: "function foo() { var eval = 'foo'; global[eval]('foo') }", languageOptions: { sourceType: "commonjs", globals: { global: "readonly" } } },
        "globalThis.eval('foo')",
        { code: "globalThis.eval('foo')", languageOptions: { ecmaVersion: 2017 } },
        { code: "globalThis.noneval('foo')", languageOptions: { ecmaVersion: 2020 } },
        { code: "function foo() { var eval = 'foo'; globalThis[eval]('foo') }", languageOptions: { ecmaVersion: 2020 } },
        "this.noeval('foo');",
        "function foo() { 'use strict'; this.eval('foo'); }",
        { code: "'use strict'; this.eval('foo');", languageOptions: { parserOptions: { ecmaFeatures: { globalReturn: true } } } },
        { code: "this.eval('foo');", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "function foo() { this.eval('foo'); }", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "function foo() { this.eval('foo'); }", languageOptions: { parserOptions: { ecmaFeatures: { impliedStrict: true } } } },
        "var obj = {foo: function() { this.eval('foo'); }}",
        "var obj = {}; obj.foo = function() { this.eval('foo'); }",
        { code: "() => { this.eval('foo') }", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "function f() { 'use strict'; () => { this.eval('foo') } }", languageOptions: { ecmaVersion: 6 } },
        { code: "(function f() { 'use strict'; () => { this.eval('foo') } })", languageOptions: { ecmaVersion: 6 } },
        { code: "class A { foo() { this.eval(); } }", languageOptions: { ecmaVersion: 6 } },
        { code: "class A { static foo() { this.eval(); } }", languageOptions: { ecmaVersion: 6 } },
        { code: "class A { field = this.eval(); }", languageOptions: { ecmaVersion: 2022 } },
        { code: "class A { field = () => this.eval(); }", languageOptions: { ecmaVersion: 2022 } },
        { code: "class A { static { this.eval(); } }", languageOptions: { ecmaVersion: 2022 } },

        // User-defined this.eval in callbacks
        "array.findLast(function (x) { return this.eval.includes(x); }, { eval: ['foo', 'bar'] });",
        "callbacks.findLastIndex(function (cb) { return cb(this.eval); }, this);",
        "['1+1'].flatMap(function (str) { return this.eval(str); }, new Evaluator);",

        // Allows indirect eval
        { code: "(0, eval)('foo')", options: [{ allowIndirect: true }] },
        { code: "(0, window.eval)('foo')", options: [{ allowIndirect: true }], languageOptions: { globals: { window: "readonly" } } },
        { code: "(0, window['eval'])('foo')", options: [{ allowIndirect: true }], languageOptions: { globals: { window: "readonly" } } },
        { code: "var EVAL = eval; EVAL('foo')", options: [{ allowIndirect: true }] },
        { code: "var EVAL = this.eval; EVAL('foo')", options: [{ allowIndirect: true }] },
        { code: "(function(exe){ exe('foo') })(eval);", options: [{ allowIndirect: true }] },
        { code: "window.eval('foo')", options: [{ allowIndirect: true }], languageOptions: { globals: { window: "readonly" } } },
        { code: "window.window.eval('foo')", options: [{ allowIndirect: true }], languageOptions: { globals: { window: "readonly" } } },
        { code: "window.window['eval']('foo')", options: [{ allowIndirect: true }], languageOptions: { globals: { window: "readonly" } } },
        { code: "global.eval('foo')", options: [{ allowIndirect: true }], languageOptions: { sourceType: "commonjs" } },
        { code: "global.global.eval('foo')", options: [{ allowIndirect: true }], languageOptions: { sourceType: "commonjs" } },
        { code: "this.eval('foo')", options: [{ allowIndirect: true }] },
        { code: "function foo() { this.eval('foo') }", options: [{ allowIndirect: true }] },
        { code: "(0, globalThis.eval)('foo')", options: [{ allowIndirect: true }], languageOptions: { ecmaVersion: 2020 } },
        { code: "(0, globalThis['eval'])('foo')", options: [{ allowIndirect: true }], languageOptions: { ecmaVersion: 2020 } },
        { code: "var EVAL = globalThis.eval; EVAL('foo')", options: [{ allowIndirect: true }] },
        { code: "function foo() { globalThis.eval('foo') }", options: [{ allowIndirect: true }], languageOptions: { ecmaVersion: 2020 } },
        { code: "globalThis.globalThis.eval('foo');", options: [{ allowIndirect: true }], languageOptions: { ecmaVersion: 2020 } },
        { code: "eval?.('foo')", options: [{ allowIndirect: true }], languageOptions: { ecmaVersion: 2020 } },
        { code: "window?.eval('foo')", options: [{ allowIndirect: true }], languageOptions: { ecmaVersion: 2020, globals: { window: "readonly" } } },
        { code: "(window?.eval)('foo')", options: [{ allowIndirect: true }], languageOptions: { ecmaVersion: 2020, globals: { window: "readonly" } } }
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
        { code: "(0, window.eval)('foo')", languageOptions: { globals: { window: "readonly" } }, errors: [{ messageId: "unexpected", type: "MemberExpression", column: 12, endColumn: 16 }] },
        { code: "(0, window['eval'])('foo')", languageOptions: { globals: { window: "readonly" } }, errors: [{ messageId: "unexpected", type: "MemberExpression", column: 12, endColumn: 18 }] },
        { code: "var EVAL = eval; EVAL('foo')", errors: [{ messageId: "unexpected", type: "Identifier", column: 12, endColumn: 16 }] },
        { code: "var EVAL = this.eval; EVAL('foo')", errors: [{ messageId: "unexpected", type: "MemberExpression", column: 17, endColumn: 21 }] },
        { code: "'use strict'; var EVAL = this.eval; EVAL('foo')", errors: [{ messageId: "unexpected", type: "MemberExpression", column: 31, endColumn: 35 }] },
        { code: "() => { this.eval('foo'); }", languageOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpected", type: "CallExpression", column: 14, endColumn: 18 }] },
        { code: "() => { 'use strict'; this.eval('foo'); }", languageOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpected", type: "CallExpression", column: 28, endColumn: 32 }] },
        { code: "'use strict'; () => { this.eval('foo'); }", languageOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpected", type: "CallExpression", column: 28, endColumn: 32 }] },
        { code: "() => { 'use strict'; () => { this.eval('foo'); } }", languageOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpected", type: "CallExpression", column: 36, endColumn: 40 }] },
        { code: "(function(exe){ exe('foo') })(eval);", errors: [{ messageId: "unexpected", type: "Identifier", column: 31, endColumn: 35 }] },
        { code: "window.eval('foo')", languageOptions: { globals: { window: "readonly" } }, errors: [{ messageId: "unexpected", type: "CallExpression", column: 8, endColumn: 12 }] },
        { code: "window.window.eval('foo')", languageOptions: { globals: { window: "readonly" } }, errors: [{ messageId: "unexpected", type: "CallExpression", column: 15, endColumn: 19 }] },
        { code: "window.window['eval']('foo')", languageOptions: { globals: { window: "readonly" } }, errors: [{ messageId: "unexpected", type: "CallExpression", column: 15, endColumn: 21 }] },
        { code: "global.eval('foo')", languageOptions: { sourceType: "commonjs" }, errors: [{ messageId: "unexpected", type: "CallExpression", column: 8, endColumn: 12 }] },
        { code: "global.global.eval('foo')", languageOptions: { sourceType: "commonjs" }, errors: [{ messageId: "unexpected", type: "CallExpression", column: 15, endColumn: 19 }] },
        { code: "global.global[`eval`]('foo')", languageOptions: { ecmaVersion: 6, sourceType: "commonjs" }, errors: [{ messageId: "unexpected", type: "CallExpression", column: 15, endColumn: 21 }] },
        { code: "this.eval('foo')", errors: [{ messageId: "unexpected", type: "CallExpression", column: 6, endColumn: 10 }] },
        { code: "'use strict'; this.eval('foo')", errors: [{ messageId: "unexpected", type: "CallExpression", column: 20, endColumn: 24 }] },
        { code: "function foo() { this.eval('foo') }", errors: [{ messageId: "unexpected", type: "CallExpression", column: 23, endColumn: 27 }] },
        { code: "var EVAL = globalThis.eval; EVAL('foo')", languageOptions: { ecmaVersion: 2020 }, errors: [{ messageId: "unexpected", type: "MemberExpression", column: 23, endColumn: 27 }] },
        { code: "globalThis.eval('foo')", languageOptions: { ecmaVersion: 2020 }, errors: [{ messageId: "unexpected", type: "CallExpression", column: 12, endColumn: 16 }] },
        { code: "globalThis.globalThis.eval('foo')", languageOptions: { ecmaVersion: 2020 }, errors: [{ messageId: "unexpected", type: "CallExpression", column: 23, endColumn: 27 }] },
        { code: "globalThis.globalThis['eval']('foo')", languageOptions: { ecmaVersion: 2020 }, errors: [{ messageId: "unexpected", type: "CallExpression", column: 23, endColumn: 29 }] },
        { code: "(0, globalThis.eval)('foo')", languageOptions: { ecmaVersion: 2020 }, errors: [{ messageId: "unexpected", type: "MemberExpression", column: 16, endColumn: 20 }] },
        { code: "(0, globalThis['eval'])('foo')", languageOptions: { ecmaVersion: 2020 }, errors: [{ messageId: "unexpected", type: "MemberExpression", column: 16, endColumn: 22 }] },

        // Optional chaining
        {
            code: "window?.eval('foo')",
            languageOptions: { ecmaVersion: 2020, globals: { window: "readonly" } },
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "(window?.eval)('foo')",
            languageOptions: { ecmaVersion: 2020, globals: { window: "readonly" } },
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "(window?.window).eval('foo')",
            languageOptions: { ecmaVersion: 2020, globals: { window: "readonly" } },
            errors: [{ messageId: "unexpected" }]
        },

        // Class fields
        {
            code: "class C { [this.eval('foo')] }",
            languageOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "'use strict'; class C { [this.eval('foo')] }",
            languageOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpected" }]
        },

        {
            code: "class A { static {} [this.eval()]; }",
            languageOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpected" }]
        },

        // in es3, "use strict" directives do not apply
        {
            code: "function foo() { 'use strict'; this.eval(); }",
            languageOptions: { ecmaVersion: 3 },
            errors: [{ messageId: "unexpected" }]
        },

        // this.eval in callbacks (not user-defined)
        {
            code: "array.findLast(x => this.eval.includes(x), { eval: 'abc' });",
            languageOptions: { ecmaVersion: 2023 },
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "callbacks.findLastIndex(function (cb) { return cb(eval); }, this);",
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "['1+1'].flatMap(function (str) { return this.eval(str); });",
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "['1'].reduce(function (a, b) { return this.eval(a) ? a : b; }, '0');",
            errors: [{ messageId: "unexpected" }]
        }
    ]
});
