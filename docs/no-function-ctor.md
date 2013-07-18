# no function constructor

## Rule Details

This error is raised to highlight the use of a bad practice. By passing a string to the Function constructor, you are requiring the engine to parse that string much in the way it has to when you call the eval function.

```js
var x = new Function("a", "b", "return a + b");
```

The following patterns are considered okay and do not cause warnings:

```js
var x = function (a, b) {
    return a + b;
};
```

## When Not To Use It

In more advanced cases where you really need to use the Function constructor

## Further Reading

* [The Function constructor is eval](http://jslinterrors.com/the-function-constructor-is-eval/)
