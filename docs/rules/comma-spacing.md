# Set's spacing before and after comma (comma-spacing)

This rule enforces consistency in spacing of commas. Spacing in commas improve readability of a list of items. As opposed to comma-style rule, which deals with standard/comma-later and comma-first styles, this rule deals only with whitespace before and after commas.

```js
var foo = 1, bar = 2;
var foo = 1 ,bar = 2;
```

## Rule Details

This rule aims to enforce spacing before and after a comma. As such, it warns whenever it sees a missing or unwanted space in commas of variable declaration, object property and array element.


### Options

The rule takes one option, an object, which has two keys `before` and `after` having boolean values `true` or `false`. If `before` is `true`, space is enforced before commas and if it's `false`, space is disallowed before commas. If `after` is `true`, space is enforced after commas and if it's `false`, space is disallowed after commas. The default is `{before: false, after: true}`.

```json
    "comma-spacing": [2, {before: false, after: true}]
```

The following examples show two primary usages of this option.

#### {before: false, after: true}

This is the default option. It enforces spacing after commas and disallows spacing before commas.

The following patterns are considered warnings:

```js

    var foo = 1 ,bar = 2;
    var arr = [1 , 2];
    var obj = {"foo": "bar" ,"baz": "qur"};

```

The following patterns are not warnings:

```js

    var foo = 1, bar = 2;
    var arr = [1, 2];
    var obj = {"foo": "bar", "baz": "qur"};

```

#### {before: true, after: false}

This option enforces spacing before commas and disallows spacing after commas.

The following patterns are considered warnings:

```js

    var foo = 1, bar = 2;
    var arr = [1 , 2];
    var obj = {"foo": "bar", "baz": "qur"};

```

The following patterns are not warnings:

```js

    var foo = 1 ,bar = 2;
    var arr = [1 ,2];
    var obj = {"foo": "bar" ,"baz": "qur"};

```

## When Not To Use It

If your project will not be following a consistent comma-spacing pattern, turn this rule off.


## Related Rules

* [comma-style](comma-style.md)
* [space-in-brackets](space-in-brackets.md)
* [space-in-parens](space-in-parens.md)
* [space-infix-ops](space-infix-ops.md)
* [space-after-keywords](space-after-keywords)
* [space-unary-word-ops](space-unary-word-ops)
* [space-return-throw-case](space-return-throw-case)