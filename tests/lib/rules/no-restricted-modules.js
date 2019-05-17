/**
 * @fileoverview Tests for no-restricted-modules.
 * @author Christian Schulz
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-restricted-modules"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-restricted-modules", rule, {
    valid: [
        { code: "require(\"fs\")", options: ["crypto"] },
        { code: "require(\"path\")", options: ["crypto", "stream", "os"] },
        "require(\"fs \")",
        { code: "require(2)", options: ["crypto"] },
        { code: "require(foo)", options: ["crypto"] },
        { code: "var foo = bar('crypto');", options: ["crypto"] },
        { code: "require(\"foo/bar\");", options: ["foo"] },
        { code: "var withPaths = require(\"foo/bar\");", options: [{ paths: ["foo", "bar"] }] },
        { code: "var withPatterns = require(\"foo/bar\");", options: [{ patterns: ["foo/c*"] }] },
        { code: "var withPatternsAndPaths = require(\"foo/bar\");", options: [{ paths: ["foo"], patterns: ["foo/c*"] }] },
        { code: "var withGitignores = require(\"foo/bar\");", options: [{ paths: ["foo"], patterns: ["foo/*", "!foo/bar"] }] }
    ],
    invalid: [{
        code: "require(\"fs\")",
        options: ["fs"],
        errors: [{ message: "'fs' module is restricted from being used.", type: "CallExpression" }]
    }, {
        code: "require(\"os \")",
        options: ["fs", "crypto ", "stream", "os"],
        errors: [{ message: "'os' module is restricted from being used.", type: "CallExpression" }]
    }, {
        code: "require(\"foo/bar\");",
        options: ["foo/bar"],
        errors: [{ message: "'foo/bar' module is restricted from being used.", type: "CallExpression" }]
    }, {
        code: "var withPaths = require(\"foo/bar\");",
        options: [{ paths: ["foo/bar"] }],
        errors: [{ message: "'foo/bar' module is restricted from being used.", type: "CallExpression" }]
    }, {
        code: "var withPatterns = require(\"foo/bar\");",
        options: [{ patterns: ["foo/*"] }],
        errors: [{ message: "'foo/bar' module is restricted from being used by a pattern.", type: "CallExpression" }]
    }, {
        code: "var withPatternsAndPaths = require(\"foo/bar\");",
        options: [{ patterns: ["foo/*"], paths: ["foo"] }],
        errors: [{ message: "'foo/bar' module is restricted from being used by a pattern.", type: "CallExpression" }]
    }, {
        code: "var withGitignores = require(\"foo/bar\");",
        options: [{ patterns: ["foo/*", "!foo/baz"], paths: ["foo"] }],
        errors: [{ message: "'foo/bar' module is restricted from being used by a pattern.", type: "CallExpression" }]
    }, {
        code: "var withGitignores = require(\"foo\");",
        options: [{
            name: "foo",
            message: "Please use 'bar' module instead."
        }],
        errors: [{
            message: "'foo' module is restricted from being used. Please use 'bar' module instead.",
            type: "CallExpression"
        }]
    }, {
        code: "var withGitignores = require(\"bar\");",
        options: [
            "foo",
            {
                name: "bar",
                message: "Please use 'baz' module instead."
            },
            "baz"
        ],
        errors: [{
            message: "'bar' module is restricted from being used. Please use 'baz' module instead.",
            type: "CallExpression"
        }]
    }, {
        code: "var withGitignores = require(\"foo\");",
        options: [{
            paths: [{
                name: "foo",
                message: "Please use 'bar' module instead."
            }]
        }],
        errors: [{
            message: "'foo' module is restricted from being used. Please use 'bar' module instead.",
            type: "CallExpression"
        }]
    }]
});
