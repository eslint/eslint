# Enforce Property Spacing (key-spacing)

This rule enforces spacing around the colon in object literal properties. It can verify each property individually, or it can ensure vertical alignment of groups of properties in an object literal.

## Rule Details

This rule will warn when spacing in properties does not match the specified options. In the case of long lines, it is acceptable to add a new line wherever whitespace is allowed. There are three modes:

### 1. Individual

Use the `beforeColon`, `afterColon` and `mode` options to enforce having one space or zero spaces on each side, using `true` or `false`, respectively. The default is no whitespace between the key and the colon and one space between the colon and the value.

`mode` option can be either `"strict"` or `"minimum"` and defaults to `"strict"`. In `strict` mode, it enforces exactly 1 space before or after the colon where as in `minimum` mode, it enforces at least 1 space but more are okay.

The following patterns are considered valid:

```js
// DEFAULT
/*eslint key-spacing: [2, {"beforeColon": false, "afterColon": true}]*/

var obj = { "foo": (42) };

foo = { thisLineWouldBeTooLong:
    soUseAnotherLine };
```

```js
/*eslint key-spacing: [2, {"beforeColon": true, "afterColon": false}]*/

call({
    foobar :42,
    bat :(2 * 2)
});
```

```js
/*eslint key-spacing: [2, {"beforeColon": true, "afterColon": false, "mode": "minimum"}]*/

call({
    foobar   :42,
    bat :(2 * 2)
});
```

The following patterns are considered problems:

```js
/*eslint key-spacing: [2, {"beforeColon": false, "afterColon": false}]*/

var obj = { foo: 42 };          /*error Extra space before value for key "foo".*/
var bar = { baz :52 };          /*error Extra space after key "baz".*/

foo = { thisLineWouldBeTooLong:
    soUseAnotherLine };         /*error Extra space before value for key "thisLineWouldBeTooLong".*/
```

```js
/*eslint key-spacing: [2, {"beforeColon": true, "afterColon": true}]*/

function foo() {
    return {
        foobar: 42,             /*error Missing space after key "foobar".*/
        bat :"value"            /*error Missing space before value for key "bat".*/
    };
}
```

```js
/*eslint key-spacing: [2, {"beforeColon": true, "afterColon": true}]*/

function foo() {
    return {
        foobar  : 42,             /*error Extra space after key "foobar".*/
        bat :  "value"            /*error Extra space before value for key "bat".*/
    };
}
```

### 2. Vertically align values `"align": "value"`

Use the `align` option to enforce vertical alignment of values in an object literal. This mode still respects `beforeColon` and `afterColon` where possible, but it will pad with spaces after the colon where necessary. Groups of properties separated by blank lines are considered distinct and can have different alignment than other groups. Single line object literals will not be checked for vertical alignment, but each property will still be checked for `beforeColon` and `afterColon`.

The following patterns are considered valid:

```js
/*eslint key-spacing: [2, { "align": "value" }]*/
// beforeColon and afterColon default to false and true, respectively

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

```js
/*eslint key-spacing: [2, { "align": "value", "beforeColon": true, "afterColon": false }]*/

call({
    'a' :[],
    b :  []
});
```

The following patterns are considered problems:

```js
/*eslint key-spacing: [2, { "align": "value" }]*/

var obj = {
    a: value,     /*error Missing space before value for key "a".*/
    bcde:  42,    /*error Extra space before value for key "bcde".*/
    fg :   foo()  /*error Extra space after key "fg".*/
};
```

### 3. Vertically align colons `"align": "colon"`

The `align` option can also vertically align colons and values together. Whereas with `"value"` alignment, padding belongs right of the colon, with `"colon"` alignment, padding goes to the left of the colon. Except in the case of padding, it still respects `beforeColon` and `afterColon`. As with `"value"` alignment, groups of properties separated by blank lines are considered distinct and can have different alignment than other groups.

The following patterns are considered valid:

```js
/*eslint key-spacing: [2, { "align": "colon" }]*/

var obj = {
    foobar   : 42,
    bat      : (2 * 2),
    "default": fn(),

    fn : function() {},
    abc: value
};
```

```js
/*eslint key-spacing: [2, { "align": "colon", "beforeColon": true, "afterColon": false }]*/

obj = {
    first  :1,
    second :2,
    third  :3
};
```

The following patterns are considered problems:

```js
/*eslint key-spacing: [2, { "align": "colon" }]*/

var obj = {
    one:   1,  /*error Missing space after key "one".*/ /*error Extra space before value for key "one".*/
    "two": 2,
    three:  3  /*error Extra space before value for key "three".*/
};
```

## When Not To Use It

If you have another convention for property spacing that might not be consistent with the available options, or if you want to permit multiple styles concurrently you can safely disable this rule.
