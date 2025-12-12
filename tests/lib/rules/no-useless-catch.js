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
			output: `
                
                    foo();
                
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
			output: `
                try {
                    foo();
                }  finally {
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
			output: null,
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
			output: null,
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
                    // line comment
                    throw err;
                }
            `,
			output: null,
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
                    // line comment
                    throw err;
                } finally {
                    foo();
                }
            `,
			output: null,
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
                    /* multi-line
                       comment */
                    throw err;
                }
            `,
			output: null,
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
                    /* multi-line
                       comment */
                    throw err;
                } finally {
                    foo();
                }
            `,
			output: null,
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
			output: `
                async () => {
                    
                        await doSomething();
                    
                }
            `,
			languageOptions: { ecmaVersion: 8 },
			errors: [
				{
					messageId: "unnecessaryCatch",
				},
			],
		},
		{
			code: `
                if (foo)
                    try {
                        doSomething();
                        doSomethingElse();
                    } catch (e) {
                        throw e;
                    }
            `,
			output: `
                if (foo)
                    {
                        doSomething();
                        doSomethingElse();
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
                while (condition)
                    try {
                        doSomething();
                        doSomethingElse();
                    } catch (e) {
                        throw e;
                    }
            `,
			output: `
                while (condition)
                    {
                        doSomething();
                        doSomethingElse();
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
                for (let i = 0; i < 10; i++)
                    try {
                        doSomething();
                        doSomethingElse();
                    } catch (e) {
                        throw e;
                    }
            `,
			output: `
                for (let i = 0; i < 10; i++)
                    {
                        doSomething();
                        doSomethingElse();
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
                for (const item of items)
                    try {
                        doSomething();
                        doSomethingElse();
                    } catch (e) {
                        throw e;
                    }
            `,
			output: `
                for (const item of items)
                    {
                        doSomething();
                        doSomethingElse();
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
                for (const key in object)
                    try {
                        doSomething();
                        doSomethingElse();
                    } catch (e) {
                        throw e;
                    }
            `,
			output: `
                for (const key in object)
                    {
                        doSomething();
                        doSomethingElse();
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
                do
                    try {
                        doSomething();
                        doSomethingElse();
                    } catch (e) {
                        throw e;
                    }
                while (condition);
            `,
			output: `
                do
                    {
                        doSomething();
                        doSomethingElse();
                    }
                while (condition);
            `,
			errors: [
				{
					messageId: "unnecessaryCatch",
				},
			],
		},
		{
			code: `
                try { doSomething() } catch (e) { throw e; } doSomethingMore()
            `,
			output: `
                { doSomething() } doSomethingMore()
            `,
			errors: [
				{
					messageId: "unnecessaryCatch",
				},
			],
		},
		{
			code: `
                try { doSomething(); doSomethingElse(); } catch (e) { throw e; } doSomethingMore()
            `,
			output: `
                { doSomething(); doSomethingElse(); } doSomethingMore()
            `,
			errors: [
				{
					messageId: "unnecessaryCatch",
				},
			],
		},
		{
			code: `
                if (foo) try { doSomething() } catch (e) { throw e; } doSomethingMore()
            `,
			output: `
                if (foo) { doSomething() } doSomethingMore()
            `,
			errors: [
				{
					messageId: "unnecessaryCatch",
				},
			],
		},
		{
			code: `
                if (foo) {
                    try {
                        doSomething();
                        doSomethingElse();
                    } catch (e) {
                        throw e;
                    }
                }
            `,
			output: `
                if (foo) {
                    
                        doSomething();
                        doSomethingElse();
                    
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
                while (condition) {
                    try {
                        doSomething();
                    } catch (e) {
                        throw e;
                    }
                }
            `,
			output: `
                while (condition) {
                    
                        doSomething();
                    
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
                for (let i = 0; i < 10; i++) {
                    try {
                        doSomething();
                    } catch (e) {
                        throw e;
                    }
                }
            `,
			output: `
                for (let i = 0; i < 10; i++) {
                    
                        doSomething();
                    
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
                foo()

                try {
                    [1, 2].forEach(doSomething)
                } catch (e) {
                    throw e
                }

                [3, 4].forEach(doSomething)
            `,
			output: `
                foo()

                {
                    [1, 2].forEach(doSomething)
                }

                [3, 4].forEach(doSomething)
            `,
			errors: [
				{
					messageId: "unnecessaryCatch",
				},
			],
		},
		{
			code: `
                foo()

                try {
                    console.log({ a: 1, b: 2 })
                } catch (e) {
                    throw e
                }

                [3, 4].forEach(doSomething)
            `,
			output: `
                foo()

                {
                    console.log({ a: 1, b: 2 })
                }

                [3, 4].forEach(doSomething)
            `,
			errors: [
				{
					messageId: "unnecessaryCatch",
				},
			],
		},

		// Name collision tests - fix should be disabled when removing try-catch would cause redeclaration
		{
			code: `
                const foo = "bar";
                try {
                    const foo = "baz";
                    doSomething(foo);
                } catch (e) {
                    throw e;
                }
            `,
			output: null,
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "unnecessaryCatch",
				},
			],
		},
		{
			code: `
                let foo = "bar";
                try {
                    let foo = "baz";
                    doSomething(foo);
                } catch (e) {
                    throw e;
                }
            `,
			output: null,
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "unnecessaryCatch",
				},
			],
		},
		{
			code: `
                function test() {
                    const foo = "bar";
                    try {
                        const foo = "baz";
                        doSomething(foo);
                    } catch (e) {
                        throw e;
                    }
                }
            `,
			output: null,
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "unnecessaryCatch",
				},
			],
		},
		{
			code: `
                class Foo {}
                try {
                    class Foo {}
                    new Foo();
                } catch (e) {
                    throw e;
                }
            `,
			output: null,
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "unnecessaryCatch",
				},
			],
		},
		{
			code: `
                function foo() {}
                try {
                    function foo() {}
                    foo();
                } catch (e) {
                    throw e;
                }
            `,
			output: null,
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "unnecessaryCatch",
				},
			],
		},

		// Name collision test with 'through' reference - variable from outer scope used inside try block
		{
			code: `
                const bar = "bar";
                try {
                    const foo = bar;
                    doSomething(foo);
                } catch (e) {
                    throw e;
                }
                const foo = "outer";
            `,
			output: null,
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "unnecessaryCatch",
				},
			],
		},

		// No name collision - different variable names, fix should be applied
		{
			code: `
                const foo = "bar";
                try {
                    const bar = "baz";
                    doSomething(bar);
                } catch (e) {
                    throw e;
                }
            `,
			output: `
                const foo = "bar";
                
                    const bar = "baz";
                    doSomething(bar);
                
            `,
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "unnecessaryCatch",
				},
			],
		},

		// Name collision with var in function scope
		{
			code: `
                function test() {
                    var foo = "bar";
                    try {
                        let foo = "baz";
                        doSomething(foo);
                    } catch (e) {
                        throw e;
                    }
                }
            `,
			output: null,
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "unnecessaryCatch",
				},
			],
		},
	],
});
