# Rules

Rules in ESLint are divided into several categories to help you better understand their value. Additionally, not all rules are enabled by default. Those that are not enabled by default are marked as being off.

## Possible Errors

The following rules point out areas where you might have made mistakes.

* [no-console](no-console.md) - disallow use of `console`
* [no-dangle](no-dangle.md) - disallow trailing commas in object literals
* [no-debugger](no-debugger.md) - disallow use of `debugger`
* [no-empty](no-empty.md) - disallow empty statements
* [no-obj-calls](no-obj-calls.md) - disallow the use of object properties of the global object (`Math` and `JSON`) as functions
* [no-unreachable](no-unreachable.md) - disallow unreachable statements after a return, throw, continue, or break statement
* [use-isnan](use-isnan.md) - disallow comparisons with the value `NaN`

## Best Practices

These are rules designed to prevent you from making mistakes. They either prescribe a better way of doing something or help you avoid footguns.

* [no-caller] - disallow use of `arguments.caller` or `arguments.callee` are used
* [curly] - require curly brace for all control statements
* [eqeqeq] - require the use of `===` and `!==`
* [dot-notation] - encourages use of dot notation whenever possible
* [no-eval] - disallow use of `eval()`
* [no-with] - disallow use of the `with` statement
* [no-undef](no-undef.md) - disallow use of undeclared variables unless mentioned in a `/*global */` block
* [no-undef-init] - disallow use of undefined when initializing variables
* [no-floating-decimal] - disallow the use of leading or trailing decimal points in numeric literals
* [no-octal] - disallow use of octal literals
* [no-new] - disallow use of new operator when not part of the assignment or comparison
* [no-new-func] - disallow use of new operator for `Function` object
* [no-native-reassign] - disallow reassignments of native objects
* [no-delete-var](no-delete-var.md) - disallow deletion of variables
* [no-return-assign] - disallow use of assignment in return statement
* [no-label-var](no-label-var.md) - disallow labels that share a name with a variable
* [wrap-iife](wrap-iife.md) - require immediate function invocation to be wrapped in parentheses
* [no-self-compare] - disallow comparisons where both sides are exactly the same
* [no-eq-null](no-eq-null.md) - disallow comparisons to null without a type-checking operator
* [no-multi-str](no-multi-str.md) - disallow use of multiline strings

## Stylistic Issues

These rules are purely matters of style and are quite subjective.

* [camelcase] - require camel case names
* [new-cap](new-cap.md) - require a capital letter for constructors
* [quote-props](quote-props.md) - require quotes around object literal property names
* [semi] - require use of semicolons instead of relying on ASI
* [max-params] - limits the number of parameters that can be used in the function declaration. Configurable. Default is 3.
* [no-ternary](no-ternary.md) - disallow the use of ternary operators
* [consistent-this](consistent-this.md) - enforces consistent naming when capturing the current execution context (off by default).

## Alternate Rules

* [smarter-eqeqeq](smarter-eqeqeq.md) - require the use of `===` and `!==` when it makes sense to use them

## Legacy

The following rules are included for compatibility with [JSHint](http://jshint.com/) and [JSLint](http://jslint.com/). While the names of the rules may not match up with the JSHint/JSLint counterpart, the functionality is the same.

* [no-plusplus] - disallow use of unary operators, `++` and `--` (off by default)
* [no-bitwise] - disallow use of bitwise operators (off by default)
* [guard-for-in] - make sure `for-in` loops have an `if` statement (off by default)
* [max-statements](max-statements.md) - specify the maximum number of statement allowed in a function (off by default)
