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

const ruleTester = new RuleTester({ parserOptions: { sourceType: "module" } });

ruleTester.run("no-duplicate-imports", rule, {
    valid: [
        "import os from \"os\";\nimport fs from \"fs\";",
        "import { merge } from \"lodash-es\";",
        "import _, { merge } from \"lodash-es\";",
        "import * as Foobar from \"async\";",
        "import \"foo\"",
        "import os from \"os\";\nexport { something } from \"os\";",
        {
            code: "import os from \"os\";\nexport { hello } from \"hello\";",
            options: [{ includeExports: true }]
        },
        {
            code: "import os from \"os\";\nexport * from \"hello\";",
            options: [{ includeExports: true }]
        },
        {
            code: "import os from \"os\";\nexport { hello as hi } from \"hello\";",
            options: [{ includeExports: true }]
        },
        {
            code: "import os from \"os\";\nexport default function(){};",
            options: [{ includeExports: true }]
        },
        {
            code: "import { merge } from \"lodash-es\";\nexport { merge as lodashMerge }",
            options: [{ includeExports: true }]
        }
    ],
    invalid: [
        {
            code: "import \"fs\";\nimport \"fs\"",
            errors: [{ message: "'fs' import is duplicated.", type: "ImportDeclaration" }]
        },
        {
            code: "import { merge } from \"lodash-es\";import { find } from \"lodash-es\";",
            errors: [{ message: "'lodash-es' import is duplicated.", type: "ImportDeclaration" }]
        },
        {
            code: "import { merge } from \"lodash-es\";import _ from \"lodash-es\";",
            errors: [{ message: "'lodash-es' import is duplicated.", type: "ImportDeclaration" }]
        },
        {
            code: "export { os } from \"os\";\nexport { something } from \"os\";",
            options: [{ includeExports: true }],
            errors: [{ message: "'os' export is duplicated.", type: "ExportNamedDeclaration" }]
        },
        {
            code: "import os from \"os\"; export { os as foobar } from \"os\";\nexport { something } from \"os\";",
            options: [{ includeExports: true }],
            errors: [
                { message: "'os' export is duplicated as import.", type: "ExportNamedDeclaration" },
                { message: "'os' export is duplicated.", type: "ExportNamedDeclaration" },
                { message: "'os' export is duplicated as import.", type: "ExportNamedDeclaration" }
            ]
        },
        {
            code: "import os from \"os\";\nexport { something } from \"os\";",
            options: [{ includeExports: true }],
            errors: [{ message: "'os' export is duplicated as import.", type: "ExportNamedDeclaration" }]
        },
        {
            code: "import os from \"os\";\nexport * from \"os\";",
            options: [{ includeExports: true }],
            errors: [{ message: "'os' export is duplicated as import.", type: "ExportAllDeclaration" }]
        }
    ]
});
