# enforce consistent spacing between keys and values in object literal properties (key-spacing)

This rule enforces spacing around the colon in object literal properties. It can verify each property individually, or it can ensure horizontal alignment of adjacent properties in an object literal.

## Rule Details

This rule enforces consistent spacing between keys and values in object literal properties. In the case of long lines, it is acceptable to add a new line wherever whitespace is allowed.

## Options

This rule has an object option:

* `"beforeColon": false` (default) disallows spaces between the key and the colon in object literals
* `"beforeColon": true` requires at least one space between the key and the colon in object literals
* `"afterColon": true` (default) requires at least one space between the colon and the value in object literals
* `"afterColon": false` disallows spaces between the colon and the value in object literals
* `"mode": strict` (default) enforces exactly one space before or after colons in object literals
* `"mode": minimum` enforces one or more spaces before or after colons in object literals
* `"align": "value"` enforces horizontal alignment of values in object literals
* `"align": "colon"` enforces horizontal alignment of both colons and values in object literals.
* `"singleLine"` specifies a spacing style for single-line object literals
* `"multiLine"` specifies a spacing style for multi-line object literals

Please note that you can either use the top-level options or the grouped options (`singleLine` and `multiLine`) but not both.

### beforeColon

Examples of **incorrect** code for this rule with the default `{ "beforeColon": false }` option:

```js
/*eslint key-spacing: ["error", { "beforeColon": false }]*/

var obj = { "foo" : 42 };
```

Examples of **correct** code for this rule with the default `{ "beforeColon": false }` option:

```js
/*eslint key-spacing: ["error", { "beforeColon": false }]*/

var obj = { "foo": 42 };
```

Examples of **incorrect** code for this rule with the `{ "beforeColon": true }` option:

```js
/*eslint key-spacing: ["error", { "beforeColon": true }]*/

var obj = { "foo": 42 };
```

Examples of **correct** code for this rule with the `{ "beforeColon": true }` option:

```js
/*eslint key-spacing: ["error", { "beforeColon": true }]*/

var obj = { "foo" : 42 };
```

### afterColon

Examples of **incorrect** code for this rule with the default `{ "afterColon": true }` option:

```js
/*eslint key-spacing: ["error", { "afterColon": true }]*/

var obj = { "foo":42 };
```

Examples of **correct** code for this rule with the default `{ "afterColon": true }` option:

```js
/*eslint key-spacing: ["error", { "afterColon": true }]*/

var obj = { "foo": 42 };
```

Examples of **incorrect** code for this rule with the `{ "afterColon": false }` option:

```js
/*eslint key-spacing: ["error", { "afterColon": false }]*/

var obj = { "foo": 42 };
```

Examples of **correct** code for this rule with the `{ "afterColon": false }` option:

```js
/*eslint key-spacing: ["error", { "afterColon": false }]*/

var obj = { "foo":42 };
```

### mode

Examples of **incorrect** code for this rule with the default `{ "mode": "strict" }` option:

```js
/*eslint key-spacing: ["error", { "mode": "strict" }]*/

call({
    foobar: 42,
    bat:    2 * 2
});
```

Examples of **correct** code for this rule with the default `{ "mode": "strict" }` option:

```js
/*eslint key-spacing: ["error", { "mode": "strict" }]*/

call({
    foobar: 42,
    bat: 2 * 2
});
```

Examples of **correct** code for this rule with the `{ "mode": "minimum" }` option:

```js
/*eslint key-spacing: ["error", { "mode": "minimum" }]*/

call({
    foobar: 42,
    bat:    2 * 2
});
```

### align

Examples of **incorrect** code for this rule with the `{ "align": "value" }` option:

```js
/*eslint key-spacing: ["error", { "align": "value" }]*/

var obj = {
    a: value,
    bcde:  42,
    fg :   foo()
};
```

Examples of **correct** code for this rule with the `{ "align": "value" }` option:

```js
/*eslint key-spacing: ["error", { "align": "value" }]*/

var obj = {
    a:    value,
    bcde: 42,

    fg: foo(),
    h:  function() {
        return this.a;
    },
    ijkl: 'Non-consecutive lines form a new group'
};

var obj = { a: "foo", longPropertyName: "bar" };
```

Examples of **incorrect** code for this rule with the `{ "align": "colon" }` option:

```js
/*eslint key-spacing: ["error", { "align": "colon" }]*/

call({
    foobar: 42,
    bat:    2 * 2
});
```

Examples of **correct** code for this rule with the `{ "align": "colon" }` option:

```js
/*eslint key-spacing: ["error", { "align": "colon" }]*/

call({
    foobar: 42,
    bat   : 2 * 2
});
```

### singleLine and multiLine

Examples of **correct** code for this rule with sample `{ "singleLine": { }, "multiLine": { } }` options:

```js
/*eslint "key-spacing": [2, {
    "singleLine": {
        "beforeColon": false,
        "afterColon": true
    },
    "multiLine": {
        "beforeColon": true,
        "afterColon": true,
        "align": "colon"
    }
}]*/
var obj = { one: 1, "two": 2, three: 3 };
var obj2 = {
    "two" : 2,
    three : 3
};
```

## When Not To Use It

If you have another convention for property spacing that might not be consistent with the available options, or if you want to permit multiple styles concurrently you can safely disable this rule.
