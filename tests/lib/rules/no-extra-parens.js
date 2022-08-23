/**
 * @fileoverview Disallow parenthesising higher precedence subexpressions.
 * @author Michael Ficarra
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-extra-parens"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

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
    const result = {
        code,
        output,
        parserOptions: config && config.parserOptions || {},
        errors: [
            {
                messageId: "unexpected",
                type
            }
        ],
        options: config && config.options || []
    };

    if (line) {
        result.errors[0].line = line;
    }
    return result;
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2022,
        ecmaFeatures: {
            jsx: true
        }
    }
});

ruleTester.run("no-extra-parens", rule, {
    valid: [

        // all precedence boundaries
        "foo",
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
        "new (foo.Baz().foo)",
        "new (foo.baz.bar().foo.baz)",
        "new ({}.baz.bar.foo().baz)",
        "new (doSomething().baz.bar().foo)",
        "new ([][0].baz.foo().bar.foo)",
        "new (foo\n.baz\n.bar()\n.foo.baz)",
        "new A()()",
        "(new A)()",
        "(new (Foo || Bar))()",
        "(new new foo())()",
        "new (new A)()",
        "new (new a.b)()",
        "new (new new foo())(bar)",
        "(new foo).bar",
        "(new foo)[bar]",
        "(new foo).bar.baz",
        "(new foo.bar).baz",
        "(new foo).bar()",
        "(new foo.bar).baz()",
        "new (new foo).bar",
        "new (new foo.bar).baz",
        "(new new foo()).baz",
        "(2 + 3) ** 4",
        "2 ** (2 + 3)",
        "new (import(source))",
        "import((s,t))",

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
        "2 ** 3 ** 4",
        "(2 ** 3) ** 4",

        // constructs that contain expressions
        "if(a);",
        "with(a){}",
        "switch(a){ case 0: break; }",
        "function a(){ return b; }",
        "var a = () => { return b; }",
        "throw a;",
        "while(a);",
        "do; while(a);",
        "for(;;);",
        "for(a in b);",
        "for(a in b, c);",
        "for(a of b);",
        "for (a of (b, c));",
        "var a = (b, c);",
        "[]",
        "[a, b]",
        "!{a}",
        "!{a: 0, b: 1}",
        "!{[a]:0}",
        "!{[(a, b)]:0}",
        "!{a, ...b}",
        "const {a} = {}",
        "const {a:b} = {}",
        "const {a:b=1} = {}",
        "const {[a]:b} = {}",
        "const {[a]:b=1} = {}",
        "const {[(a, b)]:c} = {}",
        "const {a, ...b} = {}",
        "class foo {}",
        "class foo { constructor(){} a(){} get b(){} set b(bar){} get c(){} set d(baz){} static e(){} }",
        "class foo { [a](){} get [b](){} set [b](bar){} get [c](){} set [d](baz){} static [e](){} }",
        "class foo { [(a,b)](){} }",
        "class foo { a(){} [b](){} c(){} [(d,e)](){} }",
        "class foo { [(a,b)](){} c(){} [d](){} e(){} }",
        "const foo = class { constructor(){} a(){} get b(){} set b(bar){} get c(){} set d(baz){} static e(){} }",
        "class foo { x; }",
        "class foo { static x; }",
        "class foo { x = 1; }",
        "class foo { static x = 1; }",
        "class foo { #x; }",
        "class foo { static #x; }",
        "class foo { static #x = 1; }",
        "class foo { #x(){} get #y() {} set #y(value) {} static #z(){} static get #q() {} static set #q(value) {} }",
        "const foo  = class { #x(){} get #y() {} set #y(value) {} static #z(){} static get #q() {} static set #q(value) {} }",
        "class foo { [(x, y)]; }",
        "class foo { static [(x, y)]; }",
        "class foo { [(x, y)] = 1; }",
        "class foo { static [(x, y)] = 1; }",
        "class foo { x = (y, z); }",
        "class foo { static x = (y, z); }",
        "class foo { #x = (y, z); }",
        "class foo { static #x = (y, z); }",
        "class foo { [(1, 2)] = (3, 4) }",
        "const foo = class { [(1, 2)] = (3, 4) }",

        // ExpressionStatement restricted productions
        "({});",
        "(function(){});",
        "(let[a] = b);",
        "(function*(){});",
        "(class{});",

        // special cases
        "(0).a",
        "(123).a",
        "(08).a",
        "(09).a",
        "(018).a",
        "(012934).a",
        "(5_000).a",
        "(5_000_00).a",
        "(function(){ }())",
        "({a: function(){}}.a());",
        "({a:0}.a ? b : c)",

        // RegExp literal is allowed to have parens (#1589)
        "var isA = (/^a$/).test('a');",
        "var regex = (/^a$/);",
        "function a(){ return (/^a$/); }",
        "function a(){ return (/^a$/).test('a'); }",
        "var isA = ((/^a$/)).test('a');",

        // IIFE is allowed to have parens in any position (#655)
        "var foo = (function() { return bar(); }())",
        "var o = { foo: (function() { return bar(); }()) };",
        "o.foo = (function(){ return bar(); }());",
        "(function(){ return bar(); }()), (function(){ return bar(); }())",

        // IIFE is allowed to have outer parens (#1004)
        "var foo = (function() { return bar(); })()",
        "var o = { foo: (function() { return bar(); })() };",
        "o.foo = (function(){ return bar(); })();",
        "(function(){ return bar(); })(), (function(){ return bar(); })()",
        "function foo() { return (function(){}()); }",

        // parens are required around yield
        "var foo = (function*() { if ((yield foo()) + 1) { return; } }())",

        // arrow functions have the precedence of an assignment expression
        "(() => 0)()",
        "(_ => 0)()",
        "_ => 0, _ => 1",
        "a = () => b = 0",
        "0 ? _ => 0 : _ => 0",
        "(_ => 0) || (_ => 0)",

        // Object literals as arrow function bodies need parentheses
        "x => ({foo: 1})",


        // Exponentiation operator `**`
        "1 + 2 ** 3",
        "1 - 2 ** 3",
        "2 ** -3",
        "(-2) ** 3",
        "(+2) ** 3",
        "+ (2 ** 3)",

        // https://github.com/eslint/eslint/issues/5789
        "a => ({b: c}[d])",
        "a => ({b: c}.d())",
        "a => ({b: c}.d.e)",

        // "functions" enables reports for function nodes only
        { code: "(0)", options: ["functions"] },
        { code: "((0))", options: ["functions"] },
        { code: "a + (b * c)", options: ["functions"] },
        { code: "a + ((b * c))", options: ["functions"] },
        { code: "(a)(b)", options: ["functions"] },
        { code: "((a))(b)", options: ["functions"] },
        { code: "a, (b = c)", options: ["functions"] },
        { code: "a, ((b = c))", options: ["functions"] },
        { code: "for(a in (0));", options: ["functions"] },
        { code: "for(a in ((0)));", options: ["functions"] },
        { code: "var a = (b = c)", options: ["functions"] },
        { code: "var a = ((b = c))", options: ["functions"] },
        { code: "_ => (a = 0)", options: ["functions"] },
        { code: "_ => ((a = 0))", options: ["functions"] },

        // ["all", { conditionalAssign: false }] enables extra parens around conditional assignments
        { code: "while ((foo = bar())) {}", options: ["all", { conditionalAssign: false }] },
        { code: "if ((foo = bar())) {}", options: ["all", { conditionalAssign: false }] },
        { code: "do; while ((foo = bar()))", options: ["all", { conditionalAssign: false }] },
        { code: "for (;(a = b););", options: ["all", { conditionalAssign: false }] },
        { code: "var a = ((b = c)) ? foo : bar;", options: ["all", { conditionalAssign: false }] },
        { code: "while (((foo = bar()))) {}", options: ["all", { conditionalAssign: false }] },
        { code: "var a = (((b = c))) ? foo : bar;", options: ["all", { conditionalAssign: false }] },

        // ["all", { nestedBinaryExpressions: false }] enables extra parens around conditional assignments
        { code: "a + (b * c)", options: ["all", { nestedBinaryExpressions: false }] },
        { code: "(a * b) + c", options: ["all", { nestedBinaryExpressions: false }] },
        { code: "(a * b) / c", options: ["all", { nestedBinaryExpressions: false }] },
        { code: "a || (b && c)", options: ["all", { nestedBinaryExpressions: false }] },
        { code: "a + ((b * c))", options: ["all", { nestedBinaryExpressions: false }] },
        { code: "((a * b)) + c", options: ["all", { nestedBinaryExpressions: false }] },
        { code: "((a * b)) / c", options: ["all", { nestedBinaryExpressions: false }] },
        { code: "a || ((b && c))", options: ["all", { nestedBinaryExpressions: false }] },

        // ["all", { returnAssign: false }] enables extra parens around expressions returned by return statements
        { code: "function a(b) { return b || c; }", options: ["all", { returnAssign: false }] },
        { code: "function a(b) { return; }", options: ["all", { returnAssign: false }] },
        { code: "function a(b) { return (b = 1); }", options: ["all", { returnAssign: false }] },
        { code: "function a(b) { return (b = c) || (b = d); }", options: ["all", { returnAssign: false }] },
        { code: "function a(b) { return c ? (d = b) : (e = b); }", options: ["all", { returnAssign: false }] },
        { code: "b => b || c;", options: ["all", { returnAssign: false }] },
        { code: "b => (b = 1);", options: ["all", { returnAssign: false }] },
        { code: "b => (b = c) || (b = d);", options: ["all", { returnAssign: false }] },
        { code: "b => c ? (d = b) : (e = b);", options: ["all", { returnAssign: false }] },
        { code: "b => { return b || c };", options: ["all", { returnAssign: false }] },
        { code: "b => { return (b = 1) };", options: ["all", { returnAssign: false }] },
        { code: "b => { return (b = c) || (b = d) };", options: ["all", { returnAssign: false }] },
        { code: "b => { return c ? (d = b) : (e = b) };", options: ["all", { returnAssign: false }] },
        { code: "function a(b) { return ((b = 1)); }", options: ["all", { returnAssign: false }] },
        { code: "b => ((b = 1));", options: ["all", { returnAssign: false }] },

        // https://github.com/eslint/eslint/issues/3653
        "(function(){}).foo(), 1, 2;",
        "(function(){}).foo++;",
        "(function(){}).foo() || bar;",
        "(function(){}).foo() + 1;",
        "(function(){}).foo() ? bar : baz;",
        "(function(){}).foo.bar();",
        "(function(){}.foo());",
        "(function(){}.foo.bar);",

        "(class{}).foo(), 1, 2;",
        "(class{}).foo++;",
        "(class{}).foo() || bar;",
        "(class{}).foo() + 1;",
        "(class{}).foo() ? bar : baz;",
        "(class{}).foo.bar();",
        "(class{}.foo());",
        "(class{}.foo.bar);",

        // https://github.com/eslint/eslint/issues/4608
        "function *a() { yield b; }",
        "function *a() { yield yield; }",
        "function *a() { yield b, c; }",
        "function *a() { yield (b, c); }",
        "function *a() { yield b + c; }",
        "function *a() { (yield b) + c; }",

        // https://github.com/eslint/eslint/issues/4229
        [
            "function a() {",
            "    return (",
            "        b",
            "    );",
            "}"
        ].join("\n"),
        [
            "function a() {",
            "    return (",
            "        <JSX />",
            "    );",
            "}"
        ].join("\n"),
        [
            "function a() {",
            "    return (",
            "        <></>",
            "    );",
            "}"
        ].join("\n"),
        [
            "throw (",
            "    a",
            ");"
        ].join("\n"),
        [
            "function *a() {",
            "    yield (",
            "        b",
            "    );",
            "}"
        ].join("\n"),

        // linebreaks before postfix update operators are not allowed
        "(a\n)++",
        "(a\n)--",
        "(a\n\n)++",
        "(a.b\n)--",
        "(a\n.b\n)++",
        "(a[\nb\n]\n)--",
        "(a[b]\n\n)++",

        // async/await
        "async function a() { await (a + b) }",
        "async function a() { await (a + await b) }",
        "async function a() { (await a)() }",
        "async function a() { new (await a) }",
        "async function a() { await (a ** b) }",
        "async function a() { (await a) ** b }",

        { code: "(foo instanceof bar) instanceof baz", options: ["all", { nestedBinaryExpressions: false }] },
        { code: "(foo in bar) in baz", options: ["all", { nestedBinaryExpressions: false }] },
        { code: "(foo + bar) + baz", options: ["all", { nestedBinaryExpressions: false }] },
        { code: "(foo && bar) && baz", options: ["all", { nestedBinaryExpressions: false }] },
        { code: "foo instanceof (bar instanceof baz)", options: ["all", { nestedBinaryExpressions: false }] },
        { code: "foo in (bar in baz)", options: ["all", { nestedBinaryExpressions: false }] },
        { code: "foo + (bar + baz)", options: ["all", { nestedBinaryExpressions: false }] },
        { code: "foo && (bar && baz)", options: ["all", { nestedBinaryExpressions: false }] },
        { code: "((foo instanceof bar)) instanceof baz", options: ["all", { nestedBinaryExpressions: false }] },
        { code: "((foo in bar)) in baz", options: ["all", { nestedBinaryExpressions: false }] },

        // https://github.com/eslint/eslint/issues/9019
        "(async function() {});",
        "(async function () { }());",

        // ["all", { ignoreJSX: "all" }]
        { code: "const Component = (<div />)", options: ["all", { ignoreJSX: "all" }] },
        { code: "const Component = ((<div />))", options: ["all", { ignoreJSX: "all" }] },
        {
            code: [
                "const Component = (<>",
                "  <p />",
                "</>);"
            ].join("\n"),
            options: ["all", { ignoreJSX: "all" }]
        },
        {
            code: [
                "const Component = ((<>",
                "  <p />",
                "</>));"
            ].join("\n"),
            options: ["all", { ignoreJSX: "all" }]
        },
        {
            code: [
                "const Component = (<div>",
                "  <p />",
                "</div>);"
            ].join("\n"),
            options: ["all", { ignoreJSX: "all" }]
        },
        {
            code: [
                "const Component = (",
                "  <div />",
                ");"
            ].join("\n"),
            options: ["all", { ignoreJSX: "all" }]
        },
        {
            code: [
                "const Component =",
                "  (<div />)"
            ].join("\n"),
            options: ["all", { ignoreJSX: "all" }]
        },

        // ["all", { ignoreJSX: "single-line" }]
        { code: "const Component = (<div />);", options: ["all", { ignoreJSX: "single-line" }] },
        { code: "const Component = ((<div />));", options: ["all", { ignoreJSX: "single-line" }] },
        {
            code: [
                "const Component = (",
                "  <div />",
                ");"
            ].join("\n"),
            options: ["all", { ignoreJSX: "single-line" }]
        },
        {
            code: [
                "const Component =",
                "(<div />)"
            ].join("\n"),
            options: ["all", { ignoreJSX: "single-line" }]
        },

        // ["all", { ignoreJSX: "multi-line" }]
        {
            code: [
                "const Component = (",
                "<div>",
                "  <p />",
                "</div>",
                ");"
            ].join("\n"),
            options: ["all", { ignoreJSX: "multi-line" }]
        },
        {
            code: [
                "const Component = ((",
                "<div>",
                "  <p />",
                "</div>",
                "));"
            ].join("\n"),
            options: ["all", { ignoreJSX: "multi-line" }]
        },
        {
            code: [
                "const Component = (<div>",
                "  <p />",
                "</div>);"
            ].join("\n"),
            options: ["all", { ignoreJSX: "multi-line" }]
        },
        {
            code: [
                "const Component =",
                "(<div>",
                "  <p />",
                "</div>);"
            ].join("\n"),
            options: ["all", { ignoreJSX: "multi-line" }]
        },
        {
            code: [
                "const Component = (<div",
                "  prop={true}",
                "/>)"
            ].join("\n"),
            options: ["all", { ignoreJSX: "multi-line" }]
        },

        // ["all", { enforceForArrowConditionals: false }]
        { code: "var a = b => 1 ? 2 : 3", options: ["all", { enforceForArrowConditionals: false }] },
        { code: "var a = (b) => (1 ? 2 : 3)", options: ["all", { enforceForArrowConditionals: false }] },
        { code: "var a = (b) => ((1 ? 2 : 3))", options: ["all", { enforceForArrowConditionals: false }] },

        // ["all", { enforceForSequenceExpressions: false }]
        { code: "(a, b)", options: ["all", { enforceForSequenceExpressions: false }] },
        { code: "((a, b))", options: ["all", { enforceForSequenceExpressions: false }] },
        { code: "(foo(), bar());", options: ["all", { enforceForSequenceExpressions: false }] },
        { code: "((foo(), bar()));", options: ["all", { enforceForSequenceExpressions: false }] },
        { code: "if((a, b)){}", options: ["all", { enforceForSequenceExpressions: false }] },
        { code: "if(((a, b))){}", options: ["all", { enforceForSequenceExpressions: false }] },
        { code: "while ((val = foo(), val < 10));", options: ["all", { enforceForSequenceExpressions: false }] },

        // ["all", { enforceForNewInMemberExpressions: false }]
        { code: "(new foo()).bar", options: ["all", { enforceForNewInMemberExpressions: false }] },
        { code: "(new foo())[bar]", options: ["all", { enforceForNewInMemberExpressions: false }] },
        { code: "(new foo()).bar()", options: ["all", { enforceForNewInMemberExpressions: false }] },
        { code: "(new foo(bar)).baz", options: ["all", { enforceForNewInMemberExpressions: false }] },
        { code: "(new foo.bar()).baz", options: ["all", { enforceForNewInMemberExpressions: false }] },
        { code: "(new foo.bar()).baz()", options: ["all", { enforceForNewInMemberExpressions: false }] },
        { code: "((new foo.bar())).baz()", options: ["all", { enforceForNewInMemberExpressions: false }] },

        // ["all", { enforceForFunctionPrototypeMethods: false }]
        { code: "var foo = (function(){}).call()", options: ["all", { enforceForFunctionPrototypeMethods: false }] },
        { code: "var foo = (function(){}).apply()", options: ["all", { enforceForFunctionPrototypeMethods: false }] },
        { code: "var foo = (function(){}.call())", options: ["all", { enforceForFunctionPrototypeMethods: false }] },
        { code: "var foo = (function(){}.apply())", options: ["all", { enforceForFunctionPrototypeMethods: false }] },
        { code: "var foo = (function(){}).call(arg)", options: ["all", { enforceForFunctionPrototypeMethods: false }] },
        { code: "var foo = (function(){}.apply(arg))", options: ["all", { enforceForFunctionPrototypeMethods: false }] },
        { code: "var foo = (function(){}['call']())", options: ["all", { enforceForFunctionPrototypeMethods: false }] },
        { code: "var foo = (function(){})[`apply`]()", options: ["all", { enforceForFunctionPrototypeMethods: false }] },
        { code: "var foo = ((function(){})).call()", options: ["all", { enforceForFunctionPrototypeMethods: false }] },
        { code: "var foo = ((function(){}).apply())", options: ["all", { enforceForFunctionPrototypeMethods: false }] },
        { code: "var foo = ((function(){}.call()))", options: ["all", { enforceForFunctionPrototypeMethods: false }] },
        { code: "var foo = ((((function(){})).apply()))", options: ["all", { enforceForFunctionPrototypeMethods: false }] },
        { code: "foo((function(){}).call().bar)", options: ["all", { enforceForFunctionPrototypeMethods: false }] },
        { code: "foo = (function(){}).call()()", options: ["all", { enforceForFunctionPrototypeMethods: false }] },
        { code: "foo = (function(){}.call())()", options: ["all", { enforceForFunctionPrototypeMethods: false }] },
        { code: "var foo = { bar: (function(){}.call()) }", options: ["all", { enforceForFunctionPrototypeMethods: false }] },
        { code: "var foo = { [(function(){}.call())]: bar  }", options: ["all", { enforceForFunctionPrototypeMethods: false }] },
        { code: "if((function(){}).call()){}", options: ["all", { enforceForFunctionPrototypeMethods: false }] },
        { code: "while((function(){}.apply())){}", options: ["all", { enforceForFunctionPrototypeMethods: false }] },

        "let a = [ ...b ]",
        "let a = { ...b }",
        {
            code: "let a = { ...b }",
            parserOptions: { ecmaVersion: 2018 }
        },
        "let a = [ ...(b, c) ]",
        "let a = { ...(b, c) }",
        {
            code: "let a = { ...(b, c) }",
            parserOptions: { ecmaVersion: 2018 }
        },
        "var [x = (1, foo)] = bar",
        "class A extends B {}",
        "const A = class extends B {}",
        "class A extends (B=C) {}",
        "const A = class extends (B=C) {}",
        "class A extends (++foo) {}",
        "() => ({ foo: 1 })",
        "() => ({ foo: 1 }).foo",
        "() => ({ foo: 1 }.foo().bar).baz.qux()",
        "() => ({ foo: 1 }.foo().bar + baz)",
        {
            code: "export default (a, b)",
            parserOptions: { sourceType: "module" }
        },
        {
            code: "export default (function(){}).foo",
            parserOptions: { sourceType: "module" }
        },
        {
            code: "export default (class{}).foo",
            parserOptions: { sourceType: "module" }
        },
        "({}).hasOwnProperty.call(foo, bar)",
        "({}) ? foo() : bar()",
        "({}) + foo",
        "(function(){}) + foo",
        "(let)\nfoo",
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

        // ForStatement#init expression cannot start with `let[`. It would be parsed as a `let` declaration with array pattern, or a syntax error.
        "for ((let[a]);;);",
        "for ((let)[a];;);",
        "for ((let[a] = 1);;);",
        "for ((let[a]) = 1;;);",
        "for ((let)[a] = 1;;);",
        "for ((let[a, b] = foo);;);",
        "for ((let[a].b = 1);;);",
        "for ((let[a].b) = 1;;);",
        "for ((let[a]).b = 1;;);",
        "for ((let)[a].b = 1;;);",
        "for ((let[a])();;);",
        "for ((let)[a]();;);",
        "for ((let[a]) + b;;);",

        // ForInStatement#left expression cannot start with `let[`. It would be parsed as a `let` declaration with array pattern, or a syntax error.
        "for ((let[foo]) in bar);",
        "for ((let)[foo] in bar);",
        "for ((let[foo].bar) in baz);",
        "for ((let[foo]).bar in baz);",
        "for ((let)[foo].bar in baz);",

        // ForOfStatement#left expression cannot start with `let`. It's explicitly forbidden by the specification.
        "for ((let) of foo);",
        "for ((let).foo of bar);",
        "for ((let.foo) of bar);",
        "for ((let[foo]) of bar);",
        "for ((let)[foo] of bar);",
        "for ((let.foo.bar) of baz);",
        "for ((let.foo).bar of baz);",
        "for ((let).foo.bar of baz);",
        "for ((let[foo].bar) of baz);",
        "for ((let[foo]).bar of baz);",
        "for ((let)[foo].bar of baz);",
        "for ((let)().foo of bar);",
        "for ((let()).foo of bar);",
        "for ((let().foo) of bar);",

        // https://github.com/eslint/eslint/issues/11706 (also in invalid[])
        "for (let a = (b in c); ;);",
        "for (let a = (b && c in d); ;);",
        "for (let a = (b in c && d); ;);",
        "for (let a = (b => b in c); ;);",
        "for (let a = b => (b in c); ;);",
        "for (let a = (b in c in d); ;);",
        "for (let a = (b in c), d = (e in f); ;);",
        "for (let a = (b => c => b in c); ;);",
        "for (let a = (b && c && d in e); ;);",
        "for (let a = b && (c in d); ;);",
        "for (let a = (b in c) && (d in e); ;);",
        "for ((a in b); ;);",
        "for (a = (b in c); ;);",
        "for ((a in b && c in d && e in f); ;);",
        "for (let a = [] && (b in c); ;);",
        "for (let a = (b in [c]); ;);",
        "for (let a = b => (c in d); ;);",
        "for (let a = (b in c) ? d : e; ;);",
        "for (let a = (b in c ? d : e); ;);",
        "for (let a = b ? c : (d in e); ;);",
        "for (let a = (b in c), d = () => { for ((e in f);;); for ((g in h);;); }; ;); for((i in j); ;);",

        // https://github.com/eslint/eslint/issues/11706 regression tests (also in invalid[])
        "for (let a = b; a; a); a; a;",
        "for (a; a; a); a; a;",
        "for (; a; a); a; a;",
        "for (let a = (b && c) === d; ;);",

        "new (a()).b.c;",
        "new (a().b).c;",
        "new (a().b.c);",
        "new (a().b().d);",
        "new a().b().d;",
        "new (a(b()).c)",
        "new (a.b()).c",

        // Nullish coalescing
        { code: "var v = (a ?? b) || c", parserOptions: { ecmaVersion: 2020 } },
        { code: "var v = a ?? (b || c)", parserOptions: { ecmaVersion: 2020 } },
        { code: "var v = (a ?? b) && c", parserOptions: { ecmaVersion: 2020 } },
        { code: "var v = a ?? (b && c)", parserOptions: { ecmaVersion: 2020 } },
        { code: "var v = (a || b) ?? c", parserOptions: { ecmaVersion: 2020 } },
        { code: "var v = a || (b ?? c)", parserOptions: { ecmaVersion: 2020 } },
        { code: "var v = (a && b) ?? c", parserOptions: { ecmaVersion: 2020 } },
        { code: "var v = a && (b ?? c)", parserOptions: { ecmaVersion: 2020 } },

        // Optional chaining
        { code: "var v = (obj?.aaa).bbb", parserOptions: { ecmaVersion: 2020 } },
        { code: "var v = (obj?.aaa)()", parserOptions: { ecmaVersion: 2020 } },
        { code: "var v = new (obj?.aaa)()", parserOptions: { ecmaVersion: 2020 } },
        { code: "var v = new (obj?.aaa)", parserOptions: { ecmaVersion: 2020 } },
        { code: "var v = (obj?.aaa)`template`", parserOptions: { ecmaVersion: 2020 } },
        { code: "var v = (obj?.()).bbb", parserOptions: { ecmaVersion: 2020 } },
        { code: "var v = (obj?.())()", parserOptions: { ecmaVersion: 2020 } },
        { code: "var v = new (obj?.())()", parserOptions: { ecmaVersion: 2020 } },
        { code: "var v = new (obj?.())", parserOptions: { ecmaVersion: 2020 } },
        { code: "var v = (obj?.())`template`", parserOptions: { ecmaVersion: 2020 } },
        { code: "(obj?.aaa).bbb = 0", parserOptions: { ecmaVersion: 2020 } },
        { code: "var foo = (function(){})?.()", parserOptions: { ecmaVersion: 2020 } },
        { code: "var foo = (function(){}?.())", parserOptions: { ecmaVersion: 2020 } },
        {
            code: "var foo = (function(){})?.call()",
            options: ["all", { enforceForFunctionPrototypeMethods: false }],
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "var foo = (function(){}?.call())",
            options: ["all", { enforceForFunctionPrototypeMethods: false }],
            parserOptions: { ecmaVersion: 2020 }
        }
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
        invalid("for(a of (0));", "for(a of 0);", "Literal", 1),
        invalid("const foo = {[(a)]:1}", "const foo = {[a]:1}", "Identifier", 1),
        invalid("const foo = {[(a=b)]:1}", "const foo = {[a=b]:1}", "AssignmentExpression", 1),
        invalid("const foo = {*[(Symbol.iterator)]() {}}", "const foo = {*[Symbol.iterator]() {}}", "MemberExpression", 1),
        invalid("const foo = { get [(a)]() {}}", "const foo = { get [a]() {}}", "Identifier", 1),
        invalid("const foo = {[(a+b)]:c, d}", "const foo = {[a+b]:c, d}", "BinaryExpression", 1),
        invalid("const foo = {a, [(b+c)]:d, e}", "const foo = {a, [b+c]:d, e}", "BinaryExpression", 1),
        invalid("const foo = {[(a+b)]:c, d:e}", "const foo = {[a+b]:c, d:e}", "BinaryExpression", 1),
        invalid("const foo = {a:b, [(c+d)]:e, f:g}", "const foo = {a:b, [c+d]:e, f:g}", "BinaryExpression", 1),
        invalid("const foo = {[(a+b)]:c, [d]:e}", "const foo = {[a+b]:c, [d]:e}", "BinaryExpression", 1),
        invalid("const foo = {[a]:b, [(c+d)]:e, [f]:g}", "const foo = {[a]:b, [c+d]:e, [f]:g}", "BinaryExpression", 1),
        invalid("const foo = {[(a+b)]:c, [(d,e)]:f}", "const foo = {[a+b]:c, [(d,e)]:f}", "BinaryExpression", 1),
        invalid("const foo = {[(a,b)]:c, [(d+e)]:f, [(g,h)]:e}", "const foo = {[(a,b)]:c, [d+e]:f, [(g,h)]:e}", "BinaryExpression", 1),
        invalid("const foo = {a, b:c, [(d+e)]:f, [(g,h)]:i, [j]:k}", "const foo = {a, b:c, [d+e]:f, [(g,h)]:i, [j]:k}", "BinaryExpression", 1),
        invalid("const foo = {[a+(b*c)]:d}", "const foo = {[a+b*c]:d}", "BinaryExpression", 1),
        invalid("const foo = {[(a, (b+c))]:d}", "const foo = {[(a, b+c)]:d}", "BinaryExpression", 1),
        invalid("const {[(a)]:b} = {}", "const {[a]:b} = {}", "Identifier", 1),
        invalid("const {[(a=b)]:c=1} = {}", "const {[a=b]:c=1} = {}", "AssignmentExpression", 1),
        invalid("const {[(a+b)]:c, d} = {}", "const {[a+b]:c, d} = {}", "BinaryExpression", 1),
        invalid("const {a, [(b+c)]:d, e} = {}", "const {a, [b+c]:d, e} = {}", "BinaryExpression", 1),
        invalid("const {[(a+b)]:c, d:e} = {}", "const {[a+b]:c, d:e} = {}", "BinaryExpression", 1),
        invalid("const {a:b, [(c+d)]:e, f:g} = {}", "const {a:b, [c+d]:e, f:g} = {}", "BinaryExpression", 1),
        invalid("const {[(a+b)]:c, [d]:e} = {}", "const {[a+b]:c, [d]:e} = {}", "BinaryExpression", 1),
        invalid("const {[a]:b, [(c+d)]:e, [f]:g} = {}", "const {[a]:b, [c+d]:e, [f]:g} = {}", "BinaryExpression", 1),
        invalid("const {[(a+b)]:c, [(d,e)]:f} = {}", "const {[a+b]:c, [(d,e)]:f} = {}", "BinaryExpression", 1),
        invalid("const {[(a,b)]:c, [(d+e)]:f, [(g,h)]:e} = {}", "const {[(a,b)]:c, [d+e]:f, [(g,h)]:e} = {}", "BinaryExpression", 1),
        invalid("const {a, b:c, [(d+e)]:f, [(g,h)]:i, [j]:k} = {}", "const {a, b:c, [d+e]:f, [(g,h)]:i, [j]:k} = {}", "BinaryExpression", 1),
        invalid("const {[a+(b*c)]:d} = {}", "const {[a+b*c]:d} = {}", "BinaryExpression", 1),
        invalid("const {[(a, (b+c))]:d} = {}", "const {[(a, b+c)]:d} = {}", "BinaryExpression", 1),
        invalid("class foo { [(a)](){} }", "class foo { [a](){} }", "Identifier"),
        invalid("class foo {*[(Symbol.iterator)]() {}}", "class foo {*[Symbol.iterator]() {}}", "MemberExpression"),
        invalid("class foo { get [(a)](){} }", "class foo { get [a](){} }", "Identifier"),
        invalid("class foo { set [(a)](bar){} }", "class foo { set [a](bar){} }", "Identifier"),
        invalid("class foo { static [(a)](bar){} }", "class foo { static [a](bar){} }", "Identifier"),
        invalid("class foo { [(a=b)](){} }", "class foo { [a=b](){} }", "AssignmentExpression"),
        invalid("class foo { constructor (){} [(a+b)](){} }", "class foo { constructor (){} [a+b](){} }", "BinaryExpression"),
        invalid("class foo { [(a+b)](){} constructor (){} }", "class foo { [a+b](){} constructor (){} }", "BinaryExpression"),
        invalid("class foo { [(a+b)](){} c(){} }", "class foo { [a+b](){} c(){} }", "BinaryExpression"),
        invalid("class foo { a(){} [(b+c)](){} d(){} }", "class foo { a(){} [b+c](){} d(){} }", "BinaryExpression"),
        invalid("class foo { [(a+b)](){} [c](){} }", "class foo { [a+b](){} [c](){} }", "BinaryExpression"),
        invalid("class foo { [a](){} [(b+c)](){} [d](){} }", "class foo { [a](){} [b+c](){} [d](){} }", "BinaryExpression"),
        invalid("class foo { [(a+b)](){} [(c,d)](){} }", "class foo { [a+b](){} [(c,d)](){} }", "BinaryExpression"),
        invalid("class foo { [(a,b)](){} [(c+d)](){} }", "class foo { [(a,b)](){} [c+d](){} }", "BinaryExpression"),
        invalid("class foo { [a+(b*c)](){} }", "class foo { [a+b*c](){} }", "BinaryExpression"),
        invalid("const foo = class { [(a)](){} }", "const foo = class { [a](){} }", "Identifier"),
        invalid("class foo { [(x)]; }", "class foo { [x]; }", "Identifier"),
        invalid("class foo { static [(x)]; }", "class foo { static [x]; }", "Identifier"),
        invalid("class foo { [(x)] = 1; }", "class foo { [x] = 1; }", "Identifier"),
        invalid("class foo { static [(x)] = 1; }", "class foo { static [x] = 1; }", "Identifier"),
        invalid("const foo = class { [(x)]; }", "const foo = class { [x]; }", "Identifier"),
        invalid("class foo { [(x = y)]; }", "class foo { [x = y]; }", "AssignmentExpression"),
        invalid("class foo { [(x + y)]; }", "class foo { [x + y]; }", "BinaryExpression"),
        invalid("class foo { [(x ? y : z)]; }", "class foo { [x ? y : z]; }", "ConditionalExpression"),
        invalid("class foo { [((x, y))]; }", "class foo { [(x, y)]; }", "SequenceExpression"),
        invalid("class foo { x = (y); }", "class foo { x = y; }", "Identifier"),
        invalid("class foo { static x = (y); }", "class foo { static x = y; }", "Identifier"),
        invalid("class foo { #x = (y); }", "class foo { #x = y; }", "Identifier"),
        invalid("class foo { static #x = (y); }", "class foo { static #x = y; }", "Identifier"),
        invalid("const foo = class { x = (y); }", "const foo = class { x = y; }", "Identifier"),
        invalid("class foo { x = (() => {}); }", "class foo { x = () => {}; }", "ArrowFunctionExpression"),
        invalid("class foo { x = (y + z); }", "class foo { x = y + z; }", "BinaryExpression"),
        invalid("class foo { x = (y ? z : q); }", "class foo { x = y ? z : q; }", "ConditionalExpression"),
        invalid("class foo { x = ((y, z)); }", "class foo { x = (y, z); }", "SequenceExpression"),

        //
        invalid(
            "var foo = (function*() { if ((yield foo())) { return; } }())",
            "var foo = (function*() { if (yield foo()) { return; } }())",
            "YieldExpression",
            1
        ),
        invalid("f((0))", "f(0)", "Literal"),
        invalid("f(0, (1))", "f(0, 1)", "Literal"),
        invalid("!(0)", "!0", "Literal"),
        invalid("a[(1)]", "a[1]", "Literal"),
        invalid("(a)(b)", "a(b)", "Identifier"),
        invalid("(async)", "async", "Identifier"),
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
        invalid("-((bar+foo))", "-(bar+foo)", "BinaryExpression"),
        invalid("+((bar-foo))", "+(bar-foo)", "BinaryExpression"),
        invalid("++(foo)", "++foo", "Identifier"),
        invalid("--(foo)", "--foo", "Identifier"),
        invalid("++\n(foo)", "++\nfoo", "Identifier"),
        invalid("--\n(foo)", "--\nfoo", "Identifier"),
        invalid("++(\nfoo)", "++\nfoo", "Identifier"),
        invalid("--(\nfoo)", "--\nfoo", "Identifier"),
        invalid("(foo)++", "foo++", "Identifier"),
        invalid("(foo)--", "foo--", "Identifier"),
        invalid("((foo)\n)++", "(foo\n)++", "Identifier"),
        invalid("((foo\n))--", "(foo\n)--", "Identifier"),
        invalid("((foo\n)\n)++", "(foo\n\n)++", "Identifier"),
        invalid("(a\n.b)--", "a\n.b--", "MemberExpression"),
        invalid("(a.\nb)++", "a.\nb++", "MemberExpression"),
        invalid("(a\n[\nb\n])--", "a\n[\nb\n]--", "MemberExpression"),
        invalid("(a || b) ? c : d", "a || b ? c : d", "LogicalExpression"),
        invalid("a ? (b = c) : d", "a ? b = c : d", "AssignmentExpression"),
        invalid("a ? b : (c = d)", "a ? b : c = d", "AssignmentExpression"),
        invalid("(c = d) ? (b) : c", "(c = d) ? b : c", "Identifier", null, { options: ["all", { conditionalAssign: false }] }),
        invalid("(c = d) ? b : (c)", "(c = d) ? b : c", "Identifier", null, { options: ["all", { conditionalAssign: false }] }),
        invalid("f((a = b))", "f(a = b)", "AssignmentExpression"),
        invalid("a, (b = c)", "a, b = c", "AssignmentExpression"),
        invalid("a = (b * c)", "a = b * c", "BinaryExpression"),
        invalid("a + (b * c)", "a + b * c", "BinaryExpression"),
        invalid("(a * b) + c", "a * b + c", "BinaryExpression"),
        invalid("(a * b) / c", "a * b / c", "BinaryExpression"),
        invalid("(2) ** 3 ** 4", "2 ** 3 ** 4", "Literal", null),
        invalid("2 ** (3 ** 4)", "2 ** 3 ** 4", "BinaryExpression", null),
        invalid("(2 ** 3)", "2 ** 3", "BinaryExpression", null),
        invalid("(2 ** 3) + 1", "2 ** 3 + 1", "BinaryExpression", null),
        invalid("1 - (2 ** 3)", "1 - 2 ** 3", "BinaryExpression", null),
        invalid("-((2 ** 3))", "-(2 ** 3)", "BinaryExpression", null),
        invalid("typeof ((a ** b));", "typeof (a ** b);", "BinaryExpression", null),
        invalid("((-2)) ** 3", "(-2) ** 3", "UnaryExpression", null),

        invalid("a = (b * c)", "a = b * c", "BinaryExpression", null, { options: ["all", { nestedBinaryExpressions: false }] }),
        invalid("(b * c)", "b * c", "BinaryExpression", null, { options: ["all", { nestedBinaryExpressions: false }] }),

        invalid("a = (b = c)", "a = b = c", "AssignmentExpression"),
        invalid("(a).b", "a.b", "Identifier"),
        invalid("(0)[a]", "0[a]", "Literal"),
        invalid("(0.0).a", "0.0.a", "Literal"),
        invalid("(123.4).a", "123.4.a", "Literal"),
        invalid("(0.0_0).a", "0.0_0.a", "Literal"),
        invalid("(0xBEEF).a", "0xBEEF.a", "Literal"),
        invalid("(0xBE_EF).a", "0xBE_EF.a", "Literal"),
        invalid("(1e6).a", "1e6.a", "Literal"),
        invalid("(0123).a", "0123.a", "Literal"),
        invalid("(08.1).a", "08.1.a", "Literal"),
        invalid("(09.).a", "09..a", "Literal"),
        invalid("a[(function() {})]", "a[function() {}]", "FunctionExpression"),
        invalid("new (function(){})", "new function(){}", "FunctionExpression"),
        invalid("new (\nfunction(){}\n)", "new \nfunction(){}\n", "FunctionExpression", 1),
        invalid("((function foo() {return 1;}))()", "(function foo() {return 1;})()", "FunctionExpression"),
        invalid("((function(){ return bar(); })())", "(function(){ return bar(); })()", "CallExpression"),
        invalid("(foo()).bar", "foo().bar", "CallExpression"),
        invalid("(foo.bar()).baz", "foo.bar().baz", "CallExpression"),
        invalid("(foo\n.bar())\n.baz", "foo\n.bar()\n.baz", "CallExpression"),
        invalid("(new foo()).bar", "new foo().bar", "NewExpression"),
        invalid("(new foo())[bar]", "new foo()[bar]", "NewExpression"),
        invalid("(new foo()).bar()", "new foo().bar()", "NewExpression"),
        invalid("(new foo(bar)).baz", "new foo(bar).baz", "NewExpression"),
        invalid("(new foo.bar()).baz", "new foo.bar().baz", "NewExpression"),
        invalid("(new foo.bar()).baz()", "new foo.bar().baz()", "NewExpression"),
        invalid("new a[(b()).c]", "new a[b().c]", "CallExpression"),

        invalid("(a)()", "a()", "Identifier"),
        invalid("(a.b)()", "a.b()", "MemberExpression"),
        invalid("(a())()", "a()()", "CallExpression"),
        invalid("(a.b())()", "a.b()()", "CallExpression"),
        invalid("(a().b)()", "a().b()", "MemberExpression"),
        invalid("(a().b.c)()", "a().b.c()", "MemberExpression"),
        invalid("new (A)", "new A", "Identifier"),
        invalid("(new A())()", "new A()()", "NewExpression"),
        invalid("(new A(1))()", "new A(1)()", "NewExpression"),
        invalid("((new A))()", "(new A)()", "NewExpression"),
        invalid("new (foo\n.baz\n.bar\n.foo.baz)", "new foo\n.baz\n.bar\n.foo.baz", "MemberExpression"),
        invalid("new (foo.baz.bar.baz)", "new foo.baz.bar.baz", "MemberExpression"),
        invalid("new ((a.b())).c", "new (a.b()).c", "CallExpression"),
        invalid("new ((a().b)).c", "new (a().b).c", "MemberExpression"),
        invalid("new ((a().b().d))", "new (a().b().d)", "MemberExpression"),
        invalid("new ((a())).b.d", "new (a()).b.d", "CallExpression"),
        invalid("new (a.b).d;", "new a.b.d;", "MemberExpression"),
        invalid("new (new A())();", "new new A()();", "NewExpression"),
        invalid("new (new A());", "new new A();", "NewExpression"),
        invalid("new (new A);", "new new A;", "NewExpression"),
        invalid("new (new a.b);", "new new a.b;", "NewExpression"),
        invalid("(a().b).d;", "a().b.d;", "MemberExpression"),
        invalid("(a.b()).d;", "a.b().d;", "CallExpression"),
        invalid("(a.b).d;", "a.b.d;", "MemberExpression"),

        invalid("0, (_ => 0)", "0, _ => 0", "ArrowFunctionExpression", 1),
        invalid("(_ => 0), 0", "_ => 0, 0", "ArrowFunctionExpression", 1),
        invalid("a = (_ => 0)", "a = _ => 0", "ArrowFunctionExpression", 1),
        invalid("_ => (a = 0)", "_ => a = 0", "AssignmentExpression", 1),
        invalid("x => (({}))", "x => ({})", "ObjectExpression", 1),

        invalid("new (function(){})", "new function(){}", "FunctionExpression", null, { options: ["functions"] }),
        invalid("new (\nfunction(){}\n)", "new \nfunction(){}\n", "FunctionExpression", 1, { options: ["functions"] }),
        invalid("((function foo() {return 1;}))()", "(function foo() {return 1;})()", "FunctionExpression", null, { options: ["functions"] }),
        invalid("a[(function() {})]", "a[function() {}]", "FunctionExpression", null, { options: ["functions"] }),
        invalid("0, (_ => 0)", "0, _ => 0", "ArrowFunctionExpression", 1, { options: ["functions"] }),
        invalid("(_ => 0), 0", "_ => 0, 0", "ArrowFunctionExpression", 1, { options: ["functions"] }),
        invalid("a = (_ => 0)", "a = _ => 0", "ArrowFunctionExpression", 1, { options: ["functions"] }),


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

        invalid("((class{})).foo();", "(class{}).foo();", "ClassExpression", null),
        invalid("((class{}).foo());", "(class{}).foo();", "CallExpression", null),
        invalid("((class{}).foo);", "(class{}).foo;", "MemberExpression", null),
        invalid("0, (class{}).foo();", "0, class{}.foo();", "ClassExpression", null),
        invalid("void (class{}).foo();", "void class{}.foo();", "ClassExpression", null),
        invalid("++(class{}).foo;", "++class{}.foo;", "ClassExpression", null),
        invalid("bar || (class{}).foo();", "bar || class{}.foo();", "ClassExpression", null),
        invalid("1 + (class{}).foo();", "1 + class{}.foo();", "ClassExpression", null),
        invalid("bar ? (class{}).foo() : baz;", "bar ? class{}.foo() : baz;", "ClassExpression", null),
        invalid("bar ? baz : (class{}).foo();", "bar ? baz : class{}.foo();", "ClassExpression", null),
        invalid("bar((class{}).foo(), 0);", "bar(class{}.foo(), 0);", "ClassExpression", null),
        invalid("bar[(class{}).foo()];", "bar[class{}.foo()];", "ClassExpression", null),
        invalid("var bar = (class{}).foo();", "var bar = class{}.foo();", "ClassExpression", null),
        invalid("var foo = ((bar, baz));", "var foo = (bar, baz);", "SequenceExpression", null),

        // https://github.com/eslint/eslint/issues/4608
        invalid("function *a() { yield (b); }", "function *a() { yield b; }", "Identifier", null),
        invalid("function *a() { (yield b), c; }", "function *a() { yield b, c; }", "YieldExpression", null),
        invalid("function *a() { yield ((b, c)); }", "function *a() { yield (b, c); }", "SequenceExpression", null),
        invalid("function *a() { yield (b + c); }", "function *a() { yield b + c; }", "BinaryExpression", null),

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
        invalid([
            "function a() {",
            "    return ((",
            "       <></>",
            "    ));",
            "}"
        ].join("\n"), [
            "function a() {",
            "    return (",
            "       <></>",
            "    );",
            "}"
        ].join("\n"), "JSXFragment", null),
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
        ].join("\n"), "Identifier", null),
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
        ].join("\n"), "Identifier", null),
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
        ].join("\n"), "Identifier", null),

        // returnAssign option
        {
            code: "function a(b) { return (b || c); }",
            output: "function a(b) { return b || c; }",
            options: ["all", { returnAssign: false }],
            errors: [
                {
                    messageId: "unexpected",
                    type: "LogicalExpression"
                }
            ]
        },
        {
            code: "function a(b) { return ((b = c) || (d = e)); }",
            output: "function a(b) { return (b = c) || (d = e); }",
            errors: [
                {
                    messageId: "unexpected",
                    type: "LogicalExpression"
                }
            ]
        },
        {
            code: "function a(b) { return (b = 1); }",
            output: "function a(b) { return b = 1; }",
            errors: [
                {
                    messageId: "unexpected",
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "function a(b) { return c ? (d = b) : (e = b); }",
            output: "function a(b) { return c ? d = b : e = b; }",
            errors: [
                {
                    messageId: "unexpected",
                    type: "AssignmentExpression"
                },
                {
                    messageId: "unexpected",
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "b => (b || c);",
            output: "b => b || c;",
            options: ["all", { returnAssign: false }],

            errors: [
                {
                    messageId: "unexpected",
                    type: "LogicalExpression"
                }
            ]
        },
        {
            code: "b => ((b = c) || (d = e));",
            output: "b => (b = c) || (d = e);",
            errors: [
                {
                    messageId: "unexpected",
                    type: "LogicalExpression"
                }
            ]
        },
        {
            code: "b => (b = 1);",
            output: "b => b = 1;",
            errors: [
                {
                    messageId: "unexpected",
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "b => c ? (d = b) : (e = b);",
            output: "b => c ? d = b : e = b;",
            errors: [
                {
                    messageId: "unexpected",
                    type: "AssignmentExpression"
                },
                {
                    messageId: "unexpected",
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "b => { return (b || c); }",
            output: "b => { return b || c; }",
            options: ["all", { returnAssign: false }],
            errors: [
                {
                    messageId: "unexpected",
                    type: "LogicalExpression"
                }
            ]
        },
        {
            code: "b => { return ((b = c) || (d = e)) };",
            output: "b => { return (b = c) || (d = e) };",
            errors: [
                {
                    messageId: "unexpected",
                    type: "LogicalExpression"
                }
            ]
        },
        {
            code: "b => { return (b = 1) };",
            output: "b => { return b = 1 };",
            errors: [
                {
                    messageId: "unexpected",
                    type: "AssignmentExpression"
                }
            ]
        },
        {
            code: "b => { return c ? (d = b) : (e = b); }",
            output: "b => { return c ? d = b : e = b; }",
            errors: [
                {
                    messageId: "unexpected",
                    type: "AssignmentExpression"
                },
                {
                    messageId: "unexpected",
                    type: "AssignmentExpression"
                }
            ]
        },

        // async/await
        {
            code: "async function a() { (await a) + (await b); }",
            output: "async function a() { await a + await b; }",
            errors: [
                {
                    messageId: "unexpected",
                    type: "AwaitExpression"
                },
                {
                    messageId: "unexpected",
                    type: "AwaitExpression"
                }
            ]
        },
        invalid("async function a() { await (a); }", "async function a() { await a; }", "Identifier", null),
        invalid("async function a() { await (a()); }", "async function a() { await a(); }", "CallExpression", null),
        invalid("async function a() { await (+a); }", "async function a() { await +a; }", "UnaryExpression", null),
        invalid("async function a() { +(await a); }", "async function a() { +await a; }", "AwaitExpression", null),
        invalid("async function a() { await ((a,b)); }", "async function a() { await (a,b); }", "SequenceExpression", null),
        invalid("async function a() { a ** (await b); }", "async function a() { a ** await b; }", "AwaitExpression", null),

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
        invalid([
            "const Component = (",
            "  <></>",
            ");"
        ].join("\n"), "const Component = \n  <></>\n;", "JSXFragment", 1, {
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
            output: "var a = (b) => 1 ? 2 : 3",
            options: ["all", { enforceForArrowConditionals: true }],
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "var a = (b) => ((1 ? 2 : 3))",
            output: "var a = (b) => (1 ? 2 : 3)",
            options: ["all", { enforceForArrowConditionals: true }],
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },

        // ["all", { enforceForSequenceExpressions: true }]
        {
            code: "(a, b)",
            output: "a, b",
            options: ["all"],
            errors: [
                {
                    messageId: "unexpected",
                    type: "SequenceExpression"
                }
            ]
        },
        {
            code: "(a, b)",
            output: "a, b",
            options: ["all", {}],
            errors: [
                {
                    messageId: "unexpected",
                    type: "SequenceExpression"
                }
            ]
        },
        {
            code: "(a, b)",
            output: "a, b",
            options: ["all", { enforceForSequenceExpressions: true }],
            errors: [
                {
                    messageId: "unexpected",
                    type: "SequenceExpression"
                }
            ]
        },
        {
            code: "(foo(), bar());",
            output: "foo(), bar();",
            options: ["all", { enforceForSequenceExpressions: true }],
            errors: [
                {
                    messageId: "unexpected",
                    type: "SequenceExpression"
                }
            ]
        },
        {
            code: "if((a, b)){}",
            output: "if(a, b){}",
            options: ["all", { enforceForSequenceExpressions: true }],
            errors: [
                {
                    messageId: "unexpected",
                    type: "SequenceExpression"
                }
            ]
        },
        {
            code: "while ((val = foo(), val < 10));",
            output: "while (val = foo(), val < 10);",
            options: ["all", { enforceForSequenceExpressions: true }],
            errors: [
                {
                    messageId: "unexpected",
                    type: "SequenceExpression"
                }
            ]
        },

        // ["all", { enforceForNewInMemberExpressions: true }]
        {
            code: "(new foo()).bar",
            output: "new foo().bar",
            options: ["all"],
            errors: [
                {
                    messageId: "unexpected",
                    type: "NewExpression"
                }
            ]
        },
        {
            code: "(new foo()).bar",
            output: "new foo().bar",
            options: ["all", {}],
            errors: [
                {
                    messageId: "unexpected",
                    type: "NewExpression"
                }
            ]
        },
        {
            code: "(new foo()).bar",
            output: "new foo().bar",
            options: ["all", { enforceForNewInMemberExpressions: true }],
            errors: [
                {
                    messageId: "unexpected",
                    type: "NewExpression"
                }
            ]
        },
        {
            code: "(new foo())[bar]",
            output: "new foo()[bar]",
            options: ["all", { enforceForNewInMemberExpressions: true }],
            errors: [
                {
                    messageId: "unexpected",
                    type: "NewExpression"
                }
            ]
        },
        {
            code: "(new foo.bar()).baz",
            output: "new foo.bar().baz",
            options: ["all", { enforceForNewInMemberExpressions: true }],
            errors: [
                {
                    messageId: "unexpected",
                    type: "NewExpression"
                }
            ]
        },

        // enforceForFunctionPrototypeMethods
        {
            code: "var foo = (function(){}).call()",
            output: "var foo = function(){}.call()",
            options: ["all"],
            errors: [
                {
                    messageId: "unexpected",
                    type: "FunctionExpression"
                }
            ]
        },
        {
            code: "var foo = (function(){}.apply())",
            output: "var foo = function(){}.apply()",
            options: ["all"],
            errors: [
                {
                    messageId: "unexpected",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "var foo = (function(){}).apply()",
            output: "var foo = function(){}.apply()",
            options: ["all", {}],
            errors: [
                {
                    messageId: "unexpected",
                    type: "FunctionExpression"
                }
            ]
        },
        {
            code: "var foo = (function(){}.call())",
            output: "var foo = function(){}.call()",
            options: ["all", {}],
            errors: [
                {
                    messageId: "unexpected",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "var foo = (function(){}).call()",
            output: "var foo = function(){}.call()",
            options: ["all", { enforceForFunctionPrototypeMethods: true }],
            errors: [
                {
                    messageId: "unexpected",
                    type: "FunctionExpression"
                }
            ]
        },
        {
            code: "var foo = (function(){}).apply()",
            output: "var foo = function(){}.apply()",
            options: ["all", { enforceForFunctionPrototypeMethods: true }],
            errors: [
                {
                    messageId: "unexpected",
                    type: "FunctionExpression"
                }
            ]
        },
        {
            code: "var foo = (function(){}.call())",
            output: "var foo = function(){}.call()",
            options: ["all", { enforceForFunctionPrototypeMethods: true }],
            errors: [
                {
                    messageId: "unexpected",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "var foo = (function(){}.apply())",
            output: "var foo = function(){}.apply()",
            options: ["all", { enforceForFunctionPrototypeMethods: true }],
            errors: [
                {
                    messageId: "unexpected",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "var foo = (function(){}.call)()", // removing these parens does not cause any conflicts with wrap-iife
            output: "var foo = function(){}.call()",
            options: ["all", { enforceForFunctionPrototypeMethods: false }],
            errors: [
                {
                    messageId: "unexpected",
                    type: "MemberExpression"
                }
            ]
        },
        {
            code: "var foo = (function(){}.apply)()", // removing these parens does not cause any conflicts with wrap-iife
            output: "var foo = function(){}.apply()",
            options: ["all", { enforceForFunctionPrototypeMethods: false }],
            errors: [
                {
                    messageId: "unexpected",
                    type: "MemberExpression"
                }
            ]
        },
        {
            code: "var foo = (function(){}).call",
            output: "var foo = function(){}.call",
            options: ["all", { enforceForFunctionPrototypeMethods: false }],
            errors: [
                {
                    messageId: "unexpected",
                    type: "FunctionExpression"
                }
            ]
        },
        {
            code: "var foo = (function(){}.call)",
            output: "var foo = function(){}.call",
            options: ["all", { enforceForFunctionPrototypeMethods: false }],
            errors: [
                {
                    messageId: "unexpected",
                    type: "MemberExpression"
                }
            ]
        },
        {
            code: "var foo = new (function(){}).call()",
            output: "var foo = new function(){}.call()",
            options: ["all", { enforceForFunctionPrototypeMethods: false }],
            errors: [
                {
                    messageId: "unexpected",
                    type: "FunctionExpression"
                }
            ]
        },
        {
            code: "var foo = (new function(){}.call())",
            output: "var foo = new function(){}.call()",
            options: ["all", { enforceForFunctionPrototypeMethods: false }],
            errors: [
                {
                    messageId: "unexpected",
                    type: "NewExpression"
                }
            ]
        },
        {
            code: "var foo = (function(){})[call]()",
            output: "var foo = function(){}[call]()",
            options: ["all", { enforceForFunctionPrototypeMethods: false }],
            errors: [
                {
                    messageId: "unexpected",
                    type: "FunctionExpression"
                }
            ]
        },
        {
            code: "var foo = (function(){}[apply]())",
            output: "var foo = function(){}[apply]()",
            options: ["all", { enforceForFunctionPrototypeMethods: false }],
            errors: [
                {
                    messageId: "unexpected",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "var foo = (function(){}).bar()",
            output: "var foo = function(){}.bar()",
            options: ["all", { enforceForFunctionPrototypeMethods: false }],
            errors: [
                {
                    messageId: "unexpected",
                    type: "FunctionExpression"
                }
            ]
        },
        {
            code: "var foo = (function(){}.bar())",
            output: "var foo = function(){}.bar()",
            options: ["all", { enforceForFunctionPrototypeMethods: false }],
            errors: [
                {
                    messageId: "unexpected",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "var foo = (function(){}).call.call()",
            output: "var foo = function(){}.call.call()",
            options: ["all", { enforceForFunctionPrototypeMethods: false }],
            errors: [
                {
                    messageId: "unexpected",
                    type: "FunctionExpression"
                }
            ]
        },
        {
            code: "var foo = (function(){}.call.call())",
            output: "var foo = function(){}.call.call()",
            options: ["all", { enforceForFunctionPrototypeMethods: false }],
            errors: [
                {
                    messageId: "unexpected",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "var foo = (call())",
            output: "var foo = call()",
            options: ["all", { enforceForFunctionPrototypeMethods: false }],
            errors: [
                {
                    messageId: "unexpected",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "var foo = (apply())",
            output: "var foo = apply()",
            options: ["all", { enforceForFunctionPrototypeMethods: false }],
            errors: [
                {
                    messageId: "unexpected",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "var foo = (bar).call()",
            output: "var foo = bar.call()",
            options: ["all", { enforceForFunctionPrototypeMethods: false }],
            errors: [
                {
                    messageId: "unexpected",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var foo = (bar.call())",
            output: "var foo = bar.call()",
            options: ["all", { enforceForFunctionPrototypeMethods: false }],
            errors: [
                {
                    messageId: "unexpected",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "((() => {}).call())",
            output: "(() => {}).call()",
            options: ["all", { enforceForFunctionPrototypeMethods: false }],
            errors: [
                {
                    messageId: "unexpected",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "var foo = function(){}.call((a.b))",
            output: "var foo = function(){}.call(a.b)",
            options: ["all", { enforceForFunctionPrototypeMethods: false }],
            errors: [
                {
                    messageId: "unexpected",
                    type: "MemberExpression"
                }
            ]
        },
        {
            code: "var foo = function(){}.call((a).b)",
            output: "var foo = function(){}.call(a.b)",
            options: ["all", { enforceForFunctionPrototypeMethods: false }],
            errors: [
                {
                    messageId: "unexpected",
                    type: "Identifier"
                }
            ]
        },
        {
            code: "var foo = function(){}[('call')]()",
            output: "var foo = function(){}['call']()",
            options: ["all", { enforceForFunctionPrototypeMethods: false }],
            errors: [
                {
                    messageId: "unexpected",
                    type: "Literal"
                }
            ]
        },

        // https://github.com/eslint/eslint/issues/8175
        invalid(
            "let a = [...(b)]",
            "let a = [...b]",
            "Identifier",
            1
        ),
        invalid(
            "let a = {...(b)}",
            "let a = {...b}",
            "Identifier",
            1
        ),
        invalid(
            "let a = {...(b)}",
            "let a = {...b}",
            "Identifier",
            1,
            { parserOptions: { ecmaVersion: 2018 } }
        ),
        invalid(
            "let a = [...((b, c))]",
            "let a = [...(b, c)]",
            "SequenceExpression",
            1
        ),
        invalid(
            "let a = {...((b, c))}",
            "let a = {...(b, c)}",
            "SequenceExpression",
            1
        ),
        invalid(
            "let a = {...((b, c))}",
            "let a = {...(b, c)}",
            "SequenceExpression",
            1,
            { parserOptions: { ecmaVersion: 2018 } }
        ),
        invalid(
            "class A extends (B) {}",
            "class A extends B {}",
            "Identifier",
            1
        ),
        invalid(
            "const A = class extends (B) {}",
            "const A = class extends B {}",
            "Identifier",
            1
        ),
        invalid(
            "class A extends ((B=C)) {}",
            "class A extends (B=C) {}",
            "AssignmentExpression",
            1
        ),
        invalid(
            "const A = class extends ((B=C)) {}",
            "const A = class extends (B=C) {}",
            "AssignmentExpression",
            1
        ),
        invalid(
            "class A extends ((++foo)) {}",
            "class A extends (++foo) {}",
            "UpdateExpression",
            1
        ),
        invalid(
            "export default ((a, b))",
            "export default (a, b)",
            "SequenceExpression",
            1,
            { parserOptions: { sourceType: "module" } }
        ),
        invalid(
            "export default (() => {})",
            "export default () => {}",
            "ArrowFunctionExpression",
            1,
            { parserOptions: { sourceType: "module" } }
        ),
        invalid(
            "export default ((a, b) => a + b)",
            "export default (a, b) => a + b",
            "ArrowFunctionExpression",
            1,
            { parserOptions: { sourceType: "module" } }
        ),
        invalid(
            "export default (a => a)",
            "export default a => a",
            "ArrowFunctionExpression",
            1,
            { parserOptions: { sourceType: "module" } }
        ),
        invalid(
            "export default (a = b)",
            "export default a = b",
            "AssignmentExpression",
            1,
            { parserOptions: { sourceType: "module" } }
        ),
        invalid(
            "export default (a ? b : c)",
            "export default a ? b : c",
            "ConditionalExpression",
            1,
            { parserOptions: { sourceType: "module" } }
        ),
        invalid(
            "export default (a)",
            "export default a",
            "Identifier",
            1,
            { parserOptions: { sourceType: "module" } }
        ),
        invalid(
            "for (foo of(bar));",
            "for (foo of bar);",
            "Identifier",
            1
        ),
        invalid(
            "for ((foo) of bar);",
            "for (foo of bar);",
            "Identifier",
            1
        ),
        invalid(
            "for (foo of (baz = bar));",
            "for (foo of baz = bar);",
            "AssignmentExpression",
            1
        ),
        invalid(
            "function* f() { for (foo of (yield bar)); }",
            "function* f() { for (foo of yield bar); }",
            "YieldExpression",
            1
        ),
        invalid(
            "for (foo of ((bar, baz)));",
            "for (foo of (bar, baz));",
            "SequenceExpression",
            1
        ),
        invalid(
            "for ((foo)in bar);",
            "for (foo in bar);",
            "Identifier",
            1
        ),
        invalid(
            "for ((foo['bar'])of baz);",
            "for (foo['bar']of baz);",
            "MemberExpression",
            1
        ),
        invalid(
            "() => (({ foo: 1 }).foo)",
            "() => ({ foo: 1 }).foo",
            "MemberExpression",
            1
        ),
        invalid(
            "(let).foo",
            "let.foo",
            "Identifier",
            1
        ),

        // ForStatement#init expression cannot start with `let[`, but it can start with `let` if it isn't followed by `[`
        invalid(
            "for ((let);;);",
            "for (let;;);",
            "Identifier",
            1
        ),
        invalid(
            "for ((let = 1);;);",
            "for (let = 1;;);",
            "AssignmentExpression",
            1
        ),
        invalid(
            "for ((let) = 1;;);",
            "for (let = 1;;);",
            "Identifier",
            1
        ),
        invalid(
            "for ((let = []);;);",
            "for (let = [];;);",
            "AssignmentExpression",
            1
        ),
        invalid(
            "for ((let) = [];;);",
            "for (let = [];;);",
            "Identifier",
            1
        ),
        invalid(
            "for ((let());;);",
            "for (let();;);",
            "CallExpression",
            1
        ),
        invalid(
            "for ((let([]));;);",
            "for (let([]);;);",
            "CallExpression",
            1
        ),
        invalid(
            "for ((let())[a];;);",
            "for (let()[a];;);",
            "CallExpression",
            1
        ),
        invalid(
            "for ((let`[]`);;);",
            "for (let`[]`;;);",
            "TaggedTemplateExpression",
            1
        ),
        invalid(
            "for ((let.a);;);",
            "for (let.a;;);",
            "MemberExpression",
            1
        ),
        invalid(
            "for ((let).a;;);",
            "for (let.a;;);",
            "Identifier",
            1
        ),
        invalid(
            "for ((let).a = 1;;);",
            "for (let.a = 1;;);",
            "Identifier",
            1
        ),
        invalid(
            "for ((let).a[b];;);",
            "for (let.a[b];;);",
            "Identifier",
            1
        ),
        invalid(
            "for ((let.a)[b];;);",
            "for (let.a[b];;);",
            "MemberExpression",
            1
        ),
        invalid(
            "for ((let.a[b]);;);",
            "for (let.a[b];;);",
            "MemberExpression",
            1
        ),
        invalid(
            "for ((let);[];);",
            "for (let;[];);",
            "Identifier",
            1
        ),
        invalid(
            "for (((let[a]));;);",
            "for ((let[a]);;);",
            "MemberExpression",
            1
        ),
        invalid(
            "for (((let))[a];;);",
            "for ((let)[a];;);",
            "Identifier",
            1
        ),
        invalid(
            "for (((let[a])).b;;);",
            "for ((let[a]).b;;);",
            "MemberExpression",
            1
        ),
        invalid(
            "for (((let))[a].b;;);",
            "for ((let)[a].b;;);",
            "Identifier",
            1
        ),
        invalid(
            "for (((let)[a]).b;;);",
            "for ((let)[a].b;;);",
            "MemberExpression",
            1
        ),
        invalid(
            "for (((let[a]) = b);;);",
            "for ((let[a]) = b;;);",
            "AssignmentExpression",
            1
        ),
        invalid(
            "for (((let)[a]) = b;;);",
            "for ((let)[a] = b;;);",
            "MemberExpression",
            1
        ),
        invalid(
            "for (((let)[a] = b);;);",
            "for ((let)[a] = b;;);",
            "AssignmentExpression",
            1
        ),
        invalid(
            "for ((Let[a]);;);",
            "for (Let[a];;);",
            "MemberExpression",
            1
        ),
        invalid(
            "for ((lett)[a];;);",
            "for (lett[a];;);",
            "Identifier",
            1
        ),

        // ForInStatement#left expression cannot start with `let[`, but it can start with `let` if it isn't followed by `[`
        invalid(
            "for ((let) in foo);",
            "for (let in foo);",
            "Identifier",
            1
        ),
        invalid(
            "for ((let())[a] in foo);",
            "for (let()[a] in foo);",
            "CallExpression",
            1
        ),
        invalid(
            "for ((let.a) in foo);",
            "for (let.a in foo);",
            "MemberExpression",
            1
        ),
        invalid(
            "for ((let).a in foo);",
            "for (let.a in foo);",
            "Identifier",
            1
        ),
        invalid(
            "for ((let).a.b in foo);",
            "for (let.a.b in foo);",
            "Identifier",
            1
        ),
        invalid(
            "for ((let).a[b] in foo);",
            "for (let.a[b] in foo);",
            "Identifier",
            1
        ),
        invalid(
            "for ((let.a)[b] in foo);",
            "for (let.a[b] in foo);",
            "MemberExpression",
            1
        ),
        invalid(
            "for ((let.a[b]) in foo);",
            "for (let.a[b] in foo);",
            "MemberExpression",
            1
        ),
        invalid(
            "for (((let[a])) in foo);",
            "for ((let[a]) in foo);",
            "MemberExpression",
            1
        ),
        invalid(
            "for (((let))[a] in foo);",
            "for ((let)[a] in foo);",
            "Identifier",
            1
        ),
        invalid(
            "for (((let[a])).b in foo);",
            "for ((let[a]).b in foo);",
            "MemberExpression",
            1
        ),
        invalid(
            "for (((let))[a].b in foo);",
            "for ((let)[a].b in foo);",
            "Identifier",
            1
        ),
        invalid(
            "for (((let)[a]).b in foo);",
            "for ((let)[a].b in foo);",
            "MemberExpression",
            1
        ),
        invalid(
            "for (((let[a]).b) in foo);",
            "for ((let[a]).b in foo);",
            "MemberExpression",
            1
        ),
        invalid(
            "for ((Let[a]) in foo);",
            "for (Let[a] in foo);",
            "MemberExpression",
            1
        ),
        invalid(
            "for ((lett)[a] in foo);",
            "for (lett[a] in foo);",
            "Identifier",
            1
        ),

        // ForOfStatement#left expression cannot start with `let`
        invalid(
            "for (((let)) of foo);",
            "for ((let) of foo);",
            "Identifier",
            1
        ),
        invalid(
            "for (((let)).a of foo);",
            "for ((let).a of foo);",
            "Identifier",
            1
        ),
        invalid(
            "for (((let))[a] of foo);",
            "for ((let)[a] of foo);",
            "Identifier",
            1
        ),
        invalid(
            "for (((let).a) of foo);",
            "for ((let).a of foo);",
            "MemberExpression",
            1
        ),
        invalid(
            "for (((let[a]).b) of foo);",
            "for ((let[a]).b of foo);",
            "MemberExpression",
            1
        ),
        invalid(
            "for (((let).a).b of foo);",
            "for ((let).a.b of foo);",
            "MemberExpression",
            1
        ),
        invalid(
            "for (((let).a.b) of foo);",
            "for ((let).a.b of foo);",
            "MemberExpression",
            1
        ),
        invalid(
            "for (((let.a).b) of foo);",
            "for ((let.a).b of foo);",
            "MemberExpression",
            1
        ),
        invalid(
            "for (((let()).a) of foo);",
            "for ((let()).a of foo);",
            "MemberExpression",
            1
        ),
        invalid(
            "for ((Let) of foo);",
            "for (Let of foo);",
            "Identifier",
            1
        ),
        invalid(
            "for ((lett) of foo);",
            "for (lett of foo);",
            "Identifier",
            1
        ),

        invalid("for (a in (b, c));", "for (a in b, c);", "SequenceExpression", null),
        invalid(
            "(let)",
            "let",
            "Identifier",
            1
        ),
        invalid(
            "((let))",
            "(let)",
            "Identifier",
            1
        ),
        invalid("let s = `${(v)}`", "let s = `${v}`", "Identifier"),
        invalid("let s = `${(a, b)}`", "let s = `${a, b}`", "SequenceExpression"),
        invalid("function foo(a = (b)) {}", "function foo(a = b) {}", "Identifier"),
        invalid("const bar = (a = (b)) => a", "const bar = (a = b) => a", "Identifier"),
        invalid("const [a = (b)] = []", "const [a = b] = []", "Identifier"),
        invalid("const {a = (b)} = {}", "const {a = b} = {}", "Identifier"),

        // LHS of assignments/Assignment targets
        invalid("(a) = b", "a = b", "Identifier"),
        invalid("(a.b) = c", "a.b = c", "MemberExpression"),
        invalid("(a) += b", "a += b", "Identifier"),
        invalid("(a.b) >>= c", "a.b >>= c", "MemberExpression"),
        invalid("[(a) = b] = []", "[a = b] = []", "Identifier"),
        invalid("[(a.b) = c] = []", "[a.b = c] = []", "MemberExpression"),
        invalid("({ a: (b) = c } = {})", "({ a: b = c } = {})", "Identifier"),
        invalid("({ a: (b.c) = d } = {})", "({ a: b.c = d } = {})", "MemberExpression"),
        invalid("[(a)] = []", "[a] = []", "Identifier"),
        invalid("[(a.b)] = []", "[a.b] = []", "MemberExpression"),
        invalid("[,(a),,] = []", "[,a,,] = []", "Identifier"),
        invalid("[...(a)] = []", "[...a] = []", "Identifier"),
        invalid("[...(a.b)] = []", "[...a.b] = []", "MemberExpression"),
        invalid("({ a: (b) } = {})", "({ a: b } = {})", "Identifier"),
        invalid("({ a: (b.c) } = {})", "({ a: b.c } = {})", "MemberExpression"),
        invalid("({ ...(a) } = {})", "({ ...a } = {})", "Identifier"),
        invalid("({ ...(a.b) } = {})", "({ ...a.b } = {})", "MemberExpression"),

        // https://github.com/eslint/eslint/issues/11706 (also in valid[])
        {
            code: "for ((a = (b in c)); ;);",
            output: "for ((a = b in c); ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = ((b in c) && (d in e)); ;);",
            output: "for (let a = (b in c && d in e); ;);",
            errors: Array(2).fill(
                {
                    messageId: "unexpected"
                }
            )
        },
        {
            code: "for (let a = ((b in c) in d); ;);",
            output: "for (let a = (b in c in d); ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = (b && (c in d)), e = (f in g); ;);",
            output: "for (let a = (b && c in d), e = (f in g); ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = (b + c), d = (e in f); ;);",
            output: "for (let a = b + c, d = (e in f); ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = [(b in c)]; ;);",
            output: "for (let a = [b in c]; ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = [b, (c in d)]; ;);",
            output: "for (let a = [b, c in d]; ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = ([b in c]); ;);",
            output: "for (let a = [b in c]; ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = ([b, c in d]); ;);",
            output: "for (let a = [b, c in d]; ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for ((a = [b in c]); ;);",
            output: "for (a = [b in c]; ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = [b && (c in d)]; ;);",
            output: "for (let a = [b && c in d]; ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = [(b && c in d)]; ;);",
            output: "for (let a = [b && c in d]; ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = ([b && c in d]); ;);",
            output: "for (let a = [b && c in d]; ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for ((a = [b && c in d]); ;);",
            output: "for (a = [b && c in d]; ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for ([(a in b)]; ;);",
            output: "for ([a in b]; ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (([a in b]); ;);",
            output: "for ([a in b]; ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = [(b in c)], d = (e in f); ;);",
            output: "for (let a = [b in c], d = (e in f); ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let [a = (b in c)] = []; ;);",
            output: "for (let [a = b in c] = []; ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let [a = b && (c in d)] = []; ;);",
            output: "for (let [a = b && c in d] = []; ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = () => { (b in c) }; ;);",
            output: "for (let a = () => { b in c }; ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = () => { a && (b in c) }; ;);",
            output: "for (let a = () => { a && b in c }; ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = function () { (b in c) }; ;);",
            output: "for (let a = function () { b in c }; ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = { a: (b in c) }; ;);",
            output: "for (let a = { a: b in c }; ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = { a: b && (c in d) }; ;);",
            output: "for (let a = { a: b && c in d }; ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let { a = (b in c) } = {}; ;);",
            output: "for (let { a = b in c } = {}; ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let { a = b && (c in d) } = {}; ;);",
            output: "for (let { a = b && c in d } = {}; ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let { a: { b = c && (d in e) } } = {}; ;);",
            output: "for (let { a: { b = c && d in e } } = {}; ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = `${(a in b)}`; ;);",
            output: "for (let a = `${a in b}`; ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = `${a && (b in c)}`; ;);",
            output: "for (let a = `${a && b in c}`; ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = (b = (c in d)) => {}; ;);",
            output: "for (let a = (b = c in d) => {}; ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = (b = c && (d in e)) => {}; ;);",
            output: "for (let a = (b = c && d in e) => {}; ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = (b, c = d && (e in f)) => {}; ;);",
            output: "for (let a = (b, c = d && e in f) => {}; ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = function (b = c && (d in e)) {}; ;);",
            output: "for (let a = function (b = c && d in e) {}; ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = function (b, c = d && (e in f)) {}; ;);",
            output: "for (let a = function (b, c = d && e in f) {}; ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = b((c in d)); ;);",
            output: "for (let a = b(c in d); ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = b(c, (d in e)); ;);",
            output: "for (let a = b(c, d in e); ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = b(c && (d in e)); ;);",
            output: "for (let a = b(c && d in e); ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = b(c, d && (e in f)); ;);",
            output: "for (let a = b(c, d && e in f); ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = new b((c in d)); ;);",
            output: "for (let a = new b(c in d); ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = new b(c, (d in e)); ;);",
            output: "for (let a = new b(c, d in e); ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = new b(c && (d in e)); ;);",
            output: "for (let a = new b(c && d in e); ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = new b(c, d && (e in f)); ;);",
            output: "for (let a = new b(c, d && e in f); ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = b[(c in d)]; ;);",
            output: "for (let a = b[c in d]; ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = b[c && (d in e)]; ;);",
            output: "for (let a = b[c && d in e]; ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = b ? (c in d) : e; ;);",
            output: "for (let a = b ? c in d : e; ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = b ? c && (d in e) : f; ;);",
            output: "for (let a = b ? c && d in e : f; ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (a ? b && (c in d) : e; ;);",
            output: "for (a ? b && c in d : e; ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = ((b in c)); ;);",
            output: "for (let a = (b in c); ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (((a in b)); ;);",
            output: "for ((a in b); ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (((a && b in c && d)); ;);",
            output: "for ((a && b in c && d); ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = (!(b in c)); ;);",
            output: "for (let a = !(b in c); ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = (!(b && c in d)); ;);",
            output: "for (let a = !(b && c in d); ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = !((b in c) && (d in e)); ;);",
            output: "for (let a = !(b in c && d in e); ;);",
            errors: Array(2).fill(
                {
                    messageId: "unexpected"
                }
            )
        },
        {
            code: "for (let a = (x && (b in c)), d = () => { for ((e in f); ;); for ((g in h); ;); }; ;); for((i in j); ;);",
            output: "for (let a = (x && b in c), d = () => { for ((e in f); ;); for ((g in h); ;); }; ;); for((i in j); ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = (b in c), d = () => { for ((x && (e in f)); ;); for ((g in h); ;); }; ;); for((i in j); ;);",
            output: "for (let a = (b in c), d = () => { for ((x && e in f); ;); for ((g in h); ;); }; ;); for((i in j); ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = (b in c), d = () => { for ((e in f); ;); for ((x && (g in h)); ;); }; ;); for((i in j); ;);",
            output: "for (let a = (b in c), d = () => { for ((e in f); ;); for ((x && g in h); ;); }; ;); for((i in j); ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = (b in c), d = () => { for ((e in f); ;); for ((g in h); ;); }; ;); for((x && (i in j)); ;);",
            output: "for (let a = (b in c), d = () => { for ((e in f); ;); for ((g in h); ;); }; ;); for((x && i in j); ;);",
            errors: [
                {
                    messageId: "unexpected"
                }
            ]
        },
        {
            code: "for (let a = (x && (b in c)), d = () => { for ((e in f); ;); for ((y && (g in h)); ;); }; ;); for((i in j); ;);",
            output: "for (let a = (x && b in c), d = () => { for ((e in f); ;); for ((y && g in h); ;); }; ;); for((i in j); ;);",
            errors: Array(2).fill(
                {
                    messageId: "unexpected"
                }
            )
        },
        {
            code: "for (let a = (x && (b in c)), d = () => { for ((y && (e in f)); ;); for ((z && (g in h)); ;); }; ;); for((w && (i in j)); ;);",
            output: "for (let a = (x && b in c), d = () => { for ((y && e in f); ;); for ((z && g in h); ;); }; ;); for((w && i in j); ;);",
            errors: Array(4).fill(
                {
                    messageId: "unexpected"
                }
            )
        },

        // https://github.com/eslint/eslint/issues/11706 regression tests (also in valid[])
        {
            code: "for (let a = (b); a > (b); a = (b)) a = (b); a = (b);",
            output: "for (let a = b; a > b; a = b) a = b; a = b;",
            errors: Array(5).fill(
                {
                    messageId: "unexpected"
                }
            )
        },
        {
            code: "for ((a = b); (a > b); (a = b)) (a = b); (a = b);",
            output: "for (a = b; a > b; a = b) a = b; a = b;",
            errors: Array(5).fill(
                {
                    messageId: "unexpected"
                }
            )
        },
        {
            code: "for (let a = b; a > (b); a = (b)) a = (b); a = (b);",
            output: "for (let a = b; a > b; a = b) a = b; a = b;",
            errors: Array(4).fill(
                {
                    messageId: "unexpected"
                }
            )
        },
        {
            code: "for (let a = b; (a > b); (a = b)) (a = b); (a = b);",
            output: "for (let a = b; a > b; a = b) a = b; a = b;",
            errors: Array(4).fill(
                {
                    messageId: "unexpected"
                }
            )
        },
        {
            code: "for (; a > (b); a = (b)) a = (b); a = (b);",
            output: "for (; a > b; a = b) a = b; a = b;",
            errors: Array(4).fill(
                {
                    messageId: "unexpected"
                }
            )
        },
        {
            code: "for (; (a > b); (a = b)) (a = b); (a = b);",
            output: "for (; a > b; a = b) a = b; a = b;",
            errors: Array(4).fill(
                {
                    messageId: "unexpected"
                }
            )
        },
        {
            code: "for (let a = (b); a = (b in c); a = (b in c)) a = (b in c); a = (b in c);",
            output: "for (let a = b; a = b in c; a = b in c) a = b in c; a = b in c;",
            errors: Array(5).fill(
                {
                    messageId: "unexpected"
                }
            )
        },
        {
            code: "for (let a = (b); (a in b); (a in b)) (a in b); (a in b);",
            output: "for (let a = b; a in b; a in b) a in b; a in b;",
            errors: Array(5).fill(
                {
                    messageId: "unexpected"
                }
            )
        },
        {
            code: "for (let a = b; a = (b in c); a = (b in c)) a = (b in c); a = (b in c);",
            output: "for (let a = b; a = b in c; a = b in c) a = b in c; a = b in c;",
            errors: Array(4).fill(
                {
                    messageId: "unexpected"
                }
            )
        },
        {
            code: "for (let a = b; (a in b); (a in b)) (a in b); (a in b);",
            output: "for (let a = b; a in b; a in b) a in b; a in b;",
            errors: Array(4).fill(
                {
                    messageId: "unexpected"
                }
            )
        },
        {
            code: "for (; a = (b in c); a = (b in c)) a = (b in c); a = (b in c);",
            output: "for (; a = b in c; a = b in c) a = b in c; a = b in c;",
            errors: Array(4).fill(
                {
                    messageId: "unexpected"
                }
            )
        },
        {
            code: "for (; (a in b); (a in b)) (a in b); (a in b);",
            output: "for (; a in b; a in b) a in b; a in b;",
            errors: Array(4).fill(
                {
                    messageId: "unexpected"
                }
            )
        },
        {
            code: "for (let a = (b + c), d = () => { for ((e + f); ;); for ((g + h); ;); }; ;); for((i + j); ;);",
            output: "for (let a = b + c, d = () => { for (e + f; ;); for (g + h; ;); }; ;); for(i + j; ;);",
            errors: Array(4).fill(
                {
                    messageId: "unexpected"
                }
            )
        },

        // import expressions
        invalid(
            "import((source))",
            "import(source)",
            "Identifier",
            1,
            { parserOptions: { ecmaVersion: 2020 } }
        ),
        invalid(
            "import((source = 'foo.js'))",
            "import(source = 'foo.js')",
            "AssignmentExpression",
            1,
            { parserOptions: { ecmaVersion: 2020 } }
        ),
        invalid(
            "import(((s,t)))",
            "import((s,t))",
            "SequenceExpression",
            1,
            { parserOptions: { ecmaVersion: 2020 } }
        ),

        // https://github.com/eslint/eslint/issues/12127
        {
            code: "[1, ((2, 3))];",
            output: "[1, (2, 3)];",
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "const foo = () => ((bar, baz));",
            output: "const foo = () => (bar, baz);",
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "foo = ((bar, baz));",
            output: "foo = (bar, baz);",
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "foo + ((bar + baz));",
            output: "foo + (bar + baz);",
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "((foo + bar)) + baz;",
            output: "(foo + bar) + baz;",
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "foo * ((bar + baz));",
            output: "foo * (bar + baz);",
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "((foo + bar)) * baz;",
            output: "(foo + bar) * baz;",
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "new A(((foo, bar)))",
            output: "new A((foo, bar))",
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "class A{ [((foo, bar))]() {} }",
            output: "class A{ [(foo, bar)]() {} }",
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "new ((A, B))()",
            output: "new (A, B)()",
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "((foo, bar)) ? bar : baz;",
            output: "(foo, bar) ? bar : baz;",
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "((f ? o : o)) ? bar : baz;",
            output: "(f ? o : o) ? bar : baz;",
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "((f = oo)) ? bar : baz;",
            output: "(f = oo) ? bar : baz;",
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "foo ? ((bar, baz)) : baz;",
            output: "foo ? (bar, baz) : baz;",
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "foo ? bar : ((bar, baz));",
            output: "foo ? bar : (bar, baz);",
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "function foo(bar = ((baz1, baz2))) {}",
            output: "function foo(bar = (baz1, baz2)) {}",
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "var foo = { bar: ((baz1, baz2)) };",
            output: "var foo = { bar: (baz1, baz2) };",
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "var foo = { [((bar1, bar2))]: baz };",
            output: "var foo = { [(bar1, bar2)]: baz };",
            errors: [{ messageId: "unexpected" }]
        },

        // adjacent tokens tests for division operator, comments and regular expressions
        invalid("a+/**/(/**/b)", "a+/**//**/b", "Identifier"),
        invalid("a+/**/(//\nb)", "a+/**///\nb", "Identifier"),
        invalid("a in(/**/b)", "a in/**/b", "Identifier"),
        invalid("a in(//\nb)", "a in//\nb", "Identifier"),
        invalid("a+(/**/b)", "a+/**/b", "Identifier"),
        invalid("a+/**/(b)", "a+/**/b", "Identifier"),
        invalid("a+(//\nb)", "a+//\nb", "Identifier"),
        invalid("a+//\n(b)", "a+//\nb", "Identifier"),
        invalid("a+(/^b$/)", "a+/^b$/", "Literal"),
        invalid("a/(/**/b)", "a/ /**/b", "Identifier"),
        invalid("a/(//\nb)", "a/ //\nb", "Identifier"),
        invalid("a/(/^b$/)", "a/ /^b$/", "Literal"),


        // Nullish coalescing
        {
            code: "var v = ((a ?? b)) || c",
            output: "var v = (a ?? b) || c",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "var v = a ?? ((b || c))",
            output: "var v = a ?? (b || c)",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "var v = ((a ?? b)) && c",
            output: "var v = (a ?? b) && c",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "var v = a ?? ((b && c))",
            output: "var v = a ?? (b && c)",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "var v = ((a || b)) ?? c",
            output: "var v = (a || b) ?? c",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "var v = a || ((b ?? c))",
            output: "var v = a || (b ?? c)",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "var v = ((a && b)) ?? c",
            output: "var v = (a && b) ?? c",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "var v = a && ((b ?? c))",
            output: "var v = a && (b ?? c)",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "var v = (a ?? b) ? b : c",
            output: "var v = a ?? b ? b : c",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "var v = (a | b) ?? c | d",
            output: "var v = a | b ?? c | d",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "var v = a | b ?? (c | d)",
            output: "var v = a | b ?? c | d",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpected" }]
        },

        // Optional chaining
        {
            code: "var v = (obj?.aaa)?.aaa",
            output: "var v = obj?.aaa?.aaa",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "var v = (obj.aaa)?.aaa",
            output: "var v = obj.aaa?.aaa",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "var foo = (function(){})?.call()",
            output: "var foo = function(){}?.call()",
            options: ["all", { enforceForFunctionPrototypeMethods: true }],
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "var foo = (function(){}?.call())",
            output: "var foo = function(){}?.call()",
            options: ["all", { enforceForFunctionPrototypeMethods: true }],
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "unexpected" }]
        }
    ]
});
