---
title: logical-assignment-operators
rule_type: suggestion
---

ES2021 introduces the assignment operator shorthand for the logical operators `||`, `&&` and `??`.
Before, this was only allowed for mathematical operations such as `+` or `*` (see the rule [operator-assignment](./operator-assignment)).
The shorthand can be used if the assignment target and the left expression of a logical expression are the same.
For example `a = a || b` can be shortened to `a ||= b`.

## Rule Details

This rule requires or disallows logical assignment operator shorthand.

### Options

This rule has a string and an object option.
String option:

* `"always"` (default)
* `"never"`

Object option (only available if string option is set to `"always"`):

* `"enforceForIfStatements": false`(default) Do *not* check for equivalent `if` statements
* `"enforceForIfStatements": true` Check for equivalent `if` statements

#### always

This option checks for expressions that can be shortened using logical assignment operator. For example, `a = a || b` can be shortened to `a ||= b`.
Expressions with associativity such as `a = a || b || c` are reported as being able to be shortened to `a ||= b || c` unless the evaluation order is explicitly defined using parentheses, such as `a = (a || b) || c`.

Examples of **incorrect** code for this rule with the default `"always"` option:

::: incorrect

```js
/*eslint logical-assignment-operators: ["error", "always"]*/

a = a || b
a = a && b
a = a ?? b
a || (a = b)
a && (a = b)
a ?? (a = b)
a = a || b || c
a = a && b && c
a = a ?? b ?? c
```

:::

Examples of **correct** code for this rule with the default `"always"` option:

::: correct

```js
/*eslint logical-assignment-operators: ["error", "always"]*/

a = b
a += b
a ||= b
a = b || c
a || (b = c)

if (a) a = b

a = (a || b) || c
```

:::

#### never

Examples of **incorrect** code for this rule with the `"never"` option:

::: incorrect

```js
/*eslint logical-assignment-operators: ["error", "never"]*/

a ||= b
a &&= b
a ??= b
```

:::

Examples of **correct** code for this rule with the `"never"` option:

::: correct

```js
/*eslint logical-assignment-operators: ["error", "never"]*/

a = a || b
a = a && b
a = a ?? b
```

:::

#### enforceForIfStatements

This option checks for additional patterns with if statements which could be expressed with the logical assignment operator.

Examples of **incorrect** code for this rule with the `["always", { enforceForIfStatements: true }]` option:

::: incorrect

```js
/*eslint logical-assignment-operators: ["error", "always", { enforceForIfStatements: true }]*/

if (a) a = b // <=> a &&= b
if (!a) a = b // <=> a ||= b

if (a == null) a = b // <=> a ??= b
if (a === null || a === undefined) a = b // <=> a ??= b
```

:::

Examples of **correct** code for this rule with the `["always", { enforceForIfStatements: true }]` option:

::: correct

```js
/*eslint logical-assignment-operators: ["error", "always", { enforceForIfStatements: true }]*/

if (a) b = c
if (a === 0) a = b
```

:::

## When Not To Use It

Use of logical operator assignment shorthand is a stylistic choice. Leaving this rule turned off would allow developers to choose which style is more readable on a case-by-case basis.
