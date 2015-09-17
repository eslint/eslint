# Disallow eval() (no-eval)

JavaScript's `eval()` function is potentially dangerous and is often misused. Using `eval()` on untrusted code can open a program up to several different injection attacks. The use of `eval()` in most contexts can be substituted for a better, alternative approach to a problem.

```js
var obj = { x: "foo" },
    key = "x",
    value = eval("obj." + key);
```

## Rule Details

This rule is aimed at preventing potentially dangerous, unnecessary, and slow code by disallowing the use of the `eval()` function. As such, it will warn whenever the `eval()` function is used.

The following patterns are considered problems:

```js
/*eslint no-eval: 2*/

var obj = { x: "foo" },
    key = "x",
    value = eval("obj." + key); /*error eval can be harmful.*/
```

The following patterns are not considered problems:

```js
/*eslint no-eval: 2*/

var obj = { x: "foo" },
    key = "x",
    value = obj[key];
```

## Further Reading

* [Eval is Evil, Part One](http://blogs.msdn.com/b/ericlippert/archive/2003/11/01/53329.aspx)
* [How evil is eval](http://javascriptweblog.wordpress.com/2010/04/19/how-evil-is-eval/)

## Related Rules

* [no-implied-eval](no-implied-eval.md)
