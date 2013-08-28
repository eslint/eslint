# Rules

Rules in ESLint are divided into several categories to help you better understand their value. Additionally, not all rules are enabled by default. Those that are not enabled by default are marked as being off.

## Possible Errors

The following rules point out areas where you might have made mistakes.

* [no-console](no-console.md) - disallow use of `console`
* [no-comma-dangle](no-comma-dangle.md) - disallow trailing commas in object literals
* [no-debugger](no-debugger.md) - disallow use of `debugger`
* [no-empty](no-empty.md) - disallow empty statements
* [no-obj-calls](no-obj-calls.md) - disallow the use of object properties of the global object (`Math` and `JSON`) as functions
* [no-unreachable](no-unreachable.md) - disallow unreachable statements after a return, throw, continue, or break statement
* [use-isnan](use-isnan.md) - disallow comparisons with the value `NaN`
* [no-dupe-keys](no-dupe-keys.md) - disallow duplicate keys when creating object literals
* [no-empty-class](no-empty-class.md) - disallow the use of empty character classes in regular expressions

## Best Practices

These are rules designed to prevent you from making mistakes. They either prescribe a better way of doing something or help you avoid footguns.

* [no-caller](no-caller.md) - disallow use of `arguments.caller` or `arguments.callee`
* [curly](curly.md) - require curly brace for all control statements
* [eqeqeq](eqeqeq.md) - require the use of `===` and `!==`
* [dot-notation](dot-notation.md) - encourages use of dot notation whenever possible
* [no-eval](no-eval.md) - disallow use of `eval()`
* [no-with](no-with.md) - disallow use of the `with` statement
* [no-undef](no-undef.md) - disallow use of undeclared variables unless mentioned in a `/*global */` block
* [no-undef-init] - disallow use of undefined when initializing variables
* [no-floating-decimal] - disallow the use of leading or trailing decimal points in numeric literals
* [no-octal] - disallow use of octal literals
* [no-octal-escape] - disallow use of octal escape sequences in string literals, such as `var foo = "Copyright \251";`
* [no-new](no-new.md) - disallow use of new operator when not part of the assignment or comparison
* [no-new-func] - disallow use of new operator for `Function` object
* [no-native-reassign] - disallow reassignments of native objects
* [no-delete-var](no-delete-var.md) - disallow deletion of variables
* [no-return-assign] - disallow use of assignment in return statement
* [no-label-var](no-label-var.md) - disallow labels that share a name with a variable
* [wrap-iife](wrap-iife.md) - require immediate function invocation to be wrapped in parentheses
* [no-self-compare] - disallow comparisons where both sides are exactly the same
* [no-eq-null](no-eq-null.md) - disallow comparisons to null without a type-checking operator
* [no-multi-str](no-multi-str.md) - disallow use of multiline strings
* [no-loop-func](no-loop-func.md) - disallow creation of functions within loops
* [no-empty-label](no-empty-label.md) - disallow use of labels for anything other then loops and switches
* [unnecessary-strict](unnecessary-strict.md) - disallow unnecessary use of `"use strict";` when already in strict mode
* [no-unused-vars](no-unused-vars.md) - disallow declaration of variables that are not used in the code
* [no-script-url](no-script-url.md) - disallow use of javascript: urls.
* [no-proto](no-proto.md) - disallow usage of `__proto__` property
* [no-iterator](no-iterator.md) - disallow usage of `__iterator__` property
* [no-else-return](no-else-return.md) - disallow `else` after a `return` in an `if`.
* [no-shadow](no-shadow.md) - disallow declaration of variables already declared in the outer scope
* [no-alert](no-alert.md) - disallow the use of `alert`, `confirm`, and `prompt`
* [no-use-before-define](no-use-before-define.md) - disallow use of variables before they are defined
* [no-redeclare](no-redeclare.md) - disallow declaring the same variable more then once

## Stylistic Issues

These rules are purely matters of style and are quite subjective.

* [camelcase](camelcase.md) - require camel case names
* [new-cap](new-cap.md) - require a capital letter for constructors
* [quote-props](quote-props.md) - require quotes around object literal property names
* [semi] - require use of semicolons instead of relying on ASI
* [no-ternary](no-ternary.md) - disallow the use of ternary operators
* [consistent-this](consistent-this.md) - enforces consistent naming when capturing the current execution context (off by default).
* [one-var](one-var.md) - disallow multiple variable declaration statements in a function scope
* [no-mixed-requires](no-mixed-requires.md) - disallow mixing regular variable and require declarations
* [no-wrap-func](no-wrap-func.md) - disallow wrapping of none IIFE statements in parents
* [complexity](complexity.md) - specify the maximum cyclomatic complexity allowed in a program
* [new-parens](new-parens.md) - disallow the omission of parentheses when invoking a contructor with no arguments

## Alternate Rules

* [smarter-eqeqeq](smarter-eqeqeq.md) - require the use of `===` and `!==` when it makes sense to use them

## Legacy

The following rules are included for compatibility with [JSHint](http://jshint.com/) and [JSLint](http://jslint.com/). While the names of the rules may not match up with the JSHint/JSLint counterpart, the functionality is the same.

* [no-plusplus](no-plusplus.md) - disallow use of unary operators, `++` and `--` (off by default)
* [no-bitwise](no-bitwise.md) - disallow use of bitwise operators (off by default)
* [guard-for-in](guard-for-in.md) - make sure `for-in` loops have an `if` statement (off by default)
* [max-statements](max-statements.md) - specify the maximum number of statement allowed in a function (off by default)
* [max-params](max-params.md) - limits the number of parameters that can be used in the function declaration. (off by default)
* [max-depth](max-depth.md) - specify the maximum depth that blocks can be nested (off by default)
* [max-len](max-len.md) - specify the maximum length of a line in your program (off by default)
