/**
 * @fileoverview Tests for internal no-valid-meta rule.
 * @author Vitor Balocco
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../tools/internal-rules/no-invalid-meta"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-invalid-meta", rule, {
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
                "module.exports = function(context) {",
                "    return {",
                "        Program: function(node) {}",
                "    };",
                "};"
            ].join("\n"),
            errors: [{
                message: "Rule does not export an Object. Make sure the rule follows the new rule format.",
                line: 1,
                column: 18
            }]
        },
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

        /*
         * Rule doesn't export anything: Should warn on the Program node.
         * See https://github.com/eslint/eslint/issues/9534
         */

        /*
         * Should be invalid, but will currently show as valid due to #9534.
         * FIXME: Uncomment when #9534 is fixed in major release.
         * {
         *     code: "",
         *     errors: [{
         *         message: "Rule does not export anything. Make sure rule exports an object according to new rule format.",
         *         line: 1,
         *         column: 1
         *     }]
         * },
         */
        {
            code: "foo();",
            errors: [{
                message: "Rule does not export anything. Make sure rule exports an object according to new rule format.",
                line: 1,
                column: 1
            }]
        },
        {
            code: "foo = bar;",
            errors: [{
                message: "Rule does not export anything. Make sure rule exports an object according to new rule format.",
                line: 1,
                column: 1
            }]
        }
    ]
});
