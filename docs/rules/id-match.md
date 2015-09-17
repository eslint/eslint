# Require IDs to match a pattern (id-match)

> "There are only two hard things in Computer Science: cache invalidation and naming things." — Phil Karlton

Naming things consistently in a project is an often underestimated aspect of code creation.
When done right, it can save your team hours of unnecessary head scratching and misdirections.
This rule allows you to precisely define and enforce the variables and function names on your team should use.
No more limiting yourself to camelCase, snake_case, PascalCase or oHungarianNotation. Id-match has all your needs covered!

## Rule Details

This rule compares assignments and function definitions to a provided regular expression, giving you the maximum flexibility on the matter.
It doesn't apply to function calls, so that you can still use functions or objects you do not have control over.

### Options

This rule needs a text RegExp to operate with, and accepts an options map. Its signature is as follows:

```json
{
    "rules": {
        "id-match": [2, "^[a-z]+([A-Z][a-z]+)*$", {"properties": false}]
    }
}
```

`properties` can have the following values:

1. `true` is the default and checks all property names
2. `false` does not check property names at all (default)

For the rule in this example, which is simply camelcase, the following patterns are considered problems:

```js
/*eslint id-match: [2, "^[a-z]+([A-Z][a-z]+)*$", {"properties": true}]*/

var my_favorite_color = "#112C85"; /*error Identifier 'my_favorite_color' does not match the pattern '^[a-z]+([A-Z][a-z]+)*$'.*/

var _myFavoriteColor  = "#112C85"; /*error Identifier '_myFavoriteColor' does not match the pattern '^[a-z]+([A-Z][a-z]+)*$'.*/

var myFavoriteColor_  = "#112C85"; /*error Identifier 'myFavoriteColor_' does not match the pattern '^[a-z]+([A-Z][a-z]+)*$'.*/

var MY_FAVORITE_COLOR = "#112C85"; /*error Identifier 'MY_FAVORITE_COLOR' does not match the pattern '^[a-z]+([A-Z][a-z]+)*$'.*/

function do_something() {          /*error Identifier 'do_something' does not match the pattern '^[a-z]+([A-Z][a-z]+)*$'.*/
    // ...
}

obj.do_something = function() {    /*error Identifier 'do_something' does not match the pattern '^[a-z]+([A-Z][a-z]+)*$'.*/
    // ...
};

var obj = {
    my_pref: 1                     /*error Identifier 'my_pref' does not match the pattern '^[a-z]+([A-Z][a-z]+)*$'.*/
};
```

The following patterns are not considered problems:

```js
/*eslint id-match: [2, "^[a-z]+([A-Z][a-z]+)*$", {"properties": false}]*/

var myFavoriteColor   = "#112C85";
var foo = bar.baz_boom;
var foo = { qux: bar.baz_boom };

obj.do_something();

/*eslint id-match: [2, "", {properties: false}]*/
var obj = {
    my_pref: 1
};
```

## When Not To Use It

If your rules are too complex, it is possible that you encounter performance issues due to the nature of the job.
