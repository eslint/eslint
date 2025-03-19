/**
 * @fileoverview Tests for no-useless-constructor rule.
 * @author Alberto Rodriguez
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-useless-constructor");
const RuleTester = require("../../../lib/rule-tester/rule-tester");
const { unIndent } = require("../../_utils");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 6 } });
const error = { messageId: "noUselessConstructor", type: "MethodDefinition" };

ruleTester.run("no-useless-constructor", rule, {
	valid: [
		"class A { }",
		"class A { constructor(){ doSomething(); } }",
		"class A extends B { constructor(){} }",
		"class A extends B { constructor(){ super('foo'); } }",
		"class A extends B { constructor(foo, bar){ super(foo, bar, 1); } }",
		"class A extends B { constructor(){ super(); doSomething(); } }",
		"class A extends B { constructor(...args){ super(...args); doSomething(); } }",
		"class A { dummyMethod(){ doSomething(); } }",
		"class A extends B.C { constructor() { super(foo); } }",
		"class A extends B.C { constructor([a, b, c]) { super(...arguments); } }",
		"class A extends B.C { constructor(a = f()) { super(...arguments); } }",
		"class A extends B { constructor(a, b, c) { super(a, b); } }",
		"class A extends B { constructor(foo, bar){ super(foo); } }",
		"class A extends B { constructor(test) { super(); } }",
		"class A extends B { constructor() { foo; } }",
		"class A extends B { constructor(foo, bar) { super(bar); } }",
		{
			code: "declare class A { constructor(options: any); }",
			languageOptions: {
				parser: require("../../fixtures/parsers/typescript-parsers/declare-class"),
			},
		},
	],
	invalid: [
		{
			code: "class A { constructor(){} }",
			errors: [
				{
					...error,
					suggestions: [
						{
							messageId: "removeConstructor",
							output: "class A {  }",
						},
					],
				},
			],
		},
		{
			code: "class A { 'constructor'(){} }",
			errors: [
				{
					...error,
					suggestions: [
						{
							messageId: "removeConstructor",
							output: "class A {  }",
						},
					],
				},
			],
		},
		{
			code: "class A extends B { constructor() { super(); } }",
			errors: [
				{
					...error,
					suggestions: [
						{
							messageId: "removeConstructor",
							output: "class A extends B {  }",
						},
					],
				},
			],
		},
		{
			code: "class A extends B { constructor(foo){ super(foo); } }",
			errors: [
				{
					...error,
					suggestions: [
						{
							messageId: "removeConstructor",
							output: "class A extends B {  }",
						},
					],
				},
			],
		},
		{
			code: "class A extends B { constructor(foo, bar){ super(foo, bar); } }",
			errors: [
				{
					...error,
					suggestions: [
						{
							messageId: "removeConstructor",
							output: "class A extends B {  }",
						},
					],
				},
			],
		},
		{
			code: "class A extends B { constructor(...args){ super(...args); } }",
			errors: [
				{
					...error,
					suggestions: [
						{
							messageId: "removeConstructor",
							output: "class A extends B {  }",
						},
					],
				},
			],
		},
		{
			code: "class A extends B.C { constructor() { super(...arguments); } }",
			errors: [
				{
					...error,
					suggestions: [
						{
							messageId: "removeConstructor",
							output: "class A extends B.C {  }",
						},
					],
				},
			],
		},
		{
			code: "class A extends B { constructor(a, b, ...c) { super(...arguments); } }",
			errors: [
				{
					...error,
					suggestions: [
						{
							messageId: "removeConstructor",
							output: "class A extends B {  }",
						},
					],
				},
			],
		},
		{
			code: "class A extends B { constructor(a, b, ...c) { super(a, b, ...c); } }",
			errors: [
				{
					...error,
					suggestions: [
						{
							messageId: "removeConstructor",
							output: "class A extends B {  }",
						},
					],
				},
			],
		},
		{
			code: unIndent`
              class A {
                foo = 'bar'
                constructor() { }
                [0]() { }
              }`,
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					...error,
					suggestions: [
						{
							messageId: "removeConstructor",
							output: unIndent`
                    class A {
                      foo = 'bar'
                      ;
                      [0]() { }
                    }`,
						},
					],
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

ruleTesterTypeScript.run("no-useless-constructor", rule, {
	valid: [
		`
      declare class A {
        constructor();
      }
          `,
		`
      class A {
        constructor();
      }
          `,
		`
      abstract class A {
        constructor();
      }
          `,
		`
      class A {
        constructor(private name: string) {}
      }
          `,
		`
      class A {
        constructor(public name: string) {}
      }
          `,
		`
      class A {
        constructor(protected name: string) {}
      }
          `,
		`
      class A {
        private constructor() {}
      }
          `,
		`
      class A {
        protected constructor() {}
      }
          `,
		`
      class A extends B {
        public constructor() {}
      }
          `,
		`
      class A extends B {
        public constructor() {
            super();
        }
      }
          `,
		`
      class A extends B {
        protected constructor(foo, bar) {
          super(bar);
        }
      }
          `,
		`
      class A extends B {
        private constructor(foo, bar) {
          super(bar);
        }
      }
          `,
		`
      class A extends B {
        public constructor(foo) {
          super(foo);
        }
      }
          `,
		`
      class A extends B {
        public constructor(foo) {}
      }
          `,
		`
      class A {
        constructor(foo);
      }
          `,
		`
      class A {
        constructor(@Foo foo) {}
      }
          `,
		`
      class A {
        constructor(@Foo foo: string) {}
      }
          `,
		`
      class A extends Object {
        constructor(@Foo foo: string) {
          super(foo);
        }
      }
          `,
		`
      class A extends Object {
        constructor(foo: string, @Bar() bar) {
          super(foo, bar);
        }
      }
          `,
	],
	invalid: [
		{
			code: `
            class A {
                constructor() {}
            }
              `,
			errors: [
				{
					messageId: "noUselessConstructor",
					suggestions: [
						{
							messageId: "removeConstructor",
							output: `
            class A {
              ${"  "}
            }
              `,
						},
					],
					type: "MethodDefinition",
				},
			],
		},
		{
			code: `
            class A {
                public constructor() {}
            }
        `,
			errors: [
				{
					messageId: "noUselessConstructor",
					suggestions: [
						{
							messageId: "removeConstructor",
							output: `
            class A {
              ${"  "}
            }
        `,
						},
					],
					type: "MethodDefinition",
				},
			],
		},
	],
});
