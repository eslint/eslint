# Quote props

Similar to how quoting attribute values in HTML is a good idea, quoting property names in JavaScript is good practice.

Ensuring property names in object literals are always wrapped in quotes is generally a good idea, since [depending on the property name you may need to quote them anyway](http://mathiasbynens.be/notes/javascript-properties). Consider this example:

```js
var object = {
    foo: "bar",
    baz: 42,
    "qux-lorem": true
};
```

Here, the properties `foo` and `baz` are not wrapped in quotes, but `qux-lorem` is, because it doesn’t work without the quotes. This is rather inconsistent. Instead, you may prefer to quote property names consistently:

```js
var object = {
    "foo": "bar",
    "baz": 42,
    "qux-lorem": true
};
```

…or, if you prefer single quotes:

```js
var object = {
    'foo': 'bar',
    'baz': 42,
    'qux-lorem': true
};
```

Much better, no? If that didn’t convince you, here’s another example:

```js
var object = {
    1e2: 1,
    100: 2
};
```

This may look alright on first sight, but this code in fact throws a syntax error in strict mode. This happens because `1e2` and `100` are coerced into strings before getting used as the property name. Both `String(1e2)` and `String(100)` happen to be equal to `"100"`, which causes the “Duplicate data property in object literal not allowed in strict mode” error. Issues like that can be tricky to debug. Yet, they can easily be avoided, by simply always quoting property names in object literals.

## Rule Details

This rule helps you enforce consistent quoting of property names.

The following patterns are considered warnings:

```js
var object = {
    foo: "bar",
    baz: 42,
    "qux-lorem": true
};
```

The following patterns are considered okay and do not cause warnings:

```js
var object = {
    "foo": "bar",
    "baz": 42,
    "qux-lorem": true
};
```

```js
var object = {
    'foo': 'bar',
    'baz': 42,
    'qux-lorem': true
};
```

## When Not To Use It

If you don’t care if property names are consistently wrapped in quotes or not, turn this rule off.
