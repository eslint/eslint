# Disallow Assignment in return Statement (no-return-assign)

One of the interesting, and sometimes confusing, aspects of JavaScript is that assignment can happen at almost any point. Because of this, an errant equals sign can end up causing assignment when the true intent was to do a comparison. This is especially true when using a `return` statement. For example:

```js
function doSomething() {
    return foo = bar + 2;
}
```

It is difficult to tell the intent of the `return` statement here. It's possible that the function is meant to return the result of `bar + 2`, but then why is it assigning to `foo`? It's also possible that the intent was to use a comparison operator such as `==` and that this code is an error.

Because of this ambiguity, it's considered a best practice to not use assignment in `return` statements.

## Rule Details

This rule aims to eliminate assignments from `return` statements. As such, it will warn whenever an assignment is found as part of `return`.

## Options

This rule has a string option:

* `except-parens` (default): Disallow assignments unless they are enclosed in parentheses.
* `always`: Disallow all assignments.

This rule also accepts an additional object option:

* `ignoreSideEffects: true` Ignores assignments in side effect positions of sequence expressions; defaults to false

### except-parens

This is the default option.
It disallows assignments unless they are enclosed in parentheses.

Examples of **incorrect** code for the default `"except-parens"` option:

```js
/*eslint no-return-assign: "error"*/

function doSomething() {
    return foo = bar + 2;
}

function doSomething() {
    return foo += 2;
}

const foo = (a, b) => a = b

const bar = (a, b, c) => (a = b, c == b)

function doSomething() {
    return foo = bar && foo > 0;
}

function doSomething() {
    return (foo = 2, bar);
}
```

Examples of **correct** code for the default `"except-parens"` option:

```js
/*eslint no-return-assign: "error"*/

function doSomething() {
    return foo == bar + 2;
}

function doSomething() {
    return foo === bar + 2;
}

function doSomething() {
    return (foo = bar + 2);
}

const foo = (a, b) => (a = b)

const bar = (a, b, c) => ((a = b), c == b)

function doSomething() {
    return (foo = bar) && foo > 0;
}

function doSomething() {
    return ((foo = 2), bar);
}
```

### always

This option disallows all assignments in `return` statements.
All assignments are treated as problems.

Examples of **incorrect** code for the `"always"` option:

```js
/*eslint no-return-assign: ["error", "always"]*/

function doSomething() {
    return foo = bar + 2;
}

function doSomething() {
    return foo += 2;
}

function doSomething() {
    return (foo = bar + 2);
}

function doSomething() {
    return ((foo = 2), bar);
}
```

Examples of **correct** code for the `"always"` option:

```js
/*eslint no-return-assign: ["error", "always"]*/

function doSomething() {
    return foo == bar + 2;
}

function doSomething() {
    return foo === bar + 2;
}
```

### ignoreSideEffects

Examples of **incorrect** code with sample `"always", {"ignoreSideEffects": true}` options:

```js
/*eslint no-return-assign: ["error", "always", { "ignoreSideEffects": true }]*/

const bar = (a, b, c) => (a, b = c)

function doSomething() {
    return (foo, bar = 2);
}
```

Examples of **correct** code with sample `"always", {"ignoreSideEffects": true}` options:

```js
/*eslint no-return-assign: ["error", "always", { "ignoreSideEffects": true }]*/

const bar = (a, b, c) => (a = b, c)

function doSomething() {
    return (foo = 2, bar);
}
```


## When Not To Use It

If you want to allow the use of assignment operators in a `return` statement, then you can safely disable this rule.
