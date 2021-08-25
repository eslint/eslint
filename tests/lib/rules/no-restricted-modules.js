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
        { code: "var withGitignores = require(\"foo/bar\");", options: [{ paths: ["foo"], patterns: ["foo/*", "!foo/bar"] }] },
        { code: "require(`fs`)", options: ["crypto"], parserOptions: { ecmaVersion: 6 } },
        { code: "require(`foo${bar}`)", options: ["foo"], parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = require('foo');", options: ["../foo"] },
        { code: "var foo = require('foo');", options: [{ paths: ["../foo"] }] },
        { code: "var foo = require('foo');", options: [{ patterns: ["../foo"] }] },
        { code: "var foo = require('foo');", options: ["/foo"] },
        { code: "var foo = require('foo');", options: [{ paths: ["/foo"] }] },
        "var relative = require('../foo');",
        { code: "var relative = require('../foo');", options: ["../notFoo"] },
        { code: "var relativeWithPaths = require('../foo');", options: [{ paths: ["../notFoo"] }] },
        { code: "var relativeWithPatterns = require('../foo');", options: [{ patterns: ["notFoo"] }] },
        "var absolute = require('/foo');",
        { code: "var absolute = require('/foo');", options: ["/notFoo"] },
        { code: "var absoluteWithPaths = require('/foo');", options: [{ paths: ["/notFoo"] }] },
        { code: "var absoluteWithPatterns = require('/foo');", options: [{ patterns: ["notFoo"] }] }
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
    }, {
        code: "require(`fs`)",
        options: ["fs"],
        parserOptions: { ecmaVersion: 6 },
        errors: [{ messageId: "defaultMessage", data: { name: "fs" }, type: "CallExpression" }]
    }, {
        code: "require(`crypt\\o`);",
        options: ["crypto"],
        parserOptions: { ecmaVersion: 6 },
        errors: [{ messageId: "defaultMessage", data: { name: "crypto" }, type: "CallExpression" }]
    },
    {
        code: "var relative = require('../foo');",
        options: ["../foo"],
        errors: [{
            message: "'../foo' module is restricted from being used.",
            type: "CallExpression",
            line: 1,
            column: 16,
            endColumn: 33
        }]
    },
    {
        code: "var relativeWithPaths = require('../foo');",
        options: [{ paths: ["../foo"] }],
        errors: [{
            message: "'../foo' module is restricted from being used.",
            type: "CallExpression",
            line: 1,
            column: 25,
            endColumn: 42
        }]
    },
    {
        code: "var relativeWithPatterns = require('../foo');",
        options: [{ patterns: ["../foo"] }],
        errors: [{
            message: "'../foo' module is restricted from being used by a pattern.",
            type: "CallExpression",
            line: 1,
            column: 28,
            endColumn: 45
        }]
    },
    {
        code: "var absolute = require('/foo');",
        options: ["/foo"],
        errors: [{
            message: "'/foo' module is restricted from being used.",
            type: "CallExpression",
            line: 1,
            column: 16,
            endColumn: 31
        }]
    },
    {
        code: "var absoluteWithPaths = require('/foo');",
        options: [{ paths: ["/foo"] }],
        errors: [{
            message: "'/foo' module is restricted from being used.",
            type: "CallExpression",
            line: 1,
            column: 25,
            endColumn: 40
        }]
    },
    {
        code: "var absoluteWithPatterns = require('/foo');",
        options: [{ patterns: ["foo"] }],
        errors: [{
            message: "'/foo' module is restricted from being used by a pattern.",
            type: "CallExpression",
            line: 1,
            column: 28,
            endColumn: 43
        }]
    }]
});
