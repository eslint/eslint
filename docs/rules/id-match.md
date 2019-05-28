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

This rule has an object option:

* `"properties": true` requires object properties to match the specified regular expression
* `"propertiesPattern": String` can seprately set properties id-match pattern, its value will be copied from main pattern if not provided
* `"onlyDeclarations": true` requires only `var`, `function`, and `class` declarations to match the specified regular expression
* `"onlyDeclarations": false` requires all variable names to match the specified regular expression
* `"ignoreDestructuring": false` (default) enforces `id-match` for destructured identifiers
* `"ignoreDestructuring": true` does not check destructured identifiers
* `"errorMessage": String` can customize some more humanized error report message for main pattern
* `"propertiesErrorMessage": String` can customize some more humanized error report message for properties pattern

### properties

Examples of **incorrect** code for this rule with the `"^[a-z]+([A-Z][a-z]+)*$", { "properties": true }` options:

```js
/*eslint id-match: ["error", "^[a-z]+([A-Z][a-z]+)*$", { "properties": true }]*/

var obj = {
    my_pref: 1
};
```

### propertiesPattern

Examples of **incorrect** code for this rule with the `"^[a-zA-Z]+$", { "properties": true, "propertiesPattern": "^[a-z][a-zA-Z]*$" }` options:

```js
/*eslint id-match: ["error", "^[a-zA-Z]+$", { "properties": true, "propertiesPattern": "^[a-z][a-zA-Z]*$" }]*/

var ClassA = { Name: "class-a" };
```

Examples of **correct** code for this rule with the `"^[a-zA-Z]+$", { "properties": true, "propertiesPattern": "^[a-z][a-zA-Z]*$" }` options:

```js
/*eslint id-match: ["error", "^[a-zA-Z]+$", { "properties": true, "propertiesPattern": "^[a-z][a-zA-Z]*$" }]*/

var ClassA = { name: "class-a" };
var x = { [ClassA.name]: false };

var x = { [Math.max(1, 2)]: false };
```

### onlyDeclarations

Examples of **correct** code for this rule with the `"^[a-z]+([A-Z][a-z]+)*$", { "onlyDeclarations": true }` options:

```js
/*eslint id-match: [2, "^[a-z]+([A-Z][a-z]+)*$", { "onlyDeclarations": true }]*/

do_something(__dirname);
```

### ignoreDestructuring: false

Examples of **incorrect** code for this rule with the default `"^[^_]+$", { "ignoreDestructuring": false }` option:

```js
/*eslint id-match: [2, "^[^_]+$", { "ignoreDestructuring": false }]*/

var { category_id } = query;

var { category_id = 1 } = query;

var { category_id: category_id } = query;

var { category_id: category_alias } = query;

var { category_id: categoryId, ...other_props } = query;
```

### ignoreDestructuring: true

Examples of **incorrect** code for this rule with the `"^[^_]+$", { "ignoreDestructuring": true }` option:

```js
/*eslint id-match: [2, "^[^_]+$", { "ignoreDestructuring": true }]*/

var { category_id: category_alias } = query;

var { category_id, ...other_props } = query;
```

Examples of **correct** code for this rule with the `"^[^_]+$", { "ignoreDestructuring": true }` option:

```js
/*eslint id-match: [2, "^[^_]+$", { "ignoreDestructuring": true }]*/

var { category_id } = query;

var { category_id = 1 } = query;

var { category_id: category_id } = query;
```

### errorMessage: String

This option is provided to output humanized error reports, example of `errorMessage` option:

```js
/*eslint id-match: [2, "^[a-z]+[a-zA-Z0-9]*$", { "errorMessage": "Identifier '{{name}}' in not in lower camelcase." }]*/

var UpperCamelcase = 1;
```

Error report will be: `Identifier 'UpperCamelcase' in not in lower camelcase.`.

### propertiesErrorMessage: String

This option is similar with errorMessage, the only difference is this message is for properties error report.

If not set, the value of this option will be the same as `errorMessage` option.

## When Not To Use It

If you don't want to enforce any particular naming convention for all identifiers, or your naming convention is too complex to be enforced by configuring this rule, then you should not enable this rule.
