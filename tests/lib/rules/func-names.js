/**
 * @fileoverview Tests for func-names rule.
 * @author Kyle T. Nunery
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/func-names"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
const unnamedError = { messageId: "unnamed", type: "FunctionExpression" };

ruleTester.run("func-names", rule, {
    valid: [
        "Foo.prototype.bar = function bar(){};",
        { code: "Foo.prototype.bar = () => {}", parserOptions: { ecmaVersion: 6 } },
        "function foo(){}",
        "function test(d, e, f) {}",
        "new function bar(){}",
        "exports = { get foo() { return 1; }, set bar(val) { return val; } };",
        {
            code: "({ foo() { return 1; } });",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { constructor(){} foo(){} get bar(){} set baz(value){} static qux(){}}",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo() {}",
            options: ["always"]
        },
        {
            code: "var a = function foo() {};",
            options: ["always"]
        },
        {
            code: "class A { constructor(){} foo(){} get bar(){} set baz(value){} static qux(){}}",
            options: ["as-needed"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "({ foo() {} });",
            options: ["as-needed"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = function(){};",
            options: ["as-needed"]
        },
        {
            code: "({foo: function(){}});",
            options: ["as-needed"]
        },
        {
            code: "(foo = function(){});",
            options: ["as-needed"]
        },
        {
            code: "export default (function(){});",
            options: ["as-needed"],
            parserOptions: {
                ecmaVersion: 6,
                sourceType: "module"
            }
        },
        {
            code: "({foo = function(){}} = {});",
            options: ["as-needed"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "({key: foo = function(){}} = {});",
            options: ["as-needed"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "[foo = function(){}] = [];",
            options: ["as-needed"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function fn(foo = function(){}) {}",
            options: ["as-needed"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo() {}",
            options: ["never"]
        },
        {
            code: "var a = function() {};",
            options: ["never"]
        },
        {
            code: "var a = function foo() { foo(); };",
            options: ["never"]
        },
        {
            code: "var foo = {bar: function() {}};",
            options: ["never"]
        },
        {
            code: "$('#foo').click(function() {});",
            options: ["never"]
        },
        {
            code: "Foo.prototype.bar = function() {};",
            options: ["never"]
        },
        {
            code: "class A { constructor(){} foo(){} get bar(){} set baz(value){} static qux(){}}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "({ foo() {} });",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
        },

        // generators
        {
            code: "var foo = bar(function *baz() {});",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = bar(function *baz() {});",
            options: ["always", { generators: "always" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = bar(function *baz() {});",
            options: ["always", { generators: "as-needed" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = function*() {};",
            options: ["always", { generators: "as-needed" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = bar(function *baz() {});",
            options: ["as-needed"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = function*() {};",
            options: ["as-needed"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = bar(function *baz() {});",
            options: ["as-needed", { generators: "always" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = bar(function *baz() {});",
            options: ["as-needed", { generators: "as-needed" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = function*() {};",
            options: ["as-needed", { generators: "as-needed" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = bar(function *baz() {});",
            options: ["never", { generators: "always" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = bar(function *baz() {});",
            options: ["never", { generators: "as-needed" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = function*() {};",
            options: ["never", { generators: "as-needed" }],
            parserOptions: { ecmaVersion: 6 }
        },

        {
            code: "var foo = bar(function *() {});",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = function*() {};",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "(function*() {}())",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = bar(function *() {});",
            options: ["never", { generators: "never" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = function*() {};",
            options: ["never", { generators: "never" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "(function*() {}())",
            options: ["never", { generators: "never" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = bar(function *() {});",
            options: ["always", { generators: "never" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = function*() {};",
            options: ["always", { generators: "never" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "(function*() {}())",
            options: ["always", { generators: "never" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = bar(function *() {});",
            options: ["as-needed", { generators: "never" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = function*() {};",
            options: ["as-needed", { generators: "never" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "(function*() {}())",
            options: ["as-needed", { generators: "never" }],
            parserOptions: { ecmaVersion: 6 }
        }
    ],
    invalid: [
        {
            code: "Foo.prototype.bar = function() {};",
            errors: [unnamedError]
        },
        {
            code: "(function(){}())",
            errors: [unnamedError]
        },
        {
            code: "f(function(){})",
            errors: [unnamedError]
        },
        {
            code: "var a = new Date(function() {});",
            errors: [unnamedError]
        },
        {
            code: "var test = function(d, e, f) {};",
            errors: [unnamedError]
        },
        {
            code: "new function() {}",
            errors: [unnamedError]
        },
        {
            code: "Foo.prototype.bar = function() {};",
            options: ["as-needed"],
            errors: [unnamedError]
        },
        {
            code: "(function(){}())",
            options: ["as-needed"],
            errors: [unnamedError]
        },
        {
            code: "f(function(){})",
            options: ["as-needed"],
            errors: [unnamedError]
        },
        {
            code: "var a = new Date(function() {});",
            options: ["as-needed"],
            errors: [unnamedError]
        },
        {
            code: "new function() {}",
            options: ["as-needed"],
            errors: [unnamedError]
        },
        {
            code: "var {foo} = function(){};",
            options: ["as-needed"],
            parserOptions: { ecmaVersion: 6 },
            errors: [unnamedError]
        },
        {
            code: "var x = function foo() {};",
            options: ["never"],
            errors: [{ messageId: "named", data: { name: "function 'foo'" }, type: "FunctionExpression" }]
        },
        {
            code: "Foo.prototype.bar = function foo() {};",
            options: ["never"],
            errors: [{ messageId: "named", data: { name: "function 'foo'" }, type: "FunctionExpression" }]
        },
        {
            code: "({foo: function foo() {}})",
            options: ["never"],
            errors: [{ messageId: "named", data: { name: "method 'foo'" }, type: "FunctionExpression" }]
        },

        // generators
        {
            code: "var foo = bar(function *() {});",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [unnamedError]
        },
        {
            code: "var foo = function*() {};",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [unnamedError]
        },
        {
            code: "(function*() {}())",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [unnamedError]
        },
        {
            code: "var foo = bar(function *() {});",
            options: ["always", { generators: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [unnamedError]
        },
        {
            code: "var foo = function*() {};",
            options: ["always", { generators: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [unnamedError]
        },
        {
            code: "(function*() {}())",
            options: ["always", { generators: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [unnamedError]
        },
        {
            code: "var foo = bar(function *() {});",
            options: ["always", { generators: "as-needed" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [unnamedError]
        },
        {
            code: "(function*() {}())",
            options: ["always", { generators: "as-needed" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [unnamedError]
        },
        {
            code: "var foo = bar(function *() {});",
            options: ["as-needed"],
            parserOptions: { ecmaVersion: 6 },
            errors: [unnamedError]
        },
        {
            code: "(function*() {}())",
            options: ["as-needed"],
            parserOptions: { ecmaVersion: 6 },
            errors: [unnamedError]
        },
        {
            code: "var foo = bar(function *() {});",
            options: ["as-needed", { generators: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [unnamedError]
        },
        {
            code: "var foo = function*() {};",
            options: ["as-needed", { generators: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [unnamedError]
        },
        {
            code: "(function*() {}())",
            options: ["as-needed", { generators: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [unnamedError]
        },
        {
            code: "var foo = bar(function *() {});",
            options: ["as-needed", { generators: "as-needed" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [unnamedError]
        },
        {
            code: "(function*() {}())",
            options: ["as-needed", { generators: "as-needed" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [unnamedError]
        },
        {
            code: "var foo = bar(function *() {});",
            options: ["never", { generators: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [unnamedError]
        },
        {
            code: "var foo = function*() {};",
            options: ["never", { generators: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [unnamedError]
        },
        {
            code: "(function*() {}())",
            options: ["never", { generators: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [unnamedError]
        },
        {
            code: "var foo = bar(function *() {});",
            options: ["never", { generators: "as-needed" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [unnamedError]
        },
        {
            code: "(function*() {}())",
            options: ["never", { generators: "as-needed" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [unnamedError]
        },

        {
            code: "var foo = bar(function *baz() {});",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Unexpected named generator function 'baz'."
            }]
        },
        {
            code: "var foo = bar(function *baz() {});",
            options: ["never", { generators: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "named", data: { name: "generator function 'baz'" }, type: "FunctionExpression" }]
        },
        {
            code: "var foo = bar(function *baz() {});",
            options: ["always", { generators: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "named", data: { name: "generator function 'baz'" }, type: "FunctionExpression" }]
        },
        {
            code: "var foo = bar(function *baz() {});",
            options: ["as-needed", { generators: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "named", data: { name: "generator function 'baz'" }, type: "FunctionExpression" }]
        }
    ]
});
