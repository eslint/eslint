# Require or disallow spaces following keywords (space-after-keywords)

Some style guides will require or disallow spaces following the certain keywords.

```js
if (condition) {
    doSomething();
} else {
    doSomethingElse();
}

if(condition) {
    doSomething();
}else{
    doSomethingElse();
}
```

## Rule Details

This rule will enforce consistency of spacing after the keywords `if`, `else`, `for`, `while`, `do`, `switch`, `try`, `catch`, `finally`, and `with`.

This rule takes one argument. If it is `"always"` then the keywords must be followed by at least one space. If `"never"`
then there should be no spaces following. The default is `"always"`.

The following patterns are considered warnings:

```js
if(a) {}
```

```js
if (a) {} else{}
```

```js
do{} while (a);
```

```js
// When ["never"]
if (a) {}
```

The following patterns are not considered warnings:

```js
if (a) {}
```

```js
if (a) {} else {}
```

```js
// When ["never"]
if(a) {}
```

### Advanced configuration

The `function` keyword is not checked by the default configuration of this rule. If you want to enforce strict spacing
after the `function` keyword you can enable the `checkFunctionKeyword` configuration flag.

**Examples for valid configurations:**

1. Rule configured to enforce a whitespace after all `function` keyword occurrences.

    ```js
    // ...
    "space-after-keywords": [1, "always", { "checkFunctionKeyword": true } ]
    // ...
    ```

2. Rule configured to forbid whitespaces after a `function` keyword in anonymous function expressions.

    ```js
    // ...
    "space-after-keywords": [1, "never", { "checkFunctionKeyword": true } ]
    // ...
    ```
