# require object keys to be sorted (sort-keys)

When declaring multiple properties, some developers prefer to sort property names alphabetically to be able to find necessary property easier at the later time. Others feel that it adds complexity and becomes burden to maintain.

## Rule Details

This rule checks all property definitions of object expressions and verifies that all variables are sorted alphabetically.

Examples of **incorrect** code for this rule:

```js
/*eslint sort-keys: "error"*/
/*eslint-env es6*/

let obj = {a: 1, c: 3, b: 2};
let obj = {a: 1, "c": 3, b: 2};

// Case-sensitive by default.
let obj = {a: 1, b: 2, C: 3};

// Non-natural order by default.
let obj = {1: a, 2: c, 10: b};

// This rule checks computed properties which have a simple name as well.
// Simple names are names which are expressed by an Identifier node or a Literal node.
const S = Symbol("s")
let obj = {a: 1, ["c"]: 3, b: 2};
let obj = {a: 1, [S]: 3, b: 2};
```

Examples of **correct** code for this rule:

```js
/*eslint sort-keys: "error"*/
/*eslint-env es6*/

let obj = {a: 1, b: 2, c: 3};
let obj = {a: 1, "b": 2, c: 3};

// Case-sensitive by default.
let obj = {C: 3, a: 1, b: 2};

// Non-natural order by default.
let obj = {1: a, 10: b, 2: c};

// This rule checks computed properties which have a simple name as well.
let obj = {a: 1, ["b"]: 2, c: 3};
let obj = {a: 1, [b]: 2, c: 3};

// This rule ignores computed properties which have a non-simple name.
let obj = {a: 1, [c + d]: 3, b: 2};
let obj = {a: 1, ["c" + "d"]: 3, b: 2};
let obj = {a: 1, [`${c}`]: 3, b: 2};
let obj = {a: 1, [tag`c`]: 3, b: 2};

// This rule does not report unsorted properties that are separated by a spread property.
let obj = {b: 1, ...c, a: 2};
```

## Options

```json
{
    "sort-keys": ["error", "asc", {"caseSensitive": true, "natural": false}]
}
```

The 1st option is `"asc"` or `"desc"`.

* `"asc"` (default) - enforce properties to be in ascending order.
* `"desc"` - enforce properties to be in descending order.

The 2nd option is an object which has 2 properties.

* `caseSensitive` - if `true`, enforce properties to be in case-sensitive order. Default is `true`.
* `natural` - if `true`, enforce properties to be in natural order. Default is `false`. Natural Order compares strings containing combination of letters and numbers in the way a human being would sort. It basically sorts numerically, instead of sorting alphabetically. So the number 10 comes after the number 3 in Natural Sorting.

Example for a list:

With `natural` as true, the ordering would be
1
3
6
8
10

With `natural` as false, the ordering would be
1
10
3
6
8

### desc

Examples of **incorrect** code for the `"desc"` option:

```js
/*eslint sort-keys: ["error", "desc"]*/
/*eslint-env es6*/

let obj = {b: 2, c: 3, a: 1};
let obj = {"b": 2, c: 3, a: 1};

// Case-sensitive by default.
let obj = {C: 1, b: 3, a: 2};

// Non-natural order by default.
let obj = {10: b, 2: c, 1: a};
```

Examples of **correct** code for the `"desc"` option:

```js
/*eslint sort-keys: ["error", "desc"]*/
/*eslint-env es6*/

let obj = {c: 3, b: 2, a: 1};
let obj = {c: 3, "b": 2, a: 1};

// Case-sensitive by default.
let obj = {b: 3, a: 2, C: 1};

// Non-natural order by default.
let obj = {2: c, 10: b, 1: a};
```

### insensitive

Examples of **incorrect** code for the `{caseSensitive: false}` option:

```js
/*eslint sort-keys: ["error", "asc", {caseSensitive: false}]*/
/*eslint-env es6*/

let obj = {a: 1, c: 3, C: 4, b: 2};
let obj = {a: 1, C: 3, c: 4, b: 2};
```

Examples of **correct** code for the `{caseSensitive: false}` option:

```js
/*eslint sort-keys: ["error", "asc", {caseSensitive: false}]*/
/*eslint-env es6*/

let obj = {a: 1, b: 2, c: 3, C: 4};
let obj = {a: 1, b: 2, C: 3, c: 4};
```

### natural

Examples of **incorrect** code for the `{natural: true}` option:

```js
/*eslint sort-keys: ["error", "asc", {natural: true}]*/
/*eslint-env es6*/

let obj = {1: a, 10: c, 2: b};
```

Examples of **correct** code for the `{natural: true}` option:

```js
/*eslint sort-keys: ["error", "asc", {natural: true}]*/
/*eslint-env es6*/

let obj = {1: a, 2: b, 10: c};
```

## When Not To Use It

If you don't want to notify about properties' order, then it's safe to disable this rule.

## Related Rules

* [sort-imports](sort-imports.md)
* [sort-vars](sort-vars.md)

## Compatibility

* **JSCS:** [validateOrderInObjectKeys](https://jscs-dev.github.io/rule/validateOrderInObjectKeys)
