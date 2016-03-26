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

## Options

The rule takes two options, a string, which can be `"after"`, `"before"` or `"none"` where the default is `"after"` and an object for more fine-grained configuration.

You can set the style in configuration like this:

```json
"operator-linebreak": ["error", "before", { "overrides": { "?": "after" } }]
```

The default configuration is to enforce line breaks _after_ the operator except for the ternary operator `?` and `:` following that.

### "after"

This is the default setting for this rule. This option requires the line break to be placed after the operator.

While using this setting, the following patterns are considered problems:

```js
/*eslint operator-linebreak: ["error", "after"]*/

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

answer = everything
  ? 42
  : foo;
```

The following patterns are not considered problems:

```js
/*eslint operator-linebreak: ["error", "after"]*/

foo = 1 + 2;

foo = 1 +
      2;

foo =
    5;

if (someCondition ||
    otherCondition) {
}

answer = everything ?
  42 :
  foo;
```

### "before"

This option requires the line break to be placed before the operator.

While using this setting, the following patterns are considered problems:

```js
/*eslint operator-linebreak: ["error", "before"]*/

foo = 1 +
      2;

foo =
    5;

if (someCondition ||
    otherCondition) {
}

answer = everything ?
  42 :
  foo;
```

The following patterns are not considered problems:

```js
/*eslint operator-linebreak: ["error", "before"]*/

foo = 1 + 2;

foo = 1
    + 2;

foo
    = 5;

if (someCondition
    || otherCondition) {
}

answer = everything
  ? 42
  : foo;
```

### "none"

This option disallows line breaks on either side of the operator.

While using this setting, the following patterns are considered problems:

```js
/*eslint operator-linebreak: ["error", "none"]*/

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

answer = everything
  ? 42
  : foo;

answer = everything ?
  42 :
  foo;
```

The following patterns are not considered problems:

```js
/*eslint operator-linebreak: ["error", "none"]*/

foo = 1 + 2;

foo = 5;

if (someCondition || otherCondition) {
}

answer = everything ? 42 : foo;
```

### Fine-grained control

The rule allows you to have even finer-grained control over individual operators by specifying an `overrides` dictionary:

```json
"operator-linebreak": ["error", "before", { "overrides": { "?": "after", "+=": "none" } }]
```

This would override the global setting for that specific operator.

#### "ignore" override

This option is only supported using overrides and ignores line breaks on either side of the operator.

While using this setting, the following patterns are not considered problems:

```js
/*eslint operator-linebreak: ["error", "after", { "overrides": { "?": "ignore", ":": "ignore"} }]*/

answer = everything ?
  42
  : foo;

answer = everything
  ?
  42
  :
  foo;
```

## When Not To Use It

If your project will not be using a common operator line break style, turn this rule off.

## Related Rules

* [comma-style](comma-style.md)
