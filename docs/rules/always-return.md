# Require a Return Statement (always-return)

Functions implicitly return `undefined` if no return statement is provided. However, this can sometimes mask errors, for example:

```js
function increment(x){
    x + 1;
}
```

This was intended to return x + 1, but instead returns undefined.

## Rule Details

This rule is aimed at ensuring all normal functions have at least one `return` or `throw` statement. Constructors and IIFEs do not need a return value.

The following patterns are considered warnings:

```js
function doSomething(x) {
    x + f(x) + g(x);
}

function doSomething(x) {
    sideEffect(x);
    anotherSideEffect(x);
}
```

The following patterns are considered okay and do not cause warnings:

```js
function doSomething(x) {
    return x + f(x) + g(x);
}

function doSomething(x) {
    sideEffect(x);
    anotherSideEffect(x);
    return;
}

function g(){
	throw new Error();
}

function Ctr(x){
	this.value = x;
}

(function (x){
    sideEffect(x);
    anotherSideEffect(x);
}(value));

```
