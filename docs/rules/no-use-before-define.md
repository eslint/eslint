# Disallow Early Use (no-use-before-define)

In JavaScript, prior to ES6, variable and function declarations are hoisted to the top of a scope, so it's possible to use identifiers before their formal declarations in code. This can be confusing and some believe it is best to always declare variables and functions before using them.

In ES6, block-level bindings (`let` and `const`) introduce a "temporal dead zone" where a `ReferenceError` will be thrown with any attempt to access the variable before its declaration.

## Rule Details

This rule will warn when it encounters a reference to an identifier that has not yet been declared.

Examples of **incorrect** code for this rule:

```js
/*eslint no-use-before-define: 2*/
/*eslint-env es6*/

alert(a);
var a = 10;

f();
function f() {}

function g() {
    return b;
}
var b = 1;

// With blockBindings: true
{
    alert(c);
    let c = 1;
}
```

Examples of **correct** code for this rule:

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

## Options

```json
{
    "no-use-before-define": [2, { "functions": true, "classes": true }]
}
```

* `functions` (`boolean`) -
  The flag which shows whether or not this rule checks function declarations.
  If this is `true`, this rule warns every reference to a function before the function declaration.
  Otherwise, ignores those references.
  Function declarations are hoisted, so it's safe.
  Default is `true`.
* `classes` (`boolean`) -
  The flag which shows whether or not this rule checks class declarations of upper scopes.
  If this is `true`, this rule warns every reference to a class before the class declaration.
  Otherwise, ignores those references if the declaration is in upper function scopes.
  Class declarations are not hoisted, so it might be danger.
  Default is `true`.

This rule accepts `"nofunc"` string as a option.
`"nofunc"` is the same as `{ "functions": false, "classes": true }`.

### functions

Examples of **correct** code for the `{ "functions": false }` option:

```js
/*eslint no-use-before-define: [2, { "functions": false }]*/

f();
function f() {}
```

### classes

Examples of **incorrect** code for the `{ "classes": false }` option:

```js
/*eslint no-use-before-define: [2, { "classes": false }]*/
/*eslint-env es6*/

new A();
class A {
}
```

Examples of **correct** code for the `{ "classes": false }` option:

```js
/*eslint no-use-before-define: [2, { "classes": false }]*/
/*eslint-env es6*/

function foo() {
    return new A();
}

class A {
}
```
