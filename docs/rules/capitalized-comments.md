# enforce or disallow capitalization of the first letter of a comment (capitalized-comments)

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

```

### Options

This rule has one option: either a string value `"always"` or `"never"` for simple configuration, or an object containing all possible configuration parameters for the rule.

#### `"always"`

Using the `"always"` option means that this rule will report any comments which start with a lowercase letter. This is the default configuration for this rule.

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

#### Other Options

If you want finer control of this rule, you must supply an options object in your configuration file.

Here are the supported options:

* `capitalize`: This represents whether comments are expected to start with a capitalized letter. Available values are `"always"` and `"never"`, with the default being `"always"`. (The string-only options correspond to this option object property.)
* `ignoreWords`: An array of words which should be ignored by this rule. If the first word of a comment matches one of these words exactly, this rule will not report that comment. The following words are always ignored by this rule: `["jscs", "jshint", "eslint", "istanbul"]`.
* `ignoreInlineComments`: If this is `true`, the rule will not report on comments in the middle of code. By default, this is `false`.
* `overrides`: An object allowing each of the previous options to be overridden at the `line` or `block` comment level.

Here is an example object-based configuration:

```json
{
    "capitalized-comments": [
        "error",
        {
            "capitalize": "always",
            "ignoreWords": ["pragma"],
            "ignoreInlineComments": true,
            "overrides": {
                "line": {
                    "capitalize": "never",
                    "ignoreWords": ["TODO", "FIXME"]
                }
            }
        }
    ]
}
```

Examples of **correct** code with the `"ignoreWords"` option set to `["pragma"]:

```js
/* eslint capitalized-comments: ["error", { "capitalize": "always", "ignoreWords": ["pragma"] }]

function foo() {
    /* pragma wrap(true) */
}

```

Examples of **correct** code with the `"ignoreInlineComments"` option set to `true`:

```js
/* eslint capitalized-comments: ["error", { "capitalize": "always", "ignoreInlineComments": true }]

function foo(/* ignored */ a) {
}

```

Examples of **incorrect** code with a line-comment override to require lowercase comments:

```js
/* eslint capitalized-comments: ["error", { "capitalize": "always", "overrides": { "line": { "capitalize": "never" } } }]

// Capitalized line comment, this is incorrect
/* lowercased block comment, this is incorrect too */

```

Examples of **correct** code with a line-comment override to require lowercase comments:

```js
/* eslint capitalized-comments: ["error", { "capitalize": "always", "overrides": { "line": { "capitalize": "never" } } }]

// lowercased line comment, this is correct
/* Capitalized block comment, this is correct too */

```

## When Not To Use It

This rule can be disabled if you do not care about the grammatical style of comments in your codebase.
