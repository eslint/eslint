# Disallow or Enforce Dangling Commas (comma-dangle)

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

This rule takes one argument, which can be one of the following options:

- `"never"` - warn whenever a trailing comma is detected. The default value of this option is `"never"`.
- `"always"` - warn whenever a missing comma is detected.
- `"always-multiline"` - warn if there is a missing trailing comma on arrays or objects that span multiple lines, and warns if there is a trailing comma present on single line arrays or objects.
- `"only-multiline"` - warn whenever a trailing comma is detected on single line nodes.

### never

Examples of **incorrect** code for the default `"never"` option:

```js
/*eslint comma-dangle: [2, "never"]*/

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

Examples of **correct** code for the default `"never"` option:

```js
/*eslint comma-dangle: [2, "never"]*/

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

Examples of **incorrect** code for the `"always"` option:

```js
/*eslint comma-dangle: [2, "always"]*/

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

Examples of **correct** code for the `"always"` option:

```js
/*eslint comma-dangle: [2, "always"]*/

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

Examples of **incorrect** code for the `"always-multiline"` option:

```js
/*eslint comma-dangle: [2, "always-multiline"]*/

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

Examples of **correct** code for the `"always-multiline"` option:

```js
/*eslint comma-dangle: [2, "always-multiline"]*/

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

Examples of **incorrect** code for the `"only-multiline"` option:

```js
/*eslint comma-dangle: [2, "only-multiline"]*/

var foo = { bar: "baz", qux: "quux", };

var arr = [1,2,];

var arr = [1,
    2,];

```

Examples of **correct** code for the `"only-multiline"` option:

```js
/*eslint comma-dangle: [2, "only-multiline"]*/

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
