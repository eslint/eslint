# require using Error objects as Promise rejection reasons (prefer-promise-reject-errors)

It is considered good practice to only pass instances of the built-in `Error` object to the `reject()` function for user-defined errors in Promises. `Error` objects automatically store a stack trace, which can be used to debug an error by determining where it came from. If a Promise is rejected with a non-`Error` value, it can be difficult to determine where the rejection occurred.


## Rule Details

This rule aims to ensure that Promises are only rejected with `Error` objects.

## Options

This rule takes one optional object argument:

* `allowEmptyReject: true` (`false` by default) allows calls to `Promise.reject()` with no arguments.

Examples of **incorrect** code for this rule:

```js
/*eslint prefer-promise-reject-errors: "error"*/

Promise.reject("something bad happened");

Promise.reject(5);

Promise.reject();

new Promise(function(resolve, reject) {
  reject("something bad happened");
});

new Promise(function(resolve, reject) {
  reject();
});

```

Examples of **correct** code for this rule:

```js
/*eslint prefer-promise-reject-errors: "error"*/

Promise.reject(new Error("something bad happened"));

Promise.reject(new TypeError("something bad happened"));

new Promise(function(resolve, reject) {
  reject(new Error("something bad happened"));
});

var foo = getUnknownValue();
Promise.reject(foo);
```

Examples of **correct** code for this rule with the `allowEmptyReject: true` option:

```js
/*eslint prefer-promise-reject-errors: ["error", {"allowEmptyReject": true}]*/

Promise.reject();

new Promise(function(resolve, reject) {
  reject();
});
```

## Known Limitations

Due to the limits of static analysis, this rule cannot guarantee that you will only reject Promises with `Error` objects. While the rule will report cases where it can guarantee that the rejection reason is clearly not an `Error`, it will not report cases where there is uncertainty about whether a given reason is an `Error`. For more information on this caveat, see the [similar limitations](no-throw-literal.md#known-limitations) in the `no-throw-literal` rule.

To avoid conflicts between rules, this rule does not report non-error values used in `throw` statements in async functions, even though these lead to Promise rejections. To lint for these cases, use the [`no-throw-literal`](https://eslint.org/docs/rules/no-throw-literal) rule.

## When Not To Use It

If you're using custom non-error values as Promise rejection reasons, you can turn off this rule.

## Further Reading

* [`no-throw-literal`](https://eslint.org/docs/rules/no-throw-literal)
* [Warning: a promise was rejected with a non-error](http://bluebirdjs.com/docs/warning-explanations.html#warning-a-promise-was-rejected-with-a-non-error)
