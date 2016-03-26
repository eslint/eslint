# Disallow Unused Variables (no-unused-vars)

Variables that are declared and not used anywhere in the code are most likely an error due to incomplete refactoring. Such variables take up space in the code and can lead to confusion by readers.

## Rule Details

This rule is aimed at eliminating unused variables, functions, and parameters of functions.

A variable is considered to be used if any of the following are true:

* It represents a function that is called (`doSomething()`)
* It is read (`var y = x`)
* It is passed into a function as an argument (`doSomething(x)`)

A variable is *not* considered to be used if it is only ever assigned to (`var x = 5`) or declared.

Examples of **incorrect** code for this rule:

```js
/*eslint no-unused-vars: "error"*/
/*global some_unused_var*/

//It checks variables you have defined as global
some_unused_var = 42;

var x;

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

Examples of **correct** code for this rule:

```js
/*eslint no-unused-vars: "error"*/

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

### exported

In environments outside of CommonJS or ECMAScript modules, you may use `var` to create a global variable that may be used by other scripts. You can use the `/* exported variableName */` comment block to indicate that this variable is being exported and therefore should not be considered unused.

Note that `/* exported */` has no effect for any of the following:

* when the environment is `node` or `commonjs`
* when `parserOptions.sourceType` is `module`
* when `ecmaFeatures.globalReturn` is `true`

## Options

This rule takes one argument which can be a string or an object. The string settings are the same as those of the `vars` property (explained below).

By default this rule is enabled with `all` option for variables and `after-used` for arguments.

```json
{
    "rules": {
        "no-unused-vars": ["error", { "vars": "all", "args": "after-used" }]
    }
}
```

### vars

The `vars` option has two settings:

* `all` checks all variables for usage, including those in the global scope. This is the default setting.
* `local` checks only that locally-declared variables are used but will allow global variables to be unused.

#### vars: local

Examples of **correct** code for the `{ "vars": "local" }` option:

```js
/*eslint no-unused-vars: ["error", { "vars": "local" }]*/
/*global some_unused_var */

some_unused_var = 42;
```

### varsIgnorePattern

The `varsIgnorePattern` option specifies exceptions not to check for usage: variables whose names match a regexp pattern. For example, variables whose names contain `ignored` or `Ignored`.

Examples of **correct** code for the `{ "varsIgnorePattern": "[iI]gnored" }` option:

```js
/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }]*/

var firstVarIgnored = 1;
var secondVar = 2;
console.log(secondVar);
```

### args

The `args` option has three settings:

* `after-used` - only the last argument must be used. This allows you, for instance, to have two named parameters to a function and as long as you use the second argument, ESLint will not warn you about the first. This is the default setting.
* `all` - all named arguments must be used.
* `none` - do not check arguments.

#### args: after-used

Examples of **incorrect** code for the default `{ "args": "after-used" }` option:

```js
/*eslint no-unused-vars: ["error", { "args": "after-used" }]*/

// 1 error
// "baz" is defined but never used
(function(foo, bar, baz) {
    return bar;
})();
```

Examples of **correct** code for the default `{ "args": "after-used" }` option:

```js
/*eslint no-unused-vars: ["error", {"args": "after-used"}]*/

(function(foo, bar, baz) {
    return baz;
})();
```

#### args: all

Examples of **incorrect** code for the `{ "args": "all" }` option:

```js
/*eslint no-unused-vars: ["error", { "args": "all" }]*/

// 2 errors
// "foo" is defined but never used
// "baz" is defined but never used
(function(foo, bar, baz) {
    return bar;
})();
```

#### args: none

Examples of **correct** code for the `{ "args": "none" }` option:

```js
/*eslint no-unused-vars: ["error", { "args": "none" }]*/

(function(foo, bar, baz) {
    return bar;
})();
```

### argsIgnorePattern

The `argsIgnorePattern` option specifies exceptions not to check for usage: arguments whose names match a regexp pattern. For example, variables whose names begin with an underscore.

Examples of **correct** code for the `{ "argsIgnorePattern": "^_" }` option:

```js
/*eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }]*/

function foo(x, _y) {
    return x + 1;
}
foo();
```

### caughtErrors

The `caughtErrors` option is used for `catch` block arguments validation.

It has two settings:

* `none` - do not check error objects. This is the default setting.
* `all` - all named arguments must be used.

#### caughtErrors: none

Not specifying this rule is equivalent of assigning it to `none`.

Examples of **correct** code for the `{ "caughtErrors": "none" }` option:

```js
/*eslint no-unused-vars: ["error", { "caughtErrors": "none" }]*/

try {
    //...
} catch (err) {
    console.error("errors");
}
```

#### caughtErrors: all

Examples of **incorrect** code for the `{ "caughtErrors": "all" }` option:

```js
/*eslint no-unused-vars: ["error", { "caughtErrors": "all" }]*/

// 1 error
// "err" is defined but never used
try {
    //...
} catch (err) {
    console.error("errors");
}
```

### caughtErrorsIgnorePattern

The `caughtErrorsIgnorePattern` option specifies exceptions not to check for usage: catch arguments whose names match a regexp pattern. For example, variables whose names begin with a string 'ignore'.

Examples of **correct** code for the `{ "caughtErrorsIgnorePattern": "^ignore" }` option:

```js
/*eslint no-unused-vars: ["error", { "caughtErrorsIgnorePattern": "^ignore" }]*/

try {
    //...
} catch (ignoreErr) {
    console.error("errors");
}
```


## When Not To Use It

If you don't want to be notified about unused variables or function arguments, you can safely turn this rule off.
