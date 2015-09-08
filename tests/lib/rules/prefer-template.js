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
        {code: "'use strict';", ecmaFeatures: {templateStrings: true}},
        {code: "var foo = 'bar';", ecmaFeatures: {templateStrings: true}},
        {code: "var foo = 'bar' + 'baz';", ecmaFeatures: {templateStrings: true}},
        {code: "var foo = foo + +'100';", ecmaFeatures: {templateStrings: true}},
        {code: "var foo = `bar`;", ecmaFeatures: {templateStrings: true}},
        {code: "var foo = `hello, ${name}!`;", ecmaFeatures: {templateStrings: true}},

        // https://github.com/eslint/eslint/issues/3507
        {code: "var foo = `foo` + `bar` + \"hoge\";", ecmaFeatures: {templateStrings: true}},
        {code: "var foo = `foo` +\n    `bar` +\n    \"hoge\";", ecmaFeatures: {templateStrings: true}},

        // noop when rule is used in wrong environment
        {code: "var foo = bar + 'baz';", ecmaFeatures: {templateStrings: false}}
    ],
    invalid: [
        {code: "var foo = 'hello, ' + name + '!';", ecmaFeatures: {templateStrings: true}, errors: errors},
        {code: "var foo = bar + 'baz';", ecmaFeatures: {templateStrings: true}, errors: errors},
        {code: "var foo = bar + `baz`;", ecmaFeatures: {templateStrings: true}, errors: errors},
        {code: "var foo = +100 + 'yen';", ecmaFeatures: {templateStrings: true}, errors: errors},
        {code: "var foo = 'bar' + baz;", ecmaFeatures: {templateStrings: true}, errors: errors},
        {code: "var foo = '￥' + (n * 1000) + '-'", ecmaFeatures: {templateStrings: true}, errors: errors},
        {code: "var foo = 'aaa' + aaa; var bar = 'bbb' + bbb;", ecmaFeatures: {templateStrings: true}, errors: [errors[0], errors[0]]},
        {code: "var string = (number + 1) + 'px';", ecmaFeatures: {templateStrings: true}, errors: errors}
    ]
});
