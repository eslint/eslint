# require or disallow padding within blocks (padded-blocks)

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

* `"always"` (default) requires empty lines at the beginning and ending of block statements and classes
* `"never"` disallows empty lines at the beginning and ending of block statements and classes

Object option:

* `"blocks"` require or disallow padding within block statements
* `"classes"` require or disallow padding within classes
* `"switches"` require or disallow padding within `switch` statements

### Second option

* `"allowSingleLineBlocks": true` allows single-line blocks

### always

Examples of **incorrect** code for this rule with the default `"always"` option:

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
```

Examples of **correct** code for this rule with the default `"always"` option:

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
```

### never

Examples of **incorrect** code for this rule with the `"never"` option:

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
```

Examples of **correct** code for this rule with the `"never"` option:

```js
/*eslint padded-blocks: ["error", "never"]*/

if (a) {
    b();
}

if (a)
{
    b();
}
```

### blocks

Examples of **incorrect** code for this rule with the `{ "blocks": "always" }` option:

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
```

Examples of **correct** code for this rule with the `{ "blocks": "always" }` option:

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
```

Examples of **incorrect** code for this rule with the `{ "blocks": "never" }` option:

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
```

Examples of **correct** code for this rule with the `{ "blocks": "never" }` option:

```js
/*eslint padded-blocks: ["error", { "blocks": "never" }]*/

if (a) {
    b();
}

if (a)
{
    b();
}
```

### classes

Examples of **incorrect** code for this rule with the `{ "classes": "always" }` option:

```js
/*eslint padded-blocks: ["error", { "classes": "always" }]*/

class  A {
    constructor(){
    }
}
```

Examples of **correct** code for this rule with the `{ "classes": "always" }` option:

```js
/*eslint padded-blocks: ["error", { "classes": "always" }]*/

class  A {

    constructor(){
    }

}
```

Examples of **incorrect** code for this rule with the `{ "classes": "never" }` option:

```js
/*eslint padded-blocks: ["error", { "classes": "never" }]*/

class  A {

    constructor(){
    }

}
```

Examples of **correct** code for this rule with the `{ "classes": "never" }` option:

```js
/*eslint padded-blocks: ["error", { "classes": "never" }]*/

class  A {
    constructor(){
    }
}
```

### switches

Examples of **incorrect** code for this rule with the `{ "switches": "always" }` option:

```js
/*eslint padded-blocks: ["error", { "switches": "always" }]*/

switch (a) {
    case 0: foo();
}
```

Examples of **correct** code for this rule with the `{ "switches": "always" }` option:

```js
/*eslint padded-blocks: ["error", { "switches": "always" }]*/

switch (a) {

    case 0: foo();

}

if (a) {
    b();
}
```

Examples of **incorrect** code for this rule with the `{ "switches": "never" }` option:

```js
/*eslint padded-blocks: ["error", { "switches": "never" }]*/

switch (a) {

    case 0: foo();

}
```

Examples of **correct** code for this rule with the `{ "switches": "never" }` option:

```js
/*eslint padded-blocks: ["error", { "switches": "never" }]*/

switch (a) {
    case 0: foo();
}

if (a) {

    b();

}
```

### always + allowSingleLineBlocks

Examples of **incorrect** code for this rule with the `"always", {"allowSingleLineBlocks": true}` options:

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

Examples of **correct** code for this rule with the `"always", {"allowSingleLineBlocks": true}` options:

```js
/*eslint padded-blocks: ["error", "always", { allowSingleLineBlocks: true }]*/

if (a) { b(); }

if (a) {

    b();

}
```

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of padding within blocks.

## Related Rules

* [lines-between-class-members](lines-between-class-members.md)
* [padding-line-between-statements](padding-line-between-statements.md)
