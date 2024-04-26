---
title: sort-imports
rule_type: suggestion
related_rules:
- sort-keys
- sort-vars
---



The import statement is used to import members (functions, objects or primitives) that have been exported from an external module. Using a specific member syntax:

```js
// single - Import single member.
import myMember from "my-module.js";
import {myOtherMember} from "my-other-module.js";

// multiple - Import multiple members.
import {foo, bar} from "my-module.js";

// all - Import all members, where myModule contains all the exported bindings.
import * as myModule from "my-module.js";
```

The import statement can also import a module without exported bindings. Used when the module does not export anything, but runs it own code or changes the global context object.

```js
// none - Import module without exported bindings.
import "my-module.js"
```

When declaring multiple imports, a sorted list of import declarations make it easier for developers to read the code and find necessary imports later. This rule is purely a matter of style.

## Rule Details

This rule checks all import declarations and verifies that all imports are first sorted by the used member syntax and then alphabetically by the first member or alias name.

The `--fix` option on the command line automatically fixes some problems reported by this rule: multiple members on a single line are automatically sorted (e.g. `import { b, a } from 'foo.js'` is corrected to `import { a, b } from 'foo.js'`), but multiple lines are not reordered.

## Options

This rule accepts an object with its properties as

* `ignoreCase` (default: `false`)
* `ignoreDeclarationSort` (default: `false`)
* `ignoreMemberSort` (default: `false`)
* `memberSyntaxSortOrder` (default: `["none", "all", "multiple", "single"]`); all 4 items must be present in the array, but you can change the order:
    * `none` = import module without exported bindings.
    * `all` = import all members provided by exported bindings.
    * `multiple` = import multiple members.
    * `single` = import single member.
* `allowSeparatedGroups` (default: `false`)

Default option settings are:

```json
{
    "sort-imports": ["error", {
        "ignoreCase": false,
        "ignoreDeclarationSort": false,
        "ignoreMemberSort": false,
        "memberSyntaxSortOrder": ["none", "all", "multiple", "single"],
        "allowSeparatedGroups": false
    }]
}
```

## Examples

### Default settings

Examples of **correct** code for this rule when using default options:

::: correct

```js
/*eslint sort-imports: "error"*/
import 'module-without-export.js';
import * as bar from 'bar.js';
import * as foo from 'foo.js';
import {alpha, beta} from 'alpha.js';
import {delta, gamma} from 'delta.js';
import a from 'baz.js';
import {b} from 'qux.js';
```

:::

::: correct

```js
/*eslint sort-imports: "error"*/
import a from 'foo.js';
import b from 'bar.js';
import c from 'baz.js';
```

:::

::: correct

```js
/*eslint sort-imports: "error"*/
import 'foo.js'
import * as bar from 'bar.js';
import {a, b} from 'baz.js';
import c from 'qux.js';
import {d} from 'quux.js';
```

:::

::: correct

```js
/*eslint sort-imports: "error"*/
import {a, b, c} from 'foo.js'
```

:::

Examples of **incorrect** code for this rule when using default options:

::: incorrect

```js
/*eslint sort-imports: "error"*/
import b from 'foo.js';
import a from 'bar.js';
```

:::

::: incorrect

```js
/*eslint sort-imports: "error"*/
import a from 'foo.js';
import A from 'bar.js';
```

:::

::: incorrect

```js
/*eslint sort-imports: "error"*/
import {c, d} from 'foo.js';
import {a, b} from 'bar.js';
```

:::

::: incorrect

```js
/*eslint sort-imports: "error"*/
import a from 'foo.js';
import {b, c} from 'bar.js';
```

:::

::: incorrect

```js
/*eslint sort-imports: "error"*/
import {a} from 'foo.js';
import {b, c} from 'bar.js';
```

:::

::: incorrect

```js
/*eslint sort-imports: "error"*/
import a from 'foo.js';
import * as b from 'bar.js';
```

:::

::: incorrect

```js
/*eslint sort-imports: "error"*/
import {b, a, c} from 'foo.js'
```

:::

### `ignoreCase`

When `false` (default), uppercase letters of the alphabet must always precede lowercase letters.

When `true`, the rule ignores the case-sensitivity of the imports local name.

Examples of **incorrect** code for this rule with the default `{ "ignoreCase": false }` option:

::: incorrect

```js
/*eslint sort-imports: ["error", { "ignoreCase": false }]*/
import a from 'bar.js';
import B from 'foo.js';
import c from 'baz.js';
```

:::

Examples of **correct** code for this rule with the default `{ "ignoreCase": false }` option:

::: correct

```js
/*eslint sort-imports: ["error", { "ignoreCase": false }]*/
import B from 'bar.js';
import a from 'foo.js';
import c from 'baz.js';
```

:::

Examples of **correct** code for this rule with `{ "ignoreCase": true }` option:

::: correct

```js
/*eslint sort-imports: ["error", { "ignoreCase": true }]*/
import a from 'bar.js';
import B from 'foo.js';
import c from 'baz.js';
```

:::

Examples of **incorrect** code for this rule with the `{ "ignoreCase": true }` option:

::: incorrect

```js
/*eslint sort-imports: ["error", { "ignoreCase": true }]*/
import B from 'foo.js';
import a from 'bar.js';
```

:::

### `ignoreDeclarationSort`

When `true`, the rule ignores the sorting of import declaration statements. Default is `false`.

Examples of **incorrect** code for this rule with the default `{ "ignoreDeclarationSort": false }` option:

::: incorrect

```js
/*eslint sort-imports: ["error", { "ignoreDeclarationSort": false }]*/
import b from 'foo.js'
import a from 'bar.js'
```

:::

Examples of **correct** code for this rule with the default `{ "ignoreDeclarationSort": false }` option:

::: correct

```js
/*eslint sort-imports: ["error", { "ignoreDeclarationSort": false }]*/
import a from 'bar.js';
import b from 'foo.js';
```

:::

Examples of **correct** code for this rule with the `{ "ignoreDeclarationSort": true }` option:

::: correct

```js
/*eslint sort-imports: ["error", { "ignoreDeclarationSort": true }]*/
import b from 'foo.js'
import a from 'bar.js'
```

:::

Examples of **incorrect** code for this rule with the `{ "ignoreDeclarationSort": true }` option:

::: incorrect

```js
/*eslint sort-imports: ["error", { "ignoreDeclarationSort": true }]*/
import {b, a, c} from 'foo.js';
```

:::

### `ignoreMemberSort`

When `true`, the rule ignores the member sorting within a `multiple` member import declaration. Default is `false`.

Examples of **incorrect** code for this rule with the default `{ "ignoreMemberSort": false }` option:

::: incorrect

```js
/*eslint sort-imports: ["error", { "ignoreMemberSort": false }]*/
import {b, a, c} from 'foo.js'
```

:::

Examples of **correct** code for this rule with the default `{ "ignoreMemberSort": false }` option:

::: correct

```js
/*eslint sort-imports: ["error", { "ignoreMemberSort": false }]*/
import {a, b, c} from 'foo.js';
```

:::

Examples of **correct** code for this rule with the `{ "ignoreMemberSort": true }` option:

::: correct

```js
/*eslint sort-imports: ["error", { "ignoreMemberSort": true }]*/
import {b, a, c} from 'foo.js'
```

:::

Examples of **incorrect** code for this rule with the `{ "ignoreMemberSort": true }` option:

::: incorrect

```js
/*eslint sort-imports: ["error", { "ignoreMemberSort": true }]*/
import b from 'foo.js';
import a from 'bar.js';
```

:::

### `memberSyntaxSortOrder`

This option takes an array with four predefined elements, the order of elements specifies the order of import styles.

Default order is `["none", "all", "multiple", "single"]`.

There are four different styles and the default member syntax sort order is:

* `none` - import module without exported bindings.
* `all` - import all members provided by exported bindings.
* `multiple` - import multiple members.
* `single` - import single member.

All four options must be specified in the array, but you can customize their order.

Examples of **incorrect** code for this rule with the default `{ "memberSyntaxSortOrder": ["none", "all", "multiple", "single"] }` option:

::: incorrect

```js
/*eslint sort-imports: "error"*/
import a from 'foo.js';
import * as b from 'bar.js';
```

:::

Examples of **correct** code for this rule with the `{ "memberSyntaxSortOrder": ['single', 'all', 'multiple', 'none'] }` option:

::: correct

```js
/*eslint sort-imports: ["error", { "memberSyntaxSortOrder": ['single', 'all', 'multiple', 'none'] }]*/

import a from 'foo.js';
import * as b from 'bar.js';
```

:::

Examples of **correct** code for this rule with the `{ "memberSyntaxSortOrder": ['all', 'single', 'multiple', 'none'] }` option:

::: correct

```js
/*eslint sort-imports: ["error", { "memberSyntaxSortOrder": ['all', 'single', 'multiple', 'none'] }]*/

import * as foo from 'foo.js';
import z from 'zoo.js';
import {a, b} from 'foo.js';
```

:::

### `allowSeparatedGroups`

When `true`, the rule checks the sorting of import declaration statements only for those that appear on consecutive lines. Default is `false`.

In other words, a blank line or a comment line or line with any other statement after an import declaration statement will reset the sorting of import declaration statements.

Examples of **incorrect** code for this rule with the `{ "allowSeparatedGroups": true }` option:

::: incorrect

```js
/*eslint sort-imports: ["error", { "allowSeparatedGroups": true }]*/

import b from 'foo.js';
import c from 'bar.js';
import a from 'baz.js';
```

:::

Examples of **correct** code for this rule with the `{ "allowSeparatedGroups": true }` option:

::: correct

```js
/*eslint sort-imports: ["error", { "allowSeparatedGroups": true }]*/

import b from 'foo.js';
import c from 'bar.js';

import a from 'baz.js';
```

:::

::: correct

```js
/*eslint sort-imports: ["error", { "allowSeparatedGroups": true }]*/

import b from 'foo.js';
import c from 'bar.js';
// comment
import a from 'baz.js';
```

:::

::: correct

```js
/*eslint sort-imports: ["error", { "allowSeparatedGroups": true }]*/

import b from 'foo.js';
import c from 'bar.js';
quux();
import a from 'baz.js';
```

:::

## When Not To Use It

This rule is a formatting preference and not following it won't negatively affect the quality of your code. If alphabetizing imports isn't a part of your coding standards, then you can leave this rule disabled.
