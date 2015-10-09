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

This rule takes one argument, which can be one of the following options:

- `"always"` - warn whenever a missing comma is detected.
- `"always-multiline"` - warn if there is a missing trailing comma on arrays or objects that span multiple lines, and warns if there is a trailing comma present on single line arrays or objects.
- `"never"` - warn whenever a trailing comma is detected.

The default value of this option is `"never"`.

The following patterns are considered problems when configured `"never"`:

```js
/*eslint comma-dangle: [2, "never"]*/

var foo = {
    bar: "baz",
    qux: "quux",   /*error Unexpected trailing comma.*/
};

var arr = [1,2,];  /*error Unexpected trailing comma.*/

foo({
  bar: "baz",
  qux: "quux",     /*error Unexpected trailing comma.*/
});
```

The following patterns are not considered problems when configured `"never"`:

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

The following patterns are considered problems when configured `"always"`:

```js
/*eslint comma-dangle: [2, "always"]*/

var foo = {
    bar: "baz",
    qux: "quux"   /*error Missing trailing comma.*/
};

var arr = [1,2];  /*error Missing trailing comma.*/

foo({
  bar: "baz",
  qux: "quux"     /*error Missing trailing comma.*/
});
```

The following patterns are not considered problems when configured `"always"`:

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

The following patterns are considered problems when configured `"always-multiline"`:

```js
/*eslint comma-dangle: [1, "always-multiline"]*/

var foo = {
    bar: "baz",
    qux: "quux"                         /*error Missing trailing comma.*/
};

var foo = { bar: "baz", qux: "quux", }; /*error Unexpected trailing comma.*/

var arr = [1,2,];                       /*error Unexpected trailing comma.*/

var arr = [1,
    2,];                                /*error Unexpected trailing comma.*/

var arr = [
    1,
    2                                   /*error Missing trailing comma.*/
];

foo({
  bar: "baz",
  qux: "quux"                           /*error Missing trailing comma.*/
});
```

The following patterns are not considered problems when configured `"always-multiline"`:

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

## When Not To Use It

You can turn this rule off if you are not concerned with dangling commas.
