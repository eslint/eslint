---
title: no-extra-boolean-cast
rule_type: suggestion
---

In contexts such as an `if` statement's test where the result of the expression will already be coerced to a Boolean, casting to a Boolean via double negation (`!!`) or a `Boolean` call is unnecessary. For example, these `if` statements are equivalent:

```js
if (!!foo) {
    // ...
}

if (Boolean(foo)) {
    // ...
}

if (foo) {
    // ...
}
```

## Rule Details

This rule disallows unnecessary boolean casts.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-extra-boolean-cast: "error"*/

var foo = !!!bar;

var foo = !!bar ? baz : bat;

var foo = Boolean(!!bar);

var foo = new Boolean(!!bar);

if (!!foo) {
    // ...
}

if (Boolean(foo)) {
    // ...
}

while (!!foo) {
    // ...
}

do {
    // ...
} while (Boolean(foo));

for (; !!foo; ) {
    // ...
}
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-extra-boolean-cast: "error"*/

var foo = !!bar;
var foo = Boolean(bar);

function qux() {
    return !!bar;
}

var foo = bar ? !!baz : !!bat;
```

:::

## Options

This rule has an object option:

*   `"enforceForInnerExpressions"` when set to `true`, in addition to checking default contexts, checks whether extra boolean casts are present in expressions whose result is used in a boolean context. See examples below. Default is `false`, meaning that this rule by default does not warn about extra booleans cast inside inner expressions.

**Deprecated:** The object property `enforceForLogicalOperands` is deprecated ([eslint#18222](https://github.com/eslint/eslint/pull/18222)). Please use `enforceForInnerExpressions` instead.

### enforceForInnerExpressions

Examples of **incorrect** code for this rule with `"enforceForInnerExpressions"` option set to `true`:

::: incorrect

```js
/*eslint no-extra-boolean-cast: ["error", {"enforceForInnerExpressions": true}]*/

if (!!foo || bar) {
    //...
}

while (!!foo && bar) {
    //...
}

if ((!!foo || bar) && !!baz) {
    //...
}

var foo = new Boolean(!!bar || baz);

foo && Boolean(bar) ? baz : bat;

const ternaryBranches = Boolean(bar ? !!baz : bat);

const nullishCoalescingOperator = Boolean(bar ?? Boolean(baz));

const commaOperator = Boolean((bar, baz, !!bat));

// another comma operator example
for (let i = 0; console.log(i), Boolean(i < 10); i++) {
    // ...
}
```

:::

Examples of **correct** code for this rule with `"enforceForInnerExpressions"` option set to `true`:

::: correct

```js
/*eslint no-extra-boolean-cast: ["error", {"enforceForInnerExpressions": true}]*/

// Note that `||` and `&&` alone aren't a boolean context for either operand 
// since the resultant value need not be a boolean without casting.
var foo = !!bar || baz;

if (foo || bar) {
    //...
}

while (foo && bar) {
    //...
}

if ((foo || bar) && baz) {
    //...
}

var foo = new Boolean(bar || baz);

foo && bar ? baz : bat;

const ternaryBranches = Boolean(bar ? baz : bat);

const nullishCoalescingOperator = Boolean(bar ?? baz);

const commaOperator = Boolean((bar, baz, bat));

// another comma operator example
for (let i = 0; console.log(i), i < 10; i++) {
    // ...
}

// comma operator in non-final position
Boolean((Boolean(bar), baz, bat));
```

:::
