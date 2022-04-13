---
title: no-restricted-exports
layout: doc
edit_link: https://github.com/eslint/eslint/edit/main/docs/src/rules/no-restricted-exports.md
rule_type: suggestion
---

Disallows specified names in exports.

In a project, certain names may be disallowed from being used as exported names for various reasons.

## Rule Details

This rule disallows specified names from being used as exported names.

## Options

By default, this rule doesn't disallow any names. Only the names you specify in the configuration will be disallowed.

This rule has an object option:

* `"restrictedNamedExports"` is an array of strings, where each string is a name to be restricted.

Examples of **incorrect** code for this rule:

```js
/*eslint no-restricted-exports: ["error", {
    "restrictedNamedExports": ["foo", "bar", "Baz", "a", "b", "c", "d", "e", "👍"]
}]*/

export const foo = 1;

export function bar() {}

export class Baz {}

const a = {};
export { a };

function someFunction() {}
export { someFunction as b };

export { c } from "some_module";

export { "d" } from "some_module";

export { something as e } from "some_module";

export { "👍" } from "some_module";
```

Examples of **correct** code for this rule:

```js
/*eslint no-restricted-exports: ["error", {
    "restrictedNamedExports": ["foo", "bar", "Baz", "a", "b", "c", "d", "e", "👍"]
}]*/

export const quux = 1;

export function myFunction() {}

export class MyClass {}

const a = {};
export { a as myObject };

function someFunction() {}
export { someFunction };

export { c as someName } from "some_module";

export { "d" as " d " } from "some_module";

export { something } from "some_module";

export { "👍" as thumbsUp } from "some_module";
```

### Default exports

By design, this rule doesn't disallow `export default` declarations. If you configure `"default"` as a restricted name, that restriction will apply only to named export declarations.

Examples of additional **incorrect** code for this rule:

```js
/*eslint no-restricted-exports: ["error", { "restrictedNamedExports": ["default"] }]*/

function foo() {}

export { foo as default };
```

```js
/*eslint no-restricted-exports: ["error", { "restrictedNamedExports": ["default"] }]*/

export { default } from "some_module";
```

Examples of additional **correct** code for this rule:

```js
/*eslint no-restricted-exports: ["error", { "restrictedNamedExports": ["default", "foo"] }]*/

export default function foo() {}
```

## Known Limitations

This rule doesn't inspect the content of source modules in re-export declarations. In particular, if you are re-exporting everything from another module's export, that export may include a restricted name. This rule cannot detect such cases.

```js

//----- some_module.js -----
export function foo() {}

//----- my_module.js -----
/*eslint no-restricted-exports: ["error", { "restrictedNamedExports": ["foo"] }]*/

export * from "some_module"; // allowed, although this declaration exports "foo" from my_module
```
