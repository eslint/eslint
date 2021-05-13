/**
 * @fileoverview Tests for the no-setter-return rule
 * @author Milos Djermanovic
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-setter-return");
const { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Creates an error object.
 * @param {number} [column] Reported column.
 * @param {string} [type= "ReturnStatement"] Reported node type.
 * @returns {Object} The error object.
 */
function error(column, type = "ReturnStatement") {
    const errorObject = {
        messageId: "returnsValue",
        type
    };

    if (column) {
        errorObject.column = column;
    }

    return errorObject;
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2022 } });

ruleTester.run("no-setter-return", rule, {
    valid: [

        //------------------------------------------------------------------------------
        // General
        //------------------------------------------------------------------------------

        // not a setter
        "function foo() { return 1; }",
        "function set(val) { return 1; }",
        "var foo = function() { return 1; };",
        "var foo = function set() { return 1; };",
        "var set = function() { return 1; };",
        "var set = function set(val) { return 1; };",
        "var set = val => { return 1; };",
        "var set = val => 1;",

        // setters do not have effect on other functions (test function info tracking)
        "({ set a(val) { }}); function foo() { return 1; }",
        "({ set a(val) { }}); (function () { return 1; });",
        "({ set a(val) { }}); (() => { return 1; });",
        "({ set a(val) { }}); (() => 1);",

        // does not report global return
        {
            code: "return 1;",
            env: { node: true }
        },
        {
            code: "return 1;",
            parserOptions: { ecmaFeatures: { globalReturn: true } }
        },
        {
            code: "return 1; function foo(){ return 1; } return 1;",
            env: { node: true }
        },
        {
            code: "function foo(){} return 1; var bar = function*(){ return 1; }; return 1; var baz = () => {}; return 1;",
            env: { node: true }
        },

        //------------------------------------------------------------------------------
        // Object literals and classes
        //------------------------------------------------------------------------------

        // return without a value is allowed
        "({ set foo(val) { return; } })",
        "({ set foo(val) { if (val) { return; } } })",
        "class A { set foo(val) { return; } }",
        "(class { set foo(val) { if (val) { return; } else { return; } return; } })",
        "class A { set foo(val) { try {} catch(e) { return; } } }",

        // not a setter
        "({ get foo() { return 1; } })",
        "({ get set() { return 1; } })",
        "({ set(val) { return 1; } })",
        "({ set: function(val) { return 1; } })",
        "({ foo: function set(val) { return 1; } })",
        "({ set: function set(val) { return 1; } })",
        "({ set: (val) => { return 1; } })",
        "({ set: (val) => 1 })",
        "set = { foo(val) { return 1; } };",
        "class A { constructor(val) { return 1; } }",
        "class set { constructor(val) { return 1; } }",
        "class set { foo(val) { return 1; } }",
        "var set = class { foo(val) { return 1; } }",
        "(class set { foo(val) { return 1; } })",
        "class A { get foo() { return val; } }",
        "class A { get set() { return val; } }",
        "class A { set(val) { return 1; } }",
        "class A { static set(val) { return 1; } }",
        "({ set: set = function set(val) { return 1; } } = {})",
        "({ set: set = (val) => 1 } = {})",
        "class C { set; foo() { return 1; } }",

        // not returning from the setter
        "({ set foo(val) { function foo(val) { return 1; } } })",
        "({ set foo(val) { var foo = function(val) { return 1; } } })",
        "({ set foo(val) { var foo = (val) => { return 1; } } })",
        "({ set foo(val) { var foo = (val) => 1; } })",
        "({ set [function() { return 1; }](val) {} })",
        "({ set [() => { return 1; }](val) {} })",
        "({ set [() => 1](val) {} })",
        "({ set foo(val = function() { return 1; }) {} })",
        "({ set foo(val = v => 1) {} })",
        "(class { set foo(val) { function foo(val) { return 1; } } })",
        "(class { set foo(val) { var foo = function(val) { return 1; } } })",
        "(class { set foo(val) { var foo = (val) => { return 1; } } })",
        "(class { set foo(val) { var foo = (val) => 1; } })",
        "(class { set [function() { return 1; }](val) {} })",
        "(class { set [() => { return 1; }](val) {} })",
        "(class { set [() => 1](val) {} })",
        "(class { set foo(val = function() { return 1; }) {} })",
        "(class { set foo(val = (v) => 1) {} })",

        //------------------------------------------------------------------------------
        // Property descriptors
        //------------------------------------------------------------------------------

        // return without a value is allowed
        "Object.defineProperty(foo, 'bar', { set(val) { return; } })",
        {
            code: "Reflect.defineProperty(foo, 'bar', { set(val) { if (val) { return; } } })",
            env: { es6: true }
        },
        "Object.defineProperties(foo, { bar: { set(val) { try { return; } catch(e){} } } })",
        "Object.create(foo, { bar: { set: function(val) { return; } } })",

        // not a setter
        "x = { set(val) { return 1; } }",
        "x = { foo: { set(val) { return 1; } } }",
        "Object.defineProperty(foo, 'bar', { value(val) { return 1; } })",
        {
            code: "Reflect.defineProperty(foo, 'bar', { value: function set(val) { return 1; } })",
            env: { es6: true }
        },
        "Object.defineProperties(foo, { bar: { [set](val) { return 1; } } })",
        "Object.create(foo, { bar: { 'set ': function(val) { return 1; } } })",
        "Object.defineProperty(foo, 'bar', { [`set `]: (val) => { return 1; } })",
        {
            code: "Reflect.defineProperty(foo, 'bar', { Set(val) { return 1; } })",
            env: { es6: true }
        },
        "Object.defineProperties(foo, { bar: { value: (val) => 1 } })",
        "Object.create(foo, { set: { value: function(val) { return 1; } } })",
        "Object.defineProperty(foo, 'bar', { baz(val) { return 1; } })",
        {
            code: "Reflect.defineProperty(foo, 'bar', { get(val) { return 1; } })",
            env: { es6: true }
        },
        "Object.create(foo, { set: function(val) { return 1; } })",
        "Object.defineProperty(foo, { set: (val) => 1 })",

        // not returning from the setter
        "Object.defineProperty(foo, 'bar', { set(val) { function foo() { return 1; } } })",
        {
            code: "Reflect.defineProperty(foo, 'bar', { set(val) { var foo = function() { return 1; } } })",
            env: { es6: true }
        },
        "Object.defineProperties(foo, { bar: { set(val) { () => { return 1 }; } } })",
        "Object.create(foo, { bar: { set: (val) => { (val) => 1; } } })",

        // invalid index
        "Object.defineProperty(foo, 'bar', 'baz', { set(val) { return 1; } })",
        "Object.defineProperty(foo, { set(val) { return 1; } }, 'bar')",
        "Object.defineProperty({ set(val) { return 1; } }, foo, 'bar')",
        {
            code: "Reflect.defineProperty(foo, 'bar', 'baz', { set(val) { return 1; } })",
            env: { es6: true }
        },
        {
            code: "Reflect.defineProperty(foo, { set(val) { return 1; } }, 'bar')",
            env: { es6: true }
        },
        {
            code: "Reflect.defineProperty({ set(val) { return 1; } }, foo, 'bar')",
            env: { es6: true }
        },
        "Object.defineProperties(foo, bar, { baz: { set(val) { return 1; } } })",
        "Object.defineProperties({ bar: { set(val) { return 1; } } }, foo)",
        "Object.create(foo, bar, { baz: { set(val) { return 1; } } })",
        "Object.create({ bar: { set(val) { return 1; } } }, foo)",

        // not targeted method name
        "Object.DefineProperty(foo, 'bar', { set(val) { return 1; } })",
        {
            code: "Reflect.DefineProperty(foo, 'bar', { set(val) { if (val) { return 1; } } })",
            env: { es6: true }
        },
        "Object.DefineProperties(foo, { bar: { set(val) { try { return 1; } catch(e){} } } })",
        "Object.Create(foo, { bar: { set: function(val) { return 1; } } })",

        // not targeted object name
        "object.defineProperty(foo, 'bar', { set(val) { return 1; } })",
        {
            code: "reflect.defineProperty(foo, 'bar', { set(val) { if (val) { return 1; } } })",
            env: { es6: true }
        },
        {
            code: "Reflect.defineProperties(foo, { bar: { set(val) { try { return 1; } catch(e){} } } })",
            env: { es6: true }
        },
        "object.create(foo, { bar: { set: function(val) { return 1; } } })",

        // global object doesn't exist
        "Reflect.defineProperty(foo, 'bar', { set(val) { if (val) { return 1; } } })",
        "/* globals Object:off */ Object.defineProperty(foo, 'bar', { set(val) { return 1; } })",
        {
            code: "Object.defineProperties(foo, { bar: { set(val) { try { return 1; } catch(e){} } } })",
            globals: { Object: "off" }
        },

        // global object is shadowed
        "let Object; Object.defineProperty(foo, 'bar', { set(val) { return 1; } })",
        {
            code: "function f() { Reflect.defineProperty(foo, 'bar', { set(val) { if (val) { return 1; } } }); var Reflect;}",
            env: { es6: true }
        },
        "function f(Object) { Object.defineProperties(foo, { bar: { set(val) { try { return 1; } catch(e){} } } }) }",
        "if (x) { const Object = getObject(); Object.create(foo, { bar: { set: function(val) { return 1; } } }) }",
        "x = function Object() { Object.defineProperty(foo, 'bar', { set(val) { return 1; } }) }"
    ],

    invalid: [

        //------------------------------------------------------------------------------
        // Object literals and classes
        //------------------------------------------------------------------------------

        // full error test
        {
            code: "({ set a(val){ return val + 1; } })",
            errors: [{ messageId: "returnsValue", type: "ReturnStatement", column: 16, endColumn: 31 }]
        },

        // basic tests
        {
            code: "({ set a(val) { return 1; } })",
            errors: [error()]
        },
        {
            code: "class A { set a(val) { return 1; } }",
            errors: [error()]
        },
        {
            code: "class A { static set a(val) { return 1; } }",
            errors: [error()]
        },
        {
            code: "(class { set a(val) { return 1; } })",
            errors: [error()]
        },

        // any value
        {
            code: "({ set a(val) { return val; } })",
            errors: [error()]
        },
        {
            code: "class A { set a(val) { return undefined; } }",
            errors: [error()]
        },
        {
            code: "(class { set a(val) { return null; } })",
            errors: [error()]
        },
        {
            code: "({ set a(val) { return x + y; } })",
            errors: [error()]
        },
        {
            code: "class A { set a(val) { return foo(); } }",
            errors: [error()]
        },
        {
            code: "(class { set a(val) { return this._a; } })",
            errors: [error()]
        },
        {
            code: "({ set a(val) { return this.a; } })",
            errors: [error()]
        },

        // any location
        {
            code: "({ set a(val) { if (foo) { return 1; }; } })",
            errors: [error()]
        },
        {
            code: "class A { set a(val) { try { return 1; } catch(e) {} } }",
            errors: [error()]
        },
        {
            code: "(class { set a(val) { while (foo){ if (bar) break; else return 1; } } })",
            errors: [error()]
        },

        // multiple invalid in same object literal/class
        {
            code: "({ set a(val) { return 1; }, set b(val) { return 1; } })",
            errors: [error(17), error(43)]
        },
        {
            code: "class A { set a(val) { return 1; } set b(val) { return 1; } }",
            errors: [error(24), error(49)]
        },
        {
            code: "(class { set a(val) { return 1; } static set b(val) { return 1; } })",
            errors: [error(23), error(55)]
        },

        // multiple invalid in the same setter
        {
            code: "({ set a(val) { if(val) { return 1; } else { return 2 }; } })",
            errors: [error(27), error(46)]
        },
        {
            code: "class A { set a(val) { switch(val) { case 1: return x; case 2: return y; default: return z } } }",
            errors: [error(46), error(64), error(83)]
        },
        {
            code: "(class { static set a(val) { if (val > 0) { this._val = val; return val; } return false; } })",
            errors: [error(62), error(76)]
        },

        // valid and invalid in the same setter
        {
            code: "({ set a(val) { if(val) { return 1; } else { return; }; } })",
            errors: [error(27)]
        },
        {
            code: "class A { set a(val) { switch(val) { case 1: return x; case 2: return; default: return z } } }",
            errors: [error(46), error(81)]
        },
        {
            code: "(class { static set a(val) { if (val > 0) { this._val = val; return; } return false; } })",
            errors: [error(72)]
        },

        // inner functions do not have effect
        {
            code: "({ set a(val) { function b(){} return b(); } })",
            errors: [error(32)]
        },
        {
            code: "class A { set a(val) { return () => {}; } }",
            errors: [error(24)]
        },
        {
            code: "(class { set a(val) { function b(){ return 1; } return 2; } })",
            errors: [error(49)]
        },
        {
            code: "({ set a(val) { function b(){ return; } return 1; } })",
            errors: [error(41)]
        },
        {
            code: "class A { set a(val) { var x = function() { return 1; }; return 2; } }",
            errors: [error(58)]
        },
        {
            code: "(class { set a(val) { var x = () => { return; }; return 2; } })",
            errors: [error(50)]
        },

        // other functions and global returns do not have effect (test function info tracking)
        {
            code: "function f(){}; ({ set a(val) { return 1; } });",
            errors: [error()]
        },
        {
            code: "x = function f(){}; class A { set a(val) { return 1; } };",
            errors: [error()]
        },
        {
            code: "x = () => {}; A = class { set a(val) { return 1; } };",
            errors: [error()]
        },
        {
            code: "return; ({ set a(val) { return 1; } }); return 2;",
            env: { node: true },
            errors: [error(25)]
        },

        //------------------------------------------------------------------------------
        // Property descriptors
        //------------------------------------------------------------------------------

        // basic tests
        {
            code: "Object.defineProperty(foo, 'bar', { set(val) { return 1; } })",
            errors: [error()]
        },
        {
            code: "Reflect.defineProperty(foo, 'bar', { set(val) { return 1; } })",
            env: { es6: true },
            errors: [error()]
        },
        {
            code: "Object.defineProperties(foo, { baz: { set(val) { return 1; } } })",
            errors: [error()]
        },
        {
            code: "Object.create(null, { baz: { set(val) { return 1; } } })",
            errors: [error()]
        },

        // arrow implicit return// basic tests
        {
            code: "Object.defineProperty(foo, 'bar', { set: val => val })",
            errors: [error(49, "Identifier")]
        },
        {
            code: "Reflect.defineProperty(foo, 'bar', { set: val => f(val) })",
            env: { es6: true },
            errors: [error(50, "CallExpression")]
        },
        {
            code: "Object.defineProperties(foo, { baz: { set: val => a + b } })",
            errors: [error(51, "BinaryExpression")]
        },
        {
            code: "Object.create({}, { baz: { set: val => this._val } })",
            errors: [error(40, "MemberExpression")]
        },

        // various locations, value types and multiple invalid/valid in same setter.
        {
            code: "Object.defineProperty(foo, 'bar', { set(val) { if (val) { return; } return false; }, get(val) { return 1; } })",
            errors: [error(69)]
        },
        {
            code: "Reflect.defineProperty(foo, 'bar', { set(val) { try { return f(val) } catch (e) { return e }; } })",
            env: { es6: true },
            errors: [error(55), error(83)]
        },
        {
            code: "Object.defineProperties(foo, { bar: { get(){ return null; }, set(val) { return null; } } })",
            errors: [error(73)]
        },
        {
            code: "Object.create(null, { baz: { set(val) { return this._val; return; return undefined; } } })",
            errors: [error(41), error(67)]
        },

        // multiple invalid in the same descriptors object
        {
            code: "Object.defineProperties(foo, { baz: { set(val) { return 1; } }, bar: { set(val) { return 1; } } })",
            errors: [error(50), error(83)]
        },
        {
            code: "Object.create({}, { baz: { set(val) { return 1; } }, bar: { set: (val) => 1 } })",
            errors: [
                error(39),
                error(75, "Literal")
            ]
        },

        // various syntax for properties
        {
            code: "Object['defineProperty'](foo, 'bar', { set: function bar(val) { return 1; } })",
            errors: [error()]
        },
        {
            code: "Reflect.defineProperty(foo, 'bar', { 'set'(val) { return 1; } })",
            env: { es6: true },
            errors: [error()]
        },
        {
            code: "Object[`defineProperties`](foo, { baz: { ['set'](val) { return 1; } } })",
            errors: [error()]
        },
        {
            code: "Object.create({}, { baz: { [`set`]: (val) => { return 1; } } })",
            errors: [error()]
        },

        // edge cases for global objects
        {
            code: "Object.defineProperty(foo, 'bar', { set: function Object(val) { return 1; } })",
            errors: [error()]
        },
        {
            code: "Object.defineProperty(foo, 'bar', { set: function(Object) { return 1; } })",
            errors: [error()]
        },

        // Optional chaining
        {
            code: "Object?.defineProperty(foo, 'bar', { set(val) { return 1; } })",
            parserOptions: { ecmaVersion: 2020 },
            errors: [error()]
        },
        {
            code: "(Object?.defineProperty)(foo, 'bar', { set(val) { return 1; } })",
            parserOptions: { ecmaVersion: 2020 },
            errors: [error()]
        }
    ]
});
