/**
 * @fileoverview Tests for no-constant-binary-expression rule.
 * @author Jordan Eldredge <https://jordaneldredge.com>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-constant-binary-expression");
const { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2021, ecmaFeatures: { jsx: true } } });

ruleTester.run("no-constant-binary-expression", rule, {
    valid: [

        // While this _would_ be a constant condition in React, ESLint has a polciy of not attributing any specific behavior to JSX.
        "<p /> && foo",
        "<></> && foo",
        "<p /> ?? foo",
        "<></> ?? foo",
        "arbitraryFunction(n) ?? foo",
        "foo.Boolean(n) ?? foo",
        "(x += 1) && foo",
        "`${bar}` && foo",
        "bar && foo",
        "delete bar.baz && foo",
        "true ? foo : bar", // We leave ConditionalExpression for `no-constant-condition`.
        "new Foo() == true",
        "foo == true",
        "`${foo}` == true",
        "`${foo}${bar}` == true",
        "`0${foo}` == true",
        "`00000000${foo}` == true",
        "`0${foo}.000` == true",
        "[n] == true",

        "delete bar.baz === true",

        "foo.Boolean(true) && foo",
        "function Boolean(n) { return n; }; Boolean(x) ?? foo",
        "function String(n) { return n; }; String(x) ?? foo",
        "function Number(n) { return n; }; Number(x) ?? foo",
        "function Boolean(n) { return Math.random(); }; Boolean(x) === 1",
        "function Boolean(n) { return Math.random(); }; Boolean(1) == true",

        "new Foo() === x",
        "x === new someObj.Promise()",
        "Boolean(foo) === true",
        "function foo(undefined) { undefined ?? bar;}",
        "function foo(undefined) { undefined == true;}",
        "function foo(undefined) { undefined === true;}",
        "[...arr, 1] == true",
        "[,,,] == true",
        { code: "new Foo() === bar;", globals: { Foo: "writable" } }
    ],
    invalid: [

        // Error messages
        { code: "[] && greeting", errors: [{ message: "Unexpected constant truthiness on the left-hand side of a `&&` expression." }] },
        { code: "[] || greeting", errors: [{ message: "Unexpected constant truthiness on the left-hand side of a `||` expression." }] },
        { code: "[] ?? greeting", errors: [{ message: "Unexpected constant nullishness on the left-hand side of a `??` expression." }] },
        { code: "[] == true", errors: [{ message: "Unexpected constant binary expression. Compares constantly with the right-hand side of the `==`." }] },
        { code: "true == []", errors: [{ message: "Unexpected constant binary expression. Compares constantly with the left-hand side of the `==`." }] },
        { code: "[] != true", errors: [{ message: "Unexpected constant binary expression. Compares constantly with the right-hand side of the `!=`." }] },
        { code: "[] === true", errors: [{ message: "Unexpected constant binary expression. Compares constantly with the right-hand side of the `===`." }] },
        { code: "[] !== true", errors: [{ message: "Unexpected constant binary expression. Compares constantly with the right-hand side of the `!==`." }] },

        // Motivating examples from the original proposal https://github.com/eslint/eslint/issues/13752
        { code: "!foo == null", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "!foo ?? bar", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "(a + b) / 2 ?? bar", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "String(foo.bar) ?? baz", errors: [{ messageId: "constantShortCircuit" }] },
        { code: '"hello" + name ?? ""', errors: [{ messageId: "constantShortCircuit" }] },
        { code: '[foo?.bar ?? ""] ?? []', errors: [{ messageId: "constantShortCircuit" }] },

        // Logical expression with constant truthiness
        { code: "true && hello", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "true || hello", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "true && foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "'' && foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "100 && foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "+100 && foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "-100 && foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "~100 && foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "/[a-z]/ && foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "Boolean([]) && foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "Boolean() && foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "Boolean([], n) && foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "({}) && foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "[] && foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "(() => {}) && foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "(function() {}) && foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "(class {}) && foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "(class { valueOf() { return x; } }) && foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "(class { [x]() { return x; } }) && foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "new Foo() && foo", errors: [{ messageId: "constantShortCircuit" }] },

        // (boxed values are always truthy)
        { code: "new Boolean(unknown) && foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "(bar = false) && foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "(bar.baz = false) && foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "(bar[0] = false) && foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "`hello ${hello}` && foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "void bar && foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "!true && foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "typeof bar && foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "(bar, baz, true) && foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "undefined && foo", errors: [{ messageId: "constantShortCircuit" }] },

        // Logical expression with constant nullishness
        { code: "({}) ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "([]) ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "(() => {}) ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "(function() {}) ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "(class {}) ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "new Foo() ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "1 ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "/[a-z]/ ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "`${''}` ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "(a = true) ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "(a += 1) ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "(a -= 1) ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "(a *= 1) ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "(a /= 1) ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "(a %= 1) ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "(a <<= 1) ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "(a >>= 1) ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "(a >>>= 1) ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "(a |= 1) ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "(a ^= 1) ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "(a &= 1) ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "undefined ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "!bar ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "void bar ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "typeof bar ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "+bar ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "-bar ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "~bar ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "++bar ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "bar++ ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "--bar ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "bar-- ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "(x == y) ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "(x + y) ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "(x / y) ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "(x instanceof String) ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "(x in y) ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "Boolean(x) ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "String(x) ?? foo", errors: [{ messageId: "constantShortCircuit" }] },
        { code: "Number(x) ?? foo", errors: [{ messageId: "constantShortCircuit" }] },

        // Binary expression with comparison to null
        { code: "({}) != null", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "({}) == null", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "null == ({})", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "({}) == undefined", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "undefined == ({})", errors: [{ messageId: "constantBinaryOperand" }] },

        // Binary expression with loose comparison to boolean
        { code: "({}) != true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "({}) == true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "([]) == true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "([a, b]) == true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "(() => {}) == true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "(function() {}) == true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "void foo == true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "typeof foo == true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "![] == true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "true == class {}", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "true == 1", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "undefined == true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "true == undefined", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "`hello` == true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "/[a-z]/ == true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "({}) == Boolean({})", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "({}) == Boolean()", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "({}) == Boolean(() => {}, foo)", errors: [{ messageId: "constantBinaryOperand" }] },

        // Binary expression with strict comparison to boolean
        { code: "({}) !== true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "({}) == !({})", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "({}) === true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "([]) === true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "(function() {}) === true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "(() => {}) === true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "!{} === true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "typeof n === true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "void n === true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "+n === true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "-n === true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "~n === true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "true === true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "1 === true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "'hello' === true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "/[a-z]/ === true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "undefined === true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "(a = {}) === true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "(a += 1) === true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "(a -= 1) === true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "(a *= 1) === true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "(a %= 1) === true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "(a ** b) === true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "(a << b) === true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "(a >> b) === true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "(a >>> b) === true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "--a === true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "a-- === true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "++a === true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "a++ === true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "(a + b) === true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "(a - b) === true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "(a * b) === true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "(a / b) === true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "(a % b) === true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "(a | b) === true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "(a ^ b) === true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "(a & b) === true", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "Boolean(0) === Boolean(1)", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "true === String(x)", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "true === Number(x)", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "Boolean(0) == !({})", errors: [{ messageId: "constantBinaryOperand" }] },

        // Binary expression with strict comparison to null
        { code: "({}) !== null", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "({}) === null", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "([]) === null", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "(() => {}) === null", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "(function() {}) === null", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "(class {}) === null", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "new Foo() === null", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "`` === null", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "1 === null", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "'hello' === null", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "/[a-z]/ === null", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "true === null", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "null === null", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "a++ === null", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "++a === null", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "--a === null", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "a-- === null", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "!a === null", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "typeof a === null", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "delete a === null", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "void a === null", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "undefined === null", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "(x = {}) === null", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "(x += y) === null", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "(x -= y) === null", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "(a, b, {}) === null", errors: [{ messageId: "constantBinaryOperand" }] },

        // Binary expression with strict comparison to undefined
        { code: "({}) !== undefined", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "({}) === undefined", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "([]) === undefined", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "(() => {}) === undefined", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "(function() {}) === undefined", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "(class {}) === undefined", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "new Foo() === undefined", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "`` === undefined", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "1 === undefined", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "'hello' === undefined", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "/[a-z]/ === undefined", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "true === undefined", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "null === undefined", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "a++ === undefined", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "++a === undefined", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "--a === undefined", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "a-- === undefined", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "!a === undefined", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "typeof a === undefined", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "delete a === undefined", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "void a === undefined", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "undefined === undefined", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "(x = {}) === undefined", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "(x += y) === undefined", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "(x -= y) === undefined", errors: [{ messageId: "constantBinaryOperand" }] },
        { code: "(a, b, {}) === undefined", errors: [{ messageId: "constantBinaryOperand" }] },

        /*
         * If both sides are newly constructed objects, we can tell they will
         * never be equal, even with == equality.
         */
        { code: "[a] == [a]", errors: [{ messageId: "bothAlwaysNew" }] },
        { code: "[a] != [a]", errors: [{ messageId: "bothAlwaysNew" }] },
        { code: "({}) == []", errors: [{ messageId: "bothAlwaysNew" }] },

        // Comparing to always new objects
        { code: "x === {}", errors: [{ messageId: "alwaysNew" }] },
        { code: "x !== {}", errors: [{ messageId: "alwaysNew" }] },
        { code: "x === []", errors: [{ messageId: "alwaysNew" }] },
        { code: "x === (() => {})", errors: [{ messageId: "alwaysNew" }] },
        { code: "x === (function() {})", errors: [{ messageId: "alwaysNew" }] },
        { code: "x === (class {})", errors: [{ messageId: "alwaysNew" }] },
        { code: "x === new Boolean()", errors: [{ messageId: "alwaysNew" }] },
        { code: "x === new Promise()", env: { es6: true }, errors: [{ messageId: "alwaysNew" }] },
        { code: "x === new WeakSet()", env: { es6: true }, errors: [{ messageId: "alwaysNew" }] },
        { code: "x === (foo, {})", errors: [{ messageId: "alwaysNew" }] },
        { code: "x === (y = {})", errors: [{ messageId: "alwaysNew" }] },
        { code: "x === (y ? {} : [])", errors: [{ messageId: "alwaysNew" }] },
        { code: "x === /[a-z]/", errors: [{ messageId: "alwaysNew" }] },

        // It's not obvious what this does, but it compares the old value of `x` to the new object.
        { code: "x === (x = {})", errors: [{ messageId: "alwaysNew" }] }
    ]
});
