/**
 * @fileoverview Tests for sort-imports rule.
 * @author Christian Schuller
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/sort-imports"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester(),
    parserOptions = {
        ecmaVersion: 6,
        sourceType: "module"
    },
    expectedError = {
        message: "Imports should be sorted alphabetically.",
        type: "ImportDeclaration"
    },
    ignoreCaseArgs = [{ignoreCase: true}];

ruleTester.run("sort-imports", rule, {
    valid: [
        {
            code:
                "import a from 'foo.js';\n" +
                "import b from 'bar.js';\n" +
                "import c from 'baz.js';",
            parserOptions: parserOptions
        },
        {
            code:
                "import * as B from 'foo.js';\n" +
                "import A from 'bar.js';",
            parserOptions: parserOptions
        },
        {
            code:
                "import * as B from 'foo.js';\n" +
                "import {a, b} from 'bar.js';",
            parserOptions: parserOptions
        },
        {
            code:
                "import {b, c} from 'bar.js';\n" +
                "import A from 'foo.js';",
            parserOptions: parserOptions
        },
        {
            code:
                "import A from 'bar.js';\n" +
                "import {b, c} from 'foo.js';",
            parserOptions: parserOptions,
            options: [{
                memberSyntaxSortOrder: [ "single", "multiple", "none", "all" ]
            }]
        },
        {
            code:
                "import {a, b} from 'bar.js';\n" +
                "import {b, c} from 'foo.js';",
            parserOptions: parserOptions
        },
        {
            code:
                "import A from 'foo.js';\n" +
                "import B from 'bar.js';",
            parserOptions: parserOptions
        },
        {
            code:
                "import A from 'foo.js';\n" +
                "import a from 'bar.js';",
            parserOptions: parserOptions
        },
        {
            code:
                "import a, * as b from 'foo.js';\n" +
                "import b from 'bar.js';",
            parserOptions: parserOptions
        },
        {
            code:
                "import 'foo.js';\n" +
                " import a from 'bar.js';",
            parserOptions: parserOptions
        },
        {
            code:
                "import B from 'foo.js';\n" +
                "import a from 'bar.js';",
            parserOptions: parserOptions
        },
        {
            code:
                "import a from 'foo.js';\n" +
                "import B from 'bar.js';",
            parserOptions: parserOptions,
            options: ignoreCaseArgs
        },
        {
            code: "import {a, b, c, d} from 'foo.js';",
            parserOptions: parserOptions
        },
        {
            code: "import {b, A, C, d} from 'foo.js';",
            parserOptions: parserOptions,
            options: [{
                ignoreMemberSort: true
            }]
        },
        {
            code: "import {B, a, C, d} from 'foo.js';",
            parserOptions: parserOptions,
            options: [{
                ignoreMemberSort: true
            }]
        },
        {
            code: "import {a, B, c, D} from 'foo.js';",
            parserOptions: parserOptions,
            options: ignoreCaseArgs
        },
        {
            code: "import a, * as b from 'foo.js';",
            parserOptions: parserOptions
        },
        {
            code:
                "import * as a from 'foo.js';\n" +
                "\n" +
                "import b from 'bar.js';",
            parserOptions: parserOptions
        },
        {
            code:
                "import * as bar from 'bar.js';\n" +
                "import * as foo from 'foo.js';",
            parserOptions: parserOptions
        },

        // https://github.com/eslint/eslint/issues/5130
        {
            code:
                "import 'foo';\n" +
                "import bar from 'bar';",
            parserOptions: parserOptions,
            options: ignoreCaseArgs
        },

        // https://github.com/eslint/eslint/issues/5305
        {
            code: "import React, {Component} from 'react';",
            parserOptions: parserOptions
        }
    ],
    invalid: [
        {
            code:
                "import c from 'foo.js';\n" +
                "import a from 'bar.js';\n" +
                "import b from 'baz.js';",
            output:
                "import a from 'bar.js';\n" +
                "import b from 'baz.js';\n" +
                "import c from 'foo.js';",
            errors: [expectedError, expectedError],
            parserOptions: parserOptions
        },
        {
            code:
                "import a from 'foo.js';\n" +
                "import A from 'bar.js';",
            output:
                "import A from 'bar.js';\n" +
                "import a from 'foo.js';",
            parserOptions: parserOptions,
            errors: [expectedError]
        },
        {
            code:
                "import b from 'foo.js';\n" +
                "import a from 'bar.js';",
            output:
                "import a from 'bar.js';\n" +
                "import b from 'foo.js';",
            parserOptions: parserOptions,
            errors: [expectedError]
        },
        {
            code:
                "import {b, c} from 'foo.js';\n" +
                "import {a, b} from 'bar.js';",
            output:
                "import {a, b} from 'bar.js';\n" +
                "import {b, c} from 'foo.js';",
            parserOptions: parserOptions,
            errors: [expectedError]
        },
        {
            code:
                "import * as foo from 'foo.js';\n" +
                "import * as bar from 'bar.js';",
            output:
                "import * as bar from 'bar.js';\n" +
                "import * as foo from 'foo.js';",
            parserOptions: parserOptions,
            errors: [expectedError]
        },
        {
            code:
                "import a from 'foo.js';\n" +
                "import {b, c} from 'bar.js';",
            output:
                "import {b, c} from 'bar.js';\n" +
                "import a from 'foo.js';",
            parserOptions: parserOptions,
            errors: [{
                message: "Expected 'multiple' syntax before 'single' syntax.",
                type: "ImportDeclaration"
            }]
        },
        {
            code:
                "import a from 'foo.js';\n" +
                "import * as b from 'bar.js';",
            output:
                "import * as b from 'bar.js';\n" +
                "import a from 'foo.js';",
            parserOptions: parserOptions,
            errors: [{
                message: "Expected 'all' syntax before 'single' syntax.",
                type: "ImportDeclaration"
            }]
        },
        {
            code:
                "import a from 'foo.js';\n" +
                "import 'bar.js';",
            output:
                "import 'bar.js';\n" +
                "import a from 'foo.js';",
            parserOptions: parserOptions,
            errors: [{
                message: "Expected 'none' syntax before 'single' syntax.",
                type: "ImportDeclaration"
            }]
        },
        {
            code:
                "import b from 'bar.js';\n" +
                "import * as a from 'foo.js';",
            output:
                "import * as a from 'foo.js';\n" +
                "import b from 'bar.js';",
            parserOptions: parserOptions,
            options: [{
                memberSyntaxSortOrder: [ "all", "single", "multiple", "none" ]
            }],
            errors: [{
                message: "Expected 'all' syntax before 'single' syntax.",
                type: "ImportDeclaration"
            }]
        },
        {
            code: "import {b, a, d, c} from 'foo.js';",
            output: "import {a, b, c, d} from 'foo.js';",
            parserOptions: parserOptions,
            errors: [{
                message: "Members '{b, a, d, c}' of the import declaration should be sorted alphabetically.",
                type: "ImportSpecifier"
            }]
        },
        {
            code: "import {a, B, c, D} from 'foo.js';",
            output: "import {B, D, a, c} from 'foo.js';",
            parserOptions: parserOptions,
            errors: [{
                message: "Members '{a, B, c, D}' of the import declaration should be sorted alphabetically.",
                type: "ImportSpecifier"
            }]
        }
    ]
});
