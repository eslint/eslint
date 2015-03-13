/**
 * @fileoverview Tests for no-empty-catch rule.
 * @author Dieter Oberkofler
 * @copyright 2015 Dieter Oberkofler. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-empty-catch", {
    valid: [
        {
            code: "try {throw new Error();} catch (e) {throw e;}",
            args: [2, true]
        },
        {
            code: "try {throw new Error();} finally {console.log('done');}",
            args: [2, true]
        },
        {
            code: "try {throw new Error();} catch (e) {throw e;} finally {console.log('done');}",
            args: [2, true]
        },
        {
            code: "try {throw new Error();} catch (e) {throw e;}",
            args: [2, false]
        },
        {
            code: "try {throw new Error();} finally {console.log('done');}",
            args: [2, false]
        },
        {
            code: "try {throw new Error();} catch (e) {throw e;} finally {console.log('done');}",
            args: [2, false]
        },
        {
            code: "try {throw new Error();} catch (e) {/* comment */}",
            args: [2, true]
        },
        {
            code: "try {throw new Error();} finally {/* comment */}",
            args: [2, true]
        }
    ],
    invalid: [
        {
            code: "try {throw new Error();} catch (e) {};",
            args: [2, true],
            errors: [{
                message: "Empty catch clause.",
                type: "TryStatement"
            }]
        },
        {
            code: "try {throw new Error();} catch (e) {/* comment */}",
            args: [2, false],
            errors: [{
                message: "Empty catch clause.",
                type: "TryStatement"
            }]
        },
        {
            code: "try {throw new Error();} finally {};",
            args: [2, true],
            errors: [{
                message: "Empty finally clause.",
                type: "TryStatement"
            }]
        },
        {
            code: "try {throw new Error();} finally {/* comment */}",
            args: [2, false],
            errors: [{
                message: "Empty finally clause.",
                type: "TryStatement"
            }]
        }
    ]
});
