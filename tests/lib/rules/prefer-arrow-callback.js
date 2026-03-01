/**
 * @fileoverview Tests for prefer-arrow-callback rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/prefer-arrow-callback");
const RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const errors = [
	{
		messageId: "preferArrowCallback",
	},
];

const ruleTester = new RuleTester({
	languageOptions: { ecmaVersion: 2020, sourceType: "script" },
});

ruleTester.run("prefer-arrow-callback", rule, {
	valid: [
		"foo(a => a);",
		"foo(function*() {});",
		"foo(function() { this; });",
		{
			code: "foo(function bar() {});",
			options: [{ allowNamedFunctions: true }],
		},
		"foo(function() { (() => this); });",
		"foo(function() { this; }.bind(obj));",
		"foo(function() { this; }.call(this));",
		"foo(a => { (function() {}); });",
		"var foo = function foo() {};",
		"(function foo() {})();",
		"foo(function bar() { bar; });",
		"foo(function bar() { arguments; });",
		"foo(function bar() { arguments; }.bind(this));",
		"foo(function bar() { new.target; });",
		"foo(function bar() { new.target; }.bind(this));",
		"foo(function bar() { this; }.bind(this, somethingElse));",
		"foo((function() {}).bind.bar)",
		"foo((function() { this.bar(); }).bind(obj).bind(this))",
	],
	invalid: [
		{
			code: "foo(function bar() {});",
			output: "foo(() => {});",
			errors,
		},
		{
			code: "foo(function() {});",
			output: "foo(() => {});",
			options: [{ allowNamedFunctions: true }],
			errors,
		},
		{
			code: "foo(function bar() {});",
			output: "foo(() => {});",
			options: [{ allowNamedFunctions: false }],
			errors,
		},
		{
			code: "foo(function() {});",
			output: "foo(() => {});",
			errors,
		},
		{
			code: "foo(nativeCb || function() {});",
			output: "foo(nativeCb || (() => {}));",
			errors,
		},
		{
			code: "foo(bar ? function() {} : function() {});",
			output: "foo(bar ? () => {} : () => {});",
			errors: [errors[0], errors[0]],
		},
		{
			code: "foo(function() { (function() { this; }); });",
			output: "foo(() => { (function() { this; }); });",
			errors,
		},
		{
			code: "foo(function() { this; }.bind(this));",
			output: "foo(() => { this; });",
			errors,
		},
		{
			code: "foo(bar || function() { this; }.bind(this));",
			output: "foo(bar || (() => { this; }));",
			errors,
		},
		{
			code: "foo(function() { (() => this); }.bind(this));",
			output: "foo(() => { (() => this); });",
			errors,
		},
		{
			code: "foo(function bar(a) { a; });",
			output: "foo((a) => { a; });",
			errors,
		},
		{
			code: "foo(function(a) { a; });",
			output: "foo((a) => { a; });",
			errors,
		},
		{
			code: "foo(function(arguments) { arguments; });",
			output: "foo((arguments) => { arguments; });",
			errors,
		},
		{
			code: "foo(function() { this; });",
			output: null, // No fix applied
			options: [{ allowUnboundThis: false }],
			errors,
		},
		{
			code: "foo(function() { (() => this); });",
			output: null, // No fix applied
			options: [{ allowUnboundThis: false }],
			errors,
		},
		{
			code: "qux(function(foo, bar, baz) { return foo * 2; })",
			output: "qux((foo, bar, baz) => { return foo * 2; })",
			errors,
		},
		{
			code: "qux(function(foo, bar, baz) { return foo * bar; }.bind(this))",
			output: "qux((foo, bar, baz) => { return foo * bar; })",
			errors,
		},
		{
			code: "qux(function(foo, bar, baz) { return foo * this.qux; }.bind(this))",
			output: "qux((foo, bar, baz) => { return foo * this.qux; })",
			errors,
		},
		{
			code: "foo(function() {}.bind(this, somethingElse))",
			output: "foo((() => {}).bind(this, somethingElse))",
			errors,
		},
		{
			code: "qux(function(foo = 1, [bar = 2] = [], {qux: baz = 3} = {foo: 'bar'}) { return foo + bar; });",
			output: "qux((foo = 1, [bar = 2] = [], {qux: baz = 3} = {foo: 'bar'}) => { return foo + bar; });",
			errors,
		},
		{
			code: "qux(function(baz, baz) { })",
			output: null, // Duplicate parameter names are a SyntaxError in arrow functions
			errors,
		},
		{
			code: "qux(function( /* no params */ ) { })",
			output: "qux(( /* no params */ ) => { })",
			errors,
		},
		{
			code: "qux(function( /* a */ foo /* b */ , /* c */ bar /* d */ , /* e */ baz /* f */ ) { return foo; })",
			output: "qux(( /* a */ foo /* b */ , /* c */ bar /* d */ , /* e */ baz /* f */ ) => { return foo; })",
			errors,
		},
		{
			code: "qux(async function (foo = 1, bar = 2, baz = 3) { return baz; })",
			output: "qux(async (foo = 1, bar = 2, baz = 3) => { return baz; })",
			errors,
		},
		{
			code: "qux(async function (foo = 1, bar = 2, baz = 3) { return this; }.bind(this))",
			output: "qux(async (foo = 1, bar = 2, baz = 3) => { return this; })",
			errors,
		},
		{
			code: "foo((bar || function() {}).bind(this))",
			output: null,
			errors,
		},
		{
			code: "foo(function() {}.bind(this).bind(obj))",
			output: "foo((() => {}).bind(obj))",
			errors,
		},

		// Optional chaining
		{
			code: "foo?.(function() {});",
			output: "foo?.(() => {});",
			errors,
		},
		{
			code: "foo?.(function() { return this; }.bind(this));",
			output: "foo?.(() => { return this; });",
			errors,
		},
		{
			code: "foo(function() { return this; }?.bind(this));",
			output: "foo(() => { return this; });",
			errors,
		},
		{
			code: "foo((function() { return this; }?.bind)(this));",
			output: null,
			errors,
		},

		// https://github.com/eslint/eslint/issues/16718
		{
			code: `
            test(
                function ()
                { }
            );
            `,
			output: `
            test(
                () =>
                { }
            );
            `,
			errors,
		},
		{
			code: `
            test(
                function (
                    ...args
                ) /* Lorem ipsum
                dolor sit amet. */ {
                    return args;
                }
            );
            `,
			output: `
            test(
                (
                    ...args
                ) => /* Lorem ipsum
                dolor sit amet. */ {
                    return args;
                }
            );
            `,
			errors,
		},
	],
});

const ruleTesterTypeScript = new RuleTester({
	languageOptions: {
		parser: require("@typescript-eslint/parser"),
	},
});

ruleTesterTypeScript.run("prefer-arrow-callback", rule, {
	valid: [
		"foo(a => a);",
		"foo((a:string) => a);",
		"foo(function*() {});",
		"foo(function() { this; });",
		{
			code: "foo(function bar(a:string) {});",
			options: [{ allowNamedFunctions: true }],
		},
		"foo(function() { (() => this); });",
		"foo(function() { this; }.bind(obj));",
		"foo(function() { this; }.call(this));",
		"foo(a => { (function() {}); });",
		"var foo = function foo() {};",
		"(function foo() {})();",
		"foo(function bar() { bar; });",
		"foo(function bar() { arguments; });",
		"foo(function bar() { arguments; }.bind(this));",
		"foo(function bar() { new.target; });",
		"foo(function bar() { new.target; }.bind(this));",
		"foo(function bar() { this; }.bind(this, somethingElse));",
		"foo((function() {}).bind.bar)",
		"foo((function() { this.bar(); }).bind(obj).bind(this))",
		"test('clean', function (this: any) { this.foo = 'Cleaned!';});",
		"obj.test('clean', function (foo) { this.foo = 'Cleaned!'; });",
	],
	invalid: [
		{
			code: "foo(function bar() {});",
			output: "foo(() => {});",
			errors,
		},
		{
			code: "foo(function(a:string) {});",
			output: "foo((a:string) => {});",
			options: [{ allowNamedFunctions: true }],
			errors,
		},
		{
			code: "foo(function bar() {});",
			output: "foo(() => {});",
			options: [{ allowNamedFunctions: false }],
			errors,
		},
		{
			code: "foo(function() {});",
			output: "foo(() => {});",
			errors,
		},
		{
			code: "foo(nativeCb || function() {});",
			output: "foo(nativeCb || (() => {}));",
			errors,
		},
		{
			code: "foo(bar ? function() {} : function() {});",
			output: "foo(bar ? () => {} : () => {});",
			errors: [errors[0], errors[0]],
		},
		{
			code: "foo(function() { (function() { this; }); });",
			output: "foo(() => { (function() { this; }); });",
			errors,
		},
		{
			code: "foo(function() { this; }.bind(this));",
			output: "foo(() => { this; });",
			errors,
		},
		{
			code: "foo(bar || function() { this; }.bind(this));",
			output: "foo(bar || (() => { this; }));",
			errors,
		},
		{
			code: "foo(function() { (() => this); }.bind(this));",
			output: "foo(() => { (() => this); });",
			errors,
		},
		{
			code: "foo(function bar(a:string) { a; });",
			output: "foo((a:string) => { a; });",
			errors,
		},
		{
			code: "foo(function(a:any) { a; });",
			output: "foo((a:any) => { a; });",
			errors,
		},
		{
			code: "foo(function(arguments:any) { arguments; });",
			output: "foo((arguments:any) => { arguments; });",
			errors,
		},
		{
			code: "foo(function(a:string) { this; });",
			output: null, // No fix applied
			options: [{ allowUnboundThis: false }],
			errors,
		},
		{
			code: "foo(function() { (() => this); });",
			output: null, // No fix applied
			options: [{ allowUnboundThis: false }],
			errors,
		},
		{
			code: "qux(function(foo:string, bar:number, baz:string) { return foo * 2; })",
			output: "qux((foo:string, bar:number, baz:string) => { return foo * 2; })",
			errors,
		},
		{
			code: "qux(function(foo:number, bar:number, baz:number) { return foo * bar; }.bind(this))",
			output: "qux((foo:number, bar:number, baz:number) => { return foo * bar; })",
			errors,
		},
		{
			code: "qux(function(foo:any, bar:any, baz:any) { return foo * this.qux; }.bind(this))",
			output: "qux((foo:any, bar:any, baz:any) => { return foo * this.qux; })",
			errors,
		},
		{
			code: "foo(function() {}.bind(this, somethingElse))",
			output: "foo((() => {}).bind(this, somethingElse))",
			errors,
		},
		{
			code: "qux(function(foo = 1, [bar = 2] = [], {qux: baz = 3} = {foo: 'bar'}) { return foo + bar; });",
			output: "qux((foo = 1, [bar = 2] = [], {qux: baz = 3} = {foo: 'bar'}) => { return foo + bar; });",
			errors,
		},
		{
			code: "qux(function(baz:string, baz:string) { })",
			output: null, // Duplicate parameter names are a SyntaxError in arrow functions
			errors,
		},
		{
			code: "qux(function( /* no params */ ) { })",
			output: "qux(( /* no params */ ) => { })",
			errors,
		},
		{
			code: "qux(function( /* a */ foo:string /* b */ , /* c */ bar:string /* d */ , /* e */ baz:string /* f */ ) { return foo; })",
			output: "qux(( /* a */ foo:string /* b */ , /* c */ bar:string /* d */ , /* e */ baz:string /* f */ ) => { return foo; })",
			errors,
		},
		{
			code: "qux(async function (foo:number = 1, bar:number = 2, baz:number = 3) { return baz; })",
			output: "qux(async (foo:number = 1, bar:number = 2, baz:number = 3) => { return baz; })",
			errors,
		},
		{
			code: "qux(async function (foo:number = 1, bar:number = 2, baz:number = 3) { return this; }.bind(this))",
			output: "qux(async (foo:number = 1, bar:number = 2, baz:number = 3) => { return this; })",
			errors,
		},
		{
			code: "foo((bar || function() {}).bind(this))",
			output: null,
			errors,
		},
		{
			code: "foo(function() {}.bind(this).bind(obj))",
			output: "foo((() => {}).bind(obj))",
			errors,
		},

		// Optional chaining
		{
			code: "foo?.(function() {});",
			output: "foo?.(() => {});",
			errors,
		},
		{
			code: "foo?.(function() { return this; }.bind(this));",
			output: "foo?.(() => { return this; });",
			errors,
		},
		{
			code: "foo(function() { return this; }?.bind(this));",
			output: "foo(() => { return this; });",
			errors,
		},
		{
			code: "foo((function() { return this; }?.bind)(this));",
			output: null,
			errors,
		},

		// https://github.com/eslint/eslint/issues/16718
		{
			code: `
            test(
                function ()
                { }
            );
            `,
			output: `
            test(
                () =>
                { }
            );
            `,
			errors,
		},
		{
			code: `
            test(
                function (
                    ...args
                ) /* Lorem ipsum
                dolor sit amet. */ {
                    return args;
                }
            );
            `,
			output: `
            test(
                (
                    ...args
                ) => /* Lorem ipsum
                dolor sit amet. */ {
                    return args;
                }
            );
            `,
			errors,
		},
		{
			code: "foo(function():string { return 'foo' });",
			output: "foo(():string => { return 'foo' });",
			errors,
		},
		{
			code: "test('foo', function (this: any) {});",
			output: null,
			errors,
		},
	],
});
