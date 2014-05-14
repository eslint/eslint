# Disallow Extra Boolean Casts (no-extra-boolean-cast)

In contexts such as an `if` statement's test where the result of the expression will already be coerced to a Boolean, casting to a Boolean via double negation (`!!`) is unnecessary. For example, these `if` statements are equivalent:

```js
if (!!foo) {
    // ...
}

if (foo) {
    // ...
}
```

## Rule Details

This rule aims to eliminate the use of double-negation Boolean casts in an already Boolean context.

The following patterns are considered warnings:

```js
var foo = !!!bar;

var foo = !!bar ? baz : bat;

var foo = Boolean(!!bar);

var foo = new Boolean(!!bar);

if (!!foo) {
    // ...
}

while (!!foo) {
    // ...
}

do {
    // ...
} while (!!foo);

for (; !!foo; ) {
    // ...
}
```

The following patterns are not warnings:

```js
var foo = !!bar;

function foo() {
    return !!bar;
}

var foo = bar ? !!baz : !!bat;
```
