/**
 * @fileoverview Tests for prefer-template rule.
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/prefer-template");
var RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var errors = [{
    message: "Unexpected string concatenation.",
    type: "BinaryExpression"
}];

var ruleTester = new RuleTester();
ruleTester.run("prefer-template", rule, {
    valid: [
        {code: "'use strict';"},
        {code: "var foo = 'bar';"},
        {code: "var foo = 'bar' + 'baz';"},
        {code: "var foo = +100 + 'yen';"},
        {code: "var foo = foo + +'100';"},
        {code: "var foo = `bar`;", ecmaFeatures: {templateStrings: true}},
        {code: "var foo = `hello, ${name}!`;", ecmaFeatures: {templateStrings: true}},

        // https://github.com/eslint/eslint/issues/3507
        {code: "var foo = `foo` + `bar` + \"hoge\";", ecmaFeatures: {templateStrings: true}},
        {code: "var foo = `foo` +\n    `bar` +\n    \"hoge\";", ecmaFeatures: {templateStrings: true}}
    ],
    invalid: [
        {code: "var foo = 'hello, ' + name + '!';", errors: errors},
        {code: "var foo = bar + 'baz';", errors: errors},
        {code: "var foo = 'bar' + baz;", errors: errors},
        {code: "var foo = '￥' + (n * 1000) + '-'", errors: errors},
        {code: "var foo = 'aaa' + aaa; var bar = 'bbb' + bbb;", errors: [errors[0], errors[0]]}
    ]
});
