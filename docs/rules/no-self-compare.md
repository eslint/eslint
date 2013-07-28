# no self compare

## Rule Details

This error is raised to highlight a potentially confusing and potentially pointless piece of code. There are almost no situations in which you would need to compare something to itself.

```js
var x = 10;
if (x === x) {
    x = 20;
}
```

## Further Reading

* [Weird Relation](http://jslinterrors.com/weird-relation/)
