/**
 * @fileoverview Tests for func-names rule.
 * @author Kyle T. Nunery
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/func-names"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

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

        // export default
        {
            code: "export default function foo() {}",
            options: ["always"],
            parserOptions: { sourceType: "module", ecmaVersion: 6 }
        },
        {
            code: "export default function foo() {}",
            options: ["as-needed"],
            parserOptions: { sourceType: "module", ecmaVersion: 6 }
        },
        {
            code: "export default function foo() {}",
            options: ["never"],
            parserOptions: { sourceType: "module", ecmaVersion: 6 }
        },
        {
            code: "export default function() {}",
            options: ["never"],
            parserOptions: { sourceType: "module", ecmaVersion: 6 }
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
        },

        // class fields
        {
            code: "class C { foo = function() {}; }",
            options: ["as-needed"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { [foo] = function() {}; }",
            options: ["as-needed"],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { #foo = function() {}; }",
            options: ["as-needed"],
            parserOptions: { ecmaVersion: 2022 }
        }
    ],
    invalid: [
        {
            code: "Foo.prototype.bar = function() {};",
            errors: [{
                messageId: "unnamed",
                type: "FunctionExpression",
                line: 1,
                column: 21,
                endColumn: 29
            }]
        },
        {
            code: "(function(){}())",
            errors: [{
                messageId: "unnamed",
                type: "FunctionExpression",
                line: 1,
                column: 2,
                endColumn: 10
            }]
        },
        {
            code: "f(function(){})",
            errors: [{
                messageId: "unnamed",
                type: "FunctionExpression",
                line: 1,
                column: 3,
                endColumn: 11
            }]
        },
        {
            code: "var a = new Date(function() {});",
            errors: [{
                messageId: "unnamed",
                type: "FunctionExpression",
                line: 1,
                column: 18,
                endColumn: 26
            }]
        },
        {
            code: "var test = function(d, e, f) {};",
            errors: [{
                messageId: "unnamed",
                type: "FunctionExpression",
                line: 1,
                column: 12,
                endColumn: 20
            }]
        },
        {
            code: "new function() {}",
            errors: [{
                messageId: "unnamed",
                type: "FunctionExpression",
                line: 1,
                column: 5,
                endColumn: 13
            }]
        },
        {
            code: "Foo.prototype.bar = function() {};",
            options: ["as-needed"],
            errors: [{
                messageId: "unnamed",
                type: "FunctionExpression",
                line: 1,
                column: 21,
                endColumn: 29
            }]
        },
        {
            code: "(function(){}())",
            options: ["as-needed"],
            errors: [{
                messageId: "unnamed",
                type: "FunctionExpression",
                line: 1,
                column: 2,
                endColumn: 10
            }]
        },
        {
            code: "f(function(){})",
            options: ["as-needed"],
            errors: [{
                messageId: "unnamed",
                type: "FunctionExpression",
                line: 1,
                column: 3,
                endColumn: 11
            }]
        },
        {
            code: "var a = new Date(function() {});",
            options: ["as-needed"],
            errors: [{
                messageId: "unnamed",
                type: "FunctionExpression",
                line: 1,
                column: 18,
                endColumn: 26
            }]
        },
        {
            code: "new function() {}",
            options: ["as-needed"],
            errors: [{
                messageId: "unnamed",
                type: "FunctionExpression",
                line: 1,
                column: 5,
                endColumn: 13
            }]
        },
        {
            code: "var {foo} = function(){};",
            options: ["as-needed"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unnamed",
                type: "FunctionExpression",
                line: 1,
                column: 13,
                endColumn: 21
            }]
        },
        {
            code: "({ a: obj.prop = function(){} } = foo);",
            options: ["as-needed"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unnamed",
                type: "FunctionExpression",
                line: 1,
                column: 18,
                endColumn: 26
            }]
        },
        {
            code: "[obj.prop = function(){}] = foo;",
            options: ["as-needed"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unnamed",
                type: "FunctionExpression",
                line: 1,
                column: 13,
                endColumn: 21
            }]
        },
        {
            code: "var { a: [b] = function(){} } = foo;",
            options: ["as-needed"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unnamed",
                type: "FunctionExpression",
                line: 1,
                column: 16,
                endColumn: 24
            }]
        },
        {
            code: "function foo({ a } = function(){}) {};",
            options: ["as-needed"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unnamed",
                type: "FunctionExpression",
                line: 1,
                column: 22,
                endColumn: 30
            }]
        },
        {
            code: "var x = function foo() {};",
            options: ["never"],
            errors: [{
                messageId: "named",
                data: { name: "function 'foo'" },
                type: "FunctionExpression",
                line: 1,
                column: 9,
                endColumn: 21
            }]
        },
        {
            code: "Foo.prototype.bar = function foo() {};",
            options: ["never"],
            errors: [{
                messageId: "named",
                data: { name: "function 'foo'" },
                type: "FunctionExpression",
                line: 1,
                column: 21,
                endColumn: 33
            }]
        },
        {
            code: "({foo: function foo() {}})",
            options: ["never"],
            errors: [{
                messageId: "named",
                data: { name: "method 'foo'" },
                type: "FunctionExpression",
                line: 1,
                column: 3,
                endColumn: 20
            }]
        },

        // export default
        {
            code: "export default function() {}",
            options: ["always"],
            parserOptions: { sourceType: "module", ecmaVersion: 6 },
            errors: [{
                messageId: "unnamed",
                type: "FunctionDeclaration",
                column: 16,
                endColumn: 24
            }]
        },
        {
            code: "export default function() {}",
            options: ["as-needed"],
            parserOptions: { sourceType: "module", ecmaVersion: 6 },
            errors: [{
                messageId: "unnamed",
                type: "FunctionDeclaration",
                column: 16,
                endColumn: 24
            }]
        },
        {
            code: "export default (function(){});",
            options: ["as-needed"],
            parserOptions: { sourceType: "module", ecmaVersion: 6 },
            errors: [{
                messageId: "unnamed",
                type: "FunctionExpression",
                column: 17,
                endColumn: 25
            }]
        },

        // generators
        {
            code: "var foo = bar(function *() {});",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unnamed",
                type: "FunctionExpression",
                line: 1,
                column: 15,
                endColumn: 25
            }]
        },
        {
            code: "var foo = function*() {};",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unnamed",
                type: "FunctionExpression",
                line: 1,
                column: 11,
                endColumn: 20
            }]
        },
        {
            code: "(function*() {}())",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unnamed",
                type: "FunctionExpression",
                line: 1,
                column: 2,
                endColumn: 11
            }]
        },
        {
            code: "var foo = bar(function *() {});",
            options: ["always", { generators: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unnamed",
                type: "FunctionExpression",
                line: 1,
                column: 15,
                endColumn: 25
            }]
        },
        {
            code: "var foo = function*() {};",
            options: ["always", { generators: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unnamed",
                type: "FunctionExpression",
                line: 1,
                column: 11,
                endColumn: 20
            }]
        },
        {
            code: "(function*() {}())",
            options: ["always", { generators: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unnamed",
                type: "FunctionExpression",
                line: 1,
                column: 2,
                endColumn: 11
            }]
        },
        {
            code: "var foo = bar(function *() {});",
            options: ["always", { generators: "as-needed" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unnamed",
                type: "FunctionExpression",
                line: 1,
                column: 15,
                endColumn: 25
            }]
        },
        {
            code: "(function*() {}())",
            options: ["always", { generators: "as-needed" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unnamed",
                type: "FunctionExpression",
                line: 1,
                column: 2,
                endColumn: 11
            }]
        },
        {
            code: "var foo = bar(function *() {});",
            options: ["as-needed"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unnamed",
                type: "FunctionExpression",
                line: 1,
                column: 15,
                endColumn: 25
            }]
        },
        {
            code: "(function*() {}())",
            options: ["as-needed"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unnamed",
                type: "FunctionExpression",
                line: 1,
                column: 2,
                endColumn: 11
            }]
        },
        {
            code: "var foo = bar(function *() {});",
            options: ["as-needed", { generators: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unnamed",
                type: "FunctionExpression",
                line: 1,
                column: 15,
                endColumn: 25
            }]
        },
        {
            code: "var foo = function*() {};",
            options: ["as-needed", { generators: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unnamed",
                type: "FunctionExpression",
                line: 1,
                column: 11,
                endColumn: 20
            }]
        },
        {
            code: "(function*() {}())",
            options: ["as-needed", { generators: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unnamed",
                type: "FunctionExpression",
                line: 1,
                column: 2,
                endColumn: 11
            }]
        },
        {
            code: "var foo = bar(function *() {});",
            options: ["as-needed", { generators: "as-needed" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unnamed",
                type: "FunctionExpression",
                line: 1,
                column: 15,
                endColumn: 25
            }]
        },
        {
            code: "(function*() {}())",
            options: ["as-needed", { generators: "as-needed" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unnamed",
                type: "FunctionExpression",
                line: 1,
                column: 2,
                endColumn: 11
            }]
        },
        {
            code: "var foo = bar(function *() {});",
            options: ["never", { generators: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unnamed",
                type: "FunctionExpression",
                line: 1,
                column: 15,
                endColumn: 25
            }]
        },
        {
            code: "var foo = function*() {};",
            options: ["never", { generators: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unnamed",
                type: "FunctionExpression",
                line: 1,
                column: 11,
                endColumn: 20
            }]
        },
        {
            code: "(function*() {}())",
            options: ["never", { generators: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unnamed",
                type: "FunctionExpression",
                line: 1,
                column: 2,
                endColumn: 11
            }]
        },
        {
            code: "var foo = bar(function *() {});",
            options: ["never", { generators: "as-needed" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unnamed",
                type: "FunctionExpression",
                line: 1,
                column: 15,
                endColumn: 25
            }]
        },
        {
            code: "(function*() {}())",
            options: ["never", { generators: "as-needed" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unnamed",
                type: "FunctionExpression",
                line: 1,
                column: 2,
                endColumn: 11
            }]
        },

        {
            code: "var foo = bar(function *baz() {});",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "named",
                data: { name: "generator function 'baz'" },
                type: "FunctionExpression",
                line: 1,
                column: 15,
                endColumn: 28
            }]
        },
        {
            code: "var foo = bar(function *baz() {});",
            options: ["never", { generators: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "named",
                data: { name: "generator function 'baz'" },
                type: "FunctionExpression",
                line: 1,
                column: 15,
                endColumn: 28
            }]
        },
        {
            code: "var foo = bar(function *baz() {});",
            options: ["always", { generators: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "named",
                data: { name: "generator function 'baz'" },
                type: "FunctionExpression",
                line: 1,
                column: 15,
                endColumn: 28
            }]
        },
        {
            code: "var foo = bar(function *baz() {});",
            options: ["as-needed", { generators: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "named",
                data: { name: "generator function 'baz'" },
                type: "FunctionExpression",
                line: 1,
                column: 15,
                endColumn: 28
            }]
        },

        // class fields
        {
            code: "class C { foo = function() {} }",
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "unnamed",
                data: { name: "method 'foo'" },
                column: 11,
                endColumn: 25
            }]
        },
        {
            code: "class C { [foo] = function() {} }",
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "unnamed",
                data: { name: "method" },
                column: 11,
                endColumn: 27
            }]
        },
        {
            code: "class C { #foo = function() {} }",
            options: ["always"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "unnamed",
                data: { name: "private method #foo" },
                column: 11,
                endColumn: 26
            }]
        },
        {
            code: "class C { foo = bar(function() {}) }",
            options: ["as-needed"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "unnamed",
                data: { name: "function" },
                column: 21,
                endColumn: 29
            }]
        },
        {
            code: "class C { foo = function bar() {} }",
            options: ["never"],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "named",
                data: { name: "method 'foo'" },
                column: 11,
                endColumn: 29
            }]
        }
    ]
});
