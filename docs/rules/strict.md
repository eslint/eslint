# require or disallow strict mode directives (strict)

A strict mode directive is a `"use strict"` literal at the beginning of a script or function body. It enables strict mode semantics.

When a directive occurs in global scope, strict mode applies to the entire script:

```js
"use strict";

// strict mode

function foo() {
    // strict mode
}
```

When a directive occurs at the beginning of a function body, strict mode applies only to that function, including all contained functions:

```js
function foo() {
    "use strict";
    // strict mode
}

function foo2() {
    // not strict mode
};

(function() {
    "use strict";
    function bar() {
        // strict mode
    }
}());
```

In the **CommonJS** module system, a hidden function wraps each module and limits the scope of a "global" strict mode directive.

In **ECMAScript** modules, which always have strict mode semantics, the directives are unnecessary.

## Rule Details

This rule requires or disallows strict mode directives.

This rule disallows strict mode directives, no matter which option is specified, if ESLint configuration specifies either of the following as [parser options](/docs/user-guide/configuring.md#specifying-parser-options):

* `"sourceType": "module"` that is, files are **ECMAScript** modules
* `"impliedStrict": true` property in the `ecmaFeatures` object

This rule disallows strict mode directives, no matter which option is specified, in functions with non-simple parameter lists (for example, parameter lists with default parameter values) because that is a syntax error in **ECMAScript 2016** and later. See the examples of the [function](#function) option.

The `--fix` option on the command line does not insert new `"use strict"` statements, but only removes unneeded statements.

## Options

This rule has a string option:

* `"safe"` (default) corresponds either of the following options:
    * `"global"` if ESLint considers a file to be a **CommonJS** module
    * `"function"` otherwise
* `"global"` requires one strict mode directive in the global scope (and disallows any other strict mode directives)
* `"function"` requires one strict mode directive in each top-level function declaration or expression (and disallows any other strict mode directives)
* `"never"` disallows strict mode directives

### safe

The `"safe"` option corresponds to the `"global"` option if ESLint considers a file to be a **Node.js** or **CommonJS** module because the configuration specifies either of the following:

* `node` or `commonjs` [environments](/docs/user-guide/configuring.md#specifying-environments)
* `"globalReturn": true` property in the `ecmaFeatures` object of [parser options](/docs/user-guide/configuring.md#specifying-parser-options)

Otherwise the `"safe"` option corresponds to the `"function"` option. Note that if `"globalReturn": false` is explicitly specified in the configuration, the `"safe"` option will correspond to the `"function"` option regardless of the specified environment.

### global

Examples of **incorrect** code for this rule with the `"global"` option:

```js
/*eslint strict: ["error", "global"]*/

function foo() {
}
```

```js
/*eslint strict: ["error", "global"]*/

function foo() {
    "use strict";
}
```

```js
/*eslint strict: ["error", "global"]*/

"use strict";

function foo() {
    "use strict";
}
```

Examples of **correct** code for this rule with the `"global"` option:

```js
/*eslint strict: ["error", "global"]*/

"use strict";

function foo() {
}
```

### function

This option ensures that all function bodies are strict mode code, while global code is not. Particularly if a build step concatenates multiple scripts, a strict mode directive in global code of one script could unintentionally enable strict mode in another script that was not intended to be strict code.

Examples of **incorrect** code for this rule with the `"function"` option:

```js
/*eslint strict: ["error", "function"]*/

"use strict";

function foo() {
}
```

```js
/*eslint strict: ["error", "function"]*/

function foo() {
}

(function() {
    function bar() {
        "use strict";
    }
}());
```

```js
/*eslint strict: ["error", "function"]*/
/*eslint-env es6*/

// Illegal "use strict" directive in function with non-simple parameter list.
// This is a syntax error since ES2016.
function foo(a = 1) {
    "use strict";
}

// We cannot write "use strict" directive in this function.
// So we have to wrap this function with a function with "use strict" directive.
function foo(a = 1) {
}
```

Examples of **correct** code for this rule with the `"function"` option:

```js
/*eslint strict: ["error", "function"]*/

function foo() {
    "use strict";
}

(function() {
    "use strict";

    function bar() {
    }

    function baz(a = 1) {
    }
}());

var foo = (function() {
    "use strict";

    return function foo(a = 1) {
    };
}());
```

### never

Examples of **incorrect** code for this rule with the `"never"` option:

```js
/*eslint strict: ["error", "never"]*/

"use strict";

function foo() {
}
```

```js
/*eslint strict: ["error", "never"]*/

function foo() {
    "use strict";
}
```

Examples of **correct** code for this rule with the `"never"` option:

```js
/*eslint strict: ["error", "never"]*/

function foo() {
}
```

### earlier default (removed)

(removed) The default option (that is, no string option specified) for this rule was **removed** in ESLint v1.0. The `"function"` option is most similar to the removed option.

This option ensures that all functions are executed in strict mode. A strict mode directive must be present in global code or in every top-level function declaration or expression. It does not concern itself with unnecessary strict mode directives in nested functions that are already strict, nor with multiple strict mode directives at the same level.

Examples of **incorrect** code for this rule with the earlier default option which has been removed:

```js
// "strict": "error"

function foo() {
}
```

```js
// "strict": "error"

(function() {
    function bar() {
        "use strict";
    }
}());
```

Examples of **correct** code for this rule with the earlier default option which has been removed:

```js
// "strict": "error"

"use strict";

function foo() {
}
```

```js
// "strict": "error"

function foo() {
    "use strict";
}
```

```js
// "strict": "error"

(function() {
    "use strict";
    function bar() {
        "use strict";
    }
}());
```

## When Not To Use It

In a codebase that has both strict and non-strict code, either turn this rule off, or [selectively disable it](/docs/user-guide/configuring.md) where necessary. For example, functions referencing `arguments.callee` are invalid in strict mode. A [full list of strict mode differences](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode/Transitioning_to_strict_mode#Differences_from_non-strict_to_strict) is available on MDN.
