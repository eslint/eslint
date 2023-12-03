---
title: brace-style
rule_type: layout
related_rules:
- block-spacing
- space-before-blocks
further_reading:
- https://en.wikipedia.org/wiki/Indent_style
---

This rule was **deprecated** in ESLint v8.53.0. Please use the [corresponding rule](https://eslint.style/rules/js/brace-style) in [`@stylistic/eslint-plugin-js`](https://eslint.style/packages/js).

Brace style is closely related to [indent style](https://en.wikipedia.org/wiki/Indent_style) in programming and describes the placement of braces relative to their control statement and body. There are probably a dozen, if not more, brace styles in the world.

The *one true brace style* is one of the most common brace styles in JavaScript, in which the opening brace of a block is placed on the same line as its corresponding statement or declaration. For example:

```js
if (foo) {
  bar();
} else {
  baz();
}
```

One common variant of one true brace style is called Stroustrup, in which the `else` statements in an `if-else` construct, as well as `catch` and `finally`, must be on its own line after the preceding closing brace. For example:

```js
if (foo) {
  bar();
}
else {
  baz();
}
```

Another style is called [Allman](https://en.wikipedia.org/wiki/Indent_style#Allman_style), in which all the braces are expected to be on their own lines without any extra indentation. For example:

```js
if (foo)
{
  bar();
}
else
{
  baz();
}
```

While no style is considered better than the other, most developers agree that having a consistent style throughout a project is important for its long-term maintainability.

## Rule Details

This rule enforces consistent brace style for blocks.

## Options

This rule has a string option:

* `"1tbs"` (default) enforces one true brace style
* `"stroustrup"` enforces Stroustrup style
* `"allman"` enforces Allman style

This rule has an object option for an exception:

* `"allowSingleLine": true` (default `false`) allows the opening and closing braces for a block to be on the *same* line

### 1tbs

Examples of **incorrect** code for this rule with the default `"1tbs"` option:

:::incorrect

```js
/*eslint brace-style: "error"*/

function foo()
{
  return true;
}

if (foo)
{
  bar();
}

try
{
  somethingRisky();
} catch(e)
{
  handleError();
}

if (foo) {
  bar();
}
else {
  baz();
}

class C
{
    static
    {
        foo();
    }
}
```

:::

Examples of **correct** code for this rule with the default `"1tbs"` option:

:::correct

```js
/*eslint brace-style: "error"*/

function foo() {
  return true;
}

if (foo) {
  bar();
}

if (foo) {
  bar();
} else {
  baz();
}

try {
  somethingRisky();
} catch(e) {
  handleError();
}

class C {
    static {
        foo();
    }
}

// when there are no braces, there are no problems
if (foo) bar();
else if (baz) boom();
```

:::

Examples of **correct** code for this rule with the `"1tbs", { "allowSingleLine": true }` options:

:::correct

```js
/*eslint brace-style: ["error", "1tbs", { "allowSingleLine": true }]*/

function nop() { return; }

if (foo) { bar(); }

if (foo) { bar(); } else { baz(); }

try { somethingRisky(); } catch(e) { handleError(); }

if (foo) { baz(); } else {
  boom();
}

if (foo) { baz(); } else if (bar) {
  boom();
}

if (foo) { baz(); } else
if (bar) {
  boom();
}

if (foo) { baz(); } else if (bar) {
  boom();
}

try { somethingRisky(); } catch(e) {
  handleError();
}

class C {
    static { foo(); }
}

class D { static { foo(); } }
```

:::

### stroustrup

Examples of **incorrect** code for this rule with the `"stroustrup"` option:

:::incorrect

```js
/*eslint brace-style: ["error", "stroustrup"]*/

function foo()
{
  return true;
}

if (foo)
{
  bar();
}

try
{
  somethingRisky();
} catch(e)
{
  handleError();
}

class C
{
    static
    {
        foo();
    }
}

if (foo) {
  bar();
} else {
  baz();
}
```

:::

Examples of **correct** code for this rule with the `"stroustrup"` option:

:::correct

```js
/*eslint brace-style: ["error", "stroustrup"]*/

function foo() {
  return true;
}

if (foo) {
  bar();
}

if (foo) {
  bar();
}
else {
  baz();
}

try {
  somethingRisky();
}
catch(e) {
  handleError();
}

class C {
    static {
        foo();
    }
}

// when there are no braces, there are no problems
if (foo) bar();
else if (baz) boom();
```

:::

Examples of **correct** code for this rule with the `"stroustrup", { "allowSingleLine": true }` options:

:::correct

```js
/*eslint brace-style: ["error", "stroustrup", { "allowSingleLine": true }]*/

function nop() { return; }

if (foo) { bar(); }

if (foo) { bar(); }
else { baz(); }

try { somethingRisky(); }
catch(e) { handleError(); }

class C {
    static { foo(); }
}

class D { static { foo(); } }
```

:::

### allman

Examples of **incorrect** code for this rule with the `"allman"` option:

:::incorrect

```js
/*eslint brace-style: ["error", "allman"]*/

function foo() {
  return true;
}

if (foo)
{
  bar(); }

try
{
  somethingRisky();
} catch(e)
{
  handleError();
}

class C {
    static {
        foo();
    }
}

if (foo) {
  bar();
} else {
  baz();
}
```

:::

Examples of **correct** code for this rule with the `"allman"` option:

:::correct

```js
/*eslint brace-style: ["error", "allman"]*/

function foo()
{
  return true;
}

if (foo)
{
  bar();
}

if (foo)
{
  bar();
}
else
{
  baz();
}

try
{
  somethingRisky();
}
catch(e)
{
  handleError();
}

class C
{
    static
    {
        foo();
    }
}

// when there are no braces, there are no problems
if (foo) bar();
else if (baz) boom();
```

:::

Examples of **correct** code for this rule with the `"allman", { "allowSingleLine": true }` options:

:::correct

```js
/*eslint brace-style: ["error", "allman", { "allowSingleLine": true }]*/

function nop() { return; }

if (foo) { bar(); }

if (foo) { bar(); }
else { baz(); }

try { somethingRisky(); }
catch(e) { handleError(); }

class C
{
    static { foo(); }

    static
    { foo(); }
}

class D { static { foo(); } }
```

:::

## When Not To Use It

If you don't want to enforce a particular brace style, don't enable this rule.
