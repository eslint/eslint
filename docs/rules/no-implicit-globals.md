# Disallow `var` and Named Functions in Global Scope (no-implicit-globals)

When working with browser scripts, developers often forget that variable and function declarations at the top-level scope become global variables on the `window` object. As opposed to modules which have their own scope. Globals should be explicitly assigned to `window` or `self` if that is the intent. Otherwise variables intended to be local to the script should be wrapped in an IIFE.

## Rule Details

This rule disallows `var` and named `function` declarations at the top-level script scope. This does not apply to ES and CommonJS modules since they have a module scope.

The following patterns are considered problems:

```js
/*eslint no-implicit-globals: 2*/

var foo = 1;

function bar() {}
```

The following patterns are not considered problems:

```js
/*eslint no-implicit-globals: 2*/

// explicitly set on window
window.foo = 1;
window.bar = function() {};

// intended to be scope to this file
(function() {
  var foo = 1;

  function bar() {}
})();
```

```js
/*eslint modules: true*/

// foo and bar are local to module
var foo = 1;
function bar() {}
```

## When Not To Use It

If you want to be able to declare variables and functions in the global scope you can safely disable this rule. Or if you are always using module scoped files, this rule will never apply.

## Further Reading

* [Immediately-Invoked Function Expression (IIFE)](http://benalman.com/news/2010/11/immediately-invoked-function-expression/)
