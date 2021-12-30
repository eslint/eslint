/**
 * @fileoverview Tests for no-duplicate-imports.
 * @author Simen Bekkhus
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-duplicate-imports"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 12, sourceType: "module" } });

ruleTester.run("no-duplicate-imports", rule, {
    valid: [
        "import os from \"os\";\nimport fs from \"fs\";",
        "import { merge } from \"lodash-es\";",
        "import _, { merge } from \"lodash-es\";",
        "import * as Foobar from \"async\";",
        "import \"foo\"",
        "import os from \"os\";\nexport { something } from \"os\";",
        "import * as bar from \"os\";\nimport { baz } from \"os\";",
        "import foo, * as bar from \"os\";\nimport { baz } from \"os\";",
        "import foo, { bar } from \"os\";\nimport * as baz from \"os\";",
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
        },
        {
            code: "export { something } from \"os\";\nexport * as os from \"os\";",
            options: [{ includeExports: true }]
        },
        {
            code: "import { something } from \"os\";\nexport * as os from \"os\";",
            options: [{ includeExports: true }]
        },
        {
            code: "import * as os from \"os\";\nexport { something } from \"os\";",
            options: [{ includeExports: true }]
        },
        {
            code: "import os from \"os\";\nexport * from \"os\";",
            options: [{ includeExports: true }]
        },
        {
            code: "export { something } from \"os\";\nexport * from \"os\";",
            options: [{ includeExports: true }]
        }
    ],
    invalid: [
        {
            code: "import \"fs\";\nimport \"fs\"",
            errors: [{ messageId: "import", data: { module: "fs" }, type: "ImportDeclaration" }]
        },
        {
            code: "import { merge } from \"lodash-es\";\nimport { find } from \"lodash-es\";",
            errors: [{ messageId: "import", data: { module: "lodash-es" }, type: "ImportDeclaration" }]
        },
        {
            code: "import { merge } from \"lodash-es\";\nimport _ from \"lodash-es\";",
            errors: [{ messageId: "import", data: { module: "lodash-es" }, type: "ImportDeclaration" }]
        },
        {
            code: "import os from \"os\";\nimport { something } from \"os\";\nimport * as foobar from \"os\";",
            errors: [
                { messageId: "import", data: { module: "os" }, type: "ImportDeclaration" },
                { messageId: "import", data: { module: "os" }, type: "ImportDeclaration" }
            ]
        },
        {
            code: "import * as modns from \"lodash-es\";\nimport { merge } from \"lodash-es\";\nimport { baz } from \"lodash-es\";",
            errors: [{ messageId: "import", data: { module: "lodash-es" }, type: "ImportDeclaration" }]
        },
        {
            code: "export { os } from \"os\";\nexport { something } from \"os\";",
            options: [{ includeExports: true }],
            errors: [{ messageId: "export", data: { module: "os" }, type: "ExportNamedDeclaration" }]
        },
        {
            code: "import os from \"os\";\nexport { os as foobar } from \"os\";\nexport { something } from \"os\";",
            options: [{ includeExports: true }],
            errors: [
                { messageId: "exportAs", data: { module: "os" }, type: "ExportNamedDeclaration" },
                { messageId: "export", data: { module: "os" }, type: "ExportNamedDeclaration" },
                { messageId: "exportAs", data: { module: "os" }, type: "ExportNamedDeclaration" }
            ]
        },
        {
            code: "import os from \"os\";\nexport { something } from \"os\";",
            options: [{ includeExports: true }],
            errors: [{ messageId: "exportAs", data: { module: "os" }, type: "ExportNamedDeclaration" }]
        },
        {
            code: "import os from \"os\";\nexport * as os from \"os\";",
            options: [{ includeExports: true }],
            errors: [{ messageId: "exportAs", data: { module: "os" }, type: "ExportAllDeclaration" }]
        },
        {
            code: "export * as os from \"os\";\nimport os from \"os\";",
            options: [{ includeExports: true }],
            errors: [{ messageId: "importAs", data: { module: "os" }, type: "ImportDeclaration" }]
        },
        {
            code: "import * as modns from \"mod\";\nexport * as  modns from \"mod\";",
            options: [{ includeExports: true }],
            errors: [{ messageId: "exportAs", data: { module: "mod" }, type: "ExportAllDeclaration" }]
        },
        {
            code: "export * from \"os\";\nexport * from \"os\";",
            options: [{ includeExports: true }],
            errors: [{ messageId: "export", data: { module: "os" }, type: "ExportAllDeclaration" }]
        },
        {
            code: "import \"os\";\nexport * from \"os\";",
            options: [{ includeExports: true }],
            errors: [{ messageId: "exportAs", data: { module: "os" }, type: "ExportAllDeclaration" }]
        }
    ]
});
