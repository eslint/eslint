# Rules

Rules in ESLint are divided into several categories to help you better understand their value. Additionally, not all rules are enabled by default. Those that are not enabled by default are marked as being off.

## Possible Errors

The following rules point out areas where you might have made mistakes.

* [no-cond-assign](no-cond-assign.md) - disallow assignment in conditional expressions
* [no-console](no-console.md) - disallow use of `console`
* [no-comma-dangle](no-comma-dangle.md) - disallow trailing commas in object literals
* [no-control-regex](no-control-regex.md) - disallow control characters in regular expressions
* [no-debugger](no-debugger.md) - disallow use of `debugger`
* [no-dupe-keys](no-dupe-keys.md) - disallow duplicate keys when creating object literals
* [no-empty](no-empty.md) - disallow empty statements
* [no-empty-class](no-empty-class.md) - disallow the use of empty character classes in regular expressions
* [no-ex-assign](no-ex-assign.md) - disallow assigning to the exception in a `catch` block
* [no-extra-parens](no-extra-parens.md) - disallow unnecessary parentheses
* [no-extra-semi](no-extra-semi.md) - disallow unnecessary semicolons
* [no-func-assign](no-func-assign.md) - disallow overwriting functions written as function declarations
* [no-invalid-regexp](no-invalid-regexp.md) - disallow invalid regular expression strings in the `RegExp` constructor
* [no-negated-in-lhs](no-negated-in-lhs.md) - disallow negation in the lefthand side of an expression using `in`
* [no-obj-calls](no-obj-calls.md) - disallow the use of object properties of the global object (`Math` and `JSON`) as functions
* [no-unreachable](no-unreachable.md) - disallow unreachable statements after a return, throw, continue, or break statement
* [use-isnan](use-isnan.md) - disallow comparisons with the value `NaN`

## Best Practices

These are rules designed to prevent you from making mistakes. They either prescribe a better way of doing something or help you avoid footguns.

* [block-scoped-var](block-scoped-var.md) - treat `var` statements as if they were block scoped
* [complexity](complexity.md) - specify the maximum cyclomatic complexity allowed in a program
* [curly](curly.md) - require curly brace for all control statements
* [dot-notation](dot-notation.md) - encourages use of dot notation whenever possible
* [eqeqeq](eqeqeq.md) - require the use of `===` and `!==`
* [guard-for-in](guard-for-in.md) - make sure `for-in` loops have an `if` statement (off by default)
* [no-alert](no-alert.md) - disallow the use of `alert`, `confirm`, and `prompt`
* [no-caller](no-caller.md) - disallow use of `arguments.caller` or `arguments.callee`
* [no-eval](no-eval.md) - disallow use of `eval()`
* [no-extend-native](no-extend-native.md) - disallow adding to native types
* [no-floating-decimal] - disallow the use of leading or trailing decimal points in numeric literals
* [no-native-reassign](no-native-reassign.md) - disallow reassignments of native objects
* [no-new](no-new.md) - disallow use of new operator when not part of the assignment or comparison
* [no-new-func](no-new-func.md) - disallow use of new operator for `Function` object
* [no-octal] - disallow use of octal literals
* [no-octal-escape](no-octal-escape) - disallow use of octal escape sequences in string literals, such as `var foo = "Copyright \251";`
* [no-with](no-with.md) - disallow use of the `with` statement
* [no-return-assign] - disallow use of assignment in return statement
* [no-self-compare](no-self-compare.md) - disallow comparisons where both sides are exactly the same
* [no-eq-null](no-eq-null.md) - disallow comparisons to null without a type-checking operator
* [no-multi-str](no-multi-str.md) - disallow use of multiline strings
* [no-loop-func](no-loop-func.md) - disallow creation of functions within loops
* [no-empty-label](no-empty-label.md) - disallow use of labels for anything other then loops and switches
* [no-unused-expressions](no-unused-expressions.md) - disallow usage of expressions in statement position
* [no-script-url](no-script-url.md) - disallow use of javascript: urls.
* [no-proto](no-proto.md) - disallow usage of `__proto__` property
* [no-iterator](no-iterator.md) - disallow usage of `__iterator__` property
* [no-else-return](no-else-return.md) - disallow `else` after a `return` in an `if`.
* [no-redeclare](no-redeclare.md) - disallow declaring the same variable more then once
* [no-div-regex](no-div-regex.md) - disallow division operators explicitly at beginning of regular expression
* [wrap-iife](wrap-iife.md) - require immediate function invocation to be wrapped in parentheses

## Strict Mode

These rules relate to using strict mode.

* [no-global-strict](no-global-strict.md) - disallow the `"use strict"` pragma in the global scope
* [no-extract-strict](no-extra-strict.md) - disallow unnecessary use of `"use strict";` when already in strict mode
* [strict](strict.md) - require that all functions are run in strict mode

## Variables

These rules have to do with variable declarations.

* [no-catch-shadow](no-catch-shadow.md) - disallow the catch clause parameter name being the same as a variable in the outer scope
* [no-delete-var](no-delete-var.md) - disallow deletion of variables
* [no-label-var](no-label-var.md) - disallow labels that share a name with a variable
* [no-shadow](no-shadow.md) - disallow declaration of variables already declared in the outer scope
* [no-shadow-restricted-names](no-shadow-restricted-names.md) - disallow shadowing of names such as `arguments`
* [no-undef](no-undef.md) - disallow use of undeclared variables unless mentioned in a `/*global */` block
* [no-undef-init] - disallow use of undefined when initializing variables
* [no-unused-vars](no-unused-vars.md) - disallow declaration of variables that are not used in the code
* [no-use-before-define](no-use-before-define.md) - disallow use of variables before they are defined

## Stylistic Issues

These rules are purely matters of style and are quite subjective.

* [brace-style](brace-style.md) - enforce one true brace style
* [camelcase](camelcase.md) - require camel case names
* [consistent-this](consistent-this.md) - enforces consistent naming when capturing the current execution context (off by default).
* [func-style](func-style.md) - enforces use of function declarations or expressions
* [new-cap](new-cap.md) - require a capital letter for constructors
* [new-parens](new-parens.md) - disallow the omission of parentheses when invoking a contructor with no arguments
* [no-mixed-requires](no-mixed-requires.md) - disallow mixing regular variable and require declarations
* [no-nested-ternary](no-nested-ternary.md) - disallow nested ternary expressions
* [no-spaced-func](no-spaced-func.md) - disallow space between function identifier and application
* [no-ternary](no-ternary.md) - disallow the use of ternary operators
* [no-wrap-func](no-wrap-func.md) - disallow wrapping of none IIFE statements in parents
* [quotes](quotes.md) - specify whether double or single quotes should be used
* [quote-props](quote-props.md) - require quotes around object literal property names
* [semi] - require use of semicolons instead of relying on ASI
* [sort-vars](sort-vars.md) - sort variables within the same declaration block
* [space-infix-ops](space-infix-ops.md) - require spaces around operators
* [space-return-throw-case](space-return-throw-case.md) - require a space after `return`, `throw`, and `case`
* [space-unary-word-ops](space-unary-word-ops.md) - require a space around word operators such as `typeof`
* [max-nested-callbacks](max-nested-callbacks.md) - specify the maximum depth callbacks can be nested
* [one-var](one-var.md) - allow just one var statement per function
* [wrap-regex](wrap-regex.md) - require regex literals to be wrapped in parentheses

## Legacy

The following rules are included for compatibility with [JSHint](http://jshint.com/) and [JSLint](http://jslint.com/). While the names of the rules may not match up with the JSHint/JSLint counterpart, the functionality is the same.

* [max-depth](max-depth.md) - specify the maximum depth that blocks can be nested (off by default)
* [max-len](max-len.md) - specify the maximum length of a line in your program (off by default)
* [max-params](max-params.md) - limits the number of parameters that can be used in the function declaration. (off by default)
* [max-statements](max-statements.md) - specify the maximum number of statement allowed in a function (off by default)
* [no-bitwise](no-bitwise.md) - disallow use of bitwise operators (off by default)
* [no-plusplus](no-plusplus.md) - disallow use of unary operators, `++` and `--` (off by default)
