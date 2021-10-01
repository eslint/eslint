/**
 * @fileoverview Tests for no-unused-private-class-members rule.
 * @author Tim van der Lippe
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-unused-private-class-members"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2022 } });

/**
 * Returns an expected error for defined-but-not-used private class member.
 * @param {string} classMemberName The name of the class member
 * @returns {Object} An expected error object
 */
function definedError(classMemberName) {
    return {
        messageId: "unusedPrivateClassMember",
        data: {
            classMemberName
        }
    };
}

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
    #unusedInAssignmentPattern;
    method() {
        [bar] = this.#unusedInAssignmentPattern;
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
}`
    ],
    invalid: [
        {
            code: `class Foo {
    #unusedMember = 5;
}`,
            errors: [definedError("unusedMember")]
        },
        {
            code: `class First {}
class Second {
    #unusedMemberInSecondClass = 5;
}`,
            errors: [definedError("unusedMemberInSecondClass")]
        },
        {
            code: `class First {
    #unusedMemberInFirstClass = 5;
}
class Second {}`,
            errors: [definedError("unusedMemberInFirstClass")]
        },
        {
            code: `class First {
    #firstUnusedMemberInSameClass = 5;
    #secondUnusedMemberInSameClass = 5;
}`,
            errors: [definedError("firstUnusedMemberInSameClass"), definedError("secondUnusedMemberInSameClass")]
        },
        {
            code: `class Foo {
    #usedOnlyInWrite = 5;
    method() {
        this.#usedOnlyInWrite = 42;
    }
}`,
            errors: [definedError("usedOnlyInWrite")]
        },
        {
            code: `class Foo {
    #usedOnlyInWriteStatement = 5;
    method() {
        this.#usedOnlyInWriteStatement += 42;
    }
}`,
            errors: [definedError("usedOnlyInWriteStatement")]
        },
        {
            code: `class C {
    #usedOnlyInIncrement;

    foo() {
        this.#usedOnlyInIncrement++;
    }
}`,
            errors: [definedError("usedOnlyInIncrement")]
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
            errors: [definedError("unusedInOuterClass")]
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
            errors: [definedError("unusedOnlyInSecondNestedClass")]
        },

        //--------------------------------------------------------------------------
        // Unused method definitions
        //--------------------------------------------------------------------------
        {
            code: `class Foo {
    #unusedMethod() {}
}`,
            errors: [definedError("unusedMethod")]
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
            errors: [definedError("unusedMethod")]
        },
        {
            code: `class Foo {
    set #unusedSetter(value) {}
}`,
            errors: [definedError("unusedSetter")]
        },
        {
            code: `class Foo {
    #unusedForInLoop;
    method() {
        for (this.#unusedForInLoop in bar) {

        }
    }
}`,
            errors: [definedError("unusedForInLoop")]
        },
        {
            code: `class Foo {
    #unusedForOfLoop;
    method() {
        for (this.#unusedForOfLoop of bar) {

        }
    }
}`,
            errors: [definedError("unusedForOfLoop")]
        },
        {
            code: `class Foo {
    #unusedInDestructuring;
    method() {
        ({ x: this.#unusedInDestructuring } = bar);
    }
}`,
            errors: [definedError("unusedInDestructuring")]
        },
        {
            code: `class Foo {
    #unusedInRestPattern;
    method() {
        [...this.#unusedInRestPattern] = bar;
    }
}`,
            errors: [definedError("unusedInRestPattern")]
        },
        {
            code: `class Foo {
    #unusedInAssignmentPattern;
    method() {
        [this.#unusedInAssignmentPattern = 1] = bar;
    }
}`,
            errors: [definedError("unusedInAssignmentPattern")]
        },
        {
            code: `class Foo {
    #unusedInAssignmentPattern;
    method() {
        [this.#unusedInAssignmentPattern] = bar;
    }
}`,
            errors: [definedError("unusedInAssignmentPattern")]
        }
    ]
});
