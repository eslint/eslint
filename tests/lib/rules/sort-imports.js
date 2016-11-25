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
                "import c from 'baz.js';\n",
            parserOptions
        },
        {
            code:
                "import * as B from 'foo.js';\n" +
                "import A from 'bar.js';",
            parserOptions
        },
        {
            code:
                "import * as B from 'foo.js';\n" +
                "import {a, b} from 'bar.js';",
            parserOptions
        },
        {
            code:
                "import {b, c} from 'bar.js';\n" +
                "import A from 'foo.js';",
            parserOptions
        },
        {
            code:
                "import A from 'bar.js';\n" +
                "import {b, c} from 'foo.js';",
            parserOptions,
            options: [{
                memberSyntaxSortOrder: [ "single", "multiple", "none", "all" ]
            }]
        },
        {
            code:
                "import {a, b} from 'bar.js';\n" +
                "import {b, c} from 'foo.js';",
            parserOptions
        },
        {
            code:
                "import A from 'foo.js';\n" +
                "import B from 'bar.js';",
            parserOptions
        },
        {
            code:
                "import A from 'foo.js';\n" +
                "import a from 'bar.js';",
            parserOptions
        },
        {
            code:
                "import a, * as b from 'foo.js';\n" +
                "import b from 'bar.js';",
            parserOptions
        },
        {
            code:
                "import 'foo.js';\n" +
                " import a from 'bar.js';",
            parserOptions
        },
        {
            code:
                "import B from 'foo.js';\n" +
                "import a from 'bar.js';",
            parserOptions
        },
        {
            code:
                "import a from 'foo.js';\n" +
                "import B from 'bar.js';",
            parserOptions,
            options: ignoreCaseArgs
        },
        {
            code: "import {a, b, c, d} from 'foo.js';",
            parserOptions
        },
        {
            code: "import {b, A, C, d} from 'foo.js';",
            parserOptions,
            options: [{
                ignoreMemberSort: true
            }]
        },
        {
            code: "import {B, a, C, d} from 'foo.js';",
            parserOptions,
            options: [{
                ignoreMemberSort: true
            }]
        },
        {
            code: "import {a, B, c, D} from 'foo.js';",
            parserOptions,
            options: ignoreCaseArgs
        },
        {
            code: "import a, * as b from 'foo.js';",
            parserOptions
        },
        {
            code:
                "import * as a from 'foo.js';\n" +
                "\n" +
                "import b from 'bar.js';",
            parserOptions
        },
        {
            code:
                "import * as bar from 'bar.js';\n" +
                "import * as foo from 'foo.js';",
            parserOptions
        },
        {
            code:
                "import * as f from 'foo';\n" +
                "import bar from './bar';\n" +
                "import styles from './styles.sass';",
            parserOptions,
            options: [
                {
                    ignoreMemberSort: true,
                    enableTypeSort: true
                }
            ]
        },
        {
            code:
                "import * as f from 'foo';\n" +
                "import React from 'react';\n" +
                "import bar from './bar';\n" +
                "import styles from './styles.sass';",
            parserOptions,
            options: [
                {
                    enableTypeSort: true
                }
            ]
        },
        {
            code:
                "import { Link } from 'react-router';\n" +
                "import React from 'react';\n" +
                "import RSVP from 'rsvp';\n" +
                "import $ from 'jquery';\n\n" +

                "import { withI18n } from './../lib/i18n';\n\n" +
                "import WidgetToolbar from './WidgetToolbar';\n" +
                "import WidgetWrapper from './WidgetWrapper';\n" +

                "import iconStyles from './../../styles/shared/fontIcons.sass';\n" +
                "import styles from './../../styles/modules/navigation.sass';",
            parserOptions,
            options: [
                {
                    ignoreMemberSort: true,
                    enableTypeSort: true
                }
            ]
        },

        // https://github.com/eslint/eslint/issues/5130
        {
            code:
                "import 'foo';\n" +
                "import bar from 'bar';",
            parserOptions,
            options: ignoreCaseArgs
        },

        // https://github.com/eslint/eslint/issues/5305
        {
            code: "import React, {Component} from 'react';",
            parserOptions
        }
    ],
    invalid: [
        {
            code:
                "import a from 'foo.js';\n" +
                "import A from 'bar.js';",
            parserOptions,
            errors: [expectedError]
        },
        {
            code:
                "import b from 'foo.js';\n" +
                "import a from 'bar.js';",
            parserOptions,
            errors: [expectedError]
        },
        {
            code:
                "import {b, c} from 'foo.js';\n" +
                "import {a, b} from 'bar.js';",
            parserOptions,
            errors: [expectedError]
        },
        {
            code:
                "import * as foo from 'foo.js';\n" +
                "import * as bar from 'bar.js';",
            parserOptions,
            errors: [expectedError]
        },
        {
            code:
                "import a from 'foo.js';\n" +
                "import {b, c} from 'bar.js';",
            parserOptions,
            errors: [{
                message: "Expected 'multiple' syntax before 'single' syntax.",
                type: "ImportDeclaration"
            }]
        },
        {
            code:
                "import a from 'foo.js';\n" +
                "import * as b from 'bar.js';",
            parserOptions,
            errors: [{
                message: "Expected 'all' syntax before 'single' syntax.",
                type: "ImportDeclaration"
            }]
        },
        {
            code:
                "import a from 'foo.js';\n" +
                "import 'bar.js';",
            parserOptions,
            errors: [{
                message: "Expected 'none' syntax before 'single' syntax.",
                type: "ImportDeclaration"
            }]
        },
        {
            code:
                "import b from 'bar.js';\n" +
                "import * as a from 'foo.js';",
            parserOptions,
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
            parserOptions,
            errors: [{
                message: "Member 'a' of the import declaration should be sorted alphabetically.",
                type: "ImportSpecifier"
            }, {
                message: "Member 'c' of the import declaration should be sorted alphabetically.",
                type: "ImportSpecifier"
            }]
        },
        {
            code: "import {a, B, c, D} from 'foo.js';",
            parserOptions,
            errors: [{
                message: "Member 'B' of the import declaration should be sorted alphabetically.",
                type: "ImportSpecifier"
            }, {
                message: "Member 'D' of the import declaration should be sorted alphabetically.",
                type: "ImportSpecifier"
            }]
        },
        {
            code:
                "import * as a from './foo';\n" +
                "import bar from 'bar';\n" +
                "import styles from './styles.sass';",
            parserOptions,
            options: [
                {
                    ignoreMemberSort: true,
                    enableTypeSort: true
                }
            ],
            errors: [{
                message: "Imports should be sorted so packages are at the beginning and styles at the end.",
                type: "ImportDeclaration"
            }]
        },
        {
            code:
                "import * as a from 'foo';\n" +
                "import styles from './styles.sass';\n" +
                "import zbar from './bar';",
            parserOptions,
            options: [
                {
                    enableTypeSort: true
                }
            ],
            errors: [{
                message: "Imports should be sorted so packages are at the beginning and styles at the end.",
                type: "ImportDeclaration"
            }]
        },
        {
            code:
                "import * as a from 'foo';\n" +
                "import a from './foo.js';\n" +
                "import {b, c} from './bar.js';\n" +
                "import styles from './styles.sass';",
            parserOptions,
            options: [
                {
                    enableTypeSort: true
                }
            ],
            errors: [{
                message: "Expected 'multiple' syntax before 'single' syntax.",
                type: "ImportDeclaration"
            }]
        },
        {
            code:
                "import * as a from 'foo';\n" +
                "import b from 'foo.js';\n" +
                "import a from 'bar.js';\n" +
                "import styles from './styles.sass';",
            parserOptions,
            options: [
                {
                    enableTypeSort: true
                }
            ],
            errors: [expectedError]
        },

        // TODO sort within block
    ]
});
