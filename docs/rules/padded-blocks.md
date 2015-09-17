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

This rule takes one argument. If it is `"always"` then blocks must start **and** end with a blank line. If `"never"`
then all blocks should never start **or** end with a blank line. The default is `"always"`.

The following patterns are considered problems when set to `"always"`:

```js
/*eslint padded-blocks: [2, "always"]*/

if (a) {         /*error Block must be padded by blank lines.*/
    b();
}                /*error Block must be padded by blank lines.*/

if (a) { b(); }  /*error Block must be padded by blank lines.*/

if (a)
{                /*error Block must be padded by blank lines.*/
    b();
}                /*error Block must be padded by blank lines.*/

if (a) {

    b();
}                /*error Block must be padded by blank lines.*/

if (a) {         /*error Block must be padded by blank lines.*/
    b();

}

if (a) {         /*error Block must be padded by blank lines.*/
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

if (a) {  /*error Block must not be padded by blank lines.*/

    b();

}        /*error Block must not be padded by blank lines.*/

if (a)
{        /*error Block must not be padded by blank lines.*/

    b();

}        /*error Block must not be padded by blank lines.*/

if (a) { /*error Block must not be padded by blank lines.*/

    b();
}

if (a) {
    b();

}        /*error Block must not be padded by blank lines.*/
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

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of padding within blocks.
