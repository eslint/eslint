/**
 * @fileoverview Tests for no-default-case rule.
 * @author Ofek Gabay <https://github.com/tupe12334>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-default-case"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
	languageOptions: {
		ecmaVersion: 6,
		sourceType: "script",
	},
});

ruleTester.run("no-default-case", rule, {
	valid: [
		// Switch without default case
		`switch (a) {
			case 1:
				break;
			case 2:
				break;
		}`,

		// Switch with only one case
		`switch (a) {
			case 1:
				break;
		}`,

		// Empty switch
		`switch (a) {}`,

		// Switch with allowEmpty option and empty default
		{
			code: `switch (a) {
				case 1:
					break;
				case 2:
					break;
				default:
			}`,
			options: [{ allowEmpty: true }],
		},

		// Switch with allowEmpty option and default with only comments
		{
			code: `switch (a) {
				case 1:
					break;
				case 2:
					break;
				default:
					// This is empty
			}`,
			options: [{ allowEmpty: true }],
		},

		// Nested switch without default in inner switch
		`switch (a) {
			case 1:
				switch (b) {
					case 'x':
						break;
					case 'y':
						break;
				}
				break;
			case 2:
				break;
		}`,

		// Switch with expressions as cases
		`switch (a) {
			case getValue():
				break;
			case getOtherValue():
				break;
		}`,
	],

	invalid: [
		// Basic switch with default case
		{
			code: `switch (a) {
				case 1:
					break;
				default:
					break;
			}`,
			errors: [
				{
					messageId: "unexpectedDefault",
					type: "SwitchCase",
					line: 4,
					column: 5,
				},
			],
		},

		// Switch with default case first
		{
			code: `switch (a) {
				default:
					break;
				case 1:
					break;
			}`,
			errors: [
				{
					messageId: "unexpectedDefault",
					type: "SwitchCase",
					line: 2,
					column: 5,
				},
			],
		},

		// Switch with default case in middle
		{
			code: `switch (a) {
				case 1:
					break;
				default:
					break;
				case 2:
					break;
			}`,
			errors: [
				{
					messageId: "unexpectedDefault",
					type: "SwitchCase",
					line: 4,
					column: 5,
				},
			],
		},

		// Switch with multiple statements in default
		{
			code: `function test() {
				switch (a) {
					case 1:
						console.log('one');
						break;
					default:
						console.log('default');
						return null;
				}
			}`,
			errors: [
				{
					messageId: "unexpectedDefault",
					type: "SwitchCase",
				},
			],
		},

		// Switch with allowEmpty: true but non-empty default
		{
			code: `switch (a) {
				case 1:
					break;
				default:
					console.log('not empty');
					break;
			}`,
			options: [{ allowEmpty: true }],
			errors: [
				{
					messageId: "unexpectedNonEmptyDefault",
					type: "SwitchCase",
				},
			],
		},

		// Switch with allowEmpty: false and empty default
		{
			code: `switch (a) {
				case 1:
					break;
				default:
			}`,
			options: [{ allowEmpty: false }],
			errors: [
				{
					messageId: "unexpectedDefault",
					type: "SwitchCase",
				},
			],
		},

		// Nested switches with default in outer switch
		{
			code: `switch (a) {
				case 1:
					switch (b) {
						case 'x':
							break;
						case 'y':
							break;
					}
					break;
				default:
					break;
			}`,
			errors: [
				{
					messageId: "unexpectedDefault",
					type: "SwitchCase",
				},
			],
		},

		// Nested switches with default in inner switch
		{
			code: `switch (a) {
				case 1:
					switch (b) {
						case 'x':
							break;
						default:
							break;
					}
					break;
				case 2:
					break;
			}`,
			errors: [
				{
					messageId: "unexpectedDefault",
					type: "SwitchCase",
				},
			],
		},

		// Switch with default case containing fallthrough
		{
			code: `switch (a) {
				case 1:
				case 2:
					break;
				default:
					console.log('fallthrough');
			}`,
			errors: [
				{
					messageId: "unexpectedDefault",
					type: "SwitchCase",
				},
			],
		},

		// Switch with string cases and default
		{
			code: `switch (str) {
				case "hello":
					break;
				case "world":
					break;
				default:
					break;
			}`,
			errors: [
				{
					messageId: "unexpectedDefault",
					type: "SwitchCase",
				},
			],
		},

		// Switch with complex expressions and default
		{
			code: `function test() {
				switch (obj.prop) {
					case getValue(1):
						break;
					case getValue(2):
						break;
					default:
						return false;
				}
			}`,
			errors: [
				{
					messageId: "unexpectedDefault",
					type: "SwitchCase",
				},
			],
		},
	],
});
