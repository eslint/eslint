/**
 * @fileoverview This rule shoud require or disallow spaces before or after unary operations.
 * @author Marcin Kumorek
 * @copyright 2014 Marcin Kumorek. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/space-unary-ops", {

    valid: [
        {
            code: "delete foo.bar",
            args: [1, { "words": true }]
        },
        {
            code: "delete foo[\"bar\"]",
            args: [1, { "words": true }]
        },

        {
            code: "new Foo",
            args: [1, { "words": true }]
        },
        {
            code: "new Foo()",
            args: [1, { "words": true }]
        },
        {
            code: "new [foo][0]",
            args: [1, { "words": true }]
        },
        {
            code: "new[foo][0]",
            args: [1, { "words": false }]
        },

        {
            code: "typeof foo",
            args: [1, { "words": true }]
        },
        {
            code: "typeof{foo:true}",
            args: [1, { "words": false }]
        },
        {
            code: "typeof {foo:true}",
            args: [1, { "words": true }]
        },
        {
            code: "typeof!foo",
            args: [1, { "words": false }]
        },

        {
            code: "void 0",
            args: [1, { "words": true }]
        },
        {
            code: "(void 0)",
            args: [1, { "words": true }]
        },
        {
            code: "(void (0))",
            args: [1, { "words": true }]
        },
        {
            code: "void foo",
            args: [1, { "words": true }]
        },

        {
            code: "-1",
            args: [1, { "nonwords": false }]
        },
        {
            code: "!foo",
            args: [1, { "nonwords": false }]
        },
       {
            code: "!!foo",
            args: [1, { "nonwords": false }]
        },
        {
            code: "foo++",
            args: [1, { "nonwords": false }]
        },
        {
            code: "foo ++",
            args: [1, { "nonwords": true }]
        },
        {
            code: "++foo",
            args: [1, { "nonwords": false }]
        },
        {
            code: "++ foo",
            args: [1, { "nonwords": true }]
        }
    ],

    invalid: [
        {
            code: "delete(foo.bar)",
            args: [1, { "words": true }],
            errors: [{
                message: "Unary word operator \"delete\" must be followed by whitespace.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "delete(foo[\"bar\"]);",
            args: [1, { "words": true }],
            errors: [{
                message: "Unary word operator \"delete\" must be followed by whitespace.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "new(Foo)",
            args: [1, { "words": true }],
            errors: [{
                message: "Unary word operator \"new\" must be followed by whitespace.",
                type: "NewExpression"
            }]
        },
        {
            code: "new(Foo())",
            args: [1, { "words": true }],
            errors: [{
                message: "Unary word operator \"new\" must be followed by whitespace.",
                type: "NewExpression"
            }]
        },

        {
            code: "typeof(foo)",
            args: [1, { "words": true }],
            errors: [{
                message: "Unary word operator \"typeof\" must be followed by whitespace.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "typeof{foo:true}",
            args: [1, { "words": true }],
            errors: [{
                message: "Unary word operator \"typeof\" must be followed by whitespace.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "typeof {foo:true}",
            args: [1, { "words": false }],
            errors: [{
                message: "Unexpected space after unary word operator \"typeof\".",
                type: "UnaryExpression"
            }]
        },
        {
            code: "typeof!foo",
            args: [1, { "words": true }],
            errors: [{
                message: "Unary word operator \"typeof\" must be followed by whitespace.",
                type: "UnaryExpression"
            }]
        },

        {
            code: "void(0);",
            args: [1, { "words": true }],
            errors: [{
                message: "Unary word operator \"void\" must be followed by whitespace.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "void(foo);",
            args: [1, { "words": true }],
            errors: [{
                message: "Unary word operator \"void\" must be followed by whitespace.",
                type: "UnaryExpression"
            }]
        },
        {
            code: "void{a:0};",
            args: [1, { "words": true }],
            errors: [{
                message: "Unary word operator \"void\" must be followed by whitespace.",
                type: "UnaryExpression"
            }]
        },

        {
            code: "! foo",
            args: [1, { "nonwords": false }],
            errors: [{
                message: "Unexpected space after unary operator \"!\"."
            }]
        },
        {
            code: "!foo",
            args: [1, { "nonwords": true }],
            errors: [{
                message: "Unary operator \"!\" must be followed by whitespace."
            }]
        },

        {
            code: "!! foo",
            args: [1, { "nonwords": false }],
            errors: [{
                message: "Unexpected space after unary operator \"!\"."
            }]
        },
        {
            code: "!!foo",
            args: [1, { "nonwords": true }],
            errors: [{
                message: "Unary operator \"!\" must be followed by whitespace."
            }]
        },

        {
            code: "- 1",
            args: [1, { "nonwords": false }],
            errors: [{
                message: "Unexpected space after unary operator \"-\".",
                type: "UnaryExpression"
            }]
        },
        {
            code: "-1",
            args: [1, { "nonwords": true }],
            errors: [{
                message: "Unary operator \"-\" must be followed by whitespace.",
                type: "UnaryExpression"
            }]
        },

        {
            code: "foo++",
            args: [1, { "nonwords": true }],
            errors: [{
                message: "Space is required before unary expressions \"++\"."
            }]
        },
        {
            code: "foo ++",
            args: [1, { "nonwords": false }],
            errors: [{
                message: "Unexpected space before unary operator \"++\"."
            }]
        },
        {
            code: "++ foo",
            args: [1, { "nonwords": false }],
            errors: [{
                message: "Unexpected space after unary operator \"++\"."
            }]
        },
        {
            code: "++foo",
            args: [1, { "nonwords": true }],
            errors: [{
                message: "Unary operator \"++\" must be followed by whitespace."
            }]
        }
    ]
});
