# Enforce padding within blocks (padded-blocks)

(fixable) The `--fix` option on the [command line](../user-guide/command-line-interface#fix) automatically fixes problems reported by this rule.

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

This rule enforces consistent padding within blocks.

This rule takes one argument, which can be an string or an object. If it is `"always"` (the default) then block statements must start **and** end with a blank line. If `"never"`, then block statements should neither start nor end with a blank line. By default, this rule ignores padding in switch statements and classes.

If you want to enforce padding within switches and classes, a configuration object can be passed as the rule argument to configure the cases separately ( e.g. `{ "blocks": "always", "switches": "always", "classes": "always" }` ).


The following patterns are considered problems when set to `"always"`:

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
    b();

}

if (a) {
    // comment
    b();

}
```

The following patterns are not considered problems when set to `"always"`:

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

The following patterns are considered problems when set to `"never"`:

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

The following patterns are not considered problems when set to `"never"`:

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

The following patterns are considered problems when configured `{ "switches": "always" }`:

```js
/*eslint padded-blocks: ["error", { "switches": "always" }]*/

switch (a) {
    case 0: foo();
}
```

The following patterns are not considered problems when configured `{ "switches": "always" }`:

```js
/*eslint padded-blocks: ["error", { "switches": "always" }]*/

switch (a) {

    case 0: foo();

}

if (a) {
    b();
}
```

The following patterns are considered problems when configured `{ "switches": "never" }`:

```js
/*eslint padded-blocks: ["error", { "switches": "never" }]*/

switch (a) {

    case 0: foo();

}
```

The following patterns are not considered problems when configured `{ "switches": "never" }`:

```js
/*eslint padded-blocks: ["error", { "switches": "never" }]*/

switch (a) {
    case 0: foo();
}

if (a) {

    b();

}
```

The following patterns are considered problems when configured `{ "classes": "always" }`:

```js
/*eslint padded-blocks: ["error", { "classes": "always" }]*/

class  A {
    constructor(){
    }
}
```

The following patterns are not considered problems when configured `{ "classes": "always" }`:

```js
/*eslint padded-blocks: ["error", { "classes": "always" }]*/

class  A {

    constructor(){
    }

}
```

The following patterns are considered problems when configured `{ "classes": "never" }`:

```js
/*eslint padded-blocks: ["error", { "classes": "never" }]*/

class  A {

    constructor(){
    }

}
```

The following patterns are not considered problems when configured `{ "classes": "never" }`:

```js
/*eslint padded-blocks: ["error", { "classes": "never" }]*/

class  A {
    constructor(){
    }
}
```

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of padding within blocks.
