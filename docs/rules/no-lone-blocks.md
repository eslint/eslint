# Disallow Unnecessary Nested Blocks (no-lone-blocks)

In JavaScript, standalone code blocks delimited by curly braces do not create a new scope and have have no use. For example, these curly braces do nothing to `foo`:

```js
{
    var foo = bar();
}
```

## Rule details

This rule aims to eliminate unnecessary and potentially confusing blocks at the top level of a script or within other blocks.

The following patterns are considered warnings:

```js
{}

if (foo) {
    bar();
    {
        baz();
    }
}

function bar() {
    {
        baz();
    }
}
```

The following patterns are not considered warnings:

```js
while (foo) {
    bar();
}

if (foo) {
    if (bar) {
        baz();
    }
}

function bar() {
    baz();
}
```
