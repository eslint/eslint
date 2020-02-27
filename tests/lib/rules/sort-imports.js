/**
 * @fileoverview Tests for sort-imports rule.
 * @author Christian Schuller
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/sort-imports"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6, sourceType: "module" } }),
    expectedError = {
        messageId: "sortImportsAlphabetically",
        type: "ImportDeclaration"
    },
    ignoreCaseArgs = [{ ignoreCase: true }];

ruleTester.run("sort-imports", rule, {
    valid: [
        "import a from 'foo.js';\n" +
                "import b from 'bar.js';\n" +
                "import c from 'baz.js';\n",
        "import * as B from 'foo.js';\n" +
                "import A from 'bar.js';",
        "import * as B from 'foo.js';\n" +
                "import {a, b} from 'bar.js';",
        "import {b, c} from 'bar.js';\n" +
                "import A from 'foo.js';",
        {
            code:
                "import A from 'bar.js';\n" +
                "import {b, c} from 'foo.js';",
            options: [{
                memberSyntaxSortOrder: ["single", "multiple", "none", "all"]
            }]
        },
        "import {a, b} from 'bar.js';\n" +
                "import {c, d} from 'foo.js';",
        "import A from 'foo.js';\n" +
                "import B from 'bar.js';",
        "import A from 'foo.js';\n" +
                "import a from 'bar.js';",
        "import a, * as b from 'foo.js';\n" +
                "import c from 'bar.js';",
        "import 'foo.js';\n" +
                " import a from 'bar.js';",
        "import B from 'foo.js';\n" +
                "import a from 'bar.js';",
        {
            code:
                "import a from 'foo.js';\n" +
                "import B from 'bar.js';",
            options: ignoreCaseArgs
        },
        "import {a, b, c, d} from 'foo.js';",
        {
            code:
                "import a from 'foo.js';\n" +
                "import B from 'bar.js';",
            options: [{
                ignoreDeclarationSort: true
            }]
        },
        {
            code: "import {b, A, C, d} from 'foo.js';",
            options: [{
                ignoreMemberSort: true
            }]
        },
        {
            code: "import {B, a, C, d} from 'foo.js';",
            options: [{
                ignoreMemberSort: true
            }]
        },
        {
            code: "import {a, B, c, D} from 'foo.js';",
            options: ignoreCaseArgs
        },
        "import a, * as b from 'foo.js';",
        "import * as a from 'foo.js';\n" +
                "\n" +
                "import b from 'bar.js';",
        "import * as bar from 'bar.js';\n" +
                "import * as foo from 'foo.js';",

        // https://github.com/eslint/eslint/issues/5130
        {
            code:
                "import 'foo';\n" +
                "import bar from 'bar';",
            options: ignoreCaseArgs
        },

        // https://github.com/eslint/eslint/issues/5305
        "import React, {Component} from 'react';"
    ],
    invalid: [
        {
            code:
                "import a from 'foo.js';\n" +
                "import A from 'bar.js';",
            output: null,
            errors: [expectedError]
        },
        {
            code:
                "import b from 'foo.js';\n" +
                "import a from 'bar.js';",
            output: null,
            errors: [expectedError]
        },
        {
            code:
                "import {b, c} from 'foo.js';\n" +
                "import {a, d} from 'bar.js';",
            output: null,
            errors: [expectedError]
        },
        {
            code:
                "import * as foo from 'foo.js';\n" +
                "import * as bar from 'bar.js';",
            output: null,
            errors: [expectedError]
        },
        {
            code:
                "import a from 'foo.js';\n" +
                "import {b, c} from 'bar.js';",
            output: null,
            errors: [{
                messageId: "unexpectedSyntaxOrder",
                data: {
                    syntaxA: "multiple",
                    syntaxB: "single"
                },
                type: "ImportDeclaration"
            }]
        },
        {
            code:
                "import a from 'foo.js';\n" +
                "import * as b from 'bar.js';",
            output: null,
            errors: [{
                messageId: "unexpectedSyntaxOrder",
                data: {
                    syntaxA: "all",
                    syntaxB: "single"
                },
                type: "ImportDeclaration"
            }]
        },
        {
            code:
                "import a from 'foo.js';\n" +
                "import 'bar.js';",
            output: null,
            errors: [{
                messageId: "unexpectedSyntaxOrder",
                data: {
                    syntaxA: "none",
                    syntaxB: "single"
                },
                type: "ImportDeclaration"
            }]
        },
        {
            code:
                "import b from 'bar.js';\n" +
                "import * as a from 'foo.js';",
            output: null,
            options: [{
                memberSyntaxSortOrder: ["all", "single", "multiple", "none"]
            }],
            errors: [{
                messageId: "unexpectedSyntaxOrder",
                data: {
                    syntaxA: "all",
                    syntaxB: "single"
                },
                type: "ImportDeclaration"
            }]
        },
        {
            code: "import {b, a, d, c} from 'foo.js';",
            output: "import {a, b, c, d} from 'foo.js';",
            errors: [{
                messageId: "sortMembersAlphabetically",
                data: { memberName: "a" },
                type: "ImportSpecifier"
            }]
        },
        {
            code:
                "import {b, a, d, c} from 'foo.js';\n" +
                "import {e, f, g, h} from 'bar.js';",
            output:
                "import {a, b, c, d} from 'foo.js';\n" +
                "import {e, f, g, h} from 'bar.js';",
            options: [{
                ignoreDeclarationSort: true
            }],
            errors: [{
                messageId: "sortMembersAlphabetically",
                data: { memberName: "a" },
                type: "ImportSpecifier"
            }]
        },
        {
            code: "import {a, B, c, D} from 'foo.js';",
            output: "import {B, D, a, c} from 'foo.js';",
            errors: [{
                messageId: "sortMembersAlphabetically",
                data: { memberName: "B" },
                type: "ImportSpecifier"
            }]
        },
        {
            code: "import {zzzzz, /* comment */ aaaaa} from 'foo.js';",
            output: null, // not fixed due to comment
            errors: [{
                messageId: "sortMembersAlphabetically",
                data: { memberName: "aaaaa" },
                type: "ImportSpecifier"
            }]
        },
        {
            code: "import {zzzzz /* comment */, aaaaa} from 'foo.js';",
            output: null, // not fixed due to comment
            errors: [{
                messageId: "sortMembersAlphabetically",
                data: { memberName: "aaaaa" },
                type: "ImportSpecifier"
            }]
        },
        {
            code: "import {/* comment */ zzzzz, aaaaa} from 'foo.js';",
            output: null, // not fixed due to comment
            errors: [{
                messageId: "sortMembersAlphabetically",
                data: { memberName: "aaaaa" },
                type: "ImportSpecifier"
            }]
        },
        {
            code: "import {zzzzz, aaaaa /* comment */} from 'foo.js';",
            output: null, // not fixed due to comment
            errors: [{
                messageId: "sortMembersAlphabetically",
                data: { memberName: "aaaaa" },
                type: "ImportSpecifier"
            }]
        },
        {
            code: `
              import {
                boop,
                foo,
                zoo,
                baz as qux,
                bar,
                beep
              } from 'foo.js';
            `,
            output: `
              import {
                bar,
                beep,
                boop,
                foo,
                baz as qux,
                zoo
              } from 'foo.js';
            `,
            errors: [{
                messageId: "sortMembersAlphabetically",
                data: { memberName: "qux" },
                type: "ImportSpecifier"
            }]
        }
    ]
});
