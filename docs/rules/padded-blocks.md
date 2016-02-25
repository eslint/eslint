# Enforce padding within blocks (padded-blocks)

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

This rule takes one argument, which can be an string or an object. If it is `"always"` (the default) then block statements must start **and** end with a blank line. If `"never"`, then block statements should neither start nor end with a blank line. By default, this rule ignores padding in switch statements.

If you want to enforce padding for switch statements, a configuration object can be passed as the rule argument to configure the cases separately ( e.g. `{ "blocks": "always", "switches": "always" }` ).


The following patterns are considered problems when set to `"always"`:

```js
/*eslint padded-blocks: [2, "always"]*/

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
/*eslint padded-blocks: [2, "always"]*/

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
/*eslint padded-blocks: [2, "never"]*/

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
/*eslint padded-blocks: [2, "never"]*/

if (a) {
    b();
}

if (a)
{
    b();
}
```

The following patterns are considered problems when configured `{ switches: "always" }`:

```js
/*eslint padded-blocks: [2, { switches: "always" }]*/

switch (a) {
    case 0: foo();
}
```

The following patterns are not considered problems when configured `{ switches: "always" }`:

```js
/*eslint padded-blocks: [2, { switches: "always" }]*/

switch (a) {

    case 0: foo();

}

if (a) {
    b();
}
```

The following patterns are considered problems when configured `{ switches: "never" }`:

```js
/*eslint padded-blocks: [2, { switches: "never" }]*/

switch (a) {

    case 0: foo();

}
```

The following patterns are not considered problems when configured `{ switches: "never" }`:

```js
/*eslint padded-blocks: [2, { switches: "never" }]*/

switch (a) {
    case 0: foo();
}

if (a) {

    b();

}
```


## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of padding within blocks.
