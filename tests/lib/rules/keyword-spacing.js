/**
 * @fileoverview Tests for keyword-spacing rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/keyword-spacing"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const BOTH = {before: true, after: true};
const NEITHER = {before: false, after: false};

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
 *
 * @param {string} keyword - A keyword to be overriden.
 * @param {Object} value - A value to override.
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
 *
 * @param {string} keyword - A keyword.
 * @returns {string[]} An error message.
 */
function expectedBefore(keyword) {
    return ["Expected space(s) before \"" + keyword + "\"."];
}

/**
 * Gets an error message that expected space(s) after a specified keyword.
 *
 * @param {string} keyword - A keyword.
 * @returns {string[]} An error message.
 */
function expectedAfter(keyword) {
    return ["Expected space(s) after \"" + keyword + "\"."];
}

/**
 * Gets error messages that expected space(s) before and after a specified
 * keyword.
 *
 * @param {string} keyword - A keyword.
 * @returns {string[]} Error messages.
 */
function expectedBeforeAndAfter(keyword) {
    return [
        "Expected space(s) before \"" + keyword + "\".",
        "Expected space(s) after \"" + keyword + "\"."
    ];
}

/**
 * Gets an error message that unexpected space(s) before a specified keyword.
 *
 * @param {string} keyword - A keyword.
 * @returns {string[]} An error message.
 */
function unexpectedBefore(keyword) {
    return ["Unexpected space(s) before \"" + keyword + "\"."];
}

/**
 * Gets an error message that unexpected space(s) after a specified keyword.
 *
 * @param {string} keyword - A keyword.
 * @returns {string[]} An error message.
 */
function unexpectedAfter(keyword) {
    return ["Unexpected space(s) after \"" + keyword + "\"."];
}

/**
 * Gets error messages that unexpected space(s) before and after a specified
 * keyword.
 *
 * @param {string} keyword - A keyword.
 * @returns {string[]} Error messages.
 */
function unexpectedBeforeAndAfter(keyword) {
    return [
        "Unexpected space(s) before \"" + keyword + "\".",
        "Unexpected space(s) after \"" + keyword + "\"."
    ];
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("keyword-spacing", rule, {
    valid: [

        //----------------------------------------------------------------------
        // as
        //----------------------------------------------------------------------

        {code: "import * as a from \"foo\"", parserOptions: {sourceType: "module"}},
        {code: "import*as a from\"foo\"", options: [NEITHER], parserOptions: {sourceType: "module"}},
        {code: "import* as a from\"foo\"", options: [override("as", BOTH)], parserOptions: {sourceType: "module"}},
        {code: "import *as a from \"foo\"", options: [override("as", NEITHER)], parserOptions: {sourceType: "module"}},

        //----------------------------------------------------------------------
        // async
        //----------------------------------------------------------------------

        {code: "{} async function foo() {}", parserOptions: {ecmaVersion: 8}},
        {code: "{}async function foo() {}", options: [NEITHER], parserOptions: {ecmaVersion: 8}},
        {code: "{} async function foo() {}", options: [override("async", BOTH)], parserOptions: {ecmaVersion: 8}},
        {code: "{}async function foo() {}", options: [override("async", NEITHER)], parserOptions: {ecmaVersion: 8}},
        {code: "{} async () => {}", parserOptions: {ecmaVersion: 8}},
        {code: "{}async () => {}", options: [NEITHER], parserOptions: {ecmaVersion: 8}},
        {code: "{} async () => {}", options: [override("async", BOTH)], parserOptions: {ecmaVersion: 8}},
        {code: "{}async () => {}", options: [override("async", NEITHER)], parserOptions: {ecmaVersion: 8}},
        {code: "({async [b]() {}})", parserOptions: {ecmaVersion: 8}},
        {code: "({async[b]() {}})", options: [NEITHER], parserOptions: {ecmaVersion: 8}},
        {code: "({async [b]() {}})", options: [override("async", BOTH)], parserOptions: {ecmaVersion: 8}},
        {code: "({async[b]() {}})", options: [override("async", NEITHER)], parserOptions: {ecmaVersion: 8}},
        {code: "class A {a(){} async [b]() {}}", parserOptions: {ecmaVersion: 8}},
        {code: "class A {a(){}async[b]() {}}", options: [NEITHER], parserOptions: {ecmaVersion: 8}},
        {code: "class A {a(){} async [b]() {}}", options: [override("async", BOTH)], parserOptions: {ecmaVersion: 8}},
        {code: "class A {a(){}async[b]() {}}", options: [override("async", NEITHER)], parserOptions: {ecmaVersion: 8}},

        // not conflict with `array-bracket-spacing`
        {code: "[async function foo() {}]", parserOptions: {ecmaVersion: 8}},
        {code: "[ async function foo() {}]", options: [NEITHER], parserOptions: {ecmaVersion: 8}},

        // not conflict with `arrow-spacing`
        {code: "() =>async function foo() {}", parserOptions: {ecmaVersion: 8}},
        {code: "() => async function foo() {}", options: [NEITHER], parserOptions: {ecmaVersion: 8}},

        // not conflict with `block-spacing`
        {code: "{async function foo() {} }", parserOptions: {ecmaVersion: 8}},
        {code: "{ async function foo() {} }", options: [NEITHER], parserOptions: {ecmaVersion: 8}},

        // not conflict with `comma-spacing`
        {code: "(0,async function foo() {})", parserOptions: {ecmaVersion: 8}},
        {code: "(0, async function foo() {})", options: [NEITHER], parserOptions: {ecmaVersion: 8}},

        // not conflict with `computed-property-spacing`
        {code: "a[async function foo() {}]", parserOptions: {ecmaVersion: 8}},
        {code: "({[async function foo() {}]: 0})", parserOptions: {ecmaVersion: 8}},
        {code: "a[ async function foo() {}]", options: [NEITHER], parserOptions: {ecmaVersion: 8}},
        {code: "({[ async function foo() {}]: 0})", options: [NEITHER], parserOptions: {ecmaVersion: 8}},

        // not conflict with `key-spacing`
        {code: "({a:async function foo() {} })", parserOptions: {ecmaVersion: 8}},
        {code: "({a: async function foo() {} })", options: [NEITHER], parserOptions: {ecmaVersion: 8}},

        // not conflict with `semi-spacing`
        {code: ";async function foo() {};", parserOptions: {ecmaVersion: 8}},
        {code: "; async function foo() {} ;", options: [NEITHER], parserOptions: {ecmaVersion: 8}},

        // not conflict with `space-before-function-paren`
        {code: "async() => {}", parserOptions: {ecmaVersion: 8}},
        {code: "async () => {}", options: [NEITHER], parserOptions: {ecmaVersion: 8}},

        // not conflict with `space-in-parens`
        {code: "(async function foo() {})", parserOptions: {ecmaVersion: 8}},
        {code: "( async function foo() {})", options: [NEITHER], parserOptions: {ecmaVersion: 8}},

        // not conflict with `space-infix-ops`
        {code: "a =async function foo() {}", parserOptions: {ecmaVersion: 8}},
        {code: "a = async function foo() {}", options: [NEITHER], parserOptions: {ecmaVersion: 8}},

        // not conflict with `space-unary-ops`
        {code: "!async function foo() {}", parserOptions: {ecmaVersion: 8}},
        {code: "! async function foo() {}", options: [NEITHER], parserOptions: {ecmaVersion: 8}},

        // not conflict with `template-curly-spacing`
        {code: "`${async function foo() {}}`", parserOptions: {ecmaVersion: 8}},
        {code: "`${ async function foo() {}}`", options: [NEITHER], parserOptions: {ecmaVersion: 8}},

        // not conflict with `jsx-curly-spacing`
        {code: "<Foo onClick={async function foo() {}} />", parserOptions: {ecmaVersion: 8, ecmaFeatures: {jsx: true}}},
        {code: "<Foo onClick={ async function foo() {}} />", options: [NEITHER], parserOptions: {ecmaVersion: 8, ecmaFeatures: {jsx: true}}},

        //----------------------------------------------------------------------
        // await
        //----------------------------------------------------------------------

        {code: "async function wrap() { {} await +1 }", parserOptions: {ecmaVersion: 8}},
        {code: "async function wrap() { {}await +1 }", options: [NEITHER], parserOptions: {ecmaVersion: 8}},
        {code: "async function wrap() { {} await +1 }", options: [override("await", BOTH)], parserOptions: {ecmaVersion: 8}},
        {code: "async function wrap() { {}await +1 }", options: [override("await", NEITHER)], parserOptions: {ecmaVersion: 8}},

        // not conflict with `array-bracket-spacing`
        {code: "async function wrap() { [await a] }", parserOptions: {ecmaVersion: 8}},
        {code: "async function wrap() { [ await a] }", options: [NEITHER], parserOptions: {ecmaVersion: 8}},

        // not conflict with `arrow-spacing`
        {code: "async () =>await a", parserOptions: {ecmaVersion: 8}},
        {code: "async () => await a", options: [NEITHER], parserOptions: {ecmaVersion: 8}},

        // not conflict with `block-spacing`
        {code: "async function wrap() { {await a } }", parserOptions: {ecmaVersion: 8}},
        {code: "async function wrap() { { await a } }", options: [NEITHER], parserOptions: {ecmaVersion: 8}},

        // not conflict with `comma-spacing`
        {code: "async function wrap() { (0,await a) }", parserOptions: {ecmaVersion: 8}},
        {code: "async function wrap() { (0, await a) }", options: [NEITHER], parserOptions: {ecmaVersion: 8}},

        // not conflict with `computed-property-spacing`
        {code: "async function wrap() { a[await a] }", parserOptions: {ecmaVersion: 8}},
        {code: "async function wrap() { ({[await a]: 0}) }", parserOptions: {ecmaVersion: 8}},
        {code: "async function wrap() { a[ await a] }", options: [NEITHER], parserOptions: {ecmaVersion: 8}},
        {code: "async function wrap() { ({[ await a]: 0}) }", options: [NEITHER], parserOptions: {ecmaVersion: 8}},

        // not conflict with `key-spacing`
        {code: "async function wrap() { ({a:await a }) }", parserOptions: {ecmaVersion: 8}},
        {code: "async function wrap() { ({a: await a }) }", options: [NEITHER], parserOptions: {ecmaVersion: 8}},

        // not conflict with `semi-spacing`
        {code: "async function wrap() { ;await a; }", parserOptions: {ecmaVersion: 8}},
        {code: "async function wrap() { ; await a ; }", options: [NEITHER], parserOptions: {ecmaVersion: 8}},

        // not conflict with `space-in-parens`
        {code: "async function wrap() { (await a) }", parserOptions: {ecmaVersion: 8}},
        {code: "async function wrap() { ( await a) }", options: [NEITHER], parserOptions: {ecmaVersion: 8}},

        // not conflict with `space-infix-ops`
        {code: "async function wrap() { a =await a }", parserOptions: {ecmaVersion: 8}},
        {code: "async function wrap() { a = await a }", options: [NEITHER], parserOptions: {ecmaVersion: 8}},

        // not conflict with `space-unary-ops`
        {code: "async function wrap() { !await'a' }", parserOptions: {ecmaVersion: 8}},
        {code: "async function wrap() { ! await 'a' }", options: [NEITHER], parserOptions: {ecmaVersion: 8}},

        // not conflict with `template-curly-spacing`
        {code: "async function wrap() { `${await a}` }", parserOptions: {ecmaVersion: 8}},
        {code: "async function wrap() { `${ await a}` }", options: [NEITHER], parserOptions: {ecmaVersion: 8}},

        // not conflict with `jsx-curly-spacing`
        {code: "async function wrap() { <Foo onClick={await a} /> }", parserOptions: {ecmaVersion: 8, ecmaFeatures: {jsx: true}}},
        {code: "async function wrap() { <Foo onClick={ await a} /> }", options: [NEITHER], parserOptions: {ecmaVersion: 8, ecmaFeatures: {jsx: true}}},

        //----------------------------------------------------------------------
        // break
        //----------------------------------------------------------------------

        {code: "A: for (;;) { {} break A; }"},
        {code: "A: for(;;) { {}break A; }", options: [NEITHER]},
        {code: "A: for(;;) { {} break A; }", options: [override("break", BOTH)]},
        {code: "A: for (;;) { {}break A; }", options: [override("break", NEITHER)]},

        // not conflict with `block-spacing`
        {code: "for (;;) {break}"},
        {code: "for(;;) { break }", options: [NEITHER]},

        // not conflict with `semi-spacing`
        {code: "for (;;) { ;break; }"},
        {code: "for(;;) { ; break ; }", options: [NEITHER]},

        //----------------------------------------------------------------------
        // case
        //----------------------------------------------------------------------

        {code: "switch (a) { case 0: {} case +1: }"},
        {code: "switch (a) { case 0: {} case (1): }"},
        {code: "switch(a) { case 0: {}case+1: }", options: [NEITHER]},
        {code: "switch(a) { case 0: {}case(1): }", options: [NEITHER]},
        {code: "switch(a) { case 0: {} case +1: }", options: [override("case", BOTH)]},
        {code: "switch (a) { case 0: {}case+1: }", options: [override("case", NEITHER)]},

        // not conflict with `block-spacing`
        {code: "switch (a) {case 0: }"},
        {code: "switch(a) { case 0: }", options: [NEITHER]},

        // not conflict with `semi-spacing`
        {code: "switch (a) { case 0: ;case 1: }"},
        {code: "switch(a) { case 0: ; case 1: }", options: [NEITHER]},

        //----------------------------------------------------------------------
        // catch
        //----------------------------------------------------------------------

        {code: "try {} catch (e) {}"},
        {code: "try{}catch(e) {}", options: [NEITHER]},
        {code: "try{} catch (e) {}", options: [override("catch", BOTH)]},
        {code: "try {}catch(e) {}", options: [override("catch", NEITHER)]},
        {code: "try {}\ncatch (e) {}"},
        {code: "try{}\ncatch(e) {}", options: [NEITHER]},

        //----------------------------------------------------------------------
        // class
        //----------------------------------------------------------------------

        {code: "{} class Bar {}", parserOptions: {ecmaVersion: 6}},
        {code: "(class {})", parserOptions: {ecmaVersion: 6}},
        {code: "{}class Bar {}", options: [NEITHER], parserOptions: {ecmaVersion: 6}},
        {code: "(class{})", options: [NEITHER], parserOptions: {ecmaVersion: 6}},
        {code: "{} class Bar {}", options: [override("class", BOTH)], parserOptions: {ecmaVersion: 6}},
        {code: "{}class Bar {}", options: [override("class", NEITHER)], parserOptions: {ecmaVersion: 6}},

        // not conflict with `array-bracket-spacing`
        {code: "[class {}]", parserOptions: {ecmaVersion: 6}},
        {code: "[ class{}]", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `arrow-spacing`
        {code: "() =>class {}", parserOptions: {ecmaVersion: 6}},
        {code: "() => class{}", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `block-spacing`
        {code: "{class Bar {} }", parserOptions: {ecmaVersion: 6}},
        {code: "{ class Bar {} }", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `comma-spacing`
        {code: "(0,class {})", parserOptions: {ecmaVersion: 6}},
        {code: "(0, class{})", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `computed-property-spacing`
        {code: "a[class {}]", parserOptions: {ecmaVersion: 6}},
        {code: "({[class {}]: 0})", parserOptions: {ecmaVersion: 6}},
        {code: "a[ class{}]", options: [NEITHER], parserOptions: {ecmaVersion: 6}},
        {code: "({[ class{}]: 0})", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `key-spacing`
        {code: "({a:class {} })", parserOptions: {ecmaVersion: 6}},
        {code: "({a: class{} })", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `semi-spacing`
        {code: ";class Bar {};", parserOptions: {ecmaVersion: 6}},
        {code: "; class Bar {} ;", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `space-in-parens`
        {code: "(class {})", parserOptions: {ecmaVersion: 6}},
        {code: "( class{})", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `space-infix-ops`
        {code: "a =class {}", parserOptions: {ecmaVersion: 6}},
        {code: "a = class{}", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `space-unary-ops`
        {code: "!class {}", parserOptions: {ecmaVersion: 6}},
        {code: "! class{}", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `template-curly-spacing`
        {code: "`${class {}}`", parserOptions: {ecmaVersion: 6}},
        {code: "`${ class{}}`", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `jsx-curly-spacing`
        {code: "<Foo onClick={class {}} />", parserOptions: {ecmaVersion: 6, ecmaFeatures: {jsx: true}}},
        {code: "<Foo onClick={ class{}} />", options: [NEITHER], parserOptions: {ecmaVersion: 6, ecmaFeatures: {jsx: true}}},

        //----------------------------------------------------------------------
        // const
        //----------------------------------------------------------------------

        {code: "{} const [a] = b", parserOptions: {ecmaVersion: 6}},
        {code: "{} const {a} = b", parserOptions: {ecmaVersion: 6}},
        {code: "{}const[a] = b", options: [NEITHER], parserOptions: {ecmaVersion: 6}},
        {code: "{}const{a} = b", options: [NEITHER], parserOptions: {ecmaVersion: 6}},
        {code: "{} const [a] = b", options: [override("const", BOTH)], parserOptions: {ecmaVersion: 6}},
        {code: "{} const {a} = b", options: [override("const", BOTH)], parserOptions: {ecmaVersion: 6}},
        {code: "{}const[a] = b", options: [override("const", NEITHER)], parserOptions: {ecmaVersion: 6}},
        {code: "{}const{a} = b", options: [override("const", NEITHER)], parserOptions: {ecmaVersion: 6}},

        // not conflict with `block-spacing`
        {code: "{const a = b}", parserOptions: {ecmaVersion: 6}},
        {code: "{ const a = b}", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `semi-spacing`
        {code: ";const a = b;", parserOptions: {ecmaVersion: 6}},
        {code: "; const a = b ;", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        //----------------------------------------------------------------------
        // continue
        //----------------------------------------------------------------------

        {code: "A: for (;;) { {} continue A; }"},
        {code: "A: for(;;) { {}continue A; }", options: [NEITHER]},
        {code: "A: for(;;) { {} continue A; }", options: [override("continue", BOTH)]},
        {code: "A: for (;;) { {}continue A; }", options: [override("continue", NEITHER)]},

        // not conflict with `block-spacing`
        {code: "for (;;) {continue}"},
        {code: "for(;;) { continue }", options: [NEITHER]},

        // not conflict with `semi-spacing`
        {code: "for (;;) { ;continue; }"},
        {code: "for(;;) { ; continue ; }", options: [NEITHER]},

        //----------------------------------------------------------------------
        // debugger
        //----------------------------------------------------------------------

        {code: "{} debugger"},
        {code: "{}debugger", options: [NEITHER]},
        {code: "{} debugger", options: [override("debugger", BOTH)]},
        {code: "{}debugger", options: [override("debugger", NEITHER)]},

        // not conflict with `block-spacing`
        {code: "{debugger}"},
        {code: "{ debugger }", options: [NEITHER]},

        // not conflict with `semi-spacing`
        {code: ";debugger;"},
        {code: "; debugger ;", options: [NEITHER]},

        //----------------------------------------------------------------------
        // default
        //----------------------------------------------------------------------

        {code: "switch (a) { case 0: {} default: }"},
        {code: "switch(a) { case 0: {}default: }", options: [NEITHER]},
        {code: "switch(a) { case 0: {} default: }", options: [override("default", BOTH)]},
        {code: "switch (a) { case 0: {}default: }", options: [override("default", NEITHER)]},

        // not conflict with `block-spacing`
        {code: "switch (a) {default:}"},
        {code: "switch(a) { default: }", options: [NEITHER]},

        // not conflict with `semi-spacing`
        {code: "switch (a) { case 0: ;default: }"},
        {code: "switch(a) { case 0: ; default: }", options: [NEITHER]},

        //----------------------------------------------------------------------
        // delete
        //----------------------------------------------------------------------

        {code: "{} delete foo.a"},
        {code: "{}delete foo.a", options: [NEITHER]},
        {code: "{} delete foo.a", options: [override("delete", BOTH)]},
        {code: "{}delete foo.a", options: [override("delete", NEITHER)]},

        // not conflict with `array-bracket-spacing`
        {code: "[delete foo.a]"},
        {code: "[ delete foo.a]", options: [NEITHER]},

        // not conflict with `arrow-spacing`
        {code: "(() =>delete foo.a)", parserOptions: {ecmaVersion: 6}},
        {code: "(() => delete foo.a)", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `block-spacing`
        {code: "{delete foo.a }"},
        {code: "{ delete foo.a }", options: [NEITHER]},

        // not conflict with `comma-spacing`
        {code: "(0,delete foo.a)"},
        {code: "(0, delete foo.a)", options: [NEITHER]},

        // not conflict with `computed-property-spacing`
        {code: "a[delete foo.a]"},
        {code: "({[delete foo.a]: 0})", parserOptions: {ecmaVersion: 6}},
        {code: "a[ delete foo.a]", options: [NEITHER]},
        {code: "({[ delete foo.a]: 0})", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `key-spacing`
        {code: "({a:delete foo.a })"},
        {code: "({a: delete foo.a })", options: [NEITHER]},

        // not conflict with `semi-spacing`
        {code: ";delete foo.a"},
        {code: "; delete foo.a", options: [NEITHER]},

        // not conflict with `space-in-parens`
        {code: "(delete foo.a)"},
        {code: "( delete foo.a)", options: [NEITHER]},

        // not conflict with `space-infix-ops`
        {code: "a =delete foo.a"},
        {code: "a = delete foo.a", options: [NEITHER]},

        // not conflict with `space-unary-ops`
        {code: "!delete(foo.a)"},
        {code: "! delete (foo.a)", options: [NEITHER]},

        // not conflict with `template-curly-spacing`
        {code: "`${delete foo.a}`", parserOptions: {ecmaVersion: 6}},
        {code: "`${ delete foo.a}`", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `jsx-curly-spacing`
        {code: "<Foo onClick={delete foo.a} />", parserOptions: {ecmaFeatures: {jsx: true}}},
        {code: "<Foo onClick={ delete foo.a} />", options: [NEITHER], parserOptions: {ecmaFeatures: {jsx: true}}},

        //----------------------------------------------------------------------
        // do
        //----------------------------------------------------------------------

        {code: "{} do {} while (true)"},
        {code: "{}do{}while(true)", options: [NEITHER]},
        {code: "{} do {}while(true)", options: [override("do", BOTH)]},
        {code: "{}do{} while (true)", options: [override("do", NEITHER)]},
        {code: "{}\ndo\n{} while (true)"},
        {code: "{}\ndo\n{}while(true)", options: [NEITHER]},

        // not conflict with `block-spacing`
        {code: "{do {} while (true)}"},
        {code: "{ do{}while(true) }", options: [NEITHER]},

        // not conflict with `semi-spacing`
        {code: ";do; while (true)"},
        {code: "; do ;while(true)", options: [NEITHER]},

        //----------------------------------------------------------------------
        // else
        //----------------------------------------------------------------------

        {code: "if (a) {} else {}"},
        {code: "if (a) {} else if (b) {}"},
        {code: "if (a) {} else (0)"},
        {code: "if (a) {} else []"},
        {code: "if (a) {} else +1"},
        {code: "if (a) {} else \"a\""},
        {code: "if(a){}else{}", options: [NEITHER]},
        {code: "if(a){}else if(b) {}", options: [NEITHER]},
        {code: "if(a) {}else(0)", options: [NEITHER]},
        {code: "if(a) {}else[]", options: [NEITHER]},
        {code: "if(a) {}else+1", options: [NEITHER]},
        {code: "if(a) {}else\"a\"", options: [NEITHER]},
        {code: "if(a) {} else {}", options: [override("else", BOTH)]},
        {code: "if (a) {}else{}", options: [override("else", NEITHER)]},
        {code: "if (a) {}\nelse\n{}"},
        {code: "if(a) {}\nelse\n{}", options: [NEITHER]},

        // not conflict with `semi-spacing`
        {code: "if (a);else;"},
        {code: "if(a); else ;", options: [NEITHER]},

        //----------------------------------------------------------------------
        // export
        //----------------------------------------------------------------------

        {code: "{} export {a}", parserOptions: {sourceType: "module"}},
        {code: "{} export default a", parserOptions: {sourceType: "module"}},
        {code: "{} export * from \"a\"", parserOptions: {sourceType: "module"}},
        {code: "{}export{a}", options: [NEITHER], parserOptions: {sourceType: "module"}},
        {code: "{} export {a}", options: [override("export", BOTH)], parserOptions: {sourceType: "module"}},
        {code: "{}export{a}", options: [override("export", NEITHER)], parserOptions: {sourceType: "module"}},

        // not conflict with `semi-spacing`
        {code: ";export {a}", parserOptions: {sourceType: "module"}},
        {code: "; export{a}", options: [NEITHER], parserOptions: {sourceType: "module"}},

        //----------------------------------------------------------------------
        // extends
        //----------------------------------------------------------------------

        {code: "class Bar extends [] {}", parserOptions: {ecmaVersion: 6}},
        {code: "class Bar extends[] {}", options: [NEITHER], parserOptions: {ecmaVersion: 6}},
        {code: "class Bar extends [] {}", options: [override("extends", BOTH)], parserOptions: {ecmaVersion: 6}},
        {code: "class Bar extends[] {}", options: [override("extends", NEITHER)], parserOptions: {ecmaVersion: 6}},

        //----------------------------------------------------------------------
        // finally
        //----------------------------------------------------------------------

        {code: "try {} finally {}"},
        {code: "try{}finally{}", options: [NEITHER]},
        {code: "try{} finally {}", options: [override("finally", BOTH)]},
        {code: "try {}finally{}", options: [override("finally", NEITHER)]},
        {code: "try {}\nfinally\n{}"},
        {code: "try{}\nfinally\n{}", options: [NEITHER]},

        //----------------------------------------------------------------------
        // for
        //----------------------------------------------------------------------

        {code: "{} for (;;) {}"},
        {code: "{} for (var foo in obj) {}"},
        {code: "{} for (var foo of list) {}", parserOptions: {ecmaVersion: 6}},
        {code: "{}for(;;) {}", options: [NEITHER]},
        {code: "{}for(var foo in obj) {}", options: [NEITHER]},
        {code: "{}for(var foo of list) {}", options: [NEITHER], parserOptions: {ecmaVersion: 6}},
        {code: "{} for (;;) {}", options: [override("for", BOTH)]},
        {code: "{} for (var foo in obj) {}", options: [override("for", BOTH)]},
        {code: "{} for (var foo of list) {}", options: [override("for", BOTH)], parserOptions: {ecmaVersion: 6}},
        {code: "{}for(;;) {}", options: [override("for", NEITHER)]},
        {code: "{}for(var foo in obj) {}", options: [override("for", NEITHER)]},
        {code: "{}for(var foo of list) {}", options: [override("for", NEITHER)], parserOptions: {ecmaVersion: 6}},

        // not conflict with `block-spacing`
        {code: "{for (;;) {} }"},
        {code: "{for (var foo in obj) {} }"},
        {code: "{for (var foo of list) {} }", parserOptions: {ecmaVersion: 6}},
        {code: "{ for(;;) {} }", options: [NEITHER]},
        {code: "{ for(var foo in obj) {} }", options: [NEITHER]},
        {code: "{ for(var foo of list) {} }", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `semi-spacing`
        {code: ";for (;;) {}"},
        {code: ";for (var foo in obj) {}"},
        {code: ";for (var foo of list) {}", parserOptions: {ecmaVersion: 6}},
        {code: "; for(;;) {}", options: [NEITHER]},
        {code: "; for(var foo in obj) {}", options: [NEITHER]},
        {code: "; for(var foo of list) {}", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        //----------------------------------------------------------------------
        // from
        //----------------------------------------------------------------------

        {code: "import {foo} from \"foo\"", parserOptions: {sourceType: "module"}},
        {code: "export {foo} from \"foo\"", parserOptions: {sourceType: "module"}},
        {code: "export * from \"foo\"", parserOptions: {sourceType: "module"}},
        {code: "import{foo}from\"foo\"", options: [NEITHER], parserOptions: {sourceType: "module"}},
        {code: "export{foo}from\"foo\"", options: [NEITHER], parserOptions: {sourceType: "module"}},
        {code: "export*from\"foo\"", options: [NEITHER], parserOptions: {sourceType: "module"}},
        {code: "import{foo} from \"foo\"", options: [override("from", BOTH)], parserOptions: {sourceType: "module"}},
        {code: "export{foo} from \"foo\"", options: [override("from", BOTH)], parserOptions: {sourceType: "module"}},
        {code: "export* from \"foo\"", options: [override("from", BOTH)], parserOptions: {sourceType: "module"}},
        {code: "import {foo}from\"foo\"", options: [override("from", NEITHER)], parserOptions: {sourceType: "module"}},
        {code: "export {foo}from\"foo\"", options: [override("from", NEITHER)], parserOptions: {sourceType: "module"}},
        {code: "export *from\"foo\"", options: [override("from", NEITHER)], parserOptions: {sourceType: "module"}},

        //----------------------------------------------------------------------
        // function
        //----------------------------------------------------------------------

        {code: "{} function foo() {}"},
        {code: "{}function foo() {}", options: [NEITHER]},
        {code: "{} function foo() {}", options: [override("function", BOTH)]},
        {code: "{}function foo() {}", options: [override("function", NEITHER)]},

        // not conflict with `array-bracket-spacing`
        {code: "[function() {}]"},
        {code: "[ function() {}]", options: [NEITHER]},

        // not conflict with `arrow-spacing`
        {code: "(() =>function() {})", parserOptions: {ecmaVersion: 6}},
        {code: "(() => function() {})", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `block-spacing`
        {code: "{function foo() {} }"},
        {code: "{ function foo() {} }", options: [NEITHER]},

        // not conflict with `comma-spacing`
        {code: "(0,function() {})"},
        {code: "(0, function() {})", options: [NEITHER]},

        // not conflict with `computed-property-spacing`
        {code: "a[function() {}]"},
        {code: "({[function() {}]: 0})", parserOptions: {ecmaVersion: 6}},
        {code: "a[ function() {}]", options: [NEITHER]},
        {code: "({[ function(){}]: 0})", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `generator-star-spacing`
        {code: "function* foo() {}", parserOptions: {ecmaVersion: 6}},
        {code: "function *foo() {}", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `key-spacing`
        {code: "({a:function() {} })"},
        {code: "({a: function() {} })", options: [NEITHER]},

        // not conflict with `semi-spacing`
        {code: ";function foo() {};"},
        {code: "; function foo() {} ;", options: [NEITHER]},

        // not conflict with `space-before-function-paren`
        // not conflict with `space-in-parens`
        {code: "(function() {})"},
        {code: "( function () {})", options: [NEITHER]},

        // not conflict with `space-infix-ops`
        {code: "a =function() {}"},
        {code: "a = function() {}", options: [NEITHER]},

        // not conflict with `space-unary-ops`
        {code: "!function() {}"},
        {code: "! function() {}", options: [NEITHER]},

        // not conflict with `template-curly-spacing`
        {code: "`${function() {}}`", parserOptions: {ecmaVersion: 6}},
        {code: "`${ function() {}}`", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `jsx-curly-spacing`
        {code: "<Foo onClick={function() {}} />", parserOptions: {ecmaFeatures: {jsx: true}}},
        {code: "<Foo onClick={ function() {}} />", options: [NEITHER], parserOptions: {ecmaFeatures: {jsx: true}}},

        //----------------------------------------------------------------------
        // get
        //----------------------------------------------------------------------

        {code: "({ get [b]() {} })", parserOptions: {ecmaVersion: 6}},
        {code: "class A { a() {} get [b]() {} }", parserOptions: {ecmaVersion: 6}},
        {code: "class A { a() {} static get [b]() {} }", parserOptions: {ecmaVersion: 6}},
        {code: "({ get[b]() {} })", options: [NEITHER], parserOptions: {ecmaVersion: 6}},
        {code: "class A { a() {}get[b]() {} }", options: [NEITHER], parserOptions: {ecmaVersion: 6}},
        {code: "class A { a() {}static get[b]() {} }", options: [NEITHER], parserOptions: {ecmaVersion: 6}},
        {code: "({ get [b]() {} })", options: [override("get", BOTH)], parserOptions: {ecmaVersion: 6}},
        {code: "class A { a() {} get [b]() {} }", options: [override("get", BOTH)], parserOptions: {ecmaVersion: 6}},
        {code: "({ get[b]() {} })", options: [override("get", NEITHER)], parserOptions: {ecmaVersion: 6}},
        {code: "class A { a() {}get[b]() {} }", options: [override("get", NEITHER)], parserOptions: {ecmaVersion: 6}},

        // not conflict with `comma-spacing`
        {code: "({ a,get [b]() {} })", parserOptions: {ecmaVersion: 6}},
        {code: "({ a, get[b]() {} })", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        //----------------------------------------------------------------------
        // if
        //----------------------------------------------------------------------

        {code: "{} if (a) {}"},
        {code: "if (a) {} else if (a) {}"},
        {code: "{}if(a) {}", options: [NEITHER]},
        {code: "if(a) {}else if(a) {}", options: [NEITHER]},
        {code: "{} if (a) {}", options: [override("if", BOTH)]},
        {code: "if (a) {}else if (a) {}", options: [override("if", BOTH)]},
        {code: "{}if(a) {}", options: [override("if", NEITHER)]},
        {code: "if(a) {} else if(a) {}", options: [override("if", NEITHER)]},

        // not conflict with `block-spacing`
        {code: "{if (a) {} }"},
        {code: "{ if(a) {} }", options: [NEITHER]},

        // not conflict with `semi-spacing`
        {code: ";if (a) {}"},
        {code: "; if(a) {}", options: [NEITHER]},

        //----------------------------------------------------------------------
        // import
        //----------------------------------------------------------------------

        {code: "{} import {a} from \"foo\"", parserOptions: {sourceType: "module"}},
        {code: "{} import a from \"foo\"", parserOptions: {sourceType: "module"}},
        {code: "{} import * as a from \"a\"", parserOptions: {sourceType: "module"}},
        {code: "{}import{a}from\"foo\"", options: [NEITHER], parserOptions: {sourceType: "module"}},
        {code: "{}import*as a from\"foo\"", options: [NEITHER], parserOptions: {sourceType: "module"}},
        {code: "{} import {a}from\"foo\"", options: [override("import", BOTH)], parserOptions: {sourceType: "module"}},
        {code: "{} import *as a from\"foo\"", options: [override("import", BOTH)], parserOptions: {sourceType: "module"}},
        {code: "{}import{a} from \"foo\"", options: [override("import", NEITHER)], parserOptions: {sourceType: "module"}},
        {code: "{}import* as a from \"foo\"", options: [override("import", NEITHER)], parserOptions: {sourceType: "module"}},

        // not conflict with `semi-spacing`
        {code: ";import {a} from \"foo\"", parserOptions: {sourceType: "module"}},
        {code: "; import{a}from\"foo\"", options: [NEITHER], parserOptions: {sourceType: "module"}},

        //----------------------------------------------------------------------
        // in
        //----------------------------------------------------------------------

        {code: "for ([foo] in {foo: 0}) {}", parserOptions: {ecmaVersion: 6}},
        {code: "for([foo]in{foo: 0}) {}", options: [NEITHER], parserOptions: {ecmaVersion: 6}},
        {code: "for([foo] in {foo: 0}) {}", options: [override("in", BOTH)], parserOptions: {ecmaVersion: 6}},
        {code: "for ([foo]in{foo: 0}) {}", options: [override("in", NEITHER)], parserOptions: {ecmaVersion: 6}},

        // not conflict with `space-infix-ops`
        {code: "if (\"foo\"in{foo: 0}) {}"},
        {code: "if(\"foo\" in {foo: 0}) {}", options: [NEITHER]},

        //----------------------------------------------------------------------
        // instanceof
        //----------------------------------------------------------------------

        // not conflict with `space-infix-ops`
        {code: "if (\"foo\"instanceof{foo: 0}) {}"},
        {code: "if(\"foo\" instanceof {foo: 0}) {}", options: [NEITHER]},

        //----------------------------------------------------------------------
        // let
        //----------------------------------------------------------------------

        {code: "{} let [a] = b", parserOptions: {ecmaVersion: 6}},
        {code: "{}let[a] = b", options: [NEITHER], parserOptions: {ecmaVersion: 6}},
        {code: "{} let [a] = b", options: [override("let", BOTH)], parserOptions: {ecmaVersion: 6}},
        {code: "{}let[a] = b", options: [override("let", NEITHER)], parserOptions: {ecmaVersion: 6}},

        // not conflict with `block-spacing`
        {code: "{let [a] = b }", parserOptions: {ecmaVersion: 6}},
        {code: "{ let[a] = b }", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `semi-spacing`
        {code: ";let [a] = b", parserOptions: {ecmaVersion: 6}},
        {code: "; let[a] = b", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        //----------------------------------------------------------------------
        // new
        //----------------------------------------------------------------------

        {code: "{} new foo()"},
        {code: "{}new foo()", options: [NEITHER]},
        {code: "{} new foo()", options: [override("new", BOTH)]},
        {code: "{}new foo()", options: [override("new", NEITHER)]},

        // not conflict with `array-bracket-spacing`
        {code: "[new foo()]"},
        {code: "[ new foo()]", options: [NEITHER]},

        // not conflict with `arrow-spacing`
        {code: "(() =>new foo())", parserOptions: {ecmaVersion: 6}},
        {code: "(() => new foo())", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `block-spacing`
        {code: "{new foo() }"},
        {code: "{ new foo() }", options: [NEITHER]},

        // not conflict with `comma-spacing`
        {code: "(0,new foo())"},
        {code: "(0, new foo())", options: [NEITHER]},

        // not conflict with `computed-property-spacing`
        {code: "a[new foo()]"},
        {code: "({[new foo()]: 0})", parserOptions: {ecmaVersion: 6}},
        {code: "a[ new foo()]", options: [NEITHER]},
        {code: "({[ new foo()]: 0})", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `key-spacing`
        {code: "({a:new foo() })"},
        {code: "({a: new foo() })", options: [NEITHER]},

        // not conflict with `semi-spacing`
        {code: ";new foo()"},
        {code: "; new foo()", options: [NEITHER]},

        // not conflict with `space-in-parens`
        {code: "(new foo())"},
        {code: "( new foo())", options: [NEITHER]},

        // not conflict with `space-infix-ops`
        {code: "a =new foo()"},
        {code: "a = new foo()", options: [NEITHER]},

        // not conflict with `space-unary-ops`
        {code: "!new(foo)()"},
        {code: "! new (foo)()", options: [NEITHER]},

        // not conflict with `template-curly-spacing`
        {code: "`${new foo()}`", parserOptions: {ecmaVersion: 6}},
        {code: "`${ new foo()}`", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `jsx-curly-spacing`
        {code: "<Foo onClick={new foo()} />", parserOptions: {ecmaFeatures: {jsx: true}}},
        {code: "<Foo onClick={ new foo()} />", options: [NEITHER], parserOptions: {ecmaFeatures: {jsx: true}}},

        //----------------------------------------------------------------------
        // of
        //----------------------------------------------------------------------

        {code: "for ([foo] of {foo: 0}) {}", parserOptions: {ecmaVersion: 6}},
        {code: "for([foo]of{foo: 0}) {}", options: [NEITHER], parserOptions: {ecmaVersion: 6}},
        {code: "for([foo] of {foo: 0}) {}", options: [override("of", BOTH)], parserOptions: {ecmaVersion: 6}},
        {code: "for ([foo]of{foo: 0}) {}", options: [override("of", NEITHER)], parserOptions: {ecmaVersion: 6}},

        //----------------------------------------------------------------------
        // return
        //----------------------------------------------------------------------

        {code: "function foo() { {} return +a }"},
        {code: "function foo() { {}return+a }", options: [NEITHER]},
        {code: "function foo() { {} return +a }", options: [override("return", BOTH)]},
        {code: "function foo() { {}return+a }", options: [override("return", NEITHER)]},
        {code: "function foo() {\nreturn\n}"},
        {code: "function foo() {\nreturn\n}", options: [NEITHER]},

        // not conflict with `block-spacing`
        {code: "function foo() {return}"},
        {code: "function foo() { return }", options: [NEITHER]},

        // not conflict with `semi-spacing`
        {code: "function foo() { ;return; }"},
        {code: "function foo() { ; return ; }", options: [NEITHER]},

        //----------------------------------------------------------------------
        // set
        //----------------------------------------------------------------------

        {code: "({ set [b](value) {} })", parserOptions: {ecmaVersion: 6}},
        {code: "class A { a() {} set [b](value) {} }", parserOptions: {ecmaVersion: 6}},
        {code: "class A { a() {} static set [b](value) {} }", parserOptions: {ecmaVersion: 6}},
        {code: "({ set[b](value) {} })", options: [NEITHER], parserOptions: {ecmaVersion: 6}},
        {code: "class A { a() {}set[b](value) {} }", options: [NEITHER], parserOptions: {ecmaVersion: 6}},
        {code: "({ set [b](value) {} })", options: [override("set", BOTH)], parserOptions: {ecmaVersion: 6}},
        {code: "class A { a() {} set [b](value) {} }", options: [override("set", BOTH)], parserOptions: {ecmaVersion: 6}},
        {code: "({ set[b](value) {} })", options: [override("set", NEITHER)], parserOptions: {ecmaVersion: 6}},
        {code: "class A { a() {}set[b](value) {} }", options: [override("set", NEITHER)], parserOptions: {ecmaVersion: 6}},

        // not conflict with `comma-spacing`
        {code: "({ a,set [b](value) {} })", parserOptions: {ecmaVersion: 6}},
        {code: "({ a, set[b](value) {} })", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        //----------------------------------------------------------------------
        // static
        //----------------------------------------------------------------------

        {code: "class A { a() {} static [b]() {} }", parserOptions: {ecmaVersion: 6}},
        {code: "class A { a() {}static[b]() {} }", options: [NEITHER], parserOptions: {ecmaVersion: 6}},
        {code: "class A { a() {} static [b]() {} }", options: [override("static", BOTH)], parserOptions: {ecmaVersion: 6}},
        {code: "class A { a() {}static[b]() {} }", options: [override("static", NEITHER)], parserOptions: {ecmaVersion: 6}},

        // not conflict with `generator-star-spacing`
        {code: "class A { static* [a]() {} }", parserOptions: {ecmaVersion: 6}},
        {code: "class A { static *[a]() {} }", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `semi-spacing`
        {code: "class A { ;static a() {} }", parserOptions: {ecmaVersion: 6}},
        {code: "class A { ; static a() {} }", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        //----------------------------------------------------------------------
        // super
        //----------------------------------------------------------------------

        {code: "class A { a() { {} super[b]; } }", parserOptions: {ecmaVersion: 6}},
        {code: "class A { a() { {}super[b]; } }", options: [NEITHER], parserOptions: {ecmaVersion: 6}},
        {code: "class A { a() { {} super[b]; } }", options: [override("super", BOTH)], parserOptions: {ecmaVersion: 6}},
        {code: "class A { a() { {}super[b]; } }", options: [override("super", NEITHER)], parserOptions: {ecmaVersion: 6}},

        // not conflict with `array-bracket-spacing`
        {code: "class A { a() { [super]; } }", parserOptions: {ecmaVersion: 6}},
        {code: "class A { a() { [ super ]; } }", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `arrow-spacing`
        {code: "class A { a() { () =>super; } }", parserOptions: {ecmaVersion: 6}},
        {code: "class A { a() { () => super; } }", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `block-spacing`
        {code: "class A { a() {super} }", parserOptions: {ecmaVersion: 6}},
        {code: "class A { a() { super } }", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `comma-spacing`
        {code: "class A { a() { (0,super) } }", parserOptions: {ecmaVersion: 6}},
        {code: "class A { a() { (0, super) } }", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `computed-property-spacing`
        {code: "class A { a() { ({[super]: 0}) } }", parserOptions: {ecmaVersion: 6}},
        {code: "class A { a() { ({[ super ]: 0}) } }", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `key-spacing`
        {code: "class A { a() { ({a:super }) } }", parserOptions: {ecmaVersion: 6}},
        {code: "class A { a() { ({a: super }) } }", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `func-call-spacing`
        {code: "class A { constructor() { super(); } }", parserOptions: {ecmaVersion: 6}},
        {code: "class A { constructor() { super (); } }", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `semi-spacing`
        {code: "class A { a() { ;super; } }", parserOptions: {ecmaVersion: 6}},
        {code: "class A { a() { ; super ; } }", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `space-in-parens`
        {code: "class A { a() { (super) } }", parserOptions: {ecmaVersion: 6}},
        {code: "class A { a() { ( super ) } }", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `space-infix-ops`
        {code: "class A { a() { b =super } }", parserOptions: {ecmaVersion: 6}},
        {code: "class A { a() { b = super } }", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `space-unary-ops`
        {code: "class A { a() { !super } }", parserOptions: {ecmaVersion: 6}},
        {code: "class A { a() { ! super } }", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `template-curly-spacing`
        {code: "class A { a() { `${super}` } }", parserOptions: {ecmaVersion: 6}},
        {code: "class A { a() { `${ super }` } }", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `jsx-curly-spacing`
        {code: "class A { a() { <Foo onClick={super} /> } }", parserOptions: {ecmaVersion: 6, ecmaFeatures: {jsx: true}}},
        {code: "class A { a() { <Foo onClick={ super } /> } }", options: [NEITHER], parserOptions: {ecmaVersion: 6, ecmaFeatures: {jsx: true}}},

        //----------------------------------------------------------------------
        // switch
        //----------------------------------------------------------------------

        {code: "{} switch (a) {}"},
        {code: "{}switch(a) {}", options: [NEITHER]},
        {code: "{} switch (a) {}", options: [override("switch", BOTH)]},
        {code: "{}switch(a) {}", options: [override("switch", NEITHER)]},

        // not conflict with `block-spacing`
        {code: "{switch (a) {} }"},
        {code: "{ switch(a) {} }", options: [NEITHER]},

        // not conflict with `semi-spacing`
        {code: ";switch (a) {}"},
        {code: "; switch(a) {}", options: [NEITHER]},

        //----------------------------------------------------------------------
        // this
        //----------------------------------------------------------------------

        {code: "{} this[a]"},
        {code: "{}this[a]", options: [NEITHER]},
        {code: "{} this[a]", options: [override("this", BOTH)]},
        {code: "{}this[a]", options: [override("this", NEITHER)]},

        // not conflict with `array-bracket-spacing`
        {code: "[this]"},
        {code: "[ this ]", options: [NEITHER]},

        // not conflict with `arrow-spacing`
        {code: "(() =>this)", parserOptions: {ecmaVersion: 6}},
        {code: "(() => this)", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `block-spacing`
        {code: "{this}"},
        {code: "{ this }", options: [NEITHER]},

        // not conflict with `comma-spacing`
        {code: "(0,this)"},
        {code: "(0, this)", options: [NEITHER]},

        // not conflict with `computed-property-spacing`
        {code: "a[this]"},
        {code: "({[this]: 0})", parserOptions: {ecmaVersion: 6}},
        {code: "a[ this ]", options: [NEITHER]},
        {code: "({[ this ]: 0})", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `key-spacing`
        {code: "({a:this })"},
        {code: "({a: this })", options: [NEITHER]},

        // not conflict with `semi-spacing`
        {code: ";this"},
        {code: "; this", options: [NEITHER]},

        // not conflict with `space-in-parens`
        {code: "(this)"},
        {code: "( this )", options: [NEITHER]},

        // not conflict with `space-infix-ops`
        {code: "a =this"},
        {code: "a = this", options: [NEITHER]},

        // not conflict with `space-unary-ops`
        {code: "!this"},
        {code: "! this", options: [NEITHER]},

        // not conflict with `template-curly-spacing`
        {code: "`${this}`", parserOptions: {ecmaVersion: 6}},
        {code: "`${ this }`", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `jsx-curly-spacing`
        {code: "<Foo onClick={this} />", parserOptions: {ecmaFeatures: {jsx: true}}},
        {code: "<Foo onClick={ this } />", options: [NEITHER], parserOptions: {ecmaFeatures: {jsx: true}}},

        //----------------------------------------------------------------------
        // throw
        //----------------------------------------------------------------------

        {code: "function foo() { {} throw +a }"},
        {code: "function foo() { {}throw+a }", options: [NEITHER]},
        {code: "function foo() { {} throw +a }", options: [override("throw", BOTH)]},
        {code: "function foo() { {}throw+a }", options: [override("throw", NEITHER)]},
        {code: "function foo() {\nthrow a\n}"},
        {code: "function foo() {\nthrow a\n}", options: [NEITHER]},

        // not conflict with `block-spacing`
        {code: "function foo() {throw a }"},
        {code: "function foo() { throw a }", options: [NEITHER]},

        // not conflict with `semi-spacing`
        {code: "function foo() { ;throw a }"},
        {code: "function foo() { ; throw a }", options: [NEITHER]},

        //----------------------------------------------------------------------
        // try
        //----------------------------------------------------------------------

        {code: "{} try {} finally {}"},
        {code: "{}try{}finally{}", options: [NEITHER]},
        {code: "{} try {}finally{}", options: [override("try", BOTH)]},
        {code: "{}try{} finally {}", options: [override("try", NEITHER)]},

        // not conflict with `block-spacing`
        {code: "{try {} finally {}}"},
        {code: "{ try{}finally{}}", options: [NEITHER]},

        // not conflict with `semi-spacing`
        {code: ";try {} finally {}"},
        {code: "; try{}finally{}", options: [NEITHER]},

        //----------------------------------------------------------------------
        // typeof
        //----------------------------------------------------------------------

        {code: "{} typeof foo"},
        {code: "{}typeof foo", options: [NEITHER]},
        {code: "{} typeof foo", options: [override("typeof", BOTH)]},
        {code: "{}typeof foo", options: [override("typeof", NEITHER)]},

        // not conflict with `array-bracket-spacing`
        {code: "[typeof foo]"},
        {code: "[ typeof foo]", options: [NEITHER]},

        // not conflict with `arrow-spacing`
        {code: "(() =>typeof foo)", parserOptions: {ecmaVersion: 6}},
        {code: "(() => typeof foo)", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `block-spacing`
        {code: "{typeof foo }"},
        {code: "{ typeof foo }", options: [NEITHER]},

        // not conflict with `comma-spacing`
        {code: "(0,typeof foo)"},
        {code: "(0, typeof foo)", options: [NEITHER]},

        // not conflict with `computed-property-spacing`
        {code: "a[typeof foo]"},
        {code: "({[typeof foo]: 0})", parserOptions: {ecmaVersion: 6}},
        {code: "a[ typeof foo]", options: [NEITHER]},
        {code: "({[ typeof foo]: 0})", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `key-spacing`
        {code: "({a:typeof foo })"},
        {code: "({a: typeof foo })", options: [NEITHER]},

        // not conflict with `semi-spacing`
        {code: ";typeof foo"},
        {code: "; typeof foo", options: [NEITHER]},

        // not conflict with `space-in-parens`
        {code: "(typeof foo)"},
        {code: "( typeof foo)", options: [NEITHER]},

        // not conflict with `space-infix-ops`
        {code: "a =typeof foo"},
        {code: "a = typeof foo", options: [NEITHER]},

        // not conflict with `space-unary-ops`
        {code: "!typeof+foo"},
        {code: "! typeof +foo", options: [NEITHER]},

        // not conflict with `template-curly-spacing`
        {code: "`${typeof foo}`", parserOptions: {ecmaVersion: 6}},
        {code: "`${ typeof foo}`", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `jsx-curly-spacing`
        {code: "<Foo onClick={typeof foo} />", parserOptions: {ecmaFeatures: {jsx: true}}},
        {code: "<Foo onClick={ typeof foo} />", options: [NEITHER], parserOptions: {ecmaFeatures: {jsx: true}}},

        //----------------------------------------------------------------------
        // var
        //----------------------------------------------------------------------

        {code: "{} var [a] = b", parserOptions: {ecmaVersion: 6}},
        {code: "{}var[a] = b", options: [NEITHER], parserOptions: {ecmaVersion: 6}},
        {code: "{} var [a] = b", options: [override("var", BOTH)], parserOptions: {ecmaVersion: 6}},
        {code: "{}var[a] = b", options: [override("var", NEITHER)], parserOptions: {ecmaVersion: 6}},
        {code: "for (var foo in [1, 2, 3]) {}"},

        // not conflict with `block-spacing`
        {code: "{var a = b }"},
        {code: "{ var a = b }", options: [NEITHER]},

        // not conflict with `semi-spacing`
        {code: ";var a = b"},
        {code: "; var a = b", options: [NEITHER]},

        //----------------------------------------------------------------------
        // void
        //----------------------------------------------------------------------

        {code: "{} void foo"},
        {code: "{}void foo", options: [NEITHER]},
        {code: "{} void foo", options: [override("void", BOTH)]},
        {code: "{}void foo", options: [override("void", NEITHER)]},

        // not conflict with `array-bracket-spacing`
        {code: "[void foo]"},
        {code: "[ void foo]", options: [NEITHER]},

        // not conflict with `arrow-spacing`
        {code: "(() =>void foo)", parserOptions: {ecmaVersion: 6}},
        {code: "(() => void foo)", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `block-spacing`
        {code: "{void foo }"},
        {code: "{ void foo }", options: [NEITHER]},

        // not conflict with `comma-spacing`
        {code: "(0,void foo)"},
        {code: "(0, void foo)", options: [NEITHER]},

        // not conflict with `computed-property-spacing`
        {code: "a[void foo]"},
        {code: "({[void foo]: 0})", parserOptions: {ecmaVersion: 6}},
        {code: "a[ void foo]", options: [NEITHER]},
        {code: "({[ void foo]: 0})", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `key-spacing`
        {code: "({a:void foo })"},
        {code: "({a: void foo })", options: [NEITHER]},

        // not conflict with `semi-spacing`
        {code: ";void foo"},
        {code: "; void foo", options: [NEITHER]},

        // not conflict with `space-in-parens`
        {code: "(void foo)"},
        {code: "( void foo)", options: [NEITHER]},

        // not conflict with `space-infix-ops`
        {code: "a =void foo"},
        {code: "a = void foo", options: [NEITHER]},

        // not conflict with `space-unary-ops`
        {code: "!void+foo"},
        {code: "! void +foo", options: [NEITHER]},

        // not conflict with `template-curly-spacing`
        {code: "`${void foo}`", parserOptions: {ecmaVersion: 6}},
        {code: "`${ void foo}`", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `jsx-curly-spacing`
        {code: "<Foo onClick={void foo} />", parserOptions: {ecmaFeatures: {jsx: true}}},
        {code: "<Foo onClick={ void foo} />", options: [NEITHER], parserOptions: {ecmaFeatures: {jsx: true}}},

        //----------------------------------------------------------------------
        // while
        //----------------------------------------------------------------------

        {code: "{} while (a) {}"},
        {code: "do {} while (a)"},
        {code: "{}while(a) {}", options: [NEITHER]},
        {code: "do{}while(a)", options: [NEITHER]},
        {code: "{} while (a) {}", options: [override("while", BOTH)]},
        {code: "do{} while (a)", options: [override("while", BOTH)]},
        {code: "{}while(a) {}", options: [override("while", NEITHER)]},
        {code: "do {}while(a)", options: [override("while", NEITHER)]},
        {code: "do {}\nwhile (a)"},
        {code: "do{}\nwhile(a)", options: [NEITHER]},

        // not conflict with `block-spacing`
        {code: "{while (a) {}}"},
        {code: "{ while(a) {}}", options: [NEITHER]},

        // not conflict with `semi-spacing`
        {code: ";while (a);"},
        {code: "do;while (a);"},
        {code: "; while(a) ;", options: [NEITHER]},
        {code: "do ; while(a) ;", options: [NEITHER]},

        //----------------------------------------------------------------------
        // with
        //----------------------------------------------------------------------

        {code: "{} with (obj) {}"},
        {code: "{}with(obj) {}", options: [NEITHER]},
        {code: "{} with (obj) {}", options: [override("with", BOTH)]},
        {code: "{}with(obj) {}", options: [override("with", NEITHER)]},

        // not conflict with `block-spacing`
        {code: "{with (obj) {}}"},
        {code: "{ with(obj) {}}", options: [NEITHER]},

        // not conflict with `semi-spacing`
        {code: ";with (obj) {}"},
        {code: "; with(obj) {}", options: [NEITHER]},

        //----------------------------------------------------------------------
        // yield
        //----------------------------------------------------------------------

        {code: "function* foo() { {} yield foo }", parserOptions: {ecmaVersion: 6}},
        {code: "function* foo() { {}yield foo }", options: [NEITHER], parserOptions: {ecmaVersion: 6}},
        {code: "function* foo() { {} yield foo }", options: [override("yield", BOTH)], parserOptions: {ecmaVersion: 6}},
        {code: "function* foo() { {}yield foo }", options: [override("yield", NEITHER)], parserOptions: {ecmaVersion: 6}},

        // not conflict with `array-bracket-spacing`
        {code: "function* foo() { [yield] }", parserOptions: {ecmaVersion: 6}},
        {code: "function* foo() { [ yield ] }", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // This is invalid syntax: https://github.com/eslint/eslint/issues/5405
        // not conflict with `arrow-spacing`
        // {code: "function* foo() { (() =>yield foo) }", parserOptions: {ecmaVersion: 6}},
        // {code: "function* foo() { (() => yield foo) }", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `block-spacing`
        {code: "function* foo() {yield}", parserOptions: {ecmaVersion: 6}},
        {code: "function* foo() { yield }", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `comma-spacing`
        {code: "function* foo() { (0,yield foo) }", parserOptions: {ecmaVersion: 6}},
        {code: "function* foo() { (0, yield foo) }", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `computed-property-spacing`
        {code: "function* foo() { a[yield] }", parserOptions: {ecmaVersion: 6}},
        {code: "function* foo() { ({[yield]: 0}) }", parserOptions: {ecmaVersion: 6}},
        {code: "function* foo() { a[ yield ] }", options: [NEITHER], parserOptions: {ecmaVersion: 6}},
        {code: "function* foo() { ({[ yield ]: 0}) }", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `key-spacing`
        {code: "function* foo() { ({a:yield foo }) }", parserOptions: {ecmaVersion: 6}},
        {code: "function* foo() { ({a: yield foo }) }", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `semi-spacing`
        {code: "function* foo() { ;yield; }", parserOptions: {ecmaVersion: 6}},
        {code: "function* foo() { ; yield ; }", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `space-in-parens`
        {code: "function* foo() { (yield) }", parserOptions: {ecmaVersion: 6}},
        {code: "function* foo() { ( yield ) }", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `space-infix-ops`
        {code: "function* foo() { a =yield foo }", parserOptions: {ecmaVersion: 6}},
        {code: "function* foo() { a = yield foo }", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `space-unary-ops`
        {code: "function* foo() { yield+foo }", parserOptions: {ecmaVersion: 6}},
        {code: "function* foo() { yield +foo }", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `template-curly-spacing`
        {code: "`${yield}`", parserOptions: {ecmaVersion: 6}},
        {code: "`${ yield}`", options: [NEITHER], parserOptions: {ecmaVersion: 6}},

        // not conflict with `jsx-curly-spacing`
        {code: "function* foo() { <Foo onClick={yield} /> }", parserOptions: {ecmaVersion: 6, ecmaFeatures: {jsx: true}}},
        {code: "function* foo() { <Foo onClick={ yield } /> }", options: [NEITHER], parserOptions: {ecmaVersion: 6, ecmaFeatures: {jsx: true}}}
    ],

    invalid: [

        //----------------------------------------------------------------------
        // as
        //----------------------------------------------------------------------

        {
            code: "import *as a from \"foo\"",
            output: "import * as a from \"foo\"",
            errors: expectedBefore("as"),
            parserOptions: {sourceType: "module"}
        },
        {
            code: "import* as a from\"foo\"",
            output: "import*as a from\"foo\"",
            errors: unexpectedBefore("as"),
            options: [NEITHER],
            parserOptions: {sourceType: "module"}
        },
        {
            code: "import*as a from\"foo\"",
            output: "import* as a from\"foo\"",
            errors: expectedBefore("as"),
            options: [override("as", BOTH)],
            parserOptions: {sourceType: "module"}
        },
        {
            code: "import * as a from \"foo\"",
            output: "import *as a from \"foo\"",
            errors: unexpectedBefore("as"),
            options: [override("as", NEITHER)],
            parserOptions: {sourceType: "module"}
        },

        //----------------------------------------------------------------------
        // async
        //----------------------------------------------------------------------

        {
            code: "{}async function foo() {}",
            output: "{} async function foo() {}",
            errors: expectedBefore("async"),
            parserOptions: {ecmaVersion: 8}
        },
        {
            code: "{} async function foo() {}",
            output: "{}async function foo() {}",
            errors: unexpectedBefore("async"),
            options: [NEITHER],
            parserOptions: {ecmaVersion: 8}
        },
        {
            code: "{}async function foo() {}",
            output: "{} async function foo() {}",
            errors: expectedBefore("async"),
            options: [override("async", BOTH)],
            parserOptions: {ecmaVersion: 8}
        },
        {
            code: "{} async function foo() {}",
            output: "{}async function foo() {}",
            errors: unexpectedBefore("async"),
            options: [override("async", NEITHER)],
            parserOptions: {ecmaVersion: 8}
        },
        {
            code: "{}async () => {}",
            output: "{} async () => {}",
            errors: expectedBefore("async"),
            parserOptions: {ecmaVersion: 8}
        },
        {
            code: "{} async () => {}",
            output: "{}async () => {}",
            errors: unexpectedBefore("async"),
            options: [NEITHER],
            parserOptions: {ecmaVersion: 8}
        },
        {
            code: "{}async () => {}",
            output: "{} async () => {}",
            errors: expectedBefore("async"),
            options: [override("async", BOTH)],
            parserOptions: {ecmaVersion: 8}
        },
        {
            code: "{} async () => {}",
            output: "{}async () => {}",
            errors: unexpectedBefore("async"),
            options: [override("async", NEITHER)],
            parserOptions: {ecmaVersion: 8}
        },
        {
            code: "({async[b]() {}})",
            output: "({async [b]() {}})",
            errors: expectedAfter("async"),
            parserOptions: {ecmaVersion: 8}
        },
        {
            code: "({async [b]() {}})",
            output: "({async[b]() {}})",
            errors: unexpectedAfter("async"),
            options: [NEITHER],
            parserOptions: {ecmaVersion: 8}
        },
        {
            code: "({async[b]() {}})",
            output: "({async [b]() {}})",
            errors: expectedAfter("async"),
            options: [override("async", BOTH)],
            parserOptions: {ecmaVersion: 8}
        },
        {
            code: "({async [b]() {}})",
            output: "({async[b]() {}})",
            errors: unexpectedAfter("async"),
            options: [override("async", NEITHER)],
            parserOptions: {ecmaVersion: 8}
        },
        {
            code: "class A {a(){}async[b]() {}}",
            output: "class A {a(){} async [b]() {}}",
            errors: expectedBeforeAndAfter("async"),
            parserOptions: {ecmaVersion: 8}
        },
        {
            code: "class A {a(){} async [b]() {}}",
            output: "class A {a(){}async[b]() {}}",
            errors: unexpectedBeforeAndAfter("async"),
            options: [NEITHER],
            parserOptions: {ecmaVersion: 8}
        },
        {
            code: "class A {a(){}async[b]() {}}",
            output: "class A {a(){} async [b]() {}}",
            errors: expectedBeforeAndAfter("async"),
            options: [override("async", BOTH)],
            parserOptions: {ecmaVersion: 8}
        },
        {
            code: "class A {a(){} async [b]() {}}",
            output: "class A {a(){}async[b]() {}}",
            errors: unexpectedBeforeAndAfter("async"),
            options: [override("async", NEITHER)],
            parserOptions: {ecmaVersion: 8}
        },

        //----------------------------------------------------------------------
        // await
        //----------------------------------------------------------------------

        {
            code: "async function wrap() { {}await a }",
            output: "async function wrap() { {} await a }",
            errors: expectedBefore("await"),
            parserOptions: {ecmaVersion: 8}
        },
        {
            code: "async function wrap() { {} await a }",
            output: "async function wrap() { {}await a }",
            errors: unexpectedBefore("await"),
            options: [NEITHER],
            parserOptions: {ecmaVersion: 8}
        },
        {
            code: "async function wrap() { {}await a }",
            output: "async function wrap() { {} await a }",
            errors: expectedBefore("await"),
            options: [override("await", BOTH)],
            parserOptions: {ecmaVersion: 8}
        },
        {
            code: "async function wrap() { {} await a }",
            output: "async function wrap() { {}await a }",
            errors: unexpectedBefore("await"),
            options: [override("await", NEITHER)],
            parserOptions: {ecmaVersion: 8}
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
            errors: unexpectedBefore("break"),
            options: [NEITHER]
        },
        {
            code: "A: for(;;) { {}break A; }",
            output: "A: for(;;) { {} break A; }",
            errors: expectedBefore("break"),
            options: [override("break", BOTH)]
        },
        {
            code: "A: for (;;) { {} break A; }",
            output: "A: for (;;) { {}break A; }",
            errors: unexpectedBefore("break"),
            options: [override("break", NEITHER)]
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
            errors: unexpectedBeforeAndAfter("case"),
            options: [NEITHER]
        },
        {
            code: "switch(a) { case 0: {} case (1): }",
            output: "switch(a) { case 0: {}case(1): }",
            errors: unexpectedBeforeAndAfter("case"),
            options: [NEITHER]
        },
        {
            code: "switch(a) { case 0: {}case+1: }",
            output: "switch(a) { case 0: {} case +1: }",
            errors: expectedBeforeAndAfter("case"),
            options: [override("case", BOTH)]
        },
        {
            code: "switch (a) { case 0: {} case +1: }",
            output: "switch (a) { case 0: {}case+1: }",
            errors: unexpectedBeforeAndAfter("case"),
            options: [override("case", NEITHER)]
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
            errors: unexpectedBeforeAndAfter("catch"),
            options: [NEITHER]
        },
        {
            code: "try{}catch(e) {}",
            output: "try{} catch (e) {}",
            errors: expectedBeforeAndAfter("catch"),
            options: [override("catch", BOTH)]
        },
        {
            code: "try {} catch (e) {}",
            output: "try {}catch(e) {}",
            errors: unexpectedBeforeAndAfter("catch"),
            options: [override("catch", NEITHER)]
        },

        //----------------------------------------------------------------------
        // class
        //----------------------------------------------------------------------

        {
            code: "{}class Bar {}",
            output: "{} class Bar {}",
            errors: expectedBefore("class"),
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "(class{})",
            output: "(class {})",
            errors: expectedAfter("class"),
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "{} class Bar {}",
            output: "{}class Bar {}",
            errors: unexpectedBefore("class"),
            options: [NEITHER],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "(class {})",
            output: "(class{})",
            errors: unexpectedAfter("class"),
            options: [NEITHER],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "{}class Bar {}",
            output: "{} class Bar {}",
            errors: expectedBefore("class"),
            options: [override("class", BOTH)],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "{} class Bar {}",
            output: "{}class Bar {}",
            errors: unexpectedBefore("class"),
            options: [override("class", NEITHER)],
            parserOptions: {ecmaVersion: 6}
        },

        //----------------------------------------------------------------------
        // const
        //----------------------------------------------------------------------

        {
            code: "{}const[a] = b",
            output: "{} const [a] = b",
            errors: expectedBeforeAndAfter("const"),
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "{}const{a} = b",
            output: "{} const {a} = b",
            errors: expectedBeforeAndAfter("const"),
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "{} const [a] = b",
            output: "{}const[a] = b",
            errors: unexpectedBeforeAndAfter("const"),
            options: [NEITHER],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "{} const {a} = b",
            output: "{}const{a} = b",
            errors: unexpectedBeforeAndAfter("const"),
            options: [NEITHER],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "{}const[a] = b",
            output: "{} const [a] = b",
            errors: expectedBeforeAndAfter("const"),
            options: [override("const", BOTH)],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "{}const{a} = b",
            output: "{} const {a} = b",
            errors: expectedBeforeAndAfter("const"),
            options: [override("const", BOTH)],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "{} const [a] = b",
            output: "{}const[a] = b",
            errors: unexpectedBeforeAndAfter("const"),
            options: [override("const", NEITHER)],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "{} const {a} = b",
            output: "{}const{a} = b",
            errors: unexpectedBeforeAndAfter("const"),
            options: [override("const", NEITHER)],
            parserOptions: {ecmaVersion: 6}
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
            errors: unexpectedBefore("continue"),
            options: [NEITHER]
        },
        {
            code: "A: for(;;) { {}continue A; }",
            output: "A: for(;;) { {} continue A; }",
            errors: expectedBefore("continue"),
            options: [override("continue", BOTH)]
        },
        {
            code: "A: for (;;) { {} continue A; }",
            output: "A: for (;;) { {}continue A; }",
            errors: unexpectedBefore("continue"),
            options: [override("continue", NEITHER)]
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
            errors: unexpectedBefore("debugger"),
            options: [NEITHER]
        },
        {
            code: "{}debugger",
            output: "{} debugger",
            errors: expectedBefore("debugger"),
            options: [override("debugger", BOTH)]
        },
        {
            code: "{} debugger",
            output: "{}debugger",
            errors: unexpectedBefore("debugger"),
            options: [override("debugger", NEITHER)]
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
            errors: unexpectedBefore("default"),
            options: [NEITHER]
        },
        {
            code: "switch(a) { case 0: {}default: }",
            output: "switch(a) { case 0: {} default: }",
            errors: expectedBefore("default"),
            options: [override("default", BOTH)]
        },
        {
            code: "switch (a) { case 0: {} default: }",
            output: "switch (a) { case 0: {}default: }",
            errors: unexpectedBefore("default"),
            options: [override("default", NEITHER)]
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
            errors: unexpectedBefore("delete"),
            options: [NEITHER]
        },
        {
            code: "{}delete foo.a",
            output: "{} delete foo.a",
            errors: expectedBefore("delete"),
            options: [override("delete", BOTH)]
        },
        {
            code: "{} delete foo.a",
            output: "{}delete foo.a",
            errors: unexpectedBefore("delete"),
            options: [override("delete", NEITHER)]
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
            errors: unexpectedBeforeAndAfter("do"),
            options: [NEITHER]
        },
        {
            code: "{}do{}while(true)",
            output: "{} do {}while(true)",
            errors: expectedBeforeAndAfter("do"),
            options: [override("do", BOTH)]
        },
        {
            code: "{} do {} while (true)",
            output: "{}do{} while (true)",
            errors: unexpectedBeforeAndAfter("do"),
            options: [override("do", NEITHER)]
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
            errors: unexpectedBeforeAndAfter("else"),
            options: [NEITHER]
        },
        {
            code: "if(a){} else if(b) {}",
            output: "if(a){}else if(b) {}",
            errors: unexpectedBefore("else"),
            options: [NEITHER]
        },
        {
            code: "if(a) {} else (0)",
            output: "if(a) {}else(0)",
            errors: unexpectedBeforeAndAfter("else"),
            options: [NEITHER]
        },
        {
            code: "if(a) {} else []",
            output: "if(a) {}else[]",
            errors: unexpectedBeforeAndAfter("else"),
            options: [NEITHER]
        },
        {
            code: "if(a) {} else +1",
            output: "if(a) {}else+1",
            errors: unexpectedBeforeAndAfter("else"),
            options: [NEITHER]
        },
        {
            code: "if(a) {} else \"a\"",
            output: "if(a) {}else\"a\"",
            errors: unexpectedBeforeAndAfter("else"),
            options: [NEITHER]
        },
        {
            code: "if(a) {}else{}",
            output: "if(a) {} else {}",
            errors: expectedBeforeAndAfter("else"),
            options: [override("else", BOTH)]
        },
        {
            code: "if (a) {} else {}",
            output: "if (a) {}else{}",
            errors: unexpectedBeforeAndAfter("else"),
            options: [override("else", NEITHER)]
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
            errors: unexpectedBefore("else"),
            options: [NEITHER]
        },
        {
            code: "if(a) {}else {}",
            output: "if(a) {}else{}",
            errors: unexpectedAfter("else"),
            options: [NEITHER]
        },

        //----------------------------------------------------------------------
        // export
        //----------------------------------------------------------------------

        {
            code: "{}export{a}",
            output: "{} export {a}",
            errors: expectedBeforeAndAfter("export"),
            parserOptions: {sourceType: "module"}
        },
        {
            code: "{}export default a",
            output: "{} export default a",
            errors: expectedBefore("export"),
            parserOptions: {sourceType: "module"}
        },
        {
            code: "{}export* from \"a\"",
            output: "{} export * from \"a\"",
            errors: expectedBeforeAndAfter("export"),
            parserOptions: {sourceType: "module"}
        },
        {
            code: "{} export {a}",
            output: "{}export{a}",
            errors: unexpectedBeforeAndAfter("export"),
            options: [NEITHER],
            parserOptions: {sourceType: "module"}
        },
        {
            code: "{}export{a}",
            output: "{} export {a}",
            errors: expectedBeforeAndAfter("export"),
            options: [override("export", BOTH)],
            parserOptions: {sourceType: "module"}
        },
        {
            code: "{} export {a}",
            output: "{}export{a}",
            errors: unexpectedBeforeAndAfter("export"),
            options: [override("export", NEITHER)],
            parserOptions: {sourceType: "module"}
        },

        //----------------------------------------------------------------------
        // extends
        //----------------------------------------------------------------------

        {
            code: "class Bar extends[] {}",
            output: "class Bar extends [] {}",
            errors: expectedAfter("extends"),
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "(class extends[] {})",
            output: "(class extends [] {})",
            errors: expectedAfter("extends"),
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "class Bar extends [] {}",
            output: "class Bar extends[] {}",
            errors: unexpectedAfter("extends"),
            options: [NEITHER],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "(class extends [] {})",
            output: "(class extends[] {})",
            errors: unexpectedAfter("extends"),
            options: [NEITHER],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "class Bar extends[] {}",
            output: "class Bar extends [] {}",
            errors: expectedAfter("extends"),
            options: [override("extends", BOTH)],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "class Bar extends [] {}",
            output: "class Bar extends[] {}",
            errors: unexpectedAfter("extends"),
            options: [override("extends", NEITHER)],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "class Bar extends`}` {}",
            output: "class Bar extends `}` {}",
            errors: expectedAfter("extends"),
            parserOptions: {ecmaVersion: 6}
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
            errors: unexpectedBeforeAndAfter("finally"),
            options: [NEITHER]
        },
        {
            code: "try{}finally{}",
            output: "try{} finally {}",
            errors: expectedBeforeAndAfter("finally"),
            options: [override("finally", BOTH)]
        },
        {
            code: "try {} finally {}",
            output: "try {}finally{}",
            errors: unexpectedBeforeAndAfter("finally"),
            options: [override("finally", NEITHER)]
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
            errors: expectedBeforeAndAfter("for"),
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "{} for (;;) {}",
            output: "{}for(;;) {}",
            errors: unexpectedBeforeAndAfter("for"),
            options: [NEITHER]
        },
        {
            code: "{} for (var foo in obj) {}",
            output: "{}for(var foo in obj) {}",
            errors: unexpectedBeforeAndAfter("for"),
            options: [NEITHER]
        },
        {
            code: "{} for (var foo of list) {}",
            output: "{}for(var foo of list) {}",
            errors: unexpectedBeforeAndAfter("for"),
            options: [NEITHER],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "{}for(;;) {}",
            output: "{} for (;;) {}",
            errors: expectedBeforeAndAfter("for"),
            options: [override("for", BOTH)]
        },
        {
            code: "{}for(var foo in obj) {}",
            output: "{} for (var foo in obj) {}",
            errors: expectedBeforeAndAfter("for"),
            options: [override("for", BOTH)]
        },
        {
            code: "{}for(var foo of list) {}",
            output: "{} for (var foo of list) {}",
            errors: expectedBeforeAndAfter("for"),
            options: [override("for", BOTH)],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "{} for (;;) {}",
            output: "{}for(;;) {}",
            errors: unexpectedBeforeAndAfter("for"),
            options: [override("for", NEITHER)]
        },
        {
            code: "{} for (var foo in obj) {}",
            output: "{}for(var foo in obj) {}",
            errors: unexpectedBeforeAndAfter("for"),
            options: [override("for", NEITHER)]
        },
        {
            code: "{} for (var foo of list) {}",
            output: "{}for(var foo of list) {}",
            errors: unexpectedBeforeAndAfter("for"),
            options: [override("for", NEITHER)],
            parserOptions: {ecmaVersion: 6}
        },

        //----------------------------------------------------------------------
        // from
        //----------------------------------------------------------------------

        {
            code: "import {foo}from\"foo\"",
            output: "import {foo} from \"foo\"",
            errors: expectedBeforeAndAfter("from"),
            parserOptions: {sourceType: "module"}
        },
        {
            code: "export {foo}from\"foo\"",
            output: "export {foo} from \"foo\"",
            errors: expectedBeforeAndAfter("from"),
            parserOptions: {sourceType: "module"}
        },
        {
            code: "export *from\"foo\"",
            output: "export * from \"foo\"",
            errors: expectedBeforeAndAfter("from"),
            parserOptions: {sourceType: "module"}
        },
        {
            code: "import{foo} from \"foo\"",
            output: "import{foo}from\"foo\"",
            errors: unexpectedBeforeAndAfter("from"),
            options: [NEITHER],
            parserOptions: {sourceType: "module"}
        },
        {
            code: "export{foo} from \"foo\"",
            output: "export{foo}from\"foo\"",
            errors: unexpectedBeforeAndAfter("from"),
            options: [NEITHER],
            parserOptions: {sourceType: "module"}
        },
        {
            code: "export* from \"foo\"",
            output: "export*from\"foo\"",
            errors: unexpectedBeforeAndAfter("from"),
            options: [NEITHER],
            parserOptions: {sourceType: "module"}
        },
        {
            code: "import{foo}from\"foo\"",
            output: "import{foo} from \"foo\"",
            errors: expectedBeforeAndAfter("from"),
            options: [override("from", BOTH)],
            parserOptions: {sourceType: "module"}
        },
        {
            code: "export{foo}from\"foo\"",
            output: "export{foo} from \"foo\"",
            errors: expectedBeforeAndAfter("from"),
            options: [override("from", BOTH)],
            parserOptions: {sourceType: "module"}
        },
        {
            code: "export*from\"foo\"",
            output: "export* from \"foo\"",
            errors: expectedBeforeAndAfter("from"),
            options: [override("from", BOTH)],
            parserOptions: {sourceType: "module"}
        },
        {
            code: "import {foo} from \"foo\"",
            output: "import {foo}from\"foo\"",
            errors: unexpectedBeforeAndAfter("from"),
            options: [override("from", NEITHER)],
            parserOptions: {sourceType: "module"}
        },
        {
            code: "export {foo} from \"foo\"",
            output: "export {foo}from\"foo\"",
            errors: unexpectedBeforeAndAfter("from"),
            options: [override("from", NEITHER)],
            parserOptions: {sourceType: "module"}
        },
        {
            code: "export * from \"foo\"",
            output: "export *from\"foo\"",
            errors: unexpectedBeforeAndAfter("from"),
            options: [override("from", NEITHER)],
            parserOptions: {sourceType: "module"}
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
            errors: unexpectedBefore("function"),
            options: [NEITHER]
        },
        {
            code: "{}function foo() {}",
            output: "{} function foo() {}",
            errors: expectedBefore("function"),
            options: [override("function", BOTH)]
        },
        {
            code: "{} function foo() {}",
            output: "{}function foo() {}",
            errors: unexpectedBefore("function"),
            options: [override("function", NEITHER)]
        },

        //----------------------------------------------------------------------
        // get
        //----------------------------------------------------------------------

        {
            code: "({ get[b]() {} })",
            output: "({ get [b]() {} })",
            errors: expectedAfter("get"),
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "class A { a() {}get[b]() {} }",
            output: "class A { a() {} get [b]() {} }",
            errors: expectedBeforeAndAfter("get"),
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "class A { a() {} static get[b]() {} }",
            output: "class A { a() {} static get [b]() {} }",
            errors: expectedAfter("get"),
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "({ get [b]() {} })",
            output: "({ get[b]() {} })",
            errors: unexpectedAfter("get"),
            options: [NEITHER],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "class A { a() {} get [b]() {} }",
            output: "class A { a() {}get[b]() {} }",
            errors: unexpectedBeforeAndAfter("get"),
            options: [NEITHER],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "class A { a() {}static get [b]() {} }",
            output: "class A { a() {}static get[b]() {} }",
            errors: unexpectedAfter("get"),
            options: [NEITHER],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "({ get[b]() {} })",
            output: "({ get [b]() {} })",
            errors: expectedAfter("get"),
            options: [override("get", BOTH)],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "class A { a() {}get[b]() {} }",
            output: "class A { a() {} get [b]() {} }",
            errors: expectedBeforeAndAfter("get"),
            options: [override("get", BOTH)],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "({ get [b]() {} })",
            output: "({ get[b]() {} })",
            errors: unexpectedAfter("get"),
            options: [override("get", NEITHER)],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "class A { a() {} get [b]() {} }",
            output: "class A { a() {}get[b]() {} }",
            errors: unexpectedBeforeAndAfter("get"),
            options: [override("get", NEITHER)],
            parserOptions: {ecmaVersion: 6}
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
            errors: unexpectedBeforeAndAfter("if"),
            options: [NEITHER]
        },
        {
            code: "if(a) {}else if (b) {}",
            output: "if(a) {}else if(b) {}",
            errors: unexpectedAfter("if"),
            options: [NEITHER]
        },
        {
            code: "{}if(a) {}",
            output: "{} if (a) {}",
            errors: expectedBeforeAndAfter("if"),
            options: [override("if", BOTH)]
        },
        {
            code: "if (a) {}else if(b) {}",
            output: "if (a) {}else if (b) {}",
            errors: expectedAfter("if"),
            options: [override("if", BOTH)]
        },
        {
            code: "{} if (a) {}",
            output: "{}if(a) {}",
            errors: unexpectedBeforeAndAfter("if"),
            options: [override("if", NEITHER)]
        },
        {
            code: "if(a) {} else if (b) {}",
            output: "if(a) {} else if(b) {}",
            errors: unexpectedAfter("if"),
            options: [override("if", NEITHER)]
        },

        //----------------------------------------------------------------------
        // import
        //----------------------------------------------------------------------

        {
            code: "{}import{a} from \"foo\"",
            output: "{} import {a} from \"foo\"",
            errors: expectedBeforeAndAfter("import"),
            parserOptions: {sourceType: "module"}
        },
        {
            code: "{}import a from \"foo\"",
            output: "{} import a from \"foo\"",
            errors: expectedBefore("import"),
            parserOptions: {sourceType: "module"}
        },
        {
            code: "{}import* as a from \"a\"",
            output: "{} import * as a from \"a\"",
            errors: expectedBeforeAndAfter("import"),
            parserOptions: {sourceType: "module"}
        },
        {
            code: "{} import {a}from\"foo\"",
            output: "{}import{a}from\"foo\"",
            errors: unexpectedBeforeAndAfter("import"),
            options: [NEITHER],
            parserOptions: {sourceType: "module"}
        },
        {
            code: "{} import *as a from\"foo\"",
            output: "{}import*as a from\"foo\"",
            errors: unexpectedBeforeAndAfter("import"),
            options: [NEITHER],
            parserOptions: {sourceType: "module"}
        },
        {
            code: "{}import{a}from\"foo\"",
            output: "{} import {a}from\"foo\"",
            errors: expectedBeforeAndAfter("import"),
            options: [override("import", BOTH)],
            parserOptions: {sourceType: "module"}
        },
        {
            code: "{}import*as a from\"foo\"",
            output: "{} import *as a from\"foo\"",
            errors: expectedBeforeAndAfter("import"),
            options: [override("import", BOTH)],
            parserOptions: {sourceType: "module"}
        },
        {
            code: "{} import {a} from \"foo\"",
            output: "{}import{a} from \"foo\"",
            errors: unexpectedBeforeAndAfter("import"),
            options: [override("import", NEITHER)],
            parserOptions: {sourceType: "module"}
        },
        {
            code: "{} import * as a from \"foo\"",
            output: "{}import* as a from \"foo\"",
            errors: unexpectedBeforeAndAfter("import"),
            options: [override("import", NEITHER)],
            parserOptions: {sourceType: "module"}
        },

        //----------------------------------------------------------------------
        // in
        //----------------------------------------------------------------------

        {
            code: "for ([foo]in{foo: 0}) {}",
            output: "for ([foo] in {foo: 0}) {}",
            errors: expectedBeforeAndAfter("in"),
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "for([foo] in {foo: 0}) {}",
            output: "for([foo]in{foo: 0}) {}",
            errors: unexpectedBeforeAndAfter("in"),
            options: [NEITHER],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "for([foo]in{foo: 0}) {}",
            output: "for([foo] in {foo: 0}) {}",
            errors: expectedBeforeAndAfter("in"),
            options: [override("in", BOTH)],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "for ([foo] in {foo: 0}) {}",
            output: "for ([foo]in{foo: 0}) {}",
            errors: unexpectedBeforeAndAfter("in"),
            options: [override("in", NEITHER)],
            parserOptions: {ecmaVersion: 6}
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
            errors: expectedBeforeAndAfter("let"),
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "{} let [a] = b",
            output: "{}let[a] = b",
            errors: unexpectedBeforeAndAfter("let"),
            options: [NEITHER],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "{}let[a] = b",
            output: "{} let [a] = b",
            errors: expectedBeforeAndAfter("let"),
            options: [override("let", BOTH)],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "{} let [a] = b",
            output: "{}let[a] = b",
            errors: unexpectedBeforeAndAfter("let"),
            options: [override("let", NEITHER)],
            parserOptions: {ecmaVersion: 6}
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
            errors: unexpectedBefore("new"),
            options: [NEITHER]
        },
        {
            code: "{}new foo()",
            output: "{} new foo()",
            errors: expectedBefore("new"),
            options: [override("new", BOTH)]
        },
        {
            code: "{} new foo()",
            output: "{}new foo()",
            errors: unexpectedBefore("new"),
            options: [override("new", NEITHER)]
        },

        //----------------------------------------------------------------------
        // of
        //----------------------------------------------------------------------

        {
            code: "for ([foo]of{foo: 0}) {}",
            output: "for ([foo] of {foo: 0}) {}",
            errors: expectedBeforeAndAfter("of"),
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "for([foo] of {foo: 0}) {}",
            output: "for([foo]of{foo: 0}) {}",
            errors: unexpectedBeforeAndAfter("of"),
            options: [NEITHER],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "for([foo]of{foo: 0}) {}",
            output: "for([foo] of {foo: 0}) {}",
            errors: expectedBeforeAndAfter("of"),
            options: [override("of", BOTH)],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "for ([foo] of {foo: 0}) {}",
            output: "for ([foo]of{foo: 0}) {}",
            errors: unexpectedBeforeAndAfter("of"),
            options: [override("of", NEITHER)],
            parserOptions: {ecmaVersion: 6}
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
            code: "function foo() { {} return +a }",
            output: "function foo() { {}return+a }",
            errors: unexpectedBeforeAndAfter("return"),
            options: [NEITHER]
        },
        {
            code: "function foo() { {}return+a }",
            output: "function foo() { {} return +a }",
            errors: expectedBeforeAndAfter("return"),
            options: [override("return", BOTH)]
        },
        {
            code: "function foo() { {} return +a }",
            output: "function foo() { {}return+a }",
            errors: unexpectedBeforeAndAfter("return"),
            options: [override("return", NEITHER)]
        },

        //----------------------------------------------------------------------
        // set
        //----------------------------------------------------------------------

        {
            code: "({ set[b](value) {} })",
            output: "({ set [b](value) {} })",
            errors: expectedAfter("set"),
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "class A { a() {}set[b](value) {} }",
            output: "class A { a() {} set [b](value) {} }",
            errors: expectedBeforeAndAfter("set"),
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "class A { a() {} static set[b](value) {} }",
            output: "class A { a() {} static set [b](value) {} }",
            errors: expectedAfter("set"),
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "({ set [b](value) {} })",
            output: "({ set[b](value) {} })",
            errors: unexpectedAfter("set"),
            options: [NEITHER],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "class A { a() {} set [b](value) {} }",
            output: "class A { a() {}set[b](value) {} }",
            errors: unexpectedBeforeAndAfter("set"),
            options: [NEITHER],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "({ set[b](value) {} })",
            output: "({ set [b](value) {} })",
            errors: expectedAfter("set"),
            options: [override("set", BOTH)],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "class A { a() {}set[b](value) {} }",
            output: "class A { a() {} set [b](value) {} }",
            errors: expectedBeforeAndAfter("set"),
            options: [override("set", BOTH)],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "({ set [b](value) {} })",
            output: "({ set[b](value) {} })",
            errors: unexpectedAfter("set"),
            options: [override("set", NEITHER)],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "class A { a() {} set [b](value) {} }",
            output: "class A { a() {}set[b](value) {} }",
            errors: unexpectedBeforeAndAfter("set"),
            options: [override("set", NEITHER)],
            parserOptions: {ecmaVersion: 6}
        },

        //----------------------------------------------------------------------
        // static
        //----------------------------------------------------------------------

        {
            code: "class A { a() {}static[b]() {} }",
            output: "class A { a() {} static [b]() {} }",
            errors: expectedBeforeAndAfter("static"),
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "class A { a() {}static get [b]() {} }",
            output: "class A { a() {} static get [b]() {} }",
            errors: expectedBefore("static"),
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "class A { a() {} static [b]() {} }",
            output: "class A { a() {}static[b]() {} }",
            errors: unexpectedBeforeAndAfter("static"),
            options: [NEITHER],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "class A { a() {} static get[b]() {} }",
            output: "class A { a() {}static get[b]() {} }",
            errors: unexpectedBefore("static"),
            options: [NEITHER],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "class A { a() {}static[b]() {} }",
            output: "class A { a() {} static [b]() {} }",
            errors: expectedBeforeAndAfter("static"),
            options: [override("static", BOTH)],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "class A { a() {} static [b]() {} }",
            output: "class A { a() {}static[b]() {} }",
            errors: unexpectedBeforeAndAfter("static"),
            options: [override("static", NEITHER)],
            parserOptions: {ecmaVersion: 6}
        },

        //----------------------------------------------------------------------
        // super
        //----------------------------------------------------------------------

        {
            code: "class A { a() { {}super[b]; } }",
            output: "class A { a() { {} super[b]; } }",
            errors: expectedBefore("super"),
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "class A { a() { {} super[b]; } }",
            output: "class A { a() { {}super[b]; } }",
            errors: unexpectedBefore("super"),
            options: [NEITHER],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "class A { a() { {}super[b]; } }",
            output: "class A { a() { {} super[b]; } }",
            errors: expectedBefore("super"),
            options: [override("super", BOTH)],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "class A { a() { {} super[b]; } }",
            output: "class A { a() { {}super[b]; } }",
            errors: unexpectedBefore("super"),
            options: [override("super", NEITHER)],
            parserOptions: {ecmaVersion: 6}
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
            errors: unexpectedBeforeAndAfter("switch"),
            options: [NEITHER]
        },
        {
            code: "{}switch(a) {}",
            output: "{} switch (a) {}",
            errors: expectedBeforeAndAfter("switch"),
            options: [override("switch", BOTH)]
        },
        {
            code: "{} switch (a) {}",
            output: "{}switch(a) {}",
            errors: unexpectedBeforeAndAfter("switch"),
            options: [override("switch", NEITHER)]
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
            errors: unexpectedBefore("this"),
            options: [NEITHER]
        },
        {
            code: "{}this[a]",
            output: "{} this[a]",
            errors: expectedBefore("this"),
            options: [override("this", BOTH)]
        },
        {
            code: "{} this[a]",
            output: "{}this[a]",
            errors: unexpectedBefore("this"),
            options: [override("this", NEITHER)]
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
            errors: unexpectedBeforeAndAfter("throw"),
            options: [NEITHER]
        },
        {
            code: "function foo() { {}throw+a }",
            output: "function foo() { {} throw +a }",
            errors: expectedBeforeAndAfter("throw"),
            options: [override("throw", BOTH)]
        },
        {
            code: "function foo() { {} throw +a }",
            output: "function foo() { {}throw+a }",
            errors: unexpectedBeforeAndAfter("throw"),
            options: [override("throw", NEITHER)]
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
            errors: unexpectedBeforeAndAfter("try"),
            options: [NEITHER]
        },
        {
            code: "{}try{}finally{}",
            output: "{} try {}finally{}",
            errors: expectedBeforeAndAfter("try"),
            options: [override("try", BOTH)]
        },
        {
            code: "{} try {} finally {}",
            output: "{}try{} finally {}",
            errors: unexpectedBeforeAndAfter("try"),
            options: [override("try", NEITHER)]
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
            errors: unexpectedBefore("typeof"),
            options: [NEITHER]
        },
        {
            code: "{}typeof foo",
            output: "{} typeof foo",
            errors: expectedBefore("typeof"),
            options: [override("typeof", BOTH)]
        },
        {
            code: "{} typeof foo",
            output: "{}typeof foo",
            errors: unexpectedBefore("typeof"),
            options: [override("typeof", NEITHER)]
        },

        //----------------------------------------------------------------------
        // var
        //----------------------------------------------------------------------

        {
            code: "{}var[a] = b",
            output: "{} var [a] = b",
            errors: expectedBeforeAndAfter("var"),
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "{} var [a] = b",
            output: "{}var[a] = b",
            errors: unexpectedBeforeAndAfter("var"),
            options: [NEITHER],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "{}var[a] = b",
            output: "{} var [a] = b",
            errors: expectedBeforeAndAfter("var"),
            options: [override("var", BOTH)],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "{} var [a] = b",
            output: "{}var[a] = b",
            errors: unexpectedBeforeAndAfter("var"),
            options: [override("var", NEITHER)],
            parserOptions: {ecmaVersion: 6}
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
            errors: unexpectedBefore("void"),
            options: [NEITHER]
        },
        {
            code: "{}void foo",
            output: "{} void foo",
            errors: expectedBefore("void"),
            options: [override("void", BOTH)]
        },
        {
            code: "{} void foo",
            output: "{}void foo",
            errors: unexpectedBefore("void"),
            options: [override("void", NEITHER)]
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
            errors: unexpectedBeforeAndAfter("while"),
            options: [NEITHER]
        },
        {
            code: "do{} while (a)",
            output: "do{}while(a)",
            errors: unexpectedBeforeAndAfter("while"),
            options: [NEITHER]
        },
        {
            code: "{}while(a) {}",
            output: "{} while (a) {}",
            errors: expectedBeforeAndAfter("while"),
            options: [override("while", BOTH)]
        },
        {
            code: "do{}while(a)",
            output: "do{} while (a)",
            errors: expectedBeforeAndAfter("while"),
            options: [override("while", BOTH)]
        },
        {
            code: "{} while (a) {}",
            output: "{}while(a) {}",
            errors: unexpectedBeforeAndAfter("while"),
            options: [override("while", NEITHER)]
        },
        {
            code: "do {} while (a)",
            output: "do {}while(a)",
            errors: unexpectedBeforeAndAfter("while"),
            options: [override("while", NEITHER)]
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
            errors: unexpectedBeforeAndAfter("with"),
            options: [NEITHER]
        },
        {
            code: "{}with(obj) {}",
            output: "{} with (obj) {}",
            errors: expectedBeforeAndAfter("with"),
            options: [override("with", BOTH)]
        },
        {
            code: "{} with (obj) {}",
            output: "{}with(obj) {}",
            errors: unexpectedBeforeAndAfter("with"),
            options: [override("with", NEITHER)]
        },

        //----------------------------------------------------------------------
        // yield
        //----------------------------------------------------------------------

        {
            code: "function* foo() { {}yield foo }",
            output: "function* foo() { {} yield foo }",
            errors: expectedBefore("yield"),
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "function* foo() { {} yield foo }",
            output: "function* foo() { {}yield foo }",
            errors: unexpectedBefore("yield"),
            options: [NEITHER],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "function* foo() { {}yield foo }",
            output: "function* foo() { {} yield foo }",
            errors: expectedBefore("yield"),
            options: [override("yield", BOTH)],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "function* foo() { {} yield foo }",
            output: "function* foo() { {}yield foo }",
            errors: unexpectedBefore("yield"),
            options: [override("yield", NEITHER)],
            parserOptions: {ecmaVersion: 6}
        }
    ]
});
