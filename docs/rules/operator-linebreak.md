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

The `operator-linebreak` rule is aimed at enforcing a particular operator line break style. As such, it warns whenever it sees a binary operator or assignment that does not adhere to a particular style: either placing operators after or before the lines.

### Options

The rule takes an option, a string, which could be either "after" or "before". The default is "after".

You can set the style in configuration like this:

```json
"operator-linebreak": [2, "before"]
```

#### "after"

This is the default setting for this rule. This option requires that the operator be placed after and be in the same line as the last expression of the line.

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

## When Not To Use It

If your project will not be using a common operator line break style, turn this rule off.

## Related Rules

* [comma-style](comma-style.md)
