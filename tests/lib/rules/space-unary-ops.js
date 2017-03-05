/**
 * @fileoverview This rule shoud require or disallow spaces before or after unary operations.
 * @author Marcin Kumorek
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/space-unary-ops"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("space-unary-ops", rule, {

    valid: [
        {
            code: "++this.a",
            options: [{ words: true }]
        },
        {
            code: "--this.a",
            options: [{ words: true }]
        },
        {
            code: "this.a++",
            options: [{ words: true }]
        },
        {
            code: "this.a--",
            options: [{ words: true }]
        },
        {
            code: "delete foo.bar",
            options: [{ words: true }]
        },
        {
            code: "delete foo[\"bar\"]",
            options: [{ words: true }]
        },

        {
            code: "new Foo",
            options: [{ words: true }]
        },
        {
            code: "new Foo()",
            options: [{ words: true }]
        },
        {
            code: "new [foo][0]",
            options: [{ words: true }]
        },
        {
            code: "new[foo][0]",
            options: [{ words: false }]
        },

        {
            code: "typeof foo",
            options: [{ words: true }]
        },
        {
            code: "typeof{foo:true}",
            options: [{ words: false }]
        },
        {
            code: "typeof {foo:true}",
            options: [{ words: true }]
        },
        {
            code: "typeof!foo",
            options: [{ words: false }]
        },

        {
            code: "void 0",
            options: [{ words: true }]
        },
        {
            code: "(void 0)",
            options: [{ words: true }]
        },
        {
            code: "(void (0))",
            options: [{ words: true }]
        },
        {
            code: "void foo",
            options: [{ words: true }]
        },

        {
            code: "-1",
            options: [{ nonwords: false }]
        },
        {
            code: "!foo",
            options: [{ nonwords: false }]
        },
        {
            code: "!!foo",
            options: [{ nonwords: false }]
        },
        {
            code: "foo++",
            options: [{ nonwords: false }]
        },
        {
            code: "foo ++",
            options: [{ nonwords: true }]
        },
        {
            code: "++foo",
            options: [{ nonwords: false }]
        },
        {
            code: "++ foo",
            options: [{ nonwords: true }]
        },
        {
            code: "function *foo () { yield (0) }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function *foo() { yield +1 }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function *foo() { yield* 0 }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function *foo() { yield * 0 }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function *foo() { (yield)*0 }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function *foo() { (yield) * 0 }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function *foo() { yield*0 }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function *foo() { yield *0 }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "async function foo() { await {foo: 1} }",
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "async function foo() { await {bar: 2} }",
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "async function foo() { await{baz: 3} }",
            options: [{ words: false }],
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "async function foo() { await {qux: 4} }",
            options: [{ words: false, overrides: { await: true } }],
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "async function foo() { await{foo: 5} }",
            options: [{ words: true, overrides: { await: false } }],
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "foo++",
            options: [{ nonwords: true, overrides: { "++": false } }]
        },
        {
            code: "foo++",
            options: [{ nonwords: false, overrides: { "++": false } }]
        },
        {
            code: "++foo",
            options: [{ nonwords: true, overrides: { "++": false } }]
        },
        {
            code: "++foo",
            options: [{ nonwords: false, overrides: { "++": false } }]
        },
        {
            code: "!foo",
            options: [{ nonwords: true, overrides: { "!": false } }]
        },
        {
            code: "!foo",
            options: [{ nonwords: false, overrides: { "!": false } }]
        },
        {
            code: "new foo",
            options: [{ words: true, overrides: { new: false } }]
        },
        {
            code: "new foo",
            options: [{ words: false, overrides: { new: false } }]
        },
        {
            code: "function *foo () { yield (0) }",
            options: [{ words: true, overrides: { yield: false } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function *foo () { yield (0) }",
            options: [{ words: false, overrides: { yield: false } }],
            parserOptions: { ecmaVersion: 6 }
        }
    ],

    invalid: [
        {
            code: "delete(foo.bar)",
            output: "delete (foo.bar)",
            options: [{ words: true }],
            errors: [{
                message: "Unary word operator 'delete' must be followed by whitespace.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "delete(foo[\"bar\"]);",
            output: "delete (foo[\"bar\"]);",
            options: [{ words: true }],
            errors: [{
                message: "Unary word operator 'delete' must be followed by whitespace.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "new(Foo)",
            output: "new (Foo)",
            options: [{ words: true }],
            errors: [{
                message: "Unary word operator 'new' must be followed by whitespace.",
                type: "NewExpression"
            }]
        },
        {
            code: "new(Foo())",
            output: "new (Foo())",
            options: [{ words: true }],
            errors: [{
                message: "Unary word operator 'new' must be followed by whitespace.",
                type: "NewExpression"
            }]
        },

        {
            code: "typeof(foo)",
            output: "typeof (foo)",
            options: [{ words: true }],
            errors: [{
                message: "Unary word operator 'typeof' must be followed by whitespace.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "typeof{foo:true}",
            output: "typeof {foo:true}",
            options: [{ words: true }],
            errors: [{
                message: "Unary word operator 'typeof' must be followed by whitespace.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "typeof {foo:true}",
            output: "typeof{foo:true}",
            options: [{ words: false }],
            errors: [{
                message: "Unexpected space after unary word operator 'typeof'.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "typeof!foo",
            output: "typeof !foo",
            options: [{ words: true }],
            errors: [{
                message: "Unary word operator 'typeof' must be followed by whitespace.",
                type: "UnaryExpression"
            }]
        },

        {
            code: "void(0);",
            output: "void (0);",
            options: [{ words: true }],
            errors: [{
                message: "Unary word operator 'void' must be followed by whitespace.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "void(foo);",
            output: "void (foo);",
            options: [{ words: true }],
            errors: [{
                message: "Unary word operator 'void' must be followed by whitespace.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "void{a:0};",
            output: "void {a:0};",
            options: [{ words: true }],
            errors: [{
                message: "Unary word operator 'void' must be followed by whitespace.",
                type: "UnaryExpression"
            }]
        },

        {
            code: "! foo",
            output: "!foo",
            options: [{ nonwords: false }],
            errors: [{
                message: "Unexpected space after unary operator '!'."
            }]
        },
        {
            code: "!foo",
            output: "! foo",
            options: [{ nonwords: true }],
            errors: [{
                message: "Unary operator '!' must be followed by whitespace."
            }]
        },

        {
            code: "!! foo",
            output: "!!foo",
            options: [{ nonwords: false }],
            errors: [{
                message: "Unexpected space after unary operator '!'.",
                type: "UnaryExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "!!foo",
            output: "!! foo",
            options: [{ nonwords: true }],
            errors: [{
                message: "Unary operator '!' must be followed by whitespace.",
                type: "UnaryExpression",
                line: 1,
                column: 2
            }]
        },

        {
            code: "- 1",
            output: "-1",
            options: [{ nonwords: false }],
            errors: [{
                message: "Unexpected space after unary operator '-'.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "-1",
            output: "- 1",
            options: [{ nonwords: true }],
            errors: [{
                message: "Unary operator '-' must be followed by whitespace.",
                type: "UnaryExpression"
            }]
        },

        {
            code: "foo++",
            output: "foo ++",
            options: [{ nonwords: true }],
            errors: [{
                message: "Space is required before unary expressions '++'."
            }]
        },
        {
            code: "foo ++",
            output: "foo++",
            options: [{ nonwords: false }],
            errors: [{
                message: "Unexpected space before unary operator '++'."
            }]
        },
        {
            code: "++ foo",
            output: "++foo",
            options: [{ nonwords: false }],
            errors: [{
                message: "Unexpected space after unary operator '++'."
            }]
        },
        {
            code: "++foo",
            output: "++ foo",
            options: [{ nonwords: true }],
            errors: [{
                message: "Unary operator '++' must be followed by whitespace."
            }]
        },
        {
            code: "+ +foo",
            output: null,
            options: [{ nonwords: false }],
            errors: [{
                message: "Unexpected space after unary operator '+'."
            }]
        },
        {
            code: "+ ++foo",
            output: null,
            options: [{ nonwords: false }],
            errors: [{
                message: "Unexpected space after unary operator '+'."
            }]
        },
        {
            code: "- -foo",
            output: null,
            options: [{ nonwords: false }],
            errors: [{
                message: "Unexpected space after unary operator '-'."
            }]
        },
        {
            code: "- --foo",
            output: null,
            options: [{ nonwords: false }],
            errors: [{
                message: "Unexpected space after unary operator '-'."
            }]
        },
        {
            code: "+ -foo",
            output: "+-foo",
            options: [{ nonwords: false }],
            errors: [{
                message: "Unexpected space after unary operator '+'."
            }]
        },
        {
            code: "function *foo() { yield(0) }",
            output: "function *foo() { yield (0) }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Unary word operator 'yield' must be followed by whitespace.",
                type: "YieldExpression",
                line: 1,
                column: 19
            }]
        },
        {
            code: "function *foo() { yield+0 }",
            output: "function *foo() { yield +0 }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Unary word operator 'yield' must be followed by whitespace.",
                type: "YieldExpression",
                line: 1,
                column: 19
            }]
        },
        {
            code: "foo++",
            output: "foo ++",
            options: [{ nonwords: true, overrides: { "++": true } }],
            errors: [{
                message: "Space is required before unary expressions '++'."
            }]
        },
        {
            code: "foo++",
            output: "foo ++",
            options: [{ nonwords: false, overrides: { "++": true } }],
            errors: [{
                message: "Space is required before unary expressions '++'."
            }]
        },
        {
            code: "++foo",
            output: "++ foo",
            options: [{ nonwords: true, overrides: { "++": true } }],
            errors: [{
                message: "Unary operator '++' must be followed by whitespace."
            }]
        },
        {
            code: "++foo",
            output: "++ foo",
            options: [{ nonwords: false, overrides: { "++": true } }],
            errors: [{
                message: "Unary operator '++' must be followed by whitespace."
            }]
        },
        {
            code: "!foo",
            output: "! foo",
            options: [{ nonwords: true, overrides: { "!": true } }],
            errors: [{
                message: "Unary operator '!' must be followed by whitespace."
            }]
        },
        {
            code: "!foo",
            output: "! foo",
            options: [{ nonwords: false, overrides: { "!": true } }],
            errors: [{
                message: "Unary operator '!' must be followed by whitespace."
            }]
        },
        {
            code: "new(Foo)",
            output: "new (Foo)",
            options: [{ words: true, overrides: { new: true } }],
            errors: [{
                message: "Unary word operator 'new' must be followed by whitespace."
            }]
        },
        {
            code: "new(Foo)",
            output: "new (Foo)",
            options: [{ words: false, overrides: { new: true } }],
            errors: [{
                message: "Unary word operator 'new' must be followed by whitespace."
            }]
        },
        {
            code: "function *foo() { yield(0) }",
            output: "function *foo() { yield (0) }",
            options: [{ words: true, overrides: { yield: true } }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Unary word operator 'yield' must be followed by whitespace.",
                type: "YieldExpression",
                line: 1,
                column: 19
            }]
        },
        {
            code: "function *foo() { yield(0) }",
            output: "function *foo() { yield (0) }",
            options: [{ words: false, overrides: { yield: true } }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Unary word operator 'yield' must be followed by whitespace.",
                type: "YieldExpression",
                line: 1,
                column: 19
            }]
        },
        {
            code: "async function foo() { await{foo: 'bar'} }",
            output: "async function foo() { await {foo: 'bar'} }",
            parserOptions: { ecmaVersion: 8 },
            errors: [{
                message: "Unary word operator 'await' must be followed by whitespace.",
                type: "AwaitExpression",
                line: 1,
                column: 24
            }]
        },
        {
            code: "async function foo() { await{baz: 'qux'} }",
            output: "async function foo() { await {baz: 'qux'} }",
            options: [{ words: false, overrides: { await: true } }],
            parserOptions: { ecmaVersion: 8 },
            errors: [{
                message: "Unary word operator 'await' must be followed by whitespace.",
                type: "AwaitExpression",
                line: 1,
                column: 24
            }]
        },
        {
            code: "async function foo() { await {foo: 1} }",
            output: "async function foo() { await{foo: 1} }",
            options: [{ words: false }],
            parserOptions: { ecmaVersion: 8 },
            errors: [{
                message: "Unexpected space after unary word operator 'await'.",
                type: "AwaitExpression",
                line: 1,
                column: 24
            }]
        },
        {
            code: "async function foo() { await {bar: 2} }",
            output: "async function foo() { await{bar: 2} }",
            options: [{ words: true, overrides: { await: false } }],
            parserOptions: { ecmaVersion: 8 },
            errors: [{
                message: "Unexpected space after unary word operator 'await'.",
                type: "AwaitExpression",
                line: 1,
                column: 24
            }]
        }
    ]
});
