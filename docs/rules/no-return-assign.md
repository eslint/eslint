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

### Options

The rule takes one option, a string, which must contain one of the following values:

* `except-parens` (default): Disallow assignments unless they are enclosed in parentheses.
* `always`: Disallow all assignments.

#### "except-parens"

This is the default option.
It disallows assignments unless they are enclosed in parentheses.

The following patterns are considered problems:

```js
/*eslint no-return-assign: 2*/

function doSomething() {
    return foo = bar + 2; /*error Return statement should not contain assignment.*/
}

function doSomething() {
    return foo += 2;      /*error Return statement should not contain assignment.*/
}
```

The following patterns are not considered problems:

```js
/*eslint no-return-assign: 2*/

function doSomething() {
    return foo == bar + 2;
}

function doSomething() {
    return foo === bar + 2;
}

function doSomething() {
    return (foo = bar + 2);
}
```

#### "always"

This option disallows all assignments in `return` statements.
All assignments are treated as problems.

The following patterns are considered problems:

```js
/*eslint no-return-assign: [2, "always"]*/

function doSomething() {
    return foo = bar + 2;   /*error Return statement should not contain assignment.*/
}

function doSomething() {
    return foo += 2;        /*error Return statement should not contain assignment.*/
}

function doSomething() {
    return (foo = bar + 2); /*error Return statement should not contain assignment.*/
}
```

The following patterns are not considered problems:

```js
/*eslint no-return-assign: [2, "always"]*/

function doSomething() {
    return foo == bar + 2;
}

function doSomething() {
    return foo === bar + 2;
}
```

## When Not To Use It

If you want to allow the use of assignment operators in a `return` statement, then you can safely disable this rule.
