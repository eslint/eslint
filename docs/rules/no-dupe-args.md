# disallow duplicate arguments in `function` definitions (no-dupe-args)

In strict mode you will receive a `SyntaxError` if a function takes multiple arguments with the same name.
Outside of strict mode duplicate arguments will mask the value of the first argument.

## Rule Details

This rule disallows duplicate parameters in function definitions.

Examples of **incorrect** code for this rule:

```js
/*eslint no-dupe-args: "error"*/

function foo(a, b, a) {
    console.log("which a is it?", a);
}

var bar = function (a, b, a) {
    console.log("which a is it?", a);
};
```

Examples of **correct** code for this rule:

```js
/*eslint no-dupe-args: "error"*/

function foo(a, b, c) {
    console.log(a, b, c);
}

var bar = function (a, b, c) {
    console.log(a, b, c);
};
```

## When Not To Use It

If your project uses strict mode this rule may not be needed as unique param names will be automatically enforced.
