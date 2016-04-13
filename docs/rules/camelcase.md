# Require Camelcase (camelcase)

When it comes to naming variables, style guides generally fall into one of two camps: camelcase (`variableName`) and underscores (`variable_name`). This rule focuses on using the camelcase approach. If your style guide calls for camelcasing your variable names, then this rule is for you!

## Rule Details

This rule looks for any underscores (`_`) located within the source code. It ignores leading and trailing underscores and only checks those in the middle of a variable name. If ESLint decides that the variable is a constant (all uppercase), then no warning will be thrown. Otherwise, a warning will be thrown. This rule only flags definitions and assignments but not function calls.

## Options

This rule has an object option:

* `"properties": "always"` (default) enforces camelcase style for property names
* `"properties": "never"` does not check property names

### always

Examples of **incorrect** code for this rule with the default `{ "properties": "always" }` option:

```js
/*eslint camelcase: "error"*/

var my_favorite_color = "#112C85";

function do_something() {
    // ...
}

obj.do_something = function() {
    // ...
};

var obj = {
    my_pref: 1
};
```

Examples of **correct** code for this rule with the default `{ "properties": "always" }` option:

```js
/*eslint camelcase: "error"*/

var myFavoriteColor   = "#112C85";
var _myFavoriteColor  = "#112C85";
var myFavoriteColor_  = "#112C85";
var MY_FAVORITE_COLOR = "#112C85";
var foo = bar.baz_boom;
var foo = { qux: bar.baz_boom };

obj.do_something();

var { category_id: category } = query;
```

### never

Examples of **correct** code for this rule with the `{ "properties": "never" }` option:

```js
/*eslint camelcase: ["error", {properties: "never"}]*/

var obj = {
    my_pref: 1
};
```

## When Not To Use It

If you have established coding standards using a different naming convention (separating words with underscores), turn this rule off.
