# Disallow Unused Variables (no-unused-vars)

Variables that are declared and not used anywhere in the code are most likely an error due to incomplete refactoring. Such variables take up space in the code and can lead to confusion by readers.

## Rule Details

This rule is aimed at eliminating unused variables, functions and variables in parameters of functions, as such, warns when one is found.

A variable is considered to be used when it:

1. Represents a function that is called (`doSomething()`)
1. Is read (`var y = x`)
1. Is passed into a function as an argument (`doSomething(x)`)

A variable is *not* considered read if it is only ever assigned to (`var x = 5`) or declared.

The following patterns are considered problems:

```js
/*eslint no-unused-vars: 2*/
/*global some_unsed_var */   /*error "some_unsed_var" is defined but never used*/

//It checks variables you have defined as global
some_unsed_var = 42;

var x;                       /*error "x" is defined but never used*/

var y = 10;                  /*error "y" is defined but never used*/
y = 5;

// By default, unused arguments cause warnings.
(function(foo) {             /*error "foo" is defined but never used*/
    return 5;
})();

// Unused recursive functions also cause warnings.
function fact(n) {           /*error "fact" is defined but never used*/
    if (n < 2) return 1;
    return n * fact(n - 1);
}
```

The following patterns are not considered problems:

```js
/*eslint no-unused-vars: 2*/

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

In environments outside of CommonJS or ECMAScript modules, you may use `var` to create a global variable that may be used by other scripts. You can use the `/* exported variableName */` comment block to indicate that this variable is being exported and therefore should not be considered unused. Note that `/* exported */` has no effect when used with the `node` or `commonjs` environments or when `ecmaFeatures.modules` is true.

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

##### with `{ "args": "all" }`

```js
/*eslint no-unused-vars: [2, { "args": "all" }]*/

(function(foo, bar, baz) { /*error "foo" is defined but never used*/ /*error "baz" is defined but never used*/
    return bar;
})();
```

##### with `{ "args": "after-used" }`

```js
/*eslint no-unused-vars: [2, { "args": "after-used" }]*/

(function(foo, bar, baz) { /*error "baz" is defined but never used*/
    return bar;
})();
```

##### with `{ "args": "none" }`

```js
/*eslint no-unused-vars: [2, { "args": "none" }]*/

(function(foo, bar, baz) {
    return bar;
})();
```

#### Ignore identifiers that match specific patterns

* `varsIgnorePattern` - all variables that match this regexp pattern will not be checked.
* `argsIgnorePattern` - all arguments that match this regexp pattern will not be checked.

##### Examples

* Ignore all unused function arguments with a leading underscore

    ```json
    {
        "rules": {
            "no-unused-vars": [2, {"args": "after-used", "argsIgnorePattern": "^_"}]
        }
    }
    ```

    With this configuration, this rule will not warn about the following code:

    ```js
    /*eslint no-unused-vars: [2, {"args": "after-used", "argsIgnorePattern": "^_"}]*/

    function foo(x, _y) {
        return x + 1;
    }
    foo();
    ```

* Ignore all unused variables which contain the term `ignored` or `Ignored`:

    ```json
        {
            "ecmaFeatures": { "destructuring": true },
            "rules": {
                "no-unused-vars": [2, {"vars": "all", "varsIgnorePattern": "[iI]gnored"}]
            }
        }
    ```

    With this configuration, this rule will not warn about the following code:

    ```js
    /*eslint no-unused-vars: [2, {"args": "after-used", "varsIgnorePattern": "[iI]gnored"}]*/

    var [ firstItemIgnored, secondItem ] = items;
    console.log(secondItem);
    ```


## When Not to Use It

If you don't want to be notified about unused variables or function arguments, you can safely turn this rule off.
