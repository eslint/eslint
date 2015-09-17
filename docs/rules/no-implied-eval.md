# Disallow Implied eval() (no-implied-eval)

It's considered a good practice to avoid using `eval()` in JavaScript. There are security and performance implications involved with doing so, which is why many linters (including ESLint) recommend disallowing `eval()`. However, there are some other ways to pass a string and have it interpreted as JavaScript code that have similar concerns.

The first is using `setTimeout()`, `setInterval()` or `execScript()` (Internet Explorer only), both of which can accept a string of JavaScript code as their first argument. For example:

```js
setTimeout("alert('Hi!');", 100);
```

This is considered an implied `eval()` because a string of JavaScript code is
 passed in to be interpreted. The same can be done with `setInterval()` and `execScript()`. Both interpret the JavaScript code in  the global scope. For  both `setTimeout()` and `setInterval()`, the first argument can also be a function, and that is considered safer and is more performant:

```js
setTimeout(function() {
    alert("Hi!");
}, 100);
```

The best practice is to always use a function for the first argument of `setTimeout()` and `setInterval()` (and avoid `execScript()`).


## Rule Details

This rule aims to eliminate implied `eval()` through the use of `setTimeout()`, `setInterval()` or `execScript()`. As such, it will warn when either function is used with a string as the first argument.

The following patterns are considered problems:

```js
/*eslint no-implied-eval: 2*/

setTimeout("alert('Hi!');", 100);    /*error Implied eval. Consider passing a function instead of a string.*/

setInterval("alert('Hi!');", 100);   /*error Implied eval. Consider passing a function instead of a string.*/

execScript("alert('Hi!')");          /*error Implied eval. Consider passing a function instead of a string.*/

window.setTimeout("count = 5", 10);  /*error Implied eval. Consider passing a function instead of a string.*/

window.setInterval("foo = bar", 10); /*error Implied eval. Consider passing a function instead of a string.*/
```

The following patterns are not considered problems:

```js
/*eslint no-implied-eval: 2*/

setTimeout(function() {
    alert("Hi!");
}, 100);

setInterval(function() {
    alert("Hi!");
}, 100);
```

## When Not To Use It

If you want to allow `setTimeout()` and `setInterval()` with string arguments, then you can safely disable this rule.

## Further Reading

* [Implied eval is evil. Pass a function instead of a string.](http://jslinterrors.com/implied-eval-is-evil-pass-a-function-instead-of-a-string/)

## Related Rules

* [no-eval](no-eval.md)
