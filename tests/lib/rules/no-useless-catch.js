/**
 * @fileoverview Tests for no-useless-throw rule
 * @author Teddy Katz
 * @author Alex Grasley
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-useless-catch"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-useless-catch", rule, {
	valid: [
		`
            try {
                foo();
            } catch (err) {
                console.error(err);
            }
        `,
		`
            try {
                foo();
            } catch (err) {
                console.error(err);
            } finally {
                bar();
            }
        `,
		`
            try {
                foo();
            } catch (err) {
                doSomethingBeforeRethrow();
                throw err;
            }
        `,
		`
            try {
                foo();
            } catch (err) {
                throw err.msg;
            }
        `,
		`
            try {
                foo();
            } catch (err) {
                throw new Error("whoops!");
            }
        `,
		`
            try {
                foo();
            } catch (err) {
                throw bar;
            }
        `,
		`
            try {
                foo();
            } catch (err) { }
        `,
		{
			code: `
                try {
                    foo();
                } catch ({ err }) {
                    throw err;
                }
            `,
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: `
                try {
                    foo();
                } catch ([ err ]) {
                    throw err;
                }
            `,
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: `
                async () => {
                    try {
                        await doSomething();
                    } catch (e) {
                        doSomethingAfterCatch();
                        throw e;
                    }
                }
            `,
			languageOptions: { ecmaVersion: 8 },
		},
		{
			code: `
                try {
                    throw new Error('foo');
                } catch {
                    throw new Error('foo');
                }
            `,
			languageOptions: { ecmaVersion: 2019 },
		},
	],
	invalid: [
		{
			code: `
                try {
                    foo();
                } catch (err) {
                    throw err;
                }
            `,
			errors: [
				{
					messageId: "unnecessaryCatch",
				},
			],
		},
		{
			code: `
                try {
                    foo();
                } catch (err) {
                    throw err;
                } finally {
                    foo();
                }
            `,
			errors: [
				{
					messageId: "unnecessaryCatchClause",
				},
			],
		},
		{
			code: `
                try {
                    foo();
                } catch (err) {
                    /* some comment */
                    throw err;
                }
            `,
			errors: [
				{
					messageId: "unnecessaryCatch",
				},
			],
		},
		{
			code: `
                try {
                    foo();
                } catch (err) {
                    /* some comment */
                    throw err;
                } finally {
                    foo();
                }
            `,
			errors: [
				{
					messageId: "unnecessaryCatchClause",
				},
			],
		},
		{
			code: `
                async () => {
                    try {
                        await doSomething();
                    } catch (e) {
                        throw e;
                    }
                }
            `,
			languageOptions: { ecmaVersion: 8 },
			errors: [
				{
					messageId: "unnecessaryCatch",
				},
			],
		},
	],
	fatal: [
		{
			name: "options provided when schema allows none",
			code: "var x = 1;",
			options: [1],
			error: { name: "SchemaValidationError" },
		},
	],
});
