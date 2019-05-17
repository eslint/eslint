# enforce consistent linebreak style for operators (operator-linebreak)

When a statement is too long to fit on a single line, line breaks are generally inserted next to the operators separating expressions. The first style coming to mind would be to place the operator at the end of the line, following the English punctuation rules.

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

This rule enforces a consistent linebreak style for operators.

## Options

This rule has one option, which can be a string option or an object option.

String option:

* `"after"` requires linebreaks to be placed after the operator
* `"before"` requires linebreaks to be placed before the operator
* `"none"` disallows linebreaks on either side of the operator

Object option:

* `"overrides"` overrides the global setting for specified operators

The default configuration is `"after", { "overrides": { "?": "before", ":": "before" } }`

### after

Examples of **incorrect** code for this rule with the default `"after"` option:

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

Examples of **correct** code for this rule with the default `"after"` option:

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

### before

Examples of **incorrect** code for this rule with the `"before"` option:

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

Examples of **correct** code for this rule with the `"before"` option:

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

### none

Examples of **incorrect** code for this rule with the `"none"` option:

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

Examples of **correct** code for this rule with the `"none"` option:

```js
/*eslint operator-linebreak: ["error", "none"]*/

foo = 1 + 2;

foo = 5;

if (someCondition || otherCondition) {
}

answer = everything ? 42 : foo;
```

### overrides

Examples of additional **correct** code for this rule with the `{ "overrides": { "+=": "before" } }` option:

```js
/*eslint operator-linebreak: ["error", "after", { "overrides": { "+=": "before" } }]*/

var thing = 'thing';
thing
  += 's';
```

Examples of additional **correct** code for this rule with the `{ "overrides": { "?": "ignore", ":": "ignore" } }` option:

```js
/*eslint operator-linebreak: ["error", "after", { "overrides": { "?": "ignore", ":": "ignore" } }]*/

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
