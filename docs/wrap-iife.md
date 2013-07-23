# wrap iife

Immediately-invoked function expressions (IIFEs) are commonly wrapped in a pair of parentheses to aid the reader in understanding that the expression is the result of the function and not the function itself.

Since function *declarations* cannot be immediately invoked, a very common convention is to wrap the function in parentheses. This causes it to be parsed as a function *expression*, which can be invoked:

```javascript
(function () {
    // ...
}());
```

Without the wrapping pair of parentheses, the above example would throw a syntax error. This convention is so commonly seen that it makes sense to be consistent throughout your code, and wrap all IIFEs in parentheses. Consider the following examples:

```javascript
var x = function () {
    // Wrapping parens are unnecessary due to assignment
}();

var y = (function () {
	// Wrapping parens make it easier to see what's happening
}());
```

The first (unwrapped) example could easily be wrongly interpreted as the assignment of a function, rather than the *return value* of that function. The second (wrapped) example makes it immediately clear that it's not actually the function itself that is the subject of the assignment.

## Further reading

 - [Wrap an immediate function invocation in parentheses](http://jslinterrors.com/wrap-an-immediate-function-invocation-in-parentheses/)
