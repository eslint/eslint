# disallow nested ternary expressions (no-nested-ternary)

Nesting ternary expressions can make code more difficult to understand.

```js
var foo = bar ? baz : qux === quxx ? bing : bam;
```

## Rule Details

The `no-nested-ternary` rule disallows nested ternary expressions.

Examples of **incorrect** code for this rule:

```js
/*eslint no-nested-ternary: "error"*/

var thing = foo ? bar : baz === qux ? quxx : foobar;

foo ? baz === qux ? quxx() : foobar() : bar();
```

Examples of **correct** code for this rule:

```js
/*eslint no-nested-ternary: "error"*/

var thing = foo ? bar : foobar;

var thing;

if (foo) {
  thing = bar;
} else if (baz === qux) {
  thing = quxx;
} else {
  thing = foobar;
}
```

## Related Rules

* [no-ternary](no-ternary.md)
* [no-unneeded-ternary](no-unneeded-ternary.md)
