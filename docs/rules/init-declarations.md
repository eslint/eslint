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

This rule is configured by passing in the string `"always"` (the default) to enforce initialization at declaration, or `"never"` to disallow initialization during declaration. This rule applies to `var`, `let`, and `const` variables, however `"never"` is ignored for `const` variables, as unassigned `const`s generate a parse error.

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

### When Not To Use It

When you are indifferent as to how your variables are initialized.
