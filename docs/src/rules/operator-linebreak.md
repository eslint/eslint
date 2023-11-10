---
title: operator-linebreak
rule_type: layout
related_rules:
- comma-style
---

This rule was **deprecated** in ESLint v8.53.0. Please use the corresponding rule in [`@stylistic/eslint-plugin-js`](https://eslint.style/packages/js).

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

This rule has two options, a string option and an object option.

String option:

* `"after"` requires linebreaks to be placed after the operator
* `"before"` requires linebreaks to be placed before the operator
* `"none"` disallows linebreaks on either side of the operator

Object option:

* `"overrides"` overrides the global setting for specified operators

The default configuration is `"after", { "overrides": { "?": "before", ":": "before" } }`

### after

Examples of **incorrect** code for this rule with the `"after"` option:

::: incorrect

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

class Foo {
    a
        = 1;
    [b]
        = 2;
    [c
    ]
        = 3;
}
```

:::

Examples of **correct** code for this rule with the `"after"` option:

::: correct

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

class Foo {
    a =
        1;
    [b] =
        2;
    [c
    ] =
        3;
    d = 4;
}
```

:::

### before

Examples of **incorrect** code for this rule with the `"before"` option:

::: incorrect

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

class Foo {
    a =
        1;
    [b] =
        2;
    [c
    ] =
        3;
}
```

:::

Examples of **correct** code for this rule with the `"before"` option:

::: correct

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

class Foo {
    a
        = 1;
    [b]
        = 2;
    [c
    ]
        = 3;
    d = 4;
}
```

:::

### none

Examples of **incorrect** code for this rule with the `"none"` option:

::: incorrect

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

class Foo {
    a =
        1;
    [b] =
        2;
    [c
    ] =
        3;
    d
        = 4;
    [e]
        = 5;
    [f
    ]
        = 6;
}
```

:::

Examples of **correct** code for this rule with the `"none"` option:

::: correct

```js
/*eslint operator-linebreak: ["error", "none"]*/

foo = 1 + 2;

foo = 5;

if (someCondition || otherCondition) {
}

answer = everything ? 42 : foo;

class Foo {
    a = 1;
    [b] = 2;
    [c
    ] = 3;
    d = 4;
    [e] = 5;
    [f
    ] = 6;
}
```

:::

### overrides

Examples of additional **incorrect** code for this rule with the `{ "overrides": { "+=": "before" } }` option:

::: incorrect

```js
/*eslint operator-linebreak: ["error", "after", { "overrides": { "+=": "before" } }]*/

var thing = 'thing';
thing +=
  's';
```

:::

Examples of additional **correct** code for this rule with the `{ "overrides": { "+=": "before" } }` option:

::: correct

```js
/*eslint operator-linebreak: ["error", "after", { "overrides": { "+=": "before" } }]*/

var thing = 'thing';
thing
  += 's';
```

:::

Examples of additional **correct** code for this rule with the `{ "overrides": { "?": "ignore", ":": "ignore" } }` option:

::: correct

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

:::

Examples of **incorrect** code for this rule with the default `"after", { "overrides": { "?": "before", ":": "before" } }` option:

::: incorrect

```js
/*eslint operator-linebreak: ["error", "after", { "overrides": { "?": "before", ":": "before" } }]*/

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

answer = everything ?
  42 :
  foo;
```

:::

Examples of **correct** code for this rule with the default `"after", { "overrides": { "?": "before", ":": "before" } }` option:

::: correct

```js
/*eslint operator-linebreak: ["error", "after", { "overrides": { "?": "before", ":": "before" } }]*/

foo = 1 + 2;

foo = 1 +
      2;

foo =
    5;

if (someCondition ||
    otherCondition) {
}

answer = everything
  ? 42
  : foo;
```

:::

## When Not To Use It

If your project will not be using a common operator line break style, turn this rule off.
