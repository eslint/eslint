# Rules

Rules in ESLint are divided into several categories to help you better understand their value. All rules are disabled by default. ESLint recommends some rules to catch common problems, and you can use these recommended rules by including `extends: "eslint:recommended"` in your configuration file. The rules that will be enabled when you inherit from `eslint:recommended` are indicated below as "(recommended)". For more information on how to configure rules and use `extends`, please see the [configuration documentation](../user-guide/configuring.md).

Some rules are fixable using the `--fix` command line flag. Those rules are marked as "(fixable)" below.

## Possible Errors

The following rules point out areas where you might have made mistakes.

* [comma-dangle](comma-dangle.md) - disallow or enforce trailing commas (recommended)
* [no-cond-assign](no-cond-assign.md) - disallow assignment in conditional expressions (recommended)
* [no-console](no-console.md) - disallow use of `console` in the node environment (recommended)
* [no-constant-condition](no-constant-condition.md) - disallow use of constant expressions in conditions (recommended)
* [no-control-regex](no-control-regex.md) - disallow control characters in regular expressions (recommended)
* [no-debugger](no-debugger.md) - disallow use of `debugger` (recommended)
* [no-dupe-args](no-dupe-args.md) - disallow duplicate arguments in functions (recommended)
* [no-dupe-keys](no-dupe-keys.md) - disallow duplicate keys when creating object literals (recommended)
* [no-duplicate-case](no-duplicate-case.md) - disallow a duplicate case label. (recommended)
* [no-empty-character-class](no-empty-character-class.md) - disallow the use of empty character classes in regular expressions (recommended)
* [no-empty](no-empty.md) - disallow empty statements (recommended)
* [no-ex-assign](no-ex-assign.md) - disallow assigning to the exception in a `catch` block (recommended)
* [no-extra-boolean-cast](no-extra-boolean-cast.md) - disallow double-negation boolean casts in a boolean context (recommended)
* [no-extra-parens](no-extra-parens.md) - disallow unnecessary parentheses
* [no-extra-semi](no-extra-semi.md) - disallow unnecessary semicolons (recommended) (fixable)
* [no-func-assign](no-func-assign.md) - disallow overwriting functions written as function declarations (recommended)
* [no-inner-declarations](no-inner-declarations.md) - disallow function or variable declarations in nested blocks (recommended)
* [no-invalid-regexp](no-invalid-regexp.md) - disallow invalid regular expression strings in the `RegExp` constructor (recommended)
* [no-irregular-whitespace](no-irregular-whitespace.md) - disallow irregular whitespace outside of strings and comments (recommended)
* [no-negated-in-lhs](no-negated-in-lhs.md) - disallow negation of the left operand of an `in` expression (recommended)
* [no-obj-calls](no-obj-calls.md) - disallow the use of object properties of the global object (`Math` and `JSON`) as functions (recommended)
* [no-regex-spaces](no-regex-spaces.md) - disallow multiple spaces in a regular expression literal (recommended)
* [no-sparse-arrays](no-sparse-arrays.md) - disallow sparse arrays (recommended)
* [no-unexpected-multiline](no-unexpected-multiline.md) - Avoid code that looks like two expressions but is actually one
* [no-unreachable](no-unreachable.md) - disallow unreachable statements after a return, throw, continue, or break statement (recommended)
* [use-isnan](use-isnan.md) - disallow comparisons with the value `NaN` (recommended)
* [valid-jsdoc](valid-jsdoc.md) - Ensure JSDoc comments are valid
* [valid-typeof](valid-typeof.md) - Ensure that the results of typeof are compared against a valid string (recommended)

## Best Practices

These are rules designed to prevent you from making mistakes. They either prescribe a better way of doing something or help you avoid footguns.

* [accessor-pairs](accessor-pairs.md) - Enforces getter/setter pairs in objects
* [block-scoped-var](block-scoped-var.md) - treat `var` statements as if they were block scoped
* [complexity](complexity.md) - specify the maximum cyclomatic complexity allowed in a program
* [consistent-return](consistent-return.md) - require `return` statements to either always or never specify values
* [curly](curly.md) - specify curly brace conventions for all control statements
* [default-case](default-case.md) - require `default` case in `switch` statements
* [dot-location](dot-location.md) - enforces consistent newlines before or after dots
* [dot-notation](dot-notation.md) - encourages use of dot notation whenever possible
* [eqeqeq](eqeqeq.md) - require the use of `===` and `!==` (fixable)
* [guard-for-in](guard-for-in.md) - make sure `for-in` loops have an `if` statement
* [no-alert](no-alert.md) - disallow the use of `alert`, `confirm`, and `prompt`
* [no-caller](no-caller.md) - disallow use of `arguments.caller` or `arguments.callee`
* [no-case-declarations](no-case-declarations.md) - disallow lexical declarations in case clauses
* [no-div-regex](no-div-regex.md) - disallow division operators explicitly at beginning of regular expression
* [no-else-return](no-else-return.md) - disallow `else` after a `return` in an `if`
* [no-empty-label](no-empty-label.md) - disallow use of labels for anything other than loops and switches
* [no-empty-pattern](no-empty-pattern.md) - disallow use of empty destructuring patterns
* [no-eq-null](no-eq-null.md) - disallow comparisons to null without a type-checking operator
* [no-eval](no-eval.md) - disallow use of `eval()`
* [no-extend-native](no-extend-native.md) - disallow adding to native types
* [no-extra-bind](no-extra-bind.md) - disallow unnecessary function binding
* [no-fallthrough](no-fallthrough.md) - disallow fallthrough of `case` statements (recommended)
* [no-floating-decimal](no-floating-decimal.md) - disallow the use of leading or trailing decimal points in numeric literals
* [no-implicit-coercion](no-implicit-coercion.md) - disallow the type conversions with shorter notations
* [no-implied-eval](no-implied-eval.md) - disallow use of `eval()`-like methods
* [no-invalid-this](no-invalid-this.md) - disallow `this` keywords outside of classes or class-like objects
* [no-iterator](no-iterator.md) - disallow usage of `__iterator__` property
* [no-labels](no-labels.md) - disallow use of labeled statements
* [no-lone-blocks](no-lone-blocks.md) - disallow unnecessary nested blocks
* [no-loop-func](no-loop-func.md) - disallow creation of functions within loops
* [no-magic-numbers](no-magic-numbers.md) - disallow the use of magic numbers
* [no-multi-spaces](no-multi-spaces.md) - disallow use of multiple spaces (fixable)
* [no-multi-str](no-multi-str.md) - disallow use of multiline strings
* [no-native-reassign](no-native-reassign.md) - disallow reassignments of native objects
* [no-new-func](no-new-func.md) - disallow use of new operator for `Function` object
* [no-new-wrappers](no-new-wrappers.md) - disallows creating new instances of `String`,`Number`, and `Boolean`
* [no-new](no-new.md) - disallow use of the `new` operator when not part of an assignment or comparison
* [no-octal-escape](no-octal-escape.md) - disallow use of octal escape sequences in string literals, such as `var foo = "Copyright \251";`
* [no-octal](no-octal.md) - disallow use of octal literals (recommended)
* [no-param-reassign](no-param-reassign.md) - disallow reassignment of function parameters
* [no-process-env](no-process-env.md) - disallow use of `process.env`
* [no-proto](no-proto.md) - disallow usage of `__proto__` property
* [no-redeclare](no-redeclare.md) - disallow declaring the same variable more than once (recommended)
* [no-return-assign](no-return-assign.md) - disallow use of assignment in `return` statement
* [no-script-url](no-script-url.md) - disallow use of `javascript:` urls.
* [no-self-compare](no-self-compare.md) - disallow comparisons where both sides are exactly the same
* [no-sequences](no-sequences.md) - disallow use of the comma operator
* [no-throw-literal](no-throw-literal.md) - restrict what can be thrown as an exception
* [no-unused-expressions](no-unused-expressions.md) - disallow usage of expressions in statement position
* [no-useless-call](no-useless-call.md) - disallow unnecessary `.call()` and `.apply()`
* [no-useless-concat](no-useless-concat.md) - disallow unnecessary concatenation of literals or template literals
* [no-void](no-void.md) - disallow use of the `void` operator
* [no-warning-comments](no-warning-comments.md) - disallow usage of configurable warning terms in comments - e.g. `TODO` or `FIXME`
* [no-with](no-with.md) - disallow use of the `with` statement
* [radix](radix.md) - require use of the second argument for `parseInt()`
* [vars-on-top](vars-on-top.md) - require declaration of all vars at the top of their containing scope
* [wrap-iife](wrap-iife.md) - require immediate function invocation to be wrapped in parentheses
* [yoda](yoda.md) - require or disallow Yoda conditions

## Strict Mode

These rules relate to using strict mode.

* [strict](strict.md) - controls location of Use Strict Directives

## Variables

These rules have to do with variable declarations.

* [init-declarations](init-declarations.md) - enforce or disallow variable initializations at definition
* [no-catch-shadow](no-catch-shadow.md) - disallow the catch clause parameter name being the same as a variable in the outer scope
* [no-delete-var](no-delete-var.md) - disallow deletion of variables (recommended)
* [no-label-var](no-label-var.md) - disallow labels that share a name with a variable
* [no-shadow-restricted-names](no-shadow-restricted-names.md) - disallow shadowing of names such as `arguments`
* [no-shadow](no-shadow.md) - disallow declaration of variables already declared in the outer scope
* [no-undef-init](no-undef-init.md) - disallow use of undefined when initializing variables
* [no-undef](no-undef.md) - disallow use of undeclared variables unless mentioned in a `/*global */` block (recommended)
* [no-undefined](no-undefined.md) - disallow use of `undefined` variable
* [no-unused-vars](no-unused-vars.md) - disallow declaration of variables that are not used in the code (recommended)
* [no-use-before-define](no-use-before-define.md) - disallow use of variables before they are defined

## Node.js and CommonJS

These rules are specific to JavaScript running on Node.js or using CommonJS in the browser.

* [callback-return](callback-return.md) - enforce `return` after a callback
* [global-require](global-require.md) - enforce `require()` on top-level module scope
* [handle-callback-err](handle-callback-err.md) - enforce error handling in callbacks
* [no-mixed-requires](no-mixed-requires.md) - disallow mixing regular variable and require declarations
* [no-new-require](no-new-require.md) - disallow use of `new` operator with the `require` function
* [no-path-concat](no-path-concat.md) - disallow string concatenation with `__dirname` and `__filename`
* [no-process-exit](no-process-exit.md) - disallow `process.exit()`
* [no-restricted-modules](no-restricted-modules.md) - restrict usage of specified node modules
* [no-sync](no-sync.md) - disallow use of synchronous methods

## Stylistic Issues

These rules are purely matters of style and are quite subjective.

* [array-bracket-spacing](array-bracket-spacing.md) - enforce spacing inside array brackets (fixable)
* [block-spacing](block-spacing.md) - disallow or enforce spaces inside of single line blocks (fixable)
* [brace-style](brace-style.md) - enforce one true brace style
* [camelcase](camelcase.md) - require camel case names
* [comma-spacing](comma-spacing.md) - enforce spacing before and after comma (fixable)
* [comma-style](comma-style.md) - enforce one true comma style
* [computed-property-spacing](computed-property-spacing.md) - require or disallow padding inside computed properties (fixable)
* [consistent-this](consistent-this.md) - enforce consistent naming when capturing the current execution context
* [eol-last](eol-last.md) - enforce newline at the end of file, with no multiple empty lines (fixable)
* [func-names](func-names.md) - require function expressions to have a name
* [func-style](func-style.md) - enforce use of function declarations or expressions
* [id-length](id-length.md) - this option enforces minimum and maximum identifier lengths (variable names, property names etc.)
* [id-match](id-match.md) - require identifiers to match the provided regular expression
* [indent](indent.md) - specify tab or space width for your code (fixable)
* [jsx-quotes](jsx-quotes.md) - specify whether double or single quotes should be used in JSX attributes
* [key-spacing](key-spacing.md) - enforce spacing between keys and values in object literal properties
* [linebreak-style](linebreak-style.md) - disallow mixed 'LF' and 'CRLF' as linebreaks
* [lines-around-comment](lines-around-comment.md) - enforce empty lines around comments
* [max-depth](max-depth.md) - specify the maximum depth that blocks can be nested
* [max-len](max-len.md) - specify the maximum length of a line in your program
* [max-nested-callbacks](max-nested-callbacks.md) - specify the maximum depth callbacks can be nested
* [max-params](max-params.md) - limits the number of parameters that can be used in the function declaration.
* [max-statements](max-statements.md) - specify the maximum number of statement allowed in a function
* [new-cap](new-cap.md) - require a capital letter for constructors
* [new-parens](new-parens.md) - disallow the omission of parentheses when invoking a constructor with no arguments
* [newline-after-var](newline-after-var.md) - require or disallow an empty newline after variable declarations
* [no-array-constructor](no-array-constructor.md) - disallow use of the `Array` constructor
* [no-bitwise](no-bitwise.md) - disallow use of bitwise operators
* [no-continue](no-continue.md) - disallow use of the `continue` statement
* [no-inline-comments](no-inline-comments.md) - disallow comments inline after code
* [no-lonely-if](no-lonely-if.md) - disallow `if` as the only statement in an `else` block
* [no-mixed-spaces-and-tabs](no-mixed-spaces-and-tabs.md) - disallow mixed spaces and tabs for indentation (recommended)
* [no-multiple-empty-lines](no-multiple-empty-lines.md) - disallow multiple empty lines
* [no-negated-condition](no-negated-condition.md) - disallow negated conditions
* [no-nested-ternary](no-nested-ternary.md) - disallow nested ternary expressions
* [no-new-object](no-new-object.md) - disallow the use of the `Object` constructor
* [no-plusplus](no-plusplus.md) - disallow use of unary operators, `++` and `--`
* [no-restricted-syntax](no-restricted-syntax.md) - disallow use of certain syntax in code
* [no-spaced-func](no-spaced-func.md) - disallow space between function identifier and application (fixable)
* [no-ternary](no-ternary.md) - disallow the use of ternary operators
* [no-trailing-spaces](no-trailing-spaces.md) - disallow trailing whitespace at the end of lines (fixable)
* [no-underscore-dangle](no-underscore-dangle.md) - disallow dangling underscores in identifiers
* [no-unneeded-ternary](no-unneeded-ternary.md) - disallow the use of ternary operators when a simpler alternative exists
* [object-curly-spacing](object-curly-spacing.md) - require or disallow padding inside curly braces (fixable)
* [one-var](one-var.md) - require or disallow one variable declaration per function
* [operator-assignment](operator-assignment.md) - require assignment operator shorthand where possible or prohibit it entirely
* [operator-linebreak](operator-linebreak.md) - enforce operators to be placed before or after line breaks
* [padded-blocks](padded-blocks.md) - enforce padding within blocks
* [quote-props](quote-props.md) - require quotes around object literal property names
* [quotes](quotes.md) - specify whether backticks, double or single quotes should be used (fixable)
* [require-jsdoc](require-jsdoc.md) - Require JSDoc comment
* [semi-spacing](semi-spacing.md) - enforce spacing before and after semicolons
* [semi](semi.md) - require or disallow use of semicolons instead of ASI (fixable)
* [sort-vars](sort-vars.md) - sort variables within the same declaration block
* [space-after-keywords](space-after-keywords.md) - require a space after certain keywords (fixable)
* [space-before-blocks](space-before-blocks.md) - require or disallow a space before blocks (fixable)
* [space-before-function-paren](space-before-function-paren.md) - require or disallow a space before function opening parenthesis (fixable)
* [space-before-keywords](space-before-keywords.md) - require a space before certain keywords (fixable)
* [space-in-parens](space-in-parens.md) - require or disallow spaces inside parentheses
* [space-infix-ops](space-infix-ops.md) - require spaces around operators (fixable)
* [space-return-throw-case](space-return-throw-case.md) - require a space after `return`, `throw`, and `case` (fixable)
* [space-unary-ops](space-unary-ops.md) - require or disallow spaces before/after unary operators (fixable)
* [spaced-comment](spaced-comment.md) - require or disallow a space immediately following the `//` or `/*` in a comment
* [wrap-regex](wrap-regex.md) - require regex literals to be wrapped in parentheses

## ECMAScript 6

These rules are only relevant to ES6 environments.

* [arrow-body-style](arrow-body-style.md) - require braces in arrow function body
* [arrow-parens](arrow-parens.md) - require parens in arrow function arguments
* [arrow-spacing](arrow-spacing.md) - require space before/after arrow function's arrow (fixable)
* [constructor-super](constructor-super.md) - verify calls of `super()` in constructors
* [generator-star-spacing](generator-star-spacing.md) - enforce spacing around the `*` in generator functions (fixable)
* [no-arrow-condition](no-arrow-condition.md) - disallow arrow functions where a condition is expected
* [no-class-assign](no-class-assign.md) - disallow modifying variables of class declarations
* [no-const-assign](no-const-assign.md) - disallow modifying variables that are declared using `const`
* [no-dupe-class-members](no-dupe-class-members.md) - disallow duplicate name in class members
* [no-this-before-super](no-this-before-super.md) - disallow use of `this`/`super` before calling `super()` in constructors.
* [no-var](no-var.md) - require `let` or `const` instead of `var`
* [object-shorthand](object-shorthand.md) - require method and property shorthand syntax for object literals
* [prefer-arrow-callback](prefer-arrow-callback.md) - suggest using arrow functions as callbacks
* [prefer-const](prefer-const.md) - suggest using `const` declaration for variables that are never modified after declared
* [prefer-reflect](prefer-reflect.md) - suggest using Reflect methods where applicable
* [prefer-spread](prefer-spread.md) - suggest using the spread operator instead of `.apply()`.
* [prefer-template](prefer-template.md) - suggest using template literals instead of strings concatenation
* [require-yield](require-yield.md) - disallow generator functions that do not have `yield`


## Removed

These rules existed in a previous version of ESLint but have since been replaced by newer rules.

* [generator-star](generator-star.md) - enforce the position of the `*` in generator functions (replaced by [generator-star-spacing](generator-star-spacing.md))
* [global-strict](global-strict.md) - require or disallow the `"use strict"` pragma in the global scope (replaced by [strict](strict.md))
* [no-comma-dangle](no-comma-dangle.md) - disallow trailing commas in object literals (replaced by [comma-dangle](comma-dangle.md))
* [no-empty-class](no-empty-class.md) - disallow the use of empty character classes in regular expressions (replaced by [no-empty-character-class](no-empty-character-class.md))
* [no-extra-strict](no-extra-strict.md) - disallow unnecessary use of `"use strict";` when already in strict mode (replaced by [strict](strict.md))
* [no-reserved-keys](no-reserved-keys.md) - disallow reserved words being used as object literal keys
* [no-space-before-semi](no-space-before-semi.md) - disallow space before semicolon (replaced by [semi-spacing](semi-spacing.md))
* [no-wrap-func](no-wrap-func.md) - disallow wrapping of non-IIFE statements in parens (replaced by [no-extra-parens](no-extra-parens.md))
* [space-after-function-name](space-after-function-name.md) - require a space after function names (replaced by [space-before-function-paren](space-before-function-paren.md))
* [space-before-function-parentheses](space-before-function-parentheses.md) - require or disallow space before function parentheses (replaced by [space-before-function-paren](space-before-function-paren.md))
* [space-in-brackets](space-in-brackets.md) - require or disallow spaces inside brackets (replaced by [object-curly-spacing](object-curly-spacing.md) and [array-bracket-spacing](array-bracket-spacing.md))
* [space-unary-word-ops](space-unary-word-ops.md) - require or disallow spaces before/after unary operators (replaced by [space-unary-ops](space-unary-ops.md))
* [spaced-line-comment](spaced-line-comment.md) - require or disallow a space immediately following the `//` in a line comment (replaced by [spaced-comment](spaced-comment.md))
