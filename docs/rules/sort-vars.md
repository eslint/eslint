# Variable Sorting (sort-vars)

When declaring multiple variables within the same block, some developers prefer to sort variable names alphabetically to be able to find necessary variable easier at the later time. Others feel that it adds complexity and becomes burden to maintain.

## Rule Details

This rule checks all variable declaration blocks and verifies that all variables are sorted alphabetically.

## Options

This rule, when enabled, always enforces sorted variables (there is no `"always"` or `"never"` option unlike most other rules).

There is, however, an option to toggle case sensitivity:

```
"sort-vars": [ "error", { "ignoreCase": true }]
```

The default configuration of the rule is case-sensitive.

## Examples

### default options

Examples of **incorrect** code for this rule with the default options:

```js
/*eslint sort-vars: "error"*/

var b, a;

var a, B, c;

var a, A;
```

Examples of **correct** code for this rule with the default options:

```js
/*eslint sort-vars: "error"*/

var a, b, c, d;

var _a = 10;
var _b = 20;

var A, a;

var B, a, c; // uppercase before lowercase
```

### ignoreCase: true

Examples of **correct** code for this rule with the `{ "ignoreCase": true }`:

```js
/*eslint sort-vars: ["error", { "ignoreCase": true }]*/

var a, A;

var a, B, c;
```

## Notes

If a variable is not in alphabetical order it will be flagged without altering the expected order for the next variable.

For example, the following list will generate two errors:

```js
/*eslint sort-vars: "error"*/

var c, d, a, b;
//        ^  ^ errors at `a` and `b`
```

While this list will only produce one:

```js
/*eslint sort-vars: "error"*/

var c, d, a, e;
//        ^ error at `a`
```

## When Not To Use It

This rule is a formatting preference and not following it won't negatively affect the quality of your code. If you alphabetizing variables isn't a part of your coding standards, then you can leave this rule off.
