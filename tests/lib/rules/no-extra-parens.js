/**
 * @fileoverview Disallow parenthesesisng higher precedence subexpressions.
 * @author Michael Ficarra
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
        parserOptions: config.parserOptions || {},
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
        { code: "var a = () => { return b; }", parserOptions: { ecmaVersion: 6 } },
        "throw a;",
        "while(a);",
        "do; while(a);",
        "for(;;);",
        "for(a in b);",
        { code: "for(a of b);", parserOptions: { ecmaVersion: 6 } },
        "var a = (b, c);",
        "[]",
        "[a, b]",
        "!{a: 0, b: 1}",

        // ExpressionStatement restricted productions
        "({});",
        "(function(){});",
        "(let[a] = b);",
        { code: "(function*(){});", parserOptions: { ecmaVersion: 6 } },
        { code: "(class{});", parserOptions: { ecmaVersion: 6 } },

        // special cases
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
        { code: "var foo = (function() { return bar(); }())", parserOptions: { ecmaVersion: 6 } },
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
        { code: "var foo = (function*() { if ((yield foo()) + 1) { return; } }())", parserOptions: { ecmaVersion: 6 } },

        // arrow functions have the precedence of an assignment expression
        { code: "(() => 0)()", parserOptions: { ecmaVersion: 6 } },
        { code: "(_ => 0)()", parserOptions: { ecmaVersion: 6 } },
        { code: "_ => 0, _ => 1", parserOptions: { ecmaVersion: 6 } },
        { code: "a = () => b = 0", parserOptions: { ecmaVersion: 6 } },
        { code: "0 ? _ => 0 : _ => 0", parserOptions: { ecmaVersion: 6 } },
        { code: "(_ => 0) || (_ => 0)", parserOptions: { ecmaVersion: 6 } },

        // Object literals as arrow function bodies need parentheses
        { code: "x => ({foo: 1})", parserOptions: { ecmaVersion: 6 } },

        // https://github.com/eslint/eslint/issues/5789
        { code: "a => ({b: c}[d])", parserOptions: { ecmaVersion: 6 } },
        { code: "a => ({b: c}.d())", parserOptions: { ecmaVersion: 6 } },
        { code: "a => ({b: c}.d.e)", parserOptions: { ecmaVersion: 6 } },

        // "functions" enables reports for function nodes only
        {code: "(0)", options: ["functions"]},
        {code: "a + (b * c)", options: ["functions"]},
        {code: "(a)(b)", options: ["functions"]},
        {code: "a, (b = c)", options: ["functions"]},
        {code: "for(a in (0));", options: ["functions"]},
        {code: "var a = (b = c)", options: ["functions"]},
        {code: "_ => (a = 0)", options: ["functions"], parserOptions: { ecmaVersion: 6 }},

        // ["all", {conditionalAssign: false}] enables extra parens around conditional assignments
        {code: "while ((foo = bar())) {}", options: ["all", {conditionalAssign: false}]},
        {code: "if ((foo = bar())) {}", options: ["all", {conditionalAssign: false}]},
        {code: "do; while ((foo = bar()))", options: ["all", {conditionalAssign: false}]},
        {code: "for (;(a = b););", options: ["all", {conditionalAssign: false}]},

        // ["all", { nestedBinaryExpressions: false }] enables extra parens around conditional assignments
        {code: "a + (b * c)", options: ["all", {nestedBinaryExpressions: false}]},
        {code: "(a * b) + c", options: ["all", {nestedBinaryExpressions: false}]},
        {code: "(a * b) / c", options: ["all", {nestedBinaryExpressions: false}]},
        {code: "a || (b && c)", options: ["all", {nestedBinaryExpressions: false}]},

        // ["all", { returnAssign: false }] enables extra parens around expressions returned by return statements
        { code: "function a(b) { return b || c; }", options: ["all", { returnAssign: false }] },
        { code: "function a(b) { return; }", options: ["all", { returnAssign: false }] },
        { code: "function a(b) { return (b = 1); }", options: ["all", { returnAssign: false }] },
        { code: "function a(b) { return (b = c) || (b = d); }", options: ["all", { returnAssign: false }] },
        { code: "function a(b) { return c ? (d = b) : (e = b); }", options: ["all", { returnAssign: false }] },
        { code: "b => b || c;", options: ["all", { returnAssign: false }], parserOptions: { ecmaVersion: 6 } },
        { code: "b => (b = 1);", options: ["all", { returnAssign: false }], parserOptions: { ecmaVersion: 6 } },
        { code: "b => (b = c) || (b = d);", options: ["all", { returnAssign: false }], parserOptions: { ecmaVersion: 6 } },
        { code: "b => c ? (d = b) : (e = b);", options: ["all", { returnAssign: false }], parserOptions: { ecmaVersion: 6 } },
        { code: "b => { return b || c };", options: ["all", { returnAssign: false }], parserOptions: { ecmaVersion: 6 } },
        { code: "b => { return (b = 1) };", options: ["all", { returnAssign: false }], parserOptions: { ecmaVersion: 6 } },
        { code: "b => { return (b = c) || (b = d) };", options: ["all", { returnAssign: false }], parserOptions: { ecmaVersion: 6 } },
        { code: "b => { return c ? (d = b) : (e = b) };", options: ["all", { returnAssign: false }], parserOptions: { ecmaVersion: 6 } },

        // https://github.com/eslint/eslint/issues/3653
        "(function(){}).foo(), 1, 2;",
        "(function(){}).foo++;",
        "(function(){}).foo() || bar;",
        "(function(){}).foo() + 1;",
        "(function(){}).foo() ? bar : baz;",
        "(function(){}).foo.bar();",
        "(function(){}.foo());",
        "(function(){}.foo.bar);",

        {code: "(class{}).foo(), 1, 2;", parserOptions: { ecmaVersion: 6 }},
        {code: "(class{}).foo++;", parserOptions: { ecmaVersion: 6 }},
        {code: "(class{}).foo() || bar;", parserOptions: { ecmaVersion: 6 }},
        {code: "(class{}).foo() + 1;", parserOptions: { ecmaVersion: 6 }},
        {code: "(class{}).foo() ? bar : baz;", parserOptions: { ecmaVersion: 6 }},
        {code: "(class{}).foo.bar();", parserOptions: { ecmaVersion: 6 }},
        {code: "(class{}.foo());", parserOptions: { ecmaVersion: 6 }},
        {code: "(class{}.foo.bar);", parserOptions: { ecmaVersion: 6 }},

        // https://github.com/eslint/eslint/issues/4608
        { code: "function *a() { yield b; }", parserOptions: { ecmaVersion: 6 } },
        { code: "function *a() { yield yield; }", parserOptions: { ecmaVersion: 6 } },
        { code: "function *a() { yield b, c; }", parserOptions: { ecmaVersion: 6 } },
        { code: "function *a() { yield (b, c); }", parserOptions: { ecmaVersion: 6 } },
        { code: "function *a() { yield b + c; }", parserOptions: { ecmaVersion: 6 } },
        { code: "function *a() { (yield b) + c; }", parserOptions: { ecmaVersion: 6 } },

        // https://github.com/eslint/eslint/issues/4229
        [
            "function a() {",
            "    return (",
            "        b",
            "    );",
            "}"
        ].join("\n"),
        {
            code: [
                "function a() {",
                "    return (",
                "        <JSX />",
                "    );",
                "}"
            ].join("\n"),
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } }
        },
        [
            "throw (",
            "    a",
            ");"
        ].join("\n"),
        {
            code: [
                "function *a() {",
                "    yield (",
                "        b",
                "    );",
                "}"
            ].join("\n"),
            parserOptions: { ecmaVersion: 6 }
        }
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
        invalid("for(a of (0));", "Literal", 1, {parserOptions: { ecmaVersion: 6 }}),
        invalid("var foo = (function*() { if ((yield foo())) { return; } }())", "YieldExpression", 1, {parserOptions: { ecmaVersion: 6 }}),
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

        invalid("a = (b * c)", "BinaryExpression", null, { options: ["all", {nestedBinaryExpressions: false}]}),
        invalid("(b * c)", "BinaryExpression", null, { options: ["all", {nestedBinaryExpressions: false}]}),

        invalid("a = (b = c)", "AssignmentExpression"),
        invalid("(a).b", "Identifier"),
        invalid("(0)[a]", "Literal"),
        invalid("(0.0).a", "Literal"),
        invalid("(0xBEEF).a", "Literal"),
        invalid("(1e6).a", "Literal"),
        invalid("a[(function() {})]", "FunctionExpression"),
        invalid("new (function(){})", "FunctionExpression"),
        invalid("new (\nfunction(){}\n)", "FunctionExpression", 1),
        invalid("((function foo() {return 1;}))()", "FunctionExpression"),
        invalid("((function(){ return bar(); })())", "CallExpression"),

        invalid("0, (_ => 0)", "ArrowFunctionExpression", 1, {parserOptions: { ecmaVersion: 6 }}),
        invalid("(_ => 0), 0", "ArrowFunctionExpression", 1, {parserOptions: { ecmaVersion: 6 }}),
        invalid("a = (_ => 0)", "ArrowFunctionExpression", 1, {parserOptions: { ecmaVersion: 6 }}),
        invalid("_ => (a = 0)", "AssignmentExpression", 1, {parserOptions: { ecmaVersion: 6 }}),
        invalid("x => (({}))", "ObjectExpression", 1, {parserOptions: { ecmaVersion: 6 }}),

        invalid("new (function(){})", "FunctionExpression", null, {options: ["functions"]}),
        invalid("new (\nfunction(){}\n)", "FunctionExpression", 1, {options: ["functions"]}),
        invalid("((function foo() {return 1;}))()", "FunctionExpression", null, {options: ["functions"]}),
        invalid("a[(function() {})]", "FunctionExpression", null, {options: ["functions"]}),
        invalid("0, (_ => 0)", "ArrowFunctionExpression", 1, {options: ["functions"], parserOptions: { ecmaVersion: 6 }}),
        invalid("(_ => 0), 0", "ArrowFunctionExpression", 1, {options: ["functions"], parserOptions: { ecmaVersion: 6 }}),
        invalid("a = (_ => 0)", "ArrowFunctionExpression", 1, {options: ["functions"], parserOptions: { ecmaVersion: 6 }}),


        invalid("while ((foo = bar())) {}", "AssignmentExpression"),
        invalid("while ((foo = bar())) {}", "AssignmentExpression", 1, {options: ["all", {conditionalAssign: true}]}),
        invalid("if ((foo = bar())) {}", "AssignmentExpression"),
        invalid("do; while ((foo = bar()))", "AssignmentExpression"),
        invalid("for (;(a = b););", "AssignmentExpression"),

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

        invalid("((class{})).foo();", "ClassExpression", null, {parserOptions: { ecmaVersion: 6 }}),
        invalid("((class{}).foo());", "CallExpression", null, {parserOptions: { ecmaVersion: 6 }}),
        invalid("((class{}).foo);", "MemberExpression", null, {parserOptions: { ecmaVersion: 6 }}),
        invalid("0, (class{}).foo();", "ClassExpression", null, {parserOptions: { ecmaVersion: 6 }}),
        invalid("void (class{}).foo();", "ClassExpression", null, {parserOptions: { ecmaVersion: 6 }}),
        invalid("++(class{}).foo;", "ClassExpression", null, {parserOptions: { ecmaVersion: 6 }}),
        invalid("bar || (class{}).foo();", "ClassExpression", null, {parserOptions: { ecmaVersion: 6 }}),
        invalid("1 + (class{}).foo();", "ClassExpression", null, {parserOptions: { ecmaVersion: 6 }}),
        invalid("bar ? (class{}).foo() : baz;", "ClassExpression", null, {parserOptions: { ecmaVersion: 6 }}),
        invalid("bar ? baz : (class{}).foo();", "ClassExpression", null, {parserOptions: { ecmaVersion: 6 }}),
        invalid("bar((class{}).foo(), 0);", "ClassExpression", null, {parserOptions: { ecmaVersion: 6 }}),
        invalid("bar[(class{}).foo()];", "ClassExpression", null, {parserOptions: { ecmaVersion: 6 }}),
        invalid("var bar = (class{}).foo();", "ClassExpression", null, {parserOptions: { ecmaVersion: 6 }}),

        // https://github.com/eslint/eslint/issues/4608
        invalid("function *a() { yield (b); }", "Identifier", null, {parserOptions: { ecmaVersion: 6 }}),
        invalid("function *a() { (yield b), c; }", "YieldExpression", null, {parserOptions: { ecmaVersion: 6 }}),
        invalid("function *a() { yield ((b, c)); }", "SequenceExpression", null, {parserOptions: { ecmaVersion: 6 }}),
        invalid("function *a() { yield (b + c); }", "BinaryExpression", null, {parserOptions: { ecmaVersion: 6 }}),

        // https://github.com/eslint/eslint/issues/4229
        invalid([
            "function a() {",
            "    return (b);",
            "}"
        ].join("\n"), "Identifier"),
        invalid([
            "function a() {",
            "    return",
            "    (b);",
            "}"
        ].join("\n"), "Identifier"),
        invalid([
            "function a() {",
            "    return ((",
            "       b",
            "    ));",
            "}"
        ].join("\n"), "Identifier"),
        invalid([
            "function a() {",
            "    return (<JSX />);",
            "}"
        ].join("\n"), "JSXElement", null, {parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } }}),
        invalid([
            "function a() {",
            "    return",
            "    (<JSX />);",
            "}"
        ].join("\n"), "JSXElement", null, {parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } }}),
        invalid([
            "function a() {",
            "    return ((",
            "       <JSX />",
            "    ));",
            "}"
        ].join("\n"), "JSXElement", null, {parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } }}),
        invalid([
            "throw (a);"
        ].join("\n"), "Identifier"),
        invalid([
            "throw ((",
            "   a",
            "));"
        ].join("\n"), "Identifier"),
        invalid([
            "function *a() {",
            "    yield (b);",
            "}"
        ].join("\n"), "Identifier", null, {parserOptions: { ecmaVersion: 6 }}),
        invalid([
            "function *a() {",
            "    yield",
            "    (b);",
            "}"
        ].join("\n"), "Identifier", null, {parserOptions: { ecmaVersion: 6 }}),
        invalid([
            "function *a() {",
            "    yield ((",
            "       b",
            "    ));",
            "}"
        ].join("\n"), "Identifier", null, {parserOptions: { ecmaVersion: 6 }}),

        // returnAssign option
        {
            code: "function a(b) { return (b || c); }",
            options: ["all", {returnAssign: false}],
            errors: [
                {
                    message: "Gratuitous parentheses around expression.",
                    type: "LogicalExpression"
                }
            ]
        },
        {
            code: "function a(b) { return ((b = c) || (d = e)); }",
            errors: [
                {
                    message: "Gratuitous parentheses around expression.",
                    type: "LogicalExpression"
                }
            ]
        },
        {
            code: "function a(b) { return (b = 1); }",
            errors: [
                {
                    message: "Gratuitous parentheses around expression.",
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "function a(b) { return c ? (d = b) : (e = b); }",
            errors: [
                {
                    message: "Gratuitous parentheses around expression.",
                    type: "AssignmentExpression"
                },
                {
                    message: "Gratuitous parentheses around expression.",
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "b => (b || c);",
            options: ["all", {returnAssign: false}],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Gratuitous parentheses around expression.",
                    type: "LogicalExpression"
                }
            ]
        },
        {
            code: "b => ((b = c) || (d = e));",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Gratuitous parentheses around expression.",
                    type: "LogicalExpression"
                }
            ]
        },
        {
            code: "b => (b = 1);",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Gratuitous parentheses around expression.",
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "b => c ? (d = b) : (e = b);",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Gratuitous parentheses around expression.",
                    type: "AssignmentExpression"
                },
                {
                    message: "Gratuitous parentheses around expression.",
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "b => { return (b || c); }",
            options: ["all", {returnAssign: false}],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Gratuitous parentheses around expression.",
                    type: "LogicalExpression"
                }
            ]
        },
        {
            code: "b => { return ((b = c) || (d = e)) };",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Gratuitous parentheses around expression.",
                    type: "LogicalExpression"
                }
            ]
        },
        {
            code: "b => { return (b = 1) };",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Gratuitous parentheses around expression.",
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "b => { return c ? (d = b) : (e = b); }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Gratuitous parentheses around expression.",
                    type: "AssignmentExpression"
                },
                {
                    message: "Gratuitous parentheses around expression.",
                    type: "AssignmentExpression"
                }
            ]
        }
    ]
});
