---
title: no-import-assign
rule_type: problem
handled_by_typescript: true
extra_typescript_info: Note that the compiler will not catch the `Object.assign()` case. Thus, if you use `Object.assign()` in your codebase, this rule will still provide some value.
---



The updates of imported bindings by ES Modules cause runtime errors.

## Rule Details

This rule warns the assignments, increments, and decrements of imported bindings.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-import-assign: "error"*/

import mod, { named } from "./mod.mjs"
import * as mod_ns from "./mod.mjs"

mod = 1          // ERROR: 'mod' is readonly.
named = 2        // ERROR: 'named' is readonly.
mod_ns.named = 3 // ERROR: The members of 'mod_ns' are readonly.
mod_ns = {}      // ERROR: 'mod_ns' is readonly.
// Can't extend 'mod_ns'
Object.assign(mod_ns, { foo: "foo" }) // ERROR: The members of 'mod_ns' are readonly.
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-import-assign: "error"*/

import mod, { named } from "./mod.mjs"
import * as mod_ns from "./mod.mjs"

mod.prop = 1
named.prop = 2
mod_ns.named.prop = 3

// Known Limitation
function test(obj) {
    obj.named = 4 // Not errored because 'obj' is not namespace objects.
}
test(mod_ns) // Not errored because it doesn't know that 'test' updates the member of the argument.
```

:::

## When Not To Use It

If you don't want to be notified about modifying imported bindings, you can disable this rule.
