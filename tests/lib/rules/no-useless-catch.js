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
					line: 2,
					column: 17,
					endLine: 6,
					endColumn: 18,
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
					line: 4,
					column: 19,
					endLine: 6,
					endColumn: 18,
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
					line: 2,
					column: 17,
					endLine: 7,
					endColumn: 18,
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
					line: 4,
					column: 19,
					endLine: 8,
					endColumn: 18,
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
					line: 3,
					column: 21,
					endLine: 7,
					endColumn: 22,
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
                try { doSomething() } catch (e) { throw e; }
                doSomethingMore()
            `,
			output: `
                 doSomething() 
                doSomethingMore()
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
                    [1, 2].forEach(doSomething)
                } catch (e) {
                    throw e
                }

                bar()
            `,
			output: `
                foo()

                {
                    [1, 2].forEach(doSomething)
                }

                bar()
            `,
			errors: [
				{
					messageId: "unnecessaryCatch",
				},
			],
		},
		{
			code: `
                foo();

                try {
                    [1, 2].forEach(doSomething)
                } catch (e) {
                    throw e
                }

                [3, 4].forEach(doSomething)
            `,
			output: `
                foo();

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

		// Extra statements after the rethrow are not removed
		{
			code: `
                try {
                    foo();
                } catch (e) {
                    throw e;
                    bar();
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
                } catch (e) {
                    throw e;
                    bar();
                } finally {
                    baz();
                }
            `,
			output: null,
			errors: [
				{
					messageId: "unnecessaryCatchClause",
				},
			],
		},

		// Comments outside the catch clause that the fix would delete
		{
			code: `
                try /* keep */ {
                    foo();
                } catch (e) {
                    throw e;
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
                } /* keep */ catch (e) {
                    throw e;
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
                    /* keep */
                    foo();
                } catch (e) {
                    throw e;
                }
            `,
			output: `
                
                    /* keep */
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
                try /* keep */ {
                    foo();
                } catch (e) {
                    throw e;
                } finally {
                    bar();
                }
            `,
			output: `
                try /* keep */ {
                    foo();
                }  finally {
                    bar();
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
                } /* keep */ catch (e) {
                    throw e;
                } finally {
                    bar();
                }
            `,
			output: `
                try {
                    foo();
                } /* keep */  finally {
                    bar();
                }
            `,
			errors: [
				{
					messageId: "unnecessaryCatchClause",
				},
			],
		},

		// `switch` stores statements on `consequent`, not `body`
		{
			code: `
                switch (x) {
                    case 1:
                        try {
                            foo();
                        } catch (e) {
                            throw e;
                        }
                    default:
                        try {
                            bar();
                        } catch (e) {
                            throw e;
                        }
                }
            `,
			output: `
                switch (x) {
                    case 1:
                        
                            foo();
                        
                    default:
                        
                            bar();
                        
                }
            `,
			errors: [
				{
					messageId: "unnecessaryCatch",
				},
				{
					messageId: "unnecessaryCatch",
				},
			],
		},

		// Keep the block when unwrapping would join two statements
		{
			code: `
                foo()
                try {
                    (0, bar)()
                } catch (e) {
                    throw e
                }
            `,
			output: `
                foo()
                {
                    (0, bar)()
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
                    \`bar\`
                } catch (e) {
                    throw e
                }
            `,
			output: `
                foo()
                {
                    \`bar\`
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
                    +bar
                } catch (e) {
                    throw e
                }
            `,
			output: `
                foo()
                {
                    +bar
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
                    -bar
                } catch (e) {
                    throw e
                }
            `,
			output: `
                foo()
                {
                    -bar
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
                    /bar/g
                } catch (e) {
                    throw e
                }
            `,
			output: `
                foo()
                {
                    /bar/g
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
                    foo()
                } catch (e) {
                    throw e
                }
                (0, bar)()
            `,
			output: `
                {
                    foo()
                }
                (0, bar)()
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
                    foo()
                } catch (e) {
                    throw e
                }
                \`bar\`
            `,
			output: `
                {
                    foo()
                }
                \`bar\`
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
                    foo()
                } catch (e) {
                    throw e
                }
                +bar
            `,
			output: `
                {
                    foo()
                }
                +bar
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
                    foo()
                } catch (e) {
                    throw e
                }
                -bar
            `,
			output: `
                {
                    foo()
                }
                -bar
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
                    foo()
                } catch (e) {
                    throw e
                }
                /bar/g
            `,
			output: `
                {
                    foo()
                }
                /bar/g
            `,
			errors: [
				{
					messageId: "unnecessaryCatch",
				},
			],
		},

		// `using` disposes at the end of the block, so the braces stay
		{
			code: `
                function f() {
                    try {
                        using x = getResource();
                        doSomething(x);
                    } catch (e) {
                        throw e;
                    }
                    doSomethingElse();
                }
            `,
			output: `
                function f() {
                    {
                        using x = getResource();
                        doSomething(x);
                    }
                    doSomethingElse();
                }
            `,
			languageOptions: { ecmaVersion: 2026 },
			errors: [
				{
					messageId: "unnecessaryCatch",
				},
			],
		},
		{
			code: `
                async function f() {
                    try {
                        await using x = getResource();
                        doSomething(x);
                    } catch (e) {
                        throw e;
                    }
                    doSomethingElse();
                }
            `,
			output: `
                async function f() {
                    {
                        await using x = getResource();
                        doSomething(x);
                    }
                    doSomethingElse();
                }
            `,
			languageOptions: { ecmaVersion: 2026 },
			errors: [
				{
					messageId: "unnecessaryCatch",
				},
			],
		},
		{
			code: `
                try {
                    using x = getResource();
                    doSomething(x);
                } catch (e) {
                    throw e;
                }
            `,
			output: `
                {
                    using x = getResource();
                    doSomething(x);
                }
            `,
			languageOptions: { ecmaVersion: 2026, sourceType: "script" },
			errors: [
				{
					messageId: "unnecessaryCatch",
				},
			],
		},
		{
			code: `
                switch (x) {
                    case 1:
                        try {
                            using y = getResource();
                            doSomething(y);
                        } catch (e) {
                            throw e;
                        }
                    default:
                        try {
                            using z = getResource();
                            doSomething(z);
                        } catch (e) {
                            throw e;
                        }
                }
            `,
			output: `
                switch (x) {
                    case 1:
                        {
                            using y = getResource();
                            doSomething(y);
                        }
                    default:
                        {
                            using z = getResource();
                            doSomething(z);
                        }
                }
            `,
			languageOptions: { ecmaVersion: 2026 },
			errors: [
				{
					messageId: "unnecessaryCatch",
				},
				{
					messageId: "unnecessaryCatch",
				},
			],
		},
		{
			code: `
                function f() {
                    try {
                        {
                            using x = getResource();
                            doSomething(x);
                        }
                    } catch (e) {
                        throw e;
                    }
                    doSomethingElse();
                }
            `,
			output: `
                function f() {
                    
                        {
                            using x = getResource();
                            doSomething(x);
                        }
                    
                    doSomethingElse();
                }
            `,
			languageOptions: { ecmaVersion: 2026 },
			errors: [
				{
					messageId: "unnecessaryCatch",
				},
			],
		},

		// Unwrapping a leading string can turn it into a directive
		{
			code: `
                function f() {
                    try {
                        "use strict";
                        with (obj) {}
                    } catch (e) {
                        throw e;
                    }
                }
            `,
			output: `
                function f() {
                    {
                        "use strict";
                        with (obj) {}
                    }
                }
            `,
			languageOptions: { sourceType: "script" },
			errors: [
				{
					messageId: "unnecessaryCatch",
				},
			],
		},
		{
			code: `
                function f() {
                    try {
                        "use strict";
                        return this;
                    } catch (e) {
                        throw e;
                    }
                }
            `,
			output: `
                function f() {
                    {
                        "use strict";
                        return this;
                    }
                }
            `,
			languageOptions: { sourceType: "script" },
			errors: [
				{
					messageId: "unnecessaryCatch",
				},
			],
		},
		{
			code: `
                try {
                    "use strict";
                    with (obj) {}
                } catch (e) {
                    throw e;
                }
            `,
			output: `
                {
                    "use strict";
                    with (obj) {}
                }
            `,
			languageOptions: { sourceType: "script" },
			errors: [
				{
					messageId: "unnecessaryCatch",
				},
			],
		},
		{
			code: `
                function f() {
                    foo();
                    try {
                        "use strict";
                        return this;
                    } catch (e) {
                        throw e;
                    }
                }
            `,
			output: `
                function f() {
                    foo();
                    
                        "use strict";
                        return this;
                    
                }
            `,
			languageOptions: { sourceType: "script" },
			errors: [
				{
					messageId: "unnecessaryCatch",
				},
			],
		},
		{
			code: `
                function f() {
                    "use asm";
                    try {
                        "use strict";
                        return this;
                    } catch (e) {
                        throw e;
                    }
                }
            `,
			output: `
                function f() {
                    "use asm";
                    {
                        "use strict";
                        return this;
                    }
                }
            `,
			languageOptions: { sourceType: "script" },
			errors: [
				{
					messageId: "unnecessaryCatch",
				},
			],
		},

		// ES5 blocks have no scope, so sibling tries both unwrap
		{
			code: `
                try {
                    foo();
                } catch (e) {
                    throw e;
                }
                try {
                    bar();
                } catch (e) {
                    throw e;
                }
            `,
			output: `
                
                    foo();
                
                
                    bar();
                
            `,
			languageOptions: { ecmaVersion: 5, sourceType: "script" },
			errors: [
				{
					messageId: "unnecessaryCatch",
				},
				{
					messageId: "unnecessaryCatch",
				},
			],
		},

		// Sibling fixes are checked against the original scope, so the second keeps its braces
		{
			code: `
                try {
                    const result = a();
                    use(result);
                } catch (e) {
                    throw e;
                }
                try {
                    const result = b();
                    use(result);
                } catch (e) {
                    throw e;
                }
            `,
			output: `
                
                    const result = a();
                    use(result);
                
                {
                    const result = b();
                    use(result);
                }
            `,
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "unnecessaryCatch",
				},
				{
					messageId: "unnecessaryCatch",
				},
			],
		},
		{
			code: `
                switch (x) {
                    case 1:
                        try {
                            const result = a();
                            use(result);
                        } catch (e) {
                            throw e;
                        }
                    case 2:
                        try {
                            const result = b();
                            use(result);
                        } catch (e) {
                            throw e;
                        }
                }
            `,
			output: `
                switch (x) {
                    case 1:
                        
                            const result = a();
                            use(result);
                        
                    case 2:
                        {
                            const result = b();
                            use(result);
                        }
                }
            `,
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "unnecessaryCatch",
				},
				{
					messageId: "unnecessaryCatch",
				},
			],
		},
	],
});
