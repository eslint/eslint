# Disallow whitespace before properties (no-whitespace-before-property)

JavaScript allows whitespace between objects and their properties. However, inconsistent spacing can make code harder to read and can lead to errors.

```js
foo. bar .baz . quz
```

## Rule Details

This rule alerts for whitespace around the dot or before the opening bracket before properties of objects if they are on the same line. It does not alert for whitespace when the object and property are on separate lines, as it is common to add newlines to longer chains of properties:

```js
foo
  .bar()
  .baz()
  .qux()
```

The following patterns are considered problems when this rule is turned on:

```js
/*eslint no-whitespace-before-property: "error"*/

foo [bar]

foo. bar

foo .bar

foo. bar. baz

foo. bar()
  .baz()

foo
  .bar(). baz()
```

And the following patterns are not considered problems:

```js
/*eslint no-whitespace-before-property: "error"*/

foo.bar

foo[bar]

foo[ bar ]

foo.bar.baz

foo
  .bar().baz()

foo
  .bar()
  .baz()

foo.
  bar().
  baz()
```

## When Not To Use It

Turn this rule off if you do not care about allowing whitespace around the dot or before the opening bracket before properties of objects if they are on the same line.
