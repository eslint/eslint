# Require or disallow spaces before function parentheses (space-before-function-parentheses)

Whitespace before function parentheses is always optional, but whitespace after the `function` keyword is only required
for named functions but not for anonymous functions.

```js
function withoutSpace(x) {
    // ...
}

function withSpace (x) {
    // ...
}

var anonymousWithoutSpace = function() {};

var anonymousWithSpace = function () {};
```

Some style guides may require a consistent spacing before function parentheses.

## Rule Details

This rule aims to enforce consistent spacing before function parentheses.

This rule takes one argument. If it is `"always"` then all named functions and anonymous functions must have space before function parentheses.
If `"never"` then all named functions and anonymous functions must not have space before function parentheses.
If you want different spacing for named and anonymous functions you can pass an configuration object as the rule argument to configure those separately
(e. g. `{"anonymous": "always", "named": "never"}`).

The default configuration is `"always"`.


The following patterns are considered warnings when configured `"always"`:

```js
function foo() {}

var bar function() {};

var bar = function foo() {};
```

The following patterns are not considered warnings when configured `"always"`:

```js
function foo () {}

var bar function () {};

var bar = function foo () {};
```

The following patterns are considered warnings when configured `"never"`:

```js
function foo () {}

var bar function () {};

var bar = function foo () {};
```

The following patterns are not considered warnings when configured `"never"`:

```js
function foo() {}

var bar function() {};

var bar = function foo() {};
```

The following patterns are considered warnings when configured `{"anonymous": "always", "named": "never"}`:

```js
function foo () {}

var bar = function() {};
```

The following patterns are not considered warnings when configured `{"anonymous": "always", "named": "never"}`:

```js
function foo() {}

var bar = function () {};
```

The following patterns are considered warnings when configured `{"anonymous": "never", "named": "always"}`:

```js
function foo() {}

var bar = function () {};
```

The following patterns are not considered warnings when configured `{"anonymous": "never", "named": "always"}`:

```js
function foo () {}

var bar = function() {};
```

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of spacing before function parenthesis.

## Related Rules

* [space-after-keywords](space-after-keywords.md)
* [space-return-throw-case](space-return-throw-case.md)
