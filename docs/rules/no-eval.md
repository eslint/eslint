# Disallow eval() (no-eval)

JavaScript's `eval()` function is potentially dangerous and is often misused. Using `eval()` on untrusted code can open a program up to several different injection attacks. The of `eval()` in most contexts can be substituted for a better, alternative approach to a problem.

```js
var obj = { x: "foo" },
    key = "x",
    value = eval("obj." + key);
```

Additionally, there are some other methods that act similar to `eval()`. Both `setTimeout()` and `setInterval()` allow the first argument to be a string, which evaluates the string in the global scope, such as:

```js
setTimeout("count = 5", 10);
setInterval("foo = bar", 10);
```

These are considered implied `eval()` and it's typically recommended to use functions for the first argument instead of a string.

## Rule Details

This rule is aimed at preventing potentially dangerous, unnecessary, and slow code by disallowing the use of the `eval()` function. As such, it will warn whenever the `eval()` function is used or when either `setTimeout()` or `setInterval()` are used with a string argument.

The following patterns are considered warnings:

```js
var obj = { x: "foo" },
    key = "x",
    value = eval("obj." + key);

setTimeout("count = 5", 10);
setInterval("foo = bar", 10);
window.setTimeout("count = 5", 10);
window.setInterval("foo = bar", 10);
```

The following patterns are not considered warnings:

```js
var obj = { x: "foo" },
    key = "x",
    value = obj[key];

setTimeout(function() {
    count = 5;
}, 10);

setInterval(function() {
    foo = bar;
}, 10);

```

## Further Reading

* [Eval is Evil, Part One](http://blogs.msdn.com/b/ericlippert/archive/2003/11/01/53329.aspx)
* [How evil is eval](http://javascriptweblog.wordpress.com/2010/04/19/how-evil-is-eval/)

## Related Rules

* [no-implied-eval](no-implied-eval.md)
