---
title: no-nested-ternary
rule_type: suggestion
related_rules:
- no-ternary
- no-unneeded-ternary
---


Nesting ternary expressions can make code more difficult to understand.

```js
const foo = bar ? baz : qux === quxx ? bing : bam;
```

## Rule Details

The `no-nested-ternary` rule disallows nested ternary expressions.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-nested-ternary: "error"*/

const thing = foo ? bar : baz === qux ? quxx : foobar;

foo ? baz === qux ? quxx() : foobar() : bar();
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-nested-ternary: "error"*/

const thing = foo ? bar : foobar;

let otherThing;

if (foo) {
  otherThing = bar;
} else if (baz === qux) {
  otherThing = quxx;
} else {
  otherThing = foobar;
}
```

:::

## Options

The following options are available on this rule:

* `allowConditionalType: boolean` – when set to `false`, the rule also checks nested [conditional types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html) in TypeScript. (TypeScript only) (default: `true`)

### `allowConditionalType`

The `allowConditionalType` option controls whether nested TypeScript conditional types are reported as nested ternary expressions.

Examples of **incorrect** TypeScript code for this rule when configured as `"no-nested-ternary": ["error", { "allowConditionalType": false }]`:

::: incorrect

```ts
/*eslint no-nested-ternary: ["error", { "allowConditionalType": false }]*/

type TrueType<T> = T extends string ? (boolean extends boolean ? true : false) : false;

type FalseType<T> = T extends string ? true : (boolean extends boolean ? true : false);

type TrueFalseType<T> = T extends string ? (T extends number ? true : false) : (T extends boolean ? true : false);
```

:::

Examples of **correct** TypeScript code for this rule when configured as `"no-nested-ternary": ["error", { "allowConditionalType": false }]`:

::: correct

```ts
/*eslint no-nested-ternary: ["error", { "allowConditionalType": false }]*/

type Type<T> = T extends string ? string : number;

type CheckType<T> = (T extends string ? string : number) extends boolean ? 1 : 0;

type ExtendsType<T> = T extends (true extends false ? never : string) ? 1 : 0;
```

:::
