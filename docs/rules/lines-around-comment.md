# Enforce empty lines around comments (lines-around-comment)

Many style guides require empty lines before or after comments. The primary goal
of these rules is to make the comments easier to read and improve readability of the code.

## Rule Details

This rule allows you to specify whether an empty line should be found
before or after a comment. It can be enabled separately for both block (`/*`)
and line (`//`) comments, and does not apply to comments that appear on the same
line as code.


By default an empty line is required above a block comment,
such as in the following example:

```js
var x = 0;

/**
 * The vertical position.
 */
var y = 10;
```

The following would *not* pass the rule:

```js
var x = 0;
/* the vertical position */
var y = 10;
```

### Options

This rule has 6 options:

1. `beforeBlockComment` (enabled by default)
2. `afterBlockComment`
3. `beforeLineComment`
4. `afterLineComment`
5. `allowBlockStart`
6. `allowBlockEnd`

Any combination of these rules may be applied at the same time.


```json
{
    "lines-around-comment": [2, { "beforeBlockComment": true, "beforeLineComment": true }]
}
```

When set to `false` the option is simply ignored.


#### Block Comments

Block comments are any comment that start with `/*` and need not extend to multiple lines.

With both `beforeBlockComment` and `afterBlockComment` set to `true` the following code
would not warn:

```js
var night = "long";

/* what a great and wonderful day */

var day = "great"
```

This however would provide 2 warnings:

```js
var night = "long";
/* what a great and wonderful day */
var day = "great"
```

With only `beforeBlockComment` set to `true` the following code
would not warn:

```js
var night = "long";

/* what a great and wonderful day */
var day = "great"
```

But this would cause 1 warning:

```js
var night = "long";
/* what a great and wonderful day */
var day = "great"
```

#### Line Comments

Line comments are any comments that start with `//`.

With both `beforeLineComment` and `afterLineComment` set to `true` the following code
would not warn:

```js
var night = "long";

// what a great and wonderful day

var day = "great"
```

With only `beforeLineComment` set to `true` the following code
would not warn:

```js
var night = "long";

// what a great and wonderful day
var day = "great"
```

### Exceptions

#### `allowBlockStart` option

When this option is set to `true`, it allows the comment to be present at the start of any block statement without any space above it. This option can be useful when combined with options `beforeLineComment` and `beforeBlockComment` only.

With both `beforeLineComment` and `allowBlockStart` set to `true` the following code
would not warn:

```js
function foo(){
    // what a great and wonderful day
    var day = "great"
    return day;
}
```

With both `beforeBlockComment` and `allowBlockStart` set to `true` the following code
would not warn:

```js
function foo(){
    /* what a great and wonderful day */
    var day = "great"
    return day;
}
```

#### `allowBlockEnd` option

When this option is set to `true`, it allows the comment to be present at the end of any block statement without any space below it. This option can be useful when combined with options `afterLineComment` and `afterBlockComment` only.

With both `afterLineComment` and `allowBlockEnd` set to `true` the following code
would not warn:

```js
function foo(){
    var day = "great"
    return day;
    // what a great and wonderful day
}
```

With both `afterBlockComment` and `allowBlockEnd` set to `true` the following code
would not warn:

```js
function foo(){
    var day = "great"
    return day;
    /* what a great and wonderful day */
}
```


#### Inline comments

Inline comments are always excluded from the rule.

The following would be acceptable:

```js
var x = 0;
var y = 10; /* the vertical position */
```

Empty lines are also not required at the beginning or end of a file.

## When Not To Use It

Many people enjoy a terser code style and don't mind comments bumping up against code. If you
fall into that category this rule is not for you.

## Related Rules

* [space-before-blocks](space-before-blocks.md)
* [spaced-comment](spaced-comment.md)
* [spaced-line-comment](spaced-line-comment.md) (deprecated)
