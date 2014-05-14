# Disallow Nested Ternaries (no-nested-ternary)

Nesting ternary expressions makes code unclear. The `no-nested-ternary` rule disallows the use of nested ternary expressions.

```js
var foo = bar ? baz : qux === quxx ? bing : bam;
```

## Rule Details

The `no-nested-ternary` rule aims to increase the clarity and readability of code by disallowing the use of nested ternary expressions.

The following patterns are considered warnings:

```js
var thing = foo ? bar : baz === qux ? quxx : foobar;

foo ? baz === qux ? quxx() : foobar() : bar();
```

The following patterns are considered okay and could be used alternatively:

```js
var thing;

if (foo) {
  thing = bar;
} else if (baz === qux) {
  thing = quxx;
} else {
  thing = foobar;
}
```
