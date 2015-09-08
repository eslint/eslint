# Disallow Self Compare (no-self-compare)

Comparing a variable against itself is usually an error, either an typo or refactoring error. It is confusing to the reader and may potentially introduce a runtime error.

The only time you would compare a variable against itself is when you are testing for `NaN`. However, it is far more appropriate to use the `isNaN()` function for that use case rather than leaving the reader of the code to determine the intent of self comparison.

## Rule Details

This error is raised to highlight a potentially confusing and potentially pointless piece of code. There are almost no situations in which you would need to compare something to itself.

```js
/*eslint no-self-compare: 2*/

var x = 10;
if (x === x) { /*error Comparing to itself is potentially pointless.*/
    x = 20;
}
```

## Further Reading

* [Weird Relation](http://jslinterrors.com/weird-relation/)
