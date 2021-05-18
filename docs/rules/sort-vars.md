# Variable Sorting (sort-vars)

When declaring multiple variables within the same block, some developers prefer to sort variable names alphabetically to be able to find necessary variable easier at the later time. Others feel that it adds complexity and becomes burden to maintain.

## Rule Details

This rule checks all variable declaration blocks and verifies that all variables are sorted alphabetically.
The default configuration of the rule is case-sensitive.

Examples of **incorrect** code for this rule:

```js
/*eslint sort-vars: "error"*/

var b, a;

var a, B, c;

var a, A;
```

Examples of **correct** code for this rule:

```js
/*eslint sort-vars: "error"*/

var a, b, c, d;

var _a = 10;
var _b = 20;

var A, a;

var B, a, c;
```

Alphabetical list is maintained starting from the first variable and excluding any that are considered problems. So the following code will produce two problems:

```js
/*eslint sort-vars: "error"*/

var c, d, a, b;
```

But this one, will only produce one:

```js
/*eslint sort-vars: "error"*/

var c, d, a, e;
```

## Options

This rule has an object option:

* `"ignoreCase": true` (default `false`) ignores the case-sensitivity of the variables order

### ignoreCase

Examples of **correct** code for this rule with the `{ "ignoreCase": true }` option:

```js
/*eslint sort-vars: ["error", { "ignoreCase": true }]*/

var a, A;

var a, B, c;
```

## When Not To Use It

This rule is a formatting preference and not following it won't negatively affect the quality of your code. If you alphabetizing variables isn't a part of your coding standards, then you can leave this rule off.

## Related Rules

* [sort-keys](sort-keys.md)
* [sort-imports](sort-imports.md)
