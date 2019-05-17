# Enforce spacing between rest and spread operators and their expressions (rest-spread-spacing)

ES2015 introduced the rest and spread operators, which expand an iterable structure into its individual parts. Some examples of their usage are as follows:

```js
let numArr = [1, 2, 3];
function add(a, b, c) {
    return a + b + c;
}
add(...numArr); // -> 6

let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];
arr1.push(...arr2); // -> [1, 2, 3, 4, 5, 6]

let [a, b, ...arr] = [1, 2, 3, 4, 5];
a; // -> 1
b // -> 2
arr; // ->  [3, 4, 5]

function numArgs(...args) {
  return args.length;
}
numArgs(a, b, c); // -> 3
```

In addition to the above, there is currently a proposal to add object rest and spread properties to the spec. They can be used as follows:

```js

let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
x; // -> 1
y; // -> 2
z; // -> { a: 3, b: 4 }

let n = { x, y, ...z };
n; // -> { x: 1, y: 2, a: 3, b: 4 }
```

As with other operators, whitespace is allowed between the rest or spread operator and the expression it is operating on, which can lead to inconsistent spacing within a codebase.

## Rule Details

This rule aims to enforce consistent spacing between rest and spread operators and their expressions. The rule also supports object rest and spread properties in ES2018:

```json
{
    "parserOptions": {
        "ecmaVersion": 2018
    }
}
```

Please read the user guide's section on [configuring parser options](/docs/user-guide/configuring#specifying-parser-options) to learn more.

## Options

This rule takes one option: a string with the value of `"never"` or `"always"`. The default value is `"never"`.

### "never"

When using the default `"never"` option, whitespace is not allowed between spread operators and their expressions.

```json
rest-spread-spacing: ["error"]
```

or

```json
rest-spread-spacing: ["error", "never"]
```

Examples of **incorrect** code for this rule with `"never"`:

```js
/*eslint rest-spread-spacing: ["error", "never"]*/

fn(... args)
[... arr, 4, 5, 6]
let [a, b, ... arr] = [1, 2, 3, 4, 5];
function fn(... args) { console.log(args); }
let { x, y, ... z } = { x: 1, y: 2, a: 3, b: 4 };
let n = { x, y, ... z };
```

Examples of **correct** code for this rule with `"never"`:

```js
/*eslint rest-spread-spacing: ["error", "never"]*/

fn(...args)
[...arr, 4, 5, 6]
let [a, b, ...arr] = [1, 2, 3, 4, 5];
function fn(...args) { console.log(args); }
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
let n = { x, y, ...z };
```

### "always"

When using the `"always"` option, whitespace is required between spread operators and their expressions.

```json
rest-spread-spacing: ["error", "always"]
```

Examples of **incorrect** code for this rule with `"always"`:

```js
/*eslint rest-spread-spacing:["error", "always"]*/

fn(...args)
[...arr, 4, 5, 6]
let [a, b, ...arr] = [1, 2, 3, 4, 5];
function fn(...args) { console.log(args); }
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
let n = { x, y, ...z };
```

Examples of **correct** code for this rule with `"always"`:

```js
/*eslint rest-spread-spacing: ["error", "always"]*/

fn(... args)
[... arr, 4, 5, 6]
let [a, b, ... arr] = [1, 2, 3, 4, 5];
function fn(... args) { console.log(args); }
let { x, y, ... z } = { x: 1, y: 2, a: 3, b: 4 };
let n = { x, y, ... z };
```

## When Not To Use It

You can safely disable this rule if you do not care about enforcing consistent spacing between spread operators and their expressions.

## Further Reading

* [Object Rest/Spread Properties for ECMAScript](https://github.com/tc39/proposal-object-rest-spread)
