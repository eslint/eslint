# enforce padding blank lines around blocks (padded-multilines)

Some style guides require blank lines around a multilines expression,
to improve readability by codes squeezing together. For example the blank
lines around the while expression.

```js
function test(a) {
    let return = [];

    while ( a > 0 ) {
        // Do something here
        // ...
    }

    return result
}
```

To avoid the conflict with `padded-block` rule, this rule will not enforce blank line
when the multilines expression is preceded by a block start or followed by a block end.

## Rule Details

This rule enforces blank lines around multilines blocks.

## Options

This rule has one option, which can be an arrray of string containing `"comment"` and `"return"`

Array option:

* `"comment"`: When `"comment"` exists in the options, comments can exists between a blank line (or block start line) and the multilines expression
* `"return"` : When `"return"` exists in the options, return can exists as the next line of a multilines expression


### always

Examples of **incorrect** code for this rule with the default `[]` option:

```js
/*eslint padded-multilines: ["error", []] */
function test(a) {
    let return = [];
    while ( a > 0 ) {
        // Do something here
        // ...
    }
    return result
}
```

Examples of **correct** code for this rule with the default `[]` option:

```js
function testA(a) {
    while ( a > 0 ) {
        // Do something here
        // ...
    }
}

function testB(a) {
    let return = [];

    while ( a > 0 ) {
        // Do something here
        // ...
    }

    return result
}
```

### comment

Examples of **incorrect** code for this rule with the `["comment"]` option:

```js
/*eslint padded-blocks: ["error", ["comment"]]*/
function testA(a) {
    let return = [];
    // Line 1
    // Line 2
    while ( a > 0 ) {
        // Do something here
        // ...
    }

    return result
}

function testB(a) {
    let return = [];

    while ( a > 0 ) {
        // Do something here
        // ...
    }
    // Line 1
    // Line 2
    return result
}
```

Examples of **correct** code for this rule with the `["comment"]` option:

```js
/*eslint padded-blocks: ["error", ["comment"]]*/
function testA(a) {
    // Line 1
    // Line 2
    while ( a > 0 ) {
        // Do something here
        // ...
    }
}

function testB(a) {
    let return = [];

    // Line 1
    // Line 2
    while ( a > 0 ) {
        // Do something here
        // ...
    }

    return result
}
```

### return

Examples of **incorrect** code for this rule with the `["return"]` option:

```js
/*eslint padded-blocks: ["error", ["return"]]*/
function test(a) {
    let return = [];

    while ( a > 0 ) {
        // Do something here
        // ...
    }
    // Line 1
    // Line 2
    return result
}
```

```js
/*eslint padded-blocks: ["error", ["return"]]*/
function testA(a) {
    while ( a > 0 ) {
        // Do something here
        // ...
    }
    return null;
}

function testB(a) {
    let return = [];

    while ( a > 0 ) {
        // Do something here
        // ...
    }
    return result
}
```

### comment and return

Examples of **correct** code for this rule with the `["comment", "return"]` option:

```js
/*eslint padded-blocks: ["error", ["comment", "return"]]*/
function testA(a) {
    // Line 1
    // Line 2
    while ( a > 0 ) {
        // Do something here
        // ...
    }
    return null;
}

function testB(a) {
    let return = [];

    // Line 1
    // Line 2
    while ( a > 0 ) {
        // Do something here
        // ...
    }
    return result
}
```

## When Not To Use It

You can turn this rule off if you are not concerned with the blank lines around multilines expressions.

## Related Rules

* [lines-between-class-members](lines-between-class-members.md)
* [padded-blocks](padded-blocks.md)
* [padding-line-between-statements](padding-line-between-statements.md)

