# enforce or disallow capitalization of the first letter of a comment (capitalized-comments)

The purpose of this rule is to enforce consistent casing of the first word of every comment in your codebase.

This rule was ported from JSCS' [requireCapitalizedComments](http://jscs.info/rule/requireCapitalizedComments) and [disallowCapitalizedComments](http://jscs.info/rule/disallowCapitalizedComments) rules.


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

This rule has one option: either a string value `"always"` or `"never"` for simple configuration, or an object containing all possible configuration parameters for the rule.

If you want finer control of this rule, you must supply an options object in your configuration file.

Here are the supported options:

* `capitalize`: This represents whether comments are expected to start with a capitalized letter. Available values are `"always"` and `"never"`, with the default being `"always"`. (The string-only options correspond to this option object property.)
* `ignorePattern`: A string representing a regular expression pattern of words that should be ignored by this rule. If the first word of a comment matches the pattern, this rule will not report that comment.
    * Note that the following words are always ignored by this rule: `["jscs", "jshint", "eslint", "istanbul", "global", "globals", "exported"]`.
* `ignoreInlineComments`: If this is `true`, the rule will not report on comments in the middle of code. By default, this is `false`.
* `ignoreConsecutiveComments`: If this is `true`, the rule will not report on a comment which violates the rule, as long as the comment immediately follows a comment which is also not reported. By default, this is `false`.

Here is an example object-based configuration:

```json
{
    "capitalized-comments": [
        "error",
        {
            "capitalize": "always",
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

Examples of **correct** code with the `"ignorePattern"` option set to `"pragma":

```js
/* eslint capitalized-comments: ["error", { "capitalize": "always", "ignorePattern": "pragma" }]

function foo() {
    /* pragma wrap(true) */
}

```

#### `ignoreInlineComments`

Setting the `ignoreInlineComments` option to `true` means that comments in the middle of code (with a token on the same line as the beginning of the comment, and another token on the same line as the end of the comment) will not be reported by this rule.

Examples of **correct** code with the `"ignoreInlineComments"` option set to `true`:

```js
/* eslint capitalized-comments: ["error", { "capitalize": "always", "ignoreInlineComments": true }] */

function foo(/* ignored */ a) {
}

```

#### `ignoreConsecutiveComments`

If the `ignoreConsecutiveComments` option is set to `true`, then comments which otherwise violate the rule will not be reported as long as they immediately follow a comment which did not violate the rule. This can be applied more than once.

Examples of **correct** code with `ignoreConsecutiveComments` set to `true`:

```js
/* eslint capitalize-comments: ["error", { "capitalize": "always", "ignoreConsecutiveComments": true }] */

// This comment is valid since it has the correct capitalization,
// and so is this one because it immediately follows a valid comment,
// and this one as well because it follows the previous valid comment.

/* Here is a block comment which has the correct capitalization, */
/* and this one is valid as well; */
/*
 * in fact, even if any of these are multi-line, that is fine too.
 */
```

### Using Different Options for Line and Block Comments

If you wish to have a different configuration for line comments and block comments, you can do so by using two different object configurations:

```json
{
    "capitalized-comments": [
        "error",
        {
            "line": {
                "capitalize": "always",
                "ignorePattern": "pragma|ignored",
                "ignoreInlineComments": true,
            },
            "block": {
                "capitalize": "never"
            }
        }
    ]
}
```

Examples of **incorrect** code with different line and block comment configuration:

```js
/* eslint capitalized-comments: ["error", { "block": { "capitalize": "always" }, "line": { "capitalize": "never" } }]

// Capitalized line comment, this is incorrect
/* lowercased block comment, this is incorrect too */

```

Examples of **incorrect** code with different line and block comment configuration:

```js
/* eslint capitalized-comments: ["error", { "block": { "capitalize": "always" }, "line": { "capitalize": "never" } }] */

// lowercased line comment, this is correct
/* Capitalized block comment, this is correct too */

```

## When Not To Use It

This rule can be disabled if you do not care about the grammatical style of comments in your codebase.

## Compatibility

* **JSCS**: [requireCapitalizedComments](http://jscs.info/rule/requireCapitalizedComments) and [disallowCapitalizedComments](http://jscs.info/rule/disallowCapitalizedComments)
