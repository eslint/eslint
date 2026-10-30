/**
 * @fileoverview Tests for check-cb-called.js rule.
 */

import { RuleTester } from "eslint";
import checkCbCalledRule from "./check-cb-called.js";

const ruleTester = new RuleTester({
	languageOptions: { ecmaVersion: 2018 },
});

const message = "`cb` should be called in every path.";

ruleTester.run("check-cb-called", checkCbCalledRule, {
	valid: [
		// cb is called unconditionally
		"function foo(cb) { cb(); }",

		// cb is called on every branch of an if/else
		`
			function foo(cb) {
				if (Math.random()) {
					cb();
				} else {
					cb();
				}
			}
			`,

		// no cb parameter, so the rule doesn't apply
		"function foo() { bar(); }",
		"function foo(notCb) { bar(); }",

		// cb is called after a for-of loop that may run zero times
		`
			function foo(cb) {
				for (const x of y) {
					doSomething();
				}
				cb();
			}
			`,

		// cb is called after a classic for loop
		`
			function foo(cb) {
				for (let i = 0; i < 10; i++) {
					doSomething();
				}
				cb();
			}
			`,

		// cb is called after a while loop
		`
			function foo(cb) {
				while (Math.random()) {
					doSomething();
				}
				cb();
			}
			`,

		// cb is called after a do-while loop
		`
			function foo(cb) {
				do {
					doSomething();
				} while (Math.random());
				cb();
			}
			`,

		// cb is called both inside and after the loop body
		`
			function foo(cb) {
				for (const x of y) {
					cb();
				}
				cb();
			}
			`,

		// cb is called after an infinite loop that can only exit via break
		`
			function foo(cb) {
				for (;;) {
					if (Math.random()) {
						break;
					}
				}
				cb();
			}
			`,

		// cb is called after nested loops
		`
			function foo(cb) {
				for (const x of y) {
					for (const z of w) {
						doSomething();
					}
				}
				cb();
			}
			`,

		// cb is called after the outer loop's body on every iteration,
		// which covers the case where the inner loop runs zero times
		`
			function foo(cb) {
				for (const x of y) {
					cb();
					for (const z of w) {
						doSomething();
					}
				}
				cb();
			}
			`,

		// cb is called at every level of nesting
		`
			function foo(cb) {
				for (const x of y) {
					cb();
					for (const z of w) {
						cb();
					}
					cb();
				}
				cb();
			}
			`,

		// cb is called after two sibling (non-nested) loops
		`
			function foo(cb) {
				for (const x of y) {
					doSomething();
				}
				for (const z of w) {
					doSomethingElse();
				}
				cb();
			}
			`,

		// cb is called after a triple-nested loop
		`
			function foo(cb) {
				for (const a of x) {
					for (const b of y) {
						for (const c of z) {
							doSomething();
						}
					}
				}
				cb();
			}
			`,

		// cb is called after loops of different kinds nested together
		`
			function foo(cb) {
				while (Math.random()) {
					for (const x of y) {
						doSomething();
					}
				}
				cb();
			}
			`,

		// a nested function without its own cb parameter doesn't need
		// to call cb; the outer function still calls it
		`
			function outer(cb) {
				function inner() {
					for (const x of y) {
						doSomething();
					}
				}
				inner();
				cb();
			}
			`,
	],

	invalid: [
		// cb is only called on one branch of an if
		{
			code: `
				function foo(cb) {
					if (Math.random()) {
						cb();
					}
				}
				`,
			errors: [{ message }],
		},

		// cb is never called
		{
			code: "function foo(cb) { doSomethingElse(); }",
			errors: [{ message }],
		},

		// cb is only called inside a loop body that might run zero times
		{
			code: `
				function foo(cb) {
					for (const x of y) {
						cb();
					}
				}
				`,
			errors: [{ message }],
		},

		// same, but with a classic for loop
		{
			code: `
				function foo(cb) {
					for (let i = 0; i < 10; i++) {
						cb();
					}
				}
				`,
			errors: [{ message }],
		},

		// cb is only called inside the innermost of two nested loops,
		// either of which might run zero times
		{
			code: `
				function foo(cb) {
					for (const x of y) {
						for (const z of w) {
							cb();
						}
					}
				}
				`,
			errors: [{ message }],
		},

		// cb is called in the outer loop's body, but only after the
		// inner loop, which doesn't help the case where the outer
		// loop itself runs zero times
		{
			code: `
				function foo(cb) {
					for (const x of y) {
						for (const z of w) {
							doSomething();
						}
						cb();
					}
				}
				`,
			errors: [{ message }],
		},

		// cb is called in only one of two sibling (non-nested) loops
		{
			code: `
				function foo(cb) {
					for (const x of y) {
						cb();
					}
					for (const z of w) {
						doSomethingElse();
					}
				}
				`,
			errors: [{ message }],
		},

		// a nested function with its own cb parameter must also call it
		{
			code: `
				function outer(cb) {
					function inner(cb) {
						for (const x of y) {
						}
					}
					inner(() => {});
					cb();
				}
				`,
			errors: [{ message }],
		},
	],
});
