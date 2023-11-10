---
title: sort-keys
rule_type: suggestion
related_rules:
- sort-imports
- sort-vars
---


When declaring multiple properties, some developers prefer to sort property names alphabetically to more easily find and/or diff necessary properties at a later time. Others feel that it adds complexity and becomes burden to maintain.

## Rule Details

This rule checks all property definitions of object expressions and verifies that all variables are sorted alphabetically.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint sort-keys: "error"*/
/*eslint-env es6*/

let obj1 = {a: 1, c: 3, b: 2};
let obj2 = {a: 1, "c": 3, b: 2};

// Case-sensitive by default.
let obj3 = {a: 1, b: 2, C: 3};

// Non-natural order by default.
let obj4 = {1: a, 2: c, 10: b};

// This rule checks computed properties which have a simple name as well.
// Simple names are names which are expressed by an Identifier node or a Literal node.
const S = Symbol("s")
let obj5 = {a: 1, ["c"]: 3, b: 2};
let obj6 = {a: 1, [S]: 3, b: 2};
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint sort-keys: "error"*/
/*eslint-env es6*/

let obj1 = {a: 1, b: 2, c: 3};
let obj2 = {a: 1, "b": 2, c: 3};

// Case-sensitive by default.
let obj3 = {C: 3, a: 1, b: 2};

// Non-natural order by default.
let obj4 = {1: a, 10: b, 2: c};

// This rule checks computed properties which have a simple name as well.
let obj5 = {a: 1, ["b"]: 2, c: 3};
let obj6 = {a: 1, [b]: 2, c: 3};

// This rule ignores computed properties which have a non-simple name.
let obj7 = {a: 1, [c + d]: 3, b: 2};
let obj8 = {a: 1, ["c" + "d"]: 3, b: 2};
let obj9 = {a: 1, [`${c}`]: 3, b: 2};
let obj10 = {a: 1, [tag`c`]: 3, b: 2};

// This rule does not report unsorted properties that are separated by a spread property.
let obj11 = {b: 1, ...c, a: 2};
```

:::

## Options

```json
{
    "sort-keys": ["error", "asc", {"caseSensitive": true, "natural": false, "minKeys": 2}]
}
```

The 1st option is `"asc"` or `"desc"`.

* `"asc"` (default) - enforce properties to be in ascending order.
* `"desc"` - enforce properties to be in descending order.

The 2nd option is an object which has 3 properties.

* `caseSensitive` - if `true`, enforce properties to be in case-sensitive order. Default is `true`.
* `minKeys` - Specifies the minimum number of keys that an object should have in order for the object's unsorted keys to produce an error. Default is `2`, which means by default all objects with unsorted keys will result in lint errors.
* `natural` - if `true`, enforce properties to be in natural order. Default is `false`. Natural Order compares strings containing combination of letters and numbers in the way a human being would sort. It basically sorts numerically, instead of sorting alphabetically. So the number 10 comes after the number 3 in Natural Sorting.
* `allowLineSeparatedGroups` - if `true`, the rule allows to group object keys through line breaks. In other words, a blank line after a property will reset the sorting of keys. Default is `false`.

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

::: incorrect

```js
/*eslint sort-keys: ["error", "desc"]*/
/*eslint-env es6*/

let obj1 = {b: 2, c: 3, a: 1};
let obj2 = {"b": 2, c: 3, a: 1};

// Case-sensitive by default.
let obj3 = {C: 1, b: 3, a: 2};

// Non-natural order by default.
let obj4 = {10: b, 2: c, 1: a};
```

:::

Examples of **correct** code for the `"desc"` option:

::: correct

```js
/*eslint sort-keys: ["error", "desc"]*/
/*eslint-env es6*/

let obj1 = {c: 3, b: 2, a: 1};
let obj2 = {c: 3, "b": 2, a: 1};

// Case-sensitive by default.
let obj3 = {b: 3, a: 2, C: 1};

// Non-natural order by default.
let obj4 = {2: c, 10: b, 1: a};
```

:::

### insensitive

Examples of **incorrect** code for the `{caseSensitive: false}` option:

::: incorrect

```js
/*eslint sort-keys: ["error", "asc", {caseSensitive: false}]*/
/*eslint-env es6*/

let obj1 = {a: 1, c: 3, C: 4, b: 2};
let obj2 = {a: 1, C: 3, c: 4, b: 2};
```

:::

Examples of **correct** code for the `{caseSensitive: false}` option:

::: correct

```js
/*eslint sort-keys: ["error", "asc", {caseSensitive: false}]*/
/*eslint-env es6*/

let obj1 = {a: 1, b: 2, c: 3, C: 4};
let obj2 = {a: 1, b: 2, C: 3, c: 4};
```

:::

### natural

Examples of **incorrect** code for the `{natural: true}` option:

::: incorrect

```js
/*eslint sort-keys: ["error", "asc", {natural: true}]*/
/*eslint-env es6*/

let obj = {1: a, 10: c, 2: b};
```

:::

Examples of **correct** code for the `{natural: true}` option:

::: correct

```js
/*eslint sort-keys: ["error", "asc", {natural: true}]*/
/*eslint-env es6*/

let obj = {1: a, 2: b, 10: c};
```

:::

### minKeys

Examples of **incorrect** code for the `{minKeys: 4}` option:

::: incorrect

```js
/*eslint sort-keys: ["error", "asc", {minKeys: 4}]*/
/*eslint-env es6*/

// 4 keys
let obj1 = {
    b: 2,
    a: 1, // not sorted correctly (should be 1st key)
    c: 3,
    d: 4,
};

// 5 keys
let obj2 = {
    2: 'a',
    1: 'b', // not sorted correctly (should be 1st key)
    3: 'c',
    4: 'd',
    5: 'e',
};
```

:::

Examples of **correct** code for the `{minKeys: 4}` option:

::: correct

```js
/*eslint sort-keys: ["error", "asc", {minKeys: 4}]*/
/*eslint-env es6*/

// 3 keys
let obj1 = {
    b: 2,
    a: 1,
    c: 3,
};

// 2 keys
let obj2 = {
    2: 'b',
    1: 'a',
};
```

:::

### allowLineSeparatedGroups

Examples of **incorrect** code for the `{allowLineSeparatedGroups: true}` option:

::: incorrect

```js
/*eslint sort-keys: ["error", "asc", {allowLineSeparatedGroups: true}]*/
/*eslint-env es6*/

let obj1 = {
    b: 1,
    c () {

    },
    a: 3
}

let obj2 = {
    b: 1,
    c: 2,

    z () {

    },
    y: 3
}

let obj3 = {
    b: 1,
    c: 2,

    z () {

    },
    // comment
    y: 3,
}

let obj4 = {
    b: 1
    // comment before comma
    , a: 2
};
```

:::

Examples of **correct** code for the `{allowLineSeparatedGroups: true}` option:

::: correct

```js
/*eslint sort-keys: ["error", "asc", {allowLineSeparatedGroups: true}]*/
/*eslint-env es6*/

let obj1 = {
    e: 1,
    f: 2,
    g: 3,

    a: 4,
    b: 5,
    c: 6
}

let obj2 = {
    b: 1,

    // comment
    a: 4,
    c: 5,
}

let obj3 = {
    c: 1,
    d: 2,

    b () {

    }, 
    e: 3,
}

let obj4 = {
    c: 1,
    d: 2,
    // comment

    // comment
    b() {

    },
    e: 4
}

let obj5 = {
    b,

    [foo + bar]: 1,
    a
}

let obj6 = {
    b: 1
    // comment before comma

    ,
    a: 2
};

var obj7 = {
    b: 1,

    a: 2,
    ...z,
    c: 3
}
```

:::

## When Not To Use It

If you don't want to notify about properties' order, then it's safe to disable this rule.

## Compatibility

* **JSCS:** [validateOrderInObjectKeys](https://jscs-dev.github.io/rule/validateOrderInObjectKeys)
