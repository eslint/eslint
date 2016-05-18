# require `return` statements to either always or never specify values (consistent-return)

Unlike statically-typed languages which enforce that a function returns a specified type of value, JavaScript allows different code paths in a function to return different types of values.

A confusing aspect of JavaScript is that a function returns `undefined` if any of the following are true:

* it does not execute a `return` statement before it exits
* it executes `return` which does not specify a value explicitly
* it executes `return undefined`
* it executes `return void` followed by an expression (for example, a function call)
* it executes `return` followed by any other expression which evaluates to `undefined`

If any code paths in a function return a value explicitly but some code path do not return a value explicitly, it might be a typing mistake, especially in a large function. In the following example:

* a code path through the function returns a Boolean value `true`
* another code path does not return a value explicitly, therefore returns `undefined` implicitly

```js
function doSomething(condition) {
    if (condition) {
        return true;
    } else {
        return;
    }
}
```

## Rule Details

This rule requires `return` statements to either always or never specify values. This rule ignores function definitions where the name begins with an uppercase letter, because constructors (when invoked with the `new` operator) return the instantiated object implicitly if they do not return another object explicitly.

Examples of **incorrect** code for this rule:

```js
/*eslint consistent-return: "error"*/

function doSomething(condition) {
    if (condition) {
        return true;
    } else {
        return;
    }
}

function doSomething(condition) {
    if (condition) {
        return true;
    }
}
```

Examples of **correct** code for this rule:

```js
/*eslint consistent-return: "error"*/

function doSomething(condition) {
    if (condition) {
        return true;
    } else {
        return false;
    }
}

function Foo() {
    if (!(this instanceof Foo)) {
        return new Foo();
    }

    this.a = 0;
}
```

## Options

This rule has an object option:

* `"treatUndefinedAsUnspecified": false` (default) always either specify values or return `undefined` implicitly only.
* `"treatUndefinedAsUnspecified": true` always either specify values or return `undefined` explicitly or implicitly.

### treatUndefinedAsUnspecified

Examples of **incorrect** code for this rule with the default `{ "treatUndefinedAsUnspecified": false }` option:

```js
/*eslint consistent-return: ["error", { "treatUndefinedAsUnspecified": false }]*/

function foo(callback) {
    if (callback) {
        return void callback();
    }
    // no return statement
}

function bar(condition) {
    if (condition) {
        return undefined;
    }
    // no return statement
}
```

Examples of **incorrect** code for this rule with the `{ "treatUndefinedAsUnspecified": true }` option:

```js
/*eslint consistent-return: ["error", { "treatUndefinedAsUnspecified": true }]*/

function foo(callback) {
    if (callback) {
        return void callback();
    }
    return true;
}

function bar(condition) {
    if (condition) {
        return undefined;
    }
    return true;
}
```

Examples of **correct** code for this rule with the `{ "treatUndefinedAsUnspecified": true }` option:

```js
/*eslint consistent-return: ["error", { "treatUndefinedAsUnspecified": true }]*/

function foo(callback) {
    if (callback) {
        return void callback();
    }
    // no return statement
}

function bar(condition) {
    if (condition) {
        return undefined;
    }
    // no return statement
}
```

## When Not To Use It

If you want to allow functions to have different `return` behavior depending on code branching, then it is safe to disable this rule.
