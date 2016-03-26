# Strict Mode Directives (strict)

A strict mode directive at the beginning of a script or function body enables strict mode semantics.

When used globally, the entire script, including all contained functions, are strict mode code:

```js
"use strict";
```

It is also possible to specify function-level strict mode, such that strict mode applies only to the function in which the directive occurs:

```js
function foo() {
    "use strict";
    return;
}

var bar = function() {
    "use strict";
    return;
};
```

Unlike scripts, ECMAScript modules are always in strict mode. Strict mode directives in ECMAScript modules have no effect.

## Rule Details

This rule is aimed at using strict mode directives effectively, and as such, will flag any unexpected uses or omissions of strict mode directives.

## Options

There are four options for this rule:

* `"safe"` - require `"use strict"` globally when inside a module wrapper and in function scopes everywhere else. This is the default.
* `"never"` - disallow `"use strict"`.
* `"global"` - require `"use strict"` in the global scope.
* `"function"` - require `"use strict"` in function scopes only.

All strict mode directives are flagged as unnecessary if ECMAScript modules or implied strict mode are enabled (see [Specifying Parser Options](../user-guide/configuring#specifying-parser-options)). This behaviour does not depend on the rule options, but can be silenced by disabling this rule.

### safe

Node.js and the CommonJS module system wrap modules inside a hidden function wrapper that defines each module's scope. The wrapper makes it safe to concatenate strict mode modules while maintaining their original strict mode directives. When the `node` or `commonjs` environments are enabled or `globalReturn` is enabled in `ecmaFeatures`, ESLint considers code to be inside the module wrapper, and `"safe"` mode corresponds to `"global"` mode and enforces global strict mode directives. Everywhere else, `"safe"` mode corresponds to `"function"` mode and enforces strict mode directives inside top-level functions.

### never

This mode forbids any occurrence of a strict mode directive.

Examples of **incorrect** code for the `"never"` option:

```js
/*eslint strict: ["error", "never"]*/

"use strict";

function foo() {
    "use strict";
    return;
}

var bar = function() {
    "use strict";
    return;
};

foo();
bar();
```

Examples of **correct** code for the `"never"` option:

```js
/*eslint strict: ["error", "never"]*/

function foo() {
    return;
}

var bar = function() {
    return;
};

foo();
bar();
```

### global

This mode ensures that all code is in strict mode and that there are no extraneous strict mode directives at the top level or in nested functions, which are themselves already strict by virtue of being contained in strict global code. It requires that global code contains exactly one strict mode directive. Strict mode directives inside functions are considered unnecessary. Multiple strict mode directives at any level also trigger warnings.

Examples of **incorrect** code for the `"global"` option:

```js
/*eslint strict: ["error", "global"]*/

"use strict";
"use strict";

function foo() {
    "use strict";

    return function() {
        "use strict";
        "use strict";

        return;
    };
}

foo();
```

Examples of **correct** code for the `"global"` option:

```js
/*eslint strict: ["error", "global"]*/

"use strict";

function foo() {
    return function() {
        return;
    };
}

foo();
```

### function

This mode ensures that all function bodies are strict mode code, while global code is not. Particularly if a build step concatenates multiple scripts, a strict mode directive in global code of one script could unintentionally enable strict mode in another script that was not intended to be strict code. It forbids any occurrence of a strict mode directive in global code. It requires exactly one strict mode directive in each function declaration or expression whose parent is global code. Strict mode directives inside nested functions are considered unnecessary. Multiple strict mode directives at any level also trigger warnings.

Examples of **incorrect** code for the `"function"` option:

```js
/*eslint strict: ["error", "function"]*/

"use strict";

function foo() {
    // Missing strict mode directive

    return function() {
        "use strict";   // Unnecessary; parent should contain a strict mode directive
        "use strict";

        return;
    };
}

foo();
```

Examples of **correct** code for the `"function"` option:

```js
/*eslint strict: ["error", "function"]*/

function foo() {
    "use strict";

    return function() {
        return;
    };
}

(function() {
    "use strict";

    return;
}());

foo();
```

### earlier default (removed)

**Replacement notice**: This mode, previously enabled by turning on the rule without specifying a mode, has been removed in ESLint v1.0. `"function"` mode is most similar to the deprecated behavior.

This mode ensures that all functions are executed in strict mode. A strict mode directive must be present in global code or in every top-level function declaration or expression. It does not concern itself with unnecessary strict mode directives in nested functions that are already strict, nor with multiple strict mode directives at the same level.

Examples of **incorrect** code for an earlier default option which has been removed:

```js
// "strict": "error"

function foo() {
    return true;
}
```

Examples of **correct** code for an earlier default option which has been removed:

```js
// "strict": "error"

"use strict";

function foo() {
    return true;
}
```

```js
// "strict": "error"

function foo() {

    "use strict";

    return true;
}
```

```js
// "strict": "error"

(function() {
    "use strict";

    // other code
}());
```

## When Not To Use It

In a codebase that has both strict and non-strict code, either turn this rule off, or [selectively disable it](http://eslint.org/docs/user-guide/configuring) where necessary. For example, functions referencing `arguments.callee` are invalid in strict mode. A [full list of strict mode differences](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode/Transitioning_to_strict_mode#Differences_from_non-strict_to_strict) is available on MDN.
