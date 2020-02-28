# Enforce or disallow newlines between operands of ternary expressions (multiline-ternary)

JavaScript allows operands of ternary expressions to be separated by newlines, which can improve the readability of your program.

For example:

```js
var foo = bar > baz ? value1 : value2;
```

The above can be rewritten as the following to improve readability and more clearly delineate the operands:

```js
var foo = bar > baz ?
    value1 :
    value2;
```

## Rule Details

This rule enforces or disallows newlines between operands of a ternary expression.
Note: The location of the operators is not enforced by this rule. Please see the [operator-linebreak](operator-linebreak.md) rule if you are interested in enforcing the location of the operators themselves.

## Options

This rule has a string option:

* `"always"` (default) enforces newlines between the operands of a ternary expression.
* `"always-multiline"` enforces newlines between the operands of a ternary expression if the expression spans multiple lines.
* `"never"` disallows newlines between the operands of a ternary expression (enforcing that the entire ternary expression is on one line).

### always

This is the default option.

Examples of **incorrect** code for this rule with the `"always"` option:

```js
/*eslint multiline-ternary: ["error", "always"]*/

foo > bar ? value1 : value2;

foo > bar ? value :
    value2;

foo > bar ?
    value : value2;
```

Examples of **correct** code for this rule with the `"always"` option:

```js
/*eslint multiline-ternary: ["error", "always"]*/

foo > bar ?
    value1 :
    value2;

foo > bar ?
    (baz > qux ?
        value1 :
        value2) :
    value3;
```

### always-multiline

Examples of **incorrect** code for this rule with the `"always-multiline"` option:

```js
/*eslint multiline-ternary: ["error", "always-multiline"]*/

foo > bar ? value1 :
    value2;

foo > bar ?
    value1 : value2;

foo > bar &&
    bar > baz ? value1 : value2;
```

Examples of **correct** code for this rule with the `"always-multiline"` option:

```js
/*eslint multiline-ternary: ["error", "always-multiline"]*/

foo > bar ? value1 : value2;

foo > bar ?
    value1 :
    value2;

foo > bar ?
    (baz > qux ? value1 : value2) :
    value3;

foo > bar ?
    (baz > qux ?
        value1 :
        value2) :
    value3;

foo > bar &&
    bar > baz ?
        value1 :
        value2;
```

### never

Examples of **incorrect** code for this rule with the `"never"` option:

```js
/*eslint multiline-ternary: ["error", "never"]*/

foo > bar ? value :
    value2;

foo > bar ?
    value : value2;

foo >
    bar ?
    value1 :
    value2;
```

Examples of **correct** code for this rule with the `"never"` option:

```js
/*eslint multiline-ternary: ["error", "never"]*/

foo > bar ? value1 : value2;

foo > bar ? (baz > qux ? value1 : value2) : value3;
```

### --fix

If this rule is invoked with the command-line `--fix` option, it's recommended to define both `indent` and `operator-linebreak` if you want to have sensible results when using the `always` and `always-multiline` options.

For instance, this code:

```js
const func = () => {
    const items = hasStuff ? [
        ...stuff.items,
        ...previousStuff.items,
    ] : previousStuff.items
}
```

Is converted to:

```js
const func = () => {
    const items = hasStuff
? [
        ...stuff.items,
        ...previousStuff.items,
    ]
: previousStuff.items
}
```

But can be converted to depending on your `indent` value:

```js
const func = () => {
    const items = hasStuff
    ? [
        ...stuff.items,
        ...previousStuff.items,
    ]
    : previousStuff.items
}
```

Or even this way depending on your `operator-linebreak` value:

```js
const func = () => {
    const items = hasStuff ?
        [
            ...stuff.items,
            ...previousStuff.items,
        ] :
        previousStuff.items
}
```

The way it choses how to automatically fix depends on how your ternaries were formatted prior to running `--fix`, but with `indent` and `operator-linebreak`, you'll achieve consistent results.

## When Not To Use It

You can safely disable this rule if you do not have any strict conventions about whether the operands of a ternary expression should be separated by newlines.

## Related Rules

* [operator-linebreak](operator-linebreak.md)

## Compatibility

* **JSCS**: [requireMultiLineTernary](https://jscs-dev.github.io/rule/requireMultiLineTernary)
