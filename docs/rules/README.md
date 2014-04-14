# Rules

Rules in ESLint are divided into several categories to help you better understand their value. Additionally, not all rules are enabled by default. Those that are not enabled by default are marked as being off.

## Possible Errors

The following rules point out areas where you might have made mistakes.

* [no-cond-assign](no-cond-assign.md) - disallow assignment in conditional expressions
* [no-console](no-console.md) - disallow use of `console`
* [no-constant-condition](no-constant-condition.md) - disallow use of constant expressions in conditions
* [no-comma-dangle](no-comma-dangle.md) - disallow trailing commas in object literals
* [no-control-regex](no-control-regex.md) - disallow control characters in regular expressions
* [no-debugger](no-debugger.md) - disallow use of `debugger`
* [no-dupe-keys](no-dupe-keys.md) - disallow duplicate keys when creating object literals
* [no-empty](no-empty.md) - disallow empty statements
* [no-empty-class](no-empty-class.md) - disallow the use of empty character classes in regular expressions
* [no-ex-assign](no-ex-assign.md) - disallow assigning to the exception in a `catch` block
* [no-extra-boolean-cast](no-extra-boolean-cast.md) - disallow double-negation boolean casts in a boolean context
* [no-extra-parens](no-extra-parens.md) - disallow unnecessary parentheses
* [no-extra-semi](no-extra-semi.md) - disallow unnecessary semicolons
* [no-func-assign](no-func-assign.md) - disallow overwriting functions written as function declarations
* [no-invalid-regexp](no-invalid-regexp.md) - disallow invalid regular expression strings in the `RegExp` constructor
* [no-negated-in-lhs](no-negated-in-lhs.md) - disallow negation of the left operand of an `in` expression
* [no-obj-calls](no-obj-calls.md) - disallow the use of object properties of the global object (`Math` and `JSON`) as functions
* [no-regex-spaces](no-regex-spaces.md) - disallow multiple spaces in a regular expression literal
* [no-sparse-arrays](no-sparse-arrays.md) - disallow sparse arrays
* [no-unreachable](no-unreachable.md) - disallow unreachable statements after a return, throw, continue, or break statement
* [use-isnan](use-isnan.md) - disallow comparisons with the value `NaN`
* [valid-jsdoc](valid-jsdoc.md) - Ensure JSDoc comments are valid (off by default)
* [valid-typeof](valid-typeof.md) - Ensure that the results of typeof are compared against a valid string

## Best Practices

These are rules designed to prevent you from making mistakes. They either prescribe a better way of doing something or help you avoid footguns.

* [block-scoped-var](block-scoped-var.md) - treat `var` statements as if they were block scoped
* [complexity](complexity.md) - specify the maximum cyclomatic complexity allowed in a program
* [consistent-return](consistent-return.md) - require `return` statements to either always or never specify values
* [curly](curly.md) - specify curly brace conventions for all control statements
* [dot-notation](dot-notation.md) - encourages use of dot notation whenever possible
* [eqeqeq](eqeqeq.md) - require the use of `===` and `!==`
* [guard-for-in](guard-for-in.md) - make sure `for-in` loops have an `if` statement (off by default)
* [no-alert](no-alert.md) - disallow the use of `alert`, `confirm`, and `prompt`
* [no-caller](no-caller.md) - disallow use of `arguments.caller` or `arguments.callee`
* [no-div-regex](no-div-regex.md) - disallow division operators explicitly at beginning of regular expression
* [no-else-return](no-else-return.md) - disallow `else` after a `return` in an `if`.
* [no-empty-label](no-empty-label.md) - disallow use of labels for anything other then loops and switches
* [no-eq-null](no-eq-null.md) - disallow comparisons to null without a type-checking operator
* [no-eval](no-eval.md) - disallow use of `eval()`
* [no-extend-native](no-extend-native.md) - disallow adding to native types
* [no-fallthrough](no-fallthrough.md) - disallow fallthrough of `case` statements
* [no-floating-decimal](no-floating-decimal.md) - disallow the use of leading or trailing decimal points in numeric literals
* [no-implied-eval](no-implied-eval.md) - disallow use of `eval()`-like methods
* [no-labels](no-labels.md) - disallow use of labeled statements
* [no-iterator](no-iterator.md) - disallow usage of `__iterator__` property
* [no-lone-blocks](no-lone-blocks.md) - disallow unnecessary nested blocks
* [no-loop-func](no-loop-func.md) - disallow creation of functions within loops
* [no-multi-str](no-multi-str.md) - disallow use of multiline strings
* [no-native-reassign](no-native-reassign.md) - disallow reassignments of native objects
* [no-new](no-new.md) - disallow use of new operator when not part of the assignment or comparison
* [no-new-func](no-new-func.md) - disallow use of new operator for `Function` object
* [no-new-wrappers](no-new-wrappers.md) - disallows creating new instances of `String`,`Number`, and `Boolean`
* [no-octal](no-octal.md) - disallow use of octal literals
* [no-octal-escape](no-octal-escape.md) - disallow use of octal escape sequences in string literals, such as `var foo = "Copyright \251";`
* [no-proto](no-proto.md) - disallow usage of `__proto__` property
* [no-redeclare](no-redeclare.md) - disallow declaring the same variable more then once
* [no-return-assign](no-return-assign.md) - disallow use of assignment in `return` statement
* [no-script-url](no-script-url.md) - disallow use of javascript: urls.
* [no-self-compare](no-self-compare.md) - disallow comparisons where both sides are exactly the same
* [no-sequences](no-sequences.md) - disallow use of comma operator
* [no-unused-expressions](no-unused-expressions.md) - disallow usage of expressions in statement position
* [no-warning-comments](no-warning-comments.md) - disallow usage of configurable warning terms in comments - e.g. `TODO` or `FIXME`
* [no-with](no-with.md) - disallow use of the `with` statement
* [no-yoda](no-yoda.md) - disallow Yoda conditions
* [radix](radix.md) - require use of the second argument for `parseInt()`
* [wrap-iife](wrap-iife.md) - require immediate function invocation to be wrapped in parentheses

## Strict Mode

These rules relate to using strict mode.

* [no-global-strict](no-global-strict.md) - disallow the `"use strict"` pragma in the global scope
* [no-extra-strict](no-extra-strict.md) - disallow unnecessary use of `"use strict";` when already in strict mode
* [strict](strict.md) - require that all functions are run in strict mode

## Variables

These rules have to do with variable declarations.

* [no-catch-shadow](no-catch-shadow.md) - disallow the catch clause parameter name being the same as a variable in the outer scope
* [no-delete-var](no-delete-var.md) - disallow deletion of variables
* [no-label-var](no-label-var.md) - disallow labels that share a name with a variable
* [no-shadow](no-shadow.md) - disallow declaration of variables already declared in the outer scope
* [no-shadow-restricted-names](no-shadow-restricted-names.md) - disallow shadowing of names such as `arguments`
* [no-undef](no-undef.md) - disallow use of undeclared variables unless mentioned in a `/*global */` block
* [no-undef-init](no-undef-init.md) - disallow use of undefined when initializing variables
* [no-unused-vars](no-unused-vars.md) - disallow declaration of variables that are not used in the code
* [no-use-before-define](no-use-before-define.md) - disallow use of variables before they are defined

## Node.js

These rules are specific to JavaScript running on Node.js.

* [handle-callback-err](handle-callback-err.md) - enforces error handling in callbacks
* [no-mixed-requires](no-mixed-requires.md) - disallow mixing regular variable and require declarations
* [no-path-concat](no-path-concat.md) - disallow string concatenation with `__dirname` and `__filename`
* [no-process-exit](no-process-exit.md) - disallow `process.exit()`
* [no-sync](no-sync.md) - disallow use of synchronous methods (off by default)

## Stylistic Issues

These rules are purely matters of style and are quite subjective.

* [brace-style](brace-style.md) - enforce one true brace style
* [camelcase](camelcase.md) - require camel case names
* [consistent-this](consistent-this.md) - enforces consistent naming when capturing the current execution context (off by default)
* [func-names](func-names.md) - require function expressions to have a name
* [func-style](func-style.md) - enforces use of function declarations or expressions
* [new-cap](new-cap.md) - require a capital letter for constructors
* [new-parens](new-parens.md) - disallow the omission of parentheses when invoking a contructor with no arguments
* [no-nested-ternary](no-nested-ternary.md) - disallow nested ternary expressions
* [no-array-constructor](no-array-constructor.md) - disallow use of the `Array` constructor
* [no-new-object](no-new-object.md) - disallow use of the `Object` constructor
* [no-spaced-func](no-spaced-func.md) - disallow space between function identifier and application
* [no-space-before-semi](no-space-before-semi.md) - disallow space before semicolon
* [no-ternary](no-ternary.md) - disallow the use of ternary operators
* [no-underscore-dangle](no-underscore-dangle.md) - disallow dangling underscores in identifiers
* [no-wrap-func](no-wrap-func.md) - disallow wrapping of none IIFE statements in parents
* [quotes](quotes.md) - specify whether double or single quotes should be used
* [quote-props](quote-props.md) - require quotes around object literal property names
* [semi](semi.md)- require or disallow use of semicolons instead of ASI
* [sort-vars](sort-vars.md) - sort variables within the same declaration block
* [space-in-brackets](space-in-brackets.md) - require or disallow spaces between brackets
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
