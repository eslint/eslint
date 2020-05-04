/**
 * @fileoverview Test for no-underscore-dangle rule
 * @author Matt DuVall <http://www.mattduvall.com>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-underscore-dangle"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-underscore-dangle", rule, {
    valid: [
        "var foo_bar = 1;",
        "function foo_bar() {}",
        "foo.bar.__proto__;",
        "console.log(__filename); console.log(__dirname);",
        "var _ = require('underscore');",
        "var a = b._;",
        { code: "export default function() {}", parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "var _foo = 1", options: [{ allow: ["_foo"] }] },
        { code: "var __proto__ = 1;", options: [{ allow: ["__proto__"] }] },
        { code: "foo._bar;", options: [{ allow: ["_bar"] }] },
        { code: "function _foo() {}", options: [{ allow: ["_foo"] }] },
        { code: "this._bar;", options: [{ allowAfterThis: true }] },
        { code: "class foo { constructor() { super._bar; } }", options: [{ allowAfterSuper: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "class foo { _onClick() { } }", parserOptions: { ecmaVersion: 6 } },
        { code: "class foo { onClick_() { } }", parserOptions: { ecmaVersion: 6 } },
        { code: "const o = { _onClick() { } }", parserOptions: { ecmaVersion: 6 } },
        { code: "const o = { onClick_() { } }", parserOptions: { ecmaVersion: 6 } },
        { code: "const o = { _onClick() { } }", options: [{ allow: ["_onClick"], enforceInMethodNames: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "const o = { _foo: 'bar' }", parserOptions: { ecmaVersion: 6 } },
        { code: "const o = { foo_: 'bar' }", parserOptions: { ecmaVersion: 6 } },
        { code: "this.constructor._bar", options: [{ allowAfterThisConstructor: true }] }
    ],
    invalid: [
        { code: "var _foo = 1", errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_foo" }, type: "VariableDeclarator" }] },
        { code: "var foo_ = 1", errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "foo_" }, type: "VariableDeclarator" }] },
        { code: "function _foo() {}", errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_foo" }, type: "FunctionDeclaration" }] },
        { code: "function foo_() {}", errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "foo_" }, type: "FunctionDeclaration" }] },
        { code: "var __proto__ = 1;", errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "__proto__" }, type: "VariableDeclarator" }] },
        { code: "foo._bar;", errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_bar" }, type: "MemberExpression" }] },
        { code: "this._prop;", errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_prop" }, type: "MemberExpression" }] },
        { code: "class foo { constructor() { super._prop; } }", parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_prop" }, type: "MemberExpression" }] },
        { code: "class foo { constructor() { this._prop; } }", options: [{ allowAfterSuper: true }], parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_prop" }, type: "MemberExpression" }] },
        { code: "class foo { _onClick() { } }", options: [{ enforceInMethodNames: true }], parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_onClick" }, type: "MethodDefinition" }] },
        { code: "class foo { onClick_() { } }", options: [{ enforceInMethodNames: true }], parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "onClick_" }, type: "MethodDefinition" }] },
        { code: "const o = { _onClick() { } }", options: [{ enforceInMethodNames: true }], parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_onClick" }, type: "Property" }] },
        { code: "const o = { onClick_() { } }", options: [{ enforceInMethodNames: true }], parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "onClick_" }, type: "Property" }] },
        { code: "this.constructor._bar", errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_bar" }, type: "MemberExpression" }] },
        { code: "foo.constructor._bar", options: [{ allowAfterThisConstructor: true }], errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_bar" }, type: "MemberExpression" }] }
    ]
});
