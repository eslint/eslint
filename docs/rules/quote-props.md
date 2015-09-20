# Quoting Style for Property Names (quote-props)

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

This rule aims to enforce use of quotes in property names and as such will flag any properties that don't use quotes (default behavior).

### Options

There are four behaviors for this rule: `"always"` (default), `"as-needed"`, `"consistent"` and `"consistent-as-needed"`. You can define these options in your configuration as:

```json
{
    "quote-props": [2, "as-needed"]
}
```

#### always

When configured with `"always"` as the first option (the default), quoting for all properties will be enforced. Some believe that ensuring property names in object literals are always wrapped in quotes is generally a good idea, since [depending on the property name you may need to quote them anyway](https://mathiasbynens.be/notes/javascript-properties). Consider this example:

```js
var object = {
    foo: "bar",
    baz: 42,
    "qux-lorem": true
};
```

Here, the properties `foo` and `baz` are not wrapped in quotes, but `qux-lorem` is, because it doesn’t work without the quotes. This is rather inconsistent. Instead, you may prefer to quote names of all properties:

```js
var object = {
    "foo": "bar",
    "baz": 42,
    "qux-lorem": true
};
```

or, if you prefer single quotes:

```js
var object = {
    'foo': 'bar',
    'baz': 42,
    'qux-lorem': true
};
```

When configured with `"always"` as the first option (the default), quoting for all properties will be enforced. The following patterns are considered problems:

```js
/*eslint quote-props: [2, "always"]*/

var object = {
    foo: "bar",         /*error Unquoted property `foo` found.*/
    baz: 42,            /*error Unquoted property `baz` found.*/
    "qux-lorem": true
};
```

The following patterns are not considered problems:

```js
/*eslint quote-props: [2, "always"]*/
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

#### as-needed

When configured with `"as-needed"` as the first option, quotes will be enforced when they are strictly required, and unnecessary quotes will cause warnings. The following patterns are considered problems:

```js
/*eslint quote-props: [2, "as-needed"]*/

var object = {
    "a": 0,    /*error Unnecessarily quoted property `a` found.*/
    "0": 0,    /*error Unnecessarily quoted property `0` found.*/
    "true": 0, /*error Unnecessarily quoted property `true` found.*/
    "null": 0  /*error Unnecessarily quoted property `null` found.*/
};
```

The following patterns are not considered problems:

```js
/*eslint quote-props: [2, "as-needed"]*/
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

When the `"as-needed"` mode is selected, an additional `keywords` option can be provided. This flag indicates whether language keywords can be used unquoted as properties. By default it is set to `false`.

```json
{
    "quote-props": [2, "as-needed", { "keywords": true }]
}
```

When `keywords` is set to `true`, the following patterns become problems:

```js
/*eslint quote-props: [2, "as-needed", { "keywords": true }]*/

var x = {
    while: 1,       /*error Unquoted reserved word `while` used as key.*/
    volatile: "foo" /*error Unquoted reserved word `volatile` used as key.*/
};
```

Another modifier for this rule is the `unnecessary` option which defaults to `true`. Setting this to `false` will prevent the rule from complaining about unnecessarily quoted properties. This comes in handy when you _only_ care about quoting keywords.

```json
{
    "quote-props": [2, "as-needed", { "keywords": true, "unnecessary": false }]
}
```

When `unnecessary` is set to `false`, the following patterns _stop_ being problems:

```js
/*eslint quote-props: [2, "as-needed", { "keywords": true, "unnecessary": false }]*/

var x = {
    "while": 1,
    "foo": "bar"  // Would normally have caused a warning
};
```

A `numbers` flag, with default value `false`, can also be used as a modifier for the `"as-needed"` mode. When it is set to `true`, numeric literals should always be quoted.

```json
{
    "quote-props": [2, "as-needed", {"numbers": true}]
}
```

When `numbers` is set to `true`, the following patterns become problems:

```js
/*eslint quote-props: [2, "as-needed", { "numbers": true }]*/

var x = {
    100: 1 /*error Unquoted number literal `100` used as key.*/
}
```

and the following patterns _stop_ being problems:

```js
var x = {
    "100": 1
}
```

#### consistent

When configured with `"consistent"`, the patterns below are considered problems. Basically `"consistent"` means all or no properties are expected to be quoted, in other words quoting style can't be mixed within an object. Please note the latter situation (no quotation at all) isn't always possible as some property names require quoting.

```js
/*eslint quote-props: [2, "consistent"]*/

var object1 = {        /*error Inconsistently quoted property `baz` found.*/ /*error Inconsistently quoted property `qux-lorem` found.*/
    foo: "bar",
    "baz": 42,
    "qux-lorem": true
};

var object2 = {        /*error Inconsistently quoted property `baz` found.*/
    'foo': 'bar',
    baz: 42
};
```

The following patterns are not considered problems:

```js
/*eslint quote-props: [2, "consistent"]*/

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

#### consistent-as-needed

When configured with `"consistent-as-needed"`, the behavior is similar to `"consistent"` with one difference. Namely, properties' quoting should be consistent (as in `"consistent"`) but whenever all quotes are redundant a warning is raised. In other words if at least one property name has to be quoted (like `qux-lorem`) then all property names must be quoted, otherwise no properties can be quoted. The following patterns are considered problems:

```js
/*eslint quote-props: [2, "consistent-as-needed"]*/

var object1 = {         /*error Inconsistently quoted property `baz` found.*/ /*error Inconsistently quoted property `qux-lorem` found.*/
    foo: "bar",
    "baz": 42,
    "qux-lorem": true
};

var object2 = {         /*error Properties shouldn't be quoted as all quotes are redundant.*/
    'foo': 'bar',
    'baz': 42
};
```

The following patterns are not considered problems:

```js
/*eslint quote-props: [2, "consistent-as-needed"]*/

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

When the `"consistent-as-needed"` mode is selected, an additional `keywords` option can be provided. This flag indicates whether language keywords can be used unquoted as properties. By default it is set to `false`.

```json
{
    "quote-props": [2, "consistent-as-needed", { "keywords": true }]
}
```

When `keywords` is set to `true`, the following patterns are considered problems:

```js
/*eslint quote-props: [2, "consistent-as-needed", { "keywords": true }]*/

var x = {           /*error Properties should be quoted as `while` is a reserved word.*/ /*error Properties should be quoted as `volatile` is a reserved word.*/
    while: 1,
    volatile: "foo"
};
```

## When Not To Use It

If you don't care if property names are consistently wrapped in quotes or not, and you don't target legacy ES3 environments, turn this rule off.

## Further Reading

* [Reserved words as property names](http://kangax.github.io/compat-table/es5/#Reserved_words_as_property_names)
* [Unquoted property names / object keys in JavaScript](https://mathiasbynens.be/notes/javascript-properties)
