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
        `
class Foo {
    publicMember = 42;
}`,
        `
class Foo {
    #usedMember = 42;
    method() {
        return this.#usedMember;
    }
}`,
        `
class Foo {
    #usedMember = 42;
    anotherMember = this.#usedMember;
}`,
        `
class Foo {
    #usedMember = 42;
    method() {
        return someGlobalMethod(this.#usedMember);
    }
}`,

        //--------------------------------------------------------------------------
        // Method definitions
        //--------------------------------------------------------------------------
        `
class Foo {
    #usedMethod() {
        return 42;
    }
    anotherMethod() {
        return this.#usedMethod();
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
        }
    ]
});
