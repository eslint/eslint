# Disallow Unused Variables (no-unused-vars)

Variables that are declared and not used anywhere in the code are most likely an error due to incomplete refactoring. Such variables take up space in the code and can lead to confusion by readers.

## Rule Details

This rule is aimed at eliminating unused variables, functions and variables in parameters of functions, as such, warns when one is found.

A variable is considered to be used when it:

1. Represents a function that is called (`doSomething()`)
1. Is read (`var y = x`)
1. Is passed into a function as an argument (`doSomething(x)`)
1. Is used in the control sequence of a loop (`for (x in y) {}`)

A variable is *not* considered read if it is only ever assigned to (`var x = 5`) or declared.

The following patterns are considered warnings:

```js

//It checks variables you have defined as global
/*global some_used_var */

var x = 10;

var y = 10;
y = 5;

// By default, unused arguments cause warnings.
(function(foo) {
    return 5;
})();

// Unused recursive functions also cause warnings.
function fact(n) {
    if (n < 2) return 1;
    return n * fact(n - 1);
}
```

The following patterns are not considered warnings:

```js
var x = 10;
alert(x);

// foo is considered used here
myFunc(function foo() {
    // ...
}.bind(this));

(function(foo) {
    return foo;
})();
```

### Exporting Variables

In some environments you may use `var` to create a global variable that may be used by other scripts. You can
 use the `/* exported variableName */` comment block to indicate that this variable may be used elsewhere.

### Options

By default this rule is enabled with `all` option for variables and `after-used` for arguments.

```json
{
    "rules": {
        "no-unused-vars": [2, {"vars": "all", "args": "after-used"}]
    }
}
```

#### vars

This option has two settings:

* `all` checks all variables for usage, including those in the global scope. This is the default setting.
* `local` checks only that locally-declared variables are used but will allow global variables to be unused.

#### args

This option has three settings:

* `all` - all named arguments must be used.
* `after-used` - only the last argument must be used. This allows you, for instance, to have two named parameters to a function and as long as you use the second argument, ESLint will not warn you about the first. This is the default setting.
* `none` - do not check arguments.

The following code:

* will throw `baz is defined but never used` when `args`: `after-used`
* will throw `foo is defined but never used` and `baz is defined but never used` when `args`: `all`
* will throw nothing when `args`: `none`

```js
(function(foo, bar, baz) {
    return bar;
})();
```

## When Not to Use It

If you don't want to be notified about unused variables or function arguments, you can safely turn this rule off.
