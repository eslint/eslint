/**
 * @fileoverview Disallow parenthesesisng higher precedence subexpressions.
 * @author Michael Ficarra
 * @copyright 2014 Michael Ficarra. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-extra-parens"),
    RuleTester = require("../../../lib/testers/rule-tester");

/**
 * Create error message object for failure cases
 * @param {string} code source code
 * @param {string} type node type
 * @param {int} line line number
 * @param {object} config rule configuration
 * @returns {object} result object
 * @private
 */
function invalid(code, type, line, config) {
    config = config || {};

    var result = {
        code: code,
        ecmaFeatures: config.ecmaFeatures || {},
        errors: [
            {
                message: "Gratuitous parentheses around expression.",
                type: type
            }
        ],
        options: config.options || []
    };

    if (line) {
        result.errors[0].line = line;
    }

    return result;
}

var ruleTester = new RuleTester();
ruleTester.run("no-extra-parens", rule, {
    valid: [
        // all precedence boundaries
        "a = b, c = d",
        "a = b ? c : d",
        "a = (b, c)",
        "a || b ? c = d : e = f",
        "(a = b) ? (c, d) : (e, f)",
        "a && b || c && d",
        "(a ? b : c) || (d ? e : f)",
        "a | b && c | d",
        "(a || b) && (c || d)",
        "a ^ b | c ^ d",
        "(a && b) | (c && d)",
        "a & b ^ c & d",
        "(a | b) ^ (c | d)",
        "a == b & c != d",
        "(a ^ b) & (c ^ d)",
        "a < b === c in d",
        "(a & b) !== (c & d)",
        "a << b >= c >>> d",
        "(a == b) instanceof (c != d)",
        "a + b << c - d",
        "(a <= b) >> (c > d)",
        "a * b + c / d",
        "(a << b) - (c >> d)",
        "+a % !b",
        "(a + b) * (c - d)",
        "-void+delete~typeof!a",
        "!(a * b); typeof (a / b); +(a % b); delete (a * b); ~(a / b); void (a % b); -(a * b)",
        "a(b = c, (d, e))",
        "(++a)(b); (c++)(d);",
        "new (A())",
        "new A()()",

        // same precedence
        "a, b, c",
        "a = b = c",
        "a ? b ? c : d : e",
        "a ? b : c ? d : e",
        "a || b || c",
        "a || (b || c)",
        "a && b && c",
        "a && (b && c)",
        "a | b | c",
        "a | (b | c)",
        "a ^ b ^ c",
        "a ^ (b ^ c)",
        "a & b & c",
        "a & (b & c)",
        "a == b == c",
        "a == (b == c)",
        "a < b < c",
        "a < (b < c)",
        "a << b << c",
        "a << (b << c)",
        "a + b + c",
        "a + (b + c)",
        "a * b * c",
        "a * (b * c)",
        "!!a; typeof +b; void -c; ~delete d;",
        "a(b)",
        "a(b)(c)",
        "a((b, c))",
        "new new A",

        // constructs that contain expressions
        "if(a);",
        "with(a){}",
        "switch(a){ case 0: break; }",
        "function a(){ return b; }",
        { code: "var a = () => { return b; }", ecmaFeatures: { arrowFunctions: true } },
        "throw a;",
        "while(a);",
        "do; while(a);",
        "for(;;);",
        "for(a in b);",
        { code: "for(a of b);", ecmaFeatures: { forOf: true } },
        "var a = (b, c);",
        "[]",
        "[a, b]",
        "!{a: 0, b: 1}",

        // special cases
        "(a + b) * (c + d) == e",
        "(0).a",
        "(function(){ }())",
        "({a: function(){}}.a());",
        "({a:0}.a ? b : c)",

        // RegExp literal is allowed to have parens (#1589)
        "var isA = (/^a$/).test('a');",
        "var regex = (/^a$/);",
        "function a(){ return (/^a$/); }",
        "function a(){ return (/^a$/).test('a'); }",

        // IIFE is allowed to have parens in any position (#655)
        { code: "var foo = (function() { return bar(); }())", ecmaFeatures: { arrowFunctions: true } },
        "var foo = (function() { return bar(); }())",
        "var o = { foo: (function() { return bar(); }()) };",
        "o.foo = (function(){ return bar(); }());",
        "(function(){ return bar(); }()), (function(){ return bar(); }())",

        // IIFE is allowed to have outer parens (#1004)
        "var foo = (function() { return bar(); })()",
        "var o = { foo: (function() { return bar(); })() };",
        "o.foo = (function(){ return bar(); })();",
        "(function(){ return bar(); })(), (function(){ return bar(); })()",

        // parens are required around yield
        { code: "var foo = (function*() { if ((yield foo()) + 1) { return; } }())", ecmaFeatures: { generators: true } },

        // arrow functions have the precedence of an assignment expression
        { code: "(() => 0)()", ecmaFeatures: { arrowFunctions: true } },
        { code: "(_ => 0)()", ecmaFeatures: { arrowFunctions: true } },
        { code: "_ => 0, _ => 1", ecmaFeatures: { arrowFunctions: true } },
        { code: "a = () => b = 0", ecmaFeatures: { arrowFunctions: true } },
        { code: "0 ? _ => 0 : _ => 0", ecmaFeatures: { arrowFunctions: true } },
        { code: "(_ => 0) || (_ => 0)", ecmaFeatures: { arrowFunctions: true } },

        // Object literals as arrow function bodies need parentheses
        { code: "x => ({foo: 1})", ecmaFeatures: { arrowFunctions: true } },

        // "functions" enables reports for function nodes only
        {code: "(0)", options: ["functions"]},
        {code: "a + (b * c)", options: ["functions"]},
        {code: "(a)(b)", options: ["functions"]},
        {code: "a, (b = c)", options: ["functions"]},
        {code: "for(a in (0));", options: ["functions"]},
        {code: "var a = (b = c)", options: ["functions"]},
        {code: "_ => (a = 0)", options: ["functions"], ecmaFeatures: {arrowFunctions: true}},

        // https://github.com/eslint/eslint/issues/3653
        "(function(){}).foo(), 1, 2;",
        "(function(){}).foo++;",
        "(function(){}).foo() || bar;",
        "(function(){}).foo() + 1;",
        "(function(){}).foo() ? bar : baz;",
        "(function(){}).foo.bar();",
        "(function(){}.foo());",
        "(function(){}.foo.bar);",

        {code: "(class{}).foo(), 1, 2;", ecmaFeatures: {classes: true}},
        {code: "(class{}).foo++;", ecmaFeatures: {classes: true}},
        {code: "(class{}).foo() || bar;", ecmaFeatures: {classes: true}},
        {code: "(class{}).foo() + 1;", ecmaFeatures: {classes: true}},
        {code: "(class{}).foo() ? bar : baz;", ecmaFeatures: {classes: true}},
        {code: "(class{}).foo.bar();", ecmaFeatures: {classes: true}},
        {code: "(class{}.foo());", ecmaFeatures: {classes: true}},
        {code: "(class{}.foo.bar);", ecmaFeatures: {classes: true}}
    ],
    invalid: [
        invalid("(0)", "Literal"),
        invalid("(  0  )", "Literal"),
        invalid("if((0));", "Literal"),
        invalid("if(( 0 ));", "Literal"),
        invalid("with((0)){}", "Literal"),
        invalid("switch((0)){}", "Literal"),
        invalid("switch(0){ case (1): break; }", "Literal"),
        invalid("for((0);;);", "Literal"),
        invalid("for(;(0););", "Literal"),
        invalid("for(;;(0));", "Literal"),
        invalid("throw(0)", "Literal"),
        invalid("while((0));", "Literal"),
        invalid("do; while((0))", "Literal"),
        invalid("for(a in (0));", "Literal"),
        invalid("for(a of (0));", "Literal", 1, {ecmaFeatures: { forOf: true }}),
        invalid("var foo = (function*() { if ((yield foo())) { return; } }())", "YieldExpression", 1, {ecmaFeatures: { generators: true }}),
        invalid("f((0))", "Literal"),
        invalid("f(0, (1))", "Literal"),
        invalid("!(0)", "Literal"),
        invalid("a[(1)]", "Literal"),
        invalid("(a)(b)", "Identifier"),
        invalid("(a, b)", "SequenceExpression"),
        invalid("var a = (b = c);", "AssignmentExpression"),
        invalid("function f(){ return (a); }", "Identifier"),
        invalid("[a, (b = c)]", "AssignmentExpression"),
        invalid("!{a: (b = c)}", "AssignmentExpression"),
        invalid("typeof(0)", "Literal"),
        invalid("(a || b) ? c : d", "LogicalExpression"),
        invalid("a ? (b = c) : d", "AssignmentExpression"),
        invalid("a ? b : (c = d)", "AssignmentExpression"),
        invalid("f((a = b))", "AssignmentExpression"),
        invalid("a, (b = c)", "AssignmentExpression"),
        invalid("a = (b * c)", "BinaryExpression"),
        invalid("a + (b * c)", "BinaryExpression"),
        invalid("(a * b) + c", "BinaryExpression"),
        invalid("(a * b) / c", "BinaryExpression"),
        invalid("a = (b = c)", "AssignmentExpression"),
        invalid("(a).b", "Identifier"),
        invalid("(0)[a]", "Literal"),
        invalid("(0.0).a", "Literal"),
        invalid("(0xBEEF).a", "Literal"),
        invalid("(1e6).a", "Literal"),
        invalid("({foo: 1})", "ObjectExpression"),
        invalid("a[(function() {})]", "FunctionExpression"),
        invalid("(function(){})", "FunctionExpression"),
        invalid("new (function(){})", "FunctionExpression"),
        invalid("new (\nfunction(){}\n)", "FunctionExpression", 1),
        invalid("((function foo() {return 1;}))()", "FunctionExpression"),
        invalid("((function(){ return bar(); })())", "CallExpression"),

        invalid("0, (_ => 0)", "ArrowFunctionExpression", 1, {ecmaFeatures: { arrowFunctions: true }}),
        invalid("(_ => 0), 0", "ArrowFunctionExpression", 1, {ecmaFeatures: { arrowFunctions: true }}),
        invalid("a = (_ => 0)", "ArrowFunctionExpression", 1, {ecmaFeatures: { arrowFunctions: true }}),
        invalid("_ => (a = 0)", "AssignmentExpression", 1, {ecmaFeatures: { arrowFunctions: true }}),
        invalid("x => (({}))", "ObjectExpression", 1, {ecmaFeatures: { arrowFunctions: true }}),

        invalid("new (function(){})", "FunctionExpression", null, {options: ["functions"]}),
        invalid("new (\nfunction(){}\n)", "FunctionExpression", 1, {options: ["functions"]}),
        invalid("((function foo() {return 1;}))()", "FunctionExpression", null, {options: ["functions"]}),
        invalid("a[(function() {})]", "FunctionExpression", null, {options: ["functions"]}),
        invalid("0, (_ => 0)", "ArrowFunctionExpression", 1, {options: ["functions"], ecmaFeatures: { arrowFunctions: true }}),
        invalid("(_ => 0), 0", "ArrowFunctionExpression", 1, {options: ["functions"], ecmaFeatures: { arrowFunctions: true }}),
        invalid("a = (_ => 0)", "ArrowFunctionExpression", 1, {options: ["functions"], ecmaFeatures: { arrowFunctions: true }}),

        // https://github.com/eslint/eslint/issues/3653
        invalid("((function(){})).foo();", "FunctionExpression"),
        invalid("((function(){}).foo());", "CallExpression"),
        invalid("((function(){}).foo);", "MemberExpression"),
        invalid("0, (function(){}).foo();", "FunctionExpression"),
        invalid("void (function(){}).foo();", "FunctionExpression"),
        invalid("++(function(){}).foo;", "FunctionExpression"),
        invalid("bar || (function(){}).foo();", "FunctionExpression"),
        invalid("1 + (function(){}).foo();", "FunctionExpression"),
        invalid("bar ? (function(){}).foo() : baz;", "FunctionExpression"),
        invalid("bar ? baz : (function(){}).foo();", "FunctionExpression"),
        invalid("bar((function(){}).foo(), 0);", "FunctionExpression"),
        invalid("bar[(function(){}).foo()];", "FunctionExpression"),
        invalid("var bar = (function(){}).foo();", "FunctionExpression"),
        invalid("((function(){}).foo.bar)();", "FunctionExpression", null, {options: ["functions"]}),
        invalid("((function(){}).foo)();", "FunctionExpression", null, {options: ["functions"]}),

        invalid("((class{})).foo();", "ClassExpression", null, {ecmaFeatures: {classes: true}}),
        invalid("((class{}).foo());", "CallExpression", null, {ecmaFeatures: {classes: true}}),
        invalid("((class{}).foo);", "MemberExpression", null, {ecmaFeatures: {classes: true}}),
        invalid("0, (class{}).foo();", "ClassExpression", null, {ecmaFeatures: {classes: true}}),
        invalid("void (class{}).foo();", "ClassExpression", null, {ecmaFeatures: {classes: true}}),
        invalid("++(class{}).foo;", "ClassExpression", null, {ecmaFeatures: {classes: true}}),
        invalid("bar || (class{}).foo();", "ClassExpression", null, {ecmaFeatures: {classes: true}}),
        invalid("1 + (class{}).foo();", "ClassExpression", null, {ecmaFeatures: {classes: true}}),
        invalid("bar ? (class{}).foo() : baz;", "ClassExpression", null, {ecmaFeatures: {classes: true}}),
        invalid("bar ? baz : (class{}).foo();", "ClassExpression", null, {ecmaFeatures: {classes: true}}),
        invalid("bar((class{}).foo(), 0);", "ClassExpression", null, {ecmaFeatures: {classes: true}}),
        invalid("bar[(class{}).foo()];", "ClassExpression", null, {ecmaFeatures: {classes: true}}),
        invalid("var bar = (class{}).foo();", "ClassExpression", null, {ecmaFeatures: {classes: true}})
    ]
});
