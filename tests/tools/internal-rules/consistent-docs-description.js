/**
 * @fileoverview Tests for internal-consistent-docs-description rule.
 * @author Vitor Balocco
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../tools/internal-rules/consistent-docs-description"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("consistent-docs-description", rule, {
    valid: [

        // wrong exports format: "internal-no-invalid-meta" reports this already
        [
            "module.exports = function(context) {",
            "    return {",
            "        Program: function(node) {}",
            "    };",
            "};"
        ].join("\n"),

        // missing `meta.docs.description` property: "internal-no-invalid-meta" reports this already
        [
            "module.exports = {",
            "    meta: {},",
            "    create: function(context) {",
            "        return {};",
            "    }",
            "};"
        ].join("\n"),
        [
            "module.exports = {",
            "    meta: {",
            "        docs: {",
            "            description: 'enforce some stuff'",
            "        }",
            "    },",

            "    create: function(context) {",
            "        return {};",
            "    }",
            "};"
        ].join("\n"),
        [
            "module.exports = {",
            "    meta: {",
            "        docs: {",
            "            description: 'require some things'",
            "        }",
            "    },",

            "    create: function(context) {",
            "        return {};",
            "    }",
            "};"
        ].join("\n"),
        [
            "module.exports = {",
            "    meta: {",
            "        docs: {",
            "            description: 'disallow bad things'",
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
                "        docs: {",
                "            description: 'do stuff'",
                "        }",
                "    },",

                "    create: function(context) {",
                "        return {};",
                "    }",
                "};"
            ].join("\n"),
            errors: [{
                message: "`meta.docs.description` should start with one of the following words: enforce, require, disallow. Started with \"do\" instead.",
                line: 4,
                column: 26
            }]
        },
        {
            code: [
                "module.exports = {",
                "    meta: {",
                "        docs: {",
                "            description: 'Require stuff'",
                "        }",
                "    },",

                "    create: function(context) {",
                "        return {};",
                "    }",
                "};"
            ].join("\n"),
            errors: [{
                message: "`meta.docs.description` should start with one of the following words: enforce, require, disallow. Started with \"Require\" instead.",
                line: 4,
                column: 26
            }]
        },
        {
            code: [
                "module.exports = {",
                "    meta: {",
                "        docs: {",
                "            description: 'Enforce stuff'",
                "        }",
                "    },",

                "    create: function(context) {",
                "        return {};",
                "    }",
                "};"
            ].join("\n"),
            errors: [{
                message: "`meta.docs.description` should start with one of the following words: enforce, require, disallow. Started with \"Enforce\" instead.",
                line: 4,
                column: 26
            }]
        },
        {
            code: [
                "module.exports = {",
                "    meta: {",
                "        docs: {",
                "            description: 'Disallow stuff'",
                "        }",
                "    },",

                "    create: function(context) {",
                "        return {};",
                "    }",
                "};"
            ].join("\n"),
            errors: [{
                message: "`meta.docs.description` should start with one of the following words: enforce, require, disallow. Started with \"Disallow\" instead.",
                line: 4,
                column: 26
            }]
        },
        {
            code: [
                "module.exports = {",
                "    meta: {",
                "        docs: {",
                "            description: ' disallow (whitespace in the beginning)'",
                "        }",
                "    },",

                "    create: function(context) {",
                "        return {};",
                "    }",
                "};"
            ].join("\n"),
            errors: [{
                message: "`meta.docs.description` should not start with whitespace.",
                line: 4,
                column: 26
            }]
        },
        {
            code: [
                "module.exports = {",
                "    meta: {",
                "        docs: {",
                "            description: '    disallow (whitespaces in the beginning)'",
                "        }",
                "    },",

                "    create: function(context) {",
                "        return {};",
                "    }",
                "};"
            ].join("\n"),
            errors: [{
                message: "`meta.docs.description` should not start with whitespace.",
                line: 4,
                column: 26
            }]
        },
        {
            code: [
                "module.exports = {",
                "    meta: {",
                "        docs: {",
                "            description: '  '",
                "        }",
                "    },",

                "    create: function(context) {",
                "        return {};",
                "    }",
                "};"
            ].join("\n"),
            errors: [{
                message: "`meta.docs.description` should not start with whitespace.",
                line: 4,
                column: 26
            }]
        },
        {
            code: [
                "module.exports = {",
                "    meta: {",
                "        docs: {",
                "            description: ''",
                "        }",
                "    },",

                "    create: function(context) {",
                "        return {};",
                "    }",
                "};"
            ].join("\n"),
            errors: [{
                message: "`meta.docs.description` should not be empty.",
                line: 4,
                column: 26
            }]
        },
        {
            code: [
                "module.exports = {",
                "    meta: {",
                "        docs: {",
                "            description: true",
                "        }",
                "    },",

                "    create: function(context) {",
                "        return {};",
                "    }",
                "};"
            ].join("\n"),
            errors: [{
                message: "`meta.docs.description` should be a string.",
                line: 4,
                column: 26
            }]
        }
    ]
});
