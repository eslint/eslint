/**
 * @fileoverview Tests for no-func-assign.
 * @author Ian Christian Myers
 * @copyright 2013 Ian Christian Myers. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-func-assign"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-func-assign", rule, {
    valid: [
        "function foo() { var foo = bar; }",
        "function foo(foo) { foo = bar; }",
        "function foo() { var foo; foo = bar; }",
        { code: "var foo = () => {}; foo = bar;", ecmaFeatures: { arrowFunctions: true } },
        "var foo = function() {}; foo = bar;",
        "var foo = function() { foo = bar; };",
        { code: "import bar from 'bar'; function foo() { var foo = bar; }", ecmaFeatures: { modules: true } }
    ],
    invalid: [
        { code: "function foo() {}; foo = bar;", errors: [{ message: "'foo' is a function.", type: "Identifier"}] },
        { code: "function foo() { foo = bar; }", errors: [{ message: "'foo' is a function.", type: "Identifier"}] },
        { code: "foo = bar; function foo() { };", errors: [{ message: "'foo' is a function.", type: "Identifier"}] },
        { code: "[foo] = bar; function foo() { };", ecmaFeatures: {destructuring: true}, errors: [{ message: "'foo' is a function.", type: "Identifier"}] },
        { code: "({x: foo = 0}) = bar; function foo() { };", ecmaFeatures: {destructuring: true}, errors: [{ message: "'foo' is a function.", type: "Identifier"}] },
        { code: "function foo() { [foo] = bar; }", ecmaFeatures: {destructuring: true}, errors: [{ message: "'foo' is a function.", type: "Identifier"}] },
        { code: "(function() { ({x: foo = 0}) = bar; function foo() { }; })();", ecmaFeatures: {destructuring: true}, errors: [{ message: "'foo' is a function.", type: "Identifier"}] }
    ]
});
