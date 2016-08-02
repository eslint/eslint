/**
 * @fileoverview Tests for internal no-valid-meta rule.
 * @author Vitor Balocco
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/internal-rules/internal-no-invalid-meta"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("internal-no-invalid-meta", rule, {
    valid: [

        // context.report() call with no fix
        [
            "module.exports = {",
            "    meta: {",
            "        docs: {",
            "            description: 'some rule',",
            "            category: 'Internal',",
            "            recommended: false",
            "        },",
            "        schema: []",
            "    },",

            "    create: function(context) {",
            "        return {",
            "            Program: function(node) {",
            "                context.report({",
            "                    node: node",
            "                });",
            "            }",
            "        };",
            "    }",
            "};"
        ].join("\n"),

        // context.report() call in old style
        [
            "module.exports = {",
            "    meta: {",
            "        docs: {",
            "            description: 'some rule',",
            "            category: 'Internal',",
            "            recommended: false",
            "        },",
            "        schema: []",
            "    },",

            "    create: function(context) {",
            "        return {",
            "            Program: function(node) {",
            "                context.report(node, 'Getter is not present');",
            "            }",
            "        };",
            "    }",
            "};"
        ].join("\n"),

        // context.report() call with a fix property
        [
            "module.exports = {",
            "    meta: {",
            "        docs: {",
            "            description: 'some rule',",
            "            category: 'Internal',",
            "            recommended: false",
            "        },",
            "        schema: [],",
            "        fixable: 'whitespace'",
            "    },",

            "    create: function(context) {",
            "        return {",
            "            Program: function(node) {",
            "                context.report({",
            "                    node: node,",
            "                    fix: function(fixer) {",
            "                        return fixer.insertTextAfter(node, ' ');",
            "                    }",
            "                });",
            "            }",
            "        };",
            "    }",
            "};"
        ].join("\n")
    ],
    invalid: [
        {
            code: [
                "module.exports = {",
                "    create: function(context) {",
                "        return {",
                "            Program: function(node) {}",
                "        };",
                "    }",
                "};"
            ].join("\n"),
            errors: [{
                message: "Rule is missing a meta property.",
                line: 1,
                column: 18
            }]
        },
        {
            code: [
                "module.exports = {",
                "    meta: {",
                "        schema: []",
                "    },",

                "    create: function(context) {",
                "        return {",
                "            Program: function(node) {}",
                "        };",
                "    }",
                "};"
            ].join("\n"),
            errors: [{
                message: "Rule is missing a meta.docs property.",
                line: 2,
                column: 5
            }]
        },
        {
            code: [
                "module.exports = {",
                "    meta: {",
                "        docs: {",
                "            category: 'Internal',",
                "            recommended: false",
                "        },",
                "        schema: []",
                "    },",

                "    create: function(context) {",
                "        return {",
                "            Program: function(node) {}",
                "        };",
                "    }",
                "};"
            ].join("\n"),
            errors: [{
                message: "Rule is missing a meta.docs.description property.",
                line: 2,
                column: 5
            }]
        },
        {
            code: [
                "module.exports = {",
                "    meta: {",
                "        docs: {",
                "            description: 'some rule',",
                "            recommended: false",
                "        },",
                "        schema: []",
                "    },",

                "    create: function(context) {",
                "        return {",
                "            Program: function(node) {}",
                "        };",
                "    }",
                "};"
            ].join("\n"),
            errors: [{
                message: "Rule is missing a meta.docs.category property.",
                line: 2,
                column: 5
            }]
        },
        {
            code: [
                "module.exports = {",
                "    meta: {",
                "        docs: {",
                "            description: 'some rule',",
                "            category: 'Internal'",
                "        },",
                "        schema: []",
                "    },",

                "    create: function(context) {",
                "        return {",
                "            Program: function(node) {}",
                "        };",
                "    }",
                "};"
            ].join("\n"),
            errors: [{
                message: "Rule is missing a meta.docs.recommended property.",
                line: 2,
                column: 5
            }]
        },
        {
            code: [
                "module.exports = {",
                "    meta: {",
                "        docs: {",
                "            description: 'some rule',",
                "            category: 'Internal',",
                "            recommended: false",
                "        }",
                "    },",

                "    create: function(context) {",
                "        return {",
                "            Program: function(node) {}",
                "        };",
                "    }",
                "};"
            ].join("\n"),
            errors: [{
                message: "Rule is missing a meta.schema property.",
                line: 2,
                column: 5
            }]
        },
        {
            code: [
                "module.exports = {",
                "    meta: {",
                "        docs: {",
                "            description: 'some rule',",
                "            category: 'Internal',",
                "            recommended: false",
                "        },",
                "        schema: []",
                "    },",
                "    create: function(context) {",
                "        return {",
                "            Program: function(node) {",
                "                context.report({",
                "                    node: node,",
                "                    fix: function(fixer) {",
                "                        return fixer.insertTextAfter(node, ' ');",
                "                    }",
                "                });",
                "            }",
                "        };",
                "    }",
                "};"
            ].join("\n"),
            errors: [{
                message: "Rule is fixable, but is missing a meta.fixable property.",
                line: 2,
                column: 5
            }]
        }
    ]
});
