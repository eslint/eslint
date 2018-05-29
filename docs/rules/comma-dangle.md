# require or disallow trailing commas (comma-dangle)

Trailing commas in object literals are valid according to the ECMAScript 5 (and ECMAScript 3!) spec. However, IE8 (when not in IE8 document mode) and below will throw an error when it encounters trailing commas in JavaScript.

```js
var foo = {
    bar: "baz",
    qux: "quux",
};
```

Trailing commas simplify adding and removing items to objects and arrays, since only the lines you are modifying must be touched.
Another argument in favor of trailing commas is that it improves the clarity of diffs when an item is added or removed from an object or array:

Less clear:

```diff
 var foo = {
-    bar: "baz",
-    qux: "quux"
+    bar: "baz"
 };
```

More clear:

```diff
 var foo = {
     bar: "baz",
-    qux: "quux",
 };
```

## Rule Details

This rule enforces consistent use of trailing commas in object and array literals.

## Options

This rule has a string option or an object option:

```json
{
    "comma-dangle": ["error", "never"],
    // or
    "comma-dangle": ["error", {
        "arrays": "never",
        "objects": "never",
        "imports": "never",
        "exports": "never",
        "functions": "ignore"
    }]
}
```

* `"never"` (default) disallows trailing commas
* `"always"` requires trailing commas
* `"always-multiline"` requires trailing commas when the last element or property is in a *different* line than the closing `]` or `}` and disallows trailing commas when the last element or property is on the *same* line as the closing `]` or `}`
* `"only-multiline"` allows (but does not require) trailing commas when the last element or property is in a *different* line than the closing `]` or `}` and disallows trailing commas when the last element or property is on the *same* line as the closing `]` or `}`

Trailing commas in function declarations and function calls are valid syntax since ECMAScript 2017; however, the string option does not check these situations for backwards compatibility.

You can also use an object option to configure this rule for each type of syntax.
Each of the following options can be set to `"never"`, `"always"`, `"always-multiline"`, `"only-multiline"`, or `"ignore"`.
The default for each option is `"never"` unless otherwise specified.

* `arrays` is for array literals and array patterns of destructuring. (e.g. `let [a,] = [1,];`)
* `objects` is for object literals and object patterns of destructuring. (e.g. `let {a,} = {a: 1};`)
* `imports` is for import declarations of ES Modules. (e.g. `import {a,} from "foo";`)
* `exports` is for export declarations of ES Modules. (e.g. `export {a,};`)
* `functions` is for function declarations and function calls. (e.g. `(function(a,){ })(b,);`)
    * `functions` is set to `"ignore"` by default for consistency with the string option.
    * `functions` should only be enabled when linting ECMAScript 2017 or higher.

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

### functions

Examples of **incorrect** code for this rule with the `{"functions": "never"}` option:

```js
/*eslint comma-dangle: ["error", {"functions": "never"}]*/

function foo(a, b,) {
}

foo(a, b,);
new foo(a, b,);
```

Examples of **correct** code for this rule with the `{"functions": "never"}` option:

```js
/*eslint comma-dangle: ["error", {"functions": "never"}]*/

function foo(a, b) {
}

foo(a, b);
new foo(a, b);
```

Examples of **incorrect** code for this rule with the `{"functions": "always"}` option:

```js
/*eslint comma-dangle: ["error", {"functions": "always"}]*/

function foo(a, b) {
}

foo(a, b);
new foo(a, b);
```

Examples of **correct** code for this rule with the `{"functions": "always"}` option:

```js
/*eslint comma-dangle: ["error", {"functions": "always"}]*/

function foo(a, b,) {
}

foo(a, b,);
new foo(a, b,);
```

## When Not To Use It

You can turn this rule off if you are not concerned with dangling commas.
