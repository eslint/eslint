---
title: no-duplicate-imports
rule_type: problem
---


Using a single `import` statement per module will make the code clearer because you can see everything being imported from that module on one line.

In the following example the `module` import on line 1 is repeated on line 3. These can be combined to make the list of imports more succinct.

```js
import { merge } from 'module';
import something from 'another-module';
import { find } from 'module';
```

## Rule Details

This rule requires that all imports from a single module that can be merged exist in a single `import` statement.

Example of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-duplicate-imports: "error"*/

import { merge } from 'module';
import something from 'another-module';
import { find } from 'module';
```

:::

Example of **correct** code for this rule:

::: correct

```js
/*eslint no-duplicate-imports: "error"*/

import { merge, find } from 'module';
import something from 'another-module';
```

:::

Example of **correct** code for this rule:

::: correct

```js
/*eslint no-duplicate-imports: "error"*/

// not mergeable
import { merge } from 'module';
import * as something from 'module';
```

:::

## Options

This rule has an object option:

* `"includeExports"`: `true` (default `false`) checks for exports in addition to imports.
* `"allowSeparateTypeImports"`: `true` (default `false`) allows a type import alongside a value import from the same module in TypeScript files.

### includeExports

If re-exporting from an imported module, you should add the imports to the `import`-statement, and export that directly, not use `export ... from`.

Example of **incorrect** code for this rule with the `{ "includeExports": true }` option:

::: incorrect

```js
/*eslint no-duplicate-imports: ["error", { "includeExports": true }]*/

import { merge } from 'module';

export { find } from 'module';
```

:::

Example of **correct** code for this rule with the `{ "includeExports": true }` option:

::: correct

```js
/*eslint no-duplicate-imports: ["error", { "includeExports": true }]*/

import { merge, find } from 'module';

export { find };
```

:::

Example of **correct** code for this rule with the `{ "includeExports": true }` option:

::: correct

```js
/*eslint no-duplicate-imports: ["error", { "includeExports": true }]*/

import { merge, find } from 'module';

// cannot be merged with the above import
export * as something from 'module';

// cannot be written differently
export * from 'module';
```

:::

### allowSeparateTypeImports

TypeScript allows importing types using `import type`. By default, this rule flags instances of `import type` that have the same specifier as `import`. The `allowSeparateTypeImports` option allows you to override this behavior.

Example of **incorrect** TypeScript code for this rule with the default `{ "allowSeparateTypeImports": false }` option:

::: incorrect

```ts
/*eslint no-duplicate-imports: ["error", { "allowSeparateTypeImports": false }]*/

import { someValue } from 'module';
import type { SomeType } from 'module';
```

:::

Example of **correct** TypeScript code for this rule with the default `{ "allowSeparateTypeImports": false }` option:

::: correct

```ts
/*eslint no-duplicate-imports: ["error", { "allowSeparateTypeImports": false }]*/

import { someValue, type SomeType } from 'module';
```

:::

Example of **incorrect** TypeScript code for this rule with the `{ "allowSeparateTypeImports": true }` option:

::: incorrect

```ts
/*eslint no-duplicate-imports: ["error", { "allowSeparateTypeImports": true }]*/

import { someValue } from 'module';
import type { SomeType } from 'module';
import type { AnotherType } from 'module';
```

:::

Example of **correct** TypeScript code for this rule with the `{ "allowSeparateTypeImports": true }` option:

::: correct

```ts
/*eslint no-duplicate-imports: ["error", { "allowSeparateTypeImports": true }]*/

import { someValue } from 'module';
import type { SomeType, AnotherType } from 'module';
```

:::
