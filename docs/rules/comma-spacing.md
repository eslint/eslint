# Enforces spacing around commas (comma-spacing)

Spacing around commas improves readability of a list of items. Although most of the style guidelines for languages prescribe adding a space after a comma and not before it, it is subjective to the preferences of a project.

```js
var foo = 1, bar = 2;
var foo = 1 ,bar = 2;
```

## Rule Details

This rule enforces consistent spacing before and after commas in variable declarations, array literals, object literals, function parameters, and sequences.

This rule does not apply in an `ArrayExpression` or `ArrayPattern` in either of the following cases:

* adjacent null elements
* an initial null element, to avoid conflicts with the [`array-bracket-spacing`](array-bracket-spacing.md) rule

## Options

This rule has an object option:

* `"before": false` (default) disallows spaces before commas
* `"before": true` requires one or more spaces before commas
* `"after": true` (default) requires one or more spaces after commas
* `"after": false` disallows spaces after commas

### after

Examples of **incorrect** code for this rule with the default `{ "before": false, "after": true }` options:

```js
/*eslint comma-spacing: ["error", { "before": false, "after": true }]*/

var foo = 1 ,bar = 2;
var arr = [1 , 2];
var obj = {"foo": "bar" ,"baz": "qur"};
foo(a ,b);
new Foo(a ,b);
function foo(a ,b){}
a ,b
```

Examples of **correct** code for this rule with the default `{ "before": false, "after": true }` options:

```js
/*eslint comma-spacing: ["error", { "before": false, "after": true }]*/

var foo = 1, bar = 2
    , baz = 3;
var arr = [1, 2];
var arr = [1,, 3]
var obj = {"foo": "bar", "baz": "qur"};
foo(a, b);
new Foo(a, b);
function foo(a, b){}
a, b
```

Example of **correct** code for this rule with initial null element for the default `{ "before": false, "after": true }` options:

```js
/*eslint comma-spacing: ["error", { "before": false, "after": true }]*/
/*eslint array-bracket-spacing: ["error", "always"]*/

var arr = [ , 2, 3 ]
```

### before

Examples of **incorrect** code for this rule with the `{ "before": true, "after": false }` options:

```js
/*eslint comma-spacing: ["error", { "before": true, "after": false }]*/

var foo = 1, bar = 2;
var arr = [1 , 2];
var obj = {"foo": "bar", "baz": "qur"};
new Foo(a,b);
function foo(a,b){}
a, b
```

Examples of **correct** code for this rule with the `{ "before": true, "after": false }` options:

```js
/*eslint comma-spacing: ["error", { "before": true, "after": false }]*/

var foo = 1 ,bar = 2 ,
    baz = true;
var arr = [1 ,2];
var arr = [1 ,,3]
var obj = {"foo": "bar" ,"baz": "qur"};
foo(a ,b);
new Foo(a ,b);
function foo(a ,b){}
a ,b
```

Examples of **correct** code for this rule with initial null element for the `{ "before": true, "after": false }` options:

```js
/*eslint comma-spacing: ["error", { "before": true, "after": false }]*/
/*eslint array-bracket-spacing: ["error", "never"]*/

var arr = [,2 ,3]
```

## When Not To Use It

If your project will not be following a consistent comma-spacing pattern, turn this rule off.


## Further Reading

* [Javascript](http://javascript.crockford.com/code.html)
* [Dojo Style Guide](https://dojotoolkit.org/reference-guide/1.9/developer/styleguide.html)


## Related Rules

* [array-bracket-spacing](array-bracket-spacing.md)
* [comma-style](comma-style.md)
* [space-in-brackets](space-in-brackets.md) (deprecated)
* [space-in-parens](space-in-parens.md)
* [space-infix-ops](space-infix-ops.md)
* [space-after-keywords](space-after-keywords.md)
* [space-unary-ops](space-unary-ops.md)
* [space-return-throw-case](space-return-throw-case.md)
