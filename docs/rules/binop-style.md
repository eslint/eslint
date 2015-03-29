# Binary Operator style (binop-style)

Binary operator Style rule enforces binary operators next to a line break to be placed at the end of the previous line of at the beginning of the new line.


## Rule Details

This rule is aimed at enforcing a particular binary operator style in JavaScript. As such, it warns whenever it sees a binary expression, logical expression, assignment expression or variable declarator that does not adhere to a particular binary operator style. It doesn't support cases where there are line breaks before and after the operator (lone operator). It also avoids single line expression cases.

### Options

The rule takes an option, a string, which could be either "last" or "first". The default is "last".

You can set the style in configuration like this:

```json
"binop-style": [2, "first"]
```

#### "last"

This is the default setting for this rule. This option requires that the operator be placed after and be in the same line as the last expression of the line.

While using this setting, the following patterns are considered warnings:

```js

foo = 1
+ //lone operator
2;

foo = 1
    + 2;


foo
    = 5;

if (someCondition
    || otherCondition) {
}
```

The following patterns are not warnings:

```js

foo = 1 + 2;

foo = 1 +
      2;


foo =
    5;

if (someCondition ||
    otherCondition) {
}

```

#### "first"

This option requires that the operator be placed before and be in the same line as the first expression of the line.

While using this setting, the following patterns are considered warnings:

```js

foo = 1 +
      2;


foo =
    5;

if (someCondition ||
    otherCondition) {
}

```

The following patterns are not warnings:

```js

foo = 1 + 2;

foo = 1
    + 2;

foo
    = 5;

if (someCondition
    || otherCondition) {
}

```

#### Exceptions

Exceptions of the following nodes may be passed in order to tell eslint to ignore nodes of certain types.
```
BinaryExpression,
LogicalExpression,
AssignmentExpression,
VariableDeclarator
```

An example use case is if a user didn't want to enforce operator style in assignments.
The following code would lint.

```
/* eslint binop-style: [2, "first", {exceptions: {VariableDeclarator: true} }] */
var o =
    something;
```

Whereas the following would not.
```
/* eslint binop-style: [2, "first", {exceptions: {VariableDeclarator: true} }] */
var o =
    something +
    otherthing;
```

## When Not To Use It

If your project will not be using one true binary operator style, turn this rule off.

## Related Rules

* [comma-style](comma-style.md)
* [brace-style](brace-style.md)
