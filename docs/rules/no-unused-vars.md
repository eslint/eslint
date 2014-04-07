# Disallow Unused Variables

Variables that are declared and not used anywhere in the code are most likely an error due to incomplete refactoring. Such variables take up space in the code and can lead to confusion by readers.

## Rule Details

This rule is aimed at eliminating unused variables, functions and variables in parameters of functions, as such, warns when one is found.

The following patterns are considered warnings:

```js
var x = 10;
```
```js
var x = 10; x = 5;
```

By default, unused arguments cause warnings:

```js
(function(foo) {
    return 5;
})();
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

### Options

By default this rule is enabled with `local` option for variables and `after-used` for arguments.

```json
{
    "rules": {
        "no-unused-vars": [2, {"vars": "local", "args": "after-used"}]
    }
}
```


#### vars

When sets to `local` will check that all local variables are used, but it will allow global variables to be unused.

`all` option will disable this behavior and will not allow any variables to be unused.

#### args

Sets to `after-used` will skip some unused arguments. No warning will be thrown for unused variables in the parameters of function declarations or function expressions if any of the variables following the unused variable are used in that function's scope. This allows you to have unused variables in a function.

`all` checks that all arguments to be used.

`none` skips all arguments to check.

The following code:

- will throw `baz is defined but never used` when `args`: `after-used`
- will throw `foo is defined but never used` and `baz is defined but never used` when `args`: `all`
- will throw nothing when `args`: `none`

```js
(function(foo, bar, baz) {
    return bar;
})();
```

