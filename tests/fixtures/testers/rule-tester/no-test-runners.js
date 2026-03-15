/**
 * @fileoverview Tests for RuleTester without any test runner
 * @author Weijia Wang <starkwang@126.com>
 */
"use strict";

const assert = require("node:assert");
const { RuleTester } = require("../../../../lib/rule-tester");

const ruleTester = new RuleTester();

assert.throws(
	() => {
		ruleTester.run("no-var", require("./no-var"), {
			valid: ["bar = baz;"],
			invalid: [
				{
					code: "var foo = bar;",
					output: "invalid output",
					errors: 1,
				},
			],
		});
	},
	{
		constructor: assert.AssertionError,
		actual: " foo = bar;",
		expected: "invalid output",
		operator: "strictEqual",
		message: process.version.startsWith("v20.")
			? "Output is incorrect.\n+ actual - expected\n\n+ ' foo = bar;'\n- 'invalid output' (' foo = bar;' strictEqual 'invalid output')"
			: "Output is incorrect.\n+ actual - expected\n\n+ ' foo = bar;'\n- 'invalid output'\n (' foo = bar;' strictEqual 'invalid output')",
	},
);
