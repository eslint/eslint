/**
 * @fileoverview Tests for no-unused-private-class-members rule.
 * @author Tim van der Lippe
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-unused-private-class-members"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 2022 } });

ruleTester.run("no-unused-private-class-members", rule, {
	valid: [
		"class Foo {}",
		`class Foo {
    publicMember = 42;
}`,
		`class Foo {
    #usedMember = 42;
    method() {
        return this.#usedMember;
    }
}`,
		`class Foo {
    #usedMember = 42;
    anotherMember = this.#usedMember;
}`,
		`class Foo {
    #usedMember = 42;
    foo() {
        anotherMember = this.#usedMember;
    }
}`,
		`class C {
    #usedMember;

    foo() {
        bar(this.#usedMember += 1);
    }
}`,
		`class Foo {
    #usedMember = 42;
    method() {
        return someGlobalMethod(this.#usedMember);
    }
}`,
		`class C {
    #usedInOuterClass;

    foo() {
        return class {};
    }

    bar() {
        return this.#usedInOuterClass;
    }
}`,
		`class Foo {
    #usedInForInLoop;
    method() {
        for (const bar in this.#usedInForInLoop) {

        }
    }
}`,
		`class Foo {
    #usedInForOfLoop;
    method() {
        for (const bar of this.#usedInForOfLoop) {

        }
    }
}`,
		`class Foo {
    #usedInAssignmentPattern;
    method() {
        [bar = 1] = this.#usedInAssignmentPattern;
    }
}`,
		`class Foo {
    #usedInArrayPattern;
    method() {
        [bar] = this.#usedInArrayPattern;
    }
}`,
		`class Foo {
    #usedInAssignmentPattern;
    method() {
        [bar] = this.#usedInAssignmentPattern;
    }
}`,
		`class C {
    #usedInObjectAssignment;

    method() {
        ({ [this.#usedInObjectAssignment]: a } = foo);
    }
}`,
		`class C {
    set #accessorWithSetterFirst(value) {
        doSomething(value);
    }
    get #accessorWithSetterFirst() {
        return something();
    }
    method() {
        this.#accessorWithSetterFirst += 1;
    }
}`,
		`class Foo {
    set #accessorUsedInMemberAccess(value) {}

    method(a) {
        [this.#accessorUsedInMemberAccess] = a;
    }
}`,
		`class C {
    get #accessorWithGetterFirst() {
        return something();
    }
    set #accessorWithGetterFirst(value) {
        doSomething(value);
    }
    method() {
        this.#accessorWithGetterFirst += 1;
    }
}`,
		`class C {
    #usedInInnerClass;

    method(a) {
        return class {
            foo = a.#usedInInnerClass;
        }
    }
}`,

		//--------------------------------------------------------------------------
		// Method definitions
		//--------------------------------------------------------------------------
		`class Foo {
    #usedMethod() {
        return 42;
    }
    anotherMethod() {
        return this.#usedMethod();
    }
}`,
		`class C {
    set #x(value) {
        doSomething(value);
    }

    foo() {
        this.#x = 1;
    }
}`,
	],
	invalid: [
		{
			code: `class Foo {
    #unusedMember = 5;
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#unusedMember",
					},
					line: 2,
					column: 5,
					endLine: 2,
					endColumn: 18,
					suggestions: [
						{
							messageId: "removeUnusedPrivateClassMember",
							data: {
								classMemberName: "#unusedMember",
							},
							output: `class Foo {
}`,
						},
					],
				},
			],
		},
		{
			code: `class Foo {
    /** docs */
    #unusedMember = 1;
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#unusedMember",
					},
					line: 3,
					column: 5,
					endLine: 3,
					endColumn: 18,
					suggestions: [
						{
							messageId: "removeUnusedPrivateClassMember",
							data: {
								classMemberName: "#unusedMember",
							},
							output: `class Foo {
}`,
						},
					],
				},
			],
		},
		{
			code: `class Foo {
    // remove me
    #unusedMember = 1;
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#unusedMember",
					},
					line: 3,
					column: 5,
					endLine: 3,
					endColumn: 18,
					suggestions: [
						{
							messageId: "removeUnusedPrivateClassMember",
							data: {
								classMemberName: "#unusedMember",
							},
							output: `class Foo {
}`,
						},
					],
				},
			],
		},
		{
			code: `class Foo {
    /* remove */ #unusedMember = 1;
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#unusedMember",
					},
					line: 2,
					column: 18,
					endLine: 2,
					endColumn: 31,
					suggestions: [
						{
							messageId: "removeUnusedPrivateClassMember",
							data: {
								classMemberName: "#unusedMember",
							},
							output: `class Foo {
}`,
						},
					],
				},
			],
		},
		{
			code: `class Foo {
    /* keep */ #unusedMember = 1; foo = 1
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#unusedMember",
					},
					line: 2,
					column: 16,
					endLine: 2,
					endColumn: 29,
					suggestions: [
						{
							messageId: "removeUnusedPrivateClassMember",
							data: {
								classMemberName: "#unusedMember",
							},
							output: `class Foo {
    /* keep */ foo = 1
}`,
						},
					],
				},
			],
		},
		{
			code: `class C {
    #unused1; /* keep */ foo;
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#unused1",
					},
					line: 2,
					column: 5,
					endLine: 2,
					endColumn: 13,
					suggestions: [
						{
							messageId: "removeUnusedPrivateClassMember",
							data: {
								classMemberName: "#unused1",
							},
							output: `class C {
    /* keep */ foo;
}`,
						},
					],
				},
			],
		},
		{
			code: `class C {
    bar; #unused2; // keep
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#unused2",
					},
					line: 2,
					column: 10,
					endLine: 2,
					endColumn: 18,
					suggestions: [
						{
							messageId: "removeUnusedPrivateClassMember",
							data: {
								classMemberName: "#unused2",
							},
							output: `class C {
    bar; // keep
}`,
						},
					],
				},
			],
		},
		{
			code: `class C {
    // comment
    #unused; foo;
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#unused",
					},
					line: 3,
					column: 5,
					endLine: 3,
					endColumn: 12,
					suggestions: [
						{
							messageId: "removeUnusedPrivateClassMember",
							data: {
								classMemberName: "#unused",
							},
							output: `class C {
    // comment
    foo;
}`,
						},
					],
				},
			],
		},
		{
			code: `class C {
    // comment
    #unused; /*
    */ foo;
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#unused",
					},
					line: 3,
					column: 5,
					endLine: 3,
					endColumn: 12,
					suggestions: [
						{
							messageId: "removeUnusedPrivateClassMember",
							data: {
								classMemberName: "#unused",
							},
							output: `class C {
    foo;
}`,
						},
					],
				},
			],
		},
		{
			code: `class Foo {
    #unusedMember = 1; // trailing
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#unusedMember",
					},
					line: 2,
					column: 5,
					endLine: 2,
					endColumn: 18,
					suggestions: [
						{
							messageId: "removeUnusedPrivateClassMember",
							data: {
								classMemberName: "#unusedMember",
							},
							output: `class Foo {
}`,
						},
					],
				},
			],
		},
		{
			code: `class Foo {
    foo = 1; /*
    */ #unusedMember = 1;
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#unusedMember",
					},
					line: 3,
					column: 8,
					endLine: 3,
					endColumn: 21,
					suggestions: [
						{
							messageId: "removeUnusedPrivateClassMember",
							data: {
								classMemberName: "#unusedMember",
							},
							output: `class Foo {
    foo = 1; /*
    */ 
}`,
						},
					],
				},
			],
		},
		{
			code: `class Foo {
    foo = 1; // keep this
    #unusedMember = 1;
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#unusedMember",
					},
					line: 3,
					column: 5,
					endLine: 3,
					endColumn: 18,
					suggestions: [
						{
							messageId: "removeUnusedPrivateClassMember",
							data: {
								classMemberName: "#unusedMember",
							},
							output: `class Foo {
    foo = 1; // keep this
}`,
						},
					],
				},
			],
		},
		{
			code: `class First {}
class Second {
    #unusedMemberInSecondClass = 5;
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#unusedMemberInSecondClass",
					},
					line: 3,
					column: 5,
					endLine: 3,
					endColumn: 31,
					suggestions: [
						{
							messageId: "removeUnusedPrivateClassMember",
							data: {
								classMemberName: "#unusedMemberInSecondClass",
							},
							output: `class First {}
class Second {
}`,
						},
					],
				},
			],
		},
		{
			code: `class First {
    #unusedMemberInFirstClass = 5;
}
class Second {}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#unusedMemberInFirstClass",
					},
					line: 2,
					column: 5,
					endLine: 2,
					endColumn: 30,
					suggestions: [
						{
							messageId: "removeUnusedPrivateClassMember",
							data: {
								classMemberName: "#unusedMemberInFirstClass",
							},
							output: `class First {
}
class Second {}`,
						},
					],
				},
			],
		},
		{
			code: `class First {
    #firstUnusedMemberInSameClass = 5;
    #secondUnusedMemberInSameClass = 5;
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#firstUnusedMemberInSameClass",
					},
					line: 2,
					column: 5,
					endLine: 2,
					endColumn: 34,
					suggestions: [
						{
							messageId: "removeUnusedPrivateClassMember",
							data: {
								classMemberName:
									"#firstUnusedMemberInSameClass",
							},
							output: `class First {
    #secondUnusedMemberInSameClass = 5;
}`,
						},
					],
				},
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#secondUnusedMemberInSameClass",
					},
					line: 3,
					column: 5,
					endLine: 3,
					endColumn: 35,
					suggestions: [
						{
							messageId: "removeUnusedPrivateClassMember",
							data: {
								classMemberName:
									"#secondUnusedMemberInSameClass",
							},
							output: `class First {
    #firstUnusedMemberInSameClass = 5;
}`,
						},
					],
				},
			],
		},
		{
			code: `class Foo {
    #usedOnlyInWrite = 5;
    method() {
        this.#usedOnlyInWrite = 42;
    }
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#usedOnlyInWrite",
					},
					line: 2,
					column: 5,
					endLine: 2,
					endColumn: 21,
				},
			],
		},
		{
			code: `class Foo {
    #usedOnlyInWriteStatement = 5;
    method() {
        this.#usedOnlyInWriteStatement += 42;
    }
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#usedOnlyInWriteStatement",
					},
					line: 2,
					column: 5,
					endLine: 2,
					endColumn: 30,
				},
			],
		},
		{
			code: `class C {
    #usedOnlyInIncrement;

    foo() {
        this.#usedOnlyInIncrement++;
    }
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#usedOnlyInIncrement",
					},
					line: 2,
					column: 5,
					endLine: 2,
					endColumn: 25,
				},
			],
		},
		{
			code: `class C {
    #unusedInOuterClass;

    foo() {
        return class {
            #unusedInOuterClass;

            bar() {
                return this.#unusedInOuterClass;
            }
        };
    }
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#unusedInOuterClass",
					},
					line: 2,
					column: 5,
					endLine: 2,
					endColumn: 24,
					suggestions: [
						{
							messageId: "removeUnusedPrivateClassMember",
							data: {
								classMemberName: "#unusedInOuterClass",
							},
							output: `class C {
    foo() {
        return class {
            #unusedInOuterClass;

            bar() {
                return this.#unusedInOuterClass;
            }
        };
    }
}`,
						},
					],
				},
			],
		},
		{
			code: `class C {
    #unusedOnlyInSecondNestedClass;

    foo() {
        return class {
            #unusedOnlyInSecondNestedClass;

            bar() {
                return this.#unusedOnlyInSecondNestedClass;
            }
        };
    }

    baz() {
        return this.#unusedOnlyInSecondNestedClass;
    }

    bar() {
        return class {
            #unusedOnlyInSecondNestedClass;
        }
    }
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#unusedOnlyInSecondNestedClass",
					},
					line: 20,
					column: 13,
					endLine: 20,
					endColumn: 43,
					suggestions: [
						{
							messageId: "removeUnusedPrivateClassMember",
							data: {
								classMemberName:
									"#unusedOnlyInSecondNestedClass",
							},
							output: `class C {
    #unusedOnlyInSecondNestedClass;

    foo() {
        return class {
            #unusedOnlyInSecondNestedClass;

            bar() {
                return this.#unusedOnlyInSecondNestedClass;
            }
        };
    }

    baz() {
        return this.#unusedOnlyInSecondNestedClass;
    }

    bar() {
        return class {
        }
    }
}`,
						},
					],
				},
			],
		},

		//--------------------------------------------------------------------------
		// Unused method definitions
		//--------------------------------------------------------------------------
		{
			code: `class Foo {
    #unusedMethod() {}
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#unusedMethod",
					},
					line: 2,
					column: 5,
					endLine: 2,
					endColumn: 18,
					suggestions: [
						{
							messageId: "removeUnusedPrivateClassMember",
							data: {
								classMemberName: "#unusedMethod",
							},
							output: `class Foo {
}`,
						},
					],
				},
			],
		},
		{
			code: `class Foo {
    #unusedMethod() {}
    #usedMethod() {
        return 42;
    }
    publicMethod() {
        return this.#usedMethod();
    }
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#unusedMethod",
					},
					line: 2,
					column: 5,
					endLine: 2,
					endColumn: 18,
					suggestions: [
						{
							messageId: "removeUnusedPrivateClassMember",
							data: {
								classMemberName: "#unusedMethod",
							},
							output: `class Foo {
    #usedMethod() {
        return 42;
    }
    publicMethod() {
        return this.#usedMethod();
    }
}`,
						},
					],
				},
			],
		},
		{
			code: `class Foo {
    set #unusedSetter(value) {}
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#unusedSetter",
					},
					line: 2,
					column: 9,
					endLine: 2,
					endColumn: 22,
					suggestions: [
						{
							messageId: "removeUnusedPrivateClassMember",
							data: {
								classMemberName: "#unusedSetter",
							},
							output: `class Foo {
}`,
						},
					],
				},
			],
		},
		{
			code: `class Foo {
    get #unusedAccessor() {
        return 1;
    }
    set #unusedAccessor(value) {}
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#unusedAccessor",
					},
					line: 5,
					column: 9,
					endLine: 5,
					endColumn: 24,
					suggestions: [
						{
							messageId: "removeUnusedPrivateClassMember",
							data: {
								classMemberName: "#unusedAccessor",
							},
							output: `class Foo {
    get #unusedAccessor() {
        return 1;
    }
}`,
						},
					],
				},
			],
		},
		{
			code: `class Foo {
    #unusedForInLoop;
    method() {
        for (this.#unusedForInLoop in bar) {

        }
    }
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#unusedForInLoop",
					},
					line: 2,
					column: 5,
					endLine: 2,
					endColumn: 21,
				},
			],
		},
		{
			code: `class Foo {
    #unusedForOfLoop;
    method() {
        for (this.#unusedForOfLoop of bar) {

        }
    }
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#unusedForOfLoop",
					},
					line: 2,
					column: 5,
					endLine: 2,
					endColumn: 21,
				},
			],
		},
		{
			code: `class Foo {
    #unusedInDestructuring;
    method() {
        ({ x: this.#unusedInDestructuring } = bar);
    }
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#unusedInDestructuring",
					},
					line: 2,
					column: 5,
					endLine: 2,
					endColumn: 27,
				},
			],
		},
		{
			code: `class Foo {
    #unusedInRestPattern;
    method() {
        [...this.#unusedInRestPattern] = bar;
    }
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#unusedInRestPattern",
					},
					line: 2,
					column: 5,
					endLine: 2,
					endColumn: 25,
				},
			],
		},
		{
			code: `class Foo {
    #unusedInAssignmentPattern;
    method() {
        [this.#unusedInAssignmentPattern = 1] = bar;
    }
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#unusedInAssignmentPattern",
					},
					line: 2,
					column: 5,
					endLine: 2,
					endColumn: 31,
				},
			],
		},
		{
			code: `class Foo {
    #unusedInAssignmentPattern;
    method() {
        [this.#unusedInAssignmentPattern] = bar;
    }
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#unusedInAssignmentPattern",
					},
					line: 2,
					column: 5,
					endLine: 2,
					endColumn: 31,
				},
			],
		},
		{
			code: `class Foo {
    foo = 1
    #unusedMethod() {}
    [0]() {}
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#unusedMethod",
					},
					line: 3,
					column: 5,
					endLine: 3,
					endColumn: 18,
					suggestions: [
						{
							messageId: "removeUnusedPrivateClassMember",
							data: {
								classMemberName: "#unusedMethod",
							},
							output: `class Foo {
    foo = 1;
    [0]() {}
}`,
						},
					],
				},
			],
		},
		{
			code: `class Foo {
    foo = 1
    #unusedMethod() {}
    *generator() {}
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#unusedMethod",
					},
					line: 3,
					column: 5,
					endLine: 3,
					endColumn: 18,
					suggestions: [
						{
							messageId: "removeUnusedPrivateClassMember",
							data: {
								classMemberName: "#unusedMethod",
							},
							output: `class Foo {
    foo = 1;
    *generator() {}
}`,
						},
					],
				},
			],
		},
		{
			code: `class Foo {
    foo = 1
    #unusedMethod() {}
    in = 2
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#unusedMethod",
					},
					line: 3,
					column: 5,
					endLine: 3,
					endColumn: 18,
					suggestions: [
						{
							messageId: "removeUnusedPrivateClassMember",
							data: {
								classMemberName: "#unusedMethod",
							},
							output: `class Foo {
    foo = 1;
    in = 2
}`,
						},
					],
				},
			],
		},
		{
			code: `class Foo {
    foo = 1
    #unused
    instanceof() {}
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#unused",
					},
					line: 3,
					column: 5,
					endLine: 3,
					endColumn: 12,
					suggestions: [
						{
							messageId: "removeUnusedPrivateClassMember",
							data: {
								classMemberName: "#unused",
							},
							output: `class Foo {
    foo = 1;
    instanceof() {}
}`,
						},
					],
				},
			],
		},
		{
			code: `class C {
    foo = () => {}
    #unused
    [bar]
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#unused",
					},
					line: 3,
					column: 5,
					endLine: 3,
					endColumn: 12,
					suggestions: [
						{
							messageId: "removeUnusedPrivateClassMember",
							data: {
								classMemberName: "#unused",
							},
							output: `class C {
    foo = () => {}
    [bar]
}`,
						},
					],
				},
			],
		},
		{
			code: `class C {
    foo
    #unused
    [bar]
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#unused",
					},
					line: 3,
					column: 5,
					endLine: 3,
					endColumn: 12,
					suggestions: [
						{
							messageId: "removeUnusedPrivateClassMember",
							data: {
								classMemberName: "#unused",
							},
							output: `class C {
    foo
    [bar]
}`,
						},
					],
				},
			],
		},
		{
			code: `class Foo {
    foo = 1
    /** docs */
    #unusedMethod() {}
    [0]() {}
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#unusedMethod",
					},
					line: 4,
					column: 5,
					endLine: 4,
					endColumn: 18,
					suggestions: [
						{
							messageId: "removeUnusedPrivateClassMember",
							data: {
								classMemberName: "#unusedMethod",
							},
							output: `class Foo {
    foo = 1;
    [0]() {}
}`,
						},
					],
				},
			],
		},
		{
			code: `class Foo {
    // keep

    /** remove */
    #unusedMember = 1;
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#unusedMember",
					},
					line: 5,
					column: 5,
					endLine: 5,
					endColumn: 18,
					suggestions: [
						{
							messageId: "removeUnusedPrivateClassMember",
							data: {
								classMemberName: "#unusedMember",
							},
							output: `class Foo {
    // keep

}`,
						},
					],
				},
			],
		},
		{
			code: `class Foo {
    // keep one
    // keep two

    /** remove */
    #unusedMember = 1;
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#unusedMember",
					},
					line: 6,
					column: 5,
					endLine: 6,
					endColumn: 18,
					suggestions: [
						{
							messageId: "removeUnusedPrivateClassMember",
							data: {
								classMemberName: "#unusedMember",
							},
							output: `class Foo {
    // keep one
    // keep two

}`,
						},
					],
				},
			],
		},
		{
			code: `class Foo {
    // maybe unrelated

    #unusedMember = 1;
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#unusedMember",
					},
					line: 4,
					column: 5,
					endLine: 4,
					endColumn: 18,
					suggestions: [
						{
							messageId: "removeUnusedPrivateClassMember",
							data: {
								classMemberName: "#unusedMember",
							},
							output: `class Foo {
    // maybe unrelated

}`,
						},
					],
				},
			],
		},
		{
			code: `class C {
    #usedOnlyInTheSecondInnerClass;

    method(a) {
        return class {
            #usedOnlyInTheSecondInnerClass;

            method2(b) {
                foo = b.#usedOnlyInTheSecondInnerClass;
            }

            method3(b) {
                foo = b.#usedOnlyInTheSecondInnerClass;
            }
        }
    }
}`,
			errors: [
				{
					messageId: "unusedPrivateClassMember",
					data: {
						classMemberName: "#usedOnlyInTheSecondInnerClass",
					},
					line: 2,
					column: 5,
					endLine: 2,
					endColumn: 35,
					suggestions: [
						{
							messageId: "removeUnusedPrivateClassMember",
							data: {
								classMemberName:
									"#usedOnlyInTheSecondInnerClass",
							},
							output: `class C {
    method(a) {
        return class {
            #usedOnlyInTheSecondInnerClass;

            method2(b) {
                foo = b.#usedOnlyInTheSecondInnerClass;
            }

            method3(b) {
                foo = b.#usedOnlyInTheSecondInnerClass;
            }
        }
    }
}`,
						},
					],
				},
			],
		},
	],
});
