# Enforce the location of arrow function bodies with implicit returns (implicit-arrow-linebreak)

An arrow function body can contain an implicit return as an expression instead of a block body. It can be useful to enforce a consistent location for the implicitly returned expression.

## Rule Details

This rule aims to enforce a consistent location for an arrow function containing an implicit return.

See Also:

- [`brace-style`](https://eslint.org/docs/rules/brace-style) which enforces this behavior for arrow functions with block bodies.

### Options

This rule accepts a string option:

- `"beside"` (default) disallows a newline before an arrow function body.
- `"below"` requires a newline before an arrow function body.

Examples of **incorrect** code for this rule with the default `"beside"` option:

```js
/* eslint implicit-arrow-linebreak: ["error", "beside"] */

(foo) =>
  bar;

(foo) =>
  (bar);

(foo) =>
  bar =>
    baz;

(foo) =>
(
  bar()
);
```

Examples of **correct** code for this rule with the default `"beside"` option:

```js
/* eslint implicit-arrow-linebreak: ["error", "beside"] */

(foo) => bar;

(foo) => (bar);

(foo) => bar => baz;

(foo) => (
  bar()
);

// functions with block bodies allowed with this rule using any style
// to enforce a consistent location for this case, see the rule: `brace-style`
(foo) => {
  return bar();
}

(foo) =>
{
  return bar();
}
```

Examples of **incorrect** code for this rule with the `"below"` option:

```js
/* eslint implicit-arrow-linebreak: ["error", "below"] */

(foo) => bar;

(foo) => (bar);

(foo) => bar => baz;
```

Examples of **correct** code for this rule with the `"below"` option:

```js
/* eslint implicit-arrow-linebreak: ["error", "below"] */


(foo) =>
  bar;

(foo) =>
  (bar);

(foo) =>
  bar =>
    baz;
```

## When Not To Use It

If you're not concerned about consistent locations of implicitly returned arrow function expressions, you should not turn on this rule.

You can also disable this rule if you are using the `"always"` option for the [`arrow-body-style`](https://eslint.org/docs/rules/arrow-body-style), since this will disable the use of implicit returns in arrow functions.
