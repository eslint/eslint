# Disallow Early Use (no-use-before-define)

In JavaScript, prior to ES6, variable and function declarations are hoisted to the top of a scope, so it's possible to use identifiers before their formal declarations in code. This can be confusing and some believe it is best to always declare variables and functions before using them.

In ES6, block-level bindings (`let` and `const`) introduce a "temporal dead zone" where a `ReferenceError` will be thrown with any attempt to access the variable before its declaration.

## Rule Details

This rule will warn when it encounters a reference to an identifier that has not been yet declared.

The following patterns are considered problems:

```js
/*eslint no-use-before-define: 2*/
/*eslint-env es6*/

alert(a);       /*error a was used before it was defined*/
var a = 10;

f();            /*error f was used before it was defined*/
function f() {}

function g() {
    return b;  /*error b was used before it was defined*/
}
var b = 1;

// With blockBindings: true
{
    alert(c);  /*error c was used before it was defined*/
    let c = 1;
}
```

The following patterns are not considered problems:

```js
/*eslint no-use-before-define: 2*/
/*eslint-env es6*/

var a;
a = 10;
alert(a);

function f() {}
f(1);

var b = 1;
function g() {
    return b;
}

// With blockBindings: true
{
    let C;
    c++;
}
```

The rule accepts an additional option that can take the value `"nofunc"`. If this option is active, function declarations are exempted from the rule, so it is allowed to use a function name *before* its declaration.

The following patterns are not considered problems when `"nofunc"` is specified:

```js
/*eslint no-use-before-define: [2, "nofunc"]*/

f();
function f() {}
```
