# Disallow Reassignment of Function Parameters (no-param-reassign)

Assignment to variables declared as function parameters can be misleading and lead to confusing behavior, as modifying function parameters will also mutate the `arguments` object. Often, assignment to function parameters is unintended and indicative of a mistake or programmer error.

This rule can be also configured to fail when function parameters are modified. Side effects on parameters can cause counter-intuitive execution flow and make errors difficult to track down.

## Rule Details

This rule aims to prevent unintended behavior caused by modification or reassignment of function parameters.

Examples of **incorrect** code for this rule:

```js
/*eslint no-param-reassign: "error"*/

function foo(bar) {
    bar = 13;
}

function foo(bar) {
    bar++;
}
```

Examples of **correct** code for this rule:

```js
/*eslint no-param-reassign: "error"*/

function foo(bar) {
    var baz = bar;
}
```

## Options

This rule takes one option, an object, with a boolean property `"props"`. It is `false` by default. If it is set to `true`, this rule warns against the modification of parameter properties.

### props

Examples of **correct** code for the default `{ "props": false }` option:

```js
/*eslint no-param-reassign: ["error", { "props": false }]*/

function foo(bar) {
    bar.prop = "value";
}

function foo(bar) {
    delete bar.aaa;
}

function foo(bar) {
    bar.aaa++;
}
```

Examples of **incorrect** code for the `{ "props": true }` option:

```js
/*eslint no-param-reassign: ["error", { "props": true }]*/

function foo(bar) {
    bar.prop = "value";
}

function foo(bar) {
    delete bar.aaa;
}

function foo(bar) {
    bar.aaa++;
}
```

## When Not To Use It

If you want to allow assignment to function parameters, then you can safely disable this rule.

## Further Reading

* [JavaScript: Don’t Reassign Your Function Arguments](http://spin.atomicobject.com/2011/04/10/javascript-don-t-reassign-your-function-arguments/)
