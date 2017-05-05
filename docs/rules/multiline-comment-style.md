# enforce a particular style for multiline comments (multiline-comment-style)

Many style guides require a particular style for comments that span multiple lines. For example, some style guides prefer the use of a single block comment for multiline comments, whereas other style guides prefer consecutive line comments.

## Rule Details

This rule aims to enforce a particular style for multiline comments.

### Options

This rule has a string option, which can have one of the following values:

* `"starred-block"` (default): Disallows consecutive line comments in favor of block comments. Additionally, requires block comments to have an aligned `*` character before each line.
* `"bare-block"`: Disallows consecutive line comments in favor of block comments, and disallows block comments from having a `"*"` character before each line.
* `"separate-lines"`: Disallows block comments in favor of consecutive line comments

The rule always ignores directive comments such as `/* eslint-disable */`. Additionally, unless the mode is `"starred-block"`, the rule ignores JSDoc comments.

TODO: Add examples

Examples of **incorrect** code for this rule:

```js

// fill me in

```

Examples of **correct** code for this rule:

```js

// fill me in

```

## When Not To Use It

Give a short description of when it would be appropriate to turn off this rule.

## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.
