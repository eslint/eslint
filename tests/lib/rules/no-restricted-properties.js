/**
 * @fileoverview Tests for no-restricted-properties rule.
 * @author Will Klein & Eli White
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-restricted-properties"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-restricted-properties", rule, {
	valid: [
		{
			code: "someObject.someProperty",
			options: [
				{
					object: "someObject",
					property: "disallowedProperty",
				},
			],
		},
		{
			code: "anotherObject.disallowedProperty",
			options: [
				{
					object: "someObject",
					property: "disallowedProperty",
				},
			],
		},
		{
			code: "someObject.someProperty()",
			options: [
				{
					object: "someObject",
					property: "disallowedProperty",
				},
			],
		},
		{
			code: "anotherObject.disallowedProperty()",
			options: [
				{
					object: "someObject",
					property: "disallowedProperty",
				},
			],
		},
		{
			code: "anotherObject.disallowedProperty()",
			options: [
				{
					object: "someObject",
					property: "disallowedProperty",
					message: "Please use someObject.allowedProperty instead.",
				},
			],
		},
		{
			code: "anotherObject['disallowedProperty']()",
			options: [
				{
					object: "someObject",
					property: "disallowedProperty",
				},
			],
		},
		{
			code: "obj.toString",
			options: [
				{
					object: "obj",
					property: "__proto__",
				},
			],
		},
		{
			code: "toString.toString",
			options: [
				{
					object: "obj",
					property: "foo",
				},
			],
		},
		{
			code: "obj.toString",
			options: [
				{
					object: "obj",
					property: "foo",
				},
			],
		},
		{
			code: "foo.bar",
			options: [
				{
					property: "baz",
				},
			],
		},
		{
			code: "foo.bar",
			options: [
				{
					object: "baz",
				},
			],
		},
		{
			code: "foo()",
			options: [
				{
					object: "foo",
				},
			],
		},
		{
			code: "foo;",
			options: [
				{
					object: "foo",
				},
			],
		},
		{
			code: "foo[/(?<zero>0)/]",
			options: [
				{
					property: "null",
				},
			],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "let bar = foo;",
			options: [{ object: "foo", property: "bar" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "let {baz: bar} = foo;",
			options: [{ object: "foo", property: "bar" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "let {unrelated} = foo;",
			options: [{ object: "foo", property: "bar" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "let {baz: {bar: qux}} = foo;",
			options: [{ object: "foo", property: "bar" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "let {bar} = foo.baz;",
			options: [{ object: "foo", property: "bar" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "let {baz: bar} = foo;",
			options: [{ property: "bar" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "let baz; ({baz: bar} = foo)",
			options: [{ object: "foo", property: "bar" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "let bar;",
			options: [{ object: "foo", property: "bar" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "let bar; ([bar = 5] = foo);",
			options: [{ object: "foo", property: "1" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function qux({baz: bar} = foo) {}",
			options: [{ object: "foo", property: "bar" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "let [bar, baz] = foo;",
			options: [{ object: "foo", property: "1" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "let [, bar] = foo;",
			options: [{ object: "foo", property: "0" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "let [, bar = 5] = foo;",
			options: [{ object: "foo", property: "1" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "let bar; ([bar = 5] = foo);",
			options: [{ object: "foo", property: "0" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function qux([bar] = foo) {}",
			options: [{ object: "foo", property: "0" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function qux([, bar] = foo) {}",
			options: [{ object: "foo", property: "0" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function qux([, bar] = foo) {}",
			options: [{ object: "foo", property: "1" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C { #foo; foo() { this.#foo; } }",
			options: [{ property: "#foo" }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "someObject.disallowedProperty",
			options: [
				{
					property: "disallowedProperty",
					allowObjects: ["someObject"],
				},
			],
		},
		{
			code: "someObject.disallowedProperty; anotherObject.disallowedProperty();",
			options: [
				{
					property: "disallowedProperty",
					allowObjects: ["someObject", "anotherObject"],
				},
			],
		},
		{
			code: "someObject.disallowedProperty()",
			options: [
				{
					property: "disallowedProperty",
					allowObjects: ["someObject"],
				},
			],
		},
		{
			code: "someObject['disallowedProperty']()",
			options: [
				{
					property: "disallowedProperty",
					allowObjects: ["someObject"],
				},
			],
		},
		{
			code: "let {bar} = foo;",
			options: [{ property: "bar", allowObjects: ["foo"] }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "let {baz: bar} = foo;",
			options: [{ property: "baz", allowObjects: ["foo"] }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "someObject.disallowedProperty",
			options: [
				{
					object: "someObject",
					allowProperties: ["disallowedProperty"],
				},
			],
		},
		{
			code: "someObject.disallowedProperty; someObject.anotherDisallowedProperty();",
			options: [
				{
					object: "someObject",
					allowProperties: [
						"disallowedProperty",
						"anotherDisallowedProperty",
					],
				},
			],
		},
		{
			code: "someObject.disallowedProperty()",
			options: [
				{
					object: "someObject",
					allowProperties: ["disallowedProperty"],
				},
			],
		},
		{
			code: "someObject['disallowedProperty']()",
			options: [
				{
					object: "someObject",
					allowProperties: ["disallowedProperty"],
				},
			],
		},
		{
			code: "let {bar} = foo;",
			options: [
				{
					object: "foo",
					allowProperties: ["bar"],
				},
			],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "let {baz: bar} = foo;",
			options: [
				{
					object: "foo",
					allowProperties: ["baz"],
				},
			],
			languageOptions: { ecmaVersion: 6 },
		},
	],

	invalid: [
		{
			code: "someObject.disallowedProperty",
			options: [
				{
					object: "someObject",
					property: "disallowedProperty",
				},
			],
			errors: [
				{
					messageId: "restrictedObjectProperty",
					data: {
						objectName: "someObject",
						propertyName: "disallowedProperty",
						message: "",
						allowedPropertiesMessage: "",
					},
				},
			],
		},
		{
			code: "someObject.disallowedProperty",
			options: [
				{
					object: "someObject",
					property: "disallowedProperty",
					message: "Please use someObject.allowedProperty instead.",
				},
			],
			errors: [
				{
					messageId: "restrictedObjectProperty",
					data: {
						objectName: "someObject",
						propertyName: "disallowedProperty",
						message:
							" Please use someObject.allowedProperty instead.",
						allowedPropertiesMessage: "",
					},
				},
			],
		},
		{
			code: "someObject.disallowedProperty; anotherObject.anotherDisallowedProperty()",
			options: [
				{
					object: "someObject",
					property: "disallowedProperty",
				},
				{
					object: "anotherObject",
					property: "anotherDisallowedProperty",
				},
			],
			errors: [
				{
					messageId: "restrictedObjectProperty",
					data: {
						objectName: "someObject",
						propertyName: "disallowedProperty",
						message: "",
						allowedPropertiesMessage: "",
					},
				},
				{
					messageId: "restrictedObjectProperty",
					data: {
						objectName: "anotherObject",
						propertyName: "anotherDisallowedProperty",
						message: "",
						allowedPropertiesMessage: "",
					},
				},
			],
		},
		{
			code: "foo.__proto__",
			options: [
				{
					property: "__proto__",
					message: "Please use Object.getPrototypeOf instead.",
				},
			],
			errors: [
				{
					messageId: "restrictedProperty",
					data: {
						objectName: "",
						propertyName: "__proto__",
						message: " Please use Object.getPrototypeOf instead.",
						allowedObjectsMessage: "",
					},
				},
			],
		},
		{
			code: "foo['__proto__']",
			options: [
				{
					property: "__proto__",
					message: "Please use Object.getPrototypeOf instead.",
				},
			],
			errors: [
				{
					messageId: "restrictedProperty",
					data: {
						objectName: "",
						propertyName: "__proto__",
						message: " Please use Object.getPrototypeOf instead.",
						allowedObjectsMessage: "",
					},
				},
			],
		},
		{
			code: "foo.bar.baz;",
			options: [{ object: "foo" }],
			errors: [
				{
					messageId: "restrictedObjectProperty",
					data: {
						objectName: "foo",
						propertyName: "bar",
						message: "",
						allowedPropertiesMessage: "",
					},
				},
			],
		},
		{
			code: "foo.bar();",
			options: [{ object: "foo" }],
			errors: [
				{
					messageId: "restrictedObjectProperty",
					data: {
						objectName: "foo",
						propertyName: "bar",
						message: "",
						allowedPropertiesMessage: "",
					},
				},
			],
		},
		{
			code: "foo.bar.baz();",
			options: [{ object: "foo" }],
			errors: [
				{
					messageId: "restrictedObjectProperty",
					data: {
						objectName: "foo",
						propertyName: "bar",
						message: "",
						allowedPropertiesMessage: "",
					},
				},
			],
		},
		{
			code: "foo.bar.baz;",
			options: [{ property: "bar" }],
			errors: [
				{
					messageId: "restrictedProperty",
					data: {
						objectName: "",
						propertyName: "bar",
						message: "",
						allowedObjectsMessage: "",
					},
				},
			],
		},
		{
			code: "foo.bar();",
			options: [{ property: "bar" }],
			errors: [
				{
					messageId: "restrictedProperty",
					data: {
						objectName: "",
						propertyName: "bar",
						message: "",
						allowedObjectsMessage: "",
					},
				},
			],
		},
		{
			code: "foo.bar.baz();",
			options: [{ property: "bar" }],
			errors: [
				{
					messageId: "restrictedProperty",
					data: {
						objectName: "",
						propertyName: "bar",
						message: "",
						allowedObjectsMessage: "",
					},
				},
			],
		},
		{
			code: "foo[/(?<zero>0)/]",
			options: [{ property: "/(?<zero>0)/" }],
			languageOptions: { ecmaVersion: 2018 },
			errors: [
				{
					messageId: "restrictedProperty",
					data: {
						objectName: "",
						propertyName: "/(?<zero>0)/",
						message: "",
						allowedObjectsMessage: "",
					},
				},
			],
		},
		{
			code: "require.call({}, 'foo')",
			options: [
				{
					object: "require",
					message: "Please call require() directly.",
				},
			],
			errors: [
				{
					messageId: "restrictedObjectProperty",
					data: {
						objectName: "require",
						propertyName: "call",
						message: " Please call require() directly.",
						allowedPropertiesMessage: "",
					},
				},
			],
		},
		{
			code: "require['resolve']",
			options: [
				{
					object: "require",
				},
			],
			errors: [
				{
					messageId: "restrictedObjectProperty",
					data: {
						objectName: "require",
						propertyName: "resolve",
						message: "",
						allowedPropertiesMessage: "",
					},
				},
			],
		},
		{
			code: "let {bar} = foo;",
			options: [{ object: "foo", property: "bar" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "restrictedObjectProperty",
					data: {
						objectName: "foo",
						propertyName: "bar",
						message: "",
						allowedPropertiesMessage: "",
					},
				},
			],
		},
		{
			code: "let {bar: baz} = foo;",
			options: [{ object: "foo", property: "bar" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "restrictedObjectProperty",
					data: {
						objectName: "foo",
						propertyName: "bar",
						message: "",
						allowedPropertiesMessage: "",
					},
				},
			],
		},
		{
			code: "let {'bar': baz} = foo;",
			options: [{ object: "foo", property: "bar" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "restrictedObjectProperty",
					data: {
						objectName: "foo",
						propertyName: "bar",
						message: "",
						allowedPropertiesMessage: "",
					},
				},
			],
		},
		{
			code: "let {bar: {baz: qux}} = foo;",
			options: [{ object: "foo", property: "bar" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "restrictedObjectProperty",
					data: {
						objectName: "foo",
						propertyName: "bar",
						message: "",
						allowedPropertiesMessage: "",
					},
				},
			],
		},
		{
			code: "let {bar} = foo;",
			options: [{ object: "foo" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "restrictedObjectProperty",
					data: {
						objectName: "foo",
						propertyName: "bar",
						message: "",
						allowedPropertiesMessage: "",
					},
				},
			],
		},
		{
			code: "let {bar: baz} = foo;",
			options: [{ object: "foo" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "restrictedObjectProperty",
					data: {
						objectName: "foo",
						propertyName: "bar",
						message: "",
						allowedPropertiesMessage: "",
					},
				},
			],
		},
		{
			code: "let {bar} = foo;",
			options: [{ property: "bar" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "restrictedProperty",
					data: {
						objectName: "",
						propertyName: "bar",
						message: "",
						allowedObjectsMessage: "",
					},
				},
			],
		},
		{
			code: "let bar; ({bar} = foo);",
			options: [{ object: "foo", property: "bar" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "restrictedObjectProperty",
					data: {
						objectName: "foo",
						propertyName: "bar",
						message: "",
						allowedPropertiesMessage: "",
					},
				},
			],
		},
		{
			code: "let bar; ({bar: baz = 1} = foo);",
			options: [{ object: "foo", property: "bar" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "restrictedObjectProperty",
					data: {
						objectName: "foo",
						propertyName: "bar",
						message: "",
						allowedPropertiesMessage: "",
					},
				},
			],
		},
		{
			code: "function qux({bar} = foo) {}",
			options: [{ object: "foo", property: "bar" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "restrictedObjectProperty",
					data: {
						objectName: "foo",
						propertyName: "bar",
						message: "",
						allowedPropertiesMessage: "",
					},
				},
			],
		},
		{
			code: "function qux({bar: baz} = foo) {}",
			options: [{ object: "foo", property: "bar" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "restrictedObjectProperty",
					data: {
						objectName: "foo",
						propertyName: "bar",
						message: "",
						allowedPropertiesMessage: "",
					},
				},
			],
		},
		{
			code: "var {['foo']: qux, bar} = baz",
			options: [{ object: "baz", property: "foo" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "restrictedObjectProperty",
					data: {
						objectName: "baz",
						propertyName: "foo",
						message: "",
						allowedPropertiesMessage: "",
					},
				},
			],
		},
		{
			code: "obj['#foo']",
			options: [{ property: "#foo" }],
			errors: [
				{
					messageId: "restrictedProperty",
					data: {
						objectName: "",
						propertyName: "#foo",
						message: "",
						allowedObjectsMessage: "",
					},
				},
			],
		},
		{
			code: "const { bar: { bad } = {} } = foo;",
			options: [{ property: "bad" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "restrictedProperty",
					data: {
						propertyName: "bad",
						message: "",
						allowedObjectsMessage: "",
					},
				},
			],
		},
		{
			code: "const { bar: { bad } } = foo;",
			options: [{ property: "bad" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "restrictedProperty",
					data: {
						propertyName: "bad",
						message: "",
						allowedObjectsMessage: "",
					},
				},
			],
		},
		{
			code: "const { bad } = foo();",
			options: [{ property: "bad" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "restrictedProperty",
					data: {
						propertyName: "bad",
						message: "",
						allowedObjectsMessage: "",
					},
				},
			],
		},
		{
			code: "({ bad } = foo());",
			options: [{ property: "bad" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "restrictedProperty",
					data: {
						propertyName: "bad",
						message: "",
						allowedObjectsMessage: "",
					},
				},
			],
		},
		{
			code: "({ bar: { bad } } = foo);",
			options: [{ property: "bad" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "restrictedProperty",
					data: {
						propertyName: "bad",
						message: "",
						allowedObjectsMessage: "",
					},
				},
			],
		},
		{
			code: "({ bar: { bad } = {} } = foo);",
			options: [{ property: "bad" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "restrictedProperty",
					data: {
						propertyName: "bad",
						message: "",
						allowedObjectsMessage: "",
					},
				},
			],
		},
		{
			code: "({ bad }) => {};",
			options: [{ property: "bad" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "restrictedProperty",
					data: {
						propertyName: "bad",
						message: "",
						allowedObjectsMessage: "",
					},
				},
			],
		},
		{
			code: "({ bad } = {}) => {};",
			options: [{ property: "bad" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "restrictedProperty",
					data: {
						propertyName: "bad",
						message: "",
						allowedObjectsMessage: "",
					},
				},
			],
		},
		{
			code: "({ bad: bar }) => {};",
			options: [{ property: "bad" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "restrictedProperty",
					data: {
						propertyName: "bad",
						message: "",
						allowedObjectsMessage: "",
					},
				},
			],
		},
		{
			code: "({ bar: { bad } = {} }) => {};",
			options: [{ property: "bad" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "restrictedProperty",
					data: {
						propertyName: "bad",
						message: "",
						allowedObjectsMessage: "",
					},
				},
			],
		},
		{
			code: "[{ bad }] = foo;",
			options: [{ property: "bad" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "restrictedProperty",
					data: {
						propertyName: "bad",
						message: "",
						allowedObjectsMessage: "",
					},
				},
			],
		},
		{
			code: "const [{ bad }] = foo;",
			options: [{ property: "bad" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "restrictedProperty",
					data: {
						propertyName: "bad",
						message: "",
						allowedObjectsMessage: "",
					},
				},
			],
		},
		{
			code: "someObject.disallowedProperty",
			options: [
				{
					property: "disallowedProperty",
					allowObjects: ["anotherObject"],
				},
			],
			errors: [
				{
					messageId: "restrictedProperty",
					data: {
						propertyName: "disallowedProperty",
						message: "",
						allowedObjectsMessage:
							" Property 'disallowedProperty' is only allowed on these objects: anotherObject.",
					},
				},
			],
		},
		{
			code: "someObject.disallowedProperty",
			options: [
				{
					property: "disallowedProperty",
					allowObjects: ["anotherObject"],
					message: "Please use someObject.allowedProperty instead.",
				},
			],
			errors: [
				{
					messageId: "restrictedProperty",
					data: {
						propertyName: "disallowedProperty",
						message:
							" Please use someObject.allowedProperty instead.",
						allowedObjectsMessage:
							" Property 'disallowedProperty' is only allowed on these objects: anotherObject.",
					},
				},
			],
		},
		{
			code: "someObject.disallowedProperty; anotherObject.anotherDisallowedProperty()",
			options: [
				{
					property: "disallowedProperty",
					allowObjects: ["anotherObject"],
				},
				{
					property: "anotherDisallowedProperty",
					allowObjects: ["someObject"],
				},
			],
			errors: [
				{
					messageId: "restrictedProperty",
					data: {
						propertyName: "disallowedProperty",
						message: "",
						allowedObjectsMessage:
							" Property 'disallowedProperty' is only allowed on these objects: anotherObject.",
					},
				},
				{
					messageId: "restrictedProperty",
					data: {
						propertyName: "anotherDisallowedProperty",
						message: "",
						allowedObjectsMessage:
							" Property 'anotherDisallowedProperty' is only allowed on these objects: someObject.",
					},
				},
			],
		},
		{
			code: "someObject.disallowedProperty",
			options: [
				{
					object: "someObject",
					allowProperties: ["allowedProperty"],
				},
			],
			errors: [
				{
					messageId: "restrictedObjectProperty",
					data: {
						objectName: "someObject",
						propertyName: "disallowedProperty",
						message: "",
						allowedPropertiesMessage:
							" Only these properties are allowed: allowedProperty.",
					},
				},
			],
		},
		{
			code: "someObject.disallowedProperty",
			options: [
				{
					object: "someObject",
					allowProperties: ["allowedProperty"],
					message: "Please use someObject.allowedProperty instead.",
				},
			],
			errors: [
				{
					messageId: "restrictedObjectProperty",
					data: {
						objectName: "someObject",
						propertyName: "disallowedProperty",
						message:
							" Please use someObject.allowedProperty instead.",
						allowedPropertiesMessage:
							" Only these properties are allowed: allowedProperty.",
					},
				},
			],
		},
		{
			code: "someObject.disallowedProperty; anotherObject.anotherDisallowedProperty()",
			options: [
				{
					object: "someObject",
					allowProperties: ["anotherDisallowedProperty"],
				},
				{
					object: "anotherObject",
					allowProperties: ["disallowedProperty"],
				},
			],
			errors: [
				{
					messageId: "restrictedObjectProperty",
					data: {
						objectName: "someObject",
						propertyName: "disallowedProperty",
						message: "",
						allowedPropertiesMessage:
							" Only these properties are allowed: anotherDisallowedProperty.",
					},
				},
				{
					messageId: "restrictedObjectProperty",
					data: {
						objectName: "anotherObject",
						propertyName: "anotherDisallowedProperty",
						message: "",
						allowedPropertiesMessage:
							" Only these properties are allowed: disallowedProperty.",
					},
				},
			],
		},
	],
});
