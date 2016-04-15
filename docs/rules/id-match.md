# require identifiers to match a specified regular expression (id-match)

> "There are only two hard things in Computer Science: cache invalidation and naming things." — Phil Karlton

Naming things consistently in a project is an often underestimated aspect of code creation.
When done correctly, it can save your team hours of unnecessary head scratching and misdirections.
This rule allows you to precisely define and enforce the variables and function names on your team should use.
No more limiting yourself to camelCase, snake_case, PascalCase or oHungarianNotation. Id-match has all your needs covered!

## Rule Details

This rule requires identifiers in assignments and `function` definitions to match a specified regular expression.

## Options

This rule has a string option for the specified regular expression.

For example, to enforce a camelcase naming convention:

```json
{
    "id-match": ["error", "^[a-z]+([A-Z][a-z]+)*$"]
}
```

Examples of **correct** code for this rule with the `"^[a-z]+([A-Z][a-z]+)*$"` option:

```js
/*eslint id-match: ["error", "^[a-z]+([A-Z][a-z]+)*$"]*/

var myFavoriteColor   = "#112C85";
var foo = bar.baz_boom;
var foo = { qux: bar.baz_boom };
do_something();
var obj = {
    my_pref: 1
};
```

Examples of **incorrect** code for this rule with the `"^[a-z]+([A-Z][a-z]+)*$"` option:

```js
/*eslint id-match: ["error", "^[a-z]+([A-Z][a-z]+)*$"]*/

var my_favorite_color = "#112C85";
var _myFavoriteColor  = "#112C85";
var myFavoriteColor_  = "#112C85";
var MY_FAVORITE_COLOR = "#112C85";
function do_something() {
    // ...
}
obj.do_something = function() {
    // ...
};
```

This rule has an object option:

* `"properties": true` requires object properties to match the specified regular expression
* `"onlyDeclarations": true` requires only `var`, `function`, and `class` declarations to match the specified regular expression

### properties

Examples of **incorrect** code for this rule with the `"^[a-z]+([A-Z][a-z]+)*$", { "properties": true }` options:

```js
/*eslint id-match: ["error", "^[a-z]+([A-Z][a-z]+)*$", { "properties": true }]*/

var obj = {
    my_pref: 1
};
```

### onlyDeclarations

Examples of **correct** code for this rule with the `"^[a-z]+([A-Z][a-z]+)*$", { "onlyDeclarations": true }` options:

```js
/*eslint id-match: [2, "^[a-z]+([A-Z][a-z]+)*$", { "onlyDeclarations": true }]*/

do_something(__dirname);
```

## When Not To Use It

If your rules are too complex, it is possible that you encounter performance issues due to the nature of the job.
