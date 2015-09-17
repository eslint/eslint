# Variable Sorting (sort-vars)

When declaring multiple variables within the same block, some developers prefer to sort variable names alphabetically to be able to find necessary variable easier at the later time. Others feel that it adds complexity and becomes burden to maintain.

## Rule Details

This rule checks all variable declaration blocks and verifies that all variables are sorted alphabetically.
The default configuration of the rule is case-sensitive.

The following patterns are considered problems:

```js
/*eslint sort-vars: 2*/

var b, a;    /*error Variables within the same declaration block should be sorted alphabetically*/

var a, B, c; /*error Variables within the same declaration block should be sorted alphabetically*/

var a, A;    /*error Variables within the same declaration block should be sorted alphabetically*/
```

The following patterns are not considered problems:

```js
/*eslint sort-vars: 2*/

var a, b, c, d;

var _a = 10;
var _b = 20;

var A, a;

var B, a, c;
```

Alphabetical list is maintained starting from the first variable and excluding any that are considered problems. So the following code will produce two problems:

```js
/*eslint sort-vars: 2*/

var c, d, a, b; /*error Variables within the same declaration block should be sorted alphabetically*/
```

But this one, will only produce one:

```js
/*eslint sort-vars: 2*/

var c, d, a, e; /*error Variables within the same declaration block should be sorted alphabetically*/
```

## Rule Options

```
"sort-vars": [<enabled>, { "ignoreCase": <boolean> }]
```

### `ignoreCase`

When `true` the rule ignores the case-sensitivity of the variables order.

The following patterns are not considered problems:

```js
/*eslint sort-vars: [2, { "ignoreCase": true }]*/

var a, A;

var a, B, c;
```

## When not to use

This rule is a formatting preference and not following it won't negatively affect the quality of your code. If you alphabetizing variables isn't a part of your coding standards, then you can leave this rule off.
