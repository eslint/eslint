/**
 * @fileoverview Tests for internal-consistent-docs-url rule.
 * @author Patrick McElhaney
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../tools/internal-rules/consistent-docs-url"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("consistent-docs-url", rule, {
    valid: [

        // wrong exports format: "internal-no-invalid-meta" reports this already
        [
            "module.exports = function(context) {",
            "    return {",
            "        Program: function(node) {}",
            "    };",
            "};"
        ].join("\n"),
        [
            "module.exports = {",
            "    meta: {",
            "        docs: {",
            "            url: 'https://eslint.org/docs/rules/<input>'",
            "        }",
            "    },",
            "    create: function(context) {",
            "        return {};",
            "    }",
            "};"
        ].join("\n")
    ],
    invalid: [
        {
            code: [
                "module.exports = {",
                "    meta: {",
                "    },",

                "    create: function(context) {",
                "        return {};",
                "    }",
                "};"
            ].join("\n"),
            errors: [{
                message: "Rule is missing a meta.docs property",
                line: 2,
                column: 5
            }]
        },
        {
            code: [
                "module.exports = {",
                "    meta: {",
                "        docs: {}",
                "    },",

                "    create: function(context) {",
                "        return {};",
                "    }",
                "};"
            ].join("\n"),
            errors: [{
                message: "Rule is missing a meta.docs.url property",
                line: 3,
                column: 9
            }]
        },
        {
            code: [
                "module.exports = {",
                "    meta: {",
                "        docs: {",
                "            url: 'http://example.com/wrong-url'",
                "        }",
                "    },",
                "    create: function(context) {",
                "        return {};",
                "    }",
                "};"
            ].join("\n"),
            errors: [{
                message: "Incorrect url. Expected \"https://eslint.org/docs/rules/<input>\" but got \"http://example.com/wrong-url\"",
                line: 4,
                column: 18
            }]
        }
    ]
});
