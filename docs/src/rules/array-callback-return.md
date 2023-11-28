---
title: array-callback-return
rule_type: problem
---


`Array` has several methods for filtering, mapping, and folding.
If we forget to write `return` statement in a callback of those, it's probably a mistake. If you don't want to use a return or don't need the returned results, consider using [.forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) instead.

```js
// example: convert ['a', 'b', 'c'] --> {a: 0, b: 1, c: 2}
var indexMap = myArray.reduce(function(memo, item, index) {
  memo[item] = index;
}, {}); // Error: cannot set property 'b' of undefined
```

## Rule Details

This rule enforces usage of `return` statement in callbacks of array's methods.
Additionally, it may also enforce the `forEach` array method callback to **not** return a value by using the `checkForEach` option.

This rule finds callback functions of the following methods, then checks usage of `return` statement.

* [`Array.from`](https://www.ecma-international.org/ecma-262/6.0/#sec-array.from)
* [`Array.prototype.every`](https://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.every)
* [`Array.prototype.filter`](https://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.filter)
* [`Array.prototype.find`](https://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.find)
* [`Array.prototype.findIndex`](https://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.findindex)
* [`Array.prototype.findLast`](https://tc39.es/ecma262/#sec-array.prototype.findlast)
* [`Array.prototype.findLastIndex`](https://tc39.es/ecma262/#sec-array.prototype.findlastindex)
* [`Array.prototype.flatMap`](https://www.ecma-international.org/ecma-262/10.0/#sec-array.prototype.flatmap)
* [`Array.prototype.forEach`](https://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.foreach) (optional, based on `checkForEach` parameter)
* [`Array.prototype.map`](https://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.map)
* [`Array.prototype.reduce`](https://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.reduce)
* [`Array.prototype.reduceRight`](https://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.reduceright)
* [`Array.prototype.some`](https://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.some)
* [`Array.prototype.sort`](https://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.sort)
* [`Array.prototype.toSorted`](https://tc39.es/ecma262/#sec-array.prototype.tosorted)
* And above of typed arrays.

Examples of **incorrect** code for this rule:

:::incorrect

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

:::

Examples of **correct** code for this rule:

:::correct

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

:::

## Options

This rule accepts a configuration object with three options:

* `"allowImplicit": false` (default) When set to `true`, allows callbacks of methods that require a return value to implicitly return `undefined` with a `return` statement containing no expression.
* `"checkForEach": false` (default) When set to `true`, rule will also report `forEach` callbacks that return a value.
* `"allowVoid": false` (default) When set to `true`, allows `void` in `forEach` callbacks, so rule will not report the return value with a `void` operator.

**Note:** `{ "allowVoid": true }` works only if `checkForEach` option is set to `true`.  

### allowImplicit

Examples of **correct** code for the `{ "allowImplicit": true }` option:

:::correct

```js
/*eslint array-callback-return: ["error", { allowImplicit: true }]*/
var undefAllTheThings = myArray.map(function(item) {
    return;
});
```

:::

### checkForEach

Examples of **incorrect** code for the `{ "checkForEach": true }` option:

:::incorrect

```js
/*eslint array-callback-return: ["error", { checkForEach: true }]*/

myArray.forEach(function(item) {
    return handleItem(item);
});

myArray.forEach(function(item) {
    if (item < 0) {
        return x;
    }
    handleItem(item);
});

myArray.forEach(function(item) {
    if (item < 0) {
        return void x;
    }
    handleItem(item);
});

myArray.forEach(item => handleItem(item));

myArray.forEach(item => void handleItem(item));

myArray.forEach(item => {
    return handleItem(item);
});

myArray.forEach(item => {
    return void handleItem(item);
});
```

:::

Examples of **correct** code for the `{ "checkForEach": true }` option:

:::correct

```js
/*eslint array-callback-return: ["error", { checkForEach: true }]*/

myArray.forEach(function(item) {
    handleItem(item)
});

myArray.forEach(function(item) {
    if (item < 0) {
        return;
    }
    handleItem(item);
});

myArray.forEach(function(item) {
    handleItem(item);
    return;
});

myArray.forEach(item => {
    handleItem(item);
});
```

:::

### allowVoid

Examples of **correct** code for the `{ "allowVoid": true }` option:

:::correct

```js
/*eslint array-callback-return: ["error", { checkForEach: true, allowVoid: true }]*/

myArray.forEach(item => void handleItem(item));

myArray.forEach(item => {
    return void handleItem(item);
});

myArray.forEach(item => {
    if (item < 0) {
        return void x;
    }
    handleItem(item);
});
```

:::

## Known Limitations

This rule checks callback functions of methods with the given names, *even if* the object which has the method is *not* an array.

## When Not To Use It

If you don't want to warn about usage of `return` statement in callbacks of array's methods, then it's safe to disable this rule.
