---
title: no-useless-rename
rule_type: suggestion
related_rules:
- object-shorthand
---



ES2015 allows for the renaming of references in import and export statements as well as destructuring assignments. This gives programmers a concise syntax for performing these operations while renaming these references:

```js
import { foo as bar } from "baz";
export { foo as bar };
let { foo: bar } = baz;
```

With this syntax, it is possible to rename a reference to the same name. This is a completely redundant operation, as this is the same as not renaming at all. For example, this:

```js
import { foo as foo } from "bar";
export { foo as foo };
let { foo: foo } = bar;
```

is the same as:

```js
import { foo } from "bar";
export { foo };
let { foo } = bar;
```

## Rule Details

This rule disallows the renaming of import, export, and destructured assignments to the same name.

## Options

This rule allows for more fine-grained control with the following options:

* `ignoreImport`: When set to `true`, this rule does not check imports
* `ignoreExport`: When set to `true`, this rule does not check exports
* `ignoreDestructuring`: When set to `true`, this rule does not check destructuring assignments

By default, all options are set to `false`:

```json
"no-useless-rename": ["error", {
    "ignoreDestructuring": false,
    "ignoreImport": false,
    "ignoreExport": false
}]
```

Examples of **incorrect** code for this rule by default:

::: incorrect

```js
/*eslint no-useless-rename: "error"*/

import { foo1 as foo1 } from "bar";
import { "foo2" as foo2 } from "bar";
export { foo1 as foo1 };
export { foo2 as "foo2" };
export { foo3 as foo3 } from "bar";
export { "foo4" as "foo4" } from "bar";
let { foo3: foo3 } = bar;
let { 'foo4': foo4 } = bar;
function foo({ bar: bar }) {}
({ foo: foo }) => {}
```

:::

Examples of **correct** code for this rule by default:

::: correct

```js
/*eslint no-useless-rename: "error"*/

import * as foo1 from "foo";
import { foo2 } from "bar";
import { foo as bar1 } from "baz";
import { "foo" as bar2 } from "baz";

export { foo };
export { foo as bar1 };
export { foo as "bar2" };
export { foo as bar3 } from "foo";
export { "foo" as "bar4" } from "foo";

let { foo } = bar;
let { foo: bar } = baz;
let { [qux]: qux } = bar;

function foo3({ bar }) {}
function foo4({ bar: baz }) {}

({ foo }) => {}
({ foo: bar }) => {}
```

:::

Examples of **correct** code for this rule with `{ ignoreImport: true }`:

::: correct

```js
/*eslint no-useless-rename: ["error", { ignoreImport: true }]*/

import { foo as foo } from "bar";
```

:::

Examples of **correct** code for this rule with `{ ignoreExport: true }`:

::: correct

```js
/*eslint no-useless-rename: ["error", { ignoreExport: true }]*/

const foo = 1;
export { foo as foo };
export { bar as bar } from "bar";
```

:::

Examples of **correct** code for this rule with `{ ignoreDestructuring: true }`:

::: correct

```js
/*eslint no-useless-rename: ["error", { ignoreDestructuring: true }]*/

let { foo: foo } = bar;
function baz({ bar: bar }) {}
({ foo: foo }) => {}
```

:::

## When Not To Use It

You can safely disable this rule if you do not care about redundantly renaming import, export, and destructuring assignments.

## Compatibility

* **JSCS**: [disallowIdenticalDestructuringNames](https://jscs-dev.github.io/rule/disallowIdenticalDestructuringNames)
