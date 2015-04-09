# Disallow Parens Around Functions (no-wrap-func)

Although it's possible to wrap functions in parentheses, this can be confusing when the code also contains immediately-invoked function expressions (IIFEs) since parentheses are often used to make this distinction. For example:

```js
var foo = (function() {
    // IIFE
}());

var bar = (function() {
    // not an IIFE
});
```

## Rule Details

This rule will raise a warning when it encounters a function expression wrapped in parentheses with no following invoking parentheses.

The following patterns are considered warnings:

```js
var a = (function() {...});
```

The following patterns are considered okay and do not cause warnings:

```js
var a = function() {...};

(function() {...})();
```

## Further Reading

* [Do not wrap function literals in parens unless they are to be immediately invoked](http://jslinterrors.com/do-not-wrap-function-literals-in-parens)
