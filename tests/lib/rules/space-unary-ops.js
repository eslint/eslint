/**
 * @fileoverview This rule shoud require or disallow spaces before or after unary operations.
 * @author Marcin Kumorek
 * @copyright 2014 Marcin Kumorek. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/space-unary-ops"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("space-unary-ops", rule, {

    valid: [
        {
            code: "++this.a",
            options: [{ "words": true }]
        },
        {
            code: "--this.a",
            options: [{ "words": true }]
        },
        {
            code: "this.a++",
            options: [{ "words": true }]
        },
        {
            code: "this.a--",
            options: [{ "words": true }]
        },
        {
            code: "delete foo.bar",
            options: [{ "words": true }]
        },
        {
            code: "delete foo[\"bar\"]",
            options: [{ "words": true }]
        },

        {
            code: "new Foo",
            options: [{ "words": true }]
        },
        {
            code: "new Foo()",
            options: [{ "words": true }]
        },
        {
            code: "new [foo][0]",
            options: [{ "words": true }]
        },
        {
            code: "new[foo][0]",
            options: [{ "words": false }]
        },

        {
            code: "typeof foo",
            options: [{ "words": true }]
        },
        {
            code: "typeof{foo:true}",
            options: [{ "words": false }]
        },
        {
            code: "typeof {foo:true}",
            options: [{ "words": true }]
        },
        {
            code: "typeof!foo",
            options: [{ "words": false }]
        },

        {
            code: "void 0",
            options: [{ "words": true }]
        },
        {
            code: "(void 0)",
            options: [{ "words": true }]
        },
        {
            code: "(void (0))",
            options: [{ "words": true }]
        },
        {
            code: "void foo",
            options: [{ "words": true }]
        },

        {
            code: "-1",
            options: [{ "nonwords": false }]
        },
        {
            code: "!foo",
            options: [{ "nonwords": false }]
        },
        {
            code: "!!foo",
            options: [{ "nonwords": false }]
        },
        {
            code: "foo++",
            options: [{ "nonwords": false }]
        },
        {
            code: "foo ++",
            options: [{ "nonwords": true }]
        },
        {
            code: "++foo",
            options: [{ "nonwords": false }]
        },
        {
            code: "++ foo",
            options: [{ "nonwords": true }]
        },
        {
            code: "function *foo () { yield (0) }",
            ecmaFeatures: { generators: true }
        },
        {
            code: "function *foo() { yield +1 }",
            ecmaFeatures: { generators: true }
        },
        {
            code: "function *foo() { yield* 0 }",
            ecmaFeatures: { generators: true }
        },
        {
            code: "function *foo() { yield * 0 }",
            ecmaFeatures: { generators: true }
        },
        {
            code: "function *foo() { (yield)*0 }",
            ecmaFeatures: { generators: true }
        },
        {
            code: "function *foo() { (yield) * 0 }",
            ecmaFeatures: { generators: true }
        }
    ],

    invalid: [
        {
            code: "delete(foo.bar)",
            output: "delete (foo.bar)",
            options: [{ "words": true }],
            errors: [{
                message: "Unary word operator \"delete\" must be followed by whitespace.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "delete(foo[\"bar\"]);",
            output: "delete (foo[\"bar\"]);",
            options: [{ "words": true }],
            errors: [{
                message: "Unary word operator \"delete\" must be followed by whitespace.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "new(Foo)",
            output: "new (Foo)",
            options: [{ "words": true }],
            errors: [{
                message: "Unary word operator \"new\" must be followed by whitespace.",
                type: "NewExpression"
            }]
        },
        {
            code: "new(Foo())",
            output: "new (Foo())",
            options: [{ "words": true }],
            errors: [{
                message: "Unary word operator \"new\" must be followed by whitespace.",
                type: "NewExpression"
            }]
        },

        {
            code: "typeof(foo)",
            output: "typeof (foo)",
            options: [{ "words": true }],
            errors: [{
                message: "Unary word operator \"typeof\" must be followed by whitespace.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "typeof{foo:true}",
            output: "typeof {foo:true}",
            options: [{ "words": true }],
            errors: [{
                message: "Unary word operator \"typeof\" must be followed by whitespace.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "typeof {foo:true}",
            output: "typeof{foo:true}",
            options: [{ "words": false }],
            errors: [{
                message: "Unexpected space after unary word operator \"typeof\".",
                type: "UnaryExpression"
            }]
        },
        {
            code: "typeof!foo",
            output: "typeof !foo",
            options: [{ "words": true }],
            errors: [{
                message: "Unary word operator \"typeof\" must be followed by whitespace.",
                type: "UnaryExpression"
            }]
        },

        {
            code: "void(0);",
            output: "void (0);",
            options: [{ "words": true }],
            errors: [{
                message: "Unary word operator \"void\" must be followed by whitespace.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "void(foo);",
            output: "void (foo);",
            options: [{ "words": true }],
            errors: [{
                message: "Unary word operator \"void\" must be followed by whitespace.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "void{a:0};",
            output: "void {a:0};",
            options: [{ "words": true }],
            errors: [{
                message: "Unary word operator \"void\" must be followed by whitespace.",
                type: "UnaryExpression"
            }]
        },

        {
            code: "! foo",
            output: "!foo",
            options: [{ "nonwords": false }],
            errors: [{
                message: "Unexpected space after unary operator \"!\"."
            }]
        },
        {
            code: "!foo",
            output: "! foo",
            options: [{ "nonwords": true }],
            errors: [{
                message: "Unary operator \"!\" must be followed by whitespace."
            }]
        },

        {
            code: "!! foo",
            output: "!!foo",
            options: [{ "nonwords": false }],
            errors: [{
                message: "Unexpected space after unary operator \"!\".",
                type: "UnaryExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "!!foo",
            output: "!! foo",
            options: [{ "nonwords": true }],
            errors: [{
                message: "Unary operator \"!\" must be followed by whitespace.",
                type: "UnaryExpression",
                line: 1,
                column: 2
            }]
        },

        {
            code: "- 1",
            output: "-1",
            options: [{ "nonwords": false }],
            errors: [{
                message: "Unexpected space after unary operator \"-\".",
                type: "UnaryExpression"
            }]
        },
        {
            code: "-1",
            output: "- 1",
            options: [{ "nonwords": true }],
            errors: [{
                message: "Unary operator \"-\" must be followed by whitespace.",
                type: "UnaryExpression"
            }]
        },

        {
            code: "foo++",
            output: "foo ++",
            options: [{ "nonwords": true }],
            errors: [{
                message: "Space is required before unary expressions \"++\"."
            }]
        },
        {
            code: "foo ++",
            output: "foo++",
            options: [{ "nonwords": false }],
            errors: [{
                message: "Unexpected space before unary operator \"++\"."
            }]
        },
        {
            code: "++ foo",
            output: "++foo",
            options: [{ "nonwords": false }],
            errors: [{
                message: "Unexpected space after unary operator \"++\"."
            }]
        },
        {
            code: "++foo",
            output: "++ foo",
            options: [{ "nonwords": true }],
            errors: [{
                message: "Unary operator \"++\" must be followed by whitespace."
            }]
        },
        {
            code: "function *foo() { yield(0) }",
            output: "function *foo() { yield (0) }",
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Unary word operator \"yield\" must be followed by whitespace.",
                type: "YieldExpression",
                line: 1,
                column: 19
            }]
        },
        {
            code: "function *foo() { yield+0 }",
            output: "function *foo() { yield +0 }",
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Unary word operator \"yield\" must be followed by whitespace.",
                type: "YieldExpression",
                line: 1,
                column: 19
            }]
        },
        {
            code: "function *foo() { yield*0 }",
            output: "function *foo() { yield* 0 }",
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Unary word operator \"yield*\" must be followed by whitespace.",
                type: "YieldExpression",
                line: 1,
                column: 19
            }]
        },
        {
            code: "function *foo() { yield *0 }",
            output: "function *foo() { yield * 0 }",
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Unary word operator \"yield*\" must be followed by whitespace.",
                type: "YieldExpression",
                line: 1,
                column: 19
            }]
        }
    ]
});
