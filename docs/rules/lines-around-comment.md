# require empty lines around comments (lines-around-comment)

Many style guides require empty lines before or after comments. The primary goal
of these rules is to make the comments easier to read and improve readability of the code.

## Rule Details

This rule requires empty lines before and/or after comments. It can be enabled separately for both block (`/*`) and line (`//`) comments. This rule does not apply to comments that appear on the same line as code and does not require empty lines at the beginning or end of a file.

## Options

This rule has an object option:

* `"beforeBlockComment": true` (default) requires an empty line before block comments
* `"afterBlockComment": true` requires an empty line after block comments
* `"beforeLineComment": true` requires an empty line before line comments
* `"afterLineComment": true` requires an empty line after line comments
* `"allowBlockStart": true` allows comments to appear at the start of block statements
* `"allowBlockEnd": true` allows comments to appear at the end of block statements
* `"allowObjectStart": true` allows comments to appear at the start of object literals
* `"allowObjectEnd": true` allows comments to appear at the end of object literals
* `"allowArrayStart": true` allows comments to appear at the start of array literals
* `"allowArrayEnd": true` allows comments to appear at the end of array literals
* `"allowClassStart": true` allows comments to appear at the start of classes
* `"allowClassEnd": true` allows comments to appear at the end of classes
* `"applyDefaultIgnorePatterns"` enables or disables the default comment patterns to be ignored by the rule
* `"ignorePattern"` custom patterns to be ignored by the rule


### beforeBlockComment

Examples of **incorrect** code for this rule with the default `{ "beforeBlockComment": true }` option:

```js
/*eslint lines-around-comment: ["error", { "beforeBlockComment": true }]*/

var night = "long";
/* what a great and wonderful day */
var day = "great"
```

Examples of **correct** code for this rule with the default `{ "beforeBlockComment": true }` option:

```js
/*eslint lines-around-comment: ["error", { "beforeBlockComment": true }]*/

var night = "long";

/* what a great and wonderful day */
var day = "great"
```

### afterBlockComment

Examples of **incorrect** code for this rule with the `{ "afterBlockComment": true }` option:

```js
/*eslint lines-around-comment: ["error", { "afterBlockComment": true }]*/

var night = "long";

/* what a great and wonderful day */
var day = "great"
```

Examples of **correct** code for this rule with the `{ "afterBlockComment": true }` option:

```js
/*eslint lines-around-comment: ["error", { "afterBlockComment": true }]*/

var night = "long";

/* what a great and wonderful day */

var day = "great"
```

### beforeLineComment

Examples of **incorrect** code for this rule with the `{ "beforeLineComment": true }` option:

```js
/*eslint lines-around-comment: ["error", { "beforeLineComment": true }]*/

var night = "long";
// what a great and wonderful day
var day = "great"
```

Examples of **correct** code for this rule with the `{ "beforeLineComment": true }` option:

```js
/*eslint lines-around-comment: ["error", { "beforeLineComment": true }]*/

var night = "long";

// what a great and wonderful day
var day = "great"
```

### afterLineComment

Examples of **incorrect** code for this rule with the `{ "afterLineComment": true }` option:

```js
/*eslint lines-around-comment: ["error", { "afterLineComment": true }]*/

var night = "long";
// what a great and wonderful day
var day = "great"
```

Examples of **correct** code for this rule with the `{ "afterLineComment": true }` option:

```js
/*eslint lines-around-comment: ["error", { "afterLineComment": true }]*/

var night = "long";
// what a great and wonderful day

var day = "great"
```

### allowBlockStart

Examples of **correct** code for this rule with the `{ "beforeLineComment": true, "allowBlockStart": true }` options:

```js
/*eslint lines-around-comment: ["error", { "beforeLineComment": true, "allowBlockStart": true }]*/

function foo(){
    // what a great and wonderful day
    var day = "great"
    return day;
}
```

Examples of **correct** code for this rule with the `{ "beforeBlockComment": true, "allowBlockStart": true }` options:

```js
/*eslint lines-around-comment: ["error", { "beforeBlockComment": true, "allowBlockStart": true }]*/

function foo(){
    /* what a great and wonderful day */
    var day = "great"
    return day;
}
```

### allowBlockEnd

Examples of **correct** code for this rule with the `{ "afterLineComment": true, "allowBlockEnd": true }` option:

```js
/*eslint lines-around-comment: ["error", { "afterLineComment": true, "allowBlockEnd": true }]*/

function foo(){
    var day = "great"
    return day;
    // what a great and wonderful day
}
```

Examples of **correct** code for this rule with the `{ "afterBlockComment": true, "allowBlockEnd": true }` option:

```js
/*eslint lines-around-comment: ["error", { "afterBlockComment": true, "allowBlockEnd": true }]*/

function foo(){
    var day = "great"
    return day;

    /* what a great and wonderful day */
}
```

### allowClassStart

Examples of **incorrect** code for this rule with the `{ "beforeLineComment": true, "allowClassStart": false }` option:

```js
/*eslint lines-around-comment: ["error", { "beforeLineComment": true, "allowClassStart": false }]*/

class foo {
    // what a great and wonderful day
    day() {}
};
```

Examples of **correct** code for this rule with the `{ "beforeLineComment": true, "allowClassStart": false }` option:

```js
/*eslint lines-around-comment: ["error", { "beforeLineComment": true, "allowClassStart": false }]*/

class foo {

    // what a great and wonderful day
    day() {}
};
```

Examples of **correct** code for this rule with the `{ "beforeLineComment": true, "allowClassStart": true }` option:

```js
/*eslint lines-around-comment: ["error", { "beforeLineComment": true, "allowClassStart": true }]*/

class foo {
    // what a great and wonderful day
    day() {}
};
```

Examples of **incorrect** code for this rule with the `{ "beforeBlockComment": true, "allowClassStart": false }` option:

```js
/*eslint lines-around-comment: ["error", { "beforeBlockComment": true, "allowClassStart": false }]*/

class foo {
    /* what a great and wonderful day */
    day() {}
};
```

Examples of **correct** code for this rule with the `{ "beforeBlockComment": true, "allowClassStart": false }` option:

```js
/*eslint lines-around-comment: ["error", { "beforeBlockComment": true, "allowClassStart": false }]*/

class foo {

    /* what a great and wonderful day */
    day() {}
};
```

Examples of **correct** code for this rule with the `{ "beforeBlockComment": true, "allowClassStart": true }` option:

```js
/*eslint lines-around-comment: ["error", { "beforeBlockComment": true, "allowClassStart": true }]*/

class foo {
    /* what a great and wonderful day */
    day() {}
};
```

### allowClassEnd

Examples of **correct** code for this rule with the `{ "afterLineComment": true, "allowClassEnd": true }` option:

```js
/*eslint lines-around-comment: ["error", { "afterLineComment": true, "allowClassEnd": true }]*/

class foo {
    day() {}
    // what a great and wonderful day
};
```

Examples of **correct** code for this rule with the `{ "afterBlockComment": true, "allowClassEnd": true }` option:

```js
/*eslint lines-around-comment: ["error", { "afterBlockComment": true, "allowClassEnd": true }]*/

class foo {
    day() {}

    /* what a great and wonderful day */
};
```

### allowObjectStart

Examples of **correct** code for this rule with the `{ "beforeLineComment": true, "allowObjectStart": true }` option:

```js
/*eslint lines-around-comment: ["error", { "beforeLineComment": true, "allowObjectStart": true }]*/

var foo = {
    // what a great and wonderful day
    day: "great"
};

const {
    // what a great and wonderful day
    foo: someDay
} = {foo: "great"};

const {
    // what a great and wonderful day
    day
} = {day: "great"};
```

Examples of **correct** code for this rule with the `{ "beforeBlockComment": true, "allowObjectStart": true }` option:

```js
/*eslint lines-around-comment: ["error", { "beforeBlockComment": true, "allowObjectStart": true }]*/

var foo = {
    /* what a great and wonderful day */
    day: "great"
};

const {
    /* what a great and wonderful day */
    foo: someDay
} = {foo: "great"};

const {
    /* what a great and wonderful day */
    day
} = {day: "great"};
```

### allowObjectEnd

Examples of **correct** code for this rule with the `{ "afterLineComment": true, "allowObjectEnd": true }` option:

```js
/*eslint lines-around-comment: ["error", { "afterLineComment": true, "allowObjectEnd": true }]*/

var foo = {
    day: "great"
    // what a great and wonderful day
};

const {
    foo: someDay
    // what a great and wonderful day
} = {foo: "great"};

const {
    day
    // what a great and wonderful day
} = {day: "great"};
```

Examples of **correct** code for this rule with the `{ "afterBlockComment": true, "allowObjectEnd": true }` option:

```js
/*eslint lines-around-comment: ["error", { "afterBlockComment": true, "allowObjectEnd": true }]*/

var foo = {
    day: "great"

    /* what a great and wonderful day */
};

const {
    foo: someDay

    /* what a great and wonderful day */
} = {foo: "great"};

const {
    day

    /* what a great and wonderful day */
} = {day: "great"};
```

### allowArrayStart

Examples of **correct** code for this rule with the `{ "beforeLineComment": true, "allowArrayStart": true }` option:

```js
/*eslint lines-around-comment: ["error", { "beforeLineComment": true, "allowArrayStart": true }]*/

var day = [
    // what a great and wonderful day
    "great",
    "wonderful"
];

const [
    // what a great and wonderful day
    someDay
] = ["great", "not great"];
```

Examples of **correct** code for this rule with the `{ "beforeBlockComment": true, "allowArrayStart": true }` option:

```js
/*eslint lines-around-comment: ["error", { "beforeBlockComment": true, "allowArrayStart": true }]*/

var day = [
    /* what a great and wonderful day */
    "great",
    "wonderful"
];

const [
    /* what a great and wonderful day */
    someDay
] = ["great", "not great"];
```

### allowArrayEnd

Examples of **correct** code for this rule with the `{ "afterLineComment": true, "allowArrayEnd": true }` option:

```js
/*eslint lines-around-comment: ["error", { "afterLineComment": true, "allowArrayEnd": true }]*/

var day = [
    "great",
    "wonderful"
    // what a great and wonderful day
];

const [
    someDay
    // what a great and wonderful day
] = ["great", "not great"];
```

Examples of **correct** code for this rule with the `{ "afterBlockComment": true, "allowArrayEnd": true }` option:

```js
/*eslint lines-around-comment: ["error", { "afterBlockComment": true, "allowArrayEnd": true }]*/

var day = [
    "great",
    "wonderful"

    /* what a great and wonderful day */
];

const [
    someDay

    /* what a great and wonderful day */
] = ["great", "not great"];
```


### ignorePattern

By default this rule ignores comments starting with the following words: `eslint`, `jshint`, `jslint`, `istanbul`, `global`, `exported`, `jscs`. An alternative regular expression can be provided.

Examples of **correct** code for the `ignorePattern` option:

```js
/*eslint lines-around-comment: ["error"]*/

foo();
/* eslint mentioned in this comment */,
bar();


/*eslint lines-around-comment: ["error", { "ignorePattern": "pragma" }] */

foo();
/* a valid comment using pragma in it */
```

Examples of **incorrect** code for the `ignorePattern` option:

```js
/*eslint lines-around-comment: ["error", { "ignorePattern": "pragma" }] */

1 + 1;
/* something else */
```

### applyDefaultIgnorePatterns

Default ignore patterns are applied even when `ignorePattern` is provided. If you want to omit default patterns, set this option to `false`.

Examples of **correct** code for the `{ "applyDefaultIgnorePatterns": false }` option:

```js
/*eslint lines-around-comment: ["error", { "ignorePattern": "pragma", applyDefaultIgnorePatterns: false }] */

foo();
/* a valid comment using pragma in it */
```

Examples of **incorrect** code for the `{ "applyDefaultIgnorePatterns": false }` option:

```js
/*eslint lines-around-comment: ["error", { "applyDefaultIgnorePatterns": false }] */

foo();
/* eslint mentioned in comment */

```


## When Not To Use It

Many people enjoy a terser code style and don't mind comments bumping up against code. If you fall into that category this rule is not for you.

## Related Rules

* [space-before-blocks](space-before-blocks.md)
* [spaced-comment](spaced-comment.md)
