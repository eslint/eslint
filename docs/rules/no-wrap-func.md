# none IIFE wrapping


## Rule Details

This error is raised to highlight a potentially confusing piece of code. This rule will raise a warning when it encounters a function expression wrapped in parentheses with no following invoking parentheses.

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

* [Wrapping non-IIFE function literals in parens is unnecessary](http://jslinterrors.com/wrapping-non-iife-function-literals-in-parens/)