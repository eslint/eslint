# Disallow Shadowing (no-shadow)

Shadowing is the process by which a local variable shares the same name as a variable in its containing scope. For example:

```js
var a = 3;
function b() {
    var a = 10;
}
```

In this case, the variable `a` inside of `b()` is shadowing the variable `a` in the global scope. This can cause confusion while reading the code and it's impossible to access the global variable.

## Rule Details

This rule aims to eliminate shadowed variable declarations.

The following patterns are considered problems:

```js
/*eslint no-shadow: 2*/
/*eslint-env es6*/

var a = 3;
function b() {
    var a = 10;       /*error a is already declared in the upper scope.*/
}

var b = function () {
    var a = 10;       /*error a is already declared in the upper scope.*/
}

function b(a) {       /*error a is already declared in the upper scope.*/
    a = 10;
}
b(a);

if (true) {
    let a = 5;        /*error a is already declared in the upper scope.*/
}
```

### Options

This rule takes one option, an object, with properties `"builtinGlobals"`, `"hoist"` and `"allow"`.

```json
{
    "no-shadow": [2, {"builtinGlobals": false, "hoist": "functions", "allow": []}]
}
```

#### builtinGlobals

`false` by default.
If this is `true`, this rule checks with built-in global variables such as `Object`, `Array`, `Number`, ...

When `{"builtinGlobals": true}`, the following patterns are considered problems:

```js
/*eslint no-shadow: [2, { "builtinGlobals": true }]*/

function foo() {
    var Object = 0; /*error Object is already declared in the upper scope.*/
}
```

#### hoist

The option has three settings:

* `all` - reports all shadowing before the outer variables/functions are defined.
* `functions` (by default) - reports shadowing before the outer functions are defined.
* `never` - never report shadowing before the outer variables/functions are defined.

##### { "hoist": "all" }

With `"hoist"` set to `"all"`, both `let a` and `let b` in the `if` statement are considered problems.

```js
/*eslint no-shadow: [2, { "hoist": "all" }]*/
/*eslint-env es6*/

if (true) {
    let a = 3;    /*error a is already declared in the upper scope.*/
    let b = 6;    /*error b is already declared in the upper scope.*/
}

let a = 5;
function b() {}
```

##### { "hoist": "functions" } (default)

With `"hoist"` set to `"functions"`, `let b` is considered a warning. But `let a` in the `if` statement is not considered a warning, because it is before `let a` of the outer scope.

```js
/*eslint no-shadow: [2, { "hoist": "functions" }]*/
/*eslint-env es6*/

if (true) {
    let a = 3;
    let b = 6;    /*error b is already declared in the upper scope.*/
}

let a = 5;
function b() {}
```

##### { "hoist": "never" }

With `"hoist"` set to `"never"`, neither `let a` nor `let b` in the `if` statement are considered problems, because they are before the declarations of the outer scope.

```js
/*eslint no-shadow: [2, { "hoist": "never" }]*/
/*eslint-env es6*/

if (true) {
    let a = 3;
    let b = 6;
}

let a = 5;
function b() {}
```

#### allow

The option is an array of identifier names to be allowed (ie. "resolve", "reject", "done", "cb" etc.):

```json
{
    "rules": {
        "no-shadow": [2, {"allow": ["done"]}]
    }
}
```

Allows for the following code to be valid:

```js
import async from 'async';

function foo(done) {
  async.map([1, 2], function (e, done) {
    done(null, e * 2)
  }, done);
}

foo(function (err, result) {
  console.log({ err, result });
});
```

## Further Reading

* [Variable Shadowing](http://en.wikipedia.org/wiki/Variable_shadowing)
