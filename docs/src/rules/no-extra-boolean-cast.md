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

* `"enforceForLogicalOperands"` when set to `true`, in addition to checking default contexts, checks whether the extra boolean cast is contained within a logical expression. Default is `false`, meaning that this rule by default does not warn about extra booleans cast inside logical expression.

### enforceForLogicalOperands

Examples of **incorrect** code for this rule with `"enforceForLogicalOperands"` option set to `true`:

::: incorrect

```js
/*eslint no-extra-boolean-cast: ["error", {"enforceForLogicalOperands": true}]*/

if (!!foo || bar) {
    //...
}

while (!!foo && bar) {
    //...
}

if ((!!foo || bar) && baz) {
    //...
}

foo && Boolean(bar) ? baz : bat

var foo = new Boolean(!!bar || baz)
```

:::

Examples of **correct** code for this rule with `"enforceForLogicalOperands"` option set to `true`:

::: correct

```js
/*eslint no-extra-boolean-cast: ["error", {"enforceForLogicalOperands": true}]*/

if (foo || bar) {
    //...
}

while (foo && bar) {
    //...
}

if ((foo || bar) && baz) {
    //...
}

foo && bar ? baz : bat

var foo = new Boolean(bar || baz)

var foo = !!bar || baz;
```

:::
