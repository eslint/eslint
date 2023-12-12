/**
 * @fileoverview Tests for keyword-spacing rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const parser = require("../../fixtures/fixture-parser"),
    rule = require("../../../lib/rules/keyword-spacing"),
    RuleTester = require("../../../lib/rule-tester/flat-rule-tester"),
    fixtureParser = require("../../fixtures/fixture-parser");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const BOTH = { before: true, after: true };
const NEITHER = { before: false, after: false };

/**
 * Creates an option object to test an "overrides" option.
 *
 * e.g.
 *
 *     override("as", BOTH)
 *
 * returns
 *
 *     {
 *         before: false,
 *         after: false,
 *         overrides: {as: {before: true, after: true}}
 *     }
 * @param {string} keyword A keyword to be overridden.
 * @param {Object} value A value to override.
 * @returns {Object} An option object to test an "overrides" option.
 */
function override(keyword, value) {
    const retv = {
        before: value.before === false,
        after: value.after === false,
        overrides: {}
    };

    retv.overrides[keyword] = value;

    return retv;
}

/**
 * Gets an error message that expected space(s) before a specified keyword.
 * @param {string} keyword A keyword.
 * @returns {string[]} An error message.
 */
function expectedBefore(keyword) {
    return [{ messageId: "expectedBefore", data: { value: keyword } }];
}

/**
 * Gets an error message that expected space(s) after a specified keyword.
 * @param {string} keyword A keyword.
 * @returns {string[]} An error message.
 */
function expectedAfter(keyword) {
    return [{ messageId: "expectedAfter", data: { value: keyword } }];
}

/**
 * Gets error messages that expected space(s) before and after a specified
 * keyword.
 * @param {string} keyword A keyword.
 * @returns {string[]} Error messages.
 */
function expectedBeforeAndAfter(keyword) {
    return [
        { messageId: "expectedBefore", data: { value: keyword } },
        { messageId: "expectedAfter", data: { value: keyword } }
    ];
}

/**
 * Gets an error message that unexpected space(s) before a specified keyword.
 * @param {string} keyword A keyword.
 * @returns {string[]} An error message.
 */
function unexpectedBefore(keyword) {
    return [{ messageId: "unexpectedBefore", data: { value: keyword } }];
}

/**
 * Gets an error message that unexpected space(s) after a specified keyword.
 * @param {string} keyword A keyword.
 * @returns {string[]} An error message.
 */
function unexpectedAfter(keyword) {
    return [{ messageId: "unexpectedAfter", data: { value: keyword } }];
}

/**
 * Gets error messages that unexpected space(s) before and after a specified
 * keyword.
 * @param {string} keyword A keyword.
 * @returns {string[]} Error messages.
 */
function unexpectedBeforeAndAfter(keyword) {
    return [
        { messageId: "unexpectedBefore", data: { value: keyword } },
        { messageId: "unexpectedAfter", data: { value: keyword } }
    ];
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    languageOptions: {
        ecmaVersion: 5,
        sourceType: "script"
    }
});

ruleTester.run("keyword-spacing", rule, {
    valid: [

        //----------------------------------------------------------------------
        // as
        //----------------------------------------------------------------------

        // import { a as b }
        { code: "import { a } from \"foo\"", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "import { a as b } from \"foo\"", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "import { \"a\" as b } from \"foo\"", languageOptions: { ecmaVersion: 2022, sourceType: "module" } },
        { code: "import{ a }from\"foo\"", options: [NEITHER], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "import{ a as b }from\"foo\"", options: [NEITHER], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "import{ \"a\"as b }from\"foo\"", options: [NEITHER], languageOptions: { ecmaVersion: 2022, sourceType: "module" } },
        { code: "import{ \"a\" as b }from\"foo\"", options: [override("as", BOTH)], languageOptions: { ecmaVersion: 2022, sourceType: "module" } },
        { code: "import { a as b } from \"foo\"", options: [override("as", NEITHER)], languageOptions: { ecmaVersion: 2022, sourceType: "module" } },
        { code: "import { \"a\"as b } from \"foo\"", options: [override("as", NEITHER)], languageOptions: { ecmaVersion: 2022, sourceType: "module" } },

        // export { a as b }
        { code: "let a; export { a };", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export { \"a\" } from \"foo\";", languageOptions: { ecmaVersion: 2022, sourceType: "module" } },
        { code: "let a; export { a as b };", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "let a; export { a as \"b\" };", languageOptions: { ecmaVersion: 2022, sourceType: "module" } },
        { code: "export { \"a\" as b } from \"foo\";", languageOptions: { ecmaVersion: 2022, sourceType: "module" } },
        { code: "export { \"a\" as \"b\" } from \"foo\";", languageOptions: { ecmaVersion: 2022, sourceType: "module" } },
        { code: "let a; export{ a };", options: [NEITHER], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export{ \"a\" }from\"foo\";", options: [NEITHER], languageOptions: { ecmaVersion: 2022, sourceType: "module" } },
        { code: "let a; export{ a as b };", options: [NEITHER], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "let a; export{ a as\"b\" };", options: [NEITHER], languageOptions: { ecmaVersion: 2022, sourceType: "module" } },
        { code: "export{ \"a\"as b }from\"foo\";", options: [NEITHER], languageOptions: { ecmaVersion: 2022, sourceType: "module" } },
        { code: "export{ \"a\"as\"b\" }from\"foo\";", options: [NEITHER], languageOptions: { ecmaVersion: 2022, sourceType: "module" } },
        { code: "let a; export{ a as \"b\" };", options: [override("as", BOTH)], languageOptions: { ecmaVersion: 2022, sourceType: "module" } },
        { code: "export{ \"a\" as b }from\"foo\";", options: [override("as", BOTH)], languageOptions: { ecmaVersion: 2022, sourceType: "module" } },
        { code: "export{ \"a\" as \"b\" }from\"foo\";", options: [override("as", BOTH)], languageOptions: { ecmaVersion: 2022, sourceType: "module" } },
        { code: "let a; export { a as b };", options: [override("as", NEITHER)], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "let a; export { a as\"b\" };", options: [override("as", NEITHER)], languageOptions: { ecmaVersion: 2022, sourceType: "module" } },
        { code: "export { \"a\"as b } from \"foo\";", options: [override("as", NEITHER)], languageOptions: { ecmaVersion: 2022, sourceType: "module" } },
        { code: "export { \"a\"as\"b\" } from \"foo\";", options: [override("as", NEITHER)], languageOptions: { ecmaVersion: 2022, sourceType: "module" } },

        // import * as a
        { code: "import * as a from \"foo\"", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "import*as a from\"foo\"", options: [NEITHER], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "import* as a from\"foo\"", options: [override("as", BOTH)], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "import *as a from \"foo\"", options: [override("as", NEITHER)], languageOptions: { ecmaVersion: 6, sourceType: "module" } },

        // export * as a
        { code: "export * as a from \"foo\"", languageOptions: { ecmaVersion: 2020, sourceType: "module" } },
        { code: "export * as \"a\" from \"foo\"", languageOptions: { ecmaVersion: 2022, sourceType: "module" } },
        { code: "export*as a from\"foo\"", options: [NEITHER], languageOptions: { ecmaVersion: 2020, sourceType: "module" } },
        { code: "export*as\"a\"from\"foo\"", options: [NEITHER], languageOptions: { ecmaVersion: 2022, sourceType: "module" } },
        { code: "export* as a from\"foo\"", options: [override("as", BOTH)], languageOptions: { ecmaVersion: 2020, sourceType: "module" } },
        { code: "export* as \"a\"from\"foo\"", options: [override("as", BOTH)], languageOptions: { ecmaVersion: 2022, sourceType: "module" } },
        { code: "export *as a from \"foo\"", options: [override("as", NEITHER)], languageOptions: { ecmaVersion: 2020, sourceType: "module" } },
        { code: "export *as\"a\" from \"foo\"", options: [override("as", NEITHER)], languageOptions: { ecmaVersion: 2022, sourceType: "module" } },

        //----------------------------------------------------------------------
        // async
        //----------------------------------------------------------------------

        { code: "{} async function foo() {}", languageOptions: { ecmaVersion: 8 } },
        { code: "{}async function foo() {}", options: [NEITHER], languageOptions: { ecmaVersion: 8 } },
        { code: "{} async function foo() {}", options: [override("async", BOTH)], languageOptions: { ecmaVersion: 8 } },
        { code: "{}async function foo() {}", options: [override("async", NEITHER)], languageOptions: { ecmaVersion: 8 } },
        { code: "{} async () => {}", languageOptions: { ecmaVersion: 8 } },
        { code: "{}async () => {}", options: [NEITHER], languageOptions: { ecmaVersion: 8 } },
        { code: "{} async () => {}", options: [override("async", BOTH)], languageOptions: { ecmaVersion: 8 } },
        { code: "{}async () => {}", options: [override("async", NEITHER)], languageOptions: { ecmaVersion: 8 } },
        { code: "({async [b]() {}})", languageOptions: { ecmaVersion: 8 } },
        { code: "({async[b]() {}})", options: [NEITHER], languageOptions: { ecmaVersion: 8 } },
        { code: "({async [b]() {}})", options: [override("async", BOTH)], languageOptions: { ecmaVersion: 8 } },
        { code: "({async[b]() {}})", options: [override("async", NEITHER)], languageOptions: { ecmaVersion: 8 } },
        { code: "class A {a(){} async [b]() {}}", languageOptions: { ecmaVersion: 8 } },
        { code: "class A {a(){}async[b]() {}}", options: [NEITHER], languageOptions: { ecmaVersion: 8 } },
        { code: "class A {a(){} async [b]() {}}", options: [override("async", BOTH)], languageOptions: { ecmaVersion: 8 } },
        { code: "class A {a(){}async[b]() {}}", options: [override("async", NEITHER)], languageOptions: { ecmaVersion: 8 } },

        // not conflict with `array-bracket-spacing`
        { code: "[async function foo() {}]", languageOptions: { ecmaVersion: 8 } },
        { code: "[ async function foo() {}]", options: [NEITHER], languageOptions: { ecmaVersion: 8 } },

        // not conflict with `arrow-spacing`
        { code: "() =>async function foo() {}", languageOptions: { ecmaVersion: 8 } },
        { code: "() => async function foo() {}", options: [NEITHER], languageOptions: { ecmaVersion: 8 } },

        // not conflict with `block-spacing`
        { code: "{async function foo() {} }", languageOptions: { ecmaVersion: 8 } },
        { code: "{ async function foo() {} }", options: [NEITHER], languageOptions: { ecmaVersion: 8 } },

        // not conflict with `comma-spacing`
        { code: "(0,async function foo() {})", languageOptions: { ecmaVersion: 8 } },
        { code: "(0, async function foo() {})", options: [NEITHER], languageOptions: { ecmaVersion: 8 } },

        // not conflict with `computed-property-spacing`
        { code: "a[async function foo() {}]", languageOptions: { ecmaVersion: 8 } },
        { code: "({[async function foo() {}]: 0})", languageOptions: { ecmaVersion: 8 } },
        { code: "a[ async function foo() {}]", options: [NEITHER], languageOptions: { ecmaVersion: 8 } },
        { code: "({[ async function foo() {}]: 0})", options: [NEITHER], languageOptions: { ecmaVersion: 8 } },

        // not conflict with `generator-star-spacing`
        { code: "({ async* foo() {} })", languageOptions: { ecmaVersion: 2018 } },
        { code: "({ async *foo() {} })", options: [NEITHER], languageOptions: { ecmaVersion: 2018 } },

        // not conflict with `key-spacing`
        { code: "({a:async function foo() {} })", languageOptions: { ecmaVersion: 8 } },
        { code: "({a: async function foo() {} })", options: [NEITHER], languageOptions: { ecmaVersion: 8 } },

        // not conflict with `semi-spacing`
        { code: ";async function foo() {};", languageOptions: { ecmaVersion: 8 } },
        { code: "; async function foo() {} ;", options: [NEITHER], languageOptions: { ecmaVersion: 8 } },

        // not conflict with `space-before-function-paren`
        { code: "async() => {}", languageOptions: { ecmaVersion: 8 } },
        { code: "async () => {}", options: [NEITHER], languageOptions: { ecmaVersion: 8 } },

        // not conflict with `space-in-parens`
        { code: "(async function foo() {})", languageOptions: { ecmaVersion: 8 } },
        { code: "( async function foo() {})", options: [NEITHER], languageOptions: { ecmaVersion: 8 } },

        // not conflict with `space-infix-ops`
        { code: "a =async function foo() {}", languageOptions: { ecmaVersion: 8 } },
        { code: "a = async function foo() {}", options: [NEITHER], languageOptions: { ecmaVersion: 8 } },

        // not conflict with `space-unary-ops`
        { code: "!async function foo() {}", languageOptions: { ecmaVersion: 8 } },
        { code: "! async function foo() {}", options: [NEITHER], languageOptions: { ecmaVersion: 8 } },

        // not conflict with `template-curly-spacing`
        { code: "`${async function foo() {}}`", languageOptions: { ecmaVersion: 8 } },
        { code: "`${ async function foo() {}}`", options: [NEITHER], languageOptions: { ecmaVersion: 8 } },

        // not conflict with `jsx-curly-spacing`
        { code: "<Foo onClick={async function foo() {}} />", languageOptions: { ecmaVersion: 8, parserOptions: { ecmaFeatures: { jsx: true } } } },
        { code: "<Foo onClick={ async function foo() {}} />", options: [NEITHER], languageOptions: { ecmaVersion: 8, parserOptions: { ecmaFeatures: { jsx: true } } } },

        //----------------------------------------------------------------------
        // await
        //----------------------------------------------------------------------

        { code: "async function wrap() { {} await +1 }", languageOptions: { ecmaVersion: 8 } },
        { code: "async function wrap() { {}await +1 }", options: [NEITHER], languageOptions: { ecmaVersion: 8 } },
        { code: "async function wrap() { {} await +1 }", options: [override("await", BOTH)], languageOptions: { ecmaVersion: 8 } },
        { code: "async function wrap() { {}await +1 }", options: [override("await", NEITHER)], languageOptions: { ecmaVersion: 8 } },

        // not conflict with `array-bracket-spacing`
        { code: "async function wrap() { [await a] }", languageOptions: { ecmaVersion: 8 } },
        { code: "async function wrap() { [ await a] }", options: [NEITHER], languageOptions: { ecmaVersion: 8 } },

        // not conflict with `arrow-spacing`
        { code: "async () =>await a", languageOptions: { ecmaVersion: 8 } },
        { code: "async () => await a", options: [NEITHER], languageOptions: { ecmaVersion: 8 } },

        // not conflict with `block-spacing`
        { code: "async function wrap() { {await a } }", languageOptions: { ecmaVersion: 8 } },
        { code: "async function wrap() { { await a } }", options: [NEITHER], languageOptions: { ecmaVersion: 8 } },

        // not conflict with `comma-spacing`
        { code: "async function wrap() { (0,await a) }", languageOptions: { ecmaVersion: 8 } },
        { code: "async function wrap() { (0, await a) }", options: [NEITHER], languageOptions: { ecmaVersion: 8 } },

        // not conflict with `computed-property-spacing`
        { code: "async function wrap() { a[await a] }", languageOptions: { ecmaVersion: 8 } },
        { code: "async function wrap() { ({[await a]: 0}) }", languageOptions: { ecmaVersion: 8 } },
        { code: "async function wrap() { a[ await a] }", options: [NEITHER], languageOptions: { ecmaVersion: 8 } },
        { code: "async function wrap() { ({[ await a]: 0}) }", options: [NEITHER], languageOptions: { ecmaVersion: 8 } },

        // not conflict with `key-spacing`
        { code: "async function wrap() { ({a:await a }) }", languageOptions: { ecmaVersion: 8 } },
        { code: "async function wrap() { ({a: await a }) }", options: [NEITHER], languageOptions: { ecmaVersion: 8 } },

        // not conflict with `semi-spacing`
        { code: "async function wrap() { ;await a; }", languageOptions: { ecmaVersion: 8 } },
        { code: "async function wrap() { ; await a ; }", options: [NEITHER], languageOptions: { ecmaVersion: 8 } },

        // not conflict with `space-in-parens`
        { code: "async function wrap() { (await a) }", languageOptions: { ecmaVersion: 8 } },
        { code: "async function wrap() { ( await a) }", options: [NEITHER], languageOptions: { ecmaVersion: 8 } },

        // not conflict with `space-infix-ops`
        { code: "async function wrap() { a =await a }", languageOptions: { ecmaVersion: 8 } },
        { code: "async function wrap() { a = await a }", options: [NEITHER], languageOptions: { ecmaVersion: 8 } },
        { code: "async function wrap() { a+await a }", languageOptions: { ecmaVersion: 8 } },
        { code: "async function wrap() { a + await a }", options: [NEITHER], languageOptions: { ecmaVersion: 8 } },
        { code: "async function wrap() { a<await a }", languageOptions: { ecmaVersion: 8 } },
        { code: "async function wrap() { a < await a }", options: [NEITHER], languageOptions: { ecmaVersion: 8 } },
        { code: "async function wrap() { a>await a }", languageOptions: { ecmaVersion: 8 } },
        { code: "async function wrap() { a > await a }", options: [NEITHER], languageOptions: { ecmaVersion: 8 } },

        // not conflict with `space-unary-ops`
        { code: "async function wrap() { !await'a' }", languageOptions: { ecmaVersion: 8 } },
        { code: "async function wrap() { ! await 'a' }", options: [NEITHER], languageOptions: { ecmaVersion: 8 } },

        // not conflict with `template-curly-spacing`
        { code: "async function wrap() { `${await a}` }", languageOptions: { ecmaVersion: 8 } },
        { code: "async function wrap() { `${ await a}` }", options: [NEITHER], languageOptions: { ecmaVersion: 8 } },

        // not conflict with `jsx-curly-spacing`
        { code: "async function wrap() { <Foo onClick={await a} /> }", languageOptions: { ecmaVersion: 8, parserOptions: { ecmaFeatures: { jsx: true } } } },
        { code: "async function wrap() { <Foo onClick={ await a} /> }", options: [NEITHER], languageOptions: { ecmaVersion: 8, parserOptions: { ecmaFeatures: { jsx: true } } } },

        //----------------------------------------------------------------------
        // break
        //----------------------------------------------------------------------

        "A: for (;;) { {} break A; }",
        { code: "A: for(;;) { {}break A; }", options: [NEITHER] },
        { code: "A: for(;;) { {} break A; }", options: [override("break", BOTH)] },
        { code: "A: for (;;) { {}break A; }", options: [override("break", NEITHER)] },

        // not conflict with `block-spacing`
        "for (;;) {break}",
        { code: "for(;;) { break }", options: [NEITHER] },

        // not conflict with `semi-spacing`
        "for (;;) { ;break; }",
        { code: "for(;;) { ; break ; }", options: [NEITHER] },

        //----------------------------------------------------------------------
        // case
        //----------------------------------------------------------------------

        "switch (a) { case 0: {} case +1: }",
        "switch (a) { case 0: {} case (1): }",
        { code: "switch(a) { case 0: {}case+1: }", options: [NEITHER] },
        { code: "switch(a) { case 0: {}case(1): }", options: [NEITHER] },
        { code: "switch(a) { case 0: {} case +1: }", options: [override("case", BOTH)] },
        { code: "switch (a) { case 0: {}case+1: }", options: [override("case", NEITHER)] },

        // not conflict with `block-spacing`
        "switch (a) {case 0: }",
        { code: "switch(a) { case 0: }", options: [NEITHER] },

        // not conflict with `semi-spacing`
        "switch (a) { case 0: ;case 1: }",
        { code: "switch(a) { case 0: ; case 1: }", options: [NEITHER] },

        //----------------------------------------------------------------------
        // catch
        //----------------------------------------------------------------------

        "try {} catch (e) {}",
        { code: "try{}catch(e) {}", options: [NEITHER] },
        { code: "try{} catch (e) {}", options: [override("catch", BOTH)] },
        { code: "try {}catch(e) {}", options: [override("catch", NEITHER)] },
        "try {}\ncatch (e) {}",
        { code: "try{}\ncatch(e) {}", options: [NEITHER] },

        //----------------------------------------------------------------------
        // class
        //----------------------------------------------------------------------

        { code: "{} class Bar {}", languageOptions: { ecmaVersion: 6 } },
        { code: "(class {})", languageOptions: { ecmaVersion: 6 } },
        { code: "{}class Bar {}", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },
        { code: "(class{})", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },
        { code: "{} class Bar {}", options: [override("class", BOTH)], languageOptions: { ecmaVersion: 6 } },
        { code: "{}class Bar {}", options: [override("class", NEITHER)], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `array-bracket-spacing`
        { code: "[class {}]", languageOptions: { ecmaVersion: 6 } },
        { code: "[ class{}]", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `arrow-spacing`
        { code: "() =>class {}", languageOptions: { ecmaVersion: 6 } },
        { code: "() => class{}", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `block-spacing`
        { code: "{class Bar {} }", languageOptions: { ecmaVersion: 6 } },
        { code: "{ class Bar {} }", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `comma-spacing`
        { code: "(0,class {})", languageOptions: { ecmaVersion: 6 } },
        { code: "(0, class{})", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `computed-property-spacing`
        { code: "a[class {}]", languageOptions: { ecmaVersion: 6 } },
        { code: "({[class {}]: 0})", languageOptions: { ecmaVersion: 6 } },
        { code: "a[ class{}]", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },
        { code: "({[ class{}]: 0})", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `key-spacing`
        { code: "({a:class {} })", languageOptions: { ecmaVersion: 6 } },
        { code: "({a: class{} })", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `semi-spacing`
        { code: ";class Bar {};", languageOptions: { ecmaVersion: 6 } },
        { code: "; class Bar {} ;", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `space-in-parens`
        { code: "( class{})", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `space-infix-ops`
        { code: "a =class {}", languageOptions: { ecmaVersion: 6 } },
        { code: "a = class{}", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },
        { code: "a+class {}", languageOptions: { ecmaVersion: 6 } },
        { code: "a + class{}", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },
        { code: "a<class {}", languageOptions: { ecmaVersion: 6 } },
        { code: "a < class{}", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },
        { code: "a>class {}", languageOptions: { ecmaVersion: 6 } },
        { code: "a > class{}", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `space-unary-ops`
        { code: "!class {}", languageOptions: { ecmaVersion: 6 } },
        { code: "! class{}", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `template-curly-spacing`
        { code: "`${class {}}`", languageOptions: { ecmaVersion: 6 } },
        { code: "`${ class{}}`", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `jsx-curly-spacing`
        { code: "<Foo onClick={class {}} />", languageOptions: { ecmaVersion: 6, parserOptions: { ecmaFeatures: { jsx: true } } } },
        { code: "<Foo onClick={ class{}} />", options: [NEITHER], languageOptions: { ecmaVersion: 6, parserOptions: { ecmaFeatures: { jsx: true } } } },

        // private names
        { code: "class C {\n#x;\nfoo() {\nfor (this.#x of bar){}}}", options: [{ before: false }], languageOptions: { ecmaVersion: 2022 } },
        { code: "class C {\n#x;\nfoo() {\nfor (this.#x in bar){}}}", options: [{ before: false }], languageOptions: { ecmaVersion: 2022 } },

        //----------------------------------------------------------------------
        // const
        //----------------------------------------------------------------------

        { code: "{} const [a] = b", languageOptions: { ecmaVersion: 6 } },
        { code: "{} const {a} = b", languageOptions: { ecmaVersion: 6 } },
        { code: "{}const[a] = b", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },
        { code: "{}const{a} = b", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },
        { code: "{} const [a] = b", options: [override("const", BOTH)], languageOptions: { ecmaVersion: 6 } },
        { code: "{} const {a} = b", options: [override("const", BOTH)], languageOptions: { ecmaVersion: 6 } },
        { code: "{}const[a] = b", options: [override("const", NEITHER)], languageOptions: { ecmaVersion: 6 } },
        { code: "{}const{a} = b", options: [override("const", NEITHER)], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `block-spacing`
        { code: "{const a = b}", languageOptions: { ecmaVersion: 6 } },
        { code: "{ const a = b}", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `semi-spacing`
        { code: ";const a = b;", languageOptions: { ecmaVersion: 6 } },
        { code: "; const a = b ;", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        //----------------------------------------------------------------------
        // continue
        //----------------------------------------------------------------------

        "A: for (;;) { {} continue A; }",
        { code: "A: for(;;) { {}continue A; }", options: [NEITHER] },
        { code: "A: for(;;) { {} continue A; }", options: [override("continue", BOTH)] },
        { code: "A: for (;;) { {}continue A; }", options: [override("continue", NEITHER)] },

        // not conflict with `block-spacing`
        "for (;;) {continue}",
        { code: "for(;;) { continue }", options: [NEITHER] },

        // not conflict with `semi-spacing`
        "for (;;) { ;continue; }",
        { code: "for(;;) { ; continue ; }", options: [NEITHER] },

        //----------------------------------------------------------------------
        // debugger
        //----------------------------------------------------------------------

        "{} debugger",
        { code: "{}debugger", options: [NEITHER] },
        { code: "{} debugger", options: [override("debugger", BOTH)] },
        { code: "{}debugger", options: [override("debugger", NEITHER)] },

        // not conflict with `block-spacing`
        "{debugger}",
        { code: "{ debugger }", options: [NEITHER] },

        // not conflict with `semi-spacing`
        ";debugger;",
        { code: "; debugger ;", options: [NEITHER] },

        //----------------------------------------------------------------------
        // default
        //----------------------------------------------------------------------

        "switch (a) { case 0: {} default: }",
        { code: "switch(a) { case 0: {}default: }", options: [NEITHER] },
        { code: "switch(a) { case 0: {} default: }", options: [override("default", BOTH)] },
        { code: "switch (a) { case 0: {}default: }", options: [override("default", NEITHER)] },

        // not conflict with `block-spacing`
        "switch (a) {default:}",
        { code: "switch(a) { default: }", options: [NEITHER] },

        // not conflict with `semi-spacing`
        "switch (a) { case 0: ;default: }",
        { code: "switch(a) { case 0: ; default: }", options: [NEITHER] },

        //----------------------------------------------------------------------
        // delete
        //----------------------------------------------------------------------

        "{} delete foo.a",
        { code: "{}delete foo.a", options: [NEITHER] },
        { code: "{} delete foo.a", options: [override("delete", BOTH)] },
        { code: "{}delete foo.a", options: [override("delete", NEITHER)] },

        // not conflict with `array-bracket-spacing`
        "[delete foo.a]",
        { code: "[ delete foo.a]", options: [NEITHER] },

        // not conflict with `arrow-spacing`
        { code: "(() =>delete foo.a)", languageOptions: { ecmaVersion: 6 } },
        { code: "(() => delete foo.a)", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `block-spacing`
        "{delete foo.a }",
        { code: "{ delete foo.a }", options: [NEITHER] },

        // not conflict with `comma-spacing`
        "(0,delete foo.a)",
        { code: "(0, delete foo.a)", options: [NEITHER] },

        // not conflict with `computed-property-spacing`
        "a[delete foo.a]",
        { code: "({[delete foo.a]: 0})", languageOptions: { ecmaVersion: 6 } },
        { code: "a[ delete foo.a]", options: [NEITHER] },
        { code: "({[ delete foo.a]: 0})", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `key-spacing`
        "({a:delete foo.a })",
        { code: "({a: delete foo.a })", options: [NEITHER] },

        // not conflict with `semi-spacing`
        ";delete foo.a",
        { code: "; delete foo.a", options: [NEITHER] },

        // not conflict with `space-in-parens`
        "(delete foo.a)",
        { code: "( delete foo.a)", options: [NEITHER] },

        // not conflict with `space-infix-ops`
        "a =delete foo.a",
        { code: "a = delete foo.a", options: [NEITHER] },
        "a+delete foo.a",
        { code: "a + delete foo.a", options: [NEITHER] },
        "a<delete foo.a",
        { code: "a < delete foo.a", options: [NEITHER] },
        "a>delete foo.a",
        { code: "a > delete foo.a", options: [NEITHER] },

        // not conflict with `space-unary-ops`
        "!delete(foo.a)",
        { code: "! delete (foo.a)", options: [NEITHER] },

        // not conflict with `template-curly-spacing`
        { code: "`${delete foo.a}`", languageOptions: { ecmaVersion: 6 } },
        { code: "`${ delete foo.a}`", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `jsx-curly-spacing`
        { code: "<Foo onClick={delete foo.a} />", languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
        { code: "<Foo onClick={ delete foo.a} />", options: [NEITHER], languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },

        //----------------------------------------------------------------------
        // do
        //----------------------------------------------------------------------

        "{} do {} while (true)",
        { code: "{}do{}while(true)", options: [NEITHER] },
        { code: "{} do {}while(true)", options: [override("do", BOTH)] },
        { code: "{}do{} while (true)", options: [override("do", NEITHER)] },
        "{}\ndo\n{} while (true)",
        { code: "{}\ndo\n{}while(true)", options: [NEITHER] },

        // not conflict with `block-spacing`
        "{do {} while (true)}",
        { code: "{ do{}while(true) }", options: [NEITHER] },

        // not conflict with `semi-spacing`
        ";do; while (true)",
        { code: "; do ;while(true)", options: [NEITHER] },

        //----------------------------------------------------------------------
        // else
        //----------------------------------------------------------------------

        "if (a) {} else {}",
        "if (a) {} else if (b) {}",
        "if (a) {} else (0)",
        "if (a) {} else []",
        "if (a) {} else +1",
        "if (a) {} else \"a\"",
        { code: "if(a){}else{}", options: [NEITHER] },
        { code: "if(a){}else if(b) {}", options: [NEITHER] },
        { code: "if(a) {}else(0)", options: [NEITHER] },
        { code: "if(a) {}else[]", options: [NEITHER] },
        { code: "if(a) {}else+1", options: [NEITHER] },
        { code: "if(a) {}else\"a\"", options: [NEITHER] },
        { code: "if(a) {} else {}", options: [override("else", BOTH)] },
        { code: "if (a) {}else{}", options: [override("else", NEITHER)] },
        "if (a) {}\nelse\n{}",
        { code: "if(a) {}\nelse\n{}", options: [NEITHER] },
        { code: "if(a){ }else{ }", options: [{ before: false, after: true, overrides: { else: { after: false }, if: { after: false } } }] },
        { code: "if(a){ }else{ }", options: [{ before: true, after: false, overrides: { else: { before: false }, if: { before: false } } }] },

        // not conflict with `semi-spacing`
        "if (a);else;",
        { code: "if(a); else ;", options: [NEITHER] },

        //----------------------------------------------------------------------
        // export
        //----------------------------------------------------------------------

        { code: "var a = 0; {} export {a}", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "{} export default a", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "{} export * from \"a\"", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "var a = 0; {}export{a}", options: [NEITHER], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "var a = 0; {} export {a}", options: [override("export", BOTH)], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "var a = 0; {}export{a}", options: [override("export", NEITHER)], languageOptions: { ecmaVersion: 6, sourceType: "module" } },

        // not conflict with `semi-spacing`
        { code: "var a = 0;\n;export {a}", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "var a = 0;\n; export{a}", options: [NEITHER], languageOptions: { ecmaVersion: 6, sourceType: "module" } },

        //----------------------------------------------------------------------
        // extends
        //----------------------------------------------------------------------

        { code: "class Bar extends [] {}", languageOptions: { ecmaVersion: 6 } },
        { code: "class Bar extends[] {}", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },
        { code: "class Bar extends [] {}", options: [override("extends", BOTH)], languageOptions: { ecmaVersion: 6 } },
        { code: "class Bar extends[] {}", options: [override("extends", NEITHER)], languageOptions: { ecmaVersion: 6 } },

        //----------------------------------------------------------------------
        // finally
        //----------------------------------------------------------------------

        "try {} finally {}",
        { code: "try{}finally{}", options: [NEITHER] },
        { code: "try{} finally {}", options: [override("finally", BOTH)] },
        { code: "try {}finally{}", options: [override("finally", NEITHER)] },
        "try {}\nfinally\n{}",
        { code: "try{}\nfinally\n{}", options: [NEITHER] },

        //----------------------------------------------------------------------
        // for
        //----------------------------------------------------------------------

        "{} for (;;) {}",
        "{} for (var foo in obj) {}",
        { code: "{} for (var foo of list) {}", languageOptions: { ecmaVersion: 6 } },
        { code: "{}for(;;) {}", options: [NEITHER] },
        { code: "{}for(var foo in obj) {}", options: [NEITHER] },
        { code: "{}for(var foo of list) {}", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },
        { code: "{} for (;;) {}", options: [override("for", BOTH)] },
        { code: "{} for (var foo in obj) {}", options: [override("for", BOTH)] },
        { code: "{} for (var foo of list) {}", options: [override("for", BOTH)], languageOptions: { ecmaVersion: 6 } },
        { code: "{}for(;;) {}", options: [override("for", NEITHER)] },
        { code: "{}for(var foo in obj) {}", options: [override("for", NEITHER)] },
        { code: "{}for(var foo of list) {}", options: [override("for", NEITHER)], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `block-spacing`
        "{for (;;) {} }",
        "{for (var foo in obj) {} }",
        { code: "{for (var foo of list) {} }", languageOptions: { ecmaVersion: 6 } },
        { code: "{ for(;;) {} }", options: [NEITHER] },
        { code: "{ for(var foo in obj) {} }", options: [NEITHER] },
        { code: "{ for(var foo of list) {} }", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `semi-spacing`
        ";for (;;) {}",
        ";for (var foo in obj) {}",
        { code: ";for (var foo of list) {}", languageOptions: { ecmaVersion: 6 } },
        { code: "; for(;;) {}", options: [NEITHER] },
        { code: "; for(var foo in obj) {}", options: [NEITHER] },
        { code: "; for(var foo of list) {}", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        //----------------------------------------------------------------------
        // from
        //----------------------------------------------------------------------

        { code: "import {foo} from \"foo\"", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export {foo} from \"foo\"", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export * from \"foo\"", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export * as \"x\" from \"foo\"", languageOptions: { ecmaVersion: 2022, sourceType: "module" } },
        { code: "import{foo}from\"foo\"", options: [NEITHER], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export{foo}from\"foo\"", options: [NEITHER], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export*from\"foo\"", options: [NEITHER], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export*as x from\"foo\"", options: [NEITHER], languageOptions: { ecmaVersion: 2020, sourceType: "module" } },
        { code: "export*as\"x\"from\"foo\"", options: [NEITHER], languageOptions: { ecmaVersion: 2022, sourceType: "module" } },
        { code: "import{foo} from \"foo\"", options: [override("from", BOTH)], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export{foo} from \"foo\"", options: [override("from", BOTH)], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export* from \"foo\"", options: [override("from", BOTH)], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export*as\"x\" from \"foo\"", options: [override("from", BOTH)], languageOptions: { ecmaVersion: 2022, sourceType: "module" } },
        { code: "import {foo}from\"foo\"", options: [override("from", NEITHER)], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export {foo}from\"foo\"", options: [override("from", NEITHER)], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export *from\"foo\"", options: [override("from", NEITHER)], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export * as x from\"foo\"", options: [override("from", NEITHER)], languageOptions: { ecmaVersion: 2020, sourceType: "module" } },
        { code: "export * as \"x\"from\"foo\"", options: [override("from", NEITHER)], languageOptions: { ecmaVersion: 2022, sourceType: "module" } },

        //----------------------------------------------------------------------
        // function
        //----------------------------------------------------------------------

        "{} function foo() {}",
        { code: "{}function foo() {}", options: [NEITHER] },
        { code: "{} function foo() {}", options: [override("function", BOTH)] },
        { code: "{}function foo() {}", options: [override("function", NEITHER)] },

        // not conflict with `array-bracket-spacing`
        "[function() {}]",
        { code: "[ function() {}]", options: [NEITHER] },

        // not conflict with `arrow-spacing`
        { code: "(() =>function() {})", languageOptions: { ecmaVersion: 6 } },
        { code: "(() => function() {})", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `block-spacing`
        "{function foo() {} }",
        { code: "{ function foo() {} }", options: [NEITHER] },

        // not conflict with `comma-spacing`
        "(0,function() {})",
        { code: "(0, function() {})", options: [NEITHER] },

        // not conflict with `computed-property-spacing`
        "a[function() {}]",
        { code: "({[function() {}]: 0})", languageOptions: { ecmaVersion: 6 } },
        { code: "a[ function() {}]", options: [NEITHER] },
        { code: "({[ function(){}]: 0})", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `generator-star-spacing`
        { code: "function* foo() {}", languageOptions: { ecmaVersion: 6 } },
        { code: "function *foo() {}", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `key-spacing`
        "({a:function() {} })",
        { code: "({a: function() {} })", options: [NEITHER] },

        // not conflict with `semi-spacing`
        ";function foo() {};",
        { code: "; function foo() {} ;", options: [NEITHER] },

        /*
         * not conflict with `space-before-function-paren`
         * not conflict with `space-in-parens`
         */
        "(function() {})",
        { code: "( function () {})", options: [NEITHER] },

        // not conflict with `space-infix-ops`
        "a =function() {}",
        { code: "a = function() {}", options: [NEITHER] },
        "a+function() {}",
        { code: "a + function() {}", options: [NEITHER] },
        "a<function() {}",
        { code: "a < function() {}", options: [NEITHER] },
        "a>function() {}",
        { code: "a > function() {}", options: [NEITHER] },

        // not conflict with `space-unary-ops`
        "!function() {}",
        { code: "! function() {}", options: [NEITHER] },

        // not conflict with `template-curly-spacing`
        { code: "`${function() {}}`", languageOptions: { ecmaVersion: 6 } },
        { code: "`${ function() {}}`", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `jsx-curly-spacing`
        { code: "<Foo onClick={function() {}} />", languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
        { code: "<Foo onClick={ function() {}} />", options: [NEITHER], languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },

        //----------------------------------------------------------------------
        // get
        //----------------------------------------------------------------------

        { code: "({ get [b]() {} })", languageOptions: { ecmaVersion: 6 } },
        { code: "class A { a() {} get [b]() {} }", languageOptions: { ecmaVersion: 6 } },
        { code: "class A { a() {} static get [b]() {} }", languageOptions: { ecmaVersion: 6 } },
        { code: "({ get[b]() {} })", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },
        { code: "class A { a() {}get[b]() {} }", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },
        { code: "class A { a() {}static get[b]() {} }", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },
        { code: "({ get [b]() {} })", options: [override("get", BOTH)], languageOptions: { ecmaVersion: 6 } },
        { code: "class A { a() {} get [b]() {} }", options: [override("get", BOTH)], languageOptions: { ecmaVersion: 6 } },
        { code: "({ get[b]() {} })", options: [override("get", NEITHER)], languageOptions: { ecmaVersion: 6 } },
        { code: "class A { a() {}get[b]() {} }", options: [override("get", NEITHER)], languageOptions: { ecmaVersion: 6 } },
        { code: "class A { a; get #b() {} }", languageOptions: { ecmaVersion: 2022 } },
        { code: "class A { a;get#b() {} }", options: [NEITHER], languageOptions: { ecmaVersion: 2022 } },

        // not conflict with `comma-spacing`
        { code: "({ a,get [b]() {} })", languageOptions: { ecmaVersion: 6 } },
        { code: "({ a, get[b]() {} })", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `semi-spacing`
        { code: "class A { ;get #b() {} }", languageOptions: { ecmaVersion: 2022 } },
        { code: "class A { ; get#b() {} }", options: [NEITHER], languageOptions: { ecmaVersion: 2022 } },

        //----------------------------------------------------------------------
        // if
        //----------------------------------------------------------------------

        "{} if (a) {}",
        "if (a) {} else if (a) {}",
        { code: "{}if(a) {}", options: [NEITHER] },
        { code: "if(a) {}else if(a) {}", options: [NEITHER] },
        { code: "{} if (a) {}", options: [override("if", BOTH)] },
        { code: "if (a) {}else if (a) {}", options: [override("if", BOTH)] },
        { code: "{}if(a) {}", options: [override("if", NEITHER)] },
        { code: "if(a) {} else if(a) {}", options: [override("if", NEITHER)] },

        // not conflict with `block-spacing`
        "{if (a) {} }",
        { code: "{ if(a) {} }", options: [NEITHER] },

        // not conflict with `semi-spacing`
        ";if (a) {}",
        { code: "; if(a) {}", options: [NEITHER] },

        //----------------------------------------------------------------------
        // import
        //----------------------------------------------------------------------

        { code: "{} import {a} from \"foo\"", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "{} import a from \"foo\"", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "{} import * as a from \"a\"", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "{}import{a}from\"foo\"", options: [NEITHER], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "{}import*as a from\"foo\"", options: [NEITHER], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "{} import {a}from\"foo\"", options: [override("import", BOTH)], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "{} import *as a from\"foo\"", options: [override("import", BOTH)], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "{}import{a} from \"foo\"", options: [override("import", NEITHER)], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "{}import* as a from \"foo\"", options: [override("import", NEITHER)], languageOptions: { ecmaVersion: 6, sourceType: "module" } },

        // not conflict with `semi-spacing`
        { code: ";import {a} from \"foo\"", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "; import{a}from\"foo\"", options: [NEITHER], languageOptions: { ecmaVersion: 6, sourceType: "module" } },

        //----------------------------------------------------------------------
        // in
        //----------------------------------------------------------------------

        { code: "for ([foo] in {foo: 0}) {}", languageOptions: { ecmaVersion: 6 } },
        { code: "for([foo]in{foo: 0}) {}", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },
        { code: "for([foo] in {foo: 0}) {}", options: [override("in", BOTH)], languageOptions: { ecmaVersion: 6 } },
        { code: "for ([foo]in{foo: 0}) {}", options: [override("in", NEITHER)], languageOptions: { ecmaVersion: 6 } },
        { code: "for ([foo] in ({foo: 0})) {}", languageOptions: { ecmaVersion: 6 } },

        // not conflict with `space-infix-ops`
        "if (\"foo\"in{foo: 0}) {}",
        { code: "if(\"foo\" in {foo: 0}) {}", options: [NEITHER] },

        //----------------------------------------------------------------------
        // instanceof
        //----------------------------------------------------------------------

        // not conflict with `space-infix-ops`
        "if (\"foo\"instanceof{foo: 0}) {}",
        { code: "if(\"foo\" instanceof {foo: 0}) {}", options: [NEITHER] },

        //----------------------------------------------------------------------
        // let
        //----------------------------------------------------------------------

        { code: "{} let [a] = b", languageOptions: { ecmaVersion: 6 } },
        { code: "{}let[a] = b", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },
        { code: "{} let [a] = b", options: [override("let", BOTH)], languageOptions: { ecmaVersion: 6 } },
        { code: "{}let[a] = b", options: [override("let", NEITHER)], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `block-spacing`
        { code: "{let [a] = b }", languageOptions: { ecmaVersion: 6 } },
        { code: "{ let[a] = b }", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `semi-spacing`
        { code: ";let [a] = b", languageOptions: { ecmaVersion: 6 } },
        { code: "; let[a] = b", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        //----------------------------------------------------------------------
        // new
        //----------------------------------------------------------------------

        "{} new foo()",
        { code: "{}new foo()", options: [NEITHER] },
        { code: "{} new foo()", options: [override("new", BOTH)] },
        { code: "{}new foo()", options: [override("new", NEITHER)] },

        // not conflict with `array-bracket-spacing`
        "[new foo()]",
        { code: "[ new foo()]", options: [NEITHER] },

        // not conflict with `arrow-spacing`
        { code: "(() =>new foo())", languageOptions: { ecmaVersion: 6 } },
        { code: "(() => new foo())", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `block-spacing`
        "{new foo() }",
        { code: "{ new foo() }", options: [NEITHER] },

        // not conflict with `comma-spacing`
        "(0,new foo())",
        { code: "(0, new foo())", options: [NEITHER] },

        // not conflict with `computed-property-spacing`
        "a[new foo()]",
        { code: "({[new foo()]: 0})", languageOptions: { ecmaVersion: 6 } },
        { code: "a[ new foo()]", options: [NEITHER] },
        { code: "({[ new foo()]: 0})", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `key-spacing`
        "({a:new foo() })",
        { code: "({a: new foo() })", options: [NEITHER] },

        // not conflict with `semi-spacing`
        ";new foo()",
        { code: "; new foo()", options: [NEITHER] },

        // not conflict with `space-in-parens`
        "(new foo())",
        { code: "( new foo())", options: [NEITHER] },

        // not conflict with `space-infix-ops`
        "a =new foo()",
        { code: "a = new foo()", options: [NEITHER] },
        "a+new foo()",
        { code: "a + new foo()", options: [NEITHER] },
        "a<new foo()",
        { code: "a < new foo()", options: [NEITHER] },
        "a>new foo()",
        { code: "a > new foo()", options: [NEITHER] },

        // not conflict with `space-unary-ops`
        "!new(foo)()",
        { code: "! new (foo)()", options: [NEITHER] },

        // not conflict with `template-curly-spacing`
        { code: "`${new foo()}`", languageOptions: { ecmaVersion: 6 } },
        { code: "`${ new foo()}`", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `jsx-curly-spacing`
        { code: "<Foo onClick={new foo()} />", languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
        { code: "<Foo onClick={ new foo()} />", options: [NEITHER], languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },

        //----------------------------------------------------------------------
        // of
        //----------------------------------------------------------------------

        { code: "for ([foo] of {foo: 0}) {}", languageOptions: { ecmaVersion: 6 } },
        { code: "for([foo]of{foo: 0}) {}", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },
        { code: "for([foo] of {foo: 0}) {}", options: [override("of", BOTH)], languageOptions: { ecmaVersion: 6 } },
        { code: "for ([foo]of{foo: 0}) {}", options: [override("of", NEITHER)], languageOptions: { ecmaVersion: 6 } },
        { code: "for ([foo] of ({foo: 0})) {}", languageOptions: { ecmaVersion: 6 } },

        //----------------------------------------------------------------------
        // return
        //----------------------------------------------------------------------

        "function foo() { {} return +a }",
        {
            code: "function foo() { return <p/>; }",
            languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } }
        },
        { code: "function foo() { {}return+a }", options: [NEITHER] },
        {
            code: "function foo() { return<p/>; }",
            options: [{ after: false }],
            languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } }
        },
        { code: "function foo() { {} return +a }", options: [override("return", BOTH)] },
        { code: "function foo() { {}return+a }", options: [override("return", NEITHER)] },
        "function foo() {\nreturn\n}",
        { code: "function foo() {\nreturn\n}", options: [NEITHER] },

        // not conflict with `block-spacing`
        "function foo() {return}",
        { code: "function foo() { return }", options: [NEITHER] },

        // not conflict with `semi-spacing`
        "function foo() { ;return; }",
        { code: "function foo() { ; return ; }", options: [NEITHER] },

        //----------------------------------------------------------------------
        // set
        //----------------------------------------------------------------------

        { code: "({ set [b](value) {} })", languageOptions: { ecmaVersion: 6 } },
        { code: "class A { a() {} set [b](value) {} }", languageOptions: { ecmaVersion: 6 } },
        { code: "class A { a() {} static set [b](value) {} }", languageOptions: { ecmaVersion: 6 } },
        { code: "({ set[b](value) {} })", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },
        { code: "class A { a() {}set[b](value) {} }", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },
        { code: "({ set [b](value) {} })", options: [override("set", BOTH)], languageOptions: { ecmaVersion: 6 } },
        { code: "class A { a() {} set [b](value) {} }", options: [override("set", BOTH)], languageOptions: { ecmaVersion: 6 } },
        { code: "({ set[b](value) {} })", options: [override("set", NEITHER)], languageOptions: { ecmaVersion: 6 } },
        { code: "class A { a() {}set[b](value) {} }", options: [override("set", NEITHER)], languageOptions: { ecmaVersion: 6 } },
        { code: "class A { a; set #b(value) {} }", languageOptions: { ecmaVersion: 2022 } },
        { code: "class A { a;set#b(value) {} }", options: [NEITHER], languageOptions: { ecmaVersion: 2022 } },

        // not conflict with `comma-spacing`
        { code: "({ a,set [b](value) {} })", languageOptions: { ecmaVersion: 6 } },
        { code: "({ a, set[b](value) {} })", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `semi-spacing`
        { code: "class A { ;set #b(value) {} }", languageOptions: { ecmaVersion: 2022 } },
        { code: "class A { ; set#b(value) {} }", options: [NEITHER], languageOptions: { ecmaVersion: 2022 } },

        //----------------------------------------------------------------------
        // static
        //----------------------------------------------------------------------

        { code: "class A { a() {} static [b]() {} }", languageOptions: { ecmaVersion: 6 } },
        { code: "class A { a() {}static[b]() {} }", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },
        { code: "class A { a() {} static [b]() {} }", options: [override("static", BOTH)], languageOptions: { ecmaVersion: 6 } },
        { code: "class A { a() {}static[b]() {} }", options: [override("static", NEITHER)], languageOptions: { ecmaVersion: 6 } },
        { code: "class A { a; static [b]; }", languageOptions: { ecmaVersion: 2022 } },
        { code: "class A { a;static[b]; }", options: [NEITHER], languageOptions: { ecmaVersion: 2022 } },
        { code: "class A { a; static #b; }", languageOptions: { ecmaVersion: 2022 } },
        { code: "class A { a;static#b; }", options: [NEITHER], languageOptions: { ecmaVersion: 2022 } },
        { code: "class A { a() {} static {} }", languageOptions: { ecmaVersion: 2022 } },
        { code: "class A { a() {}static{} }", options: [NEITHER], languageOptions: { ecmaVersion: 2022 } },
        { code: "class A { a() {} static {} }", options: [override("static", BOTH)], languageOptions: { ecmaVersion: 2022 } },
        { code: "class A { a() {}static{} }", options: [override("static", NEITHER)], languageOptions: { ecmaVersion: 2022 } },
        { code: "class A { a() {}\nstatic\n{} }", options: [NEITHER], languageOptions: { ecmaVersion: 2022 } },

        // not conflict with `generator-star-spacing`
        { code: "class A { static* [a]() {} }", languageOptions: { ecmaVersion: 6 } },
        { code: "class A { static *[a]() {} }", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `semi-spacing`
        { code: "class A { ;static a() {} }", languageOptions: { ecmaVersion: 6 } },
        { code: "class A { ; static a() {} }", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },
        { code: "class A { ;static a; }", languageOptions: { ecmaVersion: 2022 } },
        { code: "class A { ; static a ; }", options: [NEITHER], languageOptions: { ecmaVersion: 2022 } },
        { code: "class A { ;static {} }", languageOptions: { ecmaVersion: 2022 } },
        { code: "class A { ; static{} }", options: [NEITHER], languageOptions: { ecmaVersion: 2022 } },

        //----------------------------------------------------------------------
        // super
        //----------------------------------------------------------------------

        { code: "class A extends B { a() { {} super[b](); } }", languageOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { a() { {}super[b](); } }", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { a() { {} super[b](); } }", options: [override("super", BOTH)], languageOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { a() { {}super[b](); } }", options: [override("super", NEITHER)], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `array-bracket-spacing`
        { code: "class A extends B { constructor() { [super()]; } }", languageOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor() { [ super() ]; } }", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `arrow-spacing`
        { code: "class A extends B { constructor() { () =>super(); } }", languageOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor() { () => super(); } }", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `block-spacing`
        { code: "class A extends B { constructor() {super()} }", languageOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor() { super() } }", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `comma-spacing`
        { code: "class A extends B { constructor() { (0,super()) } }", languageOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor() { (0, super()) } }", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `computed-property-spacing`
        { code: "class A extends B { constructor() { ({[super()]: 0}) } }", languageOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor() { ({[ super() ]: 0}) } }", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `key-spacing`
        { code: "class A extends B { constructor() { ({a:super() }) } }", languageOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor() { ({a: super() }) } }", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `func-call-spacing`
        { code: "class A extends B { constructor() { super(); } }", languageOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor() { super (); } }", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `semi-spacing`
        { code: "class A extends B { constructor() { ;super(); } }", languageOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor() { ; super() ; } }", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `space-in-parens`
        { code: "class A extends B { constructor() { (super()) } }", languageOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor() { ( super() ) } }", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `space-infix-ops`
        { code: "class A extends B { constructor() { b =super() } }", languageOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor() { b = super() } }", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor() { b+super() } }", languageOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor() { b + super() } }", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor() { b<super() } }", languageOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor() { b < super() } }", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor() { b>super() } }", languageOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor() { b > super() } }", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `space-unary-ops`
        { code: "class A extends B { constructor() { !super() } }", languageOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor() { ! super() } }", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `template-curly-spacing`
        { code: "class A extends B { constructor() { `${super()}` } }", languageOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { constructor() { `${ super() }` } }", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `jsx-curly-spacing`
        { code: "class A extends B { constructor() { <Foo onClick={super()} /> } }", languageOptions: { ecmaVersion: 6, parserOptions: { ecmaFeatures: { jsx: true } } } },
        { code: "class A extends B { constructor() { <Foo onClick={ super() } /> } }", options: [NEITHER], languageOptions: { ecmaVersion: 6, parserOptions: { ecmaFeatures: { jsx: true } } } },

        //----------------------------------------------------------------------
        // switch
        //----------------------------------------------------------------------

        "{} switch (a) {}",
        { code: "{}switch(a) {}", options: [NEITHER] },
        { code: "{} switch (a) {}", options: [override("switch", BOTH)] },
        { code: "{}switch(a) {}", options: [override("switch", NEITHER)] },

        // not conflict with `block-spacing`
        "{switch (a) {} }",
        { code: "{ switch(a) {} }", options: [NEITHER] },

        // not conflict with `semi-spacing`
        ";switch (a) {}",
        { code: "; switch(a) {}", options: [NEITHER] },

        //----------------------------------------------------------------------
        // this
        //----------------------------------------------------------------------

        "{} this[a]",
        { code: "{}this[a]", options: [NEITHER] },
        { code: "{} this[a]", options: [override("this", BOTH)] },
        { code: "{}this[a]", options: [override("this", NEITHER)] },

        {
            code: "<Thing> this.blah",
            languageOptions: {
                parser: require(fixtureParser("keyword-spacing", "prefix-cast-operator-space"))
            }
        },
        {
            code: "<Thing>this.blah",
            options: [override("this", { before: false })],
            languageOptions: {
                parser: require(fixtureParser("keyword-spacing", "prefix-cast-operator-no-space"))
            }
        },

        // not conflict with `array-bracket-spacing`
        "[this]",
        { code: "[ this ]", options: [NEITHER] },

        // not conflict with `arrow-spacing`
        { code: "(() =>this)", languageOptions: { ecmaVersion: 6 } },
        { code: "(() => this)", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `block-spacing`
        "{this}",
        { code: "{ this }", options: [NEITHER] },

        // not conflict with `comma-spacing`
        "(0,this)",
        { code: "(0, this)", options: [NEITHER] },

        // not conflict with `computed-property-spacing`
        "a[this]",
        { code: "({[this]: 0})", languageOptions: { ecmaVersion: 6 } },
        { code: "a[ this ]", options: [NEITHER] },
        { code: "({[ this ]: 0})", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `key-spacing`
        "({a:this })",
        { code: "({a: this })", options: [NEITHER] },

        // not conflict with `semi-spacing`
        ";this",
        { code: "; this", options: [NEITHER] },

        // not conflict with `space-in-parens`
        "(this)",
        { code: "( this )", options: [NEITHER] },

        // not conflict with `space-infix-ops`
        "a =this",
        { code: "a = this", options: [NEITHER] },
        "a+this",
        { code: "a + this", options: [NEITHER] },
        "a<this",
        { code: "a < this", options: [NEITHER] },
        "a>this",
        { code: "a > this", options: [NEITHER] },
        "this+a",
        { code: "this + a", options: [NEITHER] },
        "this<a",
        { code: "this < a", options: [NEITHER] },
        "this>a",
        { code: "this > a", options: [NEITHER] },

        // not conflict with `space-unary-ops`
        "!this",
        { code: "! this", options: [NEITHER] },

        // not conflict with `template-curly-spacing`
        { code: "`${this}`", languageOptions: { ecmaVersion: 6 } },
        { code: "`${ this }`", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `jsx-curly-spacing`
        { code: "<Foo onClick={this} />", languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
        { code: "<Foo onClick={ this } />", options: [NEITHER], languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },

        //----------------------------------------------------------------------
        // throw
        //----------------------------------------------------------------------

        "function foo() { {} throw +a }",
        { code: "function foo() { {}throw+a }", options: [NEITHER] },
        { code: "function foo() { {} throw +a }", options: [override("throw", BOTH)] },
        { code: "function foo() { {}throw+a }", options: [override("throw", NEITHER)] },
        "function foo() {\nthrow a\n}",
        { code: "function foo() {\nthrow a\n}", options: [NEITHER] },

        // not conflict with `block-spacing`
        "function foo() {throw a }",
        { code: "function foo() { throw a }", options: [NEITHER] },

        // not conflict with `semi-spacing`
        "function foo() { ;throw a }",
        { code: "function foo() { ; throw a }", options: [NEITHER] },

        //----------------------------------------------------------------------
        // try
        //----------------------------------------------------------------------

        "{} try {} finally {}",
        { code: "{}try{}finally{}", options: [NEITHER] },
        { code: "{} try {}finally{}", options: [override("try", BOTH)] },
        { code: "{}try{} finally {}", options: [override("try", NEITHER)] },

        // not conflict with `block-spacing`
        "{try {} finally {}}",
        { code: "{ try{}finally{}}", options: [NEITHER] },

        // not conflict with `semi-spacing`
        ";try {} finally {}",
        { code: "; try{}finally{}", options: [NEITHER] },

        //----------------------------------------------------------------------
        // typeof
        //----------------------------------------------------------------------

        "{} typeof foo",
        { code: "{}typeof foo", options: [NEITHER] },
        { code: "{} typeof foo", options: [override("typeof", BOTH)] },
        { code: "{}typeof foo", options: [override("typeof", NEITHER)] },

        // not conflict with `array-bracket-spacing`
        "[typeof foo]",
        { code: "[ typeof foo]", options: [NEITHER] },

        // not conflict with `arrow-spacing`
        { code: "(() =>typeof foo)", languageOptions: { ecmaVersion: 6 } },
        { code: "(() => typeof foo)", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `block-spacing`
        "{typeof foo }",
        { code: "{ typeof foo }", options: [NEITHER] },

        // not conflict with `comma-spacing`
        "(0,typeof foo)",
        { code: "(0, typeof foo)", options: [NEITHER] },

        // not conflict with `computed-property-spacing`
        "a[typeof foo]",
        { code: "({[typeof foo]: 0})", languageOptions: { ecmaVersion: 6 } },
        { code: "a[ typeof foo]", options: [NEITHER] },
        { code: "({[ typeof foo]: 0})", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `key-spacing`
        "({a:typeof foo })",
        { code: "({a: typeof foo })", options: [NEITHER] },

        // not conflict with `semi-spacing`
        ";typeof foo",
        { code: "; typeof foo", options: [NEITHER] },

        // not conflict with `space-in-parens`
        "(typeof foo)",
        { code: "( typeof foo)", options: [NEITHER] },

        // not conflict with `space-infix-ops`
        "a =typeof foo",
        { code: "a = typeof foo", options: [NEITHER] },
        "a+typeof foo",
        { code: "a + typeof foo", options: [NEITHER] },
        "a<typeof foo",
        { code: "a < typeof foo", options: [NEITHER] },
        "a>typeof foo",
        { code: "a > typeof foo", options: [NEITHER] },

        // not conflict with `space-unary-ops`
        "!typeof+foo",
        { code: "! typeof +foo", options: [NEITHER] },

        // not conflict with `template-curly-spacing`
        { code: "`${typeof foo}`", languageOptions: { ecmaVersion: 6 } },
        { code: "`${ typeof foo}`", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `jsx-curly-spacing`
        { code: "<Foo onClick={typeof foo} />", languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
        { code: "<Foo onClick={ typeof foo} />", options: [NEITHER], languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },

        //----------------------------------------------------------------------
        // var
        //----------------------------------------------------------------------

        { code: "{} var [a] = b", languageOptions: { ecmaVersion: 6 } },
        { code: "{}var[a] = b", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },
        { code: "{} var [a] = b", options: [override("var", BOTH)], languageOptions: { ecmaVersion: 6 } },
        { code: "{}var[a] = b", options: [override("var", NEITHER)], languageOptions: { ecmaVersion: 6 } },
        "for (var foo in [1, 2, 3]) {}",

        // not conflict with `block-spacing`
        "{var a = b }",
        { code: "{ var a = b }", options: [NEITHER] },

        // not conflict with `semi-spacing`
        ";var a = b",
        { code: "; var a = b", options: [NEITHER] },

        //----------------------------------------------------------------------
        // void
        //----------------------------------------------------------------------

        "{} void foo",
        { code: "{}void foo", options: [NEITHER] },
        { code: "{} void foo", options: [override("void", BOTH)] },
        { code: "{}void foo", options: [override("void", NEITHER)] },

        // not conflict with `array-bracket-spacing`
        "[void foo]",
        { code: "[ void foo]", options: [NEITHER] },

        // not conflict with `arrow-spacing`
        { code: "(() =>void foo)", languageOptions: { ecmaVersion: 6 } },
        { code: "(() => void foo)", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `block-spacing`
        "{void foo }",
        { code: "{ void foo }", options: [NEITHER] },

        // not conflict with `comma-spacing`
        "(0,void foo)",
        { code: "(0, void foo)", options: [NEITHER] },

        // not conflict with `computed-property-spacing`
        "a[void foo]",
        { code: "({[void foo]: 0})", languageOptions: { ecmaVersion: 6 } },
        { code: "a[ void foo]", options: [NEITHER] },
        { code: "({[ void foo]: 0})", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `key-spacing`
        "({a:void foo })",
        { code: "({a: void foo })", options: [NEITHER] },

        // not conflict with `semi-spacing`
        ";void foo",
        { code: "; void foo", options: [NEITHER] },

        // not conflict with `space-in-parens`
        "(void foo)",
        { code: "( void foo)", options: [NEITHER] },

        // not conflict with `space-infix-ops`
        "a =void foo",
        { code: "a = void foo", options: [NEITHER] },
        "a+void foo",
        { code: "a + void foo", options: [NEITHER] },
        "a<void foo",
        { code: "a < void foo", options: [NEITHER] },
        "a>void foo",
        { code: "a > void foo", options: [NEITHER] },

        // not conflict with `space-unary-ops`
        "!void+foo",
        { code: "! void +foo", options: [NEITHER] },

        // not conflict with `template-curly-spacing`
        { code: "`${void foo}`", languageOptions: { ecmaVersion: 6 } },
        { code: "`${ void foo}`", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `jsx-curly-spacing`
        { code: "<Foo onClick={void foo} />", languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
        { code: "<Foo onClick={ void foo} />", options: [NEITHER], languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },

        //----------------------------------------------------------------------
        // while
        //----------------------------------------------------------------------

        "{} while (a) {}",
        "do {} while (a)",
        { code: "{}while(a) {}", options: [NEITHER] },
        { code: "do{}while(a)", options: [NEITHER] },
        { code: "{} while (a) {}", options: [override("while", BOTH)] },
        { code: "do{} while (a)", options: [override("while", BOTH)] },
        { code: "{}while(a) {}", options: [override("while", NEITHER)] },
        { code: "do {}while(a)", options: [override("while", NEITHER)] },
        "do {}\nwhile (a)",
        { code: "do{}\nwhile(a)", options: [NEITHER] },

        // not conflict with `block-spacing`
        "{while (a) {}}",
        { code: "{ while(a) {}}", options: [NEITHER] },

        // not conflict with `semi-spacing`
        ";while (a);",
        "do;while (a);",
        { code: "; while(a) ;", options: [NEITHER] },
        { code: "do ; while(a) ;", options: [NEITHER] },

        //----------------------------------------------------------------------
        // with
        //----------------------------------------------------------------------

        "{} with (obj) {}",
        { code: "{}with(obj) {}", options: [NEITHER] },
        { code: "{} with (obj) {}", options: [override("with", BOTH)] },
        { code: "{}with(obj) {}", options: [override("with", NEITHER)] },

        // not conflict with `block-spacing`
        "{with (obj) {}}",
        { code: "{ with(obj) {}}", options: [NEITHER] },

        // not conflict with `semi-spacing`
        ";with (obj) {}",
        { code: "; with(obj) {}", options: [NEITHER] },

        //----------------------------------------------------------------------
        // yield
        //----------------------------------------------------------------------

        { code: "function* foo() { {} yield foo }", languageOptions: { ecmaVersion: 6 } },
        { code: "function* foo() { {}yield foo }", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },
        { code: "function* foo() { {} yield foo }", options: [override("yield", BOTH)], languageOptions: { ecmaVersion: 6 } },
        { code: "function* foo() { {}yield foo }", options: [override("yield", NEITHER)], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `array-bracket-spacing`
        { code: "function* foo() { [yield] }", languageOptions: { ecmaVersion: 6 } },
        { code: "function* foo() { [ yield ] }", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        /*
         * This is invalid syntax: https://github.com/eslint/eslint/issues/5405
         * not conflict with `arrow-spacing`
         * {code: "function* foo() { (() =>yield foo) }", languageOptions: {ecmaVersion: 6}},
         * {code: "function* foo() { (() => yield foo) }", options: [NEITHER], languageOptions: {ecmaVersion: 6}},
         * not conflict with `block-spacing`
         */
        { code: "function* foo() {yield}", languageOptions: { ecmaVersion: 6 } },
        { code: "function* foo() { yield }", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `comma-spacing`
        { code: "function* foo() { (0,yield foo) }", languageOptions: { ecmaVersion: 6 } },
        { code: "function* foo() { (0, yield foo) }", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `computed-property-spacing`
        { code: "function* foo() { a[yield] }", languageOptions: { ecmaVersion: 6 } },
        { code: "function* foo() { ({[yield]: 0}) }", languageOptions: { ecmaVersion: 6 } },
        { code: "function* foo() { a[ yield ] }", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },
        { code: "function* foo() { ({[ yield ]: 0}) }", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `key-spacing`
        { code: "function* foo() { ({a:yield foo }) }", languageOptions: { ecmaVersion: 6 } },
        { code: "function* foo() { ({a: yield foo }) }", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `semi-spacing`
        { code: "function* foo() { ;yield; }", languageOptions: { ecmaVersion: 6 } },
        { code: "function* foo() { ; yield ; }", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `space-in-parens`
        { code: "function* foo() { (yield) }", languageOptions: { ecmaVersion: 6 } },
        { code: "function* foo() { ( yield ) }", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `space-infix-ops`
        { code: "function* foo() { a =yield foo }", languageOptions: { ecmaVersion: 6 } },
        { code: "function* foo() { a = yield foo }", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `space-unary-ops`
        { code: "function* foo() { yield+foo }", languageOptions: { ecmaVersion: 6 } },
        { code: "function* foo() { yield +foo }", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `template-curly-spacing`
        { code: "`${yield}`", languageOptions: { ecmaVersion: 6 } },
        { code: "`${ yield}`", options: [NEITHER], languageOptions: { ecmaVersion: 6 } },

        // not conflict with `jsx-curly-spacing`
        { code: "function* foo() { <Foo onClick={yield} /> }", languageOptions: { ecmaVersion: 6, parserOptions: { ecmaFeatures: { jsx: true } } } },
        { code: "function* foo() { <Foo onClick={ yield } /> }", options: [NEITHER], languageOptions: { ecmaVersion: 6, parserOptions: { ecmaFeatures: { jsx: true } } } },

        //----------------------------------------------------------------------
        // typescript parser
        //----------------------------------------------------------------------

        // class declaration don't error with decorator
        { code: "@dec class Foo {}", languageOptions: { parser: require(parser("typescript-parsers/decorator-with-class")) } },

        // get, set, async methods don't error with decorator
        { code: "class Foo { @dec get bar() {} @dec set baz() {} @dec async baw() {} }", languageOptions: { parser: require(parser("typescript-parsers/decorator-with-class-methods")) } },
        { code: "class Foo { @dec static qux() {} @dec static get bar() {} @dec static set baz() {} @dec static async baw() {} }", languageOptions: { parser: require(parser("typescript-parsers/decorator-with-static-class-methods")) } },

        // type keywords can be used as parameters in arrow functions
        { code: "symbol => 4;", languageOptions: { parser: require(parser("typescript-parsers/keyword-with-arrow-function")) } }
    ],

    invalid: [

        //----------------------------------------------------------------------
        // as
        //----------------------------------------------------------------------

        // import { a as b }
        {
            code: "import { \"a\"as b } from \"foo\"",
            output: "import { \"a\" as b } from \"foo\"",
            languageOptions: { ecmaVersion: 2022, sourceType: "module" },
            errors: expectedBefore("as")
        },
        {
            code: "import{ \"a\" as b }from\"foo\"",
            output: "import{ \"a\"as b }from\"foo\"",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 2022, sourceType: "module" },
            errors: unexpectedBefore("as")
        },
        {
            code: "import{ \"a\"as b }from\"foo\"",
            output: "import{ \"a\" as b }from\"foo\"",
            options: [override("as", BOTH)],
            languageOptions: { ecmaVersion: 2022, sourceType: "module" },
            errors: expectedBefore("as")
        },
        {
            code: "import { \"a\" as b } from \"foo\"",
            output: "import { \"a\"as b } from \"foo\"",
            options: [override("as", NEITHER)],
            languageOptions: { ecmaVersion: 2022, sourceType: "module" },
            errors: unexpectedBefore("as")
        },

        // export { a as b }
        {
            code: "let a; export { a as\"b\" };",
            output: "let a; export { a as \"b\" };",
            languageOptions: { ecmaVersion: 2022, sourceType: "module" },
            errors: expectedAfter("as")
        },
        {
            code: "export { \"a\"as b } from \"foo\";",
            output: "export { \"a\" as b } from \"foo\";",
            languageOptions: { ecmaVersion: 2022, sourceType: "module" },
            errors: expectedBefore("as")
        },
        {
            code: "export { \"a\"as\"b\" } from \"foo\";",
            output: "export { \"a\" as \"b\" } from \"foo\";",
            languageOptions: { ecmaVersion: 2022, sourceType: "module" },
            errors: expectedBeforeAndAfter("as")
        },
        {
            code: "let a; export{ a as \"b\" };",
            output: "let a; export{ a as\"b\" };",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 2022, sourceType: "module" },
            errors: unexpectedAfter("as")
        },
        {
            code: "export{ \"a\" as b }from\"foo\";",
            output: "export{ \"a\"as b }from\"foo\";",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 2022, sourceType: "module" },
            errors: unexpectedBefore("as")
        },
        {
            code: "export{ \"a\" as \"b\" }from\"foo\";",
            output: "export{ \"a\"as\"b\" }from\"foo\";",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 2022, sourceType: "module" },
            errors: unexpectedBeforeAndAfter("as")
        },
        {
            code: "let a; export{ a as\"b\" };",
            output: "let a; export{ a as \"b\" };",
            options: [override("as", BOTH)],
            languageOptions: { ecmaVersion: 2022, sourceType: "module" },
            errors: expectedAfter("as")
        },
        {
            code: "export{ \"a\"as b }from\"foo\";",
            output: "export{ \"a\" as b }from\"foo\";",
            options: [override("as", BOTH)],
            languageOptions: { ecmaVersion: 2022, sourceType: "module" },
            errors: expectedBefore("as")
        },
        {
            code: "export{ \"a\"as\"b\" }from\"foo\";",
            output: "export{ \"a\" as \"b\" }from\"foo\";",
            options: [override("as", BOTH)],
            languageOptions: { ecmaVersion: 2022, sourceType: "module" },
            errors: expectedBeforeAndAfter("as")
        },
        {
            code: "let a; export { a as \"b\" };",
            output: "let a; export { a as\"b\" };",
            options: [override("as", NEITHER)],
            languageOptions: { ecmaVersion: 2022, sourceType: "module" },
            errors: unexpectedAfter("as")
        },
        {
            code: "export { \"a\" as b } from \"foo\";",
            output: "export { \"a\"as b } from \"foo\";",
            options: [override("as", NEITHER)],
            languageOptions: { ecmaVersion: 2022, sourceType: "module" },
            errors: unexpectedBefore("as")
        },
        {
            code: "export { \"a\" as \"b\" } from \"foo\";",
            output: "export { \"a\"as\"b\" } from \"foo\";",
            options: [override("as", NEITHER)],
            languageOptions: { ecmaVersion: 2022, sourceType: "module" },
            errors: unexpectedBeforeAndAfter("as")
        },

        // import * as a
        {
            code: "import *as a from \"foo\"",
            output: "import * as a from \"foo\"",
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "expectedBefore",
                data: { value: "as" },
                line: 1,
                column: 9,
                endLine: 1,
                endColumn: 11
            }]
        },
        {
            code: "import* as a from\"foo\"",
            output: "import*as a from\"foo\"",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "unexpectedBefore",
                data: { value: "as" },
                line: 1,
                column: 8,
                endLine: 1,
                endColumn: 9
            }]
        },
        {
            code: "import*   as a from\"foo\"",
            output: "import*as a from\"foo\"",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "unexpectedBefore",
                data: { value: "as" },
                line: 1,
                column: 8,
                endLine: 1,
                endColumn: 11
            }]
        },
        {
            code: "import*as a from\"foo\"",
            output: "import* as a from\"foo\"",
            options: [override("as", BOTH)],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: expectedBefore("as")
        },
        {
            code: "import * as a from \"foo\"",
            output: "import *as a from \"foo\"",
            options: [override("as", NEITHER)],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: unexpectedBefore("as")
        },

        // export * as a
        {
            code: "export *as a from \"foo\"",
            output: "export * as a from \"foo\"",
            languageOptions: { ecmaVersion: 2020, sourceType: "module" },
            errors: expectedBefore("as")
        },
        {
            code: "export *as\"a\" from \"foo\"",
            output: "export * as \"a\" from \"foo\"",
            languageOptions: { ecmaVersion: 2022, sourceType: "module" },
            errors: expectedBeforeAndAfter("as")
        },
        {
            code: "export* as a from\"foo\"",
            output: "export*as a from\"foo\"",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 2020, sourceType: "module" },
            errors: unexpectedBefore("as")
        },
        {
            code: "export* as \"a\"from\"foo\"",
            output: "export*as\"a\"from\"foo\"",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 2022, sourceType: "module" },
            errors: unexpectedBeforeAndAfter("as")
        },
        {
            code: "export*as a from\"foo\"",
            output: "export* as a from\"foo\"",
            options: [override("as", BOTH)],
            languageOptions: { ecmaVersion: 2020, sourceType: "module" },
            errors: expectedBefore("as")
        },
        {
            code: "export*as\"a\"from\"foo\"",
            output: "export* as \"a\"from\"foo\"",
            options: [override("as", BOTH)],
            languageOptions: { ecmaVersion: 2022, sourceType: "module" },
            errors: expectedBeforeAndAfter("as")
        },
        {
            code: "export * as a from \"foo\"",
            output: "export *as a from \"foo\"",
            options: [override("as", NEITHER)],
            languageOptions: { ecmaVersion: 2020, sourceType: "module" },
            errors: unexpectedBefore("as")
        },
        {
            code: "export * as \"a\" from \"foo\"",
            output: "export *as\"a\" from \"foo\"",
            options: [override("as", NEITHER)],
            languageOptions: { ecmaVersion: 2022, sourceType: "module" },
            errors: unexpectedBeforeAndAfter("as")
        },

        //----------------------------------------------------------------------
        // async
        //----------------------------------------------------------------------

        {
            code: "{}async function foo() {}",
            output: "{} async function foo() {}",
            languageOptions: { ecmaVersion: 8 },
            errors: expectedBefore("async")
        },
        {
            code: "{} async function foo() {}",
            output: "{}async function foo() {}",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 8 },
            errors: unexpectedBefore("async")
        },
        {
            code: "{}async function foo() {}",
            output: "{} async function foo() {}",
            options: [override("async", BOTH)],
            languageOptions: { ecmaVersion: 8 },
            errors: expectedBefore("async")
        },
        {
            code: "{} async function foo() {}",
            output: "{}async function foo() {}",
            options: [override("async", NEITHER)],
            languageOptions: { ecmaVersion: 8 },
            errors: unexpectedBefore("async")
        },
        {
            code: "{}async () => {}",
            output: "{} async () => {}",
            languageOptions: { ecmaVersion: 8 },
            errors: expectedBefore("async")
        },
        {
            code: "{} async () => {}",
            output: "{}async () => {}",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 8 },
            errors: unexpectedBefore("async")
        },
        {
            code: "{}async () => {}",
            output: "{} async () => {}",
            options: [override("async", BOTH)],
            languageOptions: { ecmaVersion: 8 },
            errors: expectedBefore("async")
        },
        {
            code: "{} async () => {}",
            output: "{}async () => {}",
            options: [override("async", NEITHER)],
            languageOptions: { ecmaVersion: 8 },
            errors: unexpectedBefore("async")
        },
        {
            code: "({async[b]() {}})",
            output: "({async [b]() {}})",
            languageOptions: { ecmaVersion: 8 },
            errors: expectedAfter("async")
        },
        {
            code: "({async [b]() {}})",
            output: "({async[b]() {}})",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 8 },
            errors: unexpectedAfter("async")
        },
        {
            code: "({async[b]() {}})",
            output: "({async [b]() {}})",
            options: [override("async", BOTH)],
            languageOptions: { ecmaVersion: 8 },
            errors: expectedAfter("async")
        },
        {
            code: "({async [b]() {}})",
            output: "({async[b]() {}})",
            options: [override("async", NEITHER)],
            languageOptions: { ecmaVersion: 8 },
            errors: unexpectedAfter("async")
        },
        {
            code: "class A {a(){}async[b]() {}}",
            output: "class A {a(){} async [b]() {}}",
            languageOptions: { ecmaVersion: 8 },
            errors: expectedBeforeAndAfter("async")
        },
        {
            code: "class A {a(){} async [b]() {}}",
            output: "class A {a(){}async[b]() {}}",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 8 },
            errors: unexpectedBeforeAndAfter("async")
        },
        {
            code: "class A {a(){}async[b]() {}}",
            output: "class A {a(){} async [b]() {}}",
            options: [override("async", BOTH)],
            languageOptions: { ecmaVersion: 8 },
            errors: expectedBeforeAndAfter("async")
        },
        {
            code: "class A {a(){} async [b]() {}}",
            output: "class A {a(){}async[b]() {}}",
            options: [override("async", NEITHER)],
            languageOptions: { ecmaVersion: 8 },
            errors: unexpectedBeforeAndAfter("async")
        },

        //----------------------------------------------------------------------
        // await
        //----------------------------------------------------------------------

        {
            code: "async function wrap() { {}await a }",
            output: "async function wrap() { {} await a }",
            languageOptions: { ecmaVersion: 8 },
            errors: expectedBefore("await")
        },
        {
            code: "async function wrap() { {} await a }",
            output: "async function wrap() { {}await a }",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 8 },
            errors: unexpectedBefore("await")
        },
        {
            code: "async function wrap() { {}await a }",
            output: "async function wrap() { {} await a }",
            options: [override("await", BOTH)],
            languageOptions: { ecmaVersion: 8 },
            errors: expectedBefore("await")
        },
        {
            code: "async function wrap() { {} await a }",
            output: "async function wrap() { {}await a }",
            options: [override("await", NEITHER)],
            languageOptions: { ecmaVersion: 8 },
            errors: unexpectedBefore("await")
        },

        {
            code: "async function wrap() { for await(x of xs); }",
            output: "async function wrap() { for await (x of xs); }",
            languageOptions: { ecmaVersion: 2018 },
            errors: expectedAfter("await")
        },
        {
            code: "async function wrap() { for await (x of xs); }",
            output: "async function wrap() { for await(x of xs); }",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 2018 },
            errors: unexpectedAfter("await")
        },
        {
            code: "async function wrap() { for await(x of xs); }",
            output: "async function wrap() { for await (x of xs); }",
            options: [override("await", BOTH)],
            languageOptions: { ecmaVersion: 2018 },
            errors: expectedAfter("await")
        },
        {
            code: "async function wrap() { for await (x of xs); }",
            output: "async function wrap() { for await(x of xs); }",
            options: [override("await", NEITHER)],
            languageOptions: { ecmaVersion: 2018 },
            errors: unexpectedAfter("await")
        },

        //----------------------------------------------------------------------
        // break
        //----------------------------------------------------------------------

        {
            code: "A: for (;;) { {}break A; }",
            output: "A: for (;;) { {} break A; }",
            errors: expectedBefore("break")
        },
        {
            code: "A: for(;;) { {} break A; }",
            output: "A: for(;;) { {}break A; }",
            options: [NEITHER],
            errors: unexpectedBefore("break")
        },
        {
            code: "A: for(;;) { {}break A; }",
            output: "A: for(;;) { {} break A; }",
            options: [override("break", BOTH)],
            errors: expectedBefore("break")
        },
        {
            code: "A: for (;;) { {} break A; }",
            output: "A: for (;;) { {}break A; }",
            options: [override("break", NEITHER)],
            errors: unexpectedBefore("break")
        },

        //----------------------------------------------------------------------
        // case
        //----------------------------------------------------------------------

        {
            code: "switch (a) { case 0: {}case+1: }",
            output: "switch (a) { case 0: {} case +1: }",
            errors: expectedBeforeAndAfter("case")
        },
        {
            code: "switch (a) { case 0: {}case(1): }",
            output: "switch (a) { case 0: {} case (1): }",
            errors: expectedBeforeAndAfter("case")
        },
        {
            code: "switch(a) { case 0: {} case +1: }",
            output: "switch(a) { case 0: {}case+1: }",
            options: [NEITHER],
            errors: unexpectedBeforeAndAfter("case")
        },
        {
            code: "switch(a) { case 0: {} case (1): }",
            output: "switch(a) { case 0: {}case(1): }",
            options: [NEITHER],
            errors: unexpectedBeforeAndAfter("case")
        },
        {
            code: "switch(a) { case 0: {}case+1: }",
            output: "switch(a) { case 0: {} case +1: }",
            options: [override("case", BOTH)],
            errors: expectedBeforeAndAfter("case")
        },
        {
            code: "switch (a) { case 0: {} case +1: }",
            output: "switch (a) { case 0: {}case+1: }",
            options: [override("case", NEITHER)],
            errors: unexpectedBeforeAndAfter("case")
        },

        //----------------------------------------------------------------------
        // catch
        //----------------------------------------------------------------------

        {
            code: "try {}catch(e) {}",
            output: "try {} catch (e) {}",
            errors: expectedBeforeAndAfter("catch")
        },
        {
            code: "try{} catch (e) {}",
            output: "try{}catch(e) {}",
            options: [NEITHER],
            errors: unexpectedBeforeAndAfter("catch")
        },
        {
            code: "try{}catch(e) {}",
            output: "try{} catch (e) {}",
            options: [override("catch", BOTH)],
            errors: expectedBeforeAndAfter("catch")
        },
        {
            code: "try {} catch (e) {}",
            output: "try {}catch(e) {}",
            options: [override("catch", NEITHER)],
            errors: unexpectedBeforeAndAfter("catch")
        },

        //----------------------------------------------------------------------
        // class
        //----------------------------------------------------------------------

        {
            code: "{}class Bar {}",
            output: "{} class Bar {}",
            languageOptions: { ecmaVersion: 6 },
            errors: expectedBefore("class")
        },
        {
            code: "(class{})",
            output: "(class {})",
            languageOptions: { ecmaVersion: 6 },
            errors: expectedAfter("class")
        },
        {
            code: "{} class Bar {}",
            output: "{}class Bar {}",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 6 },
            errors: unexpectedBefore("class")
        },
        {
            code: "(class {})",
            output: "(class{})",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 6 },
            errors: unexpectedAfter("class")
        },
        {
            code: "{}class Bar {}",
            output: "{} class Bar {}",
            options: [override("class", BOTH)],
            languageOptions: { ecmaVersion: 6 },
            errors: expectedBefore("class")
        },
        {
            code: "{} class Bar {}",
            output: "{}class Bar {}",
            options: [override("class", NEITHER)],
            languageOptions: { ecmaVersion: 6 },
            errors: unexpectedBefore("class")
        },

        //----------------------------------------------------------------------
        // const
        //----------------------------------------------------------------------

        {
            code: "{}const[a] = b",
            output: "{} const [a] = b",
            languageOptions: { ecmaVersion: 6 },
            errors: expectedBeforeAndAfter("const")
        },
        {
            code: "{}const{a} = b",
            output: "{} const {a} = b",
            languageOptions: { ecmaVersion: 6 },
            errors: expectedBeforeAndAfter("const")
        },
        {
            code: "{} const [a] = b",
            output: "{}const[a] = b",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 6 },
            errors: unexpectedBeforeAndAfter("const")
        },
        {
            code: "{} const {a} = b",
            output: "{}const{a} = b",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 6 },
            errors: unexpectedBeforeAndAfter("const")
        },
        {
            code: "{}const[a] = b",
            output: "{} const [a] = b",
            options: [override("const", BOTH)],
            languageOptions: { ecmaVersion: 6 },
            errors: expectedBeforeAndAfter("const")
        },
        {
            code: "{}const{a} = b",
            output: "{} const {a} = b",
            options: [override("const", BOTH)],
            languageOptions: { ecmaVersion: 6 },
            errors: expectedBeforeAndAfter("const")
        },
        {
            code: "{} const [a] = b",
            output: "{}const[a] = b",
            options: [override("const", NEITHER)],
            languageOptions: { ecmaVersion: 6 },
            errors: unexpectedBeforeAndAfter("const")
        },
        {
            code: "{} const {a} = b",
            output: "{}const{a} = b",
            options: [override("const", NEITHER)],
            languageOptions: { ecmaVersion: 6 },
            errors: unexpectedBeforeAndAfter("const")
        },

        //----------------------------------------------------------------------
        // continue
        //----------------------------------------------------------------------

        {
            code: "A: for (;;) { {}continue A; }",
            output: "A: for (;;) { {} continue A; }",
            errors: expectedBefore("continue")
        },
        {
            code: "A: for(;;) { {} continue A; }",
            output: "A: for(;;) { {}continue A; }",
            options: [NEITHER],
            errors: unexpectedBefore("continue")
        },
        {
            code: "A: for(;;) { {}continue A; }",
            output: "A: for(;;) { {} continue A; }",
            options: [override("continue", BOTH)],
            errors: expectedBefore("continue")
        },
        {
            code: "A: for (;;) { {} continue A; }",
            output: "A: for (;;) { {}continue A; }",
            options: [override("continue", NEITHER)],
            errors: unexpectedBefore("continue")
        },

        //----------------------------------------------------------------------
        // debugger
        //----------------------------------------------------------------------

        {
            code: "{}debugger",
            output: "{} debugger",
            errors: expectedBefore("debugger")
        },
        {
            code: "{} debugger",
            output: "{}debugger",
            options: [NEITHER],
            errors: unexpectedBefore("debugger")
        },
        {
            code: "{}debugger",
            output: "{} debugger",
            options: [override("debugger", BOTH)],
            errors: expectedBefore("debugger")
        },
        {
            code: "{} debugger",
            output: "{}debugger",
            options: [override("debugger", NEITHER)],
            errors: unexpectedBefore("debugger")
        },

        //----------------------------------------------------------------------
        // default
        //----------------------------------------------------------------------

        {
            code: "switch (a) { case 0: {}default: }",
            output: "switch (a) { case 0: {} default: }",
            errors: expectedBefore("default")
        },
        {
            code: "switch(a) { case 0: {} default: }",
            output: "switch(a) { case 0: {}default: }",
            options: [NEITHER],
            errors: unexpectedBefore("default")
        },
        {
            code: "switch(a) { case 0: {}default: }",
            output: "switch(a) { case 0: {} default: }",
            options: [override("default", BOTH)],
            errors: expectedBefore("default")
        },
        {
            code: "switch (a) { case 0: {} default: }",
            output: "switch (a) { case 0: {}default: }",
            options: [override("default", NEITHER)],
            errors: unexpectedBefore("default")
        },

        //----------------------------------------------------------------------
        // delete
        //----------------------------------------------------------------------

        {
            code: "{}delete foo.a",
            output: "{} delete foo.a",
            errors: expectedBefore("delete")
        },
        {
            code: "{} delete foo.a",
            output: "{}delete foo.a",
            options: [NEITHER],
            errors: unexpectedBefore("delete")
        },
        {
            code: "{}delete foo.a",
            output: "{} delete foo.a",
            options: [override("delete", BOTH)],
            errors: expectedBefore("delete")
        },
        {
            code: "{} delete foo.a",
            output: "{}delete foo.a",
            options: [override("delete", NEITHER)],
            errors: unexpectedBefore("delete")
        },

        //----------------------------------------------------------------------
        // do
        //----------------------------------------------------------------------

        {
            code: "{}do{} while (true)",
            output: "{} do {} while (true)",
            errors: expectedBeforeAndAfter("do")
        },
        {
            code: "{} do {}while(true)",
            output: "{}do{}while(true)",
            options: [NEITHER],
            errors: unexpectedBeforeAndAfter("do")
        },
        {
            code: "{}do{}while(true)",
            output: "{} do {}while(true)",
            options: [override("do", BOTH)],
            errors: expectedBeforeAndAfter("do")
        },
        {
            code: "{} do {} while (true)",
            output: "{}do{} while (true)",
            options: [override("do", NEITHER)],
            errors: unexpectedBeforeAndAfter("do")
        },

        //----------------------------------------------------------------------
        // else
        //----------------------------------------------------------------------

        {
            code: "if (a) {}else{}",
            output: "if (a) {} else {}",
            errors: expectedBeforeAndAfter("else")
        },
        {
            code: "if (a) {}else if (b) {}",
            output: "if (a) {} else if (b) {}",
            errors: expectedBefore("else")
        },
        {
            code: "if (a) {}else(0)",
            output: "if (a) {} else (0)",
            errors: expectedBeforeAndAfter("else")
        },
        {
            code: "if (a) {}else[]",
            output: "if (a) {} else []",
            errors: expectedBeforeAndAfter("else")
        },
        {
            code: "if (a) {}else+1",
            output: "if (a) {} else +1",
            errors: expectedBeforeAndAfter("else")
        },
        {
            code: "if (a) {}else\"a\"",
            output: "if (a) {} else \"a\"",
            errors: expectedBeforeAndAfter("else")
        },
        {
            code: "if(a){} else {}",
            output: "if(a){}else{}",
            options: [NEITHER],
            errors: unexpectedBeforeAndAfter("else")
        },
        {
            code: "if(a){} else if(b) {}",
            output: "if(a){}else if(b) {}",
            options: [NEITHER],
            errors: unexpectedBefore("else")
        },
        {
            code: "if(a) {} else (0)",
            output: "if(a) {}else(0)",
            options: [NEITHER],
            errors: unexpectedBeforeAndAfter("else")
        },
        {
            code: "if(a) {} else []",
            output: "if(a) {}else[]",
            options: [NEITHER],
            errors: unexpectedBeforeAndAfter("else")
        },
        {
            code: "if(a) {} else +1",
            output: "if(a) {}else+1",
            options: [NEITHER],
            errors: unexpectedBeforeAndAfter("else")
        },
        {
            code: "if(a) {} else \"a\"",
            output: "if(a) {}else\"a\"",
            options: [NEITHER],
            errors: unexpectedBeforeAndAfter("else")
        },
        {
            code: "if(a) {}else{}",
            output: "if(a) {} else {}",
            options: [override("else", BOTH)],
            errors: expectedBeforeAndAfter("else")
        },
        {
            code: "if (a) {} else {}",
            output: "if (a) {}else{}",
            options: [override("else", NEITHER)],
            errors: unexpectedBeforeAndAfter("else")
        },

        {
            code: "if (a) {}else {}",
            output: "if (a) {} else {}",
            errors: expectedBefore("else")
        },
        {
            code: "if (a) {} else{}",
            output: "if (a) {} else {}",
            errors: expectedAfter("else")
        },
        {
            code: "if(a) {} else{}",
            output: "if(a) {}else{}",
            options: [NEITHER],
            errors: unexpectedBefore("else")
        },
        {
            code: "if(a) {}else {}",
            output: "if(a) {}else{}",
            options: [NEITHER],
            errors: unexpectedAfter("else")
        },

        //----------------------------------------------------------------------
        // export
        //----------------------------------------------------------------------

        {
            code: "var a = 0; {}export{a}",
            output: "var a = 0; {} export {a}",
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: expectedBeforeAndAfter("export")
        },
        {
            code: "var a = 0; {}export default a",
            output: "var a = 0; {} export default a",
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: expectedBefore("export")
        },
        {
            code: "var a = 0; export default{a}",
            output: "var a = 0; export default {a}",
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: expectedAfter("default")
        },
        {
            code: "{}export* from \"a\"",
            output: "{} export * from \"a\"",
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: expectedBeforeAndAfter("export")
        },
        {
            code: "var a = 0; {} export {a}",
            output: "var a = 0; {}export{a}",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: unexpectedBeforeAndAfter("export")
        },
        {
            code: "var a = 0; {}export{a}",
            output: "var a = 0; {} export {a}",
            options: [override("export", BOTH)],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: expectedBeforeAndAfter("export")
        },
        {
            code: "var a = 0; {} export {a}",
            output: "var a = 0; {}export{a}",
            options: [override("export", NEITHER)],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: unexpectedBeforeAndAfter("export")
        },

        //----------------------------------------------------------------------
        // extends
        //----------------------------------------------------------------------

        {
            code: "class Bar extends[] {}",
            output: "class Bar extends [] {}",
            languageOptions: { ecmaVersion: 6 },
            errors: expectedAfter("extends")
        },
        {
            code: "(class extends[] {})",
            output: "(class extends [] {})",
            languageOptions: { ecmaVersion: 6 },
            errors: expectedAfter("extends")
        },
        {
            code: "class Bar extends [] {}",
            output: "class Bar extends[] {}",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 6 },
            errors: unexpectedAfter("extends")
        },
        {
            code: "(class extends [] {})",
            output: "(class extends[] {})",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 6 },
            errors: unexpectedAfter("extends")
        },
        {
            code: "class Bar extends[] {}",
            output: "class Bar extends [] {}",
            options: [override("extends", BOTH)],
            languageOptions: { ecmaVersion: 6 },
            errors: expectedAfter("extends")
        },
        {
            code: "class Bar extends [] {}",
            output: "class Bar extends[] {}",
            options: [override("extends", NEITHER)],
            languageOptions: { ecmaVersion: 6 },
            errors: unexpectedAfter("extends")
        },
        {
            code: "class Bar extends`}` {}",
            output: "class Bar extends `}` {}",
            languageOptions: { ecmaVersion: 6 },
            errors: expectedAfter("extends")
        },

        //----------------------------------------------------------------------
        // finally
        //----------------------------------------------------------------------

        {
            code: "try {}finally{}",
            output: "try {} finally {}",
            errors: expectedBeforeAndAfter("finally")
        },
        {
            code: "try{} finally {}",
            output: "try{}finally{}",
            options: [NEITHER],
            errors: unexpectedBeforeAndAfter("finally")
        },
        {
            code: "try{}finally{}",
            output: "try{} finally {}",
            options: [override("finally", BOTH)],
            errors: expectedBeforeAndAfter("finally")
        },
        {
            code: "try {} finally {}",
            output: "try {}finally{}",
            options: [override("finally", NEITHER)],
            errors: unexpectedBeforeAndAfter("finally")
        },

        //----------------------------------------------------------------------
        // for
        //----------------------------------------------------------------------

        {
            code: "{}for(;;) {}",
            output: "{} for (;;) {}",
            errors: expectedBeforeAndAfter("for")
        },
        {
            code: "{}for(var foo in obj) {}",
            output: "{} for (var foo in obj) {}",
            errors: expectedBeforeAndAfter("for")
        },
        {
            code: "{}for(var foo of list) {}",
            output: "{} for (var foo of list) {}",
            languageOptions: { ecmaVersion: 6 },
            errors: expectedBeforeAndAfter("for")
        },
        {
            code: "{} for (;;) {}",
            output: "{}for(;;) {}",
            options: [NEITHER],
            errors: unexpectedBeforeAndAfter("for")
        },
        {
            code: "{} for (var foo in obj) {}",
            output: "{}for(var foo in obj) {}",
            options: [NEITHER],
            errors: unexpectedBeforeAndAfter("for")
        },
        {
            code: "{} for (var foo of list) {}",
            output: "{}for(var foo of list) {}",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 6 },
            errors: unexpectedBeforeAndAfter("for")
        },
        {
            code: "{}for(;;) {}",
            output: "{} for (;;) {}",
            options: [override("for", BOTH)],
            errors: expectedBeforeAndAfter("for")
        },
        {
            code: "{}for(var foo in obj) {}",
            output: "{} for (var foo in obj) {}",
            options: [override("for", BOTH)],
            errors: expectedBeforeAndAfter("for")
        },
        {
            code: "{}for(var foo of list) {}",
            output: "{} for (var foo of list) {}",
            options: [override("for", BOTH)],
            languageOptions: { ecmaVersion: 6 },
            errors: expectedBeforeAndAfter("for")
        },
        {
            code: "{} for (;;) {}",
            output: "{}for(;;) {}",
            options: [override("for", NEITHER)],
            errors: unexpectedBeforeAndAfter("for")
        },
        {
            code: "{} for (var foo in obj) {}",
            output: "{}for(var foo in obj) {}",
            options: [override("for", NEITHER)],
            errors: unexpectedBeforeAndAfter("for")
        },
        {
            code: "{} for (var foo of list) {}",
            output: "{}for(var foo of list) {}",
            options: [override("for", NEITHER)],
            languageOptions: { ecmaVersion: 6 },
            errors: unexpectedBeforeAndAfter("for")
        },

        //----------------------------------------------------------------------
        // from
        //----------------------------------------------------------------------

        {
            code: "import {foo}from\"foo\"",
            output: "import {foo} from \"foo\"",
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: expectedBeforeAndAfter("from")
        },
        {
            code: "export {foo}from\"foo\"",
            output: "export {foo} from \"foo\"",
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: expectedBeforeAndAfter("from")
        },
        {
            code: "export *from\"foo\"",
            output: "export * from \"foo\"",
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: expectedBeforeAndAfter("from")
        },
        {
            code: "export * as \"a\"from\"foo\"",
            output: "export * as \"a\" from \"foo\"",
            languageOptions: { ecmaVersion: 2022, sourceType: "module" },
            errors: expectedBeforeAndAfter("from")
        },
        {
            code: "import{foo} from \"foo\"",
            output: "import{foo}from\"foo\"",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: unexpectedBeforeAndAfter("from")
        },
        {
            code: "export{foo} from \"foo\"",
            output: "export{foo}from\"foo\"",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: unexpectedBeforeAndAfter("from")
        },
        {
            code: "export* from \"foo\"",
            output: "export*from\"foo\"",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: unexpectedBeforeAndAfter("from")
        },
        {
            code: "export*as x from \"foo\"",
            output: "export*as x from\"foo\"",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 2020, sourceType: "module" },
            errors: unexpectedAfter("from")
        },
        {
            code: "export*as\"x\" from \"foo\"",
            output: "export*as\"x\"from\"foo\"",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 2022, sourceType: "module" },
            errors: unexpectedBeforeAndAfter("from")
        },
        {
            code: "import{foo}from\"foo\"",
            output: "import{foo} from \"foo\"",
            options: [override("from", BOTH)],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: expectedBeforeAndAfter("from")
        },
        {
            code: "export{foo}from\"foo\"",
            output: "export{foo} from \"foo\"",
            options: [override("from", BOTH)],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: expectedBeforeAndAfter("from")
        },
        {
            code: "export*from\"foo\"",
            output: "export* from \"foo\"",
            options: [override("from", BOTH)],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: expectedBeforeAndAfter("from")
        },
        {
            code: "export*as\"x\"from\"foo\"",
            output: "export*as\"x\" from \"foo\"",
            options: [override("from", BOTH)],
            languageOptions: { ecmaVersion: 2022, sourceType: "module" },
            errors: expectedBeforeAndAfter("from")
        },
        {
            code: "import {foo} from \"foo\"",
            output: "import {foo}from\"foo\"",
            options: [override("from", NEITHER)],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: unexpectedBeforeAndAfter("from")
        },
        {
            code: "export {foo} from \"foo\"",
            output: "export {foo}from\"foo\"",
            options: [override("from", NEITHER)],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: unexpectedBeforeAndAfter("from")
        },
        {
            code: "export * from \"foo\"",
            output: "export *from\"foo\"",
            options: [override("from", NEITHER)],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: unexpectedBeforeAndAfter("from")
        },
        {
            code: "export * as x from \"foo\"",
            output: "export * as x from\"foo\"",
            options: [override("from", NEITHER)],
            languageOptions: { ecmaVersion: 2020, sourceType: "module" },
            errors: unexpectedAfter("from")
        },
        {
            code: "export * as \"x\" from \"foo\"",
            output: "export * as \"x\"from\"foo\"",
            options: [override("from", NEITHER)],
            languageOptions: { ecmaVersion: 2022, sourceType: "module" },
            errors: unexpectedBeforeAndAfter("from")
        },

        //----------------------------------------------------------------------
        // function
        //----------------------------------------------------------------------

        {
            code: "{}function foo() {}",
            output: "{} function foo() {}",
            errors: expectedBefore("function")
        },
        {
            code: "{} function foo() {}",
            output: "{}function foo() {}",
            options: [NEITHER],
            errors: unexpectedBefore("function")
        },
        {
            code: "{}function foo() {}",
            output: "{} function foo() {}",
            options: [override("function", BOTH)],
            errors: expectedBefore("function")
        },
        {
            code: "{} function foo() {}",
            output: "{}function foo() {}",
            options: [override("function", NEITHER)],
            errors: unexpectedBefore("function")
        },

        //----------------------------------------------------------------------
        // get
        //----------------------------------------------------------------------

        {
            code: "({ get[b]() {} })",
            output: "({ get [b]() {} })",
            languageOptions: { ecmaVersion: 6 },
            errors: expectedAfter("get")
        },
        {
            code: "class A { a() {}get[b]() {} }",
            output: "class A { a() {} get [b]() {} }",
            languageOptions: { ecmaVersion: 6 },
            errors: expectedBeforeAndAfter("get")
        },
        {
            code: "class A { a() {} static get[b]() {} }",
            output: "class A { a() {} static get [b]() {} }",
            languageOptions: { ecmaVersion: 6 },
            errors: expectedAfter("get")
        },
        {
            code: "({ get [b]() {} })",
            output: "({ get[b]() {} })",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 6 },
            errors: unexpectedAfter("get")
        },
        {
            code: "class A { a() {} get [b]() {} }",
            output: "class A { a() {}get[b]() {} }",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 6 },
            errors: unexpectedBeforeAndAfter("get")
        },
        {
            code: "class A { a() {}static get [b]() {} }",
            output: "class A { a() {}static get[b]() {} }",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 6 },
            errors: unexpectedAfter("get")
        },
        {
            code: "({ get[b]() {} })",
            output: "({ get [b]() {} })",
            options: [override("get", BOTH)],
            languageOptions: { ecmaVersion: 6 },
            errors: expectedAfter("get")
        },
        {
            code: "class A { a() {}get[b]() {} }",
            output: "class A { a() {} get [b]() {} }",
            options: [override("get", BOTH)],
            languageOptions: { ecmaVersion: 6 },
            errors: expectedBeforeAndAfter("get")
        },
        {
            code: "({ get [b]() {} })",
            output: "({ get[b]() {} })",
            options: [override("get", NEITHER)],
            languageOptions: { ecmaVersion: 6 },
            errors: unexpectedAfter("get")
        },
        {
            code: "class A { a() {} get [b]() {} }",
            output: "class A { a() {}get[b]() {} }",
            options: [override("get", NEITHER)],
            languageOptions: { ecmaVersion: 6 },
            errors: unexpectedBeforeAndAfter("get")
        },
        {
            code: "class A { a;get#b() {} }",
            output: "class A { a;get #b() {} }",
            languageOptions: { ecmaVersion: 2022 },
            errors: expectedAfter("get")
        },
        {
            code: "class A { a; get #b() {} }",
            output: "class A { a; get#b() {} }",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 2022 },
            errors: unexpectedAfter("get")
        },

        //----------------------------------------------------------------------
        // if
        //----------------------------------------------------------------------

        {
            code: "{}if(a) {}",
            output: "{} if (a) {}",
            errors: expectedBeforeAndAfter("if")
        },
        {
            code: "if (a) {} else if(b) {}",
            output: "if (a) {} else if (b) {}",
            errors: expectedAfter("if")
        },
        {
            code: "{} if (a) {}",
            output: "{}if(a) {}",
            options: [NEITHER],
            errors: unexpectedBeforeAndAfter("if")
        },
        {
            code: "if(a) {}else if (b) {}",
            output: "if(a) {}else if(b) {}",
            options: [NEITHER],
            errors: unexpectedAfter("if")
        },
        {
            code: "{}if(a) {}",
            output: "{} if (a) {}",
            options: [override("if", BOTH)],
            errors: expectedBeforeAndAfter("if")
        },
        {
            code: "if (a) {}else if(b) {}",
            output: "if (a) {}else if (b) {}",
            options: [override("if", BOTH)],
            errors: expectedAfter("if")
        },
        {
            code: "{} if (a) {}",
            output: "{}if(a) {}",
            options: [override("if", NEITHER)],
            errors: unexpectedBeforeAndAfter("if")
        },
        {
            code: "if(a) {} else if (b) {}",
            output: "if(a) {} else if(b) {}",
            options: [override("if", NEITHER)],
            errors: unexpectedAfter("if")
        },

        //----------------------------------------------------------------------
        // import
        //----------------------------------------------------------------------

        {
            code: "import* as a from \"foo\"",
            output: "import * as a from \"foo\"",
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "expectedAfter",
                data: { value: "import" },
                line: 1,
                column: 1,
                endLine: 1,
                endColumn: 7
            }]
        },
        {
            code: "import *as a from\"foo\"",
            output: "import*as a from\"foo\"",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "unexpectedAfter",
                data: { value: "import" },
                line: 1,
                column: 7,
                endLine: 1,
                endColumn: 8
            }]
        },
        {
            code: "import   *as a from\"foo\"",
            output: "import*as a from\"foo\"",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "unexpectedAfter",
                data: { value: "import" },
                line: 1,
                column: 7,
                endLine: 1,
                endColumn: 10
            }]
        },
        {
            code: "{}import{a} from \"foo\"",
            output: "{} import {a} from \"foo\"",
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: expectedBeforeAndAfter("import")
        },
        {
            code: "{}import a from \"foo\"",
            output: "{} import a from \"foo\"",
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: expectedBefore("import")
        },
        {
            code: "{}import* as a from \"a\"",
            output: "{} import * as a from \"a\"",
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: expectedBeforeAndAfter("import")
        },
        {
            code: "{} import {a}from\"foo\"",
            output: "{}import{a}from\"foo\"",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: unexpectedBeforeAndAfter("import")
        },
        {
            code: "{} import *as a from\"foo\"",
            output: "{}import*as a from\"foo\"",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: unexpectedBeforeAndAfter("import")
        },
        {
            code: "{}import{a}from\"foo\"",
            output: "{} import {a}from\"foo\"",
            options: [override("import", BOTH)],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: expectedBeforeAndAfter("import")
        },
        {
            code: "{}import*as a from\"foo\"",
            output: "{} import *as a from\"foo\"",
            options: [override("import", BOTH)],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: expectedBeforeAndAfter("import")
        },
        {
            code: "{} import {a} from \"foo\"",
            output: "{}import{a} from \"foo\"",
            options: [override("import", NEITHER)],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: unexpectedBeforeAndAfter("import")
        },
        {
            code: "{} import * as a from \"foo\"",
            output: "{}import* as a from \"foo\"",
            options: [override("import", NEITHER)],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: unexpectedBeforeAndAfter("import")
        },

        //----------------------------------------------------------------------
        // in
        //----------------------------------------------------------------------

        {
            code: "for ([foo]in{foo: 0}) {}",
            output: "for ([foo] in {foo: 0}) {}",
            languageOptions: { ecmaVersion: 6 },
            errors: expectedBeforeAndAfter("in")
        },
        {
            code: "for([foo] in {foo: 0}) {}",
            output: "for([foo]in{foo: 0}) {}",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 6 },
            errors: unexpectedBeforeAndAfter("in")
        },
        {
            code: "for([foo]in{foo: 0}) {}",
            output: "for([foo] in {foo: 0}) {}",
            options: [override("in", BOTH)],
            languageOptions: { ecmaVersion: 6 },
            errors: expectedBeforeAndAfter("in")
        },
        {
            code: "for ([foo] in {foo: 0}) {}",
            output: "for ([foo]in{foo: 0}) {}",
            options: [override("in", NEITHER)],
            languageOptions: { ecmaVersion: 6 },
            errors: unexpectedBeforeAndAfter("in")
        },

        //----------------------------------------------------------------------
        // instanceof
        //----------------------------------------------------------------------

        // ignores

        //----------------------------------------------------------------------
        // let
        //----------------------------------------------------------------------

        {
            code: "{}let[a] = b",
            output: "{} let [a] = b",
            languageOptions: { ecmaVersion: 6 },
            errors: expectedBeforeAndAfter("let")
        },
        {
            code: "{} let [a] = b",
            output: "{}let[a] = b",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 6 },
            errors: unexpectedBeforeAndAfter("let")
        },
        {
            code: "{}let[a] = b",
            output: "{} let [a] = b",
            options: [override("let", BOTH)],
            languageOptions: { ecmaVersion: 6 },
            errors: expectedBeforeAndAfter("let")
        },
        {
            code: "{} let [a] = b",
            output: "{}let[a] = b",
            options: [override("let", NEITHER)],
            languageOptions: { ecmaVersion: 6 },
            errors: unexpectedBeforeAndAfter("let")
        },

        //----------------------------------------------------------------------
        // new
        //----------------------------------------------------------------------

        {
            code: "{}new foo()",
            output: "{} new foo()",
            errors: expectedBefore("new")
        },
        {
            code: "{} new foo()",
            output: "{}new foo()",
            options: [NEITHER],
            errors: unexpectedBefore("new")
        },
        {
            code: "{}new foo()",
            output: "{} new foo()",
            options: [override("new", BOTH)],
            errors: expectedBefore("new")
        },
        {
            code: "{} new foo()",
            output: "{}new foo()",
            options: [override("new", NEITHER)],
            errors: unexpectedBefore("new")
        },

        //----------------------------------------------------------------------
        // of
        //----------------------------------------------------------------------

        {
            code: "for ([foo]of{foo: 0}) {}",
            output: "for ([foo] of {foo: 0}) {}",
            languageOptions: { ecmaVersion: 6 },
            errors: expectedBeforeAndAfter("of")
        },
        {
            code: "for([foo] of {foo: 0}) {}",
            output: "for([foo]of{foo: 0}) {}",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 6 },
            errors: unexpectedBeforeAndAfter("of")
        },
        {
            code: "for([foo]of{foo: 0}) {}",
            output: "for([foo] of {foo: 0}) {}",
            options: [override("of", BOTH)],
            languageOptions: { ecmaVersion: 6 },
            errors: expectedBeforeAndAfter("of")
        },
        {
            code: "for ([foo] of {foo: 0}) {}",
            output: "for ([foo]of{foo: 0}) {}",
            options: [override("of", NEITHER)],
            languageOptions: { ecmaVersion: 6 },
            errors: unexpectedBeforeAndAfter("of")
        },

        //----------------------------------------------------------------------
        // return
        //----------------------------------------------------------------------

        {
            code: "function foo() { {}return+a }",
            output: "function foo() { {} return +a }",
            errors: expectedBeforeAndAfter("return")
        },
        {
            code: "function foo() { return<p/>; }",
            output: "function foo() { return <p/>; }",
            languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
            errors: expectedAfter("return")
        },
        {
            code: "function foo() { {} return +a }",
            output: "function foo() { {}return+a }",
            options: [NEITHER],
            errors: unexpectedBeforeAndAfter("return")
        },
        {
            code: "function foo() { return <p/>; }",
            output: "function foo() { return<p/>; }",
            options: [{ after: false }],
            languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
            errors: unexpectedAfter("return")
        },
        {
            code: "function foo() { {}return+a }",
            output: "function foo() { {} return +a }",
            options: [override("return", BOTH)],
            errors: expectedBeforeAndAfter("return")
        },
        {
            code: "function foo() { {} return +a }",
            output: "function foo() { {}return+a }",
            options: [override("return", NEITHER)],
            errors: unexpectedBeforeAndAfter("return")
        },

        //----------------------------------------------------------------------
        // set
        //----------------------------------------------------------------------

        {
            code: "({ set[b](value) {} })",
            output: "({ set [b](value) {} })",
            languageOptions: { ecmaVersion: 6 },
            errors: expectedAfter("set")
        },
        {
            code: "class A { a() {}set[b](value) {} }",
            output: "class A { a() {} set [b](value) {} }",
            languageOptions: { ecmaVersion: 6 },
            errors: expectedBeforeAndAfter("set")
        },
        {
            code: "class A { a() {} static set[b](value) {} }",
            output: "class A { a() {} static set [b](value) {} }",
            languageOptions: { ecmaVersion: 6 },
            errors: expectedAfter("set")
        },
        {
            code: "({ set [b](value) {} })",
            output: "({ set[b](value) {} })",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 6 },
            errors: unexpectedAfter("set")
        },
        {
            code: "class A { a() {} set [b](value) {} }",
            output: "class A { a() {}set[b](value) {} }",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 6 },
            errors: unexpectedBeforeAndAfter("set")
        },
        {
            code: "({ set[b](value) {} })",
            output: "({ set [b](value) {} })",
            options: [override("set", BOTH)],
            languageOptions: { ecmaVersion: 6 },
            errors: expectedAfter("set")
        },
        {
            code: "class A { a() {}set[b](value) {} }",
            output: "class A { a() {} set [b](value) {} }",
            options: [override("set", BOTH)],
            languageOptions: { ecmaVersion: 6 },
            errors: expectedBeforeAndAfter("set")
        },
        {
            code: "({ set [b](value) {} })",
            output: "({ set[b](value) {} })",
            options: [override("set", NEITHER)],
            languageOptions: { ecmaVersion: 6 },
            errors: unexpectedAfter("set")
        },
        {
            code: "class A { a() {} set [b](value) {} }",
            output: "class A { a() {}set[b](value) {} }",
            options: [override("set", NEITHER)],
            languageOptions: { ecmaVersion: 6 },
            errors: unexpectedBeforeAndAfter("set")
        },
        {
            code: "class A { a;set#b(x) {} }",
            output: "class A { a;set #b(x) {} }",
            languageOptions: { ecmaVersion: 2022 },
            errors: expectedAfter("set")
        },
        {
            code: "class A { a; set #b(x) {} }",
            output: "class A { a; set#b(x) {} }",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 2022 },
            errors: unexpectedAfter("set")
        },

        //----------------------------------------------------------------------
        // static
        //----------------------------------------------------------------------

        {
            code: "class A { a() {}static[b]() {} }",
            output: "class A { a() {} static [b]() {} }",
            languageOptions: { ecmaVersion: 6 },
            errors: expectedBeforeAndAfter("static")
        },
        {
            code: "class A { a() {}static get [b]() {} }",
            output: "class A { a() {} static get [b]() {} }",
            languageOptions: { ecmaVersion: 6 },
            errors: expectedBefore("static")
        },
        {
            code: "class A { a() {} static [b]() {} }",
            output: "class A { a() {}static[b]() {} }",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 6 },
            errors: unexpectedBeforeAndAfter("static")
        },
        {
            code: "class A { a() {} static get[b]() {} }",
            output: "class A { a() {}static get[b]() {} }",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 6 },
            errors: unexpectedBefore("static")
        },
        {
            code: "class A { a() {}static[b]() {} }",
            output: "class A { a() {} static [b]() {} }",
            options: [override("static", BOTH)],
            languageOptions: { ecmaVersion: 6 },
            errors: expectedBeforeAndAfter("static")
        },
        {
            code: "class A { a() {} static [b]() {} }",
            output: "class A { a() {}static[b]() {} }",
            options: [override("static", NEITHER)],
            languageOptions: { ecmaVersion: 6 },
            errors: unexpectedBeforeAndAfter("static")
        },
        {
            code: "class A { a;static[b]; }",
            output: "class A { a;static [b]; }",
            languageOptions: { ecmaVersion: 2022 },
            errors: expectedAfter("static")
        },
        {
            code: "class A { a; static [b]; }",
            output: "class A { a; static[b]; }",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 2022 },
            errors: unexpectedAfter("static")
        },
        {
            code: "class A { a;static#b; }",
            output: "class A { a;static #b; }",
            languageOptions: { ecmaVersion: 2022 },
            errors: expectedAfter("static")
        },
        {
            code: "class A { a; static #b; }",
            output: "class A { a; static#b; }",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 2022 },
            errors: unexpectedAfter("static")
        },
        {
            code: "class A { a() {}static{} }",
            output: "class A { a() {} static {} }",
            languageOptions: { ecmaVersion: 2022 },
            errors: expectedBeforeAndAfter("static")
        },
        {
            code: "class A { a() {}static{} }",
            output: "class A { a() {} static {} }",
            options: [override("static", BOTH)],
            languageOptions: { ecmaVersion: 2022 },
            errors: expectedBeforeAndAfter("static")
        },
        {
            code: "class A {  a() {}static {} }",
            output: "class A {  a() {} static {} }",
            languageOptions: { ecmaVersion: 2022 },
            errors: expectedBefore("static")
        },
        {
            code: "class A {  a() {} static{} }",
            output: "class A {  a() {} static {} }",
            languageOptions: { ecmaVersion: 2022 },
            errors: expectedAfter("static")
        },
        {
            code: "class A { a() {} static {} }",
            output: "class A { a() {}static{} }",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 2022 },
            errors: unexpectedBeforeAndAfter("static")
        },
        {
            code: "class A { a() {} static {} }",
            output: "class A { a() {}static{} }",
            options: [override("static", NEITHER)],
            languageOptions: { ecmaVersion: 2022 },
            errors: unexpectedBeforeAndAfter("static")
        },
        {
            code: "class A { a() {} static{} }",
            output: "class A { a() {}static{} }",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 2022 },
            errors: unexpectedBefore("static")
        },
        {
            code: "class A { a() {}static {} }",
            output: "class A { a() {}static{} }",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 2022 },
            errors: unexpectedAfter("static")
        },

        //----------------------------------------------------------------------
        // super
        //----------------------------------------------------------------------

        {
            code: "class A { a() { {}super[b]; } }",
            output: "class A { a() { {} super[b]; } }",
            languageOptions: { ecmaVersion: 6 },
            errors: expectedBefore("super")
        },
        {
            code: "class A { a() { {} super[b]; } }",
            output: "class A { a() { {}super[b]; } }",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 6 },
            errors: unexpectedBefore("super")
        },
        {
            code: "class A { a() { {}super[b]; } }",
            output: "class A { a() { {} super[b]; } }",
            options: [override("super", BOTH)],
            languageOptions: { ecmaVersion: 6 },
            errors: expectedBefore("super")
        },
        {
            code: "class A { a() { {} super[b]; } }",
            output: "class A { a() { {}super[b]; } }",
            options: [override("super", NEITHER)],
            languageOptions: { ecmaVersion: 6 },
            errors: unexpectedBefore("super")
        },

        //----------------------------------------------------------------------
        // switch
        //----------------------------------------------------------------------

        {
            code: "{}switch(a) {}",
            output: "{} switch (a) {}",
            errors: expectedBeforeAndAfter("switch")
        },
        {
            code: "{} switch (a) {}",
            output: "{}switch(a) {}",
            options: [NEITHER],
            errors: unexpectedBeforeAndAfter("switch")
        },
        {
            code: "{}switch(a) {}",
            output: "{} switch (a) {}",
            options: [override("switch", BOTH)],
            errors: expectedBeforeAndAfter("switch")
        },
        {
            code: "{} switch (a) {}",
            output: "{}switch(a) {}",
            options: [override("switch", NEITHER)],
            errors: unexpectedBeforeAndAfter("switch")
        },

        //----------------------------------------------------------------------
        // this
        //----------------------------------------------------------------------

        {
            code: "{}this[a]",
            output: "{} this[a]",
            errors: expectedBefore("this")
        },
        {
            code: "{} this[a]",
            output: "{}this[a]",
            options: [NEITHER],
            errors: unexpectedBefore("this")
        },
        {
            code: "{}this[a]",
            output: "{} this[a]",
            options: [override("this", BOTH)],
            errors: expectedBefore("this")
        },
        {
            code: "{} this[a]",
            output: "{}this[a]",
            options: [override("this", NEITHER)],
            errors: unexpectedBefore("this")
        },
        {
            code: "<Thing> this.blah",
            output: "<Thing>this.blah",
            options: [override("this", { before: false })],
            languageOptions: {
                parser: require(fixtureParser("keyword-spacing", "prefix-cast-operator-space"))
            },
            errors: unexpectedBefore("this")
        },
        {
            code: "<Thing>this.blah",
            output: "<Thing> this.blah",
            languageOptions: {
                parser: require(fixtureParser("keyword-spacing", "prefix-cast-operator-no-space"))
            },
            errors: expectedBefore("this")
        },

        //----------------------------------------------------------------------
        // throw
        //----------------------------------------------------------------------

        {
            code: "function foo() { {}throw+a }",
            output: "function foo() { {} throw +a }",
            errors: expectedBeforeAndAfter("throw")
        },
        {
            code: "function foo() { {} throw +a }",
            output: "function foo() { {}throw+a }",
            options: [NEITHER],
            errors: unexpectedBeforeAndAfter("throw")
        },
        {
            code: "function foo() { {}throw+a }",
            output: "function foo() { {} throw +a }",
            options: [override("throw", BOTH)],
            errors: expectedBeforeAndAfter("throw")
        },
        {
            code: "function foo() { {} throw +a }",
            output: "function foo() { {}throw+a }",
            options: [override("throw", NEITHER)],
            errors: unexpectedBeforeAndAfter("throw")
        },

        //----------------------------------------------------------------------
        // try
        //----------------------------------------------------------------------

        {
            code: "{}try{} finally {}",
            output: "{} try {} finally {}",
            errors: expectedBeforeAndAfter("try")
        },
        {
            code: "{} try {}finally{}",
            output: "{}try{}finally{}",
            options: [NEITHER],
            errors: unexpectedBeforeAndAfter("try")
        },
        {
            code: "{}try{}finally{}",
            output: "{} try {}finally{}",
            options: [override("try", BOTH)],
            errors: expectedBeforeAndAfter("try")
        },
        {
            code: "{} try {} finally {}",
            output: "{}try{} finally {}",
            options: [override("try", NEITHER)],
            errors: unexpectedBeforeAndAfter("try")
        },

        //----------------------------------------------------------------------
        // typeof
        //----------------------------------------------------------------------

        {
            code: "{}typeof foo",
            output: "{} typeof foo",
            errors: expectedBefore("typeof")
        },
        {
            code: "{} typeof foo",
            output: "{}typeof foo",
            options: [NEITHER],
            errors: unexpectedBefore("typeof")
        },
        {
            code: "{}typeof foo",
            output: "{} typeof foo",
            options: [override("typeof", BOTH)],
            errors: expectedBefore("typeof")
        },
        {
            code: "{} typeof foo",
            output: "{}typeof foo",
            options: [override("typeof", NEITHER)],
            errors: unexpectedBefore("typeof")
        },

        //----------------------------------------------------------------------
        // var
        //----------------------------------------------------------------------

        {
            code: "{}var[a] = b",
            output: "{} var [a] = b",
            languageOptions: { ecmaVersion: 6 },
            errors: expectedBeforeAndAfter("var")
        },
        {
            code: "{} var [a] = b",
            output: "{}var[a] = b",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 6 },
            errors: unexpectedBeforeAndAfter("var")
        },
        {
            code: "{}var[a] = b",
            output: "{} var [a] = b",
            options: [override("var", BOTH)],
            languageOptions: { ecmaVersion: 6 },
            errors: expectedBeforeAndAfter("var")
        },
        {
            code: "{} var [a] = b",
            output: "{}var[a] = b",
            options: [override("var", NEITHER)],
            languageOptions: { ecmaVersion: 6 },
            errors: unexpectedBeforeAndAfter("var")
        },

        //----------------------------------------------------------------------
        // void
        //----------------------------------------------------------------------

        {
            code: "{}void foo",
            output: "{} void foo",
            errors: expectedBefore("void")
        },
        {
            code: "{} void foo",
            output: "{}void foo",
            options: [NEITHER],
            errors: unexpectedBefore("void")
        },
        {
            code: "{}void foo",
            output: "{} void foo",
            options: [override("void", BOTH)],
            errors: expectedBefore("void")
        },
        {
            code: "{} void foo",
            output: "{}void foo",
            options: [override("void", NEITHER)],
            errors: unexpectedBefore("void")
        },

        //----------------------------------------------------------------------
        // while
        //----------------------------------------------------------------------

        {
            code: "{}while(a) {}",
            output: "{} while (a) {}",
            errors: expectedBeforeAndAfter("while")
        },
        {
            code: "do {}while(a)",
            output: "do {} while (a)",
            errors: expectedBeforeAndAfter("while")
        },
        {
            code: "{} while (a) {}",
            output: "{}while(a) {}",
            options: [NEITHER],
            errors: unexpectedBeforeAndAfter("while")
        },
        {
            code: "do{} while (a)",
            output: "do{}while(a)",
            options: [NEITHER],
            errors: unexpectedBeforeAndAfter("while")
        },
        {
            code: "{}while(a) {}",
            output: "{} while (a) {}",
            options: [override("while", BOTH)],
            errors: expectedBeforeAndAfter("while")
        },
        {
            code: "do{}while(a)",
            output: "do{} while (a)",
            options: [override("while", BOTH)],
            errors: expectedBeforeAndAfter("while")
        },
        {
            code: "{} while (a) {}",
            output: "{}while(a) {}",
            options: [override("while", NEITHER)],
            errors: unexpectedBeforeAndAfter("while")
        },
        {
            code: "do {} while (a)",
            output: "do {}while(a)",
            options: [override("while", NEITHER)],
            errors: unexpectedBeforeAndAfter("while")
        },

        //----------------------------------------------------------------------
        // with
        //----------------------------------------------------------------------

        {
            code: "{}with(obj) {}",
            output: "{} with (obj) {}",
            errors: expectedBeforeAndAfter("with")
        },
        {
            code: "{} with (obj) {}",
            output: "{}with(obj) {}",
            options: [NEITHER],
            errors: unexpectedBeforeAndAfter("with")
        },
        {
            code: "{}with(obj) {}",
            output: "{} with (obj) {}",
            options: [override("with", BOTH)],
            errors: expectedBeforeAndAfter("with")
        },
        {
            code: "{} with (obj) {}",
            output: "{}with(obj) {}",
            options: [override("with", NEITHER)],
            errors: unexpectedBeforeAndAfter("with")
        },

        //----------------------------------------------------------------------
        // yield
        //----------------------------------------------------------------------

        {
            code: "function* foo() { {}yield foo }",
            output: "function* foo() { {} yield foo }",
            languageOptions: { ecmaVersion: 6 },
            errors: expectedBefore("yield")
        },
        {
            code: "function* foo() { {} yield foo }",
            output: "function* foo() { {}yield foo }",
            options: [NEITHER],
            languageOptions: { ecmaVersion: 6 },
            errors: unexpectedBefore("yield")
        },
        {
            code: "function* foo() { {}yield foo }",
            output: "function* foo() { {} yield foo }",
            options: [override("yield", BOTH)],
            languageOptions: { ecmaVersion: 6 },
            errors: expectedBefore("yield")
        },
        {
            code: "function* foo() { {} yield foo }",
            output: "function* foo() { {}yield foo }",
            options: [override("yield", NEITHER)],
            languageOptions: { ecmaVersion: 6 },
            errors: unexpectedBefore("yield")
        },

        //----------------------------------------------------------------------
        // typescript parser
        //----------------------------------------------------------------------

        // get, set, async decorator keywords shouldn't be detected
        {
            code: "class Foo { @desc({set a(value) {}, get a() {}, async c() {}}) async[foo]() {} }",
            output: "class Foo { @desc({set a(value) {}, get a() {}, async c() {}}) async [foo]() {} }",
            languageOptions: { parser: require(parser("typescript-parsers/decorator-with-keywords-class-method")) },
            errors: expectedAfter("async")
        }
    ]

});
