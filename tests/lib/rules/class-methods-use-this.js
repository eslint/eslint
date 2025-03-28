/**
 * @fileoverview Tests for class-methods-use-this rule.
 * @author Patrick Williams
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/class-methods-use-this");
const RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("class-methods-use-this", rule, {
	valid: [
		{
			code: "class A { constructor() {} }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class A { foo() {this} }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class A { foo() {this.bar = 'bar';} }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class A { foo() {bar(this);} }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class A extends B { foo() {super.foo();} }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class A { foo() { if(true) { return this; } } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class A { static foo() {} }",
			languageOptions: { ecmaVersion: 6 },
		},
		{ code: "({ a(){} });", languageOptions: { ecmaVersion: 6 } },
		{
			code: "class A { foo() { () => this; } }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "({ a: function () {} });",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class A { foo() {this} bar() {} }",
			options: [{ exceptMethods: ["bar"] }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: 'class A { "foo"() { } }',
			options: [{ exceptMethods: ["foo"] }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class A { 42() { } }",
			options: [{ exceptMethods: ["42"] }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class A { foo = function() {this} }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class A { foo = () => {this} }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class A { foo = () => {super.toString} }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class A { static foo = function() {} }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class A { static foo = () => {} }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class A { #bar() {} }",
			options: [{ exceptMethods: ["#bar"] }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class A { foo = function () {} }",
			options: [{ enforceForClassFields: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class A { foo = () => {} }",
			options: [{ enforceForClassFields: false }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class A { foo() { return class { [this.foo] = 1 }; } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class A { static {} }",
			languageOptions: { ecmaVersion: 2022 },
		},
	],
	invalid: [
		{
			code: "class A { foo() {} }",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					type: "FunctionExpression",
					line: 1,
					column: 11,
					messageId: "missingThis",
					data: { name: "method 'foo'" },
				},
			],
		},
		{
			code: "class A { foo() {/**this**/} }",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					type: "FunctionExpression",
					line: 1,
					column: 11,
					messageId: "missingThis",
					data: { name: "method 'foo'" },
				},
			],
		},
		{
			code: "class A { foo() {var a = function () {this};} }",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					type: "FunctionExpression",
					line: 1,
					column: 11,
					messageId: "missingThis",
					data: { name: "method 'foo'" },
				},
			],
		},
		{
			code: "class A { foo() {var a = function () {var b = function(){this}};} }",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					type: "FunctionExpression",
					line: 1,
					column: 11,
					messageId: "missingThis",
					data: { name: "method 'foo'" },
				},
			],
		},
		{
			code: "class A { foo() {window.this} }",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					type: "FunctionExpression",
					line: 1,
					column: 11,
					messageId: "missingThis",
					data: { name: "method 'foo'" },
				},
			],
		},
		{
			code: "class A { foo() {that.this = 'this';} }",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					type: "FunctionExpression",
					line: 1,
					column: 11,
					messageId: "missingThis",
					data: { name: "method 'foo'" },
				},
			],
		},
		{
			code: "class A { foo() { () => undefined; } }",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					type: "FunctionExpression",
					line: 1,
					column: 11,
					messageId: "missingThis",
					data: { name: "method 'foo'" },
				},
			],
		},
		{
			code: "class A { foo() {} bar() {} }",
			options: [{ exceptMethods: ["bar"] }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					type: "FunctionExpression",
					line: 1,
					column: 11,
					messageId: "missingThis",
					data: { name: "method 'foo'" },
				},
			],
		},
		{
			code: "class A { foo() {} hasOwnProperty() {} }",
			options: [{ exceptMethods: ["foo"] }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					type: "FunctionExpression",
					line: 1,
					column: 20,
					messageId: "missingThis",
					data: { name: "method 'hasOwnProperty'" },
				},
			],
		},
		{
			code: "class A { [foo]() {} }",
			options: [{ exceptMethods: ["foo"] }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					type: "FunctionExpression",
					line: 1,
					column: 11,
					messageId: "missingThis",
					data: { name: "method" },
				},
			],
		},
		{
			code: "class A { #foo() { } foo() {} #bar() {} }",
			options: [{ exceptMethods: ["#foo"] }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					type: "FunctionExpression",
					line: 1,
					column: 22,
					messageId: "missingThis",
					data: { name: "method 'foo'" },
				},
				{
					type: "FunctionExpression",
					line: 1,
					column: 31,
					messageId: "missingThis",
					data: { name: "private method #bar" },
				},
			],
		},
		{
			code: "class A { foo(){} 'bar'(){} 123(){} [`baz`](){} [a](){} [f(a)](){} get quux(){} set[a](b){} *quuux(){} }",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "missingThis",
					data: { name: "method 'foo'" },
					type: "FunctionExpression",
					column: 11,
				},
				{
					messageId: "missingThis",
					data: { name: "method 'bar'" },
					type: "FunctionExpression",
					column: 19,
				},
				{
					messageId: "missingThis",
					data: { name: "method '123'" },
					type: "FunctionExpression",
					column: 29,
				},
				{
					messageId: "missingThis",
					data: { name: "method 'baz'" },
					type: "FunctionExpression",
					column: 37,
				},
				{
					messageId: "missingThis",
					data: { name: "method" },
					type: "FunctionExpression",
					column: 49,
				},
				{
					messageId: "missingThis",
					data: { name: "method" },
					type: "FunctionExpression",
					column: 57,
				},
				{
					messageId: "missingThis",
					data: { name: "getter 'quux'" },
					type: "FunctionExpression",
					column: 68,
				},
				{
					messageId: "missingThis",
					data: { name: "setter" },
					type: "FunctionExpression",
					column: 81,
				},
				{
					messageId: "missingThis",
					data: { name: "generator method 'quuux'" },
					type: "FunctionExpression",
					column: 93,
				},
			],
		},
		{
			code: "class A { foo = function() {} }",
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "missingThis",
					data: { name: "method 'foo'" },
					column: 11,
					endColumn: 25,
				},
			],
		},
		{
			code: "class A { foo = () => {} }",
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "missingThis",
					data: { name: "method 'foo'" },
					column: 11,
					endColumn: 17,
				},
			],
		},
		{
			code: "class A { #foo = function() {} }",
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "missingThis",
					data: { name: "private method #foo" },
					column: 11,
					endColumn: 26,
				},
			],
		},
		{
			code: "class A { #foo = () => {} }",
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "missingThis",
					data: { name: "private method #foo" },
					column: 11,
					endColumn: 18,
				},
			],
		},
		{
			code: "class A { #foo() {} }",
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "missingThis",
					data: { name: "private method #foo" },
					column: 11,
					endColumn: 15,
				},
			],
		},
		{
			code: "class A { get #foo() {} }",
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "missingThis",
					data: { name: "private getter #foo" },
					column: 11,
					endColumn: 19,
				},
			],
		},
		{
			code: "class A { set #foo(x) {} }",
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "missingThis",
					data: { name: "private setter #foo" },
					column: 11,
					endColumn: 19,
				},
			],
		},
		{
			code: "class A { foo () { return class { foo = this }; } }",
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "missingThis",
					data: { name: "method 'foo'" },
					column: 11,
					endColumn: 15,
				},
			],
		},
		{
			code: "class A { foo () { return function () { foo = this }; } }",
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "missingThis",
					data: { name: "method 'foo'" },
					column: 11,
					endColumn: 15,
				},
			],
		},
		{
			code: "class A { foo () { return class { static { this; } } } }",
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "missingThis",
					data: { name: "method 'foo'" },
					column: 11,
					endColumn: 15,
				},
			],
		},
	],
});

const ruleTesterTypeScript = new RuleTester({
	languageOptions: {
		parser: require("@typescript-eslint/parser"),
	},
});

ruleTesterTypeScript.run("class-methods-use-this", rule, {
	valid: [
		"class A { constructor() {} }",
		"class A { foo() {this} }",
		"class A { foo() {this.bar = 'bar';} }",
		"class A { foo() {bar(this);} }",
		"class A extends B { foo() {super.foo();} }",
		"class A { foo() { if(true) { return this; } } }",
		"class A { static foo() {} }",
		"({ a(){} });",
		"class A { foo() { () => this; } }",
		"({ a: function () {} });",
		{
			code: "class A { foo() {this} bar() {} }",
			options: [{ exceptMethods: ["bar"] }],
		},
		{
			code: 'class A { "foo"() { } }',
			options: [{ exceptMethods: ["foo"] }],
		},
		{ code: "class A { 42() { } }", options: [{ exceptMethods: ["42"] }] },
		"class A { foo = function() {this} }",
		"class A { foo = () => {this} }",
		"class A { foo = () => {super.toString} }",
		"class A { static foo = function() {} }",
		"class A { static foo = () => {} }",
		{
			code: "class A { #bar() {} }",
			options: [{ exceptMethods: ["#bar"] }],
		},
		{
			code: "class A { foo = function () {} }",
			options: [{ enforceForClassFields: false }],
		},
		{
			code: "class A { foo = () => {} }",
			options: [{ enforceForClassFields: false }],
		},
		{
			code: "class A { override foo = () => {} }",
			options: [{ enforceForClassFields: false }],
		},
		{
			code: "class Foo implements Bar { property = () => {} }",
			options: [{ enforceForClassFields: false }],
		},
		"class A { foo() { return class { [this.foo] = 1 }; } }",
		"class A { static {} }",
		{
			code: "class Foo { override method() {} }",
			options: [{ ignoreOverrideMethods: true }],
		},
		{
			code: "class Foo { private override method() {} }",
			options: [{ ignoreOverrideMethods: true }],
		},
		{
			code: "class Foo { protected override method() {} }",
			options: [{ ignoreOverrideMethods: true }],
		},
		{
			code: "class Foo { override accessor method = () => {} }",
			options: [{ ignoreOverrideMethods: true }],
		},
		{
			code: "class Foo { override get getter(): number {} }",
			options: [{ ignoreOverrideMethods: true }],
		},
		{
			code: "class Foo { private override get getter(): number {} }",
			options: [{ ignoreOverrideMethods: true }],
		},
		{
			code: "class Foo { protected override get getter(): number {} }",
			options: [{ ignoreOverrideMethods: true }],
		},
		{
			code: "class Foo { override set setter(v: number) {} }",
			options: [{ ignoreOverrideMethods: true }],
		},
		{
			code: "class Foo { private override set setter(v: number) {} }",
			options: [{ ignoreOverrideMethods: true }],
		},
		{
			code: "class Foo { protected override set setter(v: number) {} }",
			options: [{ ignoreOverrideMethods: true }],
		},
		{
			code: "class Foo implements Bar { override method() {} }",
			options: [
				{
					ignoreOverrideMethods: true,
					ignoreClassesWithImplements: "all",
				},
			],
		},
		{
			code: "class Foo implements Bar { private override method() {} }",
			options: [
				{
					ignoreOverrideMethods: true,
					ignoreClassesWithImplements: "public-fields",
				},
			],
		},
		{
			code: "class Foo implements Bar { protected override method() {} }",
			options: [
				{
					ignoreOverrideMethods: true,
					ignoreClassesWithImplements: "public-fields",
				},
			],
		},
		{
			code: "class Foo implements Bar { override get getter(): number {} }",
			options: [
				{
					ignoreOverrideMethods: true,
					ignoreClassesWithImplements: "all",
				},
			],
		},
		{
			code: "class Foo implements Bar { private override get getter(): number {} }",
			options: [
				{
					ignoreOverrideMethods: true,
					ignoreClassesWithImplements: "public-fields",
				},
			],
		},
		{
			code: "class Foo implements Bar { protected override get getter(): number {} }",
			options: [
				{
					ignoreOverrideMethods: true,
					ignoreClassesWithImplements: "public-fields",
				},
			],
		},
		{
			code: "class Foo implements Bar { override set setter(v: number) {} }",
			options: [
				{
					ignoreOverrideMethods: true,
					ignoreClassesWithImplements: "all",
				},
			],
		},
		{
			code: "class Foo implements Bar { private override set setter(v: number) {} }",
			options: [
				{
					ignoreOverrideMethods: true,
					ignoreClassesWithImplements: "public-fields",
				},
			],
		},
		{
			code: "class Foo implements Bar { protected override set setter(v: number) {} }",
			options: [
				{
					ignoreOverrideMethods: true,
					ignoreClassesWithImplements: "public-fields",
				},
			],
		},
		{
			code: "class Foo { override property = () => {} }",
			options: [{ ignoreOverrideMethods: true }],
		},
		{
			code: "class Foo { private override property = () => {} }",
			options: [{ ignoreOverrideMethods: true }],
		},
		{
			code: "class Foo { protected override property = () => {} }",
			options: [{ ignoreOverrideMethods: true }],
		},
		{
			code: "class Foo implements Bar { override property = () => {} }",
			options: [
				{
					ignoreOverrideMethods: true,
					ignoreClassesWithImplements: "all",
				},
			],
		},
		{
			code: "class Foo implements Bar { private override property = () => {} }",
			options: [
				{
					ignoreOverrideMethods: true,
					ignoreClassesWithImplements: "public-fields",
				},
			],
		},
		{
			code: "class Foo implements Bar { protected override property = () => {} }",
			options: [
				{
					ignoreOverrideMethods: true,
					ignoreClassesWithImplements: "public-fields",
				},
			],
		},
		{
			code: "class Foo implements Bar { method() {} }",
			options: [{ ignoreClassesWithImplements: "all" }],
		},
		{
			code: "class Foo implements Bar { accessor method = () => {} }",
			options: [{ ignoreClassesWithImplements: "all" }],
		},
		{
			code: "class Foo implements Bar { get getter() {} }",
			options: [{ ignoreClassesWithImplements: "all" }],
		},
		{
			code: "class Foo implements Bar { set setter() {} }",
			options: [{ ignoreClassesWithImplements: "all" }],
		},
		{
			code: "class Foo implements Bar { property = () => {} }",
			options: [{ ignoreClassesWithImplements: "all" }],
		},
	],
	invalid: [
		{
			code: `
  class Foo {
    method() {}
  }
        `,
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo {
    private method() {}
  }
        `,
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo {
    protected method() {}
  }
        `,
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Derived extends Base {
    override method() {}
  }
        `,
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Derived extends Base {
    property = () => {}
  }
        `,
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Derived extends Base {
    public property = () => {}
  }
        `,
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Derived extends Base {
    override property = () => {}
  }
        `,
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo {
    #method() {}
  }
        `,
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo {
    get getter(): number {}
  }
        `,
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo {
    private get getter(): number {}
  }
        `,
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo {
    protected get getter(): number {}
  }
        `,
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo {
    get #getter(): number {}
  }
        `,
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo {
    private set setter(b: number) {}
  }
        `,
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo {
    protected set setter(b: number) {}
  }
        `,
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo {
    set #setter(b: number) {}
  }
        `,
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},

		{
			code: `
  function fn() {
    this.foo = 303;

    class Foo {
      method() {}
    }
  }
        `,
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo {
    override method() {}
  }
        `,
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo {
    override get getter(): number {}
  }
        `,
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo {
    override set setter(v: number) {}
  }
        `,
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo implements Bar {
    override method() {}
  }
        `,
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo implements Bar {
    override get getter(): number {}
  }
        `,
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo implements Bar {
    override set setter(v: number) {}
  }
            `,
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo {
    override property = () => {};
  }
        `,
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo implements Bar {
    override property = () => {};
  }
        `,
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo implements Bar {
    method() {}
  }
        `,
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo implements Bar {
    #method() {}
  }
        `,
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo implements Bar {
    #method() {}
  }
        `,
			options: [
				{
					ignoreClassesWithImplements: "public-fields",
				},
			],
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo implements Bar {
    private method() {}
  }
        `,
			options: [
				{
					ignoreClassesWithImplements: "public-fields",
				},
			],
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo implements Bar {
    protected method() {}
  }
        `,
			options: [
				{
					ignoreClassesWithImplements: "public-fields",
				},
			],
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo implements Bar {
    get getter(): number {}
  }
        `,
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo implements Bar {
    get #getter(): number {}
  }
        `,
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo implements Bar {
    get #getter(): number {}
  }
        `,
			options: [
				{
					ignoreClassesWithImplements: "public-fields",
				},
			],
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo implements Bar {
    private get getter(): number {}
  }
        `,
			options: [
				{
					ignoreClassesWithImplements: "public-fields",
				},
			],
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo implements Bar {
    protected get getter(): number {}
  }
        `,
			options: [
				{
					ignoreClassesWithImplements: "public-fields",
				},
			],
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo implements Bar {
    set setter(v: number) {}
  }
        `,
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo implements Bar {
    set #setter(v: number) {}
  }
        `,
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo implements Bar {
    set #setter(v: number) {}
  }
        `,
			options: [
				{
					ignoreClassesWithImplements: "public-fields",
				},
			],
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo implements Bar {
    private set setter(v: number) {}
  }
        `,
			options: [
				{
					ignoreClassesWithImplements: "public-fields",
				},
			],
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo implements Bar {
    protected set setter(v: number) {}
  }
        `,
			options: [
				{
					ignoreClassesWithImplements: "public-fields",
				},
			],
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo implements Bar {
    property = () => {};
  }
        `,
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo implements Bar {
    #property = () => {};
  }
        `,
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo implements Bar {
    #property = () => {};
  }
        `,
			options: [
				{
					ignoreClassesWithImplements: "public-fields",
				},
			],
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo implements Bar {
    private property = () => {};
  }
        `,
			options: [
				{
					ignoreClassesWithImplements: "public-fields",
				},
			],
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
		{
			code: `
  class Foo implements Bar {
    protected property = () => {};
  }
        `,
			options: [
				{
					ignoreClassesWithImplements: "public-fields",
				},
			],
			errors: [
				{
					messageId: "missingThis",
				},
			],
		},
	],
});
