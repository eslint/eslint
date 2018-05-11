# Enforces return statements in callbacks of array's methods (array-callback-return)

`Array` has several methods for filtering, mapping, and folding.
If we forget to write `return` statement in a callback of those, it's probably a mistake. If you don't want to use a return or don't need the returned results, consider using [.forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) instead.

```js
// example: convert ['a', 'b', 'c'] --> {a: 0, b: 1, c: 2}
var indexMap = myArray.reduce(function(memo, item, index) {
  memo[item] = index;
}, {}); // Error: cannot set property 'b' of undefined
```

This rule enforces usage of `return` statement in callbacks of array's methods.

## Rule Details

This rule finds callback functions of the following methods, then checks usage of `return` statement.

* [`Array.from`](https://www.ecma-international.org/ecma-262/6.0/#sec-array.from)
* [`Array.prototype.every`](https://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.every)
* [`Array.prototype.filter`](https://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.filter)
* [`Array.prototype.find`](https://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.find)
* [`Array.prototype.findIndex`](https://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.findIndex )
* [`Array.prototype.map`](https://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.map)
* [`Array.prototype.reduce`](https://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.reduce)
* [`Array.prototype.reduceRight`](https://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.reduceRight)
* [`Array.prototype.some`](https://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.some)
* [`Array.prototype.sort`](https://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.sort)
* And above of typed arrays.

Examples of **incorrect** code for this rule:

```js
/*eslint array-callback-return: "error"*/

var indexMap = myArray.reduce(function(memo, item, index) {
    memo[item] = index;
}, {});

var foo = Array.from(nodes, function(node) {
    if (node.tagName === "DIV") {
        return true;
    }
});

var bar = foo.filter(function(x) {
    if (x) {
        return true;
    } else {
        return;
    }
});
```

Examples of **correct** code for this rule:

```js
/*eslint array-callback-return: "error"*/

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

## Options

This rule has an object option:

* `"allowImplicit": false` (default) When set to true, allows implicitly returning `undefined` with a `return` statement containing no expression.

Examples of **correct** code for the `{ "allowImplicit": true }` option:

```js
/*eslint array-callback-return: ["error", { allowImplicit: true }]*/
var undefAllTheThings = myArray.map(function(item) {
    return;
});
```

## Known Limitations

This rule checks callback functions of methods with the given names, *even if* the object which has the method is *not* an array.

## When Not To Use It

If you don't want to warn about usage of `return` statement in callbacks of array's methods, then it's safe to disable this rule.
