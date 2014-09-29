# Enforce padding within blocks (padded-blocks)

Some style guides require block statements to start and end with blank lines. The intention of this is,
to improve the readability by a visual separation of the block content and the surrounding code.

```js
if (a) {

    b();

}
```

Besides that, it is always a good idea to have a consistent code style,
so you should either always write padded blocks or never.

## Rule Details

This rule will enforce a consistent padding within blocks.

This rule takes one argument. If it is `"always"` then blocks must start **and** end with a blank line. If `"never"`
then all blocks should never start **or** end with a blank line. The default is `"always"`.

The following patterns are considered warnings when configured `"always"`:

```js
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

The following patterns are not considered warnings when configured `"always"`:

```js
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

The following patterns are considered warnings when configured `"never"`:

```js
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

The following patterns are not considered warnings when configured `"never"`:

```js
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
