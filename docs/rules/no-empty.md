# Disallow Empty Block Statements (no-empty)

Empty block statements usually occur due to refactoring that wasn't completed, such as:

```js
if (foo) {
}
```

Empty block statements such as this are usually an indicator of an error, or at the very least, an indicator that some refactoring is likely needed.

## Rule Details

This rule is aimed at eliminating empty block statements. While not technically an error, empty block statements can be a source of confusion when reading code.
A block will not be considered a warning if it contains a comment line.

The following patterns are considered problems:

```js
/*eslint no-empty: 2*/

if (foo) {         /*error Empty block statement.*/
}

while (foo) {      /*error Empty block statement.*/
}

switch(foo) {      /*error Empty switch statement.*/
}

try {
    doSomething();
} catch(ex) {      /*error Empty block statement.*/

} finally {        /*error Empty block statement.*/

}
```

The following patterns are not considered problems:

```js
/*eslint no-empty: 2*/

if (foo) {
    // empty
}

while (foo) {
    // test
}

try {
    doSomething();
} catch (ex) {
    // Do nothing
}

try {
    doSomething();
} finally {
    // Do nothing
}
```

Since you must always have at least a `catch` or a `finally` block for any `try`, it is common to have empty block statements when execution should continue regardless of error.

### Options

```json
{
    "no-empty": [2, {"arrowFunctions": false, "methods": false}]
}
```

This rule has 2 options:

* `arrowFunctions` (`boolean`) - If `true`, this rule will warn for empty arrow functions. This option is set to `false` by default.
* `methods` (`boolean`) - If `true`, this rule will warn for empty methods. This option is set to `false` by default.

The following pattern is considered a problem when `arrowFunctions` is set to `true`:

```js
/*eslint no-empty: [2, { arrowFunctions: true }]*/

// Note: this is a block, not an empty object.
var foo = () => {}  /*error Empty block statement.*/
```

The following pattern is not considered a problem when `arrowFunctions` is set to `true`:

```js
/*eslint no-empty: [2, { arrowFunctions: true }]*/

const foo = () => {
    console.log("this is not empty.");
};

// this is an empty object literal.
const foo = () => ({});

// there is an clear comment.
const foo = () => {
    // do nohting.
};
```

The following pattern is considered a problem when `methods` is set to `true`:

```js
/*eslint no-empty: [2, { methods: true }]*/

var foo = {
    bar() {}              /*error Empty block statement.*/
}
```

The following pattern is not considered a problem when `methods` is set to `true`:

```js
/*eslint no-empty: [2, { methods: true }]*/

var foo = {
    bar() {
        console.log('baz');
    }
}
```

## When Not To Use It

If you intentionally use empty block statements then you can disable this rule.
