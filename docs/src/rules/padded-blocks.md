---
title: padded-blocks
rule_type: layout
related_rules:
- lines-between-class-members
- padding-line-between-statements
---

This rule was **deprecated** in ESLint v8.53.0. Please use the [corresponding rule](https://eslint.style/rules/js/padded-blocks) in [`@stylistic/eslint-plugin-js`](https://eslint.style/packages/js).

Some style guides require block statements to start and end with blank lines. The goal is
to improve readability by visually separating the block content and the surrounding code.

```js
if (a) {

    b();

}
```

Since it's good to have a consistent code style, you should either always write
padded blocks or never do it.

## Rule Details

This rule enforces consistent empty line padding within blocks.

## Options

This rule has two options, the first one can be a string option or an object option.
The second one is an object option, it can allow exceptions.

### First option

String option:

* `"always"` (default) requires empty lines at the beginning and ending of block statements, function bodies, class static blocks, classes, and `switch` statements.
* `"never"` disallows empty lines at the beginning and ending of block statements, function bodies, class static blocks, classes, and `switch` statements.

Object option:

* `"blocks"` require or disallow padding within block statements, function bodies, and class static blocks
* `"classes"` require or disallow padding within classes
* `"switches"` require or disallow padding within `switch` statements

### Second option

* `"allowSingleLineBlocks": true` allows single-line blocks

### always

Examples of **incorrect** code for this rule with the default `"always"` option:

::: incorrect

```js
/*eslint padded-blocks: ["error", "always"]*/

if (a) {
    b();
}

if (a) { b(); }

if (a)
{
    b();
}

if (a) {
    b();

}

if (a) {
    // comment
    b();

}

class C {
    static {
        a();
    }
}
```

:::

Examples of **correct** code for this rule with the default `"always"` option:

::: correct

```js
/*eslint padded-blocks: ["error", "always"]*/

if (a) {

    b();

}

if (a)
{

    b();

}

if (a) {

    // comment
    b();

}

class C {

    static {

        a();

    }

}
```

:::

### never

Examples of **incorrect** code for this rule with the `"never"` option:

::: incorrect

```js
/*eslint padded-blocks: ["error", "never"]*/

if (a) {

    b();

}

if (a)
{

    b();

}

if (a) {

    b();
}

if (a) {
    b();

}

class C {

    static {

        a();

    }

}
```

:::

Examples of **correct** code for this rule with the `"never"` option:

::: correct

```js
/*eslint padded-blocks: ["error", "never"]*/

if (a) {
    b();
}

if (a)
{
    b();
}

class C {
    static {
        a();
    }
}
```

:::

### blocks

Examples of **incorrect** code for this rule with the `{ "blocks": "always" }` option:

::: incorrect

```js
/*eslint padded-blocks: ["error", { "blocks": "always" }]*/

if (a) {
    b();
}

if (a) { b(); }

if (a)
{
    b();
}

if (a) {

    b();
}

if (a) {
    b();

}

if (a) {
    // comment
    b();

}

class C {

    static {
        a();
    }

}
```

:::

Examples of **correct** code for this rule with the `{ "blocks": "always" }` option:

::: correct

```js
/*eslint padded-blocks: ["error", { "blocks": "always" }]*/

if (a) {

    b();

}

if (a)
{

    b();

}

if (a) {

    // comment
    b();

}

class C {

    static {

        a();

    }

}

class D {
    static {

        a();

    }

}
```

:::

Examples of **incorrect** code for this rule with the `{ "blocks": "never" }` option:

::: incorrect

```js
/*eslint padded-blocks: ["error", { "blocks": "never" }]*/

if (a) {

    b();

}

if (a)
{

    b();

}

if (a) {

    b();
}

if (a) {
    b();

}

class C {
    static {

        a();

    }
}
```

:::

Examples of **correct** code for this rule with the `{ "blocks": "never" }` option:

::: correct

```js
/*eslint padded-blocks: ["error", { "blocks": "never" }]*/

if (a) {
    b();
}

if (a)
{
    b();
}

class C {
    static {
        a();
    }
}

class D {

    static {
        a();
    }

}
```

:::

### classes

Examples of **incorrect** code for this rule with the `{ "classes": "always" }` option:

::: incorrect

```js
/*eslint padded-blocks: ["error", { "classes": "always" }]*/

class  A {
    constructor(){
    }
}
```

:::

Examples of **correct** code for this rule with the `{ "classes": "always" }` option:

::: correct

```js
/*eslint padded-blocks: ["error", { "classes": "always" }]*/

class  A {

    constructor(){
    }

}
```

:::

Examples of **incorrect** code for this rule with the `{ "classes": "never" }` option:

::: incorrect

```js
/*eslint padded-blocks: ["error", { "classes": "never" }]*/

class  A {

    constructor(){
    }

}
```

:::

Examples of **correct** code for this rule with the `{ "classes": "never" }` option:

::: correct

```js
/*eslint padded-blocks: ["error", { "classes": "never" }]*/

class  A {
    constructor(){
    }
}
```

:::

### switches

Examples of **incorrect** code for this rule with the `{ "switches": "always" }` option:

::: incorrect

```js
/*eslint padded-blocks: ["error", { "switches": "always" }]*/

switch (a) {
    case 0: foo();
}
```

:::

Examples of **correct** code for this rule with the `{ "switches": "always" }` option:

::: correct

```js
/*eslint padded-blocks: ["error", { "switches": "always" }]*/

switch (a) {

    case 0: foo();

}

if (a) {
    b();
}
```

:::

Examples of **incorrect** code for this rule with the `{ "switches": "never" }` option:

::: incorrect

```js
/*eslint padded-blocks: ["error", { "switches": "never" }]*/

switch (a) {

    case 0: foo();

}
```

:::

Examples of **correct** code for this rule with the `{ "switches": "never" }` option:

::: correct

```js
/*eslint padded-blocks: ["error", { "switches": "never" }]*/

switch (a) {
    case 0: foo();
}

if (a) {

    b();

}
```

:::

### always + allowSingleLineBlocks

Examples of **incorrect** code for this rule with the `"always", {"allowSingleLineBlocks": true}` options:

::: incorrect

```js
/*eslint padded-blocks: ["error", "always", { allowSingleLineBlocks: true }]*/

if (a) {
    b();
}

if (a) {

    b();
}

if (a) {
    b();

}
```

:::

Examples of **correct** code for this rule with the `"always", {"allowSingleLineBlocks": true}` options:

::: correct

```js
/*eslint padded-blocks: ["error", "always", { allowSingleLineBlocks: true }]*/

if (a) { b(); }

if (a) {

    b();

}
```

:::

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of padding within blocks.
