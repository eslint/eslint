/**
 * @fileoverview Tests for no-constant-condition rule.
 * @author Christian Schulz <http://rndm.de>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-constant-condition"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2021 } });

ruleTester.run("no-constant-condition", rule, {
    valid: [
        "if(a);",
        "if(a == 0);",
        "if(a = f());",
        "if(a += 1);",
        "if(a |= 1);",
        "if(a |= true);",
        "if(a |= false);",
        "if(a &= 1);",
        "if(a &= true);",
        "if(a &= false);",
        "if(a >>= 1);",
        "if(a >>= true);",
        "if(a >>= false);",
        "if(a >>>= 1);",
        "if(a ??= 1);",
        "if(a ??= true);",
        "if(a ??= false);",
        "if(a ||= b);",
        "if(a ||= false);",
        "if(a ||= 0);",
        "if(a ||= void 0);",
        "if(+(a ||= 1));",
        "if(f(a ||= true));",
        "if((a ||= 1) + 2);",
        "if(1 + (a ||= true));",
        "if(a ||= '' || false);",
        "if(a ||= void 0 || null);",
        "if((a ||= false) || b);",
        "if(a || (b ||= false));",
        "if((a ||= true) && b);",
        "if(a && (b ||= true));",
        "if(a &&= b);",
        "if(a &&= true);",
        "if(a &&= 1);",
        "if(a &&= 'foo');",
        "if((a &&= '') + false);",
        "if('' + (a &&= null));",
        "if(a &&= 1 && 2);",
        "if((a &&= true) && b);",
        "if(a && (b &&= true));",
        "if((a &&= false) || b);",
        "if(a || (b &&= false));",
        "if(a ||= b ||= false);",
        "if(a &&= b &&= true);",
        "if(a ||= b &&= false);",
        "if(a ||= b &&= true);",
        "if(a &&= b ||= false);",
        "if(a &&= b ||= true);",
        "if(1, a);",
        "if ('every' in []);",
        "if (`\\\n${a}`) {}",
        "if (`${a}`);",
        "if (`${foo()}`);",
        "if (`${a === 'b' && b==='a'}`);",
        "if (`foo${a}` === 'fooa');",
        "if (tag`a`);",
        "if (tag`${a}`);",
        "if (+(a || true));",
        "if (-(a || true));",
        "if (~(a || 1));",
        "if (+(a && 0) === +(b && 0));",
        "while(~!a);",
        "while(a = b);",
        "while(`${a}`);",
        "for(;x < 10;);",
        "for(;;);",
        "for(;`${a}`;);",
        "do{ }while(x)",
        "q > 0 ? 1 : 2;",
        "`${a}` === a ? 1 : 2",
        "`foo${a}` === a ? 1 : 2",
        "tag`a` === a ? 1 : 2",
        "tag`${a}` === a ? 1 : 2",
        "while(x += 3) {}",
        "while(tag`a`) {}",
        "while(tag`${a}`) {}",
        "while(`\\\n${a}`) {}",

        // #5228, typeof conditions
        "if(typeof x === 'undefined'){}",
        "if(`${typeof x}` === 'undefined'){}",
        "if(a === 'str' && typeof b){}",
        "typeof a == typeof b",
        "typeof 'a' === 'string'|| typeof b === 'string'",
        "`${typeof 'a'}` === 'string'|| `${typeof b}` === 'string'",

        // #5726, void conditions
        "if (void a || a);",
        "if (a || void a);",

        // #5693
        "if(xyz === 'str1' && abc==='str2'){}",
        "if(xyz === 'str1' || abc==='str2'){}",
        "if(xyz === 'str1' || abc==='str2' && pqr === 5){}",
        "if(typeof abc === 'string' && abc==='str2'){}",
        "if(false || abc==='str'){}",
        "if(true && abc==='str'){}",
        "if(typeof 'str' && abc==='str'){}",
        "if(abc==='str' || false || def ==='str'){}",
        "if(true && abc==='str' || def ==='str'){}",
        "if(true && typeof abc==='string'){}",

        // #11181, string literals
        "if('str1' && a){}",
        "if(a && 'str'){}",

        // #11306
        "if ((foo || true) === 'baz') {}",
        "if ((foo || 'bar') === 'baz') {}",
        "if ((foo || 'bar') !== 'baz') {}",
        "if ((foo || 'bar') == 'baz') {}",
        "if ((foo || 'bar') != 'baz') {}",
        "if ((foo || 233) > 666) {}",
        "if ((foo || 233) < 666) {}",
        "if ((foo || 233) >= 666) {}",
        "if ((foo || 233) <= 666) {}",
        "if ((key || 'k') in obj) {}",
        "if ((foo || {}) instanceof obj) {}",
        "if ((foo || 'bar' || 'bar') === 'bar');",
        {
            code: "if ((foo || 1n) === 'baz') {}",
            parserOptions: { ecmaVersion: 11 }
        },
        {
            code: "if (a && 0n || b);",
            parserOptions: { ecmaVersion: 11 }
        },
        {
            code: "if(1n && a){};",
            parserOptions: { ecmaVersion: 11 }
        },

        // #12225
        "if ('' + [y] === '' + [ty]) {}",
        "if ('a' === '' + [ty]) {}",
        "if ('' + [y, m, d] === 'a') {}",
        "if ('' + [y, 'm'] === '' + [ty, 'tm']) {}",
        "if ('' + [y, 'm'] === '' + ['ty']) {}",
        "if ([,] in\n\n($2))\n ;\nelse\n ;",
        "if ([...x]+'' === 'y'){}",

        // { checkLoops: false }
        { code: "while(true);", options: [{ checkLoops: false }] },
        { code: "for(;true;);", options: [{ checkLoops: false }] },
        { code: "do{}while(true)", options: [{ checkLoops: false }] },

        "function* foo(){while(true){yield 'foo';}}",
        "function* foo(){for(;true;){yield 'foo';}}",
        "function* foo(){do{yield 'foo';}while(true)}",
        "function* foo(){while (true) { while(true) {yield;}}}",
        "function* foo() {for (; yield; ) {}}",
        "function* foo() {for (; ; yield) {}}",
        "function* foo() {while (true) {function* foo() {yield;}yield;}}",
        "function* foo() { for (let x = yield; x < 10; x++) {yield;}yield;}",
        "function* foo() { for (let x = yield; ; x++) { yield; }}",
        "if (new Number(x) + 1 === 2) {}",

        // #15467
        "if([a]==[b]) {}",
        "if (+[...a]) {}",
        "if (+[...[...a]]) {}",
        "if (`${[...a]}`) {}",
        "if (`${[a]}`) {}",
        "if (+[a]) {}",
        "if (0 - [a]) {}",
        "if (1 * [a]) {}",

        // Boolean function
        "if (Boolean(a)) {}",
        "if (Boolean(...args)) {}",
        "if (foo.Boolean(1)) {}",
        "function foo(Boolean) { if (Boolean(1)) {} }",
        "const Boolean = () => {}; if (Boolean(1)) {}",
        { code: "if (Boolean()) {}", globals: { Boolean: "off" } },
        "const undefined = 'lol'; if (undefined) {}",
        { code: "if (undefined) {}", globals: { undefined: "off" } }
    ],
    invalid: [
        { code: "for(;true;);", errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "for(;``;);", errors: [{ messageId: "unexpected", type: "TemplateLiteral" }] },
        { code: "for(;`foo`;);", errors: [{ messageId: "unexpected", type: "TemplateLiteral" }] },
        { code: "for(;`foo${bar}`;);", errors: [{ messageId: "unexpected", type: "TemplateLiteral" }] },
        { code: "do{}while(true)", errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "do{}while('1')", errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "do{}while(0)", errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "do{}while(t = -2)", errors: [{ messageId: "unexpected", type: "AssignmentExpression" }] },
        { code: "do{}while(``)", errors: [{ messageId: "unexpected", type: "TemplateLiteral" }] },
        { code: "do{}while(`foo`)", errors: [{ messageId: "unexpected", type: "TemplateLiteral" }] },
        { code: "do{}while(`foo${bar}`)", errors: [{ messageId: "unexpected", type: "TemplateLiteral" }] },
        { code: "true ? 1 : 2;", errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "1 ? 1 : 2;", errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "q = 0 ? 1 : 2;", errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "(q = 0) ? 1 : 2;", errors: [{ messageId: "unexpected", type: "AssignmentExpression" }] },
        { code: "`` ? 1 : 2;", errors: [{ messageId: "unexpected", type: "TemplateLiteral" }] },
        { code: "`foo` ? 1 : 2;", errors: [{ messageId: "unexpected", type: "TemplateLiteral" }] },
        { code: "`foo${bar}` ? 1 : 2;", errors: [{ messageId: "unexpected", type: "TemplateLiteral" }] },
        { code: "if(-2);", errors: [{ messageId: "unexpected", type: "UnaryExpression" }] },
        { code: "if(true);", errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "if(1);", errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "if({});", errors: [{ messageId: "unexpected", type: "ObjectExpression" }] },
        { code: "if(0 < 1);", errors: [{ messageId: "unexpected", type: "BinaryExpression" }] },
        { code: "if(0 || 1);", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },
        { code: "if(a, 1);", errors: [{ messageId: "unexpected", type: "SequenceExpression" }] },
        { code: "if(`foo`);", errors: [{ messageId: "unexpected", type: "TemplateLiteral" }] },
        { code: "if(``);", errors: [{ messageId: "unexpected", type: "TemplateLiteral" }] },
        { code: "if(`\\\n`);", errors: [{ messageId: "unexpected", type: "TemplateLiteral" }] },
        { code: "if(`${'bar'}`);", errors: [{ messageId: "unexpected", type: "TemplateLiteral" }] },
        { code: "if(`${'bar' + `foo`}`);", errors: [{ messageId: "unexpected", type: "TemplateLiteral" }] },
        { code: "if(`foo${false || true}`);", errors: [{ messageId: "unexpected", type: "TemplateLiteral" }] },
        { code: "if(`foo${0 || 1}`);", errors: [{ messageId: "unexpected", type: "TemplateLiteral" }] },
        { code: "if(`foo${bar}`);", errors: [{ messageId: "unexpected", type: "TemplateLiteral" }] },
        { code: "if(`${bar}foo`);", errors: [{ messageId: "unexpected", type: "TemplateLiteral" }] },
        { code: "if(!(true || a));", errors: [{ messageId: "unexpected", type: "UnaryExpression" }] },
        { code: "if(!(a && void b && c));", errors: [{ messageId: "unexpected", type: "UnaryExpression" }] },
        { code: "if(0 || !(a && null));", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },
        { code: "if(1 + !(a || true));", errors: [{ messageId: "unexpected", type: "BinaryExpression" }] },
        { code: "if(!(null && a) > 1);", errors: [{ messageId: "unexpected", type: "BinaryExpression" }] },
        { code: "if(+(!(a && 0)));", errors: [{ messageId: "unexpected", type: "UnaryExpression" }] },
        { code: "if(!typeof a === 'string');", errors: [{ messageId: "unexpected", type: "BinaryExpression" }] },
        { code: "if(-('foo' || a));", errors: [{ messageId: "unexpected", type: "UnaryExpression" }] },
        { code: "if(+(void a && b) === ~(1 || c));", errors: [{ messageId: "unexpected", type: "BinaryExpression" }] },
        { code: "if(a ||= true);", errors: [{ messageId: "unexpected", type: "AssignmentExpression" }] },
        { code: "if(a ||= 5);", errors: [{ messageId: "unexpected", type: "AssignmentExpression" }] },
        { code: "if(a ||= 'foo' || b);", errors: [{ messageId: "unexpected", type: "AssignmentExpression" }] },
        { code: "if(a ||= b || /regex/);", errors: [{ messageId: "unexpected", type: "AssignmentExpression" }] },
        { code: "if(a ||= b ||= true);", errors: [{ messageId: "unexpected", type: "AssignmentExpression" }] },
        { code: "if(a ||= b ||= c || 1);", errors: [{ messageId: "unexpected", type: "AssignmentExpression" }] },
        { code: "if(!(a ||= true));", errors: [{ messageId: "unexpected", type: "UnaryExpression" }] },
        { code: "if(!(a ||= 'foo') === true);", errors: [{ messageId: "unexpected", type: "BinaryExpression" }] },
        { code: "if(!(a ||= 'foo') === false);", errors: [{ messageId: "unexpected", type: "BinaryExpression" }] },
        { code: "if(a || (b ||= true));", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },
        { code: "if((a ||= 1) || b);", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },
        { code: "if((a ||= true) && true);", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },
        { code: "if(true && (a ||= true));", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },
        { code: "if(a &&= false);", errors: [{ messageId: "unexpected", type: "AssignmentExpression" }] },
        { code: "if(a &&= null);", errors: [{ messageId: "unexpected", type: "AssignmentExpression" }] },
        { code: "if(a &&= void b);", errors: [{ messageId: "unexpected", type: "AssignmentExpression" }] },
        { code: "if(a &&= 0 && b);", errors: [{ messageId: "unexpected", type: "AssignmentExpression" }] },
        { code: "if(a &&= b && '');", errors: [{ messageId: "unexpected", type: "AssignmentExpression" }] },
        { code: "if(a &&= b &&= false);", errors: [{ messageId: "unexpected", type: "AssignmentExpression" }] },
        { code: "if(a &&= b &&= c && false);", errors: [{ messageId: "unexpected", type: "AssignmentExpression" }] },
        { code: "if(!(a &&= false));", errors: [{ messageId: "unexpected", type: "UnaryExpression" }] },
        { code: "if(!(a &&= 0) + 1);", errors: [{ messageId: "unexpected", type: "BinaryExpression" }] },
        { code: "if(a && (b &&= false));", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },
        { code: "if((a &&= null) && b);", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },
        { code: "if(false || (a &&= false));", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },
        { code: "if((a &&= false) || false);", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },

        { code: "while([]);", errors: [{ messageId: "unexpected", type: "ArrayExpression" }] },
        { code: "while(~!0);", errors: [{ messageId: "unexpected", type: "UnaryExpression" }] },
        { code: "while(x = 1);", errors: [{ messageId: "unexpected", type: "AssignmentExpression" }] },
        { code: "while(function(){});", errors: [{ messageId: "unexpected", type: "FunctionExpression" }] },
        { code: "while(true);", errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "while(1);", errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "while(() => {});", errors: [{ messageId: "unexpected", type: "ArrowFunctionExpression" }] },
        { code: "while(`foo`);", errors: [{ messageId: "unexpected", type: "TemplateLiteral" }] },
        { code: "while(``);", errors: [{ messageId: "unexpected", type: "TemplateLiteral" }] },
        { code: "while(`${'foo'}`);", errors: [{ messageId: "unexpected", type: "TemplateLiteral" }] },
        { code: "while(`${'foo' + 'bar'}`);", errors: [{ messageId: "unexpected", type: "TemplateLiteral" }] },

        // #5228 , typeof conditions
        { code: "if(typeof x){}", errors: [{ messageId: "unexpected", type: "UnaryExpression" }] },
        { code: "if(typeof 'abc' === 'string'){}", errors: [{ messageId: "unexpected", type: "BinaryExpression" }] },
        { code: "if(a = typeof b){}", errors: [{ messageId: "unexpected", type: "AssignmentExpression" }] },
        { code: "if(a, typeof b){}", errors: [{ messageId: "unexpected", type: "SequenceExpression" }] },
        { code: "if(typeof 'a' == 'string' || typeof 'b' == 'string'){}", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },
        { code: "while(typeof x){}", errors: [{ messageId: "unexpected", type: "UnaryExpression" }] },

        // #5726, void conditions
        { code: "if(1 || void x);", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },
        { code: "if(void x);", errors: [{ messageId: "unexpected", type: "UnaryExpression" }] },
        { code: "if(y = void x);", errors: [{ messageId: "unexpected", type: "AssignmentExpression" }] },
        { code: "if(x, void x);", errors: [{ messageId: "unexpected", type: "SequenceExpression" }] },
        { code: "if(void x === void y);", errors: [{ messageId: "unexpected", type: "BinaryExpression" }] },
        { code: "if(void x && a);", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },
        { code: "if(a && void x);", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },

        // #5693
        { code: "if(false && abc==='str'){}", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },
        { code: "if(true || abc==='str'){}", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },
        { code: "if(1 || abc==='str'){}", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },
        { code: "if(abc==='str' || true){}", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },
        { code: "if(abc==='str' || true || def ==='str'){}", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },
        { code: "if(false || true){}", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },
        { code: "if(typeof abc==='str' || true){}", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },

        // #11181, string literals
        { code: "if('str' || a){}", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },
        { code: "if('str' || abc==='str'){}", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },
        { code: "if('str1' || 'str2'){}", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },
        { code: "if('str1' && 'str2'){}", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },
        { code: "if(abc==='str' || 'str'){}", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },
        { code: "if(a || 'str'){}", errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },

        {
            code: "function* foo(){while(true){} yield 'foo';}",
            errors: [{ messageId: "unexpected", type: "Literal" }]
        },
        {
            code: "function* foo(){while(true){if (true) {yield 'foo';}}}",
            errors: [{ messageId: "unexpected", type: "Literal" }]
        },
        {
            code: "function* foo(){while(true){yield 'foo';} while(true) {}}",
            errors: [{ messageId: "unexpected", type: "Literal" }]
        },
        {
            code: "var a = function* foo(){while(true){} yield 'foo';}",
            errors: [{ messageId: "unexpected", type: "Literal" }]
        },
        {
            code: "while (true) { function* foo() {yield;}}",
            errors: [{ messageId: "unexpected", type: "Literal" }]
        },
        {
            code: "function* foo(){if (true) {yield 'foo';}}",
            errors: [{ messageId: "unexpected", type: "Literal" }]
        },
        {
            code: "function* foo() {for (let foo = yield; true;) {}}",
            errors: [{ messageId: "unexpected", type: "Literal" }]
        },
        {
            code: "function* foo() {for (foo = yield; true;) {}}",
            errors: [{ messageId: "unexpected", type: "Literal" }]
        },
        {
            code: "function foo() {while (true) {function* bar() {while (true) {yield;}}}}",
            errors: [{ messageId: "unexpected", type: "Literal" }]
        },
        {
            code: "function foo() {while (true) {const bar = function*() {while (true) {yield;}}}}",
            errors: [{ messageId: "unexpected", type: "Literal" }]
        },
        {
            code: "function* foo() { for (let foo = 1 + 2 + 3 + (yield); true; baz) {}}",
            errors: [{ messageId: "unexpected", type: "Literal" }]
        },

        // #12225
        {
            code: "if([a]) {}",
            errors: [{ messageId: "unexpected", type: "ArrayExpression" }]
        },
        {
            code: "if([]) {}",
            errors: [{ messageId: "unexpected", type: "ArrayExpression" }]
        },
        {
            code: "if(''+['a']) {}",
            errors: [{ messageId: "unexpected", type: "BinaryExpression" }]
        },
        {
            code: "if(''+[]) {}",
            errors: [{ messageId: "unexpected", type: "BinaryExpression" }]
        },
        {
            code: "if(+1) {}",
            errors: [{ messageId: "unexpected", type: "UnaryExpression" }]
        },
        {
            code: "if ([,] + ''){}",
            errors: [{ messageId: "unexpected", type: "BinaryExpression" }]
        },

        // #13238
        { code: "if(/foo/ui);", parserOptions: { ecmaVersion: 11 }, errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "if(0n);", parserOptions: { ecmaVersion: 11 }, errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "if(0b0n);", parserOptions: { ecmaVersion: 11 }, errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "if(0o0n);", parserOptions: { ecmaVersion: 11 }, errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "if(0x0n);", parserOptions: { ecmaVersion: 11 }, errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "if(0b1n);", parserOptions: { ecmaVersion: 11 }, errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "if(0o1n);", parserOptions: { ecmaVersion: 11 }, errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "if(0x1n);", parserOptions: { ecmaVersion: 11 }, errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "if(0x1n || foo);", parserOptions: { ecmaVersion: 11 }, errors: [{ messageId: "unexpected", type: "LogicalExpression" }] },

        // Classes and instances are always truthy
        { code: "if(class {}) {}", errors: [{ messageId: "unexpected" }] },
        { code: "if(new Foo()) {}", errors: [{ messageId: "unexpected" }] },

        // Boxed primitives are always truthy
        { code: "if(new Boolean(foo)) {}", errors: [{ messageId: "unexpected" }] },
        { code: "if(new String(foo)) {}", errors: [{ messageId: "unexpected" }] },
        { code: "if(new Number(foo)) {}", errors: [{ messageId: "unexpected" }] },

        // Spreading a constant array
        { code: "if(`${[...['a']]}`) {}", errors: [{ messageId: "unexpected" }] },

        /*
         * undefined is always falsy (except in old browsers that let you
         * re-assign, but that's an abscure enough edge case to not worry about)
         */
        { code: "if (undefined) {}", errors: [{ messageId: "unexpected" }] },

        // Coercion to boolean via Boolean function
        { code: "if (Boolean(1)) {}", errors: [{ messageId: "unexpected" }] },
        { code: "if (Boolean()) {}", errors: [{ messageId: "unexpected" }] },
        { code: "if (Boolean([a])) {}", errors: [{ messageId: "unexpected" }] },
        { code: "if (Boolean(1)) { function Boolean() {}}", errors: [{ messageId: "unexpected" }] }
    ]
});
