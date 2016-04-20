# require or disallow trailing commas (comma-dangle)

Trailing commas in object literals are valid according to the ECMAScript 5 (and ECMAScript 3!) spec. However, IE8 (when not in IE8 document mode) and below will throw an error when it encounters trailing commas in JavaScript.

```js
var foo = {
    bar: "baz",
    qux: "quux",
};
```

On the other hand, trailing commas simplify adding and removing items to objects and arrays, since only the lines you are modifying must be touched.

## Rule Details

This rule enforces consistent use of trailing commas in object and array literals.

## Options

This rule has a string option:

* `"never"` (default) disallows trailing commas
* `"always"` requires trailing commas
* `"always-multiline"` requires trailing commas when the last element or property is in a *different* line than the closing `]` or `}` and disallows trailing commas when the last element or property is on the *same* line as the closing `]` or `}`
* `"only-multiline"` allows (but does not require) trailing commas when the last element or property is in a *different* line than the closing `]` or `}` and disallows trailing commas when the last element or property is on the *same* line as the closing `]` or `}`

### never

Examples of **incorrect** code for this rule with the default `"never"` option:

```js
/*eslint comma-dangle: ["error", "never"]*/

var foo = {
    bar: "baz",
    qux: "quux",
};

var arr = [1,2,];

foo({
  bar: "baz",
  qux: "quux",
});
```

Examples of **correct** code for this rule with the default `"never"` option:

```js
/*eslint comma-dangle: ["error", "never"]*/

var foo = {
    bar: "baz",
    qux: "quux"
};

var arr = [1,2];

foo({
  bar: "baz",
  qux: "quux"
});
```

### always

Examples of **incorrect** code for this rule with the `"always"` option:

```js
/*eslint comma-dangle: ["error", "always"]*/

var foo = {
    bar: "baz",
    qux: "quux"
};

var arr = [1,2];

foo({
  bar: "baz",
  qux: "quux"
});
```

Examples of **correct** code for this rule with the `"always"` option:

```js
/*eslint comma-dangle: ["error", "always"]*/

var foo = {
    bar: "baz",
    qux: "quux",
};

var arr = [1,2,];

foo({
  bar: "baz",
  qux: "quux",
});
```

### always-multiline

Examples of **incorrect** code for this rule with the `"always-multiline"` option:

```js
/*eslint comma-dangle: ["error", "always-multiline"]*/

var foo = {
    bar: "baz",
    qux: "quux"
};

var foo = { bar: "baz", qux: "quux", };

var arr = [1,2,];

var arr = [1,
    2,];

var arr = [
    1,
    2
];

foo({
  bar: "baz",
  qux: "quux"
});
```

Examples of **correct** code for this rule with the `"always-multiline"` option:

```js
/*eslint comma-dangle: ["error", "always-multiline"]*/

var foo = {
    bar: "baz",
    qux: "quux",
};

var foo = {bar: "baz", qux: "quux"};
var arr = [1,2];

var arr = [1,
    2];

var arr = [
    1,
    2,
];

foo({
  bar: "baz",
  qux: "quux",
});
```

### only-multiline

Examples of **incorrect** code for this rule with the `"only-multiline"` option:

```js
/*eslint comma-dangle: ["error", "only-multiline"]*/

var foo = { bar: "baz", qux: "quux", };

var arr = [1,2,];

var arr = [1,
    2,];

```

Examples of **correct** code for this rule with the `"only-multiline"` option:

```js
/*eslint comma-dangle: ["error", "only-multiline"]*/

var foo = {
    bar: "baz",
    qux: "quux",
};

var foo = {
    bar: "baz",
    qux: "quux"
};

var foo = {bar: "baz", qux: "quux"};
var arr = [1,2];

var arr = [1,
    2];

var arr = [
    1,
    2,
];

var arr = [
    1,
    2
];

foo({
  bar: "baz",
  qux: "quux",
});

foo({
  bar: "baz",
  qux: "quux"
});
```

## When Not To Use It

You can turn this rule off if you are not concerned with dangling commas.
