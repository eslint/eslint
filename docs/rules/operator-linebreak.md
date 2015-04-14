# Operator Linebreak (operator-linebreak)

When a statement is too long to fit on a single line, line breaks are generally inserted next to the operators separating expressions. The first style coming to mind would be to place the operator at the end of the line, following the english punctuation rules.

```js
var fullHeight = borderTop +
                 innerHeight +
                 borderBottom;
```

Some developers find that placing operators at the beginning of the line makes the code more readable.

```js
var fullHeight = borderTop
               + innerHeight
               + borderBottom;
```

## Rule Details

The `operator-linebreak` rule is aimed at enforcing a particular operator line break style. As such, it warns whenever it sees a binary operator or assignment that does not adhere to a particular style: either placing linebreaks after or before the operators.

### Options

The rule takes an option, a string, which could be "after", "before" or "none". The default is "after".

You can set the style in configuration like this:

```json
"operator-linebreak": [2, "before"]
```

#### "after"

This is the default setting for this rule. This option requires the line break to be placed after the operator.

While using this setting, the following patterns are considered warnings:

```js

foo = 1
+
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

#### "before"

This option requires the line break to be placed before the operator.

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

#### "none"

This option disallows line breaks on either side of the operator.

While using this setting, the following patterns are considered warnings:

```js

foo = 1 +
      2;

foo = 1
    + 2;

if (someCondition ||
    otherCondition) {
}

if (someCondition
    || otherCondition) {
}

```

The following patterns are not warnings:

```js

foo = 1 + 2;

foo = 5;

if (someCondition || otherCondition) {
}

```

## When Not To Use It

If your project will not be using a common operator line break style, turn this rule off.

## Related Rules

* [comma-style](comma-style.md)
