---
title: multiline-comment-style
rule_type: suggestion
---

This rule was **deprecated** in ESLint v9.3.0. Please use the [corresponding rule](https://eslint.style/rules/js/multiline-comment-style) in [`@stylistic/eslint-plugin-js`](https://eslint.style/packages/js).

Many style guides require a particular style for comments that span multiple lines. For example, some style guides prefer the use of a single block comment for multiline comments, whereas other style guides prefer consecutive line comments.

## Rule Details

This rule aims to enforce a particular style for multiline comments.

### Options

This rule has a string option, which can have one of the following values:

* `"starred-block"` (default): Disallows consecutive line comments in favor of block comments. Additionally, requires block comments to have an aligned `*` character before each line.
* `"bare-block"`: Disallows consecutive line comments in favor of block comments, and disallows block comments from having a `"*"` character before each line. This option ignores JSDoc comments.
* `"separate-lines"`: Disallows block comments in favor of consecutive line comments. By default, this option ignores JSDoc comments. To also apply this rule to JSDoc comments, set the `checkJSDoc` option to `true`.

The rule always ignores directive comments such as `/* eslint-disable */`.

Examples of **incorrect** code for this rule with the default `"starred-block"` option:

::: incorrect

```js

/* eslint multiline-comment-style: ["error", "starred-block"] */

// this line
// calls foo()
foo();

/* this line
calls foo() */
foo();

/* this comment
 * is missing a newline after /*
 */

/*
 * this comment
 * is missing a newline at the end */

/*
* the star in this line should have a space before it
 */

/*
 * the star on the following line should have a space before it
*/

```

:::

Examples of **correct** code for this rule with the default `"starred-block"` option:

::: correct

```js
/* eslint multiline-comment-style: ["error", "starred-block"] */

/*
 * this line
 * calls foo()
 */
foo();

// single-line comment
```

:::

Examples of **incorrect** code for this rule with the `"bare-block"` option:

::: incorrect

```js
/* eslint multiline-comment-style: ["error", "bare-block"] */

// this line
// calls foo()
foo();

/*
 * this line
 * calls foo()
 */
foo();
```

:::

Examples of **correct** code for this rule with the `"bare-block"` option:

::: correct

```js
/* eslint multiline-comment-style: ["error", "bare-block"] */

/* this line
   calls foo() */
foo();
```

:::

Examples of **incorrect** code for this rule with the `"separate-lines"` option:

::: incorrect

```js

/* eslint multiline-comment-style: ["error", "separate-lines"] */

/* This line
calls foo() */
foo();

/*
 * This line
 * calls foo()
 */
foo();

```

:::

Examples of **correct** code for this rule with the `"separate-lines"` option:

::: correct

```js
/* eslint multiline-comment-style: ["error", "separate-lines"] */

// This line
// calls foo()
foo();

```

:::

Examples of **incorrect** code for this rule with the `"separate-lines"` option and `checkJSDoc` set to `true`:

::: incorrect

```js

/* eslint multiline-comment-style: ["error", "separate-lines", { "checkJSDoc": true }] */

/**
 * I am a JSDoc comment
 * and I'm not allowed
 */
foo();

```

:::

Examples of **correct** code for this rule with the `"separate-lines"` option and `checkJSDoc` set to `true`:

::: correct

```js
/* eslint multiline-comment-style: ["error", "separate-lines", { "checkJSDoc": true }] */

// I am a JSDoc comment
// and I'm not allowed
foo();

```

:::

## When Not To Use It

If you don't want to enforce a particular style for multiline comments, you can disable the rule.
