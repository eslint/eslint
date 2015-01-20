# Strict Mode (strict)

A Use Strict Directive at the beginning of a script or function body enables strict mode semantics:

```js
"use strict";
```

When used globally, as in the preceding example, the entire script, including all contained functions, are strict mode code. It is also possible to specify function-level strict mode, such that strict mode applies only to the function in which the directive occurs:

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

## Rule Details

This rule is aimed at controlling how Use Strict Directives are used in code. It has three modes, each enabled by a single string argument:

### "never" mode

This mode forbids any occurrence of a Use Strict Directive.

The following patterns are considered warnings:

```js
// "strict": [2, "never"]

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

The following patterns are considered valid:

```js
// "strict": [2, "never"]

function foo() {
    return;
}

var bar = function() {
    return;
};

foo();
bar();
```

### "global" mode

This mode ensures that all code is in strict mode and that there are no extraneous Use Srict Directives at the top level or in nested functions, which are themselves already strict by virtue of being contained in strict global code. It requires that global code contains exactly one Use Strict Directive. Use Strict Directives inside functions are considered unnecessary. Multiple Use Strict Directives at any level also trigger warnings.

The following patterns are considered warnings:

```js
// "strict": [2, "global"]

"use strict";
"use strict"; // Multiple Use Strict Directives

function foo() {
    "use strict"; // Unnecessary; already nested in strict mode code

    return function() {
        "use strict"; // Unnecessary; already nested in strict mode code
        "use strict"; // Multiple Use Strict Directives

        return;
    };
}

foo();
```

The following patterns are considered valid:

```js
// "strict": [2, "global"]

"use strict";

function foo() {
    return function() {
        return;
    };
}

foo();
```

### "function" mode

This mode ensures that all function bodies are strict mode code, while global code is not. Particularly if a build step concatenates multiple scripts, a Use Strict Directive in global code of one script could unintentionally enable strict mode in another script that was not intended to be strict code. It forbids any occurrence of a Use Strict Directive in global code. It requires exactly one Use Strict Directive in each function declaration or expression whose parent is global code. Use Strict Directives inside nested functions are considered unnecessary. Multiple Use Strict Directives at any level also trigger warnings.

The following patterns are considered warnings:

```js
// "strict": [2, "function"]

"use strict"; // Use function form

function foo() {
    // Missing Use Strict Directive

    return function() {
        "use strict"; // Unnecessary; parent should contain a Strict Mode Directive
        "use strict"; // Multiple Use Strict Directives

        return;
    };
}

foo();
```

The following patterns are considered valid:

```js
// "strict": [2, "function"]

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

### deprecated mode (default)

**Deprecation notice**: This mode, enabled by turning on the rule without specifying a mode, is deprecated and remains for backward compatibility. It will be removed entirely in ESLint v1.0, at which point this rule will require a mode option. `"function"` mode is most similar to the deprecated behavior.

This mode ensures that all functions are executed in strict mode. A Use Strict Directive must be present in global code or in every top-level function declaration or expression. It does not concern itself with unnecessary Use Strict Directives in nested functions that are already strict, nor with multiple Use Strict Directives at the same level.

The following patterns are considered warnings:

```js
// "strict": 2

function foo() {
    return true;
}
```

The following patterns do not cause a warning:

```js
// "strict": 2

"use strict";

function foo() {
    return true;
}

// ----------------

function foo() {

    "use strict";

    return true;
}

// ----------------

(function() {
    "use strict";

    // other code
}());
```

## When Not To Use It

In a codebase that has both strict and non-strict code, either turn this rule off, or [selectively disable it](http://eslint.org/docs/configuring/) where necessary. For example, functions referencing `arguments.callee` are invalid in strict mode. A [full list of strict mode differences](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode/Transitioning_to_strict_mode#Differences_from_non-strict_to_strict) is available on MDN.
