# Quoting Style for Property Names (quote-props)

Object literal property names can be defined in two ways: using literals or using strings. For example, these two objects are equivalent:

```js
var object1 = {
    property: true;
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

This rule aims to enforce use of quotes in property names and as such will flag any properties that don't use quotes.

There are two behaviors for this rule: `"always"` (default) and `"as-needed"`. You can define these options in your configuration as:

```json
{
    "quote-props": [2, "as-needed"]
}
```

When configured with `"always"` as the first option (the default), quoting for all properties will be enforced. The following patterns are considered warnings:

```js
var object = {
    foo: "bar",
    baz: 42,
    "qux-lorem": true
};
```

The following patterns are considered okay and do not cause warnings:

```js
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

When configured with `"as-needed"` as the first option, quotes will be enforced when they are strictly required, and unnecessary quotes will cause warnings. The following patterns are considered warnings:

```js
var object = {
    "a": 0,
    "0": 0,
    "true": 0,
    "null": 0
};
```

The following patterns are considered okay and do not cause warnings:

```js
var object1 = {
    "a-b": 0,
    "0x0": 0
};

var object2 = {
    foo: 'bar',
    baz: 42,
    true: 0,
    'qux-lorem': true
};

var object3 = {
    foo() {
        return;
    }
};
```


### Options

When the `"as-needed"` mode is selected, an additional `keywords` option can be provided. This flag indicates whether language keywords can be used unquoted as properties. By default it is set to `false`.

```json
{
    "quote-props": [2, "as-needed", {"keywords": true}]
}
```

When `keywords` is set to `true`, the following patterns become warnings:

```
var x = {
    while: 1,
    volatile: "foo"
};

```

## When Not To Use It

If you don't care if property names are consistently wrapped in quotes or not, and you don't target legacy ES3 environments, turn this rule off.

## Further Reading

* [Reserved words as property names](http://kangax.github.io/compat-table/es5/#Reserved_words_as_property_names)
* [Unquoted property names / object keys in JavaScript](https://mathiasbynens.be/notes/javascript-properties)