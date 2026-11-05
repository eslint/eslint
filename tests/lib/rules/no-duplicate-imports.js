/**
 * @fileoverview Tests for no-duplicate-imports.
 * @author Simen Bekkhus
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-duplicate-imports"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
	languageOptions: { ecmaVersion: 12, sourceType: "module" },
});

ruleTester.run("no-duplicate-imports", rule, {
	valid: [
		'import os from "os";\nimport fs from "fs";',
		'import { merge } from "lodash-es";',
		'import _, { merge } from "lodash-es";',
		'import * as Foobar from "async";',
		'import "foo"',
		'import os from "os";\nexport { something } from "os";',
		'import * as bar from "os";\nimport { baz } from "os";',
		'import foo, * as bar from "os";\nimport { baz } from "os";',
		'import foo, { bar } from "os";\nimport * as baz from "os";',
		{
			code: 'import os from "os";\nexport { hello } from "hello";',
			options: [{ includeExports: true }],
		},
		{
			code: 'import os from "os";\nexport * from "hello";',
			options: [{ includeExports: true }],
		},
		{
			code: 'import os from "os";\nexport { hello as hi } from "hello";',
			options: [{ includeExports: true }],
		},
		{
			code: 'import os from "os";\nexport default function(){};',
			options: [{ includeExports: true }],
		},
		{
			code: 'import { merge } from "lodash-es";\nexport { merge as lodashMerge }',
			options: [{ includeExports: true }],
		},
		{
			code: 'export { something } from "os";\nexport * as os from "os";',
			options: [{ includeExports: true }],
		},
		{
			code: 'import { something } from "os";\nexport * as os from "os";',
			options: [{ includeExports: true }],
		},
		{
			code: 'import * as os from "os";\nexport { something } from "os";',
			options: [{ includeExports: true }],
		},
		{
			code: 'import os from "os";\nexport * from "os";',
			options: [{ includeExports: true }],
		},
		{
			code: 'export { something } from "os";\nexport * from "os";',
			options: [{ includeExports: true }],
		},
	],
	invalid: [
		{
			code: 'import "fs";\nimport "fs"',
			errors: [
				{
					messageId: "import",
					data: { module: "fs" },
				},
			],
		},
		{
			code: 'import { merge } from "lodash-es";\nimport { find } from "lodash-es";',
			errors: [
				{
					messageId: "import",
					data: { module: "lodash-es" },
				},
			],
		},
		{
			code: 'import { merge } from "lodash-es";\nimport _ from "lodash-es";',
			errors: [
				{
					messageId: "import",
					data: { module: "lodash-es" },
				},
			],
		},
		{
			code: 'import os from "os";\nimport { something } from "os";\nimport * as foobar from "os";',
			errors: [
				{
					messageId: "import",
					data: { module: "os" },
				},
				{
					messageId: "import",
					data: { module: "os" },
				},
			],
		},
		{
			code: 'import * as modns from "lodash-es";\nimport { merge } from "lodash-es";\nimport { baz } from "lodash-es";',
			errors: [
				{
					messageId: "import",
					data: { module: "lodash-es" },
				},
			],
		},
		{
			code: 'export { os } from "os";\nexport { something } from "os";',
			options: [{ includeExports: true }],
			errors: [
				{
					messageId: "export",
					data: { module: "os" },
				},
			],
		},
		{
			code: 'import os from "os";\nexport { os as foobar } from "os";\nexport { something } from "os";',
			options: [{ includeExports: true }],
			errors: [
				{
					messageId: "exportAs",
					data: { module: "os" },
				},
				{
					messageId: "export",
					data: { module: "os" },
				},
				{
					messageId: "exportAs",
					data: { module: "os" },
				},
			],
		},
		{
			code: 'import os from "os";\nexport { something } from "os";',
			options: [{ includeExports: true }],
			errors: [
				{
					messageId: "exportAs",
					data: { module: "os" },
				},
			],
		},
		{
			code: 'import os from "os";\nexport * as os from "os";',
			options: [{ includeExports: true }],
			errors: [
				{
					messageId: "exportAs",
					data: { module: "os" },
				},
			],
		},
		{
			code: 'export * as os from "os";\nimport os from "os";',
			options: [{ includeExports: true }],
			errors: [
				{
					messageId: "importAs",
					data: { module: "os" },
				},
			],
		},
		{
			code: 'import * as modns from "mod";\nexport * as  modns from "mod";',
			options: [{ includeExports: true }],
			errors: [
				{
					messageId: "exportAs",
					data: { module: "mod" },
				},
			],
		},
		{
			code: 'export * from "os";\nexport * from "os";',
			options: [{ includeExports: true }],
			errors: [
				{
					messageId: "export",
					data: { module: "os" },
				},
			],
		},
		{
			code: 'import "os";\nexport * from "os";',
			options: [{ includeExports: true }],
			errors: [
				{
					messageId: "exportAs",
					data: { module: "os" },
				},
			],
		},
	],
});

const ruleTesterTypeScript = new RuleTester({
	languageOptions: {
		parser: require("@typescript-eslint/parser"),
	},
});

ruleTesterTypeScript.run("no-duplicate-imports", rule, {
	valid: [
		'import type { Os } from "os";\nimport type { Fs } from "fs";',
		'import { type Os } from "os";\nimport type { Fs } from "fs";',
		'import type { Merge } from "lodash-es";',
		'import _, { type Merge } from "lodash-es";',
		'import type * as Foobar from "async";',
		'import type Os from "os";\nexport type { Something } from "os";',
		'import type Os from "os";\nexport { type Something } from "os";',
		'import type * as Bar from "os";\nimport { type Baz } from "os";',
		'import foo, * as bar from "os";\nimport { type Baz } from "os";',
		'import foo, { type bar } from "os";\nimport type * as Baz from "os";',
		'import type { Merge } from "lodash-es";\nimport type _ from "lodash-es";',
		{
			code: 'import type Os from "os";\nexport { type Hello } from "hello";',
			options: [{ includeExports: true }],
		},
		{
			code: 'import type Os from "os";\nexport type * from "hello";',
			options: [{ includeExports: true }],
		},
		{
			code: 'import type Os from "os";\nexport { type Hello as Hi } from "hello";',
			options: [{ includeExports: true }],
		},
		{
			code: 'import type Os from "os";\nexport default function(){};',
			options: [{ includeExports: true }],
		},
		{
			code: 'import { type Merge } from "lodash-es";\nexport { Merge as lodashMerge }',
			options: [{ includeExports: true }],
		},
		{
			code: 'export type { Something } from "os";\nexport * as os from "os";',
			options: [{ includeExports: true }],
		},
		{
			code: 'import { type Something } from "os";\nexport * as os from "os";',
			options: [{ includeExports: true }],
		},
		{
			code: 'import type * as Os from "os";\nexport { something } from "os";',
			options: [{ includeExports: true }],
		},
		{
			code: 'import type Os from "os";\nexport * from "os";',
			options: [{ includeExports: true }],
		},
		{
			code: 'import type Os from "os";\nexport type { Something } from "os";',
			options: [{ includeExports: true }],
		},
		{
			code: 'export type { Something } from "os";\nexport * from "os";',
			options: [{ includeExports: true }],
		},
		{
			code: 'import { foo, type Bar } from "module";',
			options: [{ allowSeparateTypeImports: true }],
		},
		{
			code: 'import { foo } from "module";\nimport type { Bar } from "module";',
			options: [{ allowSeparateTypeImports: true }],
		},
		{
			code: 'import { type Foo } from "module";\nimport type { Bar } from "module";',
			options: [{ allowSeparateTypeImports: true }],
		},
		{
			code: 'import { foo, type Bar } from "module";\nexport { type Baz } from "module2";',
			options: [{ allowSeparateTypeImports: true, includeExports: true }],
		},
		{
			code: 'import type { Foo } from "module";\nexport { bar, type Baz } from "module";',
			options: [{ allowSeparateTypeImports: true, includeExports: true }],
		},
		{
			code: 'import { type Foo } from "module";\nexport type { Bar } from "module";',
			options: [{ allowSeparateTypeImports: true, includeExports: true }],
		},
		{
			code: 'import type * as Foo from "module";\nexport { type Bar } from "module";',
			options: [{ allowSeparateTypeImports: true, includeExports: true }],
		},
		{
			code: 'import { type Foo } from "module";\nexport type * as Bar from "module";',
			options: [{ allowSeparateTypeImports: true, includeExports: true }],
		},
	],
	invalid: [
		{
			code: 'import "fs";\nimport "fs"',
			errors: [
				{
					messageId: "import",
					data: { module: "fs" },
				},
			],
		},
		{
			code: 'import { type Merge } from "lodash-es";\nimport { type Find } from "lodash-es";',
			errors: [
				{
					messageId: "import",
					data: { module: "lodash-es" },
				},
			],
		},
		{
			code: 'import { type Merge } from "lodash-es";\nimport type { Find } from "lodash-es";',
			errors: [
				{
					messageId: "import",
					data: { module: "lodash-es" },
				},
			],
		},
		{
			code: 'import type { Merge } from "lodash-es";\nimport type { Find } from "lodash-es";',
			errors: [
				{
					messageId: "import",
					data: { module: "lodash-es" },
				},
			],
		},
		{
			code: 'import type Os from "os";\nimport type { Something } from "os";\nimport type * as Foobar from "os";',
			errors: [
				{
					messageId: "import",
					data: { module: "os" },
				},
			],
		},
		{
			code: 'import type * as Modns from "lodash-es";\nimport type { Merge } from "lodash-es";\nimport type { Baz } from "lodash-es";',
			errors: [
				{
					messageId: "import",
					data: { module: "lodash-es" },
				},
			],
		},
		{
			code: 'import { type Foo } from "module";\nexport type { Bar } from "module";',
			options: [{ includeExports: true }],
			errors: [
				{
					messageId: "exportAs",
					data: { module: "module" },
				},
			],
		},
		{
			code: 'export { os } from "os";\nexport type { Something } from "os";',
			options: [{ includeExports: true }],
			errors: [
				{
					messageId: "export",
					data: { module: "os" },
				},
			],
		},
		{
			code: 'export type { Os } from "os";\nexport type { Something } from "os";',
			options: [{ includeExports: true }],
			errors: [
				{
					messageId: "export",
					data: { module: "os" },
				},
			],
		},
		{
			code: 'import type { Os } from "os";\nexport type { Os as Foobar } from "os";\nexport type { Something } from "os";',
			options: [{ includeExports: true }],
			errors: [
				{
					messageId: "exportAs",
					data: { module: "os" },
				},
				{
					messageId: "export",
					data: { module: "os" },
				},
				{
					messageId: "exportAs",
					data: { module: "os" },
				},
			],
		},
		{
			code: 'import type { Os } from "os";\nexport type { Something } from "os";',
			options: [{ includeExports: true }],
			errors: [
				{
					messageId: "exportAs",
					data: { module: "os" },
				},
			],
		},
		{
			code: 'import type Os from "os";\nexport type * as Os from "os";',
			options: [{ includeExports: true }],
			errors: [
				{
					messageId: "exportAs",
					data: { module: "os" },
				},
			],
		},
		{
			code: 'import type * as Modns from "mod";\nexport type * as Modns from "mod";',
			options: [{ includeExports: true }],
			errors: [
				{
					messageId: "exportAs",
					data: { module: "mod" },
				},
			],
		},
		{
			code: 'export type * from "os";\nexport type * from "os";',
			options: [{ includeExports: true }],
			errors: [
				{
					messageId: "export",
					data: { module: "os" },
				},
			],
		},
		{
			code: 'import "os";\nexport type { Os } from "os";',
			options: [{ includeExports: true }],
			errors: [
				{
					messageId: "exportAs",
					data: { module: "os" },
				},
			],
		},
		{
			code: "import { someValue } from 'module';\nimport { anotherValue } from 'module';",
			options: [{ allowSeparateTypeImports: true }],
			errors: [
				{
					messageId: "import",
					data: { module: "module" },
				},
			],
		},
		{
			code: 'import type { Merge } from "lodash-es";\nimport type { Find } from "lodash-es";',
			options: [{ allowSeparateTypeImports: true }],
			errors: [
				{
					messageId: "import",
					data: { module: "lodash-es" },
				},
			],
		},
		{
			code: "import { someValue, type Foo } from 'module';\nimport type { SomeType } from 'module';\nimport type { AnotherType } from 'module';",
			options: [{ allowSeparateTypeImports: true }],
			errors: [
				{
					messageId: "import",
					data: { module: "module" },
				},
			],
		},
		{
			code: "import { type Foo } from 'module';\nimport { type Bar } from 'module';",
			options: [{ allowSeparateTypeImports: true }],
			errors: [
				{
					messageId: "import",
					data: { module: "module" },
				},
			],
		},
		{
			code: 'export type { Foo } from "module";\nexport type { Bar } from "module";',
			options: [{ allowSeparateTypeImports: true, includeExports: true }],
			errors: [
				{
					messageId: "export",
					data: { module: "module" },
				},
			],
		},
		{
			code: 'import { type Foo } from "module";\nexport { type Bar } from "module";\nexport { type Baz } from "module";',
			options: [{ allowSeparateTypeImports: true, includeExports: true }],
			errors: [
				{
					messageId: "exportAs",
					data: { module: "module" },
				},
				{
					messageId: "export",
					data: { module: "module" },
				},
				{
					messageId: "exportAs",
					data: { module: "module" },
				},
			],
		},
		{
			code: 'import { type Foo } from "module";\nexport { type Bar } from "module";\nexport { regular } from "module";',
			options: [{ allowSeparateTypeImports: true, includeExports: true }],
			errors: [
				{
					messageId: "exportAs",
					data: { module: "module" },
				},
				{
					messageId: "export",
					data: { module: "module" },
				},
				{
					messageId: "exportAs",
					data: { module: "module" },
				},
			],
		},
		{
			code: 'import { type Foo } from "module";\nimport { regular } from "module";\nexport { type Bar } from "module";\nexport { regular as other } from "module";',
			options: [{ allowSeparateTypeImports: true, includeExports: true }],
			errors: [
				{
					messageId: "import",
					data: { module: "module" },
				},
				{
					messageId: "exportAs",
					data: { module: "module" },
				},
				{
					messageId: "export",
					data: { module: "module" },
				},
				{
					messageId: "exportAs",
					data: { module: "module" },
				},
			],
		},
	],
	fatal: [
		{
			name: "first option wrong type (number)",
			options: [123],
			error: { name: "SchemaValidationError" },
		},
	],
});
