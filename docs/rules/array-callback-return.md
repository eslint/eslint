# Enforces return statements in callbacks of array's methods (array-callback-return)

`Array` has several methods for filtering, mapping, and folding.
If we forget to write `return` statement in a callback of those, it's probably a mistake.

```js
// example: convert ['a', 'b', 'c'] --> {a: 0, b: 1, c: 2}
var indexMap = myArray.reduce(function(memo, item, index) {
  memo[item] = index;
}, {}); // Error: cannot set property 'b' of undefined
```

This rule enforces usage of `return` statement in callbacks of array's methods.

## Rule Details

This rule finds callback functions of the following methods, then checks usage of `return` statement.

* [`Array.from`](http://www.ecma-international.org/ecma-262/6.0/#sec-array.from)
* [`Array.prototype.every`](http://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.every)
* [`Array.prototype.filter`](http://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.filter)
* [`Array.prototype.find`](http://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.find)
* [`Array.prototype.findIndex`](http://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.findIndex )
* [`Array.prototype.map`](http://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.map)
* [`Array.prototype.reduce`](http://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.reduce)
* [`Array.prototype.reduceRight`](http://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.reduceRight)
* [`Array.prototype.some`](http://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.some)
* [`Array.prototype.sort`](http://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.sort)
* And above of typed arrays.

**Note:** this rule finds by the method name, so the object which has the method might not be an array.

The following patterns are considered problems:

```js
var indexMap = myArray.reduce(function(memo, item, index) { /*error Expected to return a value in this function.*/
    memo[item] = index;
}, {});

var foo = Array.from(nodes, function(node) { /*error Expected to return a value at the end of this function.*/
    if (node.tagName === "DIV") {
        return true;
    }
});

var bar = foo.filter(function(x) {
    if (x) {
        return true;
    } else {
        return;                              /*error Expected a return value.*/
    }
});
```

The following patterns are considered not problems:

```js
var indexMap = myArray.reduce(function(memo, item, index) {
    memo[item] = index;
    return memo;
}, {});

var foo = Array.from(nodes, function(node) {
    if (node.tagName === "DIV") {
        return true;
    }
    return false;
});

var bar = foo.map(node => node.getAttribute("id"));
```

## When Not To Use It

If you don't want to warn about usage of `return` statement in callbacks of array's methods, then it's safe to disable this rule.
