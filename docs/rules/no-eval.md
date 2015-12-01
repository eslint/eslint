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

(0, eval)("var a = 0");         /*error eval can be harmful.*/

var foo = eval;                 /*error eval can be harmful.*/
foo("var a = 0");

// This `this` is the global object.
this.eval("var a = 0");         /*error eval can be harmful.*/
```

```js
/*eslint no-eval: 2*/
/*eslint-env browser*/

window.eval("var a = 0"); /*error eval can be harmful.*/
```

```js
/*eslint no-eval: 2*/
/*eslint-env node*/

global.eval("var a = 0"); /*error eval can be harmful.*/
```

The following patterns are not considered problems:

```js
/*eslint no-eval: 2*/

var obj = { x: "foo" },
    key = "x",
    value = obj[key];

class A {
    foo() {
        // This is a user-defined method.
        this.eval("var a = 0");
    }

    eval() {
    }
}
```

### Options

This rule has an option to allow indirect calls to `eval`.
Indirect calls to `eval` are less dangerous than direct calls to `eval` because they cannot dynamically change the scope. Because of this, they also will not negatively impact performance to the degree of direct `eval`.

```js
{
    "no-eval": [2, {"allowIndirect": true}] // default is false
}
```

With this option the following patterns are considered problems:

```js
/*eslint no-eval: 2*/

var obj = { x: "foo" },
    key = "x",
    value = eval("obj." + key); /*error eval can be harmful.*/
```

With this option the following patterns are not considered problems:

```js
/*eslint no-eval: 2*/

(0, eval)("var a = 0");

var foo = eval;
foo("var a = 0");

this.eval("var a = 0");
```

```js
/*eslint no-eval: 2*/
/*eslint-env browser*/

window.eval("var a = 0");
```

```js
/*eslint no-eval: 2*/
/*eslint-env node*/

global.eval("var a = 0");
```

### Known Limitations

* This rule is warning every `eval()` even if the `eval` is not global's.
  This behavior is in order to detect calls of direct `eval`. Such as:

  ```js
  module.exports = function(eval) {
      // If the value of this `eval` is built-in `eval` function, this is a
      // call of direct `eval`.
      eval("var a = 0");
  };
  ```

* This rule cannot catch renaming the global object. Such as:

  ```js
  var foo = window;
  foo.eval("var a = 0");
  ```

## Further Reading

* [Eval is Evil, Part One](http://blogs.msdn.com/b/ericlippert/archive/2003/11/01/53329.aspx)
* [How evil is eval](http://javascriptweblog.wordpress.com/2010/04/19/how-evil-is-eval/)

## Related Rules

* [no-implied-eval](no-implied-eval.md)
