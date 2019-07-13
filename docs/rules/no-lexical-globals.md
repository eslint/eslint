# Disallow `const`, `let` and `class` declarations in the global scope (no-lexical-globals)

Lexical declarations `const` and `let`, as well as `class` declarations, create variables that are block-scoped.

However, when declared in the top-level of a browser script these variables are not "script-scoped".
They are actually created in the global scope and could produce name collisions with
`var`, `const` and `let` variables and `function` and `class` declarations from other scripts.

This does not apply to ES and Node.js modules since they have a module scope.

It is the best practice to avoid polluting the global namespace with variables that are intended to be local to the script.
You can wrap the code with a block or with an immediately-invoked function expression (IIFE).

Examples of **incorrect** code for this rule:

```js
const a = 1;
let b;
class C {}
```

Examples of **correct** code for this rule:

```js
{
    const a = 1;
    let b;
    class C {};
}

(function() {
    const a = 1;
    let b;
    class C {};
}());
```

Even if you intend to create a global variable to be used from other scripts, there are some differences
compared to the common methods, which are `var` declarations and assigning to a property of the global `window` object:

* Lexically declared variables cannot be conditionally created. A script cannot check for the existence of
a variable and then create a new one. `var` variables are also always created, but redeclarations do not
cause runtime exceptions.
* Lexically declared variables do not create properties on the global object, which is what a consuming script might expect.
* Lexically declared variables are shadowing properties of the global object, which might produce errors if a
consuming script is using both the variable and the property.
* Lexically declared variables can produce a permanent Temporal Dead Zone (TDZ) if the initialization throws an exception.
Even the `typeof` check is not safe from TDZ reference exceptions.

Examples of **incorrect** code for this rule:

```js
const MyGobalFunction = (function() {
    const a = 1;
    let b = 2;
    return function() {
        return a + b;
    }
}());
```

Examples of **correct** code for this rule:

```js

var MyGobalFunction = (function() {
    const a = 1;
    let b = 2;
    return function() {
        return a + b;
    }
}());

window.MyGobalFunction = (function() {
    const a = 1;
    let b = 2;
    return function() {
        return a + b;
    }
}());
```

## When Not To Use It

This rule does not report any warnings in ES modules and Node.js modules.

If you have a browser script, turn this rule off if you want to allow global lexical declarations.

## Further Reading

* [const variables](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const)
* [let variables](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)
* [Temporal Dead Zone](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#Temporal_dead_zone)

## Related Rules

* [no-implicit-globals](no-implicit-globals.md)
