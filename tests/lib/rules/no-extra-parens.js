/**
 * @fileoverview Disallow parenthesesisng higher precedence subexpressions.
 * @author Michael Ficarra
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-extra-parens"),
    RuleTester = require("../../../lib/testers/rule-tester");

/**
 * Create error message object for failure cases
 * @param {string} code source code
 * @param {string} output fixed source code
 * @param {string} type node type
 * @param {int} line line number
 * @param {Object} config rule configuration
 * @returns {Object} result object
 * @private
 */
function invalid(code, output, type, line, config) {
    config = config || {};

    const result = {
        code,
        output,
        parserOptions: config.parserOptions || {},
        errors: [
            {
                message: "Gratuitous parentheses around expression.",
                type
            }
        ],
        options: config.options || []
    };

    if (line) {
        result.errors[0].line = line;
    }
    return result;
}

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 6,
        ecmaFeatures: {
            jsx: true
        }
    }
});

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
        "(new A)()",
        "(new (Foo || Bar))()",
        { code: "(2 + 3) ** 4", parserOptions: { ecmaVersion: 7 } },
        { code: "2 ** (2 + 3)", parserOptions: { ecmaVersion: 7 } },

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
        { code: "2 ** 3 ** 4", parserOptions: { ecmaVersion: 7 } },
        { code: "(2 ** 3) ** 4", parserOptions: { ecmaVersion: 7 } },

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


        // Exponentiation operator `**`
        { code: "1 + 2 ** 3", parserOptions: { ecmaVersion: 7 } },
        { code: "1 - 2 ** 3", parserOptions: { ecmaVersion: 7 } },
        { code: "2 ** -3", parserOptions: { ecmaVersion: 7 } },
        { code: "(-2) ** 3", parserOptions: { ecmaVersion: 7 } },
        { code: "(+2) ** 3", parserOptions: { ecmaVersion: 7 } },
        { code: "+ (2 ** 3)", parserOptions: { ecmaVersion: 7 } },

        // https://github.com/eslint/eslint/issues/5789
        { code: "a => ({b: c}[d])", parserOptions: { ecmaVersion: 6 } },
        { code: "a => ({b: c}.d())", parserOptions: { ecmaVersion: 6 } },
        { code: "a => ({b: c}.d.e)", parserOptions: { ecmaVersion: 6 } },

        // "functions" enables reports for function nodes only
        { code: "(0)", options: ["functions"] },
        { code: "a + (b * c)", options: ["functions"] },
        { code: "(a)(b)", options: ["functions"] },
        { code: "a, (b = c)", options: ["functions"] },
        { code: "for(a in (0));", options: ["functions"] },
        { code: "var a = (b = c)", options: ["functions"] },
        { code: "_ => (a = 0)", options: ["functions"], parserOptions: { ecmaVersion: 6 } },

        // ["all", {conditionalAssign: false}] enables extra parens around conditional assignments
        { code: "while ((foo = bar())) {}", options: ["all", { conditionalAssign: false }] },
        { code: "if ((foo = bar())) {}", options: ["all", { conditionalAssign: false }] },
        { code: "do; while ((foo = bar()))", options: ["all", { conditionalAssign: false }] },
        { code: "for (;(a = b););", options: ["all", { conditionalAssign: false }] },

        // ["all", { nestedBinaryExpressions: false }] enables extra parens around conditional assignments
        { code: "a + (b * c)", options: ["all", { nestedBinaryExpressions: false }] },
        { code: "(a * b) + c", options: ["all", { nestedBinaryExpressions: false }] },
        { code: "(a * b) / c", options: ["all", { nestedBinaryExpressions: false }] },
        { code: "a || (b && c)", options: ["all", { nestedBinaryExpressions: false }] },

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

        { code: "(class{}).foo(), 1, 2;", parserOptions: { ecmaVersion: 6 } },
        { code: "(class{}).foo++;", parserOptions: { ecmaVersion: 6 } },
        { code: "(class{}).foo() || bar;", parserOptions: { ecmaVersion: 6 } },
        { code: "(class{}).foo() + 1;", parserOptions: { ecmaVersion: 6 } },
        { code: "(class{}).foo() ? bar : baz;", parserOptions: { ecmaVersion: 6 } },
        { code: "(class{}).foo.bar();", parserOptions: { ecmaVersion: 6 } },
        { code: "(class{}.foo());", parserOptions: { ecmaVersion: 6 } },
        { code: "(class{}.foo.bar);", parserOptions: { ecmaVersion: 6 } },

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
        },

        // async/await
        { code: "async function a() { await (a + b) }", parserOptions: { ecmaVersion: 8 } },
        { code: "async function a() { await (a + await b) }", parserOptions: { ecmaVersion: 8 } },
        { code: "async function a() { (await a)() }", parserOptions: { ecmaVersion: 8 } },
        { code: "async function a() { new (await a) }", parserOptions: { ecmaVersion: 8 } },
        { code: "(foo instanceof bar) instanceof baz", options: ["all", { nestedBinaryExpressions: false }] },
        { code: "(foo in bar) in baz", options: ["all", { nestedBinaryExpressions: false }] },
        { code: "(foo + bar) + baz", options: ["all", { nestedBinaryExpressions: false }] },
        { code: "(foo && bar) && baz", options: ["all", { nestedBinaryExpressions: false }] },
        { code: "foo instanceof (bar instanceof baz)", options: ["all", { nestedBinaryExpressions: false }] },
        { code: "foo in (bar in baz)", options: ["all", { nestedBinaryExpressions: false }] },
        { code: "foo + (bar + baz)", options: ["all", { nestedBinaryExpressions: false }] },
        { code: "foo && (bar && baz)", options: ["all", { nestedBinaryExpressions: false }] },

        // ["all", { ignoreJSX: "all" }]
        { code: "const Component = (<div />)", options: ["all", { ignoreJSX: "all" }] },
        { code: [
            "const Component = (<div>",
            "  <p />",
            "</div>);"
        ].join("\n"), options: ["all", { ignoreJSX: "all" }] },
        { code: [
            "const Component = (",
            "  <div />",
            ");"
        ].join("\n"), options: ["all", { ignoreJSX: "all" }] },
        { code: [
            "const Component =",
            "  (<div />)"
        ].join("\n"), options: ["all", { ignoreJSX: "all" }] },

        // ["all", { ignoreJSX: "single-line" }]
        { code: "const Component = (<div />);", options: ["all", { ignoreJSX: "single-line" }] },
        { code: [
            "const Component = (",
            "  <div />",
            ");"
        ].join("\n"), options: ["all", { ignoreJSX: "single-line" }] },
        { code: [
            "const Component =",
            "(<div />)"
        ].join("\n"), options: ["all", { ignoreJSX: "single-line" }] },

        // ["all", { ignoreJSX: "multi-line" }]
        { code: [
            "const Component = (",
            "<div>",
            "  <p />",
            "</div>",
            ");"
        ].join("\n"), options: ["all", { ignoreJSX: "multi-line" }] },
        { code: [
            "const Component = (<div>",
            "  <p />",
            "</div>);"
        ].join("\n"), options: ["all", { ignoreJSX: "multi-line" }] },
        { code: [
            "const Component =",
            "(<div>",
            "  <p />",
            "</div>);"
        ].join("\n"), options: ["all", { ignoreJSX: "multi-line" }] },
        { code: [
            "const Component = (<div",
            "  prop={true}",
            "/>)"
        ].join("\n"), options: ["all", { ignoreJSX: "multi-line" }] },

        // ["all", { enforceForArrowConditionals: false }]
        { code: "var a = b => 1 ? 2 : 3", options: ["all", { enforceForArrowConditionals: false }], parserOptions: { ecmaVersion: 6 } },
        { code: "var a = (b) => (1 ? 2 : 3)", options: ["all", { enforceForArrowConditionals: false }], parserOptions: { ecmaVersion: 6 } },

        {
            code: "let a = [ ...b ]",
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "let a = { ...b }",
            parserOptions: {
                ecmaVersion: 2015,
                ecmaFeatures: { experimentalObjectRestSpread: true }
            }
        },
        {
            code: "let a = [ ...(b, c) ]",
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "let a = { ...(b, c) }",
            parserOptions: {
                ecmaVersion: 2015,
                ecmaFeatures: { experimentalObjectRestSpread: true }
            }
        },
        {
            code: "var [x = (1, foo)] = bar",
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "class A extends B {}",
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "const A = class extends B {}",
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "class A extends (B=C) {}",
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "const A = class extends (B=C) {}",
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "() => ({ foo: 1 })",
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "() => ({ foo: 1 }).foo",
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "() => ({ foo: 1 }.foo().bar).baz.qux()",
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "() => ({ foo: 1 }.foo().bar + baz)",
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "export default (function(){}).foo",
            parserOptions: { ecmaVersion: 2015, sourceType: "module" }
        },
        {
            code: "export default (class{}).foo",
            parserOptions: { ecmaVersion: 2015, sourceType: "module" }
        },
        "({}).hasOwnProperty.call(foo, bar)",
        "({}) ? foo() : bar()",
        "({}) + foo",
        "(function(){}) + foo",
        "(let[foo]) = 1", // setting the 'foo' property of the 'let' variable to 1
        {
            code: "((function(){}).foo.bar)();",
            options: ["functions"]
        },
        {
            code: "((function(){}).foo)();",
            options: ["functions"]
        },
        "(let)[foo]",
        "for ((let) in foo);",
        "for ((let[foo]) in bar);",
        "for ((let)[foo] in bar);",
        "for ((let[foo].bar) in baz);"
    ],

    invalid: [
        invalid("(0)", "0", "Literal"),
        invalid("(  0  )", "  0  ", "Literal"),
        invalid("if((0));", "if(0);", "Literal"),
        invalid("if(( 0 ));", "if( 0 );", "Literal"),
        invalid("with((0)){}", "with(0){}", "Literal"),
        invalid("switch((0)){}", "switch(0){}", "Literal"),
        invalid("switch(0){ case (1): break; }", "switch(0){ case 1: break; }", "Literal"),
        invalid("for((0);;);", "for(0;;);", "Literal"),
        invalid("for(;(0););", "for(;0;);", "Literal"),
        invalid("for(;;(0));", "for(;;0);", "Literal"),
        invalid("throw(0)", "throw 0", "Literal"),
        invalid("while((0));", "while(0);", "Literal"),
        invalid("do; while((0))", "do; while(0)", "Literal"),
        invalid("for(a in (0));", "for(a in 0);", "Literal"),
        invalid("for(a of (0));", "for(a of 0);", "Literal", 1, { parserOptions: { ecmaVersion: 6 } }),
        invalid(
            "var foo = (function*() { if ((yield foo())) { return; } }())",
            "var foo = (function*() { if (yield foo()) { return; } }())",
            "YieldExpression",
            1,
            { parserOptions: { ecmaVersion: 6 } }
        ),
        invalid("f((0))", "f(0)", "Literal"),
        invalid("f(0, (1))", "f(0, 1)", "Literal"),
        invalid("!(0)", "!0", "Literal"),
        invalid("a[(1)]", "a[1]", "Literal"),
        invalid("(a)(b)", "a(b)", "Identifier"),
        invalid("(a, b)", "a, b", "SequenceExpression"),
        invalid("var a = (b = c);", "var a = b = c;", "AssignmentExpression"),
        invalid("function f(){ return (a); }", "function f(){ return a; }", "Identifier"),
        invalid("[a, (b = c)]", "[a, b = c]", "AssignmentExpression"),
        invalid("!{a: (b = c)}", "!{a: b = c}", "AssignmentExpression"),
        invalid("typeof(0)", "typeof 0", "Literal"),
        invalid("typeof (0)", "typeof 0", "Literal"),
        invalid("typeof([])", "typeof[]", "ArrayExpression"),
        invalid("typeof ([])", "typeof []", "ArrayExpression"),
        invalid("typeof( 0)", "typeof 0", "Literal"),
        invalid("typeof(typeof 5)", "typeof typeof 5", "UnaryExpression"),
        invalid("typeof (typeof 5)", "typeof typeof 5", "UnaryExpression"),
        invalid("+(+foo)", "+ +foo", "UnaryExpression"),
        invalid("-(-foo)", "- -foo", "UnaryExpression"),
        invalid("+(-foo)", "+-foo", "UnaryExpression"),
        invalid("-(+foo)", "-+foo", "UnaryExpression"),
        invalid("++(foo)", "++foo", "Identifier"),
        invalid("--(foo)", "--foo", "Identifier"),
        invalid("(a || b) ? c : d", "a || b ? c : d", "LogicalExpression"),
        invalid("a ? (b = c) : d", "a ? b = c : d", "AssignmentExpression"),
        invalid("a ? b : (c = d)", "a ? b : c = d", "AssignmentExpression"),
        invalid("f((a = b))", "f(a = b)", "AssignmentExpression"),
        invalid("a, (b = c)", "a, b = c", "AssignmentExpression"),
        invalid("a = (b * c)", "a = b * c", "BinaryExpression"),
        invalid("a + (b * c)", "a + b * c", "BinaryExpression"),
        invalid("(a * b) + c", "a * b + c", "BinaryExpression"),
        invalid("(a * b) / c", "a * b / c", "BinaryExpression"),
        invalid("(2) ** 3 ** 4", "2 ** 3 ** 4", "Literal", null, { parserOptions: { ecmaVersion: 7 } }),
        invalid("2 ** (3 ** 4)", "2 ** 3 ** 4", "BinaryExpression", null, { parserOptions: { ecmaVersion: 7 } }),
        invalid("(2 ** 3)", "2 ** 3", "BinaryExpression", null, { parserOptions: { ecmaVersion: 7 } }),
        invalid("(2 ** 3) + 1", "2 ** 3 + 1", "BinaryExpression", null, { parserOptions: { ecmaVersion: 7 } }),
        invalid("1 - (2 ** 3)", "1 - 2 ** 3", "BinaryExpression", null, { parserOptions: { ecmaVersion: 7 } }),

        invalid("a = (b * c)", "a = b * c", "BinaryExpression", null, { options: ["all", { nestedBinaryExpressions: false }] }),
        invalid("(b * c)", "b * c", "BinaryExpression", null, { options: ["all", { nestedBinaryExpressions: false }] }),

        invalid("a = (b = c)", "a = b = c", "AssignmentExpression"),
        invalid("(a).b", "a.b", "Identifier"),
        invalid("(0)[a]", "0[a]", "Literal"),
        invalid("(0.0).a", "0.0.a", "Literal"),
        invalid("(0xBEEF).a", "0xBEEF.a", "Literal"),
        invalid("(1e6).a", "1e6.a", "Literal"),
        invalid("(0123).a", "0123.a", "Literal"),
        invalid("a[(function() {})]", "a[function() {}]", "FunctionExpression"),
        invalid("new (function(){})", "new function(){}", "FunctionExpression"),
        invalid("new (\nfunction(){}\n)", "new \nfunction(){}\n", "FunctionExpression", 1),
        invalid("((function foo() {return 1;}))()", "(function foo() {return 1;})()", "FunctionExpression"),
        invalid("((function(){ return bar(); })())", "(function(){ return bar(); })()", "CallExpression"),

        invalid("new (A)", "new A", "Identifier"),
        invalid("(new A())()", "new A()()", "NewExpression"),
        invalid("(new A(1))()", "new A(1)()", "NewExpression"),
        invalid("((new A))()", "(new A)()", "NewExpression"),

        invalid("0, (_ => 0)", "0, _ => 0", "ArrowFunctionExpression", 1, { parserOptions: { ecmaVersion: 6 } }),
        invalid("(_ => 0), 0", "_ => 0, 0", "ArrowFunctionExpression", 1, { parserOptions: { ecmaVersion: 6 } }),
        invalid("a = (_ => 0)", "a = _ => 0", "ArrowFunctionExpression", 1, { parserOptions: { ecmaVersion: 6 } }),
        invalid("_ => (a = 0)", "_ => a = 0", "AssignmentExpression", 1, { parserOptions: { ecmaVersion: 6 } }),
        invalid("x => (({}))", "x => ({})", "ObjectExpression", 1, { parserOptions: { ecmaVersion: 6 } }),

        invalid("new (function(){})", "new function(){}", "FunctionExpression", null, { options: ["functions"] }),
        invalid("new (\nfunction(){}\n)", "new \nfunction(){}\n", "FunctionExpression", 1, { options: ["functions"] }),
        invalid("((function foo() {return 1;}))()", "(function foo() {return 1;})()", "FunctionExpression", null, { options: ["functions"] }),
        invalid("a[(function() {})]", "a[function() {}]", "FunctionExpression", null, { options: ["functions"] }),
        invalid("0, (_ => 0)", "0, _ => 0", "ArrowFunctionExpression", 1, { options: ["functions"], parserOptions: { ecmaVersion: 6 } }),
        invalid("(_ => 0), 0", "_ => 0, 0", "ArrowFunctionExpression", 1, { options: ["functions"], parserOptions: { ecmaVersion: 6 } }),
        invalid("a = (_ => 0)", "a = _ => 0", "ArrowFunctionExpression", 1, { options: ["functions"], parserOptions: { ecmaVersion: 6 } }),


        invalid("while ((foo = bar())) {}", "while (foo = bar()) {}", "AssignmentExpression"),
        invalid("while ((foo = bar())) {}", "while (foo = bar()) {}", "AssignmentExpression", 1, { options: ["all", { conditionalAssign: true }] }),
        invalid("if ((foo = bar())) {}", "if (foo = bar()) {}", "AssignmentExpression"),
        invalid("do; while ((foo = bar()))", "do; while (foo = bar())", "AssignmentExpression"),
        invalid("for (;(a = b););", "for (;a = b;);", "AssignmentExpression"),

        // https://github.com/eslint/eslint/issues/3653
        invalid("((function(){})).foo();", "(function(){}).foo();", "FunctionExpression"),
        invalid("((function(){}).foo());", "(function(){}).foo();", "CallExpression"),
        invalid("((function(){}).foo);", "(function(){}).foo;", "MemberExpression"),
        invalid("0, (function(){}).foo();", "0, function(){}.foo();", "FunctionExpression"),
        invalid("void (function(){}).foo();", "void function(){}.foo();", "FunctionExpression"),
        invalid("++(function(){}).foo;", "++function(){}.foo;", "FunctionExpression"),
        invalid("bar || (function(){}).foo();", "bar || function(){}.foo();", "FunctionExpression"),
        invalid("1 + (function(){}).foo();", "1 + function(){}.foo();", "FunctionExpression"),
        invalid("bar ? (function(){}).foo() : baz;", "bar ? function(){}.foo() : baz;", "FunctionExpression"),
        invalid("bar ? baz : (function(){}).foo();", "bar ? baz : function(){}.foo();", "FunctionExpression"),
        invalid("bar((function(){}).foo(), 0);", "bar(function(){}.foo(), 0);", "FunctionExpression"),
        invalid("bar[(function(){}).foo()];", "bar[function(){}.foo()];", "FunctionExpression"),
        invalid("var bar = (function(){}).foo();", "var bar = function(){}.foo();", "FunctionExpression"),

        invalid("((class{})).foo();", "(class{}).foo();", "ClassExpression", null, { parserOptions: { ecmaVersion: 6 } }),
        invalid("((class{}).foo());", "(class{}).foo();", "CallExpression", null, { parserOptions: { ecmaVersion: 6 } }),
        invalid("((class{}).foo);", "(class{}).foo;", "MemberExpression", null, { parserOptions: { ecmaVersion: 6 } }),
        invalid("0, (class{}).foo();", "0, class{}.foo();", "ClassExpression", null, { parserOptions: { ecmaVersion: 6 } }),
        invalid("void (class{}).foo();", "void class{}.foo();", "ClassExpression", null, { parserOptions: { ecmaVersion: 6 } }),
        invalid("++(class{}).foo;", "++class{}.foo;", "ClassExpression", null, { parserOptions: { ecmaVersion: 6 } }),
        invalid("bar || (class{}).foo();", "bar || class{}.foo();", "ClassExpression", null, { parserOptions: { ecmaVersion: 6 } }),
        invalid("1 + (class{}).foo();", "1 + class{}.foo();", "ClassExpression", null, { parserOptions: { ecmaVersion: 6 } }),
        invalid("bar ? (class{}).foo() : baz;", "bar ? class{}.foo() : baz;", "ClassExpression", null, { parserOptions: { ecmaVersion: 6 } }),
        invalid("bar ? baz : (class{}).foo();", "bar ? baz : class{}.foo();", "ClassExpression", null, { parserOptions: { ecmaVersion: 6 } }),
        invalid("bar((class{}).foo(), 0);", "bar(class{}.foo(), 0);", "ClassExpression", null, { parserOptions: { ecmaVersion: 6 } }),
        invalid("bar[(class{}).foo()];", "bar[class{}.foo()];", "ClassExpression", null, { parserOptions: { ecmaVersion: 6 } }),
        invalid("var bar = (class{}).foo();", "var bar = class{}.foo();", "ClassExpression", null, { parserOptions: { ecmaVersion: 6 } }),

        // https://github.com/eslint/eslint/issues/4608
        invalid("function *a() { yield (b); }", "function *a() { yield b; }", "Identifier", null, { parserOptions: { ecmaVersion: 6 } }),
        invalid("function *a() { (yield b), c; }", "function *a() { yield b, c; }", "YieldExpression", null, { parserOptions: { ecmaVersion: 6 } }),
        invalid("function *a() { yield ((b, c)); }", "function *a() { yield (b, c); }", "SequenceExpression", null, { parserOptions: { ecmaVersion: 6 } }),
        invalid("function *a() { yield (b + c); }", "function *a() { yield b + c; }", "BinaryExpression", null, { parserOptions: { ecmaVersion: 6 } }),

        // https://github.com/eslint/eslint/issues/4229
        invalid([
            "function a() {",
            "    return (b);",
            "}"
        ].join("\n"), [
            "function a() {",
            "    return b;",
            "}"
        ].join("\n"), "Identifier"),
        invalid([
            "function a() {",
            "    return",
            "    (b);",
            "}"
        ].join("\n"), [
            "function a() {",
            "    return",
            "    b;",
            "}"
        ].join("\n"), "Identifier"),
        invalid([
            "function a() {",
            "    return ((",
            "       b",
            "    ));",
            "}"
        ].join("\n"), [
            "function a() {",
            "    return (",
            "       b",
            "    );",
            "}"
        ].join("\n"), "Identifier"),
        invalid([
            "function a() {",
            "    return (<JSX />);",
            "}"
        ].join("\n"), [
            "function a() {",
            "    return <JSX />;",
            "}"
        ].join("\n"), "JSXElement", null),
        invalid([
            "function a() {",
            "    return",
            "    (<JSX />);",
            "}"
        ].join("\n"), [
            "function a() {",
            "    return",
            "    <JSX />;",
            "}"
        ].join("\n"), "JSXElement", null),
        invalid([
            "function a() {",
            "    return ((",
            "       <JSX />",
            "    ));",
            "}"
        ].join("\n"), [
            "function a() {",
            "    return (",
            "       <JSX />",
            "    );",
            "}"
        ].join("\n"), "JSXElement", null),
        invalid("throw (a);", "throw a;", "Identifier"),
        invalid([
            "throw ((",
            "   a",
            "));"
        ].join("\n"), [
            "throw (",
            "   a",
            ");"
        ].join("\n"), "Identifier"),
        invalid([
            "function *a() {",
            "    yield (b);",
            "}"
        ].join("\n"), [
            "function *a() {",
            "    yield b;",
            "}"
        ].join("\n"), "Identifier", null, { parserOptions: { ecmaVersion: 6 } }),
        invalid([
            "function *a() {",
            "    yield",
            "    (b);",
            "}"
        ].join("\n"), [
            "function *a() {",
            "    yield",
            "    b;",
            "}"
        ].join("\n"), "Identifier", null, { parserOptions: { ecmaVersion: 6 } }),
        invalid([
            "function *a() {",
            "    yield ((",
            "       b",
            "    ));",
            "}"
        ].join("\n"), [
            "function *a() {",
            "    yield (",
            "       b",
            "    );",
            "}"
        ].join("\n"), "Identifier", null, { parserOptions: { ecmaVersion: 6 } }),

        // returnAssign option
        {
            code: "function a(b) { return (b || c); }",
            options: ["all", { returnAssign: false }],
            errors: [
                {
                    message: "Gratuitous parentheses around expression.",
                    type: "LogicalExpression"
                }
            ],
            output: "function a(b) { return b || c; }"
        },
        {
            code: "function a(b) { return ((b = c) || (d = e)); }",
            errors: [
                {
                    message: "Gratuitous parentheses around expression.",
                    type: "LogicalExpression"
                }
            ],
            output: "function a(b) { return (b = c) || (d = e); }"
        },
        {
            code: "function a(b) { return (b = 1); }",
            errors: [
                {
                    message: "Gratuitous parentheses around expression.",
                    type: "AssignmentExpression"
                }
            ],
            output: "function a(b) { return b = 1; }"
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
            ],
            output: "function a(b) { return c ? d = b : e = b; }"
        },
        {
            code: "b => (b || c);",
            options: ["all", { returnAssign: false }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Gratuitous parentheses around expression.",
                    type: "LogicalExpression"
                }
            ],
            output: "b => b || c;"
        },
        {
            code: "b => ((b = c) || (d = e));",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Gratuitous parentheses around expression.",
                    type: "LogicalExpression"
                }
            ],
            output: "b => (b = c) || (d = e);"
        },
        {
            code: "b => (b = 1);",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Gratuitous parentheses around expression.",
                    type: "AssignmentExpression"
                }
            ],
            output: "b => b = 1;"
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
            ],
            output: "b => c ? d = b : e = b;"
        },
        {
            code: "b => { return (b || c); }",
            options: ["all", { returnAssign: false }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Gratuitous parentheses around expression.",
                    type: "LogicalExpression"
                }
            ],
            output: "b => { return b || c; }"
        },
        {
            code: "b => { return ((b = c) || (d = e)) };",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Gratuitous parentheses around expression.",
                    type: "LogicalExpression"
                }
            ],
            output: "b => { return (b = c) || (d = e) };"
        },
        {
            code: "b => { return (b = 1) };",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Gratuitous parentheses around expression.",
                    type: "AssignmentExpression"
                }
            ],
            output: "b => { return b = 1 };"
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
            ],
            output: "b => { return c ? d = b : e = b; }"
        },

        // async/await
        {
            code: "async function a() { (await a) + (await b); }",
            parserOptions: { ecmaVersion: 8 },
            errors: [
                {
                    message: "Gratuitous parentheses around expression.",
                    type: "AwaitExpression"
                },
                {
                    message: "Gratuitous parentheses around expression.",
                    type: "AwaitExpression"
                }
            ],
            output: "async function a() { await a + await b; }"
        },
        invalid("async function a() { await (a); }", "async function a() { await a; }", "Identifier", null, { parserOptions: { ecmaVersion: 8 } }),
        invalid("async function a() { await (a()); }", "async function a() { await a(); }", "CallExpression", null, { parserOptions: { ecmaVersion: 8 } }),
        invalid("async function a() { await (+a); }", "async function a() { await +a; }", "UnaryExpression", null, { parserOptions: { ecmaVersion: 8 } }),
        invalid("async function a() { +(await a); }", "async function a() { +await a; }", "AwaitExpression", null, { parserOptions: { ecmaVersion: 8 } }),
        invalid("(foo) instanceof bar", "foo instanceof bar", "Identifier", 1, { options: ["all", { nestedBinaryExpressions: false }] }),
        invalid("(foo) in bar", "foo in bar", "Identifier", 1, { options: ["all", { nestedBinaryExpressions: false }] }),
        invalid("(foo) + bar", "foo + bar", "Identifier", 1, { options: ["all", { nestedBinaryExpressions: false }] }),
        invalid("(foo) && bar", "foo && bar", "Identifier", 1, { options: ["all", { nestedBinaryExpressions: false }] }),
        invalid("foo instanceof (bar)", "foo instanceof bar", "Identifier", 1, { options: ["all", { nestedBinaryExpressions: false }] }),
        invalid("foo in (bar)", "foo in bar", "Identifier", 1, { options: ["all", { nestedBinaryExpressions: false }] }),
        invalid("foo + (bar)", "foo + bar", "Identifier", 1, { options: ["all", { nestedBinaryExpressions: false }] }),
        invalid("foo && (bar)", "foo && bar", "Identifier", 1, { options: ["all", { nestedBinaryExpressions: false }] }),

        // ["all", { ignoreJSX: "multi-line" }]
        invalid("const Component = (<div />);", "const Component = <div />;", "JSXElement", 1, {
            options: ["all", { ignoreJSX: "multi-line" }]
        }),
        invalid([
            "const Component = (",
            "  <div />",
            ");"
        ].join("\n"), "const Component = \n  <div />\n;", "JSXElement", 1, {
            options: ["all", { ignoreJSX: "multi-line" }]
        }),

        // ["all", { ignoreJSX: "single-line" }]
        invalid([
            "const Component = (",
            "<div>",
            "  <p />",
            "</div>",
            ");"
        ].join("\n"), "const Component = \n<div>\n  <p />\n</div>\n;", "JSXElement", 1, {
            options: ["all", { ignoreJSX: "single-line" }]
        }),
        invalid([
            "const Component = (<div>",
            "  <p />",
            "</div>);"
        ].join("\n"), "const Component = <div>\n  <p />\n</div>;", "JSXElement", 1, {
            options: ["all", { ignoreJSX: "single-line" }]
        }),
        invalid([
            "const Component = (<div",
            "  prop={true}",
            "/>)"
        ].join("\n"), "const Component = <div\n  prop={true}\n/>", "JSXElement", 1, {
            options: ["all", { ignoreJSX: "single-line" }]
        }),

        // ["all", { ignoreJSX: "none" }] default, same as unspecified
        invalid("const Component = (<div />);", "const Component = <div />;", "JSXElement", 1, {
            options: ["all", { ignoreJSX: "none" }]
        }),
        invalid([
            "const Component = (<div>",
            "<p />",
            "</div>)"
        ].join("\n"), "const Component = <div>\n<p />\n</div>", "JSXElement", 1, {
            options: ["all", { ignoreJSX: "none" }]
        }),

        // ["all", { enforceForArrowConditionals: true }]
        {
            code: "var a = (b) => (1 ? 2 : 3)",
            parserOptions: { ecmaVersion: 6 },
            options: ["all", { enforceForArrowConditionals: true }],
            errors: [
                {
                    message: "Gratuitous parentheses around expression."
                }
            ],
            output: "var a = (b) => 1 ? 2 : 3"
        },

        // ["all", { enforceForArrowConditionals: false }]
        {
            code: "var a = (b) => ((1 ? 2 : 3))",
            parserOptions: { ecmaVersion: 6 },
            options: ["all", { enforceForArrowConditionals: false }],
            errors: [
                {
                    message: "Gratuitous parentheses around expression."
                }
            ],
            output: "var a = (b) => (1 ? 2 : 3)"
        },

        // https://github.com/eslint/eslint/issues/8175
        invalid(
            "let a = [...(b)]",
            "let a = [...b]",
            "Identifier",
            1,
            { parserOptions: { ecmaVersion: 2015 } }
        ),
        invalid(
            "let a = {...(b)}",
            "let a = {...b}",
            "Identifier",
            1,
            {
                parserOptions: {
                    ecmaVersion: 2015,
                    ecmaFeatures: { experimentalObjectRestSpread: true }
                }
            }
        ),
        invalid(
            "let a = [...((b, c))]",
            "let a = [...(b, c)]",
            "SequenceExpression",
            1,
            { parserOptions: { ecmaVersion: 2015 } }
        ),
        invalid(
            "let a = {...((b, c))}",
            "let a = {...(b, c)}",
            "SequenceExpression",
            1,
            {
                parserOptions: {
                    ecmaVersion: 2015,
                    ecmaFeatures: { experimentalObjectRestSpread: true }
                }
            }
        ),
        invalid(
            "class A extends (B) {}",
            "class A extends B {}",
            "Identifier",
            1,
            { parserOptions: { ecmaVersion: 2015 } }
        ),
        invalid(
            "const A = class extends (B) {}",
            "const A = class extends B {}",
            "Identifier",
            1,
            { parserOptions: { ecmaVersion: 2015 } }
        ),
        invalid(
            "class A extends ((B=C)) {}",
            "class A extends (B=C) {}",
            "AssignmentExpression",
            1,
            { parserOptions: { ecmaVersion: 2015 } }
        ),
        invalid(
            "const A = class extends ((B=C)) {}",
            "const A = class extends (B=C) {}",
            "AssignmentExpression",
            1,
            { parserOptions: { ecmaVersion: 2015 } }
        ),
        invalid(
            "for (foo of(bar));",
            "for (foo of bar);",
            "Identifier",
            1,
            { parserOptions: { ecmaVersion: 2015 } }
        ),
        invalid(
            "for ((foo) of bar);",
            "for (foo of bar);",
            "Identifier",
            1,
            { parserOptions: { ecmaVersion: 2015 } }
        ),
        invalid(
            "for ((foo)in bar);",
            "for (foo in bar);",
            "Identifier",
            1,
            { parserOptions: { ecmaVersion: 2015 } }
        ),
        invalid(
            "for ((foo['bar'])of baz);",
            "for (foo['bar']of baz);",
            "MemberExpression",
            1,
            { parserOptions: { ecmaVersion: 2015 } }
        ),
        invalid(
            "() => (({ foo: 1 }).foo)",
            "() => ({ foo: 1 }).foo",
            "MemberExpression",
            1,
            { parserOptions: { ecmaVersion: 2015 } }
        ),
        invalid(
            "(let).foo",
            "let.foo",
            "Identifier",
            1
        ),
        invalid(
            "for ((let.foo) in bar);",
            "for (let.foo in bar);",
            "MemberExpression",
            1
        ),
        invalid(
            "for ((let).foo.bar in baz);",
            "for (let.foo.bar in baz);",
            "Identifier",
            1
        )
    ]
});
