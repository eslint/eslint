/**
 * @fileoverview Tests for prefer-template rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/prefer-template");
const RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const errors = [{
    message: "Unexpected string concatenation.",
    type: "BinaryExpression"
}];

const ruleTester = new RuleTester();

ruleTester.run("prefer-template", rule, {
    valid: [
        {code: "'use strict';"},
        {code: "var foo = 'bar';"},
        {code: "var foo = 'bar' + 'baz';"},
        {code: "var foo = foo + +'100';"},
        {code: "var foo = `bar`;", parserOptions: { ecmaVersion: 6 }},
        {code: "var foo = `hello, ${name}!`;", parserOptions: { ecmaVersion: 6 }},

        // https://github.com/eslint/eslint/issues/3507
        {code: "var foo = `foo` + `bar` + \"hoge\";", parserOptions: { ecmaVersion: 6 }},
        {code: "var foo = `foo` +\n    `bar` +\n    \"hoge\";", parserOptions: { ecmaVersion: 6 }}
    ],
    invalid: [
        {code: "var foo = 'hello, ' + name + '!';", errors: errors},
        {code: "var foo = bar + 'baz';", errors: errors},
        {code: "var foo = bar + `baz`;", parserOptions: { ecmaVersion: 6 }, errors: errors},
        {code: "var foo = +100 + 'yen';", errors: errors},
        {code: "var foo = 'bar' + baz;", errors: errors},
        {code: "var foo = '￥' + (n * 1000) + '-'", errors: errors},
        {code: "var foo = 'aaa' + aaa; var bar = 'bbb' + bbb;", errors: [errors[0], errors[0]]},
        {code: "var string = (number + 1) + 'px';", errors: errors}
    ]
});
