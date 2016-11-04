# Require or disallow named `function` expressions (func-names)

A pattern that's becoming more common is to give function expressions names to aid in debugging. For example:

```js
Foo.prototype.bar = function bar() {};
```

Adding the second `bar` in the above example is optional.  If you leave off the function name then when the function throws an exception you are likely to get something similar to `anonymous function` in the stack trace.  If you provide the optional name for a function expression then you will get the name of the function expression in the stack trace.

## Rule Details

This rule can enforce or disallow the use of named function expressions.

## Options

This rule has a string option:

* `"always"` (default) requires function expressions to have a name
* `"as-needed"` requires function expressions to have a name, if the name cannot be assigned automatically in an ES6 environment
* `"never"` disallows named function expressions, except in recursive functions, where a name is needed

### always

Examples of **incorrect** code for this rule with the default `"always"` option:

```js
/*eslint func-names: ["error", "always"]*/

Foo.prototype.bar = function() {};

(function() {
    // ...
}())
```

Examples of **correct** code for this rule with the default `"always"` option:

```js
/*eslint func-names: ["error", "always"]*/

Foo.prototype.bar = function bar() {};

(function bar() {
    // ...
}())
```

### as-needed

ECMAScript 6 introduced a `name` property on all functions. The value of `name` is determined by evaluating the code around the function to see if a name can be inferred. For example, a function assigned to a variable will automatically have a `name` property equal to the name of the variable. The value of `name` is then used in stack traces for easier debugging.

Examples of **incorrect** code for this rule with the default `"as-needed"` option:

```js
/*eslint func-names: ["error", "as-needed"]*/

Foo.prototype.bar = function() {};

(function() {
    // ...
}())
```

Examples of **correct** code for this rule with the default `"as-needed"` option:

```js
/*eslint func-names: ["error", "as-needed"]*/

var bar = function() {};

(function bar() {
    // ...
}())
```

### never

Examples of **incorrect** code for this rule with the `"never"` option:

```js
/*eslint func-names: ["error", "never"]*/

Foo.prototype.bar = function bar() {};

(function bar() {
    // ...
}())
```

Examples of **correct** code for this rule with the `"never"` option:

```js
/*eslint func-names: ["error", "never"]*/

Foo.prototype.bar = function() {};

(function() {
    // ...
}())
```

## Further Reading

* [Functions Explained](http://markdaggett.com/blog/2013/02/15/functions-explained/)
* [Function Names in ES6](http://www.2ality.com/2015/09/function-names-es6.html)

## Compatibility

* **JSCS**: [requireAnonymousFunctions](http://jscs.info/rule/requireAnonymousFunctions)
* **JSCS**: [disallowAnonymousFunctions](http://jscs.info/rule/disallowAnonymousFunctions)
