---
title: max-params
rule_type: suggestion
related_rules:
- complexity
- max-depth
- max-len
- max-lines
- max-lines-per-function
- max-nested-callbacks
- max-statements
---


Functions that take numerous parameters can be difficult to read and write because it requires the memorization of what each parameter is, its type, and the order they should appear in. As a result, many coders adhere to a convention that caps the number of parameters a function can take.

```js
function foo (bar, baz, qux, qxx) { // four parameters, may be too many
    doSomething();
}
```

## Rule Details

This rule enforces a maximum number of parameters allowed in function definitions.

## Options

This rule has a number or object option:

* `"max"` (default `3`) enforces a maximum number of parameters in function definitions
* `"countThis"` (default `"except-void"`, possible values `"always"`, `"never"` or `"except-void"`) whether to count a `this` declaration (TypeScript only)

**Deprecated:** The object property `maximum` is deprecated; please use the object property `max` instead.
**Deprecated:** The object property `countVoidThis` is deprecated; please use `countThis: "except-void"` instead of `countVoidThis: false`, and `countThis: "always"` instead of `countVoidThis: true`.

### max

Examples of **incorrect** code for this rule with the default `{ "max": 3 }` option:

:::incorrect

```js
/*eslint max-params: ["error", 3]*/

function foo1 (bar, baz, qux, qxx) {
    doSomething();
}

let foo2 = (bar, baz, qux, qxx) => {
    doSomething();
};
```

:::

Examples of **correct** code for this rule with the default `{ "max": 3 }` option:

:::correct

```js
/*eslint max-params: ["error", 3]*/

function foo1 (bar, baz, qux) {
    doSomething();
}

let foo2 = (bar, baz, qux) => {
    doSomething();
};
```

:::

### countThis (TypeScript only)

This rule has a TypeScript-specific option `countThis` that allows you to count a `this` declaration.
Valid values are:

* `"always"`: any `this` type annotation will count as a parameter
* `"never"`: `this` won't ever be counted
* `"except-void"`: `this` will be counted only if its type is not `void`. Equivalent to the deprecated `countVoidThis: false`.

Examples of **correct** TypeScript code for this rule:

:::correct

```ts
/*eslint max-params: ["error", { "max": 2, "countThis": "except-void" }]*/

function hasNoThis(this: void, first: string, second: string) {
	// ...
}
```

:::

:::correct

```ts
/*eslint max-params: ["error", { "max": 2, "countThis": "never" }]*/

function hasThis(this: unknown[], first: string, second: string) {
	// ...
}
```

:::

Examples of **incorrect** TypeScript code for this rule:

:::incorrect

```ts
/*eslint max-params: ["error", { "max": 2, "countThis": "always" }]*/

function hasNoThis(this: void, first: string, second: string) {
	// ...
}
```

:::

:::incorrect

```ts
/*eslint max-params: ["error", { "max": 2, "countThis": "except-void" }]*/

function hasThis(this: unknown[], first: string, second: string) {
	// ...
}
```

:::
