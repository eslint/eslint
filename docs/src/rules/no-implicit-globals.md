---
title: no-implicit-globals
rule_type: suggestion
related_rules:
- no-undef
- no-global-assign
- no-unused-vars
further_reading:
- https://benalman.com/news/2010/11/immediately-invoked-function-expression/
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Undeclared_var
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#Temporal_dead_zone
---


It is the best practice to avoid 'polluting' the global scope with variables that are intended to be local to the script.

Global variables created from a script can produce name collisions with global variables created from another script, which will
usually lead to runtime errors or unexpected behavior.

This rule disallows the following:

* Declarations that create one or more variables in the global scope.
* Global variable leaks.
* Redeclarations of read-only global variables and assignments to read-only global variables.

There is an explicit way to create a global variable when needed, by assigning to a property of the global object.

This rule is mostly useful for browser scripts. Top-level declarations in ES modules and CommonJS modules create module-scoped
variables. ES modules also have implicit `strict` mode, which prevents global variable leaks.

By default, this rule does not check `const`, `let` and `class` declarations.

This rule has an object option with one option:

* Set `"lexicalBindings"` to `true` if you want this rule to check `const`, `let` and `class` declarations as well.

## Rule Details

### `var` and `function` declarations

When working with browser scripts, developers often forget that variable and function declarations at the top-level scope become global variables on the `window` object. As opposed to modules which have their own scope. Globals should be explicitly assigned to `window` or `self` if that is the intent. Otherwise variables intended to be local to the script should be wrapped in an IIFE.

This rule disallows `var` and `function` declarations at the top-level script scope. This does not apply to ES and CommonJS modules since they have a module scope.

Examples of **incorrect** code for this rule:

::: incorrect { "sourceType": "script" }

```js
/*eslint no-implicit-globals: "error"*/

var foo = 1;

function bar() {}
```

:::

Examples of **correct** code for this rule:

::: correct { "sourceType": "script" }

```js
/*eslint no-implicit-globals: "error"*/

// explicitly set on window
window.foo = 1;
window.bar = function() {};

// intended to be scope to this file
(function() {
  var foo = 1;

  function bar() {}
})();
```

:::

Examples of **correct** code for this rule with `"parserOptions": { "sourceType": "module" }` in the ESLint configuration:

::: correct { "sourceType": "module" }

```js
/*eslint no-implicit-globals: "error"*/

// foo and bar are local to module
var foo = 1;
function bar() {}
```

:::

### Global variable leaks

When the code is not in `strict` mode, an assignment to an undeclared variable creates
a new global variable. This will happen even if the code is in a function.

This does not apply to ES modules since the module code is implicitly in `strict` mode.

Examples of **incorrect** code for this rule:

::: incorrect { "sourceType": "script" }

```js
/*eslint no-implicit-globals: "error"*/

foo = 1;

Bar.prototype.baz = function () {
    a = 1; // Intended to be this.a = 1;
};
```

:::

### Read-only global variables

This rule also disallows redeclarations of read-only global variables and assignments to read-only global variables.

A read-only global variable can be a built-in ES global (e.g. `Array`), an environment specific global
(e.g. `window` in the browser environment), or a global variable defined as `readonly` in the configuration file
or in a `/*global */` comment.

* [Specifying Environments](../use/configure#specifying-environments)
* [Specifying Globals](../use/configure#specifying-globals)

Examples of **incorrect** code for this rule:

::: incorrect { "sourceType": "script" }

```js
/*eslint no-implicit-globals: "error"*/

/*global foo:readonly*/

foo = 1;

Array = [];
var Object;
```

:::

### `const`, `let` and `class` declarations

Lexical declarations `const` and `let`, as well as `class` declarations, create variables that are block-scoped.

However, when declared in the top-level of a browser script these variables are not 'script-scoped'.
They are actually created in the global scope and could produce name collisions with
`var`, `const` and `let` variables and `function` and `class` declarations from other scripts.
This does not apply to ES and CommonJS  modules.

If the variable is intended to be local to the script, wrap the code with a block or with an immediately-invoked function expression (IIFE).

Examples of **correct** code for this rule with `"lexicalBindings"` option set to `false` (default):

::: correct { "sourceType": "script" }

```js
/*eslint no-implicit-globals: ["error", {"lexicalBindings": false}]*/

const foo = 1;

let baz;

class Bar {}
```

:::

Examples of **incorrect** code for this rule with `"lexicalBindings"` option set to `true`:

::: incorrect { "sourceType": "script" }

```js
/*eslint no-implicit-globals: ["error", {"lexicalBindings": true}]*/

const foo = 1;

let baz;

class Bar {}
```

:::

Examples of **correct** code for this rule with `"lexicalBindings"` option set to `true`:

::: correct { "sourceType": "script" }

```js
/*eslint no-implicit-globals: ["error", {"lexicalBindings": true}]*/

{
    const foo = 1;
    let baz;
    class Bar {}
}

(function() {
    const foo = 1;
    let baz;
    class Bar {}
}());
```

:::

If you intend to create a global `const` or `let` variable or a global `class` declaration, to be used from other scripts,
be aware that there are certain differences when compared to the traditional methods, which are `var` declarations and assigning to a property of the global `window` object:

* Lexically declared variables cannot be conditionally created. A script cannot check for the existence of
a variable and then create a new one. `var` variables are also always created, but redeclarations do not
cause runtime exceptions.
* Lexically declared variables do not create properties on the global object, which is what a consuming script might expect.
* Lexically declared variables are shadowing properties of the global object, which might produce errors if a
consuming script is using both the variable and the property.
* Lexically declared variables can produce a permanent Temporal Dead Zone (TDZ) if the initialization throws an exception.
Even the `typeof` check is not safe from TDZ reference exceptions.

Examples of **incorrect** code for this rule with `"lexicalBindings"` option set to `true`:

::: incorrect { "sourceType": "script" }

```js
/*eslint no-implicit-globals: ["error", {"lexicalBindings": true}]*/

const MyGlobalFunction = (function() {
    const a = 1;
    let b = 2;
    return function() {
        return a + b;
    }
}());
```

:::

Examples of **correct** code for this rule with `"lexicalBindings"` option set to `true`:

::: correct { "sourceType": "script" }

```js
/*eslint no-implicit-globals: ["error", {"lexicalBindings": true}]*/

window.MyGlobalFunction = (function() {
    const a = 1;
    let b = 2;
    return function() {
        return a + b;
    }
}());
```

:::

### exported

You can use `/* exported variableName */` block comments in the same way as in [`no-unused-vars`](./no-unused-vars). See the [`no-unused-vars` exported section](./no-unused-vars#exported) for details.

Examples of **correct** code for `/* exported variableName */` operation:

::: correct { "sourceType": "script" }

```js
/* eslint no-implicit-globals: error */
/* exported global_var */

var global_var = 42;
```

:::

## When Not To Use It

In the case of a browser script, if you want to be able to explicitly declare variables and functions in the global scope,
and your code is in strict mode or you don't want this rule to warn you about undeclared variables,
and you also don't want this rule to warn you about read-only globals, you can disable this rule.

In the case of a CommonJS module, if your code is in strict mode or you don't want this rule to warn you about undeclared variables,
and you also don't want this rule to warn you about the read-only globals, you can disable this rule.

In the case of an ES module, if you don't want this rule to warn you about the read-only globals you can disable this rule.
