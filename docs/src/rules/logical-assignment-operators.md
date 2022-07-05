---
title: logical-assignment-operators
layout: doc
edit_link: https://github.com/eslint/eslint/edit/main/docs/src/rules/logical-assignment-operators.md
rule_type: suggestion
---



Require or disallow assignment logical operator shorthand

## Rule Details

This rule requires or disallows logical assignment operator shorthand.  
On the one hand the shorthand makes it clear that the variable reference is the same.
On the other hand the combined operator may be seen as "magic".
This is a feature introduced in ES2021.

## Options

This rule has a string and an object option.
String option:

* `"always"` (default)
* `"never"`

Object option (only available if string option is set to `"always"`):

* `"enforceForIfStatements": false`(default) Do *not* check for equivalent if statements

* `"enforceForIfStatements": true` Check for equivalent if statements

### always

Examples of **incorrect** code for this rule with the default `"always"` option:

::: incorrect

```js
/*eslint logical-assignment-operators: ["error", "always"]*/

a = a || b
a = a && b
a = a ?? b
```

:::

Examples of **correct** code for this rule with the default `"always"` option:

::: correct

```js
/*eslint logical-assignment-operators: ["error", "always"]*/

a = b
a ||= b
a += b
```

:::

### never

Examples of **incorrect** code for this rule with the `"never"` option:

::: incorrect

```js
/*eslint logical-assignment-operators: ["error", "never"]*/

a ||= b
a &&= b
```

:::

Examples of **correct** code for this rule with the `"never"` option:

::: correct

```js
/*eslint logical-assignment-operators: ["error", "never"]*/

a = a || b
a = a ?? b
```

:::

### enforceForIfStatements

This option checks for additional patterns with if statements which could be expressed with the logical assignment operator.
::: correct

```js
/*eslint logical-assignment-operators: ["error", "always", { enforceForIfStatements: true }]*/

if (a) b = c
if (a === 0) a = b
```

:::

::: incorrect

```js
/*eslint logical-assignment-operators: ["error", "always", { enforceForIfStatements: true }]*/

if (a) a = b // <=> a &&= b
if (!a) a = b // <=> a ||= b

if (a == null) a = b // <=> a ??= b
if (a === null || a === undefined) a = b // <=> a ??= b
```

:::

## When Not To Use It

Use of logical operator assignment shorthand is a stylistic choice. Leaving this rule turned off would allow developers to choose which style is more readable on a case-by-case basis.
