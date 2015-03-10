# Disallow or Enforce Dangling Commas (comma-dangle)

Trailing commas in object literals are valid according to the ECMAScript 5 (and ECMAScript 3!) spec, however IE8 (when not in IE8 document mode) and below will throw an error when it encounters trailing commas in JavaScript.

```js
var foo = {
    bar: "baz",
    qux: "quux",
};
```

On the other hand, trailing commas can be useful because if you add or remove items to an object or array you only have the touch one line to make the change.

## Rule Details

This rule is aimed to forbid or enforce trailing commas in object literals and array literals.

This rule takes one argument. If it is `"always"` then it warns whenever a missing comma is detected.
If `"always-multiline"` then it warns if there is a missing trailing comma on arrays or objects that
span multiple lines, and warns if there is a trailing comma present on single line arrays or objects.
If `"never"` then it warns whenever an trailing comma is detected.
The default value of this option is `"never"`.

The following patterns are considered warnings when configured `"never"`:

```js
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

The following patterns are not considered warnings when configured `"never"`:

```js
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

The following patterns are considered warnings when configured `"always"`:

```js
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

The following patterns are not considered warnings when configured `"always"`:

```js
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

The following patterns are considered warnings when configured `"always-multiline"`:

```js
var foo = {
    bar: "baz",
    qux: "quux"
};

var foo = { bar: "baz", qux: "quux", };

var arr = [1,2,];

var arr = [
    1,
    2
];

foo({
  bar: "baz",
  qux: "quux"
});
```

The following patterns are not considered warnings when configured `"always-multiline"`:

```js
var foo = {
    bar: "baz",
    qux: "quux",
};

var foo = {bar: "baz", qux: "quux"};
var arr = [1,2];

var arr = [
    1,
    2,
];

foo({
  bar: "baz",
  qux: "quux",
});
```

## When Not To Use It

You can turn this rule off if you are not concerned with dangling commas.
