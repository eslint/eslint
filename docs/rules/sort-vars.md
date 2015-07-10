# Variable Sorting (sort-vars)

When declaring multiple variables within the same block, some developers prefer to sort variable names alphabetically to be able to find necessary variable easier at the later time. Others feel that it adds complexity and becomes burden to maintain.

## Rule Details

This rule checks all variable declaration blocks and verifies that all variables are sorted alphabetically.
The default configuration of the rule is case-sensitive.

The following patterns are considered warnings:

```js
var b, a;

var a, B, c;

var a, A;
```

The following patterns are considered okay and do not cause warnings:

```js
var a, b, c, d;

var _a = 10;
var _b = 20;

var A, a;

var B, a, c;
```

Alphabetical list is maintained starting from the first variable and excluding any that are considered warnings. So the following code will produce two warnings:

```js
var c, d, a, b;
```

But this one, will only produce one:

```js
var c, d, a, e;
```

## Rule Options

```js
...
"sort-vars": [<enabled>, { "ignoreCase": <boolean> }]
...
```

### `ignoreCase`

When `true` the rule ignores the case-sensitivity of the variables order.

The following patterns are considered okay and do not cause warnings:

```js
var a, A;

var a, B, c;
```

## When not to use

This rule is a formatting preference and not following it won't negatively affect the quality of your code. If you alphabetizing variables isn't a part of your coding standards, then you can leave this rule off.
