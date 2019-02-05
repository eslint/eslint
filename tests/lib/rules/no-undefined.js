/**
 * @fileoverview Tests for no-undefined rule.
 * @author Michael Ficarra
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-undefined"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const ES6_SCRIPT = { ecmaVersion: 6 };
const ES6_MODULE = { ecmaVersion: 6, sourceType: "module" };

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const errors = [{ message: "Unexpected use of undefined.", type: "Identifier" }];

const ruleTester = new RuleTester({ parserOptions: ES6_SCRIPT });

ruleTester.run("no-undefined", rule, {
    valid: [
        "void 0",
        "void!0",
        "void-0",
        "void+0",
        "null",
        "undefine",
        "ndefined",
        "a.undefined",
        "this.undefined",
        "global['undefined']",

        // https://github.com/eslint/eslint/issues/7964
        "({ undefined: bar })",
        "({ undefined: bar } = foo)",
        "({ undefined() {} })",
        "class Foo { undefined() {} }",
        "(class { undefined() {} })",
        { code: "import { undefined as a } from 'foo'", parserOptions: ES6_MODULE },
        { code: "export { undefined } from 'foo'", parserOptions: ES6_MODULE },
        { code: "export { undefined as a } from 'foo'", parserOptions: ES6_MODULE },
        { code: "export { a as undefined } from 'foo'", parserOptions: ES6_MODULE }
    ],
    invalid: [
        { code: "undefined", errors },
        { code: "undefined.a", errors },
        { code: "a[undefined]", errors },
        { code: "undefined[0]", errors },
        { code: "f(undefined)", errors },
        { code: "function f(undefined) {}", errors },
        { code: "function f() { var undefined; }", errors },
        { code: "function f() { undefined = true; }", errors },
        { code: "var undefined;", errors },
        { code: "try {} catch(undefined) {}", errors },
        { code: "function undefined() {}", errors },
        { code: "(function undefined(){}())", errors },
        { code: "var foo = function undefined() {}", errors },
        { code: "foo = function undefined() {}", errors },
        { code: "undefined = true", errors },
        { code: "var undefined = true", errors },
        { code: "({ undefined })", errors },
        { code: "({ [undefined]: foo })", errors },
        { code: "({ bar: undefined })", errors },
        { code: "({ bar: undefined } = foo)", errors },
        { code: "var { undefined } = foo", errors },
        { code: "var { bar: undefined } = foo", errors },
        {
            code: "({ undefined: function undefined() {} })",
            errors: [Object.assign({}, errors[0], { column: 24 })]
        },
        { code: "({ foo: function undefined() {} })", errors },
        { code: "class Foo { [undefined]() {} }", errors },
        { code: "(class { [undefined]() {} })", errors },
        {
            code: "var undefined = true; undefined = false;",
            errors: [{
                message: "Unexpected use of undefined.",
                column: 5
            }, {
                message: "Unexpected use of undefined.",
                column: 23
            }]
        },
        {
            code: "import undefined from 'foo'",
            parserOptions: ES6_MODULE,
            errors
        },
        {
            code: "import * as undefined from 'foo'",
            parserOptions: ES6_MODULE,
            errors
        },
        {
            code: "import { undefined } from 'foo'",
            parserOptions: ES6_MODULE,
            errors
        },
        {
            code: "import { a as undefined } from 'foo'",
            parserOptions: ES6_MODULE,
            errors
        },

        /*
         * it will be warned "Parsing error: Export 'undefined' is not defined" (acorn@>=6.0.7)
         * {
         *     code: "export { undefined }",
         *     parserOptions: ES6_MODULE,
         *     errors
         * },
         */
        { code: "let a = [b, ...undefined]", errors },
        { code: "[a, ...undefined] = b", errors },
        { code: "[a = undefined] = b", errors }
    ]
});
