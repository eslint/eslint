/**
 * @fileoverview Tests for no-unused-vars rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-unused-vars"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
	languageOptions: {
		ecmaVersion: 5,
		sourceType: "script",
	},
	plugins: {
		custom: {
			rules: {
				"use-every-a": {
					create(context) {
						const sourceCode = context.sourceCode;

						/**
						 * Mark a variable as used
						 * @param {ASTNode} node The node representing the scope to search
						 * @returns {void}
						 * @private
						 */
						function useA(node) {
							sourceCode.markVariableAsUsed("a", node);
						}
						return {
							VariableDeclaration: useA,
							ReturnStatement: useA,
						};
					},
				},
			},
		},
	},
});

/**
 * Returns an expected error for defined-but-not-used variables.
 * @param {string} varName The name of the variable
 * @param {Array} suggestions The suggestions for the unused variable
 * @param {string} [additional] The additional text for the message data
 * @param {string} [type] The node type (defaults to "Identifier")
 * @returns {Object} An expected error object
 */
function definedError(
	varName,
	suggestions = [],
	additional = "",
	type = "Identifier",
) {
	return {
		messageId: "unusedVar",
		data: {
			varName,
			action: "defined",
			additional,
		},
		type,
		suggestions,
	};
}

/**
 * Returns an expected error for assigned-but-not-used variables.
 * @param {string} varName The name of the variable
 * @param {Array} suggestions The suggestions for the unused variable
 * @param {string} [additional] The additional text for the message data
 * @param {string} [type] The node type (defaults to "Identifier")
 * @returns {Object} An expected error object
 */
function assignedError(
	varName,
	suggestions = [],
	additional = "",
	type = "Identifier",
) {
	return {
		messageId: "unusedVar",
		data: {
			varName,
			action: "assigned a value",
			additional,
		},
		type,
		suggestions,
	};
}

/**
 * Returns an expected error for used-but-ignored variables.
 * @param {string} varName The name of the variable
 * @param {string} [additional] The additional text for the message data
 * @param {string} [type] The node type (defaults to "Identifier")
 * @returns {Object} An expected error object
 */
function usedIgnoredError(varName, additional = "", type = "Identifier") {
	return {
		messageId: "usedIgnoredVar",
		data: {
			varName,
			additional,
		},
		type,
	};
}

ruleTester.run("no-unused-vars", rule, {
	valid: [
		"var foo = 5;\n\nlabel: while (true) {\n  console.log(foo);\n  break label;\n}",
		"var foo = 5;\n\nwhile (true) {\n  console.log(foo);\n  break;\n}",
		{
			code: "for (let prop in box) {\n        box[prop] = parseInt(box[prop]);\n}",
			languageOptions: { ecmaVersion: 6 },
		},
		"var box = {a: 2};\n    for (var prop in box) {\n        box[prop] = parseInt(box[prop]);\n}",
		"f({ set foo(a) { return; } });",
		{ code: "a; var a;", options: ["all"] },
		{ code: "var a=10; alert(a);", options: ["all"] },
		{ code: "var a=10; (function() { alert(a); })();", options: ["all"] },
		{
			code: "var a=10; (function() { setTimeout(function() { alert(a); }, 0); })();",
			options: ["all"],
		},
		{ code: "var a=10; d[a] = 0;", options: ["all"] },
		{ code: "(function() { var a=10; return a; })();", options: ["all"] },
		{ code: "(function g() {})()", options: ["all"] },
		{ code: "function f(a) {alert(a);}; f();", options: ["all"] },
		{
			code: "var c = 0; function f(a){ var b = a; return b; }; f(c);",
			options: ["all"],
		},
		{ code: "function a(x, y){ return y; }; a();", options: ["all"] },
		{
			code: "var arr1 = [1, 2]; var arr2 = [3, 4]; for (var i in arr1) { arr1[i] = 5; } for (var i in arr2) { arr2[i] = 10; }",
			options: ["all"],
		},
		{ code: "var a=10;", options: ["local"] },
		{ code: 'var min = "min"; Math[min];', options: ["all"] },
		{ code: "Foo.bar = function(baz) { return baz; };", options: ["all"] },
		"myFunc(function foo() {}.bind(this))",
		"myFunc(function foo(){}.toString())",
		"function foo(first, second) {\ndoStuff(function() {\nconsole.log(second);});}; foo()",
		"(function() { var doSomething = function doSomething() {}; doSomething() }())",
		"/*global a */ a;",
		{
			code: "var a=10; (function() { alert(a); })();",
			options: [{ vars: "all" }],
		},
		{
			code: "function g(bar, baz) { return baz; }; g();",
			options: [{ vars: "all" }],
		},
		{
			code: "function g(bar, baz) { return baz; }; g();",
			options: [{ vars: "all", args: "after-used" }],
		},
		{
			code: "function g(bar, baz) { return bar; }; g();",
			options: [{ vars: "all", args: "none" }],
		},
		{
			code: "function g(bar, baz) { return 2; }; g();",
			options: [{ vars: "all", args: "none" }],
		},
		{
			code: "function g(bar, baz) { return bar + baz; }; g();",
			options: [{ vars: "local", args: "all" }],
		},
		{
			code: "var g = function(bar, baz) { return 2; }; g();",
			options: [{ vars: "all", args: "none" }],
		},
		"(function z() { z(); })();",
		{ code: " ", languageOptions: { globals: { a: true } } },
		{
			code: 'var who = "Paul";\nmodule.exports = `Hello ${who}!`;',
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "export var foo = 123;",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export function foo () {}",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "let toUpper = (partial) => partial.toUpperCase; export {toUpper}",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export class foo {}",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "class Foo{}; var x = new Foo(); x.foo()",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: 'const foo = "hello!";function bar(foobar = foo) {  foobar.replace(/!$/, " world!");}\nbar();',
			languageOptions: { ecmaVersion: 6 },
		},
		"function Foo(){}; var x = new Foo(); x.foo()",
		"function foo() {var foo = 1; return foo}; foo();",
		"function foo(foo) {return foo}; foo(1);",
		"function foo() {function foo() {return 1;}; return foo()}; foo();",
		{
			code: "function foo() {var foo = 1; return foo}; foo();",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo(foo) {return foo}; foo(1);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo() {function foo() {return 1;}; return foo()}; foo();",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const x = 1; const [y = x] = []; foo(y);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const x = 1; const {y = x} = {}; foo(y);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const x = 1; const {z: [y = x]} = {}; foo(y);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const x = []; const {z: [y] = x} = {}; foo(y);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const x = 1; let y; [y = x] = []; foo(y);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const x = 1; let y; ({z: [y = x]} = {}); foo(y);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const x = []; let y; ({z: [y] = x} = {}); foo(y);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const x = 1; function foo(y = x) { bar(y); } foo();",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const x = 1; function foo({y = x} = {}) { bar(y); } foo();",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const x = 1; function foo(y = function(z = x) { bar(z); }) { y(); } foo();",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const x = 1; function foo(y = function() { bar(x); }) { y(); } foo();",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = 1; var [y = x] = []; foo(y);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = 1; var {y = x} = {}; foo(y);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = 1; var {z: [y = x]} = {}; foo(y);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = []; var {z: [y] = x} = {}; foo(y);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = 1, y; [y = x] = []; foo(y);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = 1, y; ({z: [y = x]} = {}); foo(y);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = [], y; ({z: [y] = x} = {}); foo(y);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = 1; function foo(y = x) { bar(y); } foo();",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = 1; function foo({y = x} = {}) { bar(y); } foo();",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = 1; function foo(y = function(z = x) { bar(z); }) { y(); } foo();",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = 1; function foo(y = function() { bar(x); }) { y(); } foo();",
			languageOptions: { ecmaVersion: 6 },
		},

		// exported variables should work
		"/*exported toaster*/ var toaster = 'great'",
		"/*exported toaster, poster*/ var toaster = 1; poster = 0;",
		{
			code: "/*exported x*/ var { x } = y",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "/*exported x, y*/  var { x, y } = z",
			languageOptions: { ecmaVersion: 6 },
		},

		// Can mark variables as used via context.markVariableAsUsed()
		"/*eslint custom/use-every-a:1*/ var a;",
		"/*eslint custom/use-every-a:1*/ !function(a) { return 1; }",
		"/*eslint custom/use-every-a:1*/ !function() { var a; return 1 }",

		// ignore pattern
		{
			code: "var _a;",
			options: [{ vars: "all", varsIgnorePattern: "^_" }],
		},
		{
			code: "var a; function foo() { var _b; } foo();",
			options: [{ vars: "local", varsIgnorePattern: "^_" }],
		},
		{
			code: "function foo(_a) { } foo();",
			options: [{ args: "all", argsIgnorePattern: "^_" }],
		},
		{
			code: "function foo(a, _b) { return a; } foo();",
			options: [{ args: "after-used", argsIgnorePattern: "^_" }],
		},
		{
			code: "var [ firstItemIgnored, secondItem ] = items;\nconsole.log(secondItem);",
			options: [{ vars: "all", varsIgnorePattern: "[iI]gnored" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const [ a, _b, c ] = items;\nconsole.log(a+c);",
			options: [{ destructuredArrayIgnorePattern: "^_" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const [ [a, _b, c] ] = items;\nconsole.log(a+c);",
			options: [{ destructuredArrayIgnorePattern: "^_" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const { x: [_a, foo] } = bar;\nconsole.log(foo);",
			options: [{ destructuredArrayIgnorePattern: "^_" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function baz([_b, foo]) { foo; };\nbaz()",
			options: [{ destructuredArrayIgnorePattern: "^_" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function baz({x: [_b, foo]}) {foo};\nbaz()",
			options: [{ destructuredArrayIgnorePattern: "^_" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function baz([{x: [_b, foo]}]) {foo};\nbaz()",
			options: [{ destructuredArrayIgnorePattern: "^_" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: `
            let _a, b;
            foo.forEach(item => {
                [_a, b] = item;
                doSomething(b);
            });
            `,
			options: [{ destructuredArrayIgnorePattern: "^_" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: `
            // doesn't report _x
            let _x, y;
            _x = 1;
            [_x, y] = foo;
            y;

            // doesn't report _a
            let _a, b;
            [_a, b] = foo;
            _a = 1;
            b;
            `,
			options: [{ destructuredArrayIgnorePattern: "^_" }],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: `
            // doesn't report _x
            let _x, y;
            _x = 1;
            [_x, y] = foo;
            y;

            // doesn't report _a
            let _a, b;
            _a = 1;
            ({_a, ...b } = foo);
            b;
            `,
			options: [
				{
					destructuredArrayIgnorePattern: "^_",
					ignoreRestSiblings: true,
				},
			],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "try {} catch ([firstError]) {}",
			options: [{ destructuredArrayIgnorePattern: "Error$" }],
			languageOptions: { ecmaVersion: 2015 },
		},

		// for-in loops (see #2342)
		"(function(obj) { var name; for ( name in obj ) return; })({});",
		"(function(obj) { var name; for ( name in obj ) { return; } })({});",
		"(function(obj) { for ( var name in obj ) { return true } })({})",
		"(function(obj) { for ( var name in obj ) return true })({})",

		{
			code: "(function(obj) { let name; for ( name in obj ) return; })({});",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function(obj) { let name; for ( name in obj ) { return; } })({});",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function(obj) { for ( let name in obj ) { return true } })({})",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function(obj) { for ( let name in obj ) return true })({})",
			languageOptions: { ecmaVersion: 6 },
		},

		{
			code: "(function(obj) { for ( const name in obj ) { return true } })({})",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function(obj) { for ( const name in obj ) return true })({})",
			languageOptions: { ecmaVersion: 6 },
		},

		// For-of loops
		{
			code: "(function(iter) { let name; for ( name of iter ) return; })({});",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function(iter) { let name; for ( name of iter ) { return; } })({});",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function(iter) { for ( let name of iter ) { return true } })({})",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function(iter) { for ( let name of iter ) return true })({})",
			languageOptions: { ecmaVersion: 6 },
		},

		{
			code: "(function(iter) { for ( const name of iter ) { return true } })({})",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function(iter) { for ( const name of iter ) return true })({})",
			languageOptions: { ecmaVersion: 6 },
		},

		// Sequence Expressions (See https://github.com/eslint/eslint/issues/14325)
		{
			code: "let x = 0; foo = (0, x++);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "let x = 0; foo = (0, x += 1);",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "let x = 0; foo = (0, x = x + 1);",
			languageOptions: { ecmaVersion: 6 },
		},

		// caughtErrors
		{
			code: "try{}catch(err){}",
			options: [{ caughtErrors: "none" }],
		},
		{
			code: "try{}catch(err){console.error(err);}",
			options: [{ caughtErrors: "all" }],
		},
		{
			code: "try{}catch(ignoreErr){}",
			options: [{ caughtErrorsIgnorePattern: "^ignore" }],
		},
		{
			code: "try{}catch(ignoreErr){}",
			options: [
				{ caughtErrors: "all", caughtErrorsIgnorePattern: "^ignore" },
			],
		},
		{
			code: "try {} catch ({ message, stack }) {}",
			options: [{ caughtErrorsIgnorePattern: "message|stack" }],
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "try {} catch ({ errors: [firstError] }) {}",
			options: [{ caughtErrorsIgnorePattern: "Error$" }],
			languageOptions: { ecmaVersion: 2015 },
		},

		// caughtErrors with other combinations
		{
			code: "try{}catch(err){}",
			options: [{ caughtErrors: "none", vars: "all", args: "all" }],
		},

		// Using object rest for variable omission
		{
			code: "const data = { type: 'coords', x: 1, y: 2 };\nconst { type, ...coords } = data;\n console.log(coords);",
			options: [{ ignoreRestSiblings: true }],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "try {} catch ({ foo, ...bar }) { console.log(bar); }",
			options: [{ ignoreRestSiblings: true }],
			languageOptions: { ecmaVersion: 2018 },
		},

		// https://github.com/eslint/eslint/issues/6348
		"var a = 0, b; b = a = a + 1; foo(b);",
		"var a = 0, b; b = a += a + 1; foo(b);",
		"var a = 0, b; b = a++; foo(b);",
		"function foo(a) { var b = a = a + 1; bar(b) } foo();",
		"function foo(a) { var b = a += a + 1; bar(b) } foo();",
		"function foo(a) { var b = a++; bar(b) } foo();",

		// https://github.com/eslint/eslint/issues/6576
		[
			"var unregisterFooWatcher;",
			"// ...",
			'unregisterFooWatcher = $scope.$watch( "foo", function() {',
			"    // ...some code..",
			"    unregisterFooWatcher();",
			"});",
		].join("\n"),
		[
			"var ref;",
			"ref = setInterval(",
			"    function(){",
			"        clearInterval(ref);",
			"    }, 10);",
		].join("\n"),
		[
			"var _timer;",
			"function f() {",
			"    _timer = setTimeout(function () {}, _timer ? 100 : 0);",
			"}",
			"f();",
		].join("\n"),
		"function foo(cb) { cb = function() { function something(a) { cb(1 + a); } register(something); }(); } foo();",
		{
			code: "function* foo(cb) { cb = yield function(a) { cb(1 + a); }; } foo();",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "function foo(cb) { cb = tag`hello${function(a) { cb(1 + a); }}`; } foo();",
			languageOptions: { ecmaVersion: 6 },
		},
		"function foo(cb) { var b; cb = b = function(a) { cb(1 + a); }; b(); } foo();",

		// https://github.com/eslint/eslint/issues/6646
		[
			"function someFunction() {",
			"    var a = 0, i;",
			"    for (i = 0; i < 2; i++) {",
			"        a = myFunction(a);",
			"    }",
			"}",
			"someFunction();",
		].join("\n"),

		// https://github.com/eslint/eslint/issues/7124
		{
			code: "(function(a, b, {c, d}) { d })",
			options: [{ argsIgnorePattern: "c" }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function(a, b, {c, d}) { c })",
			options: [{ argsIgnorePattern: "d" }],
			languageOptions: { ecmaVersion: 6 },
		},

		// https://github.com/eslint/eslint/issues/7250
		{
			code: "(function(a, b, c) { c })",
			options: [{ argsIgnorePattern: "c" }],
		},
		{
			code: "(function(a, b, {c, d}) { c })",
			options: [{ argsIgnorePattern: "[cd]" }],
			languageOptions: { ecmaVersion: 6 },
		},

		// https://github.com/eslint/eslint/issues/7351
		{
			code: "(class { set foo(UNUSED) {} })",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class Foo { set bar(UNUSED) {} } console.log(Foo)",
			languageOptions: { ecmaVersion: 6 },
		},

		// https://github.com/eslint/eslint/issues/8119
		{
			code: "(({a, ...rest}) => rest)",
			options: [{ args: "all", ignoreRestSiblings: true }],
			languageOptions: { ecmaVersion: 2018 },
		},

		// https://github.com/eslint/eslint/issues/14163
		{
			code: "let foo, rest;\n({ foo, ...rest } = something);\nconsole.log(rest);",
			options: [{ ignoreRestSiblings: true }],
			languageOptions: { ecmaVersion: 2020 },
		},

		// https://github.com/eslint/eslint/issues/10952
		"/*eslint custom/use-every-a:1*/ !function(b, a) { return 1 }",

		// https://github.com/eslint/eslint/issues/10982
		"var a = function () { a(); }; a();",
		"var a = function(){ return function () { a(); } }; a();",
		{
			code: "const a = () => { a(); }; a();",
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "const a = () => () => { a(); }; a();",
			languageOptions: { ecmaVersion: 2015 },
		},

		// export * as ns from "source"
		{
			code: 'export * as ns from "source"',
			languageOptions: { ecmaVersion: 2020, sourceType: "module" },
		},

		// import.meta
		{
			code: "import.meta",
			languageOptions: { ecmaVersion: 2020, sourceType: "module" },
		},

		// https://github.com/eslint/eslint/issues/17299
		{
			code: "var a; a ||= 1;",
			languageOptions: { ecmaVersion: 2021 },
		},
		{
			code: "var a; a &&= 1;",
			languageOptions: { ecmaVersion: 2021 },
		},
		{
			code: "var a; a ??= 1;",
			languageOptions: { ecmaVersion: 2021 },
		},

		// ignore class with static initialization block https://github.com/eslint/eslint/issues/17772
		{
			code: "class Foo { static {} }",
			options: [{ ignoreClassWithStaticInitBlock: true }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class Foo { static {} }",
			options: [
				{
					ignoreClassWithStaticInitBlock: true,
					varsIgnorePattern: "^_",
				},
			],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class Foo { static {} }",
			options: [
				{
					ignoreClassWithStaticInitBlock: false,
					varsIgnorePattern: "^Foo",
				},
			],
			languageOptions: { ecmaVersion: 2022 },
		},

		// https://github.com/eslint/eslint/issues/17568
		{
			code: "const a = 5; const _c = a + 5;",
			options: [
				{
					args: "all",
					varsIgnorePattern: "^_",
					reportUsedIgnorePattern: true,
				},
			],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function foo(a, _b) { return a + 5 })(5)",
			options: [
				{
					args: "all",
					argsIgnorePattern: "^_",
					reportUsedIgnorePattern: true,
				},
			],
		},
		{
			code: "const [ a, _b, c ] = items;\nconsole.log(a+c);",
			options: [
				{
					destructuredArrayIgnorePattern: "^_",
					reportUsedIgnorePattern: true,
				},
			],
			languageOptions: { ecmaVersion: 6 },
		},
	],
	invalid: [
		{
			code: "function foox() { return foox(); }",
			errors: [
				definedError("foox", [
					{
						output: "",
						messageId: "removeVar",
						data: { varName: "foox" },
					},
				]),
			],
		},
		{
			code: "(function() { function foox() { if (true) { return foox(); } } }())",
			errors: [
				definedError("foox", [
					{
						output: "(function() {  }())",
						messageId: "removeVar",
						data: { varName: "foox" },
					},
				]),
			],
		},
		{
			code: "var a=10",
			errors: [
				assignedError("a", [
					{
						output: "",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
			],
		},
		{
			code: "function f() { var a = 1; return function(){ f(a *= 2); }; }",
			errors: [
				definedError("f", [
					{
						output: "",
						messageId: "removeVar",
						data: { varName: "f" },
					},
				]),
			],
		},
		{
			code: "function f() { var a = 1; return function(){ f(++a); }; }",
			errors: [
				definedError("f", [
					{
						output: "",
						messageId: "removeVar",
						data: { varName: "f" },
					},
				]),
			],
		},
		{
			code: "/*global a */",
			errors: [definedError("a", [], "", "Program")],
		},
		{
			code: "function foo(first, second) {\ndoStuff(function() {\nconsole.log(second);});}",
			errors: [
				definedError("foo", [
					{
						output: "",
						messageId: "removeVar",
						data: { varName: "foo" },
					},
				]),
			],
		},
		{
			code: "var a=10;",
			options: ["all"],
			errors: [
				assignedError("a", [
					{
						output: "",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
			],
		},
		{
			code: "var a=10; a=20;",
			options: ["all"],
			errors: [assignedError("a")],
		},
		{
			code: "var a=10; (function() { var a = 1; alert(a); })();",
			options: ["all"],
			errors: [
				assignedError("a", [
					{
						output: " (function() { var a = 1; alert(a); })();",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
			],
		},
		{
			code: "var a=10, b=0, c=null; alert(a+b)",
			options: ["all"],
			errors: [
				assignedError("c", [
					{
						output: "var a=10, b=0; alert(a+b)",
						messageId: "removeVar",
						data: { varName: "c" },
					},
				]),
			],
		},
		{
			code: "var a=10, b=0, c=null; setTimeout(function() { var b=2; alert(a+b+c); }, 0);",
			options: ["all"],
			errors: [
				assignedError("b", [
					{
						output: "var a=10, c=null; setTimeout(function() { var b=2; alert(a+b+c); }, 0);",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "var a=10, b=0, c=null; setTimeout(function() { var b=2; var c=2; alert(a+b+c); }, 0);",
			options: ["all"],
			errors: [
				assignedError("b", [
					{
						output: "var a=10, c=null; setTimeout(function() { var b=2; var c=2; alert(a+b+c); }, 0);",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
				assignedError("c", [
					{
						output: "var a=10, b=0; setTimeout(function() { var b=2; var c=2; alert(a+b+c); }, 0);",
						messageId: "removeVar",
						data: { varName: "c" },
					},
				]),
			],
		},
		{
			code: "function f(){var a=[];return a.map(function(){});}",
			options: ["all"],
			errors: [
				definedError("f", [
					{
						output: "",
						messageId: "removeVar",
						data: { varName: "f" },
					},
				]),
			],
		},
		{
			code: "function f(){var a=[];return a.map(function g(){});}",
			options: ["all"],
			errors: [
				definedError("f", [
					{
						output: "",
						messageId: "removeVar",
						data: { varName: "f" },
					},
				]),
			],
		},
		{
			code: "function foo() {function foo(x) {\nreturn x; }; return function() {return foo; }; }",
			errors: [
				{
					messageId: "unusedVar",
					data: { varName: "foo", action: "defined", additional: "" },
					line: 1,
					type: "Identifier",
					suggestions: [
						{
							output: "",
							messageId: "removeVar",
							data: { varName: "foo" },
						},
					],
				},
			],
		},
		{
			code: "function f(){var x;function a(){x=42;}function b(){alert(x);}}",
			options: ["all"],
			errors: [
				definedError("f", [
					{
						output: "",
						messageId: "removeVar",
						data: { varName: "f" },
					},
				]),
				definedError("a", [
					{
						output: "function f(){var x;function b(){alert(x);}}",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
				definedError("b", [
					{
						output: "function f(){var x;function a(){x=42;}}",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "function f(a) {}; f();",
			options: ["all"],
			errors: [
				definedError("a", [
					{
						output: "function f() {}; f();",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
			],
		},
		{
			code: "function a(x, y, z){ return y; }; a();",
			options: ["all"],
			errors: [
				definedError("z", [
					{
						output: "function a(x, y){ return y; }; a();",
						messageId: "removeVar",
						data: { varName: "z" },
					},
				]),
			],
		},
		{
			code: "var min = Math.min",
			options: ["all"],
			errors: [
				assignedError("min", [
					{
						output: "",
						messageId: "removeVar",
						data: { varName: "min" },
					},
				]),
			],
		},
		{
			code: "var min = {min: 1}",
			options: ["all"],
			errors: [
				assignedError("min", [
					{
						output: "",
						messageId: "removeVar",
						data: { varName: "min" },
					},
				]),
			],
		},
		{
			code: "Foo.bar = function(baz) { return 1; }",
			options: ["all"],
			errors: [
				definedError("baz", [
					{
						output: "Foo.bar = function() { return 1; }",
						messageId: "removeVar",
						data: { varName: "baz" },
					},
				]),
			],
		},
		{
			code: "var min = {min: 1}",
			options: [{ vars: "all" }],
			errors: [
				assignedError("min", [
					{
						output: "",
						messageId: "removeVar",
						data: { varName: "min" },
					},
				]),
			],
		},
		{
			code: "function gg(baz, bar) { return baz; }; gg();",
			options: [{ vars: "all" }],
			errors: [
				definedError("bar", [
					{
						output: "function gg(baz) { return baz; }; gg();",
						messageId: "removeVar",
						data: { varName: "bar" },
					},
				]),
			],
		},
		{
			code: "(function(foo, baz, bar) { return baz; })();",
			options: [{ vars: "all", args: "after-used" }],
			errors: [
				definedError("bar", [
					{
						output: "(function(foo, baz) { return baz; })();",
						messageId: "removeVar",
						data: { varName: "bar" },
					},
				]),
			],
		},
		{
			code: "(function(foo, baz, bar) { return baz; })();",
			options: [{ vars: "all", args: "all" }],
			errors: [
				definedError("foo", [
					{
						output: "(function( baz, bar) { return baz; })();",
						messageId: "removeVar",
						data: { varName: "foo" },
					},
				]),
				definedError("bar", [
					{
						output: "(function(foo, baz) { return baz; })();",
						messageId: "removeVar",
						data: { varName: "bar" },
					},
				]),
			],
		},
		{
			code: "(function z(foo) { var bar = 33; })();",
			options: [{ vars: "all", args: "all" }],
			errors: [
				definedError("foo", [
					{
						output: "(function z() { var bar = 33; })();",
						messageId: "removeVar",
						data: { varName: "foo" },
					},
				]),
				assignedError("bar", [
					{
						output: "(function z(foo) {  })();",
						messageId: "removeVar",
						data: { varName: "bar" },
					},
				]),
			],
		},
		{
			code: "(function z(foo) { z(); })();",
			options: [{}],
			errors: [
				definedError("foo", [
					{
						output: "(function z() { z(); })();",
						messageId: "removeVar",
						data: { varName: "foo" },
					},
				]),
			],
		},
		{
			code: "function f() { var a = 1; return function(){ f(a = 2); }; }",
			options: [{}],
			errors: [
				definedError("f", [
					{
						output: "",
						messageId: "removeVar",
						data: { varName: "f" },
					},
				]),
				assignedError("a"),
			],
		},
		{
			code: 'import x from "y";',
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			errors: [
				definedError("x", [
					{
						output: 'import "y";',
						messageId: "removeVar",
						data: { varName: "x" },
					},
				]),
			],
		},
		{
			code: "export function fn2({ x, y }) {\n console.log(x); \n};",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			errors: [
				definedError("y", [
					{
						output: "export function fn2({ x }) {\n console.log(x); \n};",
						messageId: "removeVar",
						data: { varName: "y" },
					},
				]),
			],
		},
		{
			code: "export function fn2( x, y ) {\n console.log(x); \n};",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			errors: [
				definedError("y", [
					{
						output: "export function fn2( x ) {\n console.log(x); \n};",
						messageId: "removeVar",
						data: { varName: "y" },
					},
				]),
			],
		},

		// exported
		{
			code: "/*exported max*/ var max = 1, min = {min: 1}",
			errors: [
				assignedError("min", [
					{
						output: "/*exported max*/ var max = 1",
						messageId: "removeVar",
						data: { varName: "min" },
					},
				]),
			],
		},
		{
			code: "/*exported x*/ var { x, y } = z",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				assignedError("y", [
					{
						output: "/*exported x*/ var { x } = z",
						messageId: "removeVar",
						data: { varName: "y" },
					},
				]),
			],
		},

		// ignore pattern
		{
			code: "var _a; var b;",
			options: [{ vars: "all", varsIgnorePattern: "^_" }],
			errors: [
				{
					line: 1,
					column: 13,
					messageId: "unusedVar",
					data: {
						varName: "b",
						action: "defined",
						additional: ". Allowed unused vars must match /^_/u",
					},
					suggestions: [
						{
							output: "var _a; ",
							messageId: "removeVar",
							data: { varName: "b" },
						},
					],
				},
			],
		},
		{
			code: "var a; function foo() { var _b; var c_; } foo();",
			options: [{ vars: "local", varsIgnorePattern: "^_" }],
			errors: [
				{
					line: 1,
					column: 37,
					messageId: "unusedVar",
					data: {
						varName: "c_",
						action: "defined",
						additional: ". Allowed unused vars must match /^_/u",
					},
					suggestions: [
						{
							output: "var a; function foo() { var _b;  } foo();",
							messageId: "removeVar",
							data: { varName: "c_" },
						},
					],
				},
			],
		},
		{
			code: "function foo(a, _b) { } foo();",
			options: [{ args: "all", argsIgnorePattern: "^_" }],
			errors: [
				{
					line: 1,
					column: 14,
					messageId: "unusedVar",
					data: {
						varName: "a",
						action: "defined",
						additional: ". Allowed unused args must match /^_/u",
					},
					suggestions: [
						{
							output: "function foo( _b) { } foo();",
							messageId: "removeVar",
							data: { varName: "a" },
						},
					],
				},
			],
		},
		{
			code: "function foo(a, _b, c) { return a; } foo();",
			options: [{ args: "after-used", argsIgnorePattern: "^_" }],
			errors: [
				{
					line: 1,
					column: 21,
					messageId: "unusedVar",
					data: {
						varName: "c",
						action: "defined",
						additional: ". Allowed unused args must match /^_/u",
					},
					suggestions: [
						{
							output: "function foo(a, _b) { return a; } foo();",
							messageId: "removeVar",
							data: { varName: "c" },
						},
					],
				},
			],
		},
		{
			code: "function foo(_a) { } foo();",
			options: [{ args: "all", argsIgnorePattern: "[iI]gnored" }],
			errors: [
				{
					line: 1,
					column: 14,
					messageId: "unusedVar",
					data: {
						varName: "_a",
						action: "defined",
						additional:
							". Allowed unused args must match /[iI]gnored/u",
					},
					suggestions: [
						{
							output: "function foo() { } foo();",
							messageId: "removeVar",
							data: { varName: "_a" },
						},
					],
				},
			],
		},
		{
			code: "var [ firstItemIgnored, secondItem ] = items;",
			options: [{ vars: "all", varsIgnorePattern: "[iI]gnored" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					line: 1,
					column: 25,
					messageId: "unusedVar",
					data: {
						varName: "secondItem",
						action: "assigned a value",
						additional:
							". Allowed unused vars must match /[iI]gnored/u",
					},
					suggestions: [
						{
							output: "var [ firstItemIgnored ] = items;",
							messageId: "removeVar",
							data: { varName: "secondItem" },
						},
					],
				},
			],
		},

		// https://github.com/eslint/eslint/issues/15611
		{
			code: "const array = ['a', 'b', 'c']; const [a, _b, c] = array; const newArray = [a, c];",
			options: [{ destructuredArrayIgnorePattern: "^_" }],
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				// should report only `newArray`
				{
					...assignedError("newArray", [
						{
							output: "const array = ['a', 'b', 'c']; const [a, _b, c] = array; ",
							messageId: "removeVar",
							data: { varName: "newArray" },
						},
					]),
				},
			],
		},
		{
			code: "const array = ['a', 'b', 'c', 'd', 'e']; const [a, _b, c] = array;",
			options: [{ destructuredArrayIgnorePattern: "^_" }],
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					...assignedError(
						"a",
						[
							{
								output: "const array = ['a', 'b', 'c', 'd', 'e']; const [, _b, c] = array;",
								messageId: "removeVar",
								data: { varName: "a" },
							},
						],
						". Allowed unused elements of array destructuring must match /^_/u",
					),
					line: 1,
					column: 49,
				},
				{
					...assignedError(
						"c",
						[
							{
								output: "const array = ['a', 'b', 'c', 'd', 'e']; const [a, _b] = array;",
								messageId: "removeVar",
								data: { varName: "c" },
							},
						],
						". Allowed unused elements of array destructuring must match /^_/u",
					),
					line: 1,
					column: 56,
				},
			],
		},
		{
			code: "const array = ['a', 'b', 'c'];\nconst [a, _b, c] = array;\nconst fooArray = ['foo'];\nconst barArray = ['bar'];\nconst ignoreArray = ['ignore'];",
			options: [
				{
					destructuredArrayIgnorePattern: "^_",
					varsIgnorePattern: "ignore",
				},
			],
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					...assignedError(
						"a",
						[
							{
								output: "const array = ['a', 'b', 'c'];\nconst [, _b, c] = array;\nconst fooArray = ['foo'];\nconst barArray = ['bar'];\nconst ignoreArray = ['ignore'];",
								messageId: "removeVar",
								data: { varName: "a" },
							},
						],
						". Allowed unused elements of array destructuring must match /^_/u",
					),
					line: 2,
					column: 8,
				},
				{
					...assignedError(
						"c",
						[
							{
								output: "const array = ['a', 'b', 'c'];\nconst [a, _b] = array;\nconst fooArray = ['foo'];\nconst barArray = ['bar'];\nconst ignoreArray = ['ignore'];",
								messageId: "removeVar",
								data: { varName: "c" },
							},
						],
						". Allowed unused elements of array destructuring must match /^_/u",
					),
					line: 2,
					column: 15,
				},
				{
					...assignedError(
						"fooArray",
						[
							{
								output: "const array = ['a', 'b', 'c'];\nconst [a, _b, c] = array;\n\nconst barArray = ['bar'];\nconst ignoreArray = ['ignore'];",
								messageId: "removeVar",
								data: { varName: "fooArray" },
							},
						],
						". Allowed unused vars must match /ignore/u",
					),
					line: 3,
					column: 7,
				},
				{
					...assignedError(
						"barArray",
						[
							{
								output: "const array = ['a', 'b', 'c'];\nconst [a, _b, c] = array;\nconst fooArray = ['foo'];\n\nconst ignoreArray = ['ignore'];",
								messageId: "removeVar",
								data: { varName: "barArray" },
							},
						],
						". Allowed unused vars must match /ignore/u",
					),
					line: 4,
					column: 7,
				},
			],
		},
		{
			code: "const array = [obj]; const [{_a, foo}] = array; console.log(foo);",
			options: [{ destructuredArrayIgnorePattern: "^_" }],
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					...assignedError("_a", [
						{
							output: "const array = [obj]; const [{ foo}] = array; console.log(foo);",
							messageId: "removeVar",
							data: { varName: "_a" },
						},
					]),
					line: 1,
					column: 30,
				},
			],
		},
		{
			code: "function foo([{_a, bar}]) {bar;}foo();",
			options: [{ destructuredArrayIgnorePattern: "^_" }],
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					...definedError("_a", [
						{
							output: "function foo([{ bar}]) {bar;}foo();",
							messageId: "removeVar",
							data: { varName: "_a" },
						},
					]),
					line: 1,
					column: 16,
				},
			],
		},
		{
			code: "let _a, b; foo.forEach(item => { [a, b] = item; });",
			options: [{ destructuredArrayIgnorePattern: "^_" }],
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					...definedError("_a", [
						{
							output: "let  b; foo.forEach(item => { [a, b] = item; });",
							messageId: "removeVar",
							data: { varName: "_a" },
						},
					]),
					line: 1,
					column: 5,
				},
				{
					...assignedError("b"),
					line: 1,
					column: 9,
				},
			],
		},

		// for-in loops (see #2342)
		{
			code: "(function(obj) { var name; for ( name in obj ) { i(); return; } })({});",
			errors: [
				{
					line: 1,
					column: 34,
					messageId: "unusedVar",
					data: {
						varName: "name",
						action: "assigned a value",
						additional: "",
					},
				},
			],
		},
		{
			code: "(function(obj) { var name; for ( name in obj ) { } })({});",
			errors: [
				{
					line: 1,
					column: 34,
					messageId: "unusedVar",
					data: {
						varName: "name",
						action: "assigned a value",
						additional: "",
					},
				},
			],
		},
		{
			code: "(function(obj) { for ( var name in obj ) { } })({});",
			errors: [
				{
					line: 1,
					column: 28,
					messageId: "unusedVar",
					data: {
						varName: "name",
						action: "assigned a value",
						additional: "",
					},
				},
			],
		},
		{
			code: "for ( var { foo } in bar ) { }",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					line: 1,
					column: 13,
					messageId: "unusedVar",
					data: {
						varName: "foo",
						action: "assigned a value",
						additional: "",
					},
				},
			],
		},
		{
			code: "for ( var [ foo ] in bar ) { }",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					line: 1,
					column: 13,
					messageId: "unusedVar",
					data: {
						varName: "foo",
						action: "assigned a value",
						additional: "",
					},
				},
			],
		},

		// For-of loops
		{
			code: "(function(iter) { var name; for ( name of iter ) { i(); return; } })({});",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					line: 1,
					column: 35,
					messageId: "unusedVar",
					data: {
						varName: "name",
						action: "assigned a value",
						additional: "",
					},
				},
			],
		},
		{
			code: "(function(iter) { var name; for ( name of iter ) { } })({});",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					line: 1,
					column: 35,
					messageId: "unusedVar",
					data: {
						varName: "name",
						action: "assigned a value",
						additional: "",
					},
				},
			],
		},
		{
			code: "(function(iter) { for ( var name of iter ) { } })({});",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					line: 1,
					column: 29,
					messageId: "unusedVar",
					data: {
						varName: "name",
						action: "assigned a value",
						additional: "",
					},
				},
			],
		},
		{
			code: "for ( var { foo } of bar ) { }",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					line: 1,
					column: 13,
					messageId: "unusedVar",
					data: {
						varName: "foo",
						action: "assigned a value",
						additional: "",
					},
				},
			],
		},
		{
			code: "for ( var [ foo ] of bar ) { }",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					line: 1,
					column: 13,
					messageId: "unusedVar",
					data: {
						varName: "foo",
						action: "assigned a value",
						additional: "",
					},
				},
			],
		},

		// https://github.com/eslint/eslint/issues/3617
		{
			code: "\n/* global foobar, foo, bar */\nfoobar;",
			errors: [
				{
					line: 2,
					endLine: 2,
					column: 19,
					endColumn: 22,
					messageId: "unusedVar",
					data: {
						varName: "foo",
						action: "defined",
						additional: "",
					},
				},
				{
					line: 2,
					endLine: 2,
					column: 24,
					endColumn: 27,
					messageId: "unusedVar",
					data: {
						varName: "bar",
						action: "defined",
						additional: "",
					},
				},
			],
		},
		{
			code: "\n/* global foobar,\n   foo,\n   bar\n */\nfoobar;",
			errors: [
				{
					line: 3,
					column: 4,
					endLine: 3,
					endColumn: 7,
					messageId: "unusedVar",
					data: {
						varName: "foo",
						action: "defined",
						additional: "",
					},
				},
				{
					line: 4,
					column: 4,
					endLine: 4,
					endColumn: 7,
					messageId: "unusedVar",
					data: {
						varName: "bar",
						action: "defined",
						additional: "",
					},
				},
			],
		},

		// Rest property sibling without ignoreRestSiblings
		{
			code: "const data = { type: 'coords', x: 1, y: 2 };\nconst { type, ...coords } = data;\n console.log(coords);",
			languageOptions: { ecmaVersion: 2018 },
			errors: [
				{
					line: 2,
					column: 9,
					messageId: "unusedVar",
					data: {
						varName: "type",
						action: "assigned a value",
						additional: "",
					},
					suggestions: [
						{
							output: "const data = { type: 'coords', x: 1, y: 2 };\nconst {  ...coords } = data;\n console.log(coords);",
							messageId: "removeVar",
							data: { varName: "type" },
						},
					],
				},
			],
		},

		// Unused rest property with ignoreRestSiblings
		{
			code: "const data = { type: 'coords', x: 2, y: 2 };\nconst { type, ...coords } = data;\n console.log(type)",
			options: [{ ignoreRestSiblings: true }],
			languageOptions: { ecmaVersion: 2018 },
			errors: [
				{
					line: 2,
					column: 18,
					messageId: "unusedVar",
					data: {
						varName: "coords",
						action: "assigned a value",
						additional: "",
					},
					suggestions: [
						{
							output: "const data = { type: 'coords', x: 2, y: 2 };\nconst { type } = data;\n console.log(type)",
							messageId: "removeVar",
							data: { varName: "coords" },
						},
					],
				},
			],
		},
		{
			code: "let type, coords;\n({ type, ...coords } = data);\n console.log(type)",
			options: [{ ignoreRestSiblings: true }],
			languageOptions: { ecmaVersion: 2018 },
			errors: [
				{
					line: 2,
					column: 13,
					messageId: "unusedVar",
					data: {
						varName: "coords",
						action: "assigned a value",
						additional: "",
					},
				},
			],
		},

		// Unused rest property without ignoreRestSiblings
		{
			code: "const data = { type: 'coords', x: 3, y: 2 };\nconst { type, ...coords } = data;\n console.log(type)",
			languageOptions: { ecmaVersion: 2018 },
			errors: [
				{
					line: 2,
					column: 18,
					messageId: "unusedVar",
					data: {
						varName: "coords",
						action: "assigned a value",
						additional: "",
					},
					suggestions: [
						{
							output: "const data = { type: 'coords', x: 3, y: 2 };\nconst { type } = data;\n console.log(type)",
							messageId: "removeVar",
							data: { varName: "coords" },
						},
					],
				},
			],
		},

		// Nested array destructuring with rest property
		{
			code: "const data = { vars: ['x','y'], x: 1, y: 2 };\nconst { vars: [x], ...coords } = data;\n console.log(coords)",
			languageOptions: { ecmaVersion: 2018 },
			errors: [
				{
					line: 2,
					column: 16,
					messageId: "unusedVar",
					data: {
						varName: "x",
						action: "assigned a value",
						additional: "",
					},
					suggestions: [
						{
							output: "const data = { vars: ['x','y'], x: 1, y: 2 };\nconst {  ...coords } = data;\n console.log(coords)",
							messageId: "removeVar",
							data: { varName: "x" },
						},
					],
				},
			],
		},

		// Nested object destructuring with rest property
		{
			code: "const data = { defaults: { x: 0 }, x: 1, y: 2 };\nconst { defaults: { x }, ...coords } = data;\n console.log(coords)",
			languageOptions: { ecmaVersion: 2018 },
			errors: [
				{
					line: 2,
					column: 21,
					messageId: "unusedVar",
					data: {
						varName: "x",
						action: "assigned a value",
						additional: "",
					},
					suggestions: [
						{
							output: "const data = { defaults: { x: 0 }, x: 1, y: 2 };\nconst {  ...coords } = data;\n console.log(coords)",
							messageId: "removeVar",
							data: { varName: "x" },
						},
					],
				},
			],
		},

		// https://github.com/eslint/eslint/issues/8119
		{
			code: "(({a, ...rest}) => {})",
			options: [{ args: "all", ignoreRestSiblings: true }],
			languageOptions: { ecmaVersion: 2018 },
			errors: [
				definedError("rest", [
					{
						output: "(({a}) => {})",
						messageId: "removeVar",
						data: { varName: "rest" },
					},
				]),
			],
		},

		// https://github.com/eslint/eslint/issues/3714
		{
			code: "/* global a$fooz,$foo */\na$fooz;",
			errors: [
				{
					line: 1,
					column: 18,
					endLine: 1,
					endColumn: 22,
					messageId: "unusedVar",
					data: {
						varName: "$foo",
						action: "defined",
						additional: "",
					},
				},
			],
		},
		{
			code: "/* globals a$fooz, $ */\na$fooz;",
			errors: [
				{
					line: 1,
					column: 20,
					endLine: 1,
					endColumn: 21,
					messageId: "unusedVar",
					data: {
						varName: "$",
						action: "defined",
						additional: "",
					},
				},
			],
		},
		{
			code: "/*globals $foo*/",
			errors: [
				{
					line: 1,
					column: 11,
					endLine: 1,
					endColumn: 15,
					messageId: "unusedVar",
					data: {
						varName: "$foo",
						action: "defined",
						additional: "",
					},
				},
			],
		},
		{
			code: "/* global global*/",
			errors: [
				{
					line: 1,
					column: 11,
					endLine: 1,
					endColumn: 17,
					messageId: "unusedVar",
					data: {
						varName: "global",
						action: "defined",
						additional: "",
					},
				},
			],
		},
		{
			code: "/*global foo:true*/",
			errors: [
				{
					line: 1,
					column: 10,
					endLine: 1,
					endColumn: 13,
					messageId: "unusedVar",
					data: {
						varName: "foo",
						action: "defined",
						additional: "",
					},
				},
			],
		},

		// non ascii.
		{
			code: "/*global 変数, 数*/\n変数;",
			errors: [
				{
					line: 1,
					column: 14,
					endLine: 1,
					endColumn: 15,
					messageId: "unusedVar",
					data: {
						varName: "数",
						action: "defined",
						additional: "",
					},
				},
			],
		},

		// surrogate pair.
		{
			code: "/*global 𠮷𩸽, 𠮷*/\n\\u{20BB7}\\u{29E3D};",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					line: 1,
					column: 16,
					endLine: 1,
					endColumn: 18,
					messageId: "unusedVar",
					data: {
						varName: "𠮷",
						action: "defined",
						additional: "",
					},
				},
			],
		},

		// https://github.com/eslint/eslint/issues/4047
		{
			code: "export default function(a) {}",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			errors: [
				definedError("a", [
					{
						output: "export default function() {}",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
			],
		},
		{
			code: "export default function(a, b) { console.log(a); }",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			errors: [
				definedError("b", [
					{
						output: "export default function(a) { console.log(a); }",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "export default (function(a) {});",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			errors: [
				definedError("a", [
					{
						output: "export default (function() {});",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
			],
		},
		{
			code: "export default (function(a, b) { console.log(a); });",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			errors: [
				definedError("b", [
					{
						output: "export default (function(a) { console.log(a); });",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "export default (a) => {};",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			errors: [
				definedError("a", [
					{
						output: "export default () => {};",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
			],
		},
		{
			code: "export default (a, b) => { console.log(a); };",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			errors: [
				definedError("b", [
					{
						output: "export default (a) => { console.log(a); };",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},

		// caughtErrors
		{
			code: "try{}catch(err){};",
			errors: [definedError("err")],
		},
		{
			code: "try{}catch(err){};",
			options: [{ caughtErrors: "all" }],
			errors: [definedError("err")],
		},
		{
			code: "try{}catch(err){};",
			options: [
				{ caughtErrors: "all", caughtErrorsIgnorePattern: "^ignore" },
			],
			errors: [
				definedError(
					"err",
					[],
					". Allowed unused caught errors must match /^ignore/u",
				),
			],
		},
		{
			code: "try{}catch(err){};",
			options: [{ caughtErrors: "all", varsIgnorePattern: "^err" }],
			errors: [definedError("err")],
		},
		{
			code: "try{}catch(err){};",
			options: [{ caughtErrors: "all", varsIgnorePattern: "^." }],
			errors: [definedError("err")],
		},

		// multiple try catch with one success
		{
			code: "try{}catch(ignoreErr){}try{}catch(err){};",
			options: [
				{ caughtErrors: "all", caughtErrorsIgnorePattern: "^ignore" },
			],
			errors: [
				definedError(
					"err",
					[],
					". Allowed unused caught errors must match /^ignore/u",
				),
			],
		},

		// multiple try catch both fail
		{
			code: "try{}catch(error){}try{}catch(err){};",
			options: [
				{ caughtErrors: "all", caughtErrorsIgnorePattern: "^ignore" },
			],
			errors: [
				definedError(
					"error",
					[],
					". Allowed unused caught errors must match /^ignore/u",
				),
				definedError(
					"err",
					[],
					". Allowed unused caught errors must match /^ignore/u",
				),
			],
		},

		// caughtErrors with other configs
		{
			code: "try{}catch(err){};",
			options: [{ vars: "all", args: "all", caughtErrors: "all" }],
			errors: [definedError("err")],
		},

		// no conflict in ignore patterns
		{
			code: "try{}catch(err){};",
			options: [
				{
					vars: "all",
					args: "all",
					caughtErrors: "all",
					argsIgnorePattern: "^er",
				},
			],
			errors: [definedError("err")],
		},

		// Ignore reads for modifications to itself: https://github.com/eslint/eslint/issues/6348
		{ code: "var a = 0; a = a + 1;", errors: [assignedError("a")] },
		{ code: "var a = 0; a = a + a;", errors: [assignedError("a")] },
		{ code: "var a = 0; a += a + 1;", errors: [assignedError("a")] },
		{ code: "var a = 0; a++;", errors: [assignedError("a")] },
		{
			code: "function foo(a) { a = a + 1 } foo();",
			errors: [assignedError("a")],
		},
		{
			code: "function foo(a) { a += a + 1 } foo();",
			errors: [assignedError("a")],
		},
		{
			code: "function foo(a) { a++ } foo();",
			errors: [assignedError("a")],
		},
		{ code: "var a = 3; a = a * 5 + 6;", errors: [assignedError("a")] },
		{
			code: "var a = 2, b = 4; a = a * 2 + b;",
			errors: [assignedError("a")],
		},

		// https://github.com/eslint/eslint/issues/6576 (For coverage)
		{
			code: "function foo(cb) { cb = function(a) { cb(1 + a); }; bar(not_cb); } foo();",
			errors: [assignedError("cb")],
		},
		{
			code: "function foo(cb) { cb = function(a) { return cb(1 + a); }(); } foo();",
			errors: [assignedError("cb")],
		},
		{
			code: "function foo(cb) { cb = (function(a) { cb(1 + a); }, cb); } foo();",
			errors: [assignedError("cb")],
		},
		{
			code: "function foo(cb) { cb = (0, function(a) { cb(1 + a); }); } foo();",
			errors: [assignedError("cb")],
		},

		// https://github.com/eslint/eslint/issues/6646
		{
			code: [
				"while (a) {",
				"    function foo(b) {",
				"        b = b + 1;",
				"    }",
				"    foo()",
				"}",
			].join("\n"),
			errors: [assignedError("b")],
		},

		// https://github.com/eslint/eslint/issues/7124
		{
			code: "(function(a, b, c) {})",
			options: [{ argsIgnorePattern: "c" }],
			errors: [
				definedError(
					"a",
					[
						{
							output: "(function( b, c) {})",
							messageId: "removeVar",
							data: { varName: "a" },
						},
					],
					". Allowed unused args must match /c/u",
				),
				definedError(
					"b",
					[
						{
							output: "(function(a, c) {})",
							messageId: "removeVar",
							data: { varName: "b" },
						},
					],
					". Allowed unused args must match /c/u",
				),
			],
		},
		{
			code: "(function(a, b, {c, d}) {})",
			options: [{ argsIgnorePattern: "[cd]" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				definedError(
					"a",
					[
						{
							output: "(function( b, {c, d}) {})",
							messageId: "removeVar",
							data: { varName: "a" },
						},
					],
					". Allowed unused args must match /[cd]/u",
				),
				definedError(
					"b",
					[
						{
							output: "(function(a, {c, d}) {})",
							messageId: "removeVar",
							data: { varName: "b" },
						},
					],
					". Allowed unused args must match /[cd]/u",
				),
			],
		},
		{
			code: "(function(a, b, {c, d}) {})",
			options: [{ argsIgnorePattern: "c" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				definedError(
					"a",
					[
						{
							output: "(function( b, {c, d}) {})",
							messageId: "removeVar",
							data: { varName: "a" },
						},
					],
					". Allowed unused args must match /c/u",
				),
				definedError(
					"b",
					[
						{
							output: "(function(a, {c, d}) {})",
							messageId: "removeVar",
							data: { varName: "b" },
						},
					],
					". Allowed unused args must match /c/u",
				),
				definedError(
					"d",
					[
						{
							output: "(function(a, b, {c}) {})",
							messageId: "removeVar",
							data: { varName: "d" },
						},
					],
					". Allowed unused args must match /c/u",
				),
			],
		},
		{
			code: "(function(a, b, {c, d}) {})",
			options: [{ argsIgnorePattern: "d" }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				definedError(
					"a",
					[
						{
							output: "(function( b, {c, d}) {})",
							messageId: "removeVar",
							data: { varName: "a" },
						},
					],
					". Allowed unused args must match /d/u",
				),
				definedError(
					"b",
					[
						{
							output: "(function(a, {c, d}) {})",
							messageId: "removeVar",
							data: { varName: "b" },
						},
					],
					". Allowed unused args must match /d/u",
				),
				definedError(
					"c",
					[
						{
							output: "(function(a, b, { d}) {})",
							messageId: "removeVar",
							data: { varName: "c" },
						},
					],
					". Allowed unused args must match /d/u",
				),
			],
		},
		{
			code: "/*global\rfoo*/",
			errors: [
				{
					line: 2,
					column: 1,
					endLine: 2,
					endColumn: 4,
					messageId: "unusedVar",
					data: {
						varName: "foo",
						action: "defined",
						additional: "",
					},
				},
			],
		},

		// https://github.com/eslint/eslint/issues/8442
		{
			code: "(function ({ a }, b ) { return b; })();",
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				definedError("a", [
					{
						output: "(function ( b ) { return b; })();",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
			],
		},
		{
			code: "(function ({ a }, { b, c } ) { return b; })();",
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				definedError("a", [
					{
						output: "(function ( { b, c } ) { return b; })();",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
				definedError("c", [
					{
						output: "(function ({ a }, { b } ) { return b; })();",
						messageId: "removeVar",
						data: { varName: "c" },
					},
				]),
			],
		},

		// https://github.com/eslint/eslint/issues/14325
		{
			code: "let x = 0;\nx++, x = 0;",
			languageOptions: { ecmaVersion: 2015 },
			errors: [{ ...assignedError("x"), line: 2, column: 6 }],
		},
		{
			code: "let x = 0;\nx++, x = 0;\nx=3;",
			languageOptions: { ecmaVersion: 2015 },
			errors: [{ ...assignedError("x"), line: 3, column: 1 }],
		},
		{
			code: "let x = 0; x++, 0;",
			languageOptions: { ecmaVersion: 2015 },
			errors: [{ ...assignedError("x"), line: 1, column: 12 }],
		},
		{
			code: "let x = 0; 0, x++;",
			languageOptions: { ecmaVersion: 2015 },
			errors: [{ ...assignedError("x"), line: 1, column: 15 }],
		},
		{
			code: "let x = 0; 0, (1, x++);",
			languageOptions: { ecmaVersion: 2015 },
			errors: [{ ...assignedError("x"), line: 1, column: 19 }],
		},
		{
			code: "let x = 0; foo = (x++, 0);",
			languageOptions: { ecmaVersion: 2015 },
			errors: [{ ...assignedError("x"), line: 1, column: 19 }],
		},
		{
			code: "let x = 0; foo = ((0, x++), 0);",
			languageOptions: { ecmaVersion: 2015 },
			errors: [{ ...assignedError("x"), line: 1, column: 23 }],
		},
		{
			code: "let x = 0; x += 1, 0;",
			languageOptions: { ecmaVersion: 2015 },
			errors: [{ ...assignedError("x"), line: 1, column: 12 }],
		},
		{
			code: "let x = 0; 0, x += 1;",
			languageOptions: { ecmaVersion: 2015 },
			errors: [{ ...assignedError("x"), line: 1, column: 15 }],
		},
		{
			code: "let x = 0; 0, (1, x += 1);",
			languageOptions: { ecmaVersion: 2015 },
			errors: [{ ...assignedError("x"), line: 1, column: 19 }],
		},
		{
			code: "let x = 0; foo = (x += 1, 0);",
			languageOptions: { ecmaVersion: 2015 },
			errors: [{ ...assignedError("x"), line: 1, column: 19 }],
		},
		{
			code: "let x = 0; foo = ((0, x += 1), 0);",
			languageOptions: { ecmaVersion: 2015 },
			errors: [{ ...assignedError("x"), line: 1, column: 23 }],
		},

		// https://github.com/eslint/eslint/issues/14866
		{
			code: "let z = 0;\nz = z + 1, z = 2;",
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					...assignedError("z"),
					line: 2,
					column: 12,
				},
			],
		},
		{
			code: "let z = 0;\nz = z+1, z = 2;\nz = 3;",
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					...assignedError("z"),
					line: 3,
					column: 1,
				},
			],
		},
		{
			code: "let z = 0;\nz = z+1, z = 2;\nz = z+3;",
			languageOptions: { ecmaVersion: 2020 },
			errors: [{ ...assignedError("z"), line: 3, column: 1 }],
		},
		{
			code: "let x = 0; 0, x = x+1;",
			languageOptions: { ecmaVersion: 2020 },
			errors: [{ ...assignedError("x"), line: 1, column: 15 }],
		},
		{
			code: "let x = 0; x = x+1, 0;",
			languageOptions: { ecmaVersion: 2020 },
			errors: [{ ...assignedError("x"), line: 1, column: 12 }],
		},
		{
			code: "let x = 0; foo = ((0, x = x + 1), 0);",
			languageOptions: { ecmaVersion: 2020 },
			errors: [{ ...assignedError("x"), line: 1, column: 23 }],
		},
		{
			code: "let x = 0; foo = (x = x+1, 0);",
			languageOptions: { ecmaVersion: 2020 },
			errors: [{ ...assignedError("x"), line: 1, column: 19 }],
		},
		{
			code: "let x = 0; 0, (1, x=x+1);",
			languageOptions: { ecmaVersion: 2020 },
			errors: [{ ...assignedError("x"), line: 1, column: 19 }],
		},
		{
			code: "(function ({ a, b }, { c } ) { return b; })();",
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				definedError("a", [
					{
						output: "(function ({  b }, { c } ) { return b; })();",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
				definedError("c", [
					{
						output: "(function ({ a, b } ) { return b; })();",
						messageId: "removeVar",
						data: { varName: "c" },
					},
				]),
			],
		},
		{
			code: "(function ([ a ], b ) { return b; })();",
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				definedError("a", [
					{
						output: "(function ( b ) { return b; })();",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
			],
		},
		{
			code: "(function ([ a ], [ b, c ] ) { return b; })();",
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				definedError("a", [
					{
						output: "(function ( [ b, c ] ) { return b; })();",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
				definedError("c", [
					{
						output: "(function ([ a ], [ b ] ) { return b; })();",
						messageId: "removeVar",
						data: { varName: "c" },
					},
				]),
			],
		},
		{
			code: "(function ([ a, b ], [ c ] ) { return b; })();",
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				definedError("a", [
					{
						output: "(function ([ , b ], [ c ] ) { return b; })();",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
				definedError("c", [
					{
						output: "(function ([ a, b ] ) { return b; })();",
						messageId: "removeVar",
						data: { varName: "c" },
					},
				]),
			],
		},

		// https://github.com/eslint/eslint/issues/9774
		{
			code: "(function(_a) {})();",
			options: [{ args: "all", varsIgnorePattern: "^_" }],
			errors: [
				definedError("_a", [
					{
						output: "(function() {})();",
						messageId: "removeVar",
						data: { varName: "_a" },
					},
				]),
			],
		},
		{
			code: "(function(_a) {})();",
			options: [{ args: "all", caughtErrorsIgnorePattern: "^_" }],
			errors: [
				definedError("_a", [
					{
						output: "(function() {})();",
						messageId: "removeVar",
						data: { varName: "_a" },
					},
				]),
			],
		},

		// https://github.com/eslint/eslint/issues/10982
		{
			code: "var a = function() { a(); };",
			errors: [
				{
					...assignedError("a", [
						{
							output: "",
							messageId: "removeVar",
							data: { varName: "a" },
						},
					]),
					line: 1,
					column: 5,
				},
			],
		},
		{
			code: "var a = function(){ return function() { a(); } };",
			errors: [
				{
					...assignedError("a", [
						{
							output: "",
							messageId: "removeVar",
							data: { varName: "a" },
						},
					]),
					line: 1,
					column: 5,
				},
			],
		},
		{
			code: "const a = () => () => { a(); };",
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					...assignedError("a", [
						{
							output: "",
							messageId: "removeVar",
							data: { varName: "a" },
						},
					]),
					line: 1,
					column: 7,
				},
			],
		},
		{
			code: "let myArray = [1,2,3,4].filter((x) => x == 0);\nmyArray = myArray.filter((x) => x == 1);",
			languageOptions: { ecmaVersion: 2015 },
			errors: [{ ...assignedError("myArray"), line: 2, column: 1 }],
		},
		{
			code: "const a = 1; a += 1;",
			languageOptions: { ecmaVersion: 2015 },
			errors: [{ ...assignedError("a"), line: 1, column: 14 }],
		},
		{
			code: "const a = () => { a(); };",
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					...assignedError("a", [
						{
							output: "",
							messageId: "removeVar",
							data: { varName: "a" },
						},
					]),
					line: 1,
					column: 7,
				},
			],
		},

		// https://github.com/eslint/eslint/issues/14324
		{
			code: "let x = [];\nx = x.concat(x);",
			languageOptions: { ecmaVersion: 2015 },
			errors: [{ ...assignedError("x"), line: 2, column: 1 }],
		},
		{
			code: "let a = 'a';\na = 10;\nfunction foo(){a = 11;a = () => {a = 13}}",
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{ ...assignedError("a"), line: 2, column: 1 },
				{
					...definedError("foo", [
						{
							output: "let a = 'a';\na = 10;\n",
							messageId: "removeVar",
							data: { varName: "foo" },
						},
					]),
					line: 3,
					column: 10,
				},
			],
		},
		{
			code: "let foo;\ninit();\nfoo = foo + 2;\nfunction init() {foo = 1;}",
			languageOptions: { ecmaVersion: 2020 },
			errors: [{ ...assignedError("foo"), line: 3, column: 1 }],
		},
		{
			code: "function foo(n) {\nif (n < 2) return 1;\nreturn n * foo(n - 1);}",
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					...definedError("foo", [
						{
							output: "",
							messageId: "removeVar",
							data: { varName: "foo" },
						},
					]),
					line: 1,
					column: 10,
				},
			],
		},
		{
			code: "let c = 'c';\nc = 10;\nfunction foo1() {c = 11; c = () => { c = 13 }} c = foo1",
			languageOptions: { ecmaVersion: 2020 },
			errors: [{ ...assignedError("c"), line: 3, column: 48 }],
		},

		// ignore class with static initialization block https://github.com/eslint/eslint/issues/17772
		{
			code: "class Foo { static {} }",
			options: [{ ignoreClassWithStaticInitBlock: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					...definedError("Foo", [
						{
							output: "",
							messageId: "removeVar",
							data: { varName: "Foo" },
						},
					]),
					line: 1,
					column: 7,
				},
			],
		},
		{
			code: "class Foo { static {} }",
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					...definedError("Foo", [
						{
							output: "",
							messageId: "removeVar",
							data: { varName: "Foo" },
						},
					]),
					line: 1,
					column: 7,
				},
			],
		},
		{
			code: "class Foo { static { var bar; } }",
			options: [{ ignoreClassWithStaticInitBlock: true }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					...definedError("bar", [
						{
							output: "class Foo { static {  } }",
							messageId: "removeVar",
							data: { varName: "bar" },
						},
					]),
					line: 1,
					column: 26,
				},
			],
		},
		{
			code: "class Foo {}",
			options: [{ ignoreClassWithStaticInitBlock: true }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					...definedError("Foo", [
						{
							output: "",
							messageId: "removeVar",
							data: { varName: "Foo" },
						},
					]),
					line: 1,
					column: 7,
				},
			],
		},
		{
			code: "class Foo { static bar; }",
			options: [{ ignoreClassWithStaticInitBlock: true }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					...definedError("Foo", [
						{
							output: "",
							messageId: "removeVar",
							data: { varName: "Foo" },
						},
					]),
					line: 1,
					column: 7,
				},
			],
		},
		{
			code: "class Foo { static bar() {} }",
			options: [{ ignoreClassWithStaticInitBlock: true }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					...definedError("Foo", [
						{
							output: "",
							messageId: "removeVar",
							data: { varName: "Foo" },
						},
					]),
					line: 1,
					column: 7,
				},
			],
		},

		// https://github.com/eslint/eslint/issues/17568
		{
			code: "const _a = 5;const _b = _a + 5",
			options: [
				{
					args: "all",
					varsIgnorePattern: "^_",
					reportUsedIgnorePattern: true,
				},
			],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				usedIgnoredError("_a", ". Used vars must not match /^_/u"),
			],
		},
		{
			code: "const _a = 42; foo(() => _a);",
			options: [
				{
					args: "all",
					varsIgnorePattern: "^_",
					reportUsedIgnorePattern: true,
				},
			],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				usedIgnoredError("_a", ". Used vars must not match /^_/u"),
			],
		},
		{
			code: " (function foo(_a) { return _a + 5 })(5)",
			options: [
				{
					args: "all",
					argsIgnorePattern: "^_",
					reportUsedIgnorePattern: true,
				},
			],
			errors: [
				usedIgnoredError("_a", ". Used args must not match /^_/u"),
			],
		},
		{
			code: "const [ a, _b ] = items;\nconsole.log(a+_b);",
			options: [
				{
					destructuredArrayIgnorePattern: "^_",
					reportUsedIgnorePattern: true,
				},
			],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				usedIgnoredError(
					"_b",
					". Used elements of array destructuring must not match /^_/u",
				),
			],
		},
		{
			code: "let _x;\n[_x] = arr;\nfoo(_x);",
			options: [
				{
					destructuredArrayIgnorePattern: "^_",
					reportUsedIgnorePattern: true,
					varsIgnorePattern: "[iI]gnored",
				},
			],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				usedIgnoredError(
					"_x",
					". Used elements of array destructuring must not match /^_/u",
				),
			],
		},
		{
			code: "const [ignored] = arr;\nfoo(ignored);",
			options: [
				{
					destructuredArrayIgnorePattern: "^_",
					reportUsedIgnorePattern: true,
					varsIgnorePattern: "[iI]gnored",
				},
			],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				usedIgnoredError(
					"ignored",
					". Used vars must not match /[iI]gnored/u",
				),
			],
		},
		{
			code: "try{}catch(_err){console.error(_err)}",
			options: [
				{
					caughtErrors: "all",
					caughtErrorsIgnorePattern: "^_",
					reportUsedIgnorePattern: true,
				},
			],
			errors: [
				usedIgnoredError(
					"_err",
					". Used caught errors must not match /^_/u",
				),
			],
		},
		{
			code: "try {} catch ({ message }) { console.error(message); }",
			options: [
				{
					caughtErrorsIgnorePattern: "message",
					reportUsedIgnorePattern: true,
				},
			],
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				usedIgnoredError(
					"message",
					". Used caught errors must not match /message/u",
				),
			],
		},
		{
			code: "try {} catch ([_a, _b]) { doSomething(_a, _b); }",
			options: [
				{
					caughtErrorsIgnorePattern: "^_",
					reportUsedIgnorePattern: true,
				},
			],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				usedIgnoredError(
					"_a",
					". Used caught errors must not match /^_/u",
				),
				usedIgnoredError(
					"_b",
					". Used caught errors must not match /^_/u",
				),
			],
		},
		{
			code: "try {} catch ([_a, _b]) { doSomething(_a, _b); }",
			options: [
				{
					destructuredArrayIgnorePattern: "^_",
					reportUsedIgnorePattern: true,
				},
			],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				usedIgnoredError(
					"_a",
					". Used elements of array destructuring must not match /^_/u",
				),
				usedIgnoredError(
					"_b",
					". Used elements of array destructuring must not match /^_/u",
				),
			],
		},
		{
			code: `
try {
} catch (_) {
  _ = 'foo'
}
            `,
			options: [{ caughtErrorsIgnorePattern: "foo" }],
			errors: [
				{
					message:
						"'_' is assigned a value but never used. Allowed unused caught errors must match /foo/u.",
				},
			],
		},
		{
			code: `
try {
} catch (_) {
  _ = 'foo'
}
            `,
			options: [
				{
					caughtErrorsIgnorePattern: "ignored",
					varsIgnorePattern: "_",
				},
			],
			errors: [
				{
					message:
						"'_' is assigned a value but never used. Allowed unused caught errors must match /ignored/u.",
				},
			],
		},
		{
			code: "try {} catch ({ message, errors: [firstError] }) {}",
			options: [{ caughtErrorsIgnorePattern: "foo" }],
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					message:
						"'message' is defined but never used. Allowed unused caught errors must match /foo/u.",
					column: 17,
					endColumn: 24,
					suggestions: [
						{
							output: "try {} catch ({  errors: [firstError] }) {}",
							messageId: "removeVar",
							data: { varName: "message" },
						},
					],
				},
				{
					message:
						"'firstError' is defined but never used. Allowed unused caught errors must match /foo/u.",
					column: 35,
					endColumn: 45,
					suggestions: [
						{
							output: "try {} catch ({ message }) {}",
							messageId: "removeVar",
							data: { varName: "firstError" },
						},
					],
				},
			],
		},
		{
			code: "try {} catch ({ stack: $ }) { $ = 'Something broke: ' + $; }",
			options: [{ caughtErrorsIgnorePattern: "\\w" }],
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					message:
						"'$' is assigned a value but never used. Allowed unused caught errors must match /\\w/u.",
					column: 31,
					endColumn: 32,
				},
			],
		},
		{
			code: "_ => { _ = _ + 1 };",
			options: [
				{
					argsIgnorePattern: "ignored",
					varsIgnorePattern: "_",
				},
			],
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					message:
						"'_' is assigned a value but never used. Allowed unused args must match /ignored/u.",
				},
			],
		},
		{
			code: "const [a, b, c] = foo; alert(a + c);",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				assignedError("b", [
					{
						output: "const [a, , c] = foo; alert(a + c);",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "const [a = aDefault] = foo;",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				assignedError("a", [
					{
						output: "",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
			],
		},
		{
			code: "const [[a = aDefault]]= foo;",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				assignedError("a", [
					{
						output: "",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
			],
		},
		{
			code: "const [[a = aDefault], b]= foo;",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				assignedError("a", [
					{
						output: "const [, b]= foo;",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
				assignedError("b", [
					{
						output: "const [[a = aDefault]]= foo;",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "const [a = aDefault, b] = foo; alert(b);",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				assignedError("a", [
					{
						output: "const [, b] = foo; alert(b);",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
			],
		},
		{
			code: "function a([a = aDefault]) { } a();",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				assignedError("a", [
					{
						output: "function a() { } a();",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
			],
		},
		{
			code: "function a([[a = aDefault]]) { } a();",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				assignedError("a", [
					{
						output: "function a() { } a();",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
			],
		},
		{
			code: "function a([a = aDefault, b]) { alert(b); } a();",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				assignedError("a", [
					{
						output: "function a([, b]) { alert(b); } a();",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
			],
		},
		{
			code: "function a([[a = aDefault, b]]) { alert(b); } a();",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				assignedError("a", [
					{
						output: "function a([[, b]]) { alert(b); } a();",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
			],
		},
		{
			code: "const { a: a1 } = foo",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				assignedError("a1", [
					{
						output: "",
						messageId: "removeVar",
						data: { varName: "a1" },
					},
				]),
			],
		},
		{
			code: "const { a: a1, b: b1 } = foo; alert(b1);",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				assignedError("a1", [
					{
						output: "const {  b: b1 } = foo; alert(b1);",
						messageId: "removeVar",
						data: { varName: "a1" },
					},
				]),
			],
		},
		{
			code: "const { a: a1, b: b1 } = foo; alert(a1);",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				assignedError("b1", [
					{
						output: "const { a: a1 } = foo; alert(a1);",
						messageId: "removeVar",
						data: { varName: "b1" },
					},
				]),
			],
		},
		{
			code: "function a({ a: a1 }) {} a();",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				definedError("a1", [
					{
						output: "function a() {} a();",
						messageId: "removeVar",
						data: { varName: "a1" },
					},
				]),
			],
		},
		{
			code: "const { a: a1 = aDefault } = foo;",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				assignedError("a1", [
					{
						output: "",
						messageId: "removeVar",
						data: { varName: "a1" },
					},
				]),
			],
		},
		{
			code: "const [{ a: a1 = aDefault }] = foo;",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				assignedError("a1", [
					{
						output: "",
						messageId: "removeVar",
						data: { varName: "a1" },
					},
				]),
			],
		},
		{
			code: "const { a = aDefault } = foo;",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				assignedError("a", [
					{
						output: "",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
			],
		},
		{
			code: "const { a = aDefault, b } = foo; alert(b);",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				assignedError("a", [
					{
						output: "const {  b } = foo; alert(b);",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
			],
		},
		{
			code: "const { a, b = bDefault } = foo; alert(a);",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				assignedError("b", [
					{
						output: "const { a } = foo; alert(a);",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "const { a, b = bDefault, c } = foo; alert(a + c);",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				assignedError("b", [
					{
						output: "const { a, c } = foo; alert(a + c);",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "const { [key]: a } = foo;",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				assignedError("a", [
					{
						output: "",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
			],
		},
		{
			code: "const [...{ a, b }] = array; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				assignedError("b", [
					{
						output: "const [...{ a }] = array; alert(a);",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "function foo (...rest) {} foo();",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				definedError("rest", [
					{
						output: "function foo () {} foo();",
						messageId: "removeVar",
						data: { varName: "rest" },
					},
				]),
			],
		},
		{
			code: "function foo (a, ...rest) { alert(a); } foo();",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				definedError("rest", [
					{
						output: "function foo (a) { alert(a); } foo();",
						messageId: "removeVar",
						data: { varName: "rest" },
					},
				]),
			],
		},
		{
			code: "const {...rest} = foo;",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				assignedError("rest", [
					{
						output: "",
						messageId: "removeVar",
						data: { varName: "rest" },
					},
				]),
			],
		},
		{
			code: "const {a, ...rest} = foo; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				assignedError("rest", [
					{
						output: "const {a} = foo; alert(a);",
						messageId: "removeVar",
						data: { varName: "rest" },
					},
				]),
			],
		},
		{
			code: "const {...rest} = foo, a = bar; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				assignedError("rest", [
					{
						output: "const  a = bar; alert(a);",
						messageId: "removeVar",
						data: { varName: "rest" },
					},
				]),
			],
		},
		{
			code: "const a = bar, {...rest} = foo; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				assignedError("rest", [
					{
						output: "const a = bar; alert(a);",
						messageId: "removeVar",
						data: { varName: "rest" },
					},
				]),
			],
		},
		{
			code: "function foo ({...rest}) { } foo();",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				definedError("rest", [
					{
						output: "function foo () { } foo();",
						messageId: "removeVar",
						data: { varName: "rest" },
					},
				]),
			],
		},
		{
			code: "function foo (a, {...rest}) { alert(a); } foo();",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				definedError("rest", [
					{
						output: "function foo (a) { alert(a); } foo();",
						messageId: "removeVar",
						data: { varName: "rest" },
					},
				]),
			],
		},
		{
			code: "function foo ({...rest}, a) { alert(a); } foo();",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				definedError("rest", [
					{
						output: "function foo ( a) { alert(a); } foo();",
						messageId: "removeVar",
						data: { varName: "rest" },
					},
				]),
			],
		},
		{
			code: "const [...rest] = foo;",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				assignedError("rest", [
					{
						output: "",
						messageId: "removeVar",
						data: { varName: "rest" },
					},
				]),
			],
		},
		{
			code: "const [[...rest]] = foo;",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				assignedError("rest", [
					{
						output: "",
						messageId: "removeVar",
						data: { varName: "rest" },
					},
				]),
			],
		},
		{
			code: "const [a, ...rest] = foo; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				assignedError("rest", [
					{
						output: "const [a] = foo; alert(a);",
						messageId: "removeVar",
						data: { varName: "rest" },
					},
				]),
			],
		},
		{
			code: "function foo ([...rest]) { } foo();",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				definedError("rest", [
					{
						output: "function foo () { } foo();",
						messageId: "removeVar",
						data: { varName: "rest" },
					},
				]),
			],
		},
		{
			code: "const [a, ...{ b }] = array; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				assignedError("b", [
					{
						output: "const [a] = array; alert(a);",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "const [[a, ...{ b }]] = array; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				assignedError("b", [
					{
						output: "const [[a]] = array; alert(a);",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "const [...[a]] = array;",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				assignedError("a", [
					{
						output: "",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
			],
		},
		{
			code: "const [[...[a]]] = array;",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				assignedError("a", [
					{
						output: "",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
			],
		},
		{
			code: "const [...[a, b]] = array; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				assignedError("b", [
					{
						output: "const [...[a]] = array; alert(a);",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "const [a, ...[b]] = array; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				assignedError("b", [
					{
						output: "const [a] = array; alert(a);",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "const [[a, ...[b]]] = array; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				assignedError("b", [
					{
						output: "const [[a]] = array; alert(a);",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "const [a, ...[b]] = array; alert(b);",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				assignedError("a", [
					{
						output: "const [, ...[b]] = array; alert(b);",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
			],
		},
		{
			code: "const [a, ...[[ b ]]] = array; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				assignedError("b", [
					{
						output: "const [a] = array; alert(a);",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "const [a, ...[{ b }]] = array; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				assignedError("b", [
					{
						output: "const [a] = array; alert(a);",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "function foo([a, ...[[ b ]]]) {} foo();",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				definedError("a", [
					{
						output: "function foo([, ...[[ b ]]]) {} foo();",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
				definedError("b", [
					{
						output: "function foo([a]) {} foo();",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "function foo([a, ...[{ b }]]) {} foo();",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				definedError("a", [
					{
						output: "function foo([, ...[{ b }]]) {} foo();",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
				definedError("b", [
					{
						output: "function foo([a]) {} foo();",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "function foo(...[[ a ]]) {} foo();",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				definedError("a", [
					{
						output: "function foo() {} foo();",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
			],
		},
		{
			code: "function foo(...[{ a }]) {} foo();",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				definedError("a", [
					{
						output: "function foo() {} foo();",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
			],
		},
		{
			code: "function foo(a, ...[b]) { alert(a); } foo();",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				definedError("b", [
					{
						output: "function foo(a) { alert(a); } foo();",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "const [a, [b]] = array; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				assignedError("b", [
					{
						output: "const [a] = array; alert(a);",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "const [[a, [b]]] = array; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				assignedError("b", [
					{
						output: "const [[a]] = array; alert(a);",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "const [a, [[b]]] = array; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				assignedError("b", [
					{
						output: "const [a] = array; alert(a);",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "function a([[b]]) {} a();",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				definedError("b", [
					{
						output: "function a() {} a();",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "function a([[b], c]) { alert(c); } a();",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				definedError("b", [
					{
						output: "function a([, c]) { alert(c); } a();",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "const [{b}, a] = array; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				assignedError("b", [
					{
						output: "const [, a] = array; alert(a);",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "const [[{b}, a]] = array; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				assignedError("b", [
					{
						output: "const [[, a]] = array; alert(a);",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "const [[[{b}], a]] = array; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				assignedError("b", [
					{
						output: "const [[, a]] = array; alert(a);",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "function a([{b}]) {} a();",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				definedError("b", [
					{
						output: "function a() {} a();",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "function a([{b}, c]) { alert(c); } a();",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				definedError("b", [
					{
						output: "function a([, c]) { alert(c); } a();",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "const { a: { b }, c } = foo; alert(c);",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				assignedError("b", [
					{
						output: "const {  c } = foo; alert(c);",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "const { c, a: { b } } = foo; alert(c);",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				assignedError("b", [
					{
						output: "const { c } = foo; alert(c);",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "const { a: { b: { c }, d } } = foo; alert(d);",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				assignedError("c", [
					{
						output: "const { a: {  d } } = foo; alert(d);",
						messageId: "removeVar",
						data: { varName: "c" },
					},
				]),
			],
		},
		{
			code: "const { a: { b: { c: { e } }, d } } = foo; alert(d);",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				assignedError("e", [
					{
						output: "const { a: {  d } } = foo; alert(d);",
						messageId: "removeVar",
						data: { varName: "e" },
					},
				]),
			],
		},
		{
			code: "const [{ a: { b }, c }] = foo; alert(c);",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				assignedError("b", [
					{
						output: "const [{  c }] = foo; alert(c);",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "const { a: [{ b }]} = foo;",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				assignedError("b", [
					{
						output: "",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "const { a: [[ b ]]} = foo;",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				assignedError("b", [
					{
						output: "",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "const [{ a: [{ b }]}] = foo;",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				assignedError("b", [
					{
						output: "",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "const { a: [{ b }], c} = foo; alert(c);",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				assignedError("b", [
					{
						output: "const {  c} = foo; alert(c);",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "function foo({ a: [{ b }]}) {} foo();",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				definedError("b", [
					{
						output: "function foo() {} foo();",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "function foo({ a: [[ b ]]}) {} foo();",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				definedError("b", [
					{
						output: "function foo() {} foo();",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "let a = foo, b = 'bar'; alert(b);",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				assignedError("a", [
					{
						output: "let  b = 'bar'; alert(b);",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
			],
		},
		{
			code: "let a = foo, b = 'bar'; alert(a);",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				assignedError("b", [
					{
						output: "let a = foo; alert(a);",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "let { a } = foo, bar = 'hello'; alert(bar);",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				assignedError("a", [
					{
						output: "let  bar = 'hello'; alert(bar);",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
			],
		},
		{
			code: "let bar = 'hello', { a } = foo; alert(bar);",
			languageOptions: { ecmaVersion: 2023 },
			errors: [
				assignedError("a", [
					{
						output: "let bar = 'hello'; alert(bar);",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
			],
		},
		{
			code: "import a from 'module';",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			errors: [
				definedError("a", [
					{
						output: "import 'module';",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
			],
		},
		{
			code: "import * as foo from 'module';",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			errors: [
				definedError("foo", [
					{
						output: "import 'module';",
						messageId: "removeVar",
						data: { varName: "foo" },
					},
				]),
			],
		},
		{
			code: "import a, * as foo from 'module'; a();",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			errors: [
				definedError("foo", [
					{
						output: "import a from 'module'; a();",
						messageId: "removeVar",
						data: { varName: "foo" },
					},
				]),
			],
		},
		{
			code: "import a, * as foo from 'module'; foo.hello;",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			errors: [
				definedError("a", [
					{
						output: "import  * as foo from 'module'; foo.hello;",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
			],
		},
		{
			code: "import { a } from 'module';",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			errors: [
				definedError("a", [
					{
						output: "",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
			],
		},
		{
			code: "import { a, b } from 'module'; alert(b);",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			errors: [
				definedError("a", [
					{
						output: "import {  b } from 'module'; alert(b);",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
			],
		},
		{
			code: "import { a, b } from 'module'; alert(a);",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			errors: [
				definedError("b", [
					{
						output: "import { a } from 'module'; alert(a);",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
			],
		},
		{
			code: "import { a as foo } from 'module';",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			errors: [
				definedError("foo", [
					{
						output: "",
						messageId: "removeVar",
						data: { varName: "foo" },
					},
				]),
			],
		},
		{
			code: "import { a as foo, b } from 'module'; alert(b);",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			errors: [
				definedError("foo", [
					{
						output: "import {  b } from 'module'; alert(b);",
						messageId: "removeVar",
						data: { varName: "foo" },
					},
				]),
			],
		},
		{
			code: "import { a, b as foo } from 'module'; alert(a);",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			errors: [
				definedError("foo", [
					{
						output: "import { a } from 'module'; alert(a);",
						messageId: "removeVar",
						data: { varName: "foo" },
					},
				]),
			],
		},
		{
			code: "import { default as foo, a } from 'module'; alert(a);",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			errors: [
				definedError("foo", [
					{
						output: "import {  a } from 'module'; alert(a);",
						messageId: "removeVar",
						data: { varName: "foo" },
					},
				]),
			],
		},
		{
			code: "import foo, { a } from 'module'; alert(a);",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			errors: [
				definedError("foo", [
					{
						output: "import  { a } from 'module'; alert(a);",
						messageId: "removeVar",
						data: { varName: "foo" },
					},
				]),
			],
		},
		{
			code: "import foo, { a } from 'module'; foo();",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			errors: [
				definedError("a", [
					{
						output: "import foo from 'module'; foo();",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
			],
		},
		{
			code: "let a; a = foo;",
			languageOptions: { ecmaVersion: 6 },
			errors: [assignedError("a")],
		},
		{
			code: "array.forEach(a => {})",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				definedError("a", [
					{
						output: "array.forEach(() => {})",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
			],
		},
		{
			code: "if (foo()) var bar;",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				definedError("bar", [
					{
						output: "if (foo()) ;",
						messageId: "removeVar",
						data: { varName: "bar" },
					},
				]),
			],
		},
		{
			code: "for (;;) var foo;",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				definedError("foo", [
					{
						output: "for (;;) ;",
						messageId: "removeVar",
						data: { varName: "foo" },
					},
				]),
			],
		},
		{
			code: "for (a in b) var foo;",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				definedError("foo", [
					{
						output: "for (a in b) ;",
						messageId: "removeVar",
						data: { varName: "foo" },
					},
				]),
			],
		},
		{
			code: "for (a of b) var foo;",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				definedError("foo", [
					{
						output: "for (a of b) ;",
						messageId: "removeVar",
						data: { varName: "foo" },
					},
				]),
			],
		},
		{
			code: "while (a) var foo;",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				definedError("foo", [
					{
						output: "while (a) ;",
						messageId: "removeVar",
						data: { varName: "foo" },
					},
				]),
			],
		},
		{
			code: "do var foo; while (b);",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				definedError("foo", [
					{
						output: "do ; while (b);",
						messageId: "removeVar",
						data: { varName: "foo" },
					},
				]),
			],
		},
		{
			code: "with (a) var foo;",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				definedError("foo", [
					{
						output: "with (a) ;",
						messageId: "removeVar",
						data: { varName: "foo" },
					},
				]),
			],
		},
		{
			code: "var a;'use strict';b(00);",
			errors: [
				{
					messageId: "unusedVar",
					data: { varName: "a", action: "defined", additional: "" },
				},
			],
		},
		{
			code: "var [a] = foo;'use strict';b(00);",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "unusedVar",
					data: {
						varName: "a",
						action: "assigned a value",
						additional: "",
					},
					suggestions: [],
				},
			],
		},
		{
			code: "var [...a] = foo;'use strict';b(00);",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "unusedVar",
					data: {
						varName: "a",
						action: "assigned a value",
						additional: "",
					},
					suggestions: [],
				},
			],
		},
		{
			code: "var {a} = foo;'use strict';b(00);",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "unusedVar",
					data: {
						varName: "a",
						action: "assigned a value",
						additional: "",
					},
					suggestions: [],
				},
			],
		},
		{
			code: "console.log('foo')\nvar a\n+b > 0 ? bar() : baz()",
			errors: [
				{
					messageId: "unusedVar",
					data: { varName: "a", action: "defined", additional: "" },
				},
			],
		},
		{
			code: "console.log('foo')\nvar [a] = foo;\n+b > 0 ? bar() : baz()",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "unusedVar",
					data: {
						varName: "a",
						action: "assigned a value",
						additional: "",
					},
				},
			],
		},
		{
			code: "console.log('foo')\nvar {a} = foo;\n+b > 0 ? bar() : baz()",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "unusedVar",
					data: {
						varName: "a",
						action: "assigned a value",
						additional: "",
					},
				},
			],
		},
		{
			code: "let x;\n() => x = 1;",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "unusedVar",
					data: {
						varName: "x",
						action: "assigned a value",
						additional: "",
					},
				},
			],
		},
		{
			code: "let [a = 1] = arr;\na = 2;",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "unusedVar",
					data: {
						varName: "a",
						action: "assigned a value",
						additional: "",
					},
				},
			],
		},
		{
			code: "function foo(a = 1, b){alert(b);} foo();",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				assignedError("a", [
					{
						output: "function foo( b){alert(b);} foo();",
						messageId: "removeVar",
						data: { varName: "a" },
					},
				]),
			],
		},
		{
			code: "function foo(a = 1) {a = 2;} foo();",
			languageOptions: { ecmaVersion: 6 },
			errors: [assignedError("a")],
		},
		{
			code: "function foo(a = 1, b) {a = 2;} foo();",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				definedError("b", [
					{
						output: "function foo(a = 1) {a = 2;} foo();",
						messageId: "removeVar",
						data: { varName: "b" },
					},
				]),
				assignedError("a"),
			],
		},
	],
});

const ruleTesterTypeScript = new RuleTester({
	languageOptions: {
		parser: require("@typescript-eslint/parser"),
		parserOptions: {
			ecmaFeatures: {},
			ecmaVersion: 6,
			sourceType: "module",
		},
	},
});

ruleTesterTypeScript.run("no-unused-vars", rule, {
	valid: [
		`
import { ClassDecoratorFactory } from 'decorators';
@ClassDecoratorFactory()
export class Foo {}
    `,
		`
import { ClassDecorator } from 'decorators';
@ClassDecorator
export class Foo {}
    `,
		`
import { AccessorDecoratorFactory } from 'decorators';
export class Foo {
	@AccessorDecoratorFactory(true)
	get bar() {}
}
    `,
		`
import { AccessorDecorator } from 'decorators';
export class Foo {
	@AccessorDecorator
	set bar() {}
}
    `,
		`
import { MethodDecoratorFactory } from 'decorators';
export class Foo {
	@MethodDecoratorFactory(false)
	bar() {}
}
    `,
		`
import { MethodDecorator } from 'decorators';
export class Foo {
	@MethodDecorator
	static bar() {}
}
    `,
		`
import { ConstructorParameterDecoratorFactory } from 'decorators';
export class Service {
	constructor(
		@ConstructorParameterDecoratorFactory(APP_CONFIG) config: AppConfig,
	) {
		this.title = config.title;
	}
}
    `,
		`
import { ConstructorParameterDecorator } from 'decorators';
export class Foo {
	constructor(@ConstructorParameterDecorator bar) {
		this.bar = bar;
	}
}
    `,
		`
import { ParameterDecoratorFactory } from 'decorators';
export class Qux {
	bar(@ParameterDecoratorFactory(true) baz: number) {
		console.log(baz);
	}
}
    `,
		`
import { ParameterDecorator } from 'decorators';
export class Foo {
	static greet(@ParameterDecorator name: string) {
		return name;
	}
}
    `,
		`
import { Input, Output, EventEmitter } from 'decorators';
export class SomeComponent {
	@Input() data;
	@Output()
	click = new EventEmitter();
}
    `,
		`
import { configurable } from 'decorators';
export class A {
  	@configurable(true) static prop1;

  	@configurable(false)
  	static prop2;
}
    `,
		`
import { foo, bar } from 'decorators';
export class B {
  	@foo x;

  	@bar
  	y;
}
    `,
		`
interface Base {}
class Thing implements Base {}
new Thing();
    `,
		`
interface Base {}
const a: Base = {};
console.log(a);
    `,
		`
import { Foo } from 'foo';
function bar<T>(): T {}
bar<Foo>();
    `,
		`
import { Foo } from 'foo';
const bar = function <T>(): T {};
bar<Foo>();
    `,
		`
import { Foo } from 'foo';
const bar = <T,>(): T => {};
bar<Foo>();
    `,
		`
import { Foo } from 'foo';
<Foo>(<T,>(): T => {})();
    `,
		`
import { Nullable } from 'nullable';
const a: Nullable<string> = 'hello';
console.log(a);
    `,
		`
import { Nullable } from 'nullable';
import { SomeOther } from 'other';
const a: Nullable<SomeOther> = 'hello';
console.log(a);
    `,
		`
import { Nullable } from 'nullable';
const a: Nullable | undefined = 'hello';
console.log(a);
    `,
		`
import { Nullable } from 'nullable';
const a: Nullable & undefined = 'hello';
console.log(a);
    `,
		`
import { Nullable } from 'nullable';
import { SomeOther } from 'other';
const a: Nullable<SomeOther[]> = 'hello';
console.log(a);
    `,
		`
import { Nullable } from 'nullable';
import { SomeOther } from 'other';
const a: Nullable<Array<SomeOther>> = 'hello';
console.log(a);
    `,
		`
import { Nullable } from 'nullable';
const a: Array<Nullable> = 'hello';
console.log(a);
    `,
		`
import { Nullable } from 'nullable';
const a: Nullable[] = 'hello';
console.log(a);
    `,
		`
import { Nullable } from 'nullable';
const a: Array<Nullable[]> = 'hello';
console.log(a);
    `,
		`
import { Nullable } from 'nullable';
const a: Array<Array<Nullable>> = 'hello';
console.log(a);
    `,
		`
import { Nullable } from 'nullable';
import { SomeOther } from 'other';
const a: Array<Nullable<SomeOther>> = 'hello';
console.log(a);
    `,
		`
import { Nullable } from 'nullable';
import { Component } from 'react';
class Foo implements Component<Nullable> {}

new Foo();
    `,
		`
import { Nullable } from 'nullable';
import { Component } from 'react';
class Foo extends Component<Nullable, {}> {}
new Foo();
    `,
		`
import { Nullable } from 'nullable';
import { SomeOther } from 'some';
import { Component } from 'react';
class Foo extends Component<Nullable<SomeOther>, {}> {}
new Foo();
    `,
		`
import { Nullable } from 'nullable';
import { SomeOther } from 'some';
import { Component } from 'react';
class Foo implements Component<Nullable<SomeOther>, {}> {}
new Foo();
    `,
		`
import { Nullable } from 'nullable';
import { SomeOther } from 'some';
import { Component, Component2 } from 'react';
class Foo implements Component<Nullable<SomeOther>, {}>, Component2 {}
new Foo();
    `,
		`
import { Nullable } from 'nullable';
import { Another } from 'some';
class A {
	do = (a: Nullable<Another>) => {
    	console.log(a);
  	};
}
new A();
    `,
		`
import { Nullable } from 'nullable';
import { Another } from 'some';
class A {
  	do(a: Nullable<Another>) {
    	console.log(a);
  	}
}
new A();
    `,
		`
import { Nullable } from 'nullable';
import { Another } from 'some';
class A {
  	do(): Nullable<Another> {
    	return null;
  	}
}
new A();
    `,
		`
import { Nullable } from 'nullable';
import { Another } from 'some';
export interface A {
  	do(a: Nullable<Another>);
}
    `,
		`
import { Nullable } from 'nullable';
import { Another } from 'some';
export interface A {
  	other: Nullable<Another>;
}
    `,
		`
import { Nullable } from 'nullable';
function foo(a: Nullable) {
  	console.log(a);
}
foo();
    `,
		`
import { Nullable } from 'nullable';
function foo(): Nullable {
  	return null;
}
foo();
    `,
		`
import { Nullable } from 'nullable';
import { SomeOther } from 'some';
class A extends Nullable<SomeOther> {
  	other: Nullable<Another>;
}
new A();
    `,
		`
import { Nullable } from 'nullable';
import { SomeOther } from 'some';
import { Another } from 'some';
class A extends Nullable<SomeOther> {
  	do(a: Nullable<Another>) {
    	console.log(a);
  	}
}
new A();
    `,
		`
import { Nullable } from 'nullable';
import { SomeOther } from 'some';
import { Another } from 'some';
export interface A extends Nullable<SomeOther> {
  	other: Nullable<Another>;
}
    `,
		`
import { Nullable } from 'nullable';
import { SomeOther } from 'some';
import { Another } from 'some';
export interface A extends Nullable<SomeOther> {
  	do(a: Nullable<Another>);
}
    `,
		`
import { Foo } from './types';

class Bar<T extends Foo> {
  	prop: T;
}

new Bar<number>();
    `,
		`
import { Foo, Bar } from './types';

class Baz<T extends Foo & Bar> {
  	prop: T;
}

new Baz<any>();
    `,
		`
import { Foo } from './types';

class Bar<T = Foo> {
  	prop: T;
}

new Bar<number>();
    `,
		`
import { Foo } from './types';

class Foo<T = any> {
  	prop: T;
}

new Foo();
    `,
		`
import { Foo } from './types';

class Foo<T = {}> {
  	prop: T;
}

new Foo();
    `,
		`
import { Foo } from './types';

class Foo<T extends {} = {}> {
  	prop: T;
}

new Foo();
    `,
		`
type Foo = 'a' | 'b' | 'c';
type Bar = number;

export const map: { [name in Foo]: Bar } = {
  	a: 1,
  	b: 2,
  	c: 3,
};
    `,
		// 4.1 remapped mapped type
		`
type Foo = 'a' | 'b' | 'c';
type Bar = number;

export const map: { [name in Foo as string]: Bar } = {
  	a: 1,
  	b: 2,
  	c: 3,
};
    `,
		`
import { Nullable } from 'nullable';
class A<T> {
  	bar: T;
}
new A<Nullable>();
    `,
		`
import { Nullable } from 'nullable';
import { SomeOther } from 'other';
function foo<T extends Nullable>(): T {}
foo<SomeOther>();
    `,
		`
import { Nullable } from 'nullable';
import { SomeOther } from 'other';
class A<T extends Nullable> {
  	bar: T;
}
new A<SomeOther>();
    `,
		`
import { Nullable } from 'nullable';
import { SomeOther } from 'other';
interface A<T extends Nullable> {
  	bar: T;
}
export const a: A<SomeOther> = {
  	foo: 'bar',
};
    `,
		// https://github.com/bradzacher/eslint-plugin-typescript/issues/150
		`
export class App {
  	constructor(private logger: Logger) {
    	console.log(this.logger);
  	}
}
    `,
		`
export class App {
  	constructor(bar: string);
  	constructor(private logger: Logger) {
    	console.log(this.logger);
  	}
}
    `,
		`
export class App {
  	constructor(
    	baz: string,
    	private logger: Logger,
  	) {
    	console.log(baz);
    	console.log(this.logger);
  	}
}
    `,
		`
export class App {
  	constructor(
    	baz: string,
    	private logger: Logger,
    	private bar: () => void,
  	) {
    	console.log(this.logger);
    	this.bar();
  	}
}
    `,
		`
export class App {
  	constructor(private logger: Logger) {}
  	meth() {
    	console.log(this.logger);
  	}
}
    `,
		// https://github.com/bradzacher/eslint-plugin-typescript/issues/126
		`
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from './components/HelloWorld.vue';

@Component({
  	components: {
    	HelloWorld,
  	},
})
export default class App extends Vue {}
    `,
		// https://github.com/bradzacher/eslint-plugin-typescript/issues/189
		`
import firebase, { User } from 'firebase/app';
// initialize firebase project
firebase.initializeApp({});
export function authenticated(cb: (user: User | null) => void): void {
  	firebase.auth().onAuthStateChanged(user => cb(user));
}
    `,
		// https://github.com/bradzacher/eslint-plugin-typescript/issues/33
		`
import { Foo } from './types';
export class Bar<T extends Foo> {
  	prop: T;
}
    `,
		`
import webpack from 'webpack';
export default function webpackLoader(this: webpack.loader.LoaderContext) {}
    `,
		`
import execa, { Options as ExecaOptions } from 'execa';
export function foo(options: ExecaOptions): execa {
  	options();
}
    `,
		`
import { Foo, Bar } from './types';
export class Baz<F = Foo & Bar> {
  	prop: F;
}
    `,
		`
// warning 'B' is defined but never used
export const a: Array<{ b: B }> = [];
    `,
		`
export enum FormFieldIds {
  	PHONE = 'phone',
  	EMAIL = 'email',
}
    `,
		`
enum FormFieldIds {
  	PHONE = 'phone',
  	EMAIL = 'email',
}
export interface IFoo {
  	fieldName: FormFieldIds;
}
    `,
		`
enum FormFieldIds {
  	PHONE = 'phone',
  	EMAIL = 'email',
}
export interface IFoo {
  	fieldName: FormFieldIds.EMAIL;
}
    `,
		// https://github.com/typescript-eslint/typescript-eslint/issues/25
		`
import * as fastify from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
const server: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse> =
  	fastify({});
server.get('/ping');
    `,
		// https://github.com/typescript-eslint/typescript-eslint/issues/61
		`
declare namespace Foo {
  	function bar(line: string, index: number | null, tabSize: number): number;
  	var baz: string;
}
console.log(Foo);
    `,
		`
import foo from 'foo';
export interface Bar extends foo.i18n {}
    `,
		`
import foo from 'foo';
import bar from 'foo';
export interface Bar extends foo.i18n<bar> {}
    `,
		{
			// https://github.com/typescript-eslint/typescript-eslint/issues/141
			code: `
		import { TypeA } from './interface';
		export const a = <GenericComponent<TypeA> />;
      	`,
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
			},
		},
		{
			// https://github.com/typescript-eslint/typescript-eslint/issues/160
			code: `
		const text = 'text';
		export function Foo() {
  			return (
    			<div>
      				<input type="search" size={30} placeholder={text} />
    			</div>
  			);
		}
      `,
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
			},
		},
		// https://github.com/eslint/typescript-eslint-parser/issues/535
		`
import { observable } from 'mobx';
export default class ListModalStore {
  	@observable
  	orderList: IObservableArray<BizPurchaseOrderTO> = observable([]);
}
    `,
		// https://github.com/typescript-eslint/typescript-eslint/issues/122#issuecomment-462008078
		`
import { Dec, TypeA, Class } from 'test';
export default class Foo {
  	constructor(
    	@Dec(Class)
    	private readonly prop: TypeA<Class>,
  	) {}
}
    `,
		`
import { Dec, TypeA, Class } from 'test';
export default class Foo {
  	constructor(
    	@Dec(Class)
    	...prop: TypeA<Class>
  	) {
    	prop();
  	}
}
    `,
		`
export function foo(): void;
export function foo(): void;
export function foo(): void {}
    `,
		`
export function foo(a: number): number;
export function foo(a: string): string;
export function foo(a: number | string): number | string {
  	return a;
}
    `,
		`
export function foo<T>(a: number): T;
export function foo<T>(a: string): T;
export function foo<T>(a: number | string): T {
  	return a;
}
    `,
		`
export type T = {
  	new (): T;
  	new (arg: number): T;
  	new <T>(arg: number): T;
};
    `,
		`
export type T = new () => T;
export type T = new (arg: number) => T;
export type T = new <T>(arg: number) => T;
    `,
		`
enum Foo {
  	a,
}
export type T = {
  	[Foo.a]: 1;
};
    `,
		`
type Foo = string;
export class Bar {
  	[x: Foo]: any;
}
    `,
		`
type Foo = string;
export class Bar {
  	[x: Foo]: Foo;
}
    `,
		`
namespace Foo {
  	export const Foo = 1;
}

export { Foo };
    `,
		`
export namespace Foo {
  	export const item: Foo = 1;
}
    `,
		`
namespace foo.bar {
  	export interface User {
    	name: string;
  	}
}
    `,
		// exported self-referencing types
		`
export interface Foo {
  	bar: string;
  	baz: Foo['bar'];
}
    `,
		`
export type Bar = Array<Bar>;
    `,
		// declaration merging
		`
function Foo() {}

namespace Foo {
  	export const x = 1;
}

export { Foo };
    `,
		`
class Foo {}

namespace Foo {
  	export const x = 1;
}

export { Foo };
    `,
		`
namespace Foo {}

const Foo = 1;

export { Foo };
    `,
		`
type Foo = {
  	error: Error | null;
};

export function foo() {
  	return new Promise<Foo>();
}
    `,
		// https://github.com/typescript-eslint/typescript-eslint/issues/5152
		`
export function foo<T>(value: T): T {
  	return { value };
}
export type Foo<T> = typeof foo<T>;
    `,
		// https://github.com/typescript-eslint/typescript-eslint/issues/2331
		{
			code: `
		export interface Event<T> {
  		(
    		listener: (e: T) => any,
    		thisArgs?: any,
    		disposables?: Disposable[],
  		): Disposable;
		}
      	`,
			options: [
				{
					args: "after-used",
					argsIgnorePattern: "^_",
					ignoreRestSiblings: true,
					varsIgnorePattern: "^_$",
				},
			],
		},
		// https://github.com/typescript-eslint/typescript-eslint/issues/2369
		`
export class Test {
  	constructor(@Optional() value: number[] = []) {
    	console.log(value);
  	}
}

function Optional() {
  	return () => {};
}
    `,
		// https://github.com/typescript-eslint/typescript-eslint/issues/2417
		`
import { FooType } from './fileA';

export abstract class Foo {
  	protected abstract readonly type: FooType;
}
    `,
		// https://github.com/typescript-eslint/typescript-eslint/issues/2449
		`
export type F<A extends unknown[]> = (...a: A) => unknown;
    `,
		`
import { Foo } from './bar';
export type F<A extends unknown[]> = (...a: Foo<A>) => unknown;
    `,
		// https://github.com/typescript-eslint/typescript-eslint/issues/2452
		`
type StyledPaymentProps = {
  	isValid: boolean;
};

export const StyledPayment = styled.div<StyledPaymentProps>\`\`;
    `,
		// https://github.com/typescript-eslint/typescript-eslint/issues/2453
		`
import type { foo } from './a';
export type Bar = typeof foo;
    `,
		// https://github.com/typescript-eslint/typescript-eslint/issues/2456
		{
			filename: "foo.d.ts",
			code: `
		interface Foo {}
		type Bar = {};
		declare class Clazz {}
		declare function func();
		declare enum Enum {}
		declare namespace Name {}
		declare const v1;
		declare var v2;
		declare let v3;
		declare const { v4 };
		declare const { v4: v5 };
		declare const [v6];
      `,
		},
		// https://github.com/typescript-eslint/typescript-eslint/issues/2459
		`
export type Test<U> = U extends (k: infer I) => void ? I : never;
    `,
		`
export type Test<U> = U extends { [k: string]: infer I } ? I : never;
    `,
		`
export type Test<U> = U extends (arg: {
  	[k: string]: (arg2: infer I) => void;
}) => void
  	? I
  	: never;
    `,
		// https://github.com/typescript-eslint/typescript-eslint/issues/2455
		{
			code: `
        import React from 'react';

        export const ComponentFoo: React.FC = () => {
          	return <div>Foo Foo</div>;
        };
      `,
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
			},
		},
		{
			code: `
        import { h } from 'some-other-jsx-lib';

        export const ComponentFoo: h.FC = () => {
          	return <div>Foo Foo</div>;
        };
      `,
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
					jsxPragma: "h",
				},
			},
		},
		{
			code: `
        import { Fragment } from 'react';

        export const ComponentFoo: Fragment = () => {
          	return <>Foo Foo</>;
        };
      `,
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
					jsxFragmentName: "Fragment",
				},
			},
		},
		`
declare module 'foo' {
  	type Test = 1;
}
    `,
		`
declare module 'foo' {
  	type Test = 1;
  	const x: Test = 1;
  	export = x;
}
    `,
		// https://github.com/typescript-eslint/typescript-eslint/issues/2523
		`
declare global {
  	interface Foo {}
}
    `,
		`
declare global {
  	namespace jest {
    	interface Matchers<R> {
      	toBeSeven: () => R;
    	}
  	}
}
    `,
		`
export declare namespace Foo {
  	namespace Bar {
    	namespace Baz {
      		namespace Bam {
        		const x = 1;
      		}
    	}
  	}
}
    `,
		`
class Foo<T> {
  	value: T;
}
class Bar<T> {
  	foo = Foo<T>;
}
new Bar();
    `,
		{
			filename: "foo.d.ts",
			code: `
		declare namespace A {
  			export interface A {}
		}
      	`,
		},
		{
			filename: "foo.d.ts",
			code: `
		declare function A(A: string): string;
      	`,
		},
		// 4.1 template literal types
		`
		type Color = 'red' | 'blue';
		type Quantity = 'one' | 'two';
		export type SeussFish = \`\${Quantity | Color} fish\`;
      	`,
		`
		type VerticalAlignment = "top" | "middle" | "bottom";
		type HorizontalAlignment = "left" | "center" | "right";

		export declare function setAlignment(value: \`\${VerticalAlignment}-\${HorizontalAlignment}\`): void;
      	`,
		`
		type EnthusiasticGreeting<T extends string> = \`\${Uppercase<T>} - \${Lowercase<T>} - \${Capitalize<T>} - \${Uncapitalize<T>}\`;
		export type HELLO = EnthusiasticGreeting<"heLLo">;
      	`,
		// https://github.com/typescript-eslint/typescript-eslint/issues/2714
		{
			// unreported because it's in a decl file, even though it's only self-referenced
			filename: "foo.d.ts",
			code: `
		interface IItem {
  			title: string;
  			url: string;
  			children?: IItem[];
		}
      	`,
		},
		// https://github.com/typescript-eslint/typescript-eslint/issues/2648
		{
			code: `
		namespace _Foo {
  			export const bar = 1;
  			export const baz = Foo.bar;
		}
      	`,
			// ignored by pattern, even though it's only self-referenced
			options: [{ varsIgnorePattern: "^_" }],
		},
		{
			code: `
		interface _Foo {
  			a: string;
  			b: Foo;
		}
      	`,
			// ignored by pattern, even though it's only self-referenced
			options: [{ varsIgnorePattern: "^_" }],
		},
		// https://github.com/typescript-eslint/typescript-eslint/issues/2844
		`
declare module 'next-auth' {
  	interface User {
    	id: string;
    	givenName: string;
    	familyName: string;
  	}
}
    `,
		// https://github.com/typescript-eslint/typescript-eslint/issues/2972
		{
			code: `
		import { TestGeneric, Test } from 'fake-module';

		declare function deco(..._param: any): any;
		export class TestClass {
  			@deco
  			public test(): TestGeneric<Test> {}
		}
      	`,
		},
		// https://github.com/typescript-eslint/typescript-eslint/issues/5577
		`
function foo() {}

export class Foo {
  	constructor() {
    	foo();
  	}
}
    `,
		{
			code: `
		function foo() {}

		export class Foo {
  			static {}

  			constructor() {
    		foo();
  			}
		}
      	`,
		},
		`
interface Foo {
  	bar: string;
}
export const Foo = 'bar';
    `,
		`
export const Foo = 'bar';
interface Foo {
  	bar: string;
}
    `,
		`
let foo = 1;
foo ??= 2;
    `,
		`
let foo = 1;
foo &&= 2;
    `,
		`
let foo = 1;
foo ||= 2;
    `,
		`
const foo = 1;
export = foo;
    `,
		`
const Foo = 1;
interface Foo {
  	bar: string;
}
export = Foo;
    `,
		`
interface Foo {
  	bar: string;
}
export = Foo;
    `,
		`
type Foo = 1;
export = Foo;
    `,
		`
type Foo = 1;
export = {} as Foo;
    `,
		`
declare module 'foo' {
  	type Foo = 1;
  	export = Foo;
}
    `,
		`
namespace Foo {
  	export const foo = 1;
}
export namespace Bar {
  	export import TheFoo = Foo;
}
    `,
		{
			code: `
		type _Foo = 1;
		export const x: _Foo = 1;
      	`,
			options: [
				{ reportUsedIgnorePattern: false, varsIgnorePattern: "^_" },
			],
		},
		`
export const foo: number = 1;

export type Foo = typeof foo;
    `,
		`
import { foo } from 'foo';

export type Foo = typeof foo;

export const bar = (): Foo => foo;
    `,
		`
import { SomeType } from 'foo';

export const value = 1234 as typeof SomeType;
    `,
		`
import { foo } from 'foo';

export type Bar = typeof foo;
    `,
		{
			code: `
		export enum Foo {
  			_A,
		}
      	`,
			options: [
				{ reportUsedIgnorePattern: true, varsIgnorePattern: "_" },
			],
		},
		`
const command = (): ParameterDecorator => {
  	return () => {};
};

export class Foo {
  	bar(@command() command: string) {
    	console.log(command);
  	}
}
    `,
		{
			filename: "foo.d.ts",
			code: `
		export namespace Foo {
  			const foo: 1234;
		}
      	`,
		},
		{
			filename: "foo.d.ts",
			code: `
		declare module 'foo' {
  			const foo: 1234;
		}
      	`,
		},
		{
			filename: "foo.d.ts",
			code: `
		const foo: 1234;
      	`,
		},
		{
			filename: "foo.d.ts",
			code: `
		export namespace Foo {
  			export import Bar = Something.Bar;
  			const foo: 1234;
		}
      	`,
		},
		{
			filename: "foo.d.ts",
			code: `
		declare module 'foo' {
  			export import Bar = Something.Bar;
  			const foo: 1234;
		}
      	`,
		},
		{
			filename: "foo.d.ts",
			code: `
		export import Bar = Something.Bar;
		const foo: 1234;
      	`,
		},
		{
			filename: "foo.d.ts",
			code: `
		declare module 'foo' {
  			export import Bar = Something.Bar;
  			const foo: 1234;
  			export const bar: string;
  			export namespace NS {
    			const baz: 1234;
  			}
		}
      	`,
		},
		{
			filename: "foo.d.ts",
			code: `
		export namespace Foo {
  			export import Bar = Something.Bar;
  			const foo: 1234;
  			export const bar: string;
  			export namespace NS {
    			const baz: 1234;
  			}
		}
      	`,
		},
		{
			filename: "foo.d.ts",
			code: `
		export import Bar = Something.Bar;
		const foo: 1234;
		export const bar: string;
		export namespace NS {
  			const baz: 1234;
		}
      	`,
		},
		{
			filename: "foo.d.ts",
			code: `
		export namespace Foo {
  			const foo: 1234;
  			export const bar: string;
  			export namespace NS {
    			const baz: 1234;
  			}
		}
      `,
		},
		{
			filename: "foo.d.ts",
			code: `
		export namespace Foo {
  			type Foo = 1;
  			type Bar = 1;

  			export default function foo(): Bar;
		}
      	`,
		},
		{
			filename: "foo.d.ts",
			code: `
		declare module 'foo' {
  			type Foo = 1;
  			type Bar = 1;

  			export default function foo(): Bar;
		}
      	`,
		},
		{
			filename: "foo.d.ts",
			code: `
		type Foo = 1;
		type Bar = 1;

		export default function foo(): Bar;
      	`,
		},
		{
			filename: "foo.d.ts",
			code: `
		class Foo {}
		declare class Bar {}
      	`,
		},
	],
	invalid: [
		{
			code: "import { ClassDecoratorFactory } from 'decorators'; export class Foo {}",
			errors: [
				{
					column: 10,
					data: {
						action: "defined",
						additional: "",
						varName: "ClassDecoratorFactory",
					},
					endColumn: 31,
					endLine: 1,
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: " export class Foo {}",
							messageId: "removeVar",
							data: { varName: "ClassDecoratorFactory" },
						},
					],
				},
			],
		},
		{
			code: "import { Nullable } from 'nullable';\nimport { SomeOther } from 'other';\nconst a: Nullable<string> = 'hello';\nconsole.log(a);",
			errors: [
				{
					column: 10,
					data: {
						action: "defined",
						additional: "",
						varName: "SomeOther",
					},
					line: 2,
					messageId: "unusedVar",
					suggestions: [
						{
							messageId: "removeVar",
							output: "import { Nullable } from 'nullable';\n\nconst a: Nullable<string> = 'hello';\nconsole.log(a);",
						},
					],
				},
			],
		},
		{
			code: "import { Foo, Bar } from 'foo';\nfunction baz<Foo>(): Foo {}\nbaz<Bar>();",
			errors: [
				{
					column: 10,
					data: {
						action: "defined",
						additional: "",
						varName: "Foo",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "import {  Bar } from 'foo';\nfunction baz<Foo>(): Foo {}\nbaz<Bar>();",
							messageId: "removeVar",
							data: { varName: "Foo" },
						},
					],
				},
			],
		},
		{
			code: "import { Nullable } from 'nullable';\nconst a: string = 'hello';\nconsole.log(a);",
			errors: [
				{
					column: 10,
					data: {
						action: "defined",
						additional: "",
						varName: "Nullable",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "\nconst a: string = 'hello';\nconsole.log(a);",
							messageId: "removeVar",
							data: { varName: "Nullable" },
						},
					],
				},
			],
		},
		{
			code: "import { Nullable } from 'nullable';\nimport { Another } from 'some';\nclass A { do = (a: Nullable) => { console.log(a); }; }\nnew A();",
			errors: [
				{
					column: 10,
					data: {
						action: "defined",
						additional: "",
						varName: "Another",
					},
					line: 2,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "import { Nullable } from 'nullable';\n\nclass A { do = (a: Nullable) => { console.log(a); }; }\nnew A();",
							messageId: "removeVar",
							data: { varName: "Another" },
						},
					],
				},
			],
		},
		{
			code: "import { Nullable } from 'nullable';\nimport { Another } from 'some';\nclass A { do(a: Nullable) { console.log(a); } }\n new A();",
			errors: [
				{
					column: 10,
					data: {
						action: "defined",
						additional: "",
						varName: "Another",
					},
					line: 2,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "import { Nullable } from 'nullable';\n\nclass A { do(a: Nullable) { console.log(a); } }\n new A();",
							messageId: "removeVar",
							data: { varName: "Another" },
						},
					],
				},
			],
		},
		{
			code: "import { Nullable } from 'nullable';\nimport { Another } from 'some';\nclass A { do(): Nullable { return null; } }\n new A();",
			errors: [
				{
					column: 10,
					data: {
						action: "defined",
						additional: "",
						varName: "Another",
					},
					line: 2,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "import { Nullable } from 'nullable';\n\nclass A { do(): Nullable { return null; } }\n new A();",
							messageId: "removeVar",
							data: { varName: "Another" },
						},
					],
				},
			],
		},
		{
			code: "import { Nullable } from 'nullable';\nimport { Another } from 'some';\nexport interface A { do(a: Nullable); }",
			errors: [
				{
					column: 10,
					data: {
						action: "defined",
						additional: "",
						varName: "Another",
					},
					line: 2,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "import { Nullable } from 'nullable';\n\nexport interface A { do(a: Nullable); }",
							messageId: "removeVar",
							data: { varName: "Another" },
						},
					],
				},
			],
		},
		{
			code: "import { Nullable } from 'nullable';\nimport { Another } from 'some';\nexport interface A { other: Nullable; }",
			errors: [
				{
					column: 10,
					data: {
						action: "defined",
						additional: "",
						varName: "Another",
					},
					line: 2,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "import { Nullable } from 'nullable';\n\nexport interface A { other: Nullable; }",
							messageId: "removeVar",
							data: { varName: "Another" },
						},
					],
				},
			],
		},
		{
			code: "import { Nullable } from 'nullable';\nfunction foo(a: string) { console.log(a); }\n foo();",
			errors: [
				{
					column: 10,
					data: {
						action: "defined",
						additional: "",
						varName: "Nullable",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "\nfunction foo(a: string) { console.log(a); }\n foo();",
							messageId: "removeVar",
							data: { varName: "Nullable" },
						},
					],
				},
			],
		},
		{
			code: "import { Nullable } from 'nullable';\nfunction foo(): string | null { return null; }\nfoo();",
			errors: [
				{
					column: 10,
					data: {
						action: "defined",
						additional: "",
						varName: "Nullable",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "\nfunction foo(): string | null { return null; }\nfoo();",
							messageId: "removeVar",
							data: { varName: "Nullable" },
						},
					],
				},
			],
		},
		{
			code: "import { Nullable } from 'nullable';\nimport { SomeOther } from 'some';\nimport { Another } from 'some';\nclass A extends Nullable { other: Nullable<Another>; }\n new A();",
			errors: [
				{
					column: 10,
					data: {
						action: "defined",
						additional: "",
						varName: "SomeOther",
					},
					line: 2,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "import { Nullable } from 'nullable';\n\nimport { Another } from 'some';\nclass A extends Nullable { other: Nullable<Another>; }\n new A();",
							messageId: "removeVar",
							data: { varName: "SomeOther" },
						},
					],
				},
			],
		},
		{
			code: "import { Nullable } from 'nullable';\nimport { SomeOther } from 'some';\nimport { Another } from 'some';\nabstract class A extends Nullable { other: Nullable<Another>; }\n new A();",
			errors: [
				{
					column: 10,
					data: {
						action: "defined",
						additional: "",
						varName: "SomeOther",
					},
					line: 2,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "import { Nullable } from 'nullable';\n\nimport { Another } from 'some';\nabstract class A extends Nullable { other: Nullable<Another>; }\n new A();",
							messageId: "removeVar",
							data: { varName: "SomeOther" },
						},
					],
				},
			],
		},
		{
			code: "enum FormFieldIds { PHONE = 'phone', EMAIL = 'email', }",
			errors: [
				{
					column: 6,
					data: {
						action: "defined",
						additional: "",
						varName: "FormFieldIds",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "",
							messageId: "removeVar",
							data: { varName: "FormFieldIds" },
						},
					],
				},
			],
		},
		{
			code: "import test from 'test';\nimport baz from 'baz';\nexport interface Bar extends baz.test {}",
			errors: [
				{
					column: 8,
					data: {
						action: "defined",
						additional: "",
						varName: "test",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "import 'test';\nimport baz from 'baz';\nexport interface Bar extends baz.test {}",
							messageId: "removeVar",
							data: { varName: "test" },
						},
					],
				},
			],
		},
		// parsing error
		// {
		// 	code: "import test from 'test';\nimport baz from 'baz';\nexport interface Bar extends baz().test {}",
		// 	errors: [
		// 		{
		//   			column: 8,
		//   			data: {
		//     			action: 'defined',
		//     			additional: '',
		//     			varName: 'test',
		//   			},
		//   			line: 1,
		//   			messageId: 'unusedVar',
		// 			suggestions: [
		// 		    	{
		// 			    	output: "import 'test';\nimport baz from 'baz';\nexport interface Bar extends baz().test {}",
		// 			    	messageId: "removeVar",
		// 			  		data: { varName: "test" },
		// 		    	},
		// 	    	],
		// 		},
		// 	],
		// },
		{
			code: "import test from 'test';\nimport baz from 'baz';\nexport class Bar implements baz.test {}",
			errors: [
				{
					column: 8,
					data: {
						action: "defined",
						additional: "",
						varName: "test",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "import 'test';\nimport baz from 'baz';\nexport class Bar implements baz.test {}",
							messageId: "removeVar",
							data: { varName: "test" },
						},
					],
				},
			],
		},
		{
			code: "import test from 'test';\nimport baz from 'baz';\nexport class Bar implements baz().test {}",
			errors: [
				{
					column: 8,
					data: {
						action: "defined",
						additional: "",
						varName: "test",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "import 'test';\nimport baz from 'baz';\nexport class Bar implements baz().test {}",
							messageId: "removeVar",
							data: { varName: "test" },
						},
					],
				},
			],
		},
		{
			code: "namespace Foo {}",
			errors: [
				{
					column: 11,
					data: {
						action: "defined",
						additional: "",
						varName: "Foo",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "",
							messageId: "removeVar",
							data: { varName: "Foo" },
						},
					],
				},
			],
		},
		{
			code: "namespace Foo { export const Foo = 1; }",
			errors: [
				{
					column: 11,
					data: {
						action: "defined",
						additional: "",
						varName: "Foo",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "",
							messageId: "removeVar",
							data: { varName: "Foo" },
						},
					],
				},
			],
		},
		{
			code: "namespace Foo { const Foo = 1; console.log(Foo); }",
			errors: [
				{
					column: 11,
					data: {
						action: "defined",
						additional: "",
						varName: "Foo",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "",
							messageId: "removeVar",
							data: { varName: "Foo" },
						},
					],
				},
			],
		},
		{
			code: "namespace Foo { export const Bar = 1; console.log(Foo.Bar); }",
			errors: [
				{
					column: 11,
					data: {
						action: "defined",
						additional: "",
						varName: "Foo",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "",
							messageId: "removeVar",
							data: { varName: "Foo" },
						},
					],
				},
			],
		},
		{
			code: "namespace Foo { namespace Foo { export const Bar = 1; console.log(Foo.Bar); } }",
			errors: [
				{
					column: 11,
					data: {
						action: "defined",
						additional: "",
						varName: "Foo",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "",
							messageId: "removeVar",
							data: { varName: "Foo" },
						},
					],
				},
				{
					column: 27,
					data: {
						action: "defined",
						additional: "",
						varName: "Foo",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "namespace Foo {  }",
							messageId: "removeVar",
							data: { varName: "Foo" },
						},
					],
				},
			],
		},
		// self-referencing types
		{
			code: "interface Foo { bar: string;\nbaz: Foo['bar']; }",
			errors: [
				{
					column: 11,
					data: {
						action: "defined",
						additional: "",
						varName: "Foo",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "",
							messageId: "removeVar",
							data: { varName: "Foo" },
						},
					],
				},
			],
		},
		{
			code: "type Foo = Array<Foo>;",
			errors: [
				{
					column: 6,
					data: {
						action: "defined",
						additional: "",
						varName: "Foo",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "",
							messageId: "removeVar",
							data: { varName: "Foo" },
						},
					],
				},
			],
		},
		// https://github.com/typescript-eslint/typescript-eslint/issues/2455
		{
			code: "import React from 'react';\nimport { Fragment } from 'react';\nexport const ComponentFoo = () => { return <div>Foo Foo</div>; };",
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
			},
			errors: [
				{
					column: 10,
					data: {
						action: "defined",
						additional: "",
						varName: "Fragment",
					},
					line: 2,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "import React from 'react';\n\nexport const ComponentFoo = () => { return <div>Foo Foo</div>; };",
							messageId: "removeVar",
							data: { varName: "Fragment" },
						},
					],
				},
			],
		},
		{
			code: "import React from 'react';\nimport { h } from 'some-other-jsx-lib';\nexport const ComponentFoo = () => { return <div>Foo Foo</div>; };",
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
					jsxPragma: "h",
				},
			},
			errors: [
				{
					column: 8,
					data: {
						action: "defined",
						additional: "",
						varName: "React",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "import 'react';\nimport { h } from 'some-other-jsx-lib';\nexport const ComponentFoo = () => { return <div>Foo Foo</div>; };",
							messageId: "removeVar",
							data: { varName: "React" },
						},
					],
				},
			],
		},
		// https://github.com/typescript-eslint/typescript-eslint/issues/3303
		{
			code: "import React from 'react';\nexport const ComponentFoo = () => { return <div>Foo Foo</div>; };",
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
					jsxPragma: null,
				},
			},
			errors: [
				{
					column: 8,
					data: {
						action: "defined",
						additional: "",
						varName: "React",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "import 'react';\nexport const ComponentFoo = () => { return <div>Foo Foo</div>; };",
							messageId: "removeVar",
							data: { varName: "React" },
						},
					],
				},
			],
		},
		{
			code: "declare module 'foo' { type Test = any;\nconst x = 1;\nexport = x; }",
			errors: [
				{
					column: 29,
					data: {
						action: "defined",
						additional: "",
						varName: "Test",
					},
					endColumn: 33,
					endLine: 1,
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "declare module 'foo' { \nconst x = 1;\nexport = x; }",
							messageId: "removeVar",
							data: { varName: "Test" },
						},
					],
				},
			],
		},
		{
			code: "// not declared \nexport namespace Foo { namespace Bar { namespace Baz { namespace Bam { const x = 1; } } } }",
			errors: [
				{
					column: 34,
					data: {
						action: "defined",
						additional: "",
						varName: "Bar",
					},
					line: 2,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "// not declared \nexport namespace Foo {  }",
							messageId: "removeVar",
							data: { varName: "Bar" },
						},
					],
				},
				{
					column: 50,
					data: {
						action: "defined",
						additional: "",
						varName: "Baz",
					},
					line: 2,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "// not declared \nexport namespace Foo { namespace Bar {  } }",
							messageId: "removeVar",
							data: { varName: "Baz" },
						},
					],
				},
				{
					column: 66,
					data: {
						action: "defined",
						additional: "",
						varName: "Bam",
					},
					line: 2,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "// not declared \nexport namespace Foo { namespace Bar { namespace Baz {  } } }",
							messageId: "removeVar",
							data: { varName: "Bam" },
						},
					],
				},
				{
					column: 78,
					data: {
						action: "assigned a value",
						additional: "",
						varName: "x",
					},
					line: 2,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "// not declared \nexport namespace Foo { namespace Bar { namespace Baz { namespace Bam {  } } } }",
							messageId: "removeVar",
							data: { varName: "x" },
						},
					],
				},
			],
		},
		{
			code: "interface Foo { a: string; }\ninterface Foo { b: Foo; }",
			errors: [
				{
					column: 11,
					data: {
						action: "defined",
						additional: "",
						varName: "Foo",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "\ninterface Foo { b: Foo; }",
							messageId: "removeVar",
							data: { varName: "Foo" },
						},
					],
				},
			],
		},
		{
			code: "let x = null;\nx = foo(x);",
			errors: [
				{
					column: 1,
					data: {
						action: "assigned a value",
						additional: "",
						varName: "x",
					},
					endColumn: 2,
					endLine: 2,
					line: 2,
					messageId: "unusedVar",
				},
			],
		},
		{
			code: `
interface Foo {
  bar: string;
}
const Foo = 'bar';
      `,
			errors: [
				{
					column: 7,
					data: {
						action: "assigned a value",
						additional: "",
						varName: "Foo",
					},
					line: 5,
					messageId: "unusedVar",
				},
			],
		},
		{
			code: `
let foo = 1;
foo += 1;
      		`,
			errors: [
				{
					column: 1,
					data: {
						action: "assigned a value",
						additional: "",
						varName: "foo",
					},
					line: 3,
					messageId: "unusedVar",
				},
			],
		},
		{
			code: "interface Foo { bar: string; }\ntype Bar = 1;\nexport = Bar;",
			errors: [
				{
					column: 11,
					data: {
						action: "defined",
						additional: "",
						varName: "Foo",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "\ntype Bar = 1;\nexport = Bar;",
							messageId: "removeVar",
							data: { varName: "Foo" },
						},
					],
				},
			],
		},
		{
			code: "interface Foo { bar: string; }\ntype Bar = 1;\nexport = Foo;",
			errors: [
				{
					column: 6,
					data: {
						action: "defined",
						additional: "",
						varName: "Bar",
					},
					line: 2,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "interface Foo { bar: string; }\n\nexport = Foo;",
							messageId: "removeVar",
							data: { varName: "Bar" },
						},
					],
				},
			],
		},
		{
			code: "namespace Foo { export const foo = 1; }\nexport namespace Bar { import TheFoo = Foo; }",
			errors: [
				{
					column: 31,
					data: {
						action: "defined",
						additional: "",
						varName: "TheFoo",
					},
					line: 2,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "namespace Foo { export const foo = 1; }\nexport namespace Bar {  }",
							messageId: "removeVar",
							data: { varName: "TheFoo" },
						},
					],
				},
			],
		},
		{
			code: "const foo: number = 1;",
			errors: [
				{
					column: 7,
					data: {
						action: "assigned a value",
						additional: "",
						varName: "foo",
					},
					endColumn: 18,
					endLine: 1,
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "",
							messageId: "removeVar",
							data: { varName: "foo" },
						},
					],
				},
			],
		},
		{
			code: "enum Foo { A = 1, B = Foo.A, }",
			errors: [
				{
					data: {
						action: "defined",
						additional: "",
						varName: "Foo",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "",
							messageId: "removeVar",
							data: { varName: "Foo" },
						},
					],
				},
			],
		},

		// reportUsedIgnorePattern
		{
			code: `
type _Foo = 1;
export const x: _Foo = 1;
      `,
			options: [
				{ reportUsedIgnorePattern: true, varsIgnorePattern: "^_" },
			],
			errors: [
				{
					data: {
						additional: ". Used vars must not match /^_/u",
						varName: "_Foo",
					},
					line: 2,
					messageId: "usedIgnoredVar",
				},
			],
		},
		{
			code: `
interface _Foo {}
export const x: _Foo = 1;
      `,
			options: [
				{ reportUsedIgnorePattern: true, varsIgnorePattern: "^_" },
			],
			errors: [
				{
					data: {
						additional: ". Used vars must not match /^_/u",
						varName: "_Foo",
					},
					line: 2,
					messageId: "usedIgnoredVar",
				},
			],
		},
		{
			code: `
enum _Foo {
  A = 1,
}
export const x = _Foo.A;
      `,
			options: [
				{ reportUsedIgnorePattern: true, varsIgnorePattern: "^_" },
			],
			errors: [
				{
					data: {
						additional: ". Used vars must not match /^_/u",
						varName: "_Foo",
					},
					line: 2,
					messageId: "usedIgnoredVar",
				},
			],
		},
		{
			code: `
namespace _Foo {}
export const x = _Foo;
      `,
			options: [
				{ reportUsedIgnorePattern: true, varsIgnorePattern: "^_" },
			],
			errors: [
				{
					data: {
						additional: ". Used vars must not match /^_/u",
						varName: "_Foo",
					},
					line: 2,
					messageId: "usedIgnoredVar",
				},
			],
		},
		{
			code: `
const foo: number = 1;

export type Foo = typeof foo;
      `,
			errors: [
				{
					column: 7,
					data: {
						action: "assigned a value",
						additional: "",
						varName: "foo",
					},
					endColumn: 18,
					endLine: 2,
					line: 2,
					messageId: "usedOnlyAsType",
				},
			],
		},
		{
			code: `
 declare const foo: number;

export type Foo = typeof foo;
      `,
			errors: [
				{
					column: 16,
					data: {
						action: "defined",
						additional: "",
						varName: "foo",
					},
					endColumn: 27,
					endLine: 2,
					line: 2,
					messageId: "usedOnlyAsType",
				},
			],
		},
		{
			code: `
 const foo: number = 1;

export type Foo = typeof foo | string;
      `,
			errors: [
				{
					column: 8,
					data: {
						action: "assigned a value",
						additional: "",
						varName: "foo",
					},
					endColumn: 19,
					endLine: 2,
					line: 2,
					messageId: "usedOnlyAsType",
				},
			],
		},
		{
			code: `
const foo: number = 1;

export type Foo = (typeof foo | string) & { __brand: 'foo' };
      `,
			errors: [
				{
					column: 7,
					data: {
						action: "assigned a value",
						additional: "",
						varName: "foo",
					},
					endColumn: 18,
					endLine: 2,
					line: 2,
					messageId: "usedOnlyAsType",
				},
			],
		},
		{
			code: `
        const foo = {
          bar: {
            baz: 123,
          },
        };

        export type Bar = typeof foo.bar;
      `,
			errors: [
				{
					column: 15,
					data: {
						action: "assigned a value",
						additional: "",
						varName: "foo",
					},
					endColumn: 18,
					endLine: 2,
					line: 2,
					messageId: "usedOnlyAsType",
				},
			],
		},
		{
			code: `
			const foo = {
			bar: {
				baz: 123,
			},
			};

			export type Bar = (typeof foo)['bar'];
			`,
			errors: [
				{
					column: 10,
					data: {
						action: "assigned a value",
						additional: "",
						varName: "foo",
					},
					endColumn: 13,
					endLine: 2,
					line: 2,
					messageId: "usedOnlyAsType",
				},
			],
		},
		{
			code: "const command = (): ParameterDecorator => { return () => {}; };\nexport class Foo { bar(@command() command: string) {} }",
			errors: [
				{
					data: {
						action: "defined",
						additional: "",
						varName: "command",
					},
					line: 2,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "const command = (): ParameterDecorator => { return () => {}; };\nexport class Foo { bar() {} }",
							messageId: "removeVar",
							data: { varName: "command" },
						},
					],
				},
			],
		},
		{
			code: "const command = (): ParameterDecorator => { return () => {}; };\nexport class Foo { bar(@command ...args: any[]) {} }",
			errors: [
				{
					data: {
						action: "defined",
						additional: "",
						varName: "args",
					},
					line: 2,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "const command = (): ParameterDecorator => { return () => {}; };\nexport class Foo { bar() {} }",
							messageId: "removeVar",
							data: { varName: "args" },
						},
					],
				},
			],
		},
		{
			code: "const command = (): ParameterDecorator => { return () => {}; };\nexport class Foo { bar(@command() command: string, @deco ...args: any[]) {} }",
			errors: [
				{
					data: {
						action: "defined",
						additional: "",
						varName: "command",
					},
					line: 2,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "const command = (): ParameterDecorator => { return () => {}; };\nexport class Foo { bar( @deco ...args: any[]) {} }",
							messageId: "removeVar",
							data: { varName: "command" },
						},
					],
				},
				{
					data: {
						action: "defined",
						additional: "",
						varName: "args",
					},
					line: 2,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "const command = (): ParameterDecorator => { return () => {}; };\nexport class Foo { bar(@command() command: string) {} }",
							messageId: "removeVar",
							data: { varName: "args" },
						},
					],
				},
			],
		},
		{
			code: "declare const deco: () => ParameterDecorator;\nexport class Foo { bar(@deco() deco, @deco() param) {} }",
			errors: [
				{
					column: 32,
					data: {
						action: "defined",
						additional: "",
						varName: "deco",
					},
					line: 2,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "declare const deco: () => ParameterDecorator;\nexport class Foo { bar( @deco() param) {} }",
							messageId: "removeVar",
							data: { varName: "deco" },
						},
					],
				},
				{
					data: {
						action: "defined",
						additional: "",
						varName: "param",
					},
					line: 2,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "declare const deco: () => ParameterDecorator;\nexport class Foo { bar(@deco() deco) {} }",
							messageId: "removeVar",
							data: { varName: "param" },
						},
					],
				},
			],
		},
		{
			filename: "foo.d.ts",
			code: "export namespace Foo { const foo: 1234;\nexport {}; }",
			errors: [
				{
					data: {
						action: "defined",
						additional: "",
						varName: "foo",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "export namespace Foo { \nexport {}; }",
							messageId: "removeVar",
							data: { varName: "foo" },
						},
					],
				},
			],
		},
		{
			filename: "foo.d.ts",
			code: "const foo: 1234;\nexport {};",
			errors: [
				{
					data: {
						action: "defined",
						additional: "",
						varName: "foo",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "\nexport {};",
							messageId: "removeVar",
							data: { varName: "foo" },
						},
					],
				},
			],
		},
		{
			code: "declare module 'foo' { const foo: 1234;\nexport {}; }",
			errors: [
				{
					data: {
						action: "defined",
						additional: "",
						varName: "foo",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "declare module 'foo' { \nexport {}; }",
							messageId: "removeVar",
							data: { varName: "foo" },
						},
					],
				},
			],
			filename: "foo.d.ts",
		},
		{
			filename: "foo.d.ts",
			code: "export namespace Foo { const foo: 1234;\nconst bar: 4567;\nexport { bar }; }",
			errors: [
				{
					data: {
						action: "defined",
						additional: "",
						varName: "foo",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "export namespace Foo { \nconst bar: 4567;\nexport { bar }; }",
							messageId: "removeVar",
							data: { varName: "foo" },
						},
					],
				},
			],
		},
		{
			filename: "foo.d.ts",
			code: "const foo: 1234;\nconst bar: 4567;\nexport { bar };",
			errors: [
				{
					data: {
						action: "defined",
						additional: "",
						varName: "foo",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "\nconst bar: 4567;\nexport { bar };",
							messageId: "removeVar",
							data: { varName: "foo" },
						},
					],
				},
			],
		},
		{
			filename: "foo.d.ts",
			code: "declare module 'foo' { const foo: 1234;\nconst bar: 4567;\nexport { bar }; }",
			errors: [
				{
					data: {
						action: "defined",
						additional: "",
						varName: "foo",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "declare module 'foo' { \nconst bar: 4567;\nexport { bar }; }",
							messageId: "removeVar",
							data: { varName: "foo" },
						},
					],
				},
			],
		},
		{
			filename: "foo.d.ts",
			code: "export namespace Foo { const foo: 1234;\nconst bar: 4567;\nexport const bazz: 4567;\nexport { bar }; }",
			errors: [
				{
					data: {
						action: "defined",
						additional: "",
						varName: "foo",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "export namespace Foo { \nconst bar: 4567;\nexport const bazz: 4567;\nexport { bar }; }",
							messageId: "removeVar",
							data: { varName: "foo" },
						},
					],
				},
			],
		},
		{
			filename: "foo.d.ts",
			code: "const foo: 1234;\nconst bar: 4567;\nexport const bazz: 4567;\nexport { bar };",
			errors: [
				{
					data: {
						action: "defined",
						additional: "",
						varName: "foo",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "\nconst bar: 4567;\nexport const bazz: 4567;\nexport { bar };",
							messageId: "removeVar",
							data: { varName: "foo" },
						},
					],
				},
			],
		},
		{
			filename: "foo.d.ts",
			code: "declare module 'foo' { const foo: 1234;\nconst bar: 4567;\nexport const bazz: 4567;\nexport { bar }; }",
			errors: [
				{
					data: {
						action: "defined",
						additional: "",
						varName: "foo",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "declare module 'foo' { \nconst bar: 4567;\nexport const bazz: 4567;\nexport { bar }; }",
							messageId: "removeVar",
							data: { varName: "foo" },
						},
					],
				},
			],
		},
		{
			filename: "foo.d.ts",
			code: "export namespace Foo { const foo: string;\nconst bar: number;\nexport default bar; }",
			errors: [
				{
					data: {
						action: "defined",
						additional: "",
						varName: "foo",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "export namespace Foo { \nconst bar: number;\nexport default bar; }",
							messageId: "removeVar",
							data: { varName: "foo" },
						},
					],
				},
			],
		},
		{
			filename: "foo.d.ts",
			code: "const foo: string;\nconst bar: number;\nexport default bar;",
			errors: [
				{
					data: {
						action: "defined",
						additional: "",
						varName: "foo",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "\nconst bar: number;\nexport default bar;",
							messageId: "removeVar",
							data: { varName: "foo" },
						},
					],
				},
			],
		},
		{
			filename: "foo.d.ts",
			code: "declare module 'foo' { const foo: string;\nconst bar: number;\nexport default bar; }",
			errors: [
				{
					data: {
						action: "defined",
						additional: "",
						varName: "foo",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "declare module 'foo' { \nconst bar: number;\nexport default bar; }",
							messageId: "removeVar",
							data: { varName: "foo" },
						},
					],
				},
			],
		},
		{
			filename: "foo.d.ts",
			code: "export namespace Foo { const foo: string;\nconst bar: number;\nexport const bazz: number;\nexport default bar; }",
			errors: [
				{
					data: {
						action: "defined",
						additional: "",
						varName: "foo",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "export namespace Foo { \nconst bar: number;\nexport const bazz: number;\nexport default bar; }",
							messageId: "removeVar",
							data: { varName: "foo" },
						},
					],
				},
			],
		},
		{
			filename: "foo.d.ts",
			code: "const foo: string;\nconst bar: number;\nexport const bazz: number;\nexport default bar;",
			errors: [
				{
					data: {
						action: "defined",
						additional: "",
						varName: "foo",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "\nconst bar: number;\nexport const bazz: number;\nexport default bar;",
							messageId: "removeVar",
							data: { varName: "foo" },
						},
					],
				},
			],
		},
		{
			filename: "foo.d.ts",
			code: "declare module 'foo' { const foo: string;\nconst bar: number;\nexport const bazz: number;\nexport default bar; }",
			errors: [
				{
					data: {
						action: "defined",
						additional: "",
						varName: "foo",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "declare module 'foo' { \nconst bar: number;\nexport const bazz: number;\nexport default bar; }",
							messageId: "removeVar",
							data: { varName: "foo" },
						},
					],
				},
			],
		},
		{
			filename: "foo.d.ts",
			code: "export namespace Foo { const foo: string;\nexport const bar: number;\nexport * from '...'; }",
			errors: [
				{
					data: {
						action: "defined",
						additional: "",
						varName: "foo",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "export namespace Foo { \nexport const bar: number;\nexport * from '...'; }",
							messageId: "removeVar",
							data: { varName: "foo" },
						},
					],
				},
			],
		},
		{
			filename: "foo.d.ts",
			code: "const foo: string;\nexport const bar: number;\nexport * from '...';",
			errors: [
				{
					data: {
						action: "defined",
						additional: "",
						varName: "foo",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "\nexport const bar: number;\nexport * from '...';",
							messageId: "removeVar",
							data: { varName: "foo" },
						},
					],
				},
			],
		},
		{
			filename: "foo.d.ts",
			code: "declare module 'foo' {const foo: string;\nexport const bar: number;\nexport * from '...'; }",
			errors: [
				{
					data: {
						action: "defined",
						additional: "",
						varName: "foo",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "declare module 'foo' {\nexport const bar: number;\nexport * from '...'; }",
							messageId: "removeVar",
							data: { varName: "foo" },
						},
					],
				},
			],
		},
		{
			filename: "foo.d.ts",
			code: "namespace Foo { type Foo = 1;\ntype Bar = 1;\nexport = Bar; }",
			errors: [
				{
					data: {
						action: "defined",
						additional: "",
						varName: "Foo",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "namespace Foo { \ntype Bar = 1;\nexport = Bar; }",
							messageId: "removeVar",
							data: { varName: "Foo" },
						},
					],
				},
			],
		},
		{
			filename: "foo.d.ts",
			code: "type Foo = 1;\ntype Bar = 1;\nexport = Bar;",
			errors: [
				{
					data: {
						action: "defined",
						additional: "",
						varName: "Foo",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "\ntype Bar = 1;\nexport = Bar;",
							messageId: "removeVar",
							data: { varName: "Foo" },
						},
					],
				},
			],
		},
		{
			filename: "foo.d.ts",
			code: "declare module 'foo' { type Foo = 1; type Bar = 1; export = Bar; }",
			errors: [
				{
					data: {
						action: "defined",
						additional: "",
						varName: "Foo",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "declare module 'foo' {  type Bar = 1; export = Bar; }",
							messageId: "removeVar",
							data: { varName: "Foo" },
						},
					],
				},
			],
		},
		{
			filename: "foo.d.ts",
			code: "declare module 'foo' { type Test = 1; export {}; }",
			errors: [
				{
					data: {
						action: "defined",
						additional: "",
						varName: "Test",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "declare module 'foo' {  export {}; }",
							messageId: "removeVar",
							data: { varName: "Test" },
						},
					],
				},
			],
		},
		{
			code: "export declare namespace Foo { namespace Bar { namespace Baz { namespace Bam { const x = 1; } export {}; } } }",
			errors: [
				{
					data: {
						action: "defined",
						additional: "",
						varName: "Bam",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "export declare namespace Foo { namespace Bar { namespace Baz {  export {}; } } }",
							messageId: "removeVar",
							data: { varName: "Bam" },
						},
					],
				},
			],
		},
		{
			code: "declare module 'foo' { namespace Bar { namespace Baz { namespace Bam { const x = 1; } export {}; } } }",
			errors: [
				{
					data: {
						action: "defined",
						additional: "",
						varName: "Bam",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "declare module 'foo' { namespace Bar { namespace Baz {  export {}; } } }",
							messageId: "removeVar",
							data: { varName: "Bam" },
						},
					],
				},
			],
		},
		{
			code: "declare enum Foo {}\nexport {};",
			errors: [
				{
					data: {
						action: "defined",
						additional: "",
						varName: "Foo",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "\nexport {};",
							messageId: "removeVar",
							data: { varName: "Foo" },
						},
					],
				},
			],
		},
		{
			filename: "foo.d.ts",
			code: "class Foo {}\ndeclare class Bar {}\nexport {};",
			errors: [
				{
					data: {
						action: "defined",
						additional: "",
						varName: "Foo",
					},
					line: 1,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "\ndeclare class Bar {}\nexport {};",
							messageId: "removeVar",
							data: { varName: "Foo" },
						},
					],
				},
				{
					data: {
						action: "defined",
						additional: "",
						varName: "Bar",
					},
					line: 2,
					messageId: "unusedVar",
					suggestions: [
						{
							output: "class Foo {}\n\nexport {};",
							messageId: "removeVar",
							data: { varName: "Bar" },
						},
					],
				},
			],
		},
	],
});
