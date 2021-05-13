/**
 * @fileoverview Tests for no-restricted-properties rule.
 * @author Will Klein & Eli White
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-restricted-properties"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-restricted-properties", rule, {
    valid: [
        {
            code: "someObject.someProperty",
            options: [{
                object: "someObject",
                property: "disallowedProperty"
            }]
        }, {
            code: "anotherObject.disallowedProperty",
            options: [{
                object: "someObject",
                property: "disallowedProperty"
            }]
        }, {
            code: "someObject.someProperty()",
            options: [{
                object: "someObject",
                property: "disallowedProperty"
            }]
        }, {
            code: "anotherObject.disallowedProperty()",
            options: [{
                object: "someObject",
                property: "disallowedProperty"
            }]
        }, {
            code: "anotherObject.disallowedProperty()",
            options: [{
                object: "someObject",
                property: "disallowedProperty",
                message: "Please use someObject.allowedProperty instead."
            }]
        }, {
            code: "anotherObject['disallowedProperty']()",
            options: [{
                object: "someObject",
                property: "disallowedProperty"
            }]
        }, {
            code: "obj.toString",
            options: [{
                object: "obj",
                property: "__proto__"
            }]
        }, {
            code: "toString.toString",
            options: [{
                object: "obj",
                property: "foo"
            }]
        }, {
            code: "obj.toString",
            options: [{
                object: "obj",
                property: "foo"
            }]
        }, {
            code: "foo.bar",
            options: [{
                property: "baz"
            }]
        }, {
            code: "foo.bar",
            options: [{
                object: "baz"
            }]
        }, {
            code: "foo()",
            options: [{
                object: "foo"
            }]
        }, {
            code: "foo;",
            options: [{
                object: "foo"
            }]
        }, {
            code: "foo[/(?<zero>0)/]",
            options: [{
                property: "null"
            }],
            parserOptions: { ecmaVersion: 2018 }
        }, {
            code: "let bar = foo;",
            options: [{ object: "foo", property: "bar" }],
            parserOptions: { ecmaVersion: 6 }
        }, {
            code: "let {baz: bar} = foo;",
            options: [{ object: "foo", property: "bar" }],
            parserOptions: { ecmaVersion: 6 }
        }, {
            code: "let {unrelated} = foo;",
            options: [{ object: "foo", property: "bar" }],
            parserOptions: { ecmaVersion: 6 }
        }, {
            code: "let {baz: {bar: qux}} = foo;",
            options: [{ object: "foo", property: "bar" }],
            parserOptions: { ecmaVersion: 6 }
        }, {
            code: "let {bar} = foo.baz;",
            options: [{ object: "foo", property: "bar" }],
            parserOptions: { ecmaVersion: 6 }
        }, {
            code: "let {baz: bar} = foo;",
            options: [{ property: "bar" }],
            parserOptions: { ecmaVersion: 6 }
        }, {
            code: "let baz; ({baz: bar} = foo)",
            options: [{ object: "foo", property: "bar" }],
            parserOptions: { ecmaVersion: 6 }
        }, {
            code: "let bar;",
            options: [{ object: "foo", property: "bar" }],
            parserOptions: { ecmaVersion: 6 }
        }, {
            code: "let bar; ([bar = 5] = foo);",
            options: [{ object: "foo", property: "1" }],
            parserOptions: { ecmaVersion: 6 }
        }, {
            code: "function qux({baz: bar} = foo) {}",
            options: [{ object: "foo", property: "bar" }],
            parserOptions: { ecmaVersion: 6 }
        }, {
            code: "let [bar, baz] = foo;",
            options: [{ object: "foo", property: "1" }],
            parserOptions: { ecmaVersion: 6 }
        }, {
            code: "let [, bar] = foo;",
            options: [{ object: "foo", property: "0" }],
            parserOptions: { ecmaVersion: 6 }
        }, {
            code: "let [, bar = 5] = foo;",
            options: [{ object: "foo", property: "1" }],
            parserOptions: { ecmaVersion: 6 }
        }, {
            code: "let bar; ([bar = 5] = foo);",
            options: [{ object: "foo", property: "0" }],
            parserOptions: { ecmaVersion: 6 }
        }, {
            code: "function qux([bar] = foo) {}",
            options: [{ object: "foo", property: "0" }],
            parserOptions: { ecmaVersion: 6 }
        }, {
            code: "function qux([, bar] = foo) {}",
            options: [{ object: "foo", property: "0" }],
            parserOptions: { ecmaVersion: 6 }
        }, {
            code: "function qux([, bar] = foo) {}",
            options: [{ object: "foo", property: "1" }],
            parserOptions: { ecmaVersion: 6 }
        }, {
            code: "class C { #foo; foo() { this.#foo; } }",
            options: [{ property: "#foo" }],
            parserOptions: { ecmaVersion: 2022 }
        }
    ],

    invalid: [
        {
            code: "someObject.disallowedProperty",
            options: [{
                object: "someObject",
                property: "disallowedProperty"
            }],
            errors: [{
                messageId: "restrictedObjectProperty",
                data: {
                    objectName: "someObject",
                    propertyName: "disallowedProperty",
                    message: ""
                },
                type: "MemberExpression"
            }]
        }, {
            code: "someObject.disallowedProperty",
            options: [{
                object: "someObject",
                property: "disallowedProperty",
                message: "Please use someObject.allowedProperty instead."
            }],
            errors: [{
                messageId: "restrictedObjectProperty",
                data: {
                    objectName: "someObject",
                    propertyName: "disallowedProperty",
                    message: " Please use someObject.allowedProperty instead."
                },
                type: "MemberExpression"
            }]
        }, {
            code: "someObject.disallowedProperty; anotherObject.anotherDisallowedProperty()",
            options: [{
                object: "someObject",
                property: "disallowedProperty"
            }, {
                object: "anotherObject",
                property: "anotherDisallowedProperty"
            }],
            errors: [{
                messageId: "restrictedObjectProperty",
                data: {
                    objectName: "someObject",
                    propertyName: "disallowedProperty",
                    message: ""
                },
                type: "MemberExpression"
            }, {
                messageId: "restrictedObjectProperty",
                data: {
                    objectName: "anotherObject",
                    propertyName: "anotherDisallowedProperty",
                    message: ""
                },
                type: "MemberExpression"
            }]
        }, {
            code: "foo.__proto__",
            options: [{
                property: "__proto__",
                message: "Please use Object.getPrototypeOf instead."
            }],
            errors: [{
                messageId: "restrictedProperty",
                data: {
                    objectName: "",
                    propertyName: "__proto__",
                    message: " Please use Object.getPrototypeOf instead."
                },
                type: "MemberExpression"
            }]
        }, {
            code: "foo['__proto__']",
            options: [{
                property: "__proto__",
                message: "Please use Object.getPrototypeOf instead."
            }],
            errors: [{
                messageId: "restrictedProperty",
                data: {
                    objectName: "",
                    propertyName: "__proto__",
                    message: " Please use Object.getPrototypeOf instead."
                },
                type: "MemberExpression"
            }]
        }, {
            code: "foo.bar.baz;",
            options: [{ object: "foo" }],
            errors: [{
                messageId: "restrictedObjectProperty",
                data: {
                    objectName: "foo",
                    propertyName: "bar",
                    message: ""
                },
                type: "MemberExpression"
            }]
        }, {
            code: "foo.bar();",
            options: [{ object: "foo" }],
            errors: [{
                messageId: "restrictedObjectProperty",
                data: {
                    objectName: "foo",
                    propertyName: "bar",
                    message: ""
                },
                type: "MemberExpression"
            }]
        }, {
            code: "foo.bar.baz();",
            options: [{ object: "foo" }],
            errors: [{
                messageId: "restrictedObjectProperty",
                data: {
                    objectName: "foo",
                    propertyName: "bar",
                    message: ""
                },
                type: "MemberExpression"
            }]
        }, {
            code: "foo.bar.baz;",
            options: [{ property: "bar" }],
            errors: [{
                messageId: "restrictedProperty",
                data: {
                    objectName: "",
                    propertyName: "bar",
                    message: ""
                },
                type: "MemberExpression"
            }]
        }, {
            code: "foo.bar();",
            options: [{ property: "bar" }],
            errors: [{
                messageId: "restrictedProperty",
                data: {
                    objectName: "",
                    propertyName: "bar",
                    message: ""
                },
                type: "MemberExpression"
            }]
        }, {
            code: "foo.bar.baz();",
            options: [{ property: "bar" }],
            errors: [{
                messageId: "restrictedProperty",
                data: {
                    objectName: "",
                    propertyName: "bar",
                    message: ""
                },
                type: "MemberExpression"
            }]
        }, {
            code: "foo[/(?<zero>0)/]",
            options: [{ property: "/(?<zero>0)/" }],
            parserOptions: { ecmaVersion: 2018 },
            errors: [{
                messageId: "restrictedProperty",
                data: {
                    objectName: "",
                    propertyName: "/(?<zero>0)/",
                    message: ""
                },
                type: "MemberExpression"
            }]
        }, {
            code: "require.call({}, 'foo')",
            options: [{
                object: "require",
                message: "Please call require() directly."
            }],
            errors: [{
                messageId: "restrictedObjectProperty",
                data: {
                    objectName: "require",
                    propertyName: "call",
                    message: " Please call require() directly."
                },
                type: "MemberExpression"
            }]
        }, {
            code: "require['resolve']",
            options: [{
                object: "require"
            }],
            errors: [{
                messageId: "restrictedObjectProperty",
                data: {
                    objectName: "require",
                    propertyName: "resolve",
                    message: ""
                },
                type: "MemberExpression"
            }]
        }, {
            code: "let {bar} = foo;",
            options: [{ object: "foo", property: "bar" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "restrictedObjectProperty",
                data: {
                    objectName: "foo",
                    propertyName: "bar",
                    message: ""
                },
                type: "ObjectPattern"
            }]
        }, {
            code: "let {bar: baz} = foo;",
            options: [{ object: "foo", property: "bar" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "restrictedObjectProperty",
                data: {
                    objectName: "foo",
                    propertyName: "bar",
                    message: ""
                },
                type: "ObjectPattern"
            }]
        }, {
            code: "let {'bar': baz} = foo;",
            options: [{ object: "foo", property: "bar" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "restrictedObjectProperty",
                data: {
                    objectName: "foo",
                    propertyName: "bar",
                    message: ""
                },
                type: "ObjectPattern"
            }]
        }, {
            code: "let {bar: {baz: qux}} = foo;",
            options: [{ object: "foo", property: "bar" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "restrictedObjectProperty",
                data: {
                    objectName: "foo",
                    propertyName: "bar",
                    message: ""
                },
                type: "ObjectPattern"
            }]
        }, {
            code: "let {bar} = foo;",
            options: [{ object: "foo" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "restrictedObjectProperty",
                data: {
                    objectName: "foo",
                    propertyName: "bar",
                    message: ""
                },
                type: "ObjectPattern"
            }]
        }, {
            code: "let {bar: baz} = foo;",
            options: [{ object: "foo" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "restrictedObjectProperty",
                data: {
                    objectName: "foo",
                    propertyName: "bar",
                    message: ""
                },
                type: "ObjectPattern"
            }]
        }, {
            code: "let {bar} = foo;",
            options: [{ property: "bar" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "restrictedProperty",
                data: {
                    objectName: "",
                    propertyName: "bar",
                    message: ""
                },
                type: "ObjectPattern"
            }]
        }, {
            code: "let bar; ({bar} = foo);",
            options: [{ object: "foo", property: "bar" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "restrictedObjectProperty",
                data: {
                    objectName: "foo",
                    propertyName: "bar",
                    message: ""
                },
                type: "ObjectPattern"
            }]
        }, {
            code: "let bar; ({bar: baz = 1} = foo);",
            options: [{ object: "foo", property: "bar" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "restrictedObjectProperty",
                data: {
                    objectName: "foo",
                    propertyName: "bar",
                    message: ""
                },
                type: "ObjectPattern"
            }]
        }, {
            code: "function qux({bar} = foo) {}",
            options: [{ object: "foo", property: "bar" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "restrictedObjectProperty",
                data: {
                    objectName: "foo",
                    propertyName: "bar",
                    message: ""
                },
                type: "ObjectPattern"
            }]
        }, {
            code: "function qux({bar: baz} = foo) {}",
            options: [{ object: "foo", property: "bar" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "restrictedObjectProperty",
                data: {
                    objectName: "foo",
                    propertyName: "bar",
                    message: ""
                },
                type: "ObjectPattern"
            }]
        }, {
            code: "var {['foo']: qux, bar} = baz",
            options: [{ object: "baz", property: "foo" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "restrictedObjectProperty",
                data: {
                    objectName: "baz",
                    propertyName: "foo",
                    message: ""
                },
                type: "ObjectPattern"
            }]
        }, {
            code: "obj['#foo']",
            options: [{ property: "#foo" }],
            errors: [{
                messageId: "restrictedProperty",
                data: {
                    objectName: "",
                    propertyName: "#foo",
                    message: ""
                },
                type: "MemberExpression"
            }]
        }
    ]
});
