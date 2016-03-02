# Disallow duplicate imports (no-duplicate-imports)

An ES6/ES2015 import can be spread over multiple lines, but this takes up unneeded whitespace. This rules validates that all imports from a single module exists in a single import statement.

In the following example the `module` import on line 1 is repeated on line 3. These can be combined to make the list of imports more succinct.

```js
import { merge } from 'module';
import path from 'another-module';
import { find } from 'module';
```

## Rule Details

This inspection reports any duplicated module in an import statement.

The following patterns are considered problems:

```js
/*eslint no-duplicate-imports: 2*/

import { merge } from 'module';
import path from 'another-module';
import { find } from 'module';


import { merge } from 'module';
import _, { find } from 'module';
```

The following patterns are not considered problems:

```js
/*eslint no-duplicate-imports: 2*/

import { merge, find } from 'module';
import path from 'another-module';
```

## Options

This rule takes one optional argument, an object with a single key, `includeExports` which is a `boolean`. It defaults to `false`.

With this option set to `true`, the following patterns are considered problems:

```js
/*eslint no-duplicate-imports: [2, { includeExports: true }]*/

import { merge } from 'module';
import path from 'another-module';

export { find } from 'module';


import _ from 'module';
const find = _.find;

export { find as lodashFind } from 'module';
```

The following patterns are not considered problems:

```js
/*eslint no-duplicate-imports: [2, { includeExports: true }]*/

import { merge, find } from 'module';

export { merge };
export { find as lodashFind };
```
