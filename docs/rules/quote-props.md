# require quotes around object literal property names (quote-props)

Object literal property names can be defined in two ways: using literals or using strings. For example, these two objects are equivalent:

```js
var object1 = {
    property: true
};

var object2 = {
    "property": true
};
```

In many cases, it doesn't matter if you choose to use an identifier instead of a string or vice-versa. Even so, you might decide to enforce a consistent style in your code.

There are, however, some occasions when you must use quotes:

1. If you are using an ECMAScript 3 JavaScript engine (such as IE8) and you want to use a keyword (such as `if`) as a property name. This restriction was removed in ECMAScript 5.
2. You want to use a non-identifier character in your property name, such as having a property with a space like `"one two"`.

Another example where quotes do matter is when using numeric literals as property keys:

```js
var object = {
    1e2: 1,
    100: 2
};
```

This may look alright at first sight, but this code in fact throws a syntax error in ECMAScript 5 strict mode. This happens because `1e2` and `100` are coerced into strings before getting used as the property name. Both `String(1e2)` and `String(100)` happen to be equal to `"100"`, which causes the "Duplicate data property in object literal not allowed in strict mode" error. Issues like that can be tricky to debug, so some prefer to require quotes around all property names.

## Rule Details

This rule requires quotes around object literal property names.

## Options

This rule has two options, a string option and an object option.

String option:

* `"always"` (default) requires quotes around all object literal property names
* `"as-needed"` disallows quotes around object literal property names that are not strictly required
* `"consistent"` enforces a consistent quote style; in a given object, either all of the properties should be quoted, or none of the properties should be quoted
* `"consistent-as-needed"` requires quotes around all object literal property names if any name strictly requires quotes, otherwise disallows quotes around object property names

Object option:

* `"keywords": true` requires quotes around language keywords used as object property names (only applies when using `as-needed` or `consistent-as-needed`)
* `"unnecessary": true` (default) disallows quotes around object literal property names that are not strictly required (only applies when using `as-needed`)
* `"unnecessary": false` allows quotes around object literal property names that are not strictly required (only applies when using `as-needed`)
* `"numbers": true` requires quotes around numbers used as object property names (only applies when using `as-needed`)

### always

Examples of **incorrect** code for this rule with the default `"always"` option:

```js
/*eslint quote-props: ["error", "always"]*/

var object = {
    foo: "bar",
    baz: 42,
    "qux-lorem": true
};
```

Examples of **correct** code for this rule with the default `"always"` option:

```js
/*eslint quote-props: ["error", "always"]*/
/*eslint-env es6*/

var object1 = {
    "foo": "bar",
    "baz": 42,
    "qux-lorem": true
};

var object2 = {
    'foo': 'bar',
    'baz': 42,
    'qux-lorem': true
};

var object3 = {
    foo() {
        return;
    }
};
```

### as-needed

Examples of **incorrect** code for this rule with the `"as-needed"` option:

```js
/*eslint quote-props: ["error", "as-needed"]*/

var object = {
    "a": 0,
    "0": 0,
    "true": 0,
    "null": 0
};
```

Examples of **correct** code for this rule with the `"as-needed"` option:

```js
/*eslint quote-props: ["error", "as-needed"]*/
/*eslint-env es6*/

var object1 = {
    "a-b": 0,
    "0x0": 0,
    "1e2": 0
};

var object2 = {
    foo: 'bar',
    baz: 42,
    true: 0,
    0: 0,
    'qux-lorem': true
};

var object3 = {
    foo() {
        return;
    }
};
```

### consistent

Examples of **incorrect** code for this rule with the `"consistent"` option:

```js
/*eslint quote-props: ["error", "consistent"]*/

var object1 = {
    foo: "bar",
    "baz": 42,
    "qux-lorem": true
};

var object2 = {
    'foo': 'bar',
    baz: 42
};
```

Examples of **correct** code for this rule with the `"consistent"` option:

```js
/*eslint quote-props: ["error", "consistent"]*/

var object1 = {
    "foo": "bar",
    "baz": 42,
    "qux-lorem": true
};

var object2 = {
    'foo': 'bar',
    'baz': 42
};

var object3 = {
    foo: 'bar',
    baz: 42
};
```

### consistent-as-needed

Examples of **incorrect** code for this rule with the `"consistent-as-needed"` option:

```js
/*eslint quote-props: ["error", "consistent-as-needed"]*/

var object1 = {
    foo: "bar",
    "baz": 42,
    "qux-lorem": true
};

var object2 = {
    'foo': 'bar',
    'baz': 42
};
```

Examples of **correct** code for this rule with the `"consistent-as-needed"` option:

```js
/*eslint quote-props: ["error", "consistent-as-needed"]*/

var object1 = {
    "foo": "bar",
    "baz": 42,
    "qux-lorem": true
};

var object2 = {
    foo: 'bar',
    baz: 42
};
```

### keywords

Examples of additional **incorrect** code for this rule with the `"as-needed", { "keywords": true }` options:

```js
/*eslint quote-props: ["error", "as-needed", { "keywords": true }]*/

var x = {
    while: 1,
    volatile: "foo"
};
```

Examples of additional **incorrect** code for this rule with the `"consistent-as-needed", { "keywords": true }` options:

```js
/*eslint quote-props: ["error", "consistent-as-needed", { "keywords": true }]*/

var x = {
    "prop": 1,
    "bar": "foo"
};
```

### unnecessary

Examples of additional **correct** code for this rule with the `"as-needed", { "unnecessary": false }` options:

```js
/*eslint quote-props: ["error", "as-needed", { "keywords": true, "unnecessary": false }]*/

var x = {
    "while": 1,
    "foo": "bar"  // Would normally have caused a warning
};
```

### numbers

Examples of additional **incorrect** code for this rule with the `"as-needed", { "numbers": true }` options:

```js
/*eslint quote-props: ["error", "as-needed", { "numbers": true }]*/

var x = {
    100: 1
}
```

## When Not To Use It

If you don't care if property names are consistently wrapped in quotes or not, and you don't target legacy ES3 environments, turn this rule off.

## Further Reading

* [Reserved words as property names](https://kangax.github.io/compat-table/es5/#Reserved_words_as_property_names)
* [Unquoted property names / object keys in JavaScript](https://mathiasbynens.be/notes/javascript-properties)
