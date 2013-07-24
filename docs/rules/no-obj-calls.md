# No global object function calls

This rule prevents the use of object properties of the global object (`Math` and `JSON`) as functions:

```javascript
var x = Math(); // Both of these will cause a warning
var y = JSON();
```

The [ES5 spec](http://es5.github.io/#x15.8) makes it clear that both `Math` and `JSON` cannot be invoked:

> The Math object does not have a [[Call]] internal property; it is not possible to invoke the Math object as a function.

## Further Reading

* ['{a}' is not a function](http://jslinterrors.com/a-is-not-a-function/)