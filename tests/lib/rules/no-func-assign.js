/**
 * @fileoverview Tests for no-func-assign.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-func-assign"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-func-assign", rule, {
    valid: [
        "function foo() { var foo = bar; }",
        "function foo(foo) { foo = bar; }",
        "function foo() { var foo; foo = bar; }",
        { code: "var foo = () => {}; foo = bar;", parserOptions: { ecmaVersion: 6 } },
        "var foo = function() {}; foo = bar;",
        "var foo = function() { foo = bar; };",
        { code: "import bar from 'bar'; function foo() { var foo = bar; }", parserOptions: { sourceType: "module" } }
    ],
    invalid: [
        { code: "function foo() {}; foo = bar;", errors: [{ message: "'foo' is a function.", type: "Identifier" }] },
        { code: "function foo() { foo = bar; }", errors: [{ message: "'foo' is a function.", type: "Identifier" }] },
        { code: "foo = bar; function foo() { };", errors: [{ message: "'foo' is a function.", type: "Identifier" }] },
        { code: "[foo] = bar; function foo() { };", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "'foo' is a function.", type: "Identifier" }] },
        { code: "({x: foo = 0} = bar); function foo() { };", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "'foo' is a function.", type: "Identifier" }] },
        { code: "function foo() { [foo] = bar; }", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "'foo' is a function.", type: "Identifier" }] },
        { code: "(function() { ({x: foo = 0} = bar); function foo() { }; })();", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "'foo' is a function.", type: "Identifier" }] }
    ]
});
