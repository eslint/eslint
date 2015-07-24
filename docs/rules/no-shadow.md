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

The following patterns are considered warnings:

```js
var a = 3;
function b() {
    var a = 10;
}
```

```js
var a = 3;
var b = function () {
    var a = 10;
}
```

```js
var a = 3;
function b(a) {
    a = 10;
}
b(a);
```

```js
var a = 3;

if (true) {
    let a = 5;
}
```

### Options

This rule takes one option, an object, with properties `"builtinGlobals"`, `"hoist"`.

```json
{
    "no-shadow": [2, {"builtinGlobals": false, "hoist": "functions"}]
}
```

#### builtinGlobals

`false` by default.
If this is `true`, this rule checks with built-in global variables such as `Object`, `Array`, `Number`, ...

When `{"builtinGlobals": true}`, the following patterns are considered warnings:

```js
function foo() {
    var Object = 0; // shadowed the built-in globals.
}
```

#### hoist

The option has three settings:

* `all` - reports all shadowing before the outer variables/functions are defined.
* `functions` (by default) - reports shadowing before the outer functions are defined.
* `never` - never report shadowing before the outer variables/functions are defined.

Thought with the following codes:

```js
if (true) {
    let a = 3;
    let b = 6;
}

let a = 5;
function b() {}
```

* `all` - Both `let a` and `let b` in the `if` statement are considered warnings.
* `functions` - `let b` is considered warnings. But `let a` in the `if` statement is not considered warnings. Because there is it before `let a` of the outer scope.
* `never` - Both `let a` and `let b` in the `if` statement are not considered warnings. Because there are those before each declaration of the outer scope.

## Further Reading

* [Variable Shadowing](http://en.wikipedia.org/wiki/Variable_shadowing)
