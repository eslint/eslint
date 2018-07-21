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

## Options

This rule has an object option:

* `"allowAlternate": false` (default) disallow any nested ternary, regardless of it's position
* `"allowAlternate": true` allow nested ternaries when they are the alternate sub-expression

### allowAlternate

Ternary expressions consist of 3 sub-expressions: `test`, `consequent`, and
`alternate`:

```js
test ? consequent : alternate
```

This option allows you to use another ternary expression as the `alternate`
sub-expression.

Examples of **incorrect** code for this rule with the default `{ "allowAlternate": false }` option:

```js
/*eslint no-nested-ternary: ["error", { "allowAlternate": false }]*/

var baz =
    foo ? 'foo' :
    bar ? 'bar' :
    null;

var qux =
    !foo ?
        !bar ? null : 'bar'
    : 'foo';
```

Example of **correct** code for this rule with the default `{ "allowAlternate": false }` option:

```js
/*eslint no-nested-ternary: ["error", { "allowAlternate": false }]*/

var bar = foo ? 'foo' : null;
```

Example of **incorrect** code for this rule with the `{ "allowAlternate": true }` option:

```js
/*eslint no-nested-ternary: ["error", { "allowAlternate": true }]*/

var baz =
    foo ?
        bar ? 'bar' : 'foo'
    : null;
```

Example of **correct** code for this rule with the `{ "allowAlternate": true }` option:

```js
/*eslint no-nested-ternary: ["error", { "allowAlternate": true }]*/

var baz =
    foo ? 'foo' :
    bar ? 'bar' :
    null;
```

## Related Rules

* [no-ternary](no-ternary.md)
* [no-unneeded-ternary](no-unneeded-ternary.md)
