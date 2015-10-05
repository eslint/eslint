# Enforce/Disallow Variable Initializations (init-declarations)

In JavaScript, variables can be assigned during declaration, or at any point afterwards using an assignment statement. For example, in the following code, `foo` is initialized during declaration, while `bar` is initialized later.

```js
var foo = 1;
var bar;

if (foo) {
    bar = 1;
} else {
    bar = 2;
}
```

## Rule Details

This rule is aimed at enforcing or eliminating variable initializations during declaration. For example, in the following code, `foo` is initialized during declaration, while `bar` is not.

```js
var foo = 1;
var bar;

bar = 2;
```

This rule aims to bring consistency to variable initializations and declarations.

### Options

The rule takes two options:

1. A string which must be either `"always"` (the default), to enforce initialization at declaration, or `"never"` to disallow initialization during declaration. This rule applies to `var`, `let`, and `const` variables, however `"never"` is ignored for `const` variables, as unassigned `const`s generate a parse error.
2. An object that further controls the behavior of this rule. Currently, the only available parameter is `ignoreForLoopInit`, which indicates if initialization at declaration is allowed in `for` loops when `"never"` is set, since it is a very typical use case.

### Options

This rule is configured by passing in the string `"always"` (the default)

You can configure the rule as follows:

(default) All variables must be initialized at declaration

```json
{
    "init-declarations": [2, "always"],
}
```

Variables must not be initialized at declaration

```json
{
    "init-declarations": [2, "never"]
}
```

Variables must not be initialized at declaration, except in for loops, where it is allowed

```json
{
    "init-declarations": [2, "never", { "ignoreForLoopInit": true }]
}
```

When configured with `"always"` (the default), the following patterns are considered problems:

```js
/*eslint init-declarations: [2, "always"]*/
/*eslint-env es6*/

function foo() {
    var bar;     /*error Variable 'bar' should be initialized on declaration.*/
    let baz;     /*error Variable 'baz' should be initialized on declaration.*/
}
```

The following patterns are not considered problems with `"always"`.

```js
/*eslint init-declarations: [2, "always"]*/
/*eslint-env es6*/

function foo() {
    var bar = 1;
    let baz = 2;
    const qux = 3;
}
```

When configured with `"never"`, the following patterns are considered problems.

```js
/*eslint init-declarations: [2, "never"]*/
/*eslint-env es6*/

function foo() {
    var bar = 1;   /*error Variable 'bar' should not be initialized on declaration.*/
    let baz = 2;   /*error Variable 'baz' should not be initialized on declaration.*/

    for (var i = 0; i < 1; i++) {}  /*error Variable 'i' should not be initialized on declaration.*/
}
```

The following patterns are not considered problems with `"never"`. Note that `const` variable initializations are ignored with `"never"`.

```js
/*eslint init-declarations: [2, "never"]*/
/*eslint-env es6*/

function foo() {
    var bar;
    let baz;
    const buzz = 1;
}
```

With `"ignoreForLoopInit"` enabled, the following pattern is not considered a problem.

```js
/*eslint init-declarations: [2, "never", { "ignoreForLoopInit": true }]*/
for (var i = 0; i < 1; i++) {}
```

### When Not To Use It

When you are indifferent as to how your variables are initialized.
