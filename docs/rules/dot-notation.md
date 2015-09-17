# Require Dot Notation (dot-notation)

In JavaScript, one can access properties using the dot notation (`foo.bar`) or square-bracket notation (`foo["bar"]`). However, the dot notation is often preferred because it is easier to read, less verbose, and works better with aggressive JavaScript minimizers.

```js
foo["bar"];
```

## Rule Details

This rule is aimed at maintaining code consistency and improving code readability by encouraging use of the dot notation style whenever possible. As such, it will warn when it encounters an unnecessary use of square-bracket notation.

The following patterns are considered problems:

```js
/*eslint dot-notation: 2*/

var x = foo["bar"]; /*error ["bar"] is better written in dot notation.*/
```

The following patterns are not considered problems:

```js
/*eslint dot-notation: 2*/

var x = foo.bar;

var x = foo[bar];    // Property name is a variable, square-bracket notation required
```

### Options

This rule accepts a single options argument with the following defaults:

```json
{
    "rules": {
        "dot-notation": [2, {"allowKeywords": true, "allowPattern": ""}]
    }
}
```

#### `allowKeywords`

Set the `allowKeywords` option to `false` (default is `true`) to follow ECMAScript version 3 compatible style, avoiding dot notation for reserved word properties.

```json
  "dot-notation": [2, {"allowKeywords": false}],
```

The following patterns are not considered problems:

```js
/*eslint dot-notation: [2, {"allowKeywords": false}]*/

var foo = { "class": "CS 101" }
var x = foo["class"]; // Property name is a reserved word, square-bracket notation required
```

#### `allowPattern`

Set the `allowPattern` option to a regular expression string to allow bracket notation for property names that match a pattern (by default, no pattern is tested).

For example, when preparing data to be sent to an external API, it is often required to use property names that include underscores.  If the `camelcase` rule is in effect, these [snake case](http://en.wikipedia.org/wiki/Snake_case) properties would not be allowed.  By providing an `allowPattern` to the `dot-notation` rule, these snake case properties can be accessed with bracket notation.

Example configuration:

```json
{
    "rules": {
        "camelcase": 2
        "dot-notation": [2, {"allowPattern": "^[a-z]+(_[a-z]+)+$"}]
    }
}
```

Example code patterns:

```js
/*eslint camelcase: 2*/
/*eslint dot-notation: [2, {"allowPattern": "^[a-z]+(_[a-z]+)+$"}]*/

var data = {};
data.foo_bar = 42;    /*error Identifier 'foo_bar' is not in camel case.*/

var data = {};
data["fooBar"] = 42;  /*error ["fooBar"] is better written in dot notation.*/

var data = {};
data["foo_bar"] = 42; // no warning
```
