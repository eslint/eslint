/**
 * @fileoverview Tests for no-duplicate-imports.
 * @author Simen Bekkhus
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-duplicate-imports"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-duplicate-imports", rule, {
    valid: [
        { code: "import os from \"os\";\nimport fs from \"fs\";", parserOptions: { sourceType: "module" } },
        { code: "import { merge } from \"lodash-es\";", parserOptions: { sourceType: "module" } },
        { code: "import _, { merge } from \"lodash-es\";", parserOptions: { sourceType: "module" } },
        { code: "import * as Foobar from \"async\";", parserOptions: { sourceType: "module" } },
        { code: "import \"foo\"", parserOptions: { sourceType: "module" } },
        { code: "import os from \"os\";\nexport { something } from \"os\";", parserOptions: { sourceType: "module" } },
        {
            code: "import os from \"os\";\nexport { hello } from \"hello\";",
            parserOptions: { sourceType: "module" },
            options: [{ includeExports: true }]
        },
        {
            code: "import os from \"os\";\nexport * from \"hello\";",
            parserOptions: { sourceType: "module" },
            options: [{ includeExports: true }]
        },
        {
            code: "import os from \"os\";\nexport { hello as hi } from \"hello\";",
            parserOptions: { sourceType: "module" },
            options: [{ includeExports: true }]
        },
        {
            code: "import os from \"os\";\nexport default function(){};",
            parserOptions: { sourceType: "module" },
            options: [{ includeExports: true }]
        },
        {
            code: "import { merge } from \"lodash-es\";\nexport { merge as lodashMerge }",
            parserOptions: { sourceType: "module" },
            options: [{ includeExports: true }]
        }
    ],
    invalid: [
        {
            code: "import \"fs\";\nimport \"fs\"",
            parserOptions: { sourceType: "module" },
            errors: [{ message: "'fs' import is duplicated.", type: "ImportDeclaration" }]
        },
        {
            code: "import { merge } from \"lodash-es\";import { find } from \"lodash-es\";",
            parserOptions: { sourceType: "module" },
            errors: [{ message: "'lodash-es' import is duplicated.", type: "ImportDeclaration" }]
        },
        {
            code: "import { merge } from \"lodash-es\";import _ from \"lodash-es\";",
            parserOptions: { sourceType: "module" },
            errors: [{ message: "'lodash-es' import is duplicated.", type: "ImportDeclaration" }]
        },
        {
            code: "export { os } from \"os\";\nexport { something } from \"os\";",
            parserOptions: { sourceType: "module" },
            options: [{ includeExports: true }],
            errors: [{ message: "'os' export is duplicated.", type: "ExportNamedDeclaration" }]
        },
        {
            code: "import os from \"os\"; export { os as foobar } from \"os\";\nexport { something } from \"os\";",
            parserOptions: { sourceType: "module" },
            options: [{ includeExports: true }],
            errors: [
                { message: "'os' export is duplicated as import.", type: "ExportNamedDeclaration" },
                { message: "'os' export is duplicated.", type: "ExportNamedDeclaration" },
                { message: "'os' export is duplicated as import.", type: "ExportNamedDeclaration" }
            ]
        },
        {
            code: "import os from \"os\";\nexport { something } from \"os\";",
            parserOptions: { sourceType: "module" },
            options: [{ includeExports: true }],
            errors: [{ message: "'os' export is duplicated as import.", type: "ExportNamedDeclaration" }]
        },
        {
            code: "import os from \"os\";\nexport * from \"os\";",
            parserOptions: { sourceType: "module" },
            options: [{ includeExports: true }],
            errors: [{ message: "'os' export is duplicated as import.", type: "ExportAllDeclaration" }]
        }
    ]
});
