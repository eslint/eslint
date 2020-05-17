/**
 * @fileoverview Tests for sort-imports rule.
 * @author Ilia Mazan
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/advanced-sort-imports"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6, sourceType: "module" } });
const expectedDeclarationError = {
    messageId: "sortDeclaration",
    type: "ImportDeclaration"
};
const expectedDeclarationSyntaxError = {
    messageId: "sortDeclarationSyntax",
    type: "ImportDeclaration"
};
const expectedMemberError = {
    messageId: "SortMemberAlphabetically",
    type: "ImportDeclaration"
};
const expectedSourceValueError = {
    messageId: "SortSourceValueAlphabetically",
    type: "ImportDeclaration"
};
const expectedMissingBlankLineError = {
    messageId: "missingBlankLine",
    type: "ImportDeclaration"
};

ruleTester.run("sort-imports", rule, {
    valid: [
        "import DefaultGlobal from 'global';\n" +
            "import DefaultGlobal1, { SingleGlobal } from 'global';\n" +
            "import { SingleGlobal1 } from 'global';\n" +
            "import { MultipleGlobal, MultipleGlobal1 } from 'global';",

        "import DefaultAbsolute from '@/absolute';\n" +
            "import DefaultAbsolute1, { SingleAbsolute } from '@/absolute';\n" +
            "import { SingleAbsolute1 } from '@/absolute';\n" +
            "import { MultipleAbsolute, MultipleAbsolute1 } from '@/absolute';",

        "import DefaultLocal from './local';\n" +
            "import DefaultLocal1, { SingleLocal } from './local';\n" +
            "import { SingleLocal1 } from './local';\n" +
            "import { MultipleLocal, MultipleLocal1 } from './local';",

        "import DefaultGlobal from 'global';\n" +
            "import DefaultGlobal1, { SingleGlobal } from 'global';\n\n" +
            "import DefaultAbsolute from '@/absolute';\n" +
            "import DefaultAbsolute1, { SingleAbsolute } from '@/absolute';\n",

        "import DefaultGlobal from 'global';\n" +
            "import DefaultGlobal1, { SingleGlobal } from 'global';\n\n" +
            "import { SingleAbsolute } from '@/absolute';\n" +
            "import { MultipleAbsolute, MultipleAbsolute1 } from '@/absolute';",

        "import { SingleGlobal } from 'global';\n" +
            "import { MultipleGlobal, MultipleGlobal1 } from 'global';\n\n" +
            "import DefaultAbsolute from '@/absolute';\n" +
            "import DefaultAbsolute1, { SingleAbsolute } from '@/absolute';\n",

        "import { SingleGlobal } from 'global';\n" +
            "import { MultipleGlobal, MultipleGlobal1 } from 'global';\n\n" +
            "import { SingleAbsolute } from '@/absolute';\n" +
            "import { MultipleAbsolute, MultipleAbsolute1 } from '@/absolute';",

        "import {a, b, c, d} from './local';",
        {
            code:
                "import { SingleLocal } from './local';\n\n" +
                "import { MultipleAbsolute, MultipleAbsolute1 } from '@/absolute';\n\n" +
                "import DefaultGlobal from 'global';",
            options: [{
                declarationSortOrder: ["local", "absolute", "global"]
            }]
        },
        {
            code:
                "import { SingleLocal } from './local';\n" +
                "import { MultipleLocal, MultipleLocal1 } from './local';\n" +
                "import './local';\n" +
                "import DefaultLocal, { SingleLocal1 } from './local';\n" +
                "import DefaultLocal1 from './local';",
            options: [{
                declarationSyntaxSortOrder: ["single", "multiple", "none", "mix", "default"]
            }]
        },
        {
            code:
                "import DefaultAbsolute from '@/absolute';\n\n" +
                "import DefaultGlobal, { SingleGlobal } from 'global';\n\n" +
                "import { SingleAbsolute } from '@/absolute';\n\n" +
                "import { MultipleGlobal, MultipleGlobal1 } from 'global';",
            options: [{
                ignoreDeclarationSort: true
            }]
        },
        {
            code: "import DefaultGlobal from 'global';\n" +
                "import { MultipleGlobal, MultipleGlobal1 } from 'global';" +
                "import { SingleGlobal } from 'global';\n" +
                "import DefaultGlobal1, { SingleGlobal1 } from 'global';\n",
            options: [{
                ignoreDeclarationSyntaxSort: true
            }]
        },
        {
            code: "import {B, a, C, d} from './local';",
            options: [{
                ignoreMemberSort: true
            }]
        },
        {
            code: "import {a, B, c, D} from './local';",
            options: [{
                ignoreCase: true
            }]
        },
        {
            code: "import { SingleGlobal } from 'global';\n" +
                "import { MultipleGlobal, MultipleGlobal1 } from 'global';\n" +
                "import { SingleAbsolute } from '@/absolute';\n" +
                "import { MultipleAbsolute, MultipleAbsolute1 } from '@/absolute';",
            options: [{
                ignoreMissingBlankLineBetweenDeclarations: true
            }]
        },
        "import React, {Component} from 'react';"
    ],
    invalid: [
        {
            code:
                "import DefaultAbsolute from '@/absolute';\n\n" +
                "import DefaultGlobal, { SingleGlobal } from 'global';\n\n" +
                "import { SingleAbsolute } from '@/absolute';\n\n" +
                "import { MultipleGlobal, MultipleGlobal1 } from 'global';",
            output: "import DefaultGlobal, { SingleGlobal } from 'global';\n\n" +
                "import DefaultAbsolute from '@/absolute';\n\n" +
                "import { MultipleGlobal, MultipleGlobal1 } from 'global';\n\n" +
                "import { SingleAbsolute } from '@/absolute';",
            errors: [expectedDeclarationError, expectedDeclarationError]
        },
        {
            code:
                "import DefaultGlobal from 'global';\n" +
                "import { MultipleGlobal, MultipleGlobal1 } from 'global';\n" +
                "import { SingleGlobal } from 'global';\n" +
                "import DefaultGlobal1, { SingleGlobal1 } from 'global';",
            output: "import DefaultGlobal from 'global';\n" +
                "import { SingleGlobal } from 'global';\n" +
                "import { MultipleGlobal, MultipleGlobal1 } from 'global';\n" +
                "import DefaultGlobal1, { SingleGlobal1 } from 'global';",
            errors: [expectedDeclarationSyntaxError, expectedDeclarationSyntaxError]
        },
        {
            code:
                "import {B, a, C, d} from './local';",
            output: "import {B, C, a, d} from './local';",
            errors: [expectedMemberError]
        },
        {
            code:
                "import { SingleGlobal } from 'global';\n" +
                "import { MultipleGlobal, MultipleGlobal1 } from 'global';\n" +
                "import { SingleAbsolute } from '@/absolute';\n" +
                "import { MultipleAbsolute, MultipleAbsolute1 } from '@/absolute';",
            output: "import { SingleGlobal } from 'global';\n" +
                "import { MultipleGlobal, MultipleGlobal1 } from 'global';\n\n" +
                "import { SingleAbsolute } from '@/absolute';\n" +
                "import { MultipleAbsolute, MultipleAbsolute1 } from '@/absolute';",
            errors: [expectedMissingBlankLineError]
        },
        {
            code:
                "import { SingleGlobal } from 'global1';\n" +
                "import { SingleGlobal1 } from 'global';",
            output: "import { SingleGlobal1 } from 'global';\n" +
                "import { SingleGlobal } from 'global1';",
            errors: [expectedSourceValueError]
        }
    ]
});
