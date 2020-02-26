/**
 * @fileoverview Tests for no-restricted-modules.
 * @author Christian Schulz
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-restricted-modules"),
    { RuleTester } = require("../../../lib/rule-tester");

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
        errors: [{ messageId: "defaultMessage", data: { name: "fs" }, type: "CallExpression" }]
    }, {
        code: "require(\"os \")",
        options: ["fs", "crypto ", "stream", "os"],
        errors: [{ messageId: "defaultMessage", data: { name: "os" }, type: "CallExpression" }]
    }, {
        code: "require(\"foo/bar\");",
        options: ["foo/bar"],
        errors: [{ messageId: "defaultMessage", data: { name: "foo/bar" }, type: "CallExpression" }]
    }, {
        code: "var withPaths = require(\"foo/bar\");",
        options: [{ paths: ["foo/bar"] }],
        errors: [{ messageId: "defaultMessage", data: { name: "foo/bar" }, type: "CallExpression" }]
    }, {
        code: "var withPatterns = require(\"foo/bar\");",
        options: [{ patterns: ["foo/*"] }],
        errors: [{ messageId: "patternMessage", data: { name: "foo/bar" }, type: "CallExpression" }]
    }, {
        code: "var withPatternsAndPaths = require(\"foo/bar\");",
        options: [{ patterns: ["foo/*"], paths: ["foo"] }],
        errors: [{ messageId: "patternMessage", data: { name: "foo/bar" }, type: "CallExpression" }]
    }, {
        code: "var withGitignores = require(\"foo/bar\");",
        options: [{ patterns: ["foo/*", "!foo/baz"], paths: ["foo"] }],
        errors: [{ messageId: "patternMessage", data: { name: "foo/bar" }, type: "CallExpression" }]
    }, {
        code: "var withGitignores = require(\"foo\");",
        options: [{
            name: "foo",
            message: "Please use 'bar' module instead."
        }],
        errors: [{
            messageId: "customMessage",
            data: { name: "foo", customMessage: "Please use 'bar' module instead." },
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
            messageId: "customMessage",
            data: { name: "bar", customMessage: "Please use 'baz' module instead." },
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
            messageId: "customMessage",
            data: { name: "foo", customMessage: "Please use 'bar' module instead." },
            type: "CallExpression"
        }]
    }]
});
