# Disallow Assignment of the Exception Parameter (no-ex-assign)

When an error is caught using a `catch` block, it's possible to accidentally (or purposely) overwrite the reference to the error. Such as:

```js
try {
    // code
} catch (e) {
    e = 10;
}
```

This makes it impossible to track the error from that point on.


## Rule Details

This rule's purpose is to enforce convention. Assigning a value to the exception parameter wipes out all the valuable data contained therein and thus should be avoided. Since there is no `arguments` object to offer alternative access to this data, assignment of the parameter is absolutely destructive.

Examples of **incorrect** code for this rule:

```js
/*eslint no-ex-assign: 2*/

try {
    // code
} catch (e) {
    e = 10;
}
```

Examples of **correct** code for this rule:

```js
/*eslint no-ex-assign: 2*/

try {
    // code
} catch (e) {
    var foo = 'bar';
}
```

## Further Reading

* [Do not assign to the exception parameter](http://jslinterrors.com/do-not-assign-to-the-exception-parameter/)
* [The "catch" with try...catch](http://weblog.bocoup.com/the-catch-with-try-catch/) by Ben Alman explains how the exception identifier can leak into the outer scope in IE 6-8
