# Enforce Property Spacing (key-spacing)

Enforces spacing around the colon in object literal properties. It can verify each property individually, or it can ensure vertical alignment of groups of properties in an object literal.

## Rule Details

This rule will warn when spacing in properties does not match the specified options. In the case of long lines, it is acceptable to add a new line wherever whitespace is allowed. There are three modes:

### 1. Individual

Use just the `beforeColon` and `afterColon` options to enforce having one space or zero spaces on each side, using `true` or `false`, respectively. The default is no whitespace between the key and the colon and one space between the colon and the value.

The following patterns are considered valid:

```js
// DEFAULT
// "key-spacing": [2, {
//     beforeColon: false,
//     afterColon: true
// }]
var obj = { "foo": (42) };

// "key-spacing": [2, {
//     "beforeColon": true,
//     "afterColon": false
// }]
call({
    foobar :42,
    bat :(2 * 2)
};

// "key-spacing": [2, {
//     "beforeColon": false,
//     "afterColon": true
// }]
foo = { thisLineWouldBeTooLong:
    soUseAnotherLine };
```

The following patterns are considered warnings:

```js
// "key-spacing": [2, {
//     beforeColon: false,
//     afterColon: false
// }]
var obj = { foo : 42 }; // Extra space on both sides

// "key-spacing": [2, {
//     beforeColon: true,
//     afterColon: true
// }]
function foo() {
    return {
        foobar: 42, // Missing space before colon
        bat :"value" // Missing space after colon
    };
}

// "key-spacing": [2, {
//     "beforeColon": false,
//     "afterColon": false
// }]
foo = { thisLineWouldBeTooLong:
    soUseAnotherLine };
```

### 2. Vertically align values `"align": "value"`

Use the `align` option to enforce vertical alignment of values in an object literal. This mode still respects `beforeColon` and `afterColon` where possible, but it will pad with spaces after the colon where necessary. Groups of properties separated by blank lines are considered distinct and can have different alignment than other groups.

The following patterns are considered valid:

```js
// "key-spacing": [2, { "align": "value" }]
// beforeColon and afterColon default to false and true, respectively
var obj = {
    a:    value,
    bcde: 42,
    fg:   foo(),

    h: 121
};

// "key-spacing": [2, {
//     "align": "value",
//     "beforeColon": true,
//     "afterColon": false
// }]
call({
    'a' :[],
    b :  []
});
```

The following patterns are considered warnings:

```js
// "key-spacing": [2, { "align": "value" }]
// beforeColon and afterColon default to false and true, respectively
var obj = {
    a: value, // Not enough space after colon
    bcde:  42, // Extra space after colon
    fg :   foo() // Extra space before colon
};
```

### 3. Vertically align colons `"align": "colon"`

The `align` option can also vertically align colons and values together. Whereas with `"value"` alignment, padding belongs right of the colon, with `"colon"` alignment, padding goes to the left of the colon. Except in the case of padding, it still respects `beforeColon` and `afterColon`. As with `"value"` alignment, groups of properties separated by blank lines are considered distinct and can have different alignment than other groups.

The following patterns are considered valid:

```js
// "key-spacing": [2, { "align": "colon" }]
// beforeColon and afterColon default to false and true, respectively
var obj = {
    foobar   : 42,
    bat      : (2 * 2),
    "default": fn(),

    fn : function() {},
    abc: value
};

// "key-spacing": [2, {
//     "align": "value",
//     "beforeColon": true,
//     "afterColon": false
// }]
obj = {
    first  :1,
    second :2,
    third  :3
};
```

The following patterns are considered warnings:

```js
// "key-spacing": [2, { "align": "value" }]
// beforeColon and afterColon default to false and true, respectively
var obj = {
    one:   1, // Missing space before colon
    "two": 2,
    three:  3 // Extra space after colon
};
```

## When Not To Use It

If you have another convention for property spacing that might not be consistent with the available options, or if you want to permit multiple styles concurrently you can safely disable this rule.
