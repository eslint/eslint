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

const ruleTester = new RuleTester({
    parserOptions: { ecmaVersion: 6, sourceType: "module" }
});

ruleTester.run("no-duplicate-imports", rule, {
    valid: [
        'import os from "os";\nimport fs from "fs";',
        'import { merge } from "lodash-es";',
        'import _, { merge } from "lodash-es";',
        'import * as Foobar from "async";',
        'import "foo"',
        'import os from "os";\nexport { something } from "os";',
        'import { something } from "os";\nimport * as foobar from "os";',
        'import foo, * as bar from "mod";\nimport { baz } from "mod";',
        {
            code: 'import os from "os";\nexport { hello } from "hello";',
            options: [{ includeExports: true }]
        },
        {
            code: 'import os from "os";\nexport * from "hello";',
            options: [{ includeExports: true }]
        },
        {
            code: 'import os from "os";\nexport { hello as hi } from "hello";',
            options: [{ includeExports: true }]
        },
        {
            code: 'import os from "os";\nexport default function(){};',
            options: [{ includeExports: true }]
        },
        {
            code:
                'import { merge } from "lodash-es";\nexport { merge as lodashMerge }',
            options: [{ includeExports: true }]
        },

        // ignore `export * from` declarations, they cannot be merged with any other import/export declarations
        {
            code: "import os from 'os'; export * from 'os';",
            options: [{ includeExports: true }]
        },
        {
            code: "export * from 'os'; import { a } from 'os';",
            options: [{ includeExports: true }]
        },
        {
            code: "import * as ns from 'os'; export * from 'os';",
            options: [{ includeExports: true }]
        },
        {
            code: "export * from 'os'; export { a } from 'os';",
            options: [{ includeExports: true }]
        },
        {
            code: "export { a as b } from 'os'; export * from 'os';",
            options: [{ includeExports: true }]
        }
    ],
    invalid: [
        {
            code: 'import "fs";\nimport "fs"',
            errors: [
                {
                    messageId: "import",
                    data: { module: "fs" },
                    type: "ImportDeclaration"
                }
            ]
        },
        {
            code:
                'import { merge } from "lodash-es";import { find } from "lodash-es";',
            errors: [
                {
                    messageId: "import",
                    data: { module: "lodash-es" },
                    type: "ImportDeclaration"
                }
            ]
        },
        {
            code:
                'import os from "os";\nimport { something } from "os";\nimport * as foobar from "os";',
            errors: [
                {
                    messageId: "import",
                    data: { module: "os" },
                    type: "ImportDeclaration"
                }
            ]
        },
        {
            code:
                'import os from "os";\nimport * as foobar from "os";\nimport { something } from "os";',
            errors: [
                {
                    messageId: "import",
                    data: { module: "os" },
                    type: "ImportDeclaration"
                }
            ]
        },
        {
            code:
                'import os from "os";\nimport * as foobar1 from "os";\nimport * as foobar2 from "os";',
            errors: [
                {
                    messageId: "import",
                    data: { module: "os" },
                    type: "ImportDeclaration"
                },
                {
                    messageId: "import",
                    data: { module: "os" },
                    type: "ImportDeclaration"
                }
            ]
        },
        {
            code:
                'import { merge } from "lodash-es";import _ from "lodash-es";',
            errors: [
                {
                    messageId: "import",
                    data: { module: "lodash-es" },
                    type: "ImportDeclaration"
                }
            ]
        },
        {
            code:
                'import foo, { merge } from "module";\nimport { baz } from "module";',
            errors: [
                {
                    messageId: "import",
                    data: { module: "module" },
                    type: "ImportDeclaration"
                }
            ]
        },
        {
            code:
                'import * as namespace from "lodash-es";\nimport { merge } from "lodash-es";\nimport { baz } from "lodash-es";',
            errors: [
                {
                    messageId: "import",
                    data: { module: "lodash-es" },
                    type: "ImportDeclaration"
                }
            ]
        },
        {
            code: 'export { os } from "os";\nexport { something } from "os";',
            options: [{ includeExports: true }],
            errors: [
                {
                    messageId: "export",
                    data: { module: "os" },
                    type: "ExportNamedDeclaration"
                }
            ]
        },
        {
            code:
                'import os from "os"; export { os as foobar } from "os";\nexport { something } from "os";',
            options: [{ includeExports: true }],
            errors: [
                {
                    messageId: "exportAs",
                    data: { module: "os" },
                    type: "ExportNamedDeclaration"
                },
                {
                    messageId: "export",
                    data: { module: "os" },
                    type: "ExportNamedDeclaration"
                },
                {
                    messageId: "exportAs",
                    data: { module: "os" },
                    type: "ExportNamedDeclaration"
                }
            ]
        },
        {
            code: 'import os from "os";\nexport { something } from "os";',
            options: [{ includeExports: true }],
            errors: [
                {
                    messageId: "exportAs",
                    data: { module: "os" },
                    type: "ExportNamedDeclaration"
                }
            ]
        },
        {
            code: "export * from 'os'; export * from 'os';",
            options: [{ includeExports: true }],
            errors: [
                {
                    messageId: "export",
                    data: { module: "os" },
                    type: "ExportAllDeclaration"
                }
            ]
        }
    ]
});
