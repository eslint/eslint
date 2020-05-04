# enforce or disallow capitalization of the first letter of a comment (capitalized-comments)

Comments are useful for leaving information for future developers. In order for that information to be useful and not distracting, it is sometimes desirable for comments to follow a particular style. One element of comment formatting styles is whether the first word of a comment should be capitalized or lowercase.

In general, no comment style is any more or less valid than any others, but many developers would agree that a consistent style can improve a project's maintainability.

## Rule Details

This rule aims to enforce a consistent style of comments across your codebase, specifically by either requiring or disallowing a capitalized letter as the first word character in a comment. This rule will not issue warnings when non-cased letters are used.

By default, this rule will require a non-lowercase letter at the beginning of comments.

Examples of **incorrect** code for this rule:

```js
/* eslint capitalized-comments: ["error"] */

// lowercase comment

```

Examples of **correct** code for this rule:

```js

// Capitalized comment

// 1. Non-letter at beginning of comment

// 丈 Non-Latin character at beginning of comment

/* eslint semi:off */
/* eslint-env node */
/* eslint-disable */
/* eslint-enable */
/* istanbul ignore next */
/* jscs:enable */
/* jshint asi:true */
/* global foo */
/* globals foo */
/* exported myVar */
// eslint-disable-line
// eslint-disable-next-line
// https://github.com

```

### Options

This rule has two options: a string value `"always"` or `"never"` which determines whether capitalization of the first word of a comment should be required or forbidden, and optionally an object containing more configuration parameters for the rule.

Here are the supported object options:

* `ignorePattern`: A string representing a regular expression pattern of words that should be ignored by this rule. If the first word of a comment matches the pattern, this rule will not report that comment.
    * Note that the following words are always ignored by this rule: `["jscs", "jshint", "eslint", "istanbul", "global", "globals", "exported"]`.
* `ignoreInlineComments`: If this is `true`, the rule will not report on comments in the middle of code. By default, this is `false`.
* `ignoreConsecutiveComments`: If this is `true`, the rule will not report on a comment which violates the rule, as long as the comment immediately follows another comment. By default, this is `false`.

Here is an example configuration:

```json
{
    "capitalized-comments": [
        "error",
        "always",
        {
            "ignorePattern": "pragma|ignored",
            "ignoreInlineComments": true
        }
    ]
}
```

#### `"always"`

Using the `"always"` option means that this rule will report any comments which start with a lowercase letter. This is the default configuration for this rule.

Note that configuration comments and comments which start with URLs are never reported.

Examples of **incorrect** code for this rule:

```js
/* eslint capitalized-comments: ["error", "always"] */

// lowercase comment

```

Examples of **correct** code for this rule:

```js
/* eslint capitalized-comments: ["error", "always"] */

// Capitalized comment

// 1. Non-letter at beginning of comment

// 丈 Non-Latin character at beginning of comment

/* eslint semi:off */
/* eslint-env node */
/* eslint-disable */
/* eslint-enable */
/* istanbul ignore next */
/* jscs:enable */
/* jshint asi:true */
/* global foo */
/* globals foo */
/* exported myVar */
// eslint-disable-line
// eslint-disable-next-line
// https://github.com

```

#### `"never"`

Using the `"never"` option means that this rule will report any comments which start with an uppercase letter.

Examples of **incorrect** code with the `"never"` option:

```js
/* eslint capitalized-comments: ["error", "never"] */

// Capitalized comment

```

Examples of **correct** code with the `"never"` option:

```js
/* eslint capitalized-comments: ["error", "never"] */

// lowercase comment

// 1. Non-letter at beginning of comment

// 丈 Non-Latin character at beginning of comment

```

#### `ignorePattern`

The `ignorePattern` object takes a string value, which is used as a regular expression applied to the first word of a comment.

Examples of **correct** code with the `"ignorePattern"` option set to `"pragma"`:

```js
/* eslint capitalized-comments: ["error", "always", { "ignorePattern": "pragma" }] */

function foo() {
    /* pragma wrap(true) */
}

```

#### `ignoreInlineComments`

Setting the `ignoreInlineComments` option to `true` means that comments in the middle of code (with a token on the same line as the beginning of the comment, and another token on the same line as the end of the comment) will not be reported by this rule.

Examples of **correct** code with the `"ignoreInlineComments"` option set to `true`:

```js
/* eslint capitalized-comments: ["error", "always", { "ignoreInlineComments": true }] */

function foo(/* ignored */ a) {
}

```

#### `ignoreConsecutiveComments`

If the `ignoreConsecutiveComments` option is set to `true`, then comments which otherwise violate the rule will not be reported as long as they immediately follow another comment. This can be applied more than once.

Examples of **correct** code with `ignoreConsecutiveComments` set to `true`:

```js
/* eslint capitalized-comments: ["error", "always", { "ignoreConsecutiveComments": true }] */

// This comment is valid since it has the correct capitalization.
// this comment is ignored since it follows another comment,
// and this one as well because it follows yet another comment.

/* Here is a block comment which has the correct capitalization, */
/* but this one is ignored due to being consecutive; */
/*
 * in fact, even if any of these are multi-line, that is fine too.
 */
```

Examples of **incorrect** code with `ignoreConsecutiveComments` set to `true`:

```js
/* eslint capitalized-comments: ["error", "always", { "ignoreConsecutiveComments": true }] */

// this comment is invalid, but only on this line.
// this comment does NOT get reported, since it is a consecutive comment.
```

### Using Different Options for Line and Block Comments

If you wish to have a different configuration for line comments and block comments, you can do so by using two different object configurations (note that the capitalization option will be enforced consistently for line and block comments):

```json
{
    "capitalized-comments": [
        "error",
        "always",
        {
            "line": {
                "ignorePattern": "pragma|ignored",
            },
            "block": {
                "ignoreInlineComments": true,
                "ignorePattern": "ignored"
            }
        }
    ]
}
```

Examples of **incorrect** code with different line and block comment configuration:

```js
/* eslint capitalized-comments: ["error", "always", { "block": { "ignorePattern": "blockignore" } }] */

// capitalized line comment, this is incorrect, blockignore does not help here
/* lowercased block comment, this is incorrect too */

```

Examples of **correct** code with different line and block comment configuration:

```js
/* eslint capitalized-comments: ["error", "always", { "block": { "ignorePattern": "blockignore" } }] */

// Uppercase line comment, this is correct
/* blockignore lowercase block comment, this is correct due to ignorePattern */

```

## When Not To Use It

This rule can be disabled if you do not care about the grammatical style of comments in your codebase.

## Compatibility

* **JSCS**: [requireCapitalizedComments](https://jscs-dev.github.io/rule/requireCapitalizedComments)
* **JSCS**: [disallowCapitalizedComments](https://jscs-dev.github.io/rule/disallowCapitalizedComments)
