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
* `"countVoidThis"` (default `false`) counts a `this` declaration when the type is `void` (TypeScript only)

**Deprecated:** The object property `maximum` is deprecated; please use the object property `max` instead.

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

### countVoidThis (TypeScript only)

This rule has a TypeScript-specific option `countVoidThis` that allows you to count a `this` declaration when the type is `void`.

Examples of **correct** TypeScript code for this rule with the default `{ "countVoidThis": false }` option:

:::correct

```ts
/*eslint max-params: ["error", { "max": 2, "countVoidThis": false }]*/

function hasNoThis(this: void, first: string, second: string) {
	// ...
}
```

:::

Examples of **incorrect** TypeScript code for this rule with the default `{ "countVoidThis": false }` option:

:::incorrect

```ts
/*eslint max-params: ["error", { "max": 2, "countVoidThis": false }]*/

function hasNoThis(this: void, first: string, second: string, third: string) {
	// ...
}
```

:::

Examples of **correct** TypeScript code for this rule with the `{ "countVoidThis": true }` option:

:::correct

```ts
/*eslint max-params: ["error", { "max": 2, "countVoidThis": true }]*/

function hasNoThis(this: void, first: string) {
	// ...
}
```

:::

Examples of **incorrect** TypeScript code for this rule with the `{ "countVoidThis": true }` option:

:::incorrect

```ts
/*eslint max-params: ["error", { "max": 2, "countVoidThis": true }]*/

function hasNoThis(this: void, first: string, second: string) {
	// ...
}
```

:::
