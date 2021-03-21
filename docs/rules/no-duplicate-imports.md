# Disallow duplicate imports (no-duplicate-imports)

Using a single `import` statement per module will make the code clearer because you can see everything being imported from that module on one line.

In the following example the `module` import on line 1 is repeated on line 3. These can be combined to make the list of imports more succinct.

```js
import { merge } from 'module';
import something from 'another-module';
import { find } from 'module';
```

## Rule Details

An import that can be merged with another is a duplicate of that other.

This rule requires that all imports from a single module that can be merged exists in a single `import` statement.

Example of **incorrect** code for this rule:

```js
/*eslint no-duplicate-imports: "error"*/

import { merge } from 'module';
import something from 'another-module';
import { find } from 'module';
```

Example of **correct** code for this rule:

```js
/*eslint no-duplicate-imports: "error"*/

import { merge, find } from 'module';
import something from 'another-module';
```

Example of **correct** code for this rule:

```js
// not mergable, as they would require new nodes to be created.
import { merge } from 'module';
import * as something from 'module';
```

## Options

This rule takes one optional argument, an object with a single key, `includeExports` which is a `boolean`. It defaults to `false`.

If re-exporting from an imported module, you should add the imports to the `import`-statement, and export that directly, not use `export ... from`.

Example of **incorrect** code for this rule with the `{ "includeExports": true }` option:

```js
/*eslint no-duplicate-imports: ["error", { "includeExports": true }]*/

import { merge } from 'module';

export { find } from 'module';
```

Example of **correct** code for this rule with the `{ "includeExports": true }` option:

```js
/*eslint no-duplicate-imports: ["error", { "includeExports": true }]*/

import { merge, find } from 'module';

export { find };
```

There is a special case even the export is duplicate we ignore it, because it can't be merged with another import/export from the same source, it's when we have export with type export *.
 
Example of **correct** code for this rule with the `{ "includeExports": true }` option:

```js

import { merge, find } from 'module';

export * from 'module';
```
