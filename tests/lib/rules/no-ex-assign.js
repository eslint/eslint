/**
 * @fileoverview Tests for no-ex-assign rule.
 * @author Stephen Murray <spmurrayzzz>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("../../../lib/testers/eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-ex-assign", {
    valid: [
        "try { } catch (e) { three = 2 + 1; }",
        { code: "try { } catch ({e}) { this.something = 2; }", ecmaFeatures: { destructuring: true } },
        "function foo() { try { } catch (e) { return false; } }"
    ],
    invalid: [
        { code: "try { } catch (e) { e = 10; }", errors: [{ message: "Do not assign to the exception parameter.", type: "Identifier"}] },
        { code: "try { } catch (ex) { ex = 10; }", errors: [{ message: "Do not assign to the exception parameter.", type: "Identifier"}] },
        { code: "try { } catch (ex) { [ex] = []; }", ecmaFeatures: {destructuring: true}, errors: [{ message: "Do not assign to the exception parameter.", type: "Identifier"}] },
        { code: "try { } catch (ex) { ({x: ex = 0}) = {}; }", ecmaFeatures: {destructuring: true}, errors: [{ message: "Do not assign to the exception parameter.", type: "Identifier"}] },
        { code: "try { } catch ({message}) { message = 10; }", ecmaFeatures: {destructuring: true}, errors: [{ message: "Do not assign to the exception parameter.", type: "Identifier"}] }
    ]
});
