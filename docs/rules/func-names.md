# Require Function Expressions to have a Name

A pattern that's becoming more common is to give function expressions names to aid in debugging, such as:

```js
Foo.prototype.bar = function bar() {}
```

## Rule Details

This rule will warn when you do the following:

```js
Foo.prototype.bar = function() {}
```