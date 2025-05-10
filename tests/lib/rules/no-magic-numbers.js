/**
 * @fileoverview Tests for no-magic-numbers rule.
 * @author Vincent Lemeunier
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-magic-numbers"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-magic-numbers", rule, {
	valid: [
		"var x = parseInt(y, 10);",
		"var x = parseInt(y, -10);",
		"var x = Number.parseInt(y, 10);",
		"const MY_NUMBER = +42;",
		{
			code: "const foo = 42;",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = 42;",
			options: [
				{
					enforceConst: false,
				},
			],
			languageOptions: { ecmaVersion: 6 },
		},
		"var foo = -42;",
		{
			code: "var foo = 0 + 1 - 2 + -2;",
			options: [
				{
					ignore: [0, 1, 2, -2],
				},
			],
		},
		{
			code: "var foo = 0 + 1 + 2 + 3 + 4;",
			options: [
				{
					ignore: [0, 1, 2, 3, 4],
				},
			],
		},
		"var foo = { bar:10 }",
		{
			code: "setTimeout(function() {return 1;}, 0);",
			options: [
				{
					ignore: [0, 1],
				},
			],
		},
		{
			code: "var data = ['foo', 'bar', 'baz']; var third = data[3];",
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
		},
		{
			code: "foo[0]",
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
		},
		{
			code: "foo[-0]", // Allowed. -0 is not the same as 0 but it will be coerced to "0", so foo[-0] refers to the element at index 0.
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
		},
		{
			code: "foo[1]",
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
		},
		{
			code: "foo[100]",
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
		},
		{
			code: "foo[200.00]",
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
		},
		{
			code: "foo[3e4]",
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
		},
		{
			code: "foo[1.23e2]",
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
		},
		{
			code: "foo[230e-1]",
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
		},
		{
			code: "foo[0b110]",
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "foo[0o71]",
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			languageOptions: { ecmaVersion: 2015 },
		},
		{
			code: "foo[0xABC]",
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
		},
		{
			code: "foo[0123]",
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			languageOptions: {
				sourceType: "script",
			},
		},
		{
			code: "foo[5.0000000000000001]", // loses precision and evaluates to 5
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
		},
		{
			code: "foo[4294967294]", // max array index
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
		},
		{
			code: "foo[0n]", // Allowed. 0n will be coerced to "0", so foo[0n] refers to the element at index 0.
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "foo[-0n]", // Allowed. -0n evaluates to 0n which will be coerced to "0", so foo[-0n] refers to the element at index 0.
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "foo[1n]", // Allowed. 1n will be coerced to "1", so foo[1n] refers to the element at index 1.
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "foo[100n]", // Allowed. 100n will be coerced to "100", so foo[100n] refers to the element at index 100.
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "foo[0xABn]", // Allowed. 0xABn is evaluated to 171n and will be coerced to "171", so foo[0xABn] refers to the element at index 171.
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "foo[4294967294n]", // max array index
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "var a = <input maxLength={10} />;",
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
			},
		},
		{
			code: "var a = <div objectProp={{ test: 1}}></div>;",
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
			},
		},
		{
			code: "f(100n)",
			options: [{ ignore: ["100n"] }],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "f(-100n)",
			options: [{ ignore: ["-100n"] }],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "const { param = 123 } = sourceObject;",
			options: [{ ignoreDefaultValues: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const func = (param = 123) => {}",
			options: [{ ignoreDefaultValues: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const func = ({ param = 123 }) => {}",
			options: [{ ignoreDefaultValues: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "const [one = 1, two = 2] = []",
			options: [{ ignoreDefaultValues: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var one, two; [one = 1, two = 2] = []",
			options: [{ ignoreDefaultValues: true }],
			languageOptions: { ecmaVersion: 6 },
		},

		// Optional chaining
		{
			code: "var x = parseInt?.(y, 10);",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "var x = Number?.parseInt(y, 10);",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "var x = (Number?.parseInt)(y, 10);",
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "foo?.[777]",
			options: [{ ignoreArrayIndexes: true }],
			languageOptions: { ecmaVersion: 2020 },
		},

		// ignoreClassFieldInitialValues
		{
			code: "class C { foo = 2; }",
			options: [{ ignoreClassFieldInitialValues: true }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { foo = -2; }",
			options: [{ ignoreClassFieldInitialValues: true }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static foo = 2; }",
			options: [{ ignoreClassFieldInitialValues: true }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { #foo = 2; }",
			options: [{ ignoreClassFieldInitialValues: true }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static #foo = 2; }",
			options: [{ ignoreClassFieldInitialValues: true }],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "foo[+0]", // Consistent with the default behavior, which allows: var foo = +0
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
		},
		{
			code: "foo[+1]", // Consistent with the default behavior, which allows: var foo = +1
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
		},
		{
			code: "foo[+0n]", // Consistent with the default behavior, which allows: var foo = +0n
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			languageOptions: { ecmaVersion: 2020 },
		},
		{
			code: "foo[+1n]", // Consistent with the default behavior, which allows: var foo = +1n
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			languageOptions: { ecmaVersion: 2020 },
		},
	],
	invalid: [
		{
			code: "var foo = 42",
			options: [
				{
					enforceConst: true,
				},
			],
			languageOptions: { ecmaVersion: 6 },
			errors: [{ messageId: "useConst" }],
		},
		{
			code: "var foo = 0 + 1;",
			errors: [
				{ messageId: "noMagic", data: { raw: "0" } },
				{ messageId: "noMagic", data: { raw: "1" } },
			],
		},
		{
			code: "var foo = 42n",
			options: [
				{
					enforceConst: true,
				},
			],
			languageOptions: {
				ecmaVersion: 2020,
			},
			errors: [{ messageId: "useConst" }],
		},
		{
			code: "var foo = 0n + 1n;",
			languageOptions: {
				ecmaVersion: 2020,
			},
			errors: [
				{ messageId: "noMagic", data: { raw: "0n" } },
				{ messageId: "noMagic", data: { raw: "1n" } },
			],
		},
		{
			code: "a = a + 5;",
			errors: [{ messageId: "noMagic", data: { raw: "5" } }],
		},
		{
			code: "a += 5;",
			errors: [{ messageId: "noMagic", data: { raw: "5" } }],
		},
		{
			code: "var foo = 0 + 1 + -2 + 2;",
			errors: [
				{ messageId: "noMagic", data: { raw: "0" } },
				{ messageId: "noMagic", data: { raw: "1" } },
				{ messageId: "noMagic", data: { raw: "-2" } },
				{ messageId: "noMagic", data: { raw: "2" } },
			],
		},
		{
			code: "var foo = 0 + 1 + 2;",
			options: [
				{
					ignore: [0, 1],
				},
			],
			errors: [{ messageId: "noMagic", data: { raw: "2" } }],
		},
		{
			code: "var foo = { bar:10 }",
			options: [
				{
					detectObjects: true,
				},
			],
			errors: [{ messageId: "noMagic", data: { raw: "10" } }],
		},
		{
			code: "console.log(0x1A + 0x02); console.log(071);",
			languageOptions: {
				sourceType: "script",
			},
			errors: [
				{ messageId: "noMagic", data: { raw: "0x1A" } },
				{ messageId: "noMagic", data: { raw: "0x02" } },
				{ messageId: "noMagic", data: { raw: "071" } },
			],
		},
		{
			code: "var stats = {avg: 42};",
			options: [
				{
					detectObjects: true,
				},
			],
			errors: [{ messageId: "noMagic", data: { raw: "42" } }],
		},
		{
			code: "var colors = {}; colors.RED = 2; colors.YELLOW = 3; colors.BLUE = 4 + 5;",
			errors: [
				{ messageId: "noMagic", data: { raw: "4" } },
				{ messageId: "noMagic", data: { raw: "5" } },
			],
		},
		{
			code: "function getSecondsInMinute() {return 60;}",
			errors: [{ messageId: "noMagic", data: { raw: "60" } }],
		},
		{
			code: "function getNegativeSecondsInMinute() {return -60;}",
			errors: [{ messageId: "noMagic", data: { raw: "-60" } }],
		},
		{
			code:
				"var Promise = require('bluebird');\n" +
				"var MINUTE = 60;\n" +
				"var HOUR = 3600;\n" +
				"const DAY = 86400;\n" +
				"var configObject = {\n" +
				"key: 90,\n" +
				"another: 10 * 10,\n" +
				"10: 'an \"integer\" key'\n" +
				"};\n" +
				"function getSecondsInDay() {\n" +
				" return 24 * HOUR;\n" +
				"}\n" +
				"function getMillisecondsInDay() {\n" +
				"return (getSecondsInDay() *\n" +
				"(1000)\n" +
				");\n" +
				"}\n" +
				"function callSetTimeoutZero(func) {\n" +
				"setTimeout(func, 0);\n" +
				"}\n" +
				"function invokeInTen(func) {\n" +
				"setTimeout(func, 10);\n" +
				"}\n",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{ messageId: "noMagic", data: { raw: "10" }, line: 7 },
				{ messageId: "noMagic", data: { raw: "10" }, line: 7 },
				{ messageId: "noMagic", data: { raw: "24" }, line: 11 },
				{ messageId: "noMagic", data: { raw: "1000" }, line: 15 },
				{ messageId: "noMagic", data: { raw: "0" }, line: 19 },
				{ messageId: "noMagic", data: { raw: "10" }, line: 22 },
			],
		},
		{
			code: "var data = ['foo', 'bar', 'baz']; var third = data[3];",
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "3" },
					line: 1,
				},
			],
		},
		{
			code: "var data = ['foo', 'bar', 'baz']; var third = data[3];",
			options: [{}],
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "3" },
					line: 1,
				},
			],
		},
		{
			code: "var data = ['foo', 'bar', 'baz']; var third = data[3];",
			options: [
				{
					ignoreArrayIndexes: false,
				},
			],
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "3" },
					line: 1,
				},
			],
		},
		{
			code: "foo[-100]",
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "-100" },
					line: 1,
				},
			],
		},
		{
			code: "foo[-1.5]",
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "-1.5" },
					line: 1,
				},
			],
		},
		{
			code: "foo[-1]",
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "-1" },
					line: 1,
				},
			],
		},
		{
			code: "foo[-0.1]",
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "-0.1" },
					line: 1,
				},
			],
		},
		{
			code: "foo[-0b110]",
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "-0b110" },
					line: 1,
				},
			],
		},
		{
			code: "foo[-0o71]",
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "-0o71" },
					line: 1,
				},
			],
		},
		{
			code: "foo[-0x12]",
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "-0x12" },
					line: 1,
				},
			],
		},
		{
			code: "foo[-012]",
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			languageOptions: { sourceType: "script" },
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "-012" },
					line: 1,
				},
			],
		},
		{
			code: "foo[0.1]",
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "0.1" },
					line: 1,
				},
			],
		},
		{
			code: "foo[0.12e1]",
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "0.12e1" },
					line: 1,
				},
			],
		},
		{
			code: "foo[1.5]",
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "1.5" },
					line: 1,
				},
			],
		},
		{
			code: "foo[1.678e2]", // 167.8
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "1.678e2" },
					line: 1,
				},
			],
		},
		{
			code: "foo[56e-1]", // 5.6
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "56e-1" },
					line: 1,
				},
			],
		},
		{
			code: "foo[5.000000000000001]", // doesn't lose precision
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "5.000000000000001" },
					line: 1,
				},
			],
		},
		{
			code: "foo[100.9]",
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "100.9" },
					line: 1,
				},
			],
		},
		{
			code: "foo[4294967295]", // first above the max index
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "4294967295" },
					line: 1,
				},
			],
		},
		{
			code: "foo[1e300]", // Above the max, and also coerces to "1e+300"
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "1e300" },
					line: 1,
				},
			],
		},
		{
			code: "foo[1e310]", // refers to property "Infinity"
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "1e310" },
					line: 1,
				},
			],
		},
		{
			code: "foo[-1e310]", // refers to property "-Infinity"
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "-1e310" },
					line: 1,
				},
			],
		},
		{
			code: "foo[-1n]",
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "-1n" },
					line: 1,
				},
			],
		},
		{
			code: "foo[-100n]",
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "-100n" },
					line: 1,
				},
			],
		},
		{
			code: "foo[-0x12n]",
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "-0x12n" },
					line: 1,
				},
			],
		},
		{
			code: "foo[4294967295n]", // first above the max index
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "4294967295n" },
					line: 1,
				},
			],
		},
		{
			code: "foo[-(-1)]", // Consistent with the default behavior, which doesn't allow: var foo = -(-1)
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "-1" },
					line: 1,
				},
			],
		},
		{
			code: "foo[- -1n]", // Consistent with the default behavior, which doesn't allow: var foo = - -1n
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			languageOptions: { ecmaVersion: 2020 },
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "-1n" },
					line: 1,
				},
			],
		},
		{
			code: "100 .toString()",
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "100" },
					line: 1,
				},
			],
		},
		{
			code: "200[100]",
			options: [
				{
					ignoreArrayIndexes: true,
				},
			],
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "200" },
					line: 1,
				},
			],
		},
		{
			code: "var a = <div arrayProp={[1,2,3]}></div>;",
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
			},
			errors: [
				{ messageId: "noMagic", data: { raw: "1" }, line: 1 },
				{ messageId: "noMagic", data: { raw: "2" }, line: 1 },
				{ messageId: "noMagic", data: { raw: "3" }, line: 1 },
			],
		},
		{
			code: "var min, max, mean; min = 1; max = 10; mean = 4;",
			options: [{}],
			errors: [
				{ messageId: "noMagic", data: { raw: "1" }, line: 1 },
				{ messageId: "noMagic", data: { raw: "10" }, line: 1 },
				{ messageId: "noMagic", data: { raw: "4" }, line: 1 },
			],
		},
		{
			code: "f(100n)",
			options: [{ ignore: [100] }],
			languageOptions: { ecmaVersion: 2020 },
			errors: [{ messageId: "noMagic", data: { raw: "100n" }, line: 1 }],
		},
		{
			code: "f(-100n)",
			options: [{ ignore: ["100n"] }],
			languageOptions: { ecmaVersion: 2020 },
			errors: [{ messageId: "noMagic", data: { raw: "-100n" }, line: 1 }],
		},
		{
			code: "f(100n)",
			options: [{ ignore: ["-100n"] }],
			languageOptions: { ecmaVersion: 2020 },
			errors: [{ messageId: "noMagic", data: { raw: "100n" }, line: 1 }],
		},
		{
			code: "f(100)",
			options: [{ ignore: ["100n"] }],
			errors: [{ messageId: "noMagic", data: { raw: "100" }, line: 1 }],
		},
		{
			code: "const func = (param = 123) => {}",
			options: [{ ignoreDefaultValues: false }],
			languageOptions: { ecmaVersion: 6 },
			errors: [{ messageId: "noMagic", data: { raw: "123" }, line: 1 }],
		},
		{
			code: "const { param = 123 } = sourceObject;",
			options: [{}],
			languageOptions: { ecmaVersion: 6 },
			errors: [{ messageId: "noMagic", data: { raw: "123" }, line: 1 }],
		},
		{
			code: "const { param = 123 } = sourceObject;",
			languageOptions: { ecmaVersion: 6 },
			errors: [{ messageId: "noMagic", data: { raw: "123" }, line: 1 }],
		},
		{
			code: "const { param = 123 } = sourceObject;",
			options: [{ ignoreDefaultValues: false }],
			languageOptions: { ecmaVersion: 6 },
			errors: [{ messageId: "noMagic", data: { raw: "123" }, line: 1 }],
		},
		{
			code: "const [one = 1, two = 2] = []",
			options: [{ ignoreDefaultValues: false }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{ messageId: "noMagic", data: { raw: "1" }, line: 1 },
				{ messageId: "noMagic", data: { raw: "2" }, line: 1 },
			],
		},
		{
			code: "var one, two; [one = 1, two = 2] = []",
			options: [{ ignoreDefaultValues: false }],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{ messageId: "noMagic", data: { raw: "1" }, line: 1 },
				{ messageId: "noMagic", data: { raw: "2" }, line: 1 },
			],
		},

		// ignoreClassFieldInitialValues
		{
			code: "class C { foo = 2; }",
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "2" },
					line: 1,
					column: 17,
				},
			],
		},
		{
			code: "class C { foo = 2; }",
			options: [{}],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "2" },
					line: 1,
					column: 17,
				},
			],
		},
		{
			code: "class C { foo = 2; }",
			options: [{ ignoreClassFieldInitialValues: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "2" },
					line: 1,
					column: 17,
				},
			],
		},
		{
			code: "class C { foo = -2; }",
			options: [{ ignoreClassFieldInitialValues: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "-2" },
					line: 1,
					column: 17,
				},
			],
		},
		{
			code: "class C { static foo = 2; }",
			options: [{ ignoreClassFieldInitialValues: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "2" },
					line: 1,
					column: 24,
				},
			],
		},
		{
			code: "class C { #foo = 2; }",
			options: [{ ignoreClassFieldInitialValues: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "2" },
					line: 1,
					column: 18,
				},
			],
		},
		{
			code: "class C { static #foo = 2; }",
			options: [{ ignoreClassFieldInitialValues: false }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "2" },
					line: 1,
					column: 25,
				},
			],
		},
		{
			code: "class C { foo = 2 + 3; }",
			options: [{ ignoreClassFieldInitialValues: true }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "2" },
					line: 1,
					column: 17,
				},
				{
					messageId: "noMagic",
					data: { raw: "3" },
					line: 1,
					column: 21,
				},
			],
		},
		{
			code: "class C { 2; }",
			options: [{ ignoreClassFieldInitialValues: true }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "2" },
					line: 1,
					column: 11,
				},
			],
		},
		{
			code: "class C { [2]; }",
			options: [{ ignoreClassFieldInitialValues: true }],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "noMagic",
					data: { raw: "2" },
					line: 1,
					column: 12,
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

ruleTesterTypeScript.run("no-magic-numbers", rule, {
	valid: [
		{
			code: "const FOO = 10;",
			options: [{ ignoreNumericLiteralTypes: true }],
		},
		"type Foo = 'bar';",
		"type Foo = true;",
		{
			code: "type Foo = 1;",
			options: [{ ignoreNumericLiteralTypes: true }],
		},
		{
			code: "type Foo = -1;",
			options: [{ ignoreNumericLiteralTypes: true }],
		},
		{
			code: "type Nested = ('' | ('' | (1)));",
			options: [{ ignoreNumericLiteralTypes: true }],
		},
		{
			code: "type Foo = 1 | 2 | 3;",
			options: [{ ignoreNumericLiteralTypes: true }],
		},
		{
			code: "type Foo = 1 | -1;",
			options: [{ ignoreNumericLiteralTypes: true }],
		},
		{
			code: `
		  enum foo {
			SECOND = 1000,
			NUM = '0123456789',
			NEG = -1,
			POS = +1,
		  }
		`,
			options: [{ ignoreEnums: true }],
		},
		{
			code: `
  class Foo {
	readonly A = 1;
	readonly B = 2;
	public static readonly C = 1;
	static readonly D = 1;
	readonly E = -1;
	readonly F = +1;
	private readonly G = 100n;
  }
		`,
			options: [{ ignoreReadonlyClassProperties: true }],
		},
		{
			code: "type Foo = Bar[0];",
			options: [{ ignoreTypeIndexes: true }],
		},
		{
			code: "type Foo = Bar[-1];",
			options: [{ ignoreTypeIndexes: true }],
		},
		{
			code: "type Foo = Bar[0xab];",
			options: [{ ignoreTypeIndexes: true }],
		},
		{
			code: "type Foo = Bar[5.6e1];",
			options: [{ ignoreTypeIndexes: true }],
		},
		{
			code: "type Foo = Bar[10n];",
			options: [{ ignoreTypeIndexes: true }],
		},
		{
			code: "type Foo = Bar[1 | -2];",
			options: [{ ignoreTypeIndexes: true }],
		},
		{
			code: "type Foo = Bar[1 & -2];",
			options: [{ ignoreTypeIndexes: true }],
		},
		{
			code: "type Foo = Bar[1 & number];",
			options: [{ ignoreTypeIndexes: true }],
		},
		{
			code: "type Foo = Bar[((1 & -2) | 3) | 4];",
			options: [{ ignoreTypeIndexes: true }],
		},
		{
			code: "type Foo = Parameters<Bar>[2];",
			options: [{ ignoreTypeIndexes: true }],
		},
		{
			code: "type Foo = Bar['baz'];",
			options: [{ ignoreTypeIndexes: true }],
		},
		{
			code: "type Foo = Bar['baz'];",
			options: [{ ignoreTypeIndexes: false }],
		},
		{
			code: `
  type Others = [['a'], ['b']];
  
  type Foo = {
	[K in keyof Others[0]]: Others[K];
  };
		`,
			options: [{ ignoreTypeIndexes: true }],
		},
		{
			code: "type Foo = 1;",
			options: [{ ignore: [1] }],
		},
		{
			code: "type Foo = -2;",
			options: [{ ignore: [-2] }],
		},
		{
			code: "type Foo = 3n;",
			options: [{ ignore: ["3n"] }],
		},
		{
			code: "type Foo = -4n;",
			options: [{ ignore: ["-4n"] }],
		},
		{
			code: "type Foo = 5.6;",
			options: [{ ignore: [5.6] }],
		},
		{
			code: "type Foo = -7.8;",
			options: [{ ignore: [-7.8] }],
		},
		{
			code: "type Foo = 0x0a;",
			options: [{ ignore: [0x0a] }],
		},
		{
			code: "type Foo = -0xbc;",
			options: [{ ignore: [-0xbc] }],
		},
		{
			code: "type Foo = 1e2;",
			options: [{ ignore: [1e2] }],
		},
		{
			code: "type Foo = -3e4;",
			options: [{ ignore: [-3e4] }],
		},
		{
			code: "type Foo = 5e-6;",
			options: [{ ignore: [5e-6] }],
		},
		{
			code: "type Foo = -7e-8;",
			options: [{ ignore: [-7e-8] }],
		},
		{
			code: "type Foo = 1.1e2;",
			options: [{ ignore: [1.1e2] }],
		},
		{
			code: "type Foo = -3.1e4;",
			options: [{ ignore: [-3.1e4] }],
		},
		{
			code: "type Foo = 5.1e-6;",
			options: [{ ignore: [5.1e-6] }],
		},
		{
			code: "type Foo = -7.1e-8;",
			options: [{ ignore: [-7.1e-8] }],
		},
		{
			code: `
  interface Foo {
	bar: 1;
  }
		`,
			options: [{ ignore: [1], ignoreNumericLiteralTypes: true }],
		},
		{
			code: `
  enum foo {
	SECOND = 1000,
	NUM = '0123456789',
	NEG = -1,
	POS = +2,
  }
		`,
			options: [{ ignore: [1000, -1, 2], ignoreEnums: false }],
		},
		{
			code: `
  class Foo {
	readonly A = 1;
	readonly B = 2;
	public static readonly C = 3;
	static readonly D = 4;
	readonly E = -5;
	readonly F = +6;
	private readonly G = 100n;
	private static readonly H = -2000n;
  }
		`,
			options: [
				{
					ignore: [1, 2, 3, 4, -5, 6, "100n", "-2000n"],
					ignoreReadonlyClassProperties: false,
				},
			],
		},
		{
			code: "type Foo = Bar[0];",
			options: [{ ignore: [0], ignoreTypeIndexes: false }],
		},
		{
			code: `
  type Other = {
	[0]: 3;
  };
  
  type Foo = {
	[K in keyof Other]: \`\${K & number}\`;
  };
		`,
			options: [{ ignore: [0, 3], ignoreTypeIndexes: true }],
		},
		{
			code: `
	class C {
		readonly foo = +42; 
		bar = +42; 
	}

	const MY_NUMBER = +42;
	`,
			options: [
				{
					ignoreClassFieldInitialValues: true,
					ignoreReadonlyClassProperties: true,
				},
			],
		},
	],

	invalid: [
		{
			code: "type Foo = 1;",
			options: [{ ignoreNumericLiteralTypes: false }],
			errors: [
				{
					column: 12,
					data: {
						raw: "1",
					},
					line: 1,
					messageId: "noMagic",
				},
			],
		},
		{
			code: "type Foo = -1;",
			options: [{ ignoreNumericLiteralTypes: false }],
			errors: [
				{
					column: 12,
					data: {
						raw: "-1",
					},
					line: 1,
					messageId: "noMagic",
				},
			],
		},
		{
			code: "type Foo = 1 | 2 | 3;",
			options: [{ ignoreNumericLiteralTypes: false }],
			errors: [
				{
					column: 12,
					data: {
						raw: "1",
					},
					line: 1,
					messageId: "noMagic",
				},
				{
					column: 16,
					data: {
						raw: "2",
					},
					line: 1,
					messageId: "noMagic",
				},
				{
					column: 20,
					data: {
						raw: "3",
					},
					line: 1,
					messageId: "noMagic",
				},
			],
		},
		{
			code: "type Foo = 1 | -1;",
			options: [{ ignoreNumericLiteralTypes: false }],
			errors: [
				{
					column: 12,
					data: {
						raw: "1",
					},
					line: 1,
					messageId: "noMagic",
				},
				{
					column: 16,
					data: {
						raw: "-1",
					},
					line: 1,
					messageId: "noMagic",
				},
			],
		},
		{
			code: `
  interface Foo {
	bar: 1;
  }
		`,
			options: [{ ignoreNumericLiteralTypes: true }],
			errors: [
				{
					column: 7,
					data: {
						raw: "1",
					},
					line: 3,
					messageId: "noMagic",
				},
			],
		},
		{
			code: `
  enum foo {
	SECOND = 1000,
	NUM = '0123456789',
	NEG = -1,
	POS = +1,
  }
		`,
			options: [{ ignoreEnums: false }],
			errors: [
				{
					column: 11,
					data: {
						raw: "1000",
					},
					line: 3,
					messageId: "noMagic",
				},
				{
					column: 8,
					data: {
						raw: "-1",
					},
					line: 5,
					messageId: "noMagic",
				},
				{
					column: 8,
					data: {
						raw: "+1",
					},
					line: 6,
					messageId: "noMagic",
				},
			],
		},
		{
			code: `
  class Foo {
	readonly A = 1;
	readonly B = 2;
	public static readonly C = 3;
	static readonly D = 4;
	readonly E = -5;
	readonly F = +6;
	private readonly G = 100n;
  }
		`,
			options: [{ ignoreReadonlyClassProperties: false }],
			errors: [
				{
					column: 15,
					data: {
						raw: "1",
					},
					line: 3,
					messageId: "noMagic",
				},
				{
					column: 15,
					data: {
						raw: "2",
					},
					line: 4,
					messageId: "noMagic",
				},
				{
					column: 29,
					data: {
						raw: "3",
					},
					line: 5,
					messageId: "noMagic",
				},
				{
					column: 22,
					data: {
						raw: "4",
					},
					line: 6,
					messageId: "noMagic",
				},
				{
					column: 15,
					data: {
						raw: "-5",
					},
					line: 7,
					messageId: "noMagic",
				},
				{
					column: 15,
					data: {
						raw: "+6",
					},
					line: 8,
					messageId: "noMagic",
				},
				{
					column: 23,
					data: {
						raw: "100n",
					},
					line: 9,
					messageId: "noMagic",
				},
			],
		},
		{
			code: "type Foo = Bar[0];",
			options: [{ ignoreTypeIndexes: false }],
			errors: [
				{
					column: 16,
					data: {
						raw: "0",
					},
					line: 1,
					messageId: "noMagic",
				},
			],
		},
		{
			code: "type Foo = Bar[-1];",
			options: [{ ignoreTypeIndexes: false }],
			errors: [
				{
					column: 16,
					data: {
						raw: "-1",
					},
					line: 1,
					messageId: "noMagic",
				},
			],
		},
		{
			code: "type Foo = Bar[0xab];",
			options: [{ ignoreTypeIndexes: false }],
			errors: [
				{
					column: 16,
					data: {
						raw: "0xab",
					},
					line: 1,
					messageId: "noMagic",
				},
			],
		},
		{
			code: "type Foo = Bar[5.6e1];",
			options: [{ ignoreTypeIndexes: false }],
			errors: [
				{
					column: 16,
					data: {
						raw: "5.6e1",
					},
					line: 1,
					messageId: "noMagic",
				},
			],
		},
		{
			code: "type Foo = Bar[10n];",
			options: [{ ignoreTypeIndexes: false }],
			errors: [
				{
					column: 16,
					data: {
						raw: "10n",
					},
					line: 1,
					messageId: "noMagic",
				},
			],
		},
		{
			code: "type Foo = Bar[1 | -2];",
			options: [{ ignoreTypeIndexes: false }],
			errors: [
				{
					column: 16,
					data: {
						raw: "1",
					},
					line: 1,
					messageId: "noMagic",
				},
				{
					column: 20,
					data: {
						raw: "-2",
					},
					line: 1,
					messageId: "noMagic",
				},
			],
		},
		{
			code: "type Foo = Bar[1 & -2];",
			options: [{ ignoreTypeIndexes: false }],
			errors: [
				{
					column: 16,
					data: {
						raw: "1",
					},
					line: 1,
					messageId: "noMagic",
				},
				{
					column: 20,
					data: {
						raw: "-2",
					},
					line: 1,
					messageId: "noMagic",
				},
			],
		},
		{
			code: "type Foo = Bar[1 & number];",
			options: [{ ignoreTypeIndexes: false }],
			errors: [
				{
					column: 16,
					data: {
						raw: "1",
					},
					line: 1,
					messageId: "noMagic",
				},
			],
		},
		{
			code: "type Foo = Bar[((1 & -2) | 3) | 4];",
			options: [{ ignoreTypeIndexes: false }],
			errors: [
				{
					column: 18,
					data: {
						raw: "1",
					},
					line: 1,
					messageId: "noMagic",
				},
				{
					column: 22,
					data: {
						raw: "-2",
					},
					line: 1,
					messageId: "noMagic",
				},
				{
					column: 28,
					data: {
						raw: "3",
					},
					line: 1,
					messageId: "noMagic",
				},
				{
					column: 33,
					data: {
						raw: "4",
					},
					line: 1,
					messageId: "noMagic",
				},
			],
		},
		{
			code: "type Foo = Parameters<Bar>[2];",
			options: [{ ignoreTypeIndexes: false }],
			errors: [
				{
					column: 28,
					data: {
						raw: "2",
					},
					line: 1,
					messageId: "noMagic",
				},
			],
		},
		{
			code: `
  type Others = [['a'], ['b']];
  
  type Foo = {
	[K in keyof Others[0]]: Others[K];
  };
		`,
			options: [{ ignoreTypeIndexes: false }],
			errors: [
				{
					column: 21,
					data: {
						raw: "0",
					},
					line: 5,
					messageId: "noMagic",
				},
			],
		},
		{
			code: `
  type Other = {
	[0]: 3;
  };
  
  type Foo = {
	[K in keyof Other]: \`\${K & number}\`;
  };
		`,
			options: [{ ignoreTypeIndexes: true }],
			errors: [
				{
					column: 3,
					data: {
						raw: "0",
					},
					line: 3,
					messageId: "noMagic",
				},
				{
					column: 7,
					data: {
						raw: "3",
					},
					line: 3,
					messageId: "noMagic",
				},
			],
		},
		{
			code: `
  type Foo = {
	[K in 0 | 1 | 2]: 0;
  };
		`,
			options: [{ ignoreTypeIndexes: true }],
			errors: [
				{
					column: 8,
					data: {
						raw: "0",
					},
					line: 3,
					messageId: "noMagic",
				},
				{
					column: 12,
					data: {
						raw: "1",
					},
					line: 3,
					messageId: "noMagic",
				},
				{
					column: 16,
					data: {
						raw: "2",
					},
					line: 3,
					messageId: "noMagic",
				},
				{
					column: 20,
					data: {
						raw: "0",
					},
					line: 3,
					messageId: "noMagic",
				},
			],
		},
		{
			code: "type Foo = 1;",
			options: [{ ignore: [-1] }],
			errors: [
				{
					column: 12,
					data: {
						raw: "1",
					},
					line: 1,
					messageId: "noMagic",
				},
			],
		},
		{
			code: "type Foo = -2;",
			options: [{ ignore: [2] }],
			errors: [
				{
					column: 12,
					data: {
						raw: "-2",
					},
					line: 1,
					messageId: "noMagic",
				},
			],
		},
		{
			code: "type Foo = 3n;",
			options: [{ ignore: ["-3n"] }],
			errors: [
				{
					column: 12,
					data: {
						raw: "3n",
					},
					line: 1,
					messageId: "noMagic",
				},
			],
		},
		{
			code: "type Foo = -4n;",
			options: [{ ignore: ["4n"] }],
			errors: [
				{
					column: 12,
					data: {
						raw: "-4n",
					},
					line: 1,
					messageId: "noMagic",
				},
			],
		},
		{
			code: "type Foo = 5.6;",
			options: [{ ignore: [-5.6] }],
			errors: [
				{
					column: 12,
					data: {
						raw: "5.6",
					},
					line: 1,
					messageId: "noMagic",
				},
			],
		},
		{
			code: "type Foo = -7.8;",
			options: [{ ignore: [7.8] }],
			errors: [
				{
					column: 12,
					data: {
						raw: "-7.8",
					},
					line: 1,
					messageId: "noMagic",
				},
			],
		},
		{
			code: "type Foo = 0x0a;",
			options: [{ ignore: [-0x0a] }],
			errors: [
				{
					column: 12,
					data: {
						raw: "0x0a",
					},
					line: 1,
					messageId: "noMagic",
				},
			],
		},
		{
			code: "type Foo = -0xbc;",
			options: [{ ignore: [0xbc] }],
			errors: [
				{
					column: 12,
					data: {
						raw: "-0xbc",
					},
					line: 1,
					messageId: "noMagic",
				},
			],
		},
		{
			code: "type Foo = 1e2;",
			options: [{ ignore: [-1e2] }],
			errors: [
				{
					column: 12,
					data: {
						raw: "1e2",
					},
					line: 1,
					messageId: "noMagic",
				},
			],
		},
		{
			code: "type Foo = -3e4;",
			options: [{ ignore: [3e4] }],
			errors: [
				{
					column: 12,
					data: {
						raw: "-3e4",
					},
					line: 1,
					messageId: "noMagic",
				},
			],
		},
		{
			code: "type Foo = 5e-6;",
			options: [{ ignore: [-5e-6] }],
			errors: [
				{
					column: 12,
					data: {
						raw: "5e-6",
					},
					line: 1,
					messageId: "noMagic",
				},
			],
		},
		{
			code: "type Foo = -7e-8;",
			options: [{ ignore: [7e-8] }],
			errors: [
				{
					column: 12,
					data: {
						raw: "-7e-8",
					},
					line: 1,
					messageId: "noMagic",
				},
			],
		},
		{
			code: "type Foo = 1.1e2;",
			options: [{ ignore: [-1.1e2] }],
			errors: [
				{
					column: 12,
					data: {
						raw: "1.1e2",
					},
					line: 1,
					messageId: "noMagic",
				},
			],
		},
		{
			code: "type Foo = -3.1e4;",
			options: [{ ignore: [3.1e4] }],
			errors: [
				{
					column: 12,
					data: {
						raw: "-3.1e4",
					},
					line: 1,
					messageId: "noMagic",
				},
			],
		},
		{
			code: "type Foo = 5.1e-6;",
			options: [{ ignore: [-5.1e-6] }],
			errors: [
				{
					column: 12,
					data: {
						raw: "5.1e-6",
					},
					line: 1,
					messageId: "noMagic",
				},
			],
		},
		{
			code: "type Foo = -7.1e-8;",
			options: [{ ignore: [7.1e-8] }],
			errors: [
				{
					column: 12,
					data: {
						raw: "-7.1e-8",
					},
					line: 1,
					messageId: "noMagic",
				},
			],
		},
		{
			code: "type Foo = { bar: 42 };",
			options: [{ ignoreNumericLiteralTypes: true }],
			errors: [
				{
					column: 19,
					data: {
						raw: "42",
					},
					line: 1,
					messageId: "noMagic",
				},
			],
		},
	],
});
