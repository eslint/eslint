# Rules

## Overview

Rules in ESLint are divided into several categories to help you better
understand their value, with the rules being introduced below roughly
according to a descending benefit-cost value, and subgrouped according
to whether the ratio is due more to benefit or cost, and according to
whether the rule applies only in specific environments.

All rules are disabled by default.

### Recommended Rules

ESLint recommends some rules to catch common problems, and you can use these
recommended rules by including `extends: "eslint:recommended"` in your
configuration file. The rules that will be enabled when you inherit
from `eslint:recommended` are indicated below as "(recommended)". For
more information on how to configure rules and use `extends`, please
see the [configuration documentation](../user-guide/configuring.md).

### Fixable Rules

Some rules are fixable using the `--fix` command line flag. Those rules
are marked as "(fixable)" below. Currently these fixes are mostly limited
only to whitespace fixes.

## Probable Errors (with little to no cost to fix)

The following rules point out areas where you may well have made mistakes.

These rules also should have little to no cost toward fixing them, i.e., the
problematic form is not likely to be useful even during development nor should
they get in the way of those who prefer succinct code even when it can be
obscure to some, so there should be little reason not to enable these rules
in any project.

### Can readily be worked around at low cost

Avoiding compliance with the following may have a use (at least toward
allowing greater succinctness), but often points to errors or indicates code
whose intent may be misunderstood by other programmers (such as novices or
those who might believe such code must be in error) or which are deprecated.
These can generally be worked around with a less obscure form with a minimum
of cost.

* [array-callback-return](array-callback-return.md) - Enforces return statements in callbacks of array's methods (recommended)
* [no-cond-assign](no-cond-assign.md) - disallow assignment in conditional expressions (recommended)
* [no-control-regex](no-control-regex.md) - disallow control characters in regular expressions (recommended)
* [no-empty-character-class](no-empty-character-class.md) - disallow the use of empty character classes in regular expressions (recommended)
* [no-func-assign](no-func-assign.md) - disallow overwriting functions written as function declarations (recommended)
* [no-iterator](no-iterator.md) - disallow usage of `__iterator__` property (May not be wanted for pre-ES6 Mozilla environments)
* [no-new-require](no-new-require.md) - disallow use of `new` operator with the `require` function (Node.js/CommonJS)
* [no-new-wrappers](no-new-wrappers.md) - disallows creating new instances of `String`,`Number`, and `Boolean`
* [no-octal](no-octal.md) - disallow use of octal literals (recommended)
* [no-octal-escape](no-octal-escape.md) - disallow use of octal escape sequences in string literals, such as `var foo = "Copyright \251";`
* [no-proto](no-proto.md) - disallow usage of `__proto__` property
* [no-regex-spaces](no-regex-spaces.md) - disallow multiple spaces in a regular expression literal (recommended)
* [no-return-assign](no-return-assign.md) - disallow use of assignment in `return` statement
* [no-sparse-arrays](no-sparse-arrays.md) - disallow sparse arrays (recommended)
* [no-undef](no-undef.md) - disallow use of undeclared variables unless mentioned in a `/*global */` block (recommended)
* [no-unexpected-multiline](no-unexpected-multiline.md) - Avoid code that looks like two expressions but is actually one (recommended)
* [no-unmodified-loop-condition](no-unmodified-loop-condition.md) - disallow unmodified conditions of loops (recommended)
* [no-unused-vars](no-unused-vars.md) - disallow declaration of variables that are not used in the code (recommended)
* [no-with](no-with.md) - disallow use of the `with` statement
* [radix](radix.md) - require use of the second argument for `parseInt()`
* [strict](strict.md) - require effective use of strict mode directives (Only of relevance where strict mode is supported)

### Not critical but might suggest misunderstanding or lack of understanding of language

Violations in the following may not always be harmful, but also serve no
purpose and may suggest that the developer does not understand the functioning
of the language (or is not taking advantage of convenient features).

#### ES6

* [no-dupe-class-members](no-dupe-class-members.md) - disallow duplicate name in class members (recommended) (ES6)
* [object-shorthand](object-shorthand.md) - require method and property shorthand syntax for object literals (ES6)
* [prefer-rest-params](prefer-rest-params.md) - suggest using the rest parameters instead of `arguments` (ES6)
* [prefer-spread](prefer-spread.md) - suggest using the spread operator instead of `.apply()` (ES6)

#### Other

* [accessor-pairs](accessor-pairs.md) - Enforces getter/setter pairs in objects (recommended)
* [no-delete-var](no-delete-var.md) - disallow deletion of variables (recommended)
* [no-dupe-args](no-dupe-args.md) - disallow duplicate arguments in functions (recommended)
* [no-dupe-keys](no-dupe-keys.md) - disallow duplicate keys when creating object literals (recommended)
* [no-duplicate-case](no-duplicate-case.md) - disallow a duplicate case label. (recommended)
* [no-extra-boolean-cast](no-extra-boolean-cast.md) - disallow double-negation boolean casts in a boolean context (recommended)
* [no-extra-semi](no-extra-semi.md) - disallow unnecessary semicolons (recommended) (fixable)
* [no-invalid-regexp](no-invalid-regexp.md) - disallow invalid regular expression strings in the `RegExp` constructor (recommended)
* [no-negated-in-lhs](no-negated-in-lhs.md) - disallow negation of the left operand of an `in` expression (recommended)
* [no-new-object](no-new-object.md) - disallow the use of the `Object` constructor
* [no-obj-calls](no-obj-calls.md) - disallow the use of object properties of the global object (`Math` and `JSON`) as functions (recommended)
* [no-path-concat](no-path-concat.md) - disallow string concatenation with `__dirname` and `__filename` (Node.js)
* [no-unneeded-ternary](no-unneeded-ternary.md) - disallow the use of ternary operators when a simpler alternative exists
* [use-isnan](use-isnan.md) - disallow comparisons with the value `NaN` (recommended)

### Problematic but only before ES6

The following could be of use in avoiding errors but only prior to ES6.

* [no-inner-declarations](no-inner-declarations.md) - disallow function or variable declarations in nested blocks (recommended)
* See also `quote-props` and `no-multi-str` if prior to ES5

### Problematic but only for ES6, Node.js, or non-Mozilla code

The following could be of use in avoiding errors but only if using ES6, Node.js, or
supporting non-Mozilla code.

* [callback-return](callback-return.md) - enforce `return` after a callback (Node.js)
* [no-const-assign](no-const-assign.md) - disallow modifying variables that are declared using `const` (recommended) (ES6)
* [no-new-symbol](no-new-symbol.md) - disallow use of the `new` operator with the `Symbol` object (recommended) (ES6)
* [no-this-before-super](no-this-before-super.md) - disallow use of `this`/`super` before calling `super()` in constructors (recommended) (ES6)
* See `no-iterator` and `no-proto`.

### Problematic but may have atypical use cases

The following could be of some use to avoid but only with atypical
environments. It otherwise is useful in avoiding errors.

* [valid-typeof](valid-typeof.md) - Ensure that the results of typeof are compared against a valid string (recommended)

### Problematic but potentially useful in debugging or scaffolding for future changes

The conditions caught by the following rules should most likely not be
allowed to occur in production code (whether due to indicating an error
or just looking unprofessional), but they might have a use during
debugging or in anticipation of planned future changes. They may have
some real use in certain cases for production code but can be more
safely worked around or explicitly enabled on a case-by-case basis if needed.

#### Logging

* [no-console](no-console.md) - disallow use of `console` (recommended)
* [no-debugger](no-debugger.md) - disallow use of `debugger` (recommended)
* [no-alert](no-alert.md) - disallow the use of `alert`, `confirm`, and `prompt`

#### Node.js

* [handle-callback-err](handle-callback-err.md) - enforce error handling in callbacks (Node.js)
* [no-process-exit](no-process-exit.md) - disallow `process.exit()` (Node.js)
* [no-sync](no-sync.md) - disallow use of synchronous methods (Node.js)

#### ES6

* [no-useless-constructor](no-useless-constructor.md) - disallow unnecessary constructor (ES6)
* [require-yield](require-yield.md) - disallow generator functions that do not have `yield` (ES6)

#### Other

* [no-constant-condition](no-constant-condition.md) - disallow use of constant expressions in conditions (recommended)
* [no-empty](no-empty.md) - disallow empty block statements (recommended)
* [no-empty-function](no-empty-function.md) - disallow use of empty functions
* [no-empty-pattern](no-empty-pattern.md) - disallow use of empty destructuring patterns (ES6) (recommended)
* [no-ex-assign](no-ex-assign.md) - disallow assigning to the exception in a `catch` block (recommended)
* [no-extra-bind](no-extra-bind.md) - disallow unnecessary function binding
* [no-extra-label](no-extra-label.md) - disallow unnecessary labels
* [no-lone-blocks](no-lone-blocks.md) - disallow unnecessary nested blocks
* [no-lonely-if](no-lonely-if.md) - disallow `if` as the only statement in an `else` block
* [no-param-reassign](no-param-reassign.md) - disallow reassignment of function parameters
* [no-self-assign](no-self-assign.md) - disallow assignments where both sides are exactly the same (recommended)
* [no-self-compare](no-self-compare.md) - disallow comparisons where both sides are exactly the same (recommended)
* [no-shadow-restricted-names](no-shadow-restricted-names.md) - disallow shadowing of names such as `arguments` (recommended)
* [no-unreachable](no-unreachable.md) - disallow unreachable statements after a return, throw, continue, or break statement (recommended)
* [no-unused-expressions](no-unused-expressions.md) - disallow usage of expressions in statement position
* [no-unused-labels](no-unused-labels.md) - disallow unused labels (recommended)
* [no-useless-call](no-useless-call.md) - disallow unnecessary `.call()` and `.apply()`
* [no-useless-concat](no-useless-concat.md) - disallow unnecessary concatenation of literals or template literals
* [valid-jsdoc](valid-jsdoc.md) - Ensure JSDoc comments are valid

### Potentially problematic but useful for some coding styles

The following might be considered useful for some styles, but may also point to errors.

* [comma-dangle](comma-dangle.md) - disallow or enforce trailing commas (recommended)
* [no-irregular-whitespace](no-irregular-whitespace.md) - disallow irregular whitespace outside of strings and comments (recommended)

## Best Practices

These are rules designed to prevent you from making mistakes. They either prescribe a better way of doing something or help you avoid footguns. Compared to those in the probable errors section, the following may require more effort to enforce, come at a greater cost, or be less confusing or less difficult to maintain for at least minimally experienced JavaScript developers.

### Best practices for slightly improving clarity/readability

The following may help give added clarity or readability but are not
technically necessary nor is their absence likely to be a footgun or
be particularly confusing.

* [dot-notation](dot-notation.md) - encourages use of dot notation whenever possible
* [no-div-regex](no-div-regex.md) - disallow division operators explicitly at beginning of regular expression
* [no-extra-parens](no-extra-parens.md) - disallow unnecessary parentheses
* [no-floating-decimal](no-floating-decimal.md) - disallow the use of leading or trailing decimal points in numeric literals
* [no-magic-numbers](no-magic-numbers.md) - disallow the use of magic numbers
* [wrap-iife](wrap-iife.md) - require immediate function invocation to be wrapped in parentheses
* [yoda](yoda.md) - require or disallow Yoda conditions

### Best practices at a potential cost

#### Special environments

* [no-restricted-imports](no-restricted-imports.md) - restrict usage of specified modules when loaded by `import` declaration (ES6)
* [no-restricted-modules](no-restricted-modules.md) - restrict usage of specified modules when loaded by `require` function (Node.js/CommonJS)
* [constructor-super](constructor-super.md) - verify calls of `super()` in constructors (recommended) (ES6)
* [no-confusing-arrow](no-confusing-arrow.md) - disallow arrow functions where they could be confused with comparisons (ES6)
* [no-process-env](no-process-env.md) - disallow use of `process.env` (Node.js)
* [no-var](no-var.md) - require `let` or `const` instead of `var` (ES6)
* [prefer-arrow-callback](prefer-arrow-callback.md) - suggest using arrow functions as callbacks (ES6)
* [prefer-const](prefer-const.md) - suggest using `const` declaration for variables that are never reassigned after declared (ES6)
* [prefer-reflect](prefer-reflect.md) - suggest using Reflect methods where applicable (ES6)
* See also `no-class-assign`.

#### Shadowing

The best practice rules pertaining to shadowing are grouped here together as one might wish these to be consistent.

* [no-class-assign](no-class-assign.md) - disallow modifying variables of class declarations (recommended) (ES6)
* [no-catch-shadow](no-catch-shadow.md) - disallow the catch clause parameter name being the same as a variable in the outer scope
* [no-label-var](no-label-var.md) - disallow labels that share a name with a variable
* [no-shadow](no-shadow.md) - disallow declaration of variables already declared in the outer scope
* See also `no-shadow-restricted-names`.

#### Other

* [block-scoped-var](block-scoped-var.md) - treat `var` statements as if they were block scoped (recommended)
* [complexity](complexity.md) - specify the maximum cyclomatic complexity allowed in a program
* [consistent-return](consistent-return.md) - require `return` statements to either always or never specify values
* [curly](curly.md) - specify curly brace conventions for all control statements
* [default-case](default-case.md) - require `default` case in `switch` statements
* [dot-location](dot-location.md) - enforces consistent newlines before or after dots
* [eqeqeq](eqeqeq.md) - require the use of `===` and `!==`
* [guard-for-in](guard-for-in.md) - make sure `for-in` loops have an `if` statement
* [init-declarations](init-declarations.md) - enforce or disallow variable initializations at definition
* [no-array-constructor](no-array-constructor.md) - disallow use of the `Array` constructor
* [no-caller](no-caller.md) - disallow use of `arguments.caller` or `arguments.callee`
* [no-case-declarations](no-case-declarations.md) - disallow lexical declarations in case clauses (recommended)
* [no-eq-null](no-eq-null.md) - disallow comparisons to `null` without a type-checking operator
* [no-eval](no-eval.md) - disallow use of `eval()`
* [no-extend-native](no-extend-native.md) - disallow adding to native types
* [no-fallthrough](no-fallthrough.md) - disallow fallthrough of `case` statements (recommended)
* [no-implicit-coercion](no-implicit-coercion.md) - disallow the type conversions with shorter notations
* [no-implicit-globals](no-implicit-globals.md) - disallow `var` and named functions in global scope
* [no-implied-eval](no-implied-eval.md) - disallow use of `eval()`-like methods
* [no-invalid-this](no-invalid-this.md) - disallow `this` keywords outside of classes or class-like objects
* [no-labels](no-labels.md) - disallow use of labeled statements
* [no-loop-func](no-loop-func.md) - disallow creation of functions within loops
* [no-native-reassign](no-native-reassign.md) - disallow reassignments of native objects
* [no-new](no-new.md) - disallow use of the `new` operator when not part of an assignment or comparison
* [no-new-func](no-new-func.md) - disallow use of new operator for `Function` object
* [no-redeclare](no-redeclare.md) - disallow declaring the same variable more than once (recommended)
* [no-restricted-globals](no-restricted-globals.md) - restrict usage of specified global variables
* [no-script-url](no-script-url.md) - disallow use of `javascript:` urls.
* [no-sequences](no-sequences.md) - disallow use of the comma operator
* [no-throw-literal](no-throw-literal.md) - restrict what can be thrown as an exception
* [no-undefined](no-undefined.md) - disallow use of `undefined` variable
* [no-undef-init](no-undef-init.md) - disallow use of `undefined` when initializing variables
* [no-use-before-define](no-use-before-define.md) - disallow use of variables before they are defined
* [no-void](no-void.md) - disallow use of the `void` operator
* [no-warning-comments](no-warning-comments.md) - disallow usage of configurable warning terms in comments - e.g. `TODO` or `FIXME`
* [vars-on-top](vars-on-top.md) - require declaration of all vars at the top of their containing scope
* [wrap-regex](wrap-regex.md) - require regex literals to be wrapped in parentheses

### Best practices which may nevertheless be less understandable to some

The following may help give added clarity or readability for some but
could also point to a mistaken understanding.

* [no-else-return](no-else-return.md) - disallow `else` after a `return` in an `if`

## Stylistic Issues

### Stylistic issues whose consistency which may be particularly helpful

The following rules are stylistic and not likely to cause
confusion if missing and may in some cases come at a cost
but can be more compelling than other stylistic rules due
to having potential benefits in improving code readability.

#### Special environments

* [global-require](global-require.md) - enforce `require()` on top-level module scope (Node.js/CommonJS)
* [no-mixed-requires](no-mixed-requires.md) - disallow mixing regular variable and require declarations (Node.js/CommonJS)

#### Other

* [consistent-this](consistent-this.md) - enforce consistent naming when capturing the current execution context
* [func-names](func-names.md) - require function expressions to have a name
* [id-length](id-length.md) - this option enforces minimum and maximum identifier lengths (variable names, property names etc.)
* [indent](indent.md) - specify tab or space width for your code (fixable)
* [linebreak-style](linebreak-style.md) - disallow mixed 'LF' and 'CRLF' as linebreaks (fixable)
* [max-depth](max-depth.md) - specify the maximum depth that blocks can be nested
* [max-len](max-len.md) - specify the maximum length of a line in your program
* [max-nested-callbacks](max-nested-callbacks.md) - specify the maximum depth callbacks can be nested
* [max-params](max-params.md) - limits the number of parameters that can be used in the function declaration
* [max-statements](max-statements.md) - specify the maximum number of statement allowed in a function
* [new-cap](new-cap.md) - require a capital letter for constructors
* [no-mixed-spaces-and-tabs](no-mixed-spaces-and-tabs.md) - disallow mixed spaces and tabs for indentation (recommended)
* [require-jsdoc](require-jsdoc.md) - Require JSDoc comment

### Normal mostly arbitrary stylistic rules

These rules are purely matters of style and are quite subjective. However,
the imposition of consistency, regardless of the arbitrariness of the
choice, may help others better follow and search through code.

#### ES6

* [arrow-body-style](arrow-body-style.md) - require braces in arrow function body (ES6)
* [arrow-parens](arrow-parens.md) - require parens in arrow function arguments (ES6)
* [arrow-spacing](arrow-spacing.md) - require space before/after arrow function's arrow (fixable) (ES6)
* [generator-star-spacing](generator-star-spacing.md) - enforce spacing around the `*` in generator functions (fixable) (ES6)
* [prefer-template](prefer-template.md) - suggest using template literals instead of strings concatenation (ES6)
* [template-curly-spacing](template-curly-spacing.md) - enforce spacing around embedded expressions of template strings (fixable) (ES6)
* [yield-star-spacing](yield-star-spacing.md) - enforce spacing around the `*` in `yield*` expressions (fixable) (ES6)

#### Other

* [array-bracket-spacing](array-bracket-spacing.md) - enforce spacing inside array brackets (fixable)
* [block-spacing](block-spacing.md) - disallow or enforce spaces inside of single line blocks (fixable)
* [brace-style](brace-style.md) - enforce one true brace style
* [camelcase](camelcase.md) - require camel case names
* [comma-spacing](comma-spacing.md) - enforce spacing before and after comma (fixable)
* [comma-style](comma-style.md) - enforce one true comma style
* [computed-property-spacing](computed-property-spacing.md) - require or disallow padding inside computed properties (fixable)
* [eol-last](eol-last.md) - enforce newline at the end of file, with no multiple empty lines (fixable)
* [func-style](func-style.md) - enforce use of function declarations or expressions
* [id-blacklist](id-blacklist.md) - blacklist certain identifiers to prevent them being used
* [id-match](id-match.md) - require identifiers to match the provided regular expression
* [jsx-quotes](jsx-quotes.md) - specify whether double or single quotes should be used in JSX attributes (fixable)
* [key-spacing](key-spacing.md) - enforce spacing between keys and values in object literal properties
* [keyword-spacing](keyword-spacing.md) - enforce spacing before and after keywords (fixable)
* [lines-around-comment](lines-around-comment.md) - enforce empty lines around comments
* [new-parens](new-parens.md) - disallow the omission of parentheses when invoking a constructor with no arguments
* [newline-after-var](newline-after-var.md) - require or disallow an empty newline after variable declarations
* [newline-before-return](newline-before-return.md) - require newline before `return` statement
* [newline-per-chained-call](newline-per-chained-call.md) - enforce newline after each call when chaining the calls
* [no-bitwise](no-bitwise.md) - disallow use of bitwise operators
* [no-continue](no-continue.md) - disallow use of the `continue` statement
* [no-inline-comments](no-inline-comments.md) - disallow comments inline after code
* [no-multi-spaces](no-multi-spaces.md) - disallow use of multiple spaces (fixable)
* [no-multi-str](no-multi-str.md) - disallow use of multiline strings
* [no-multiple-empty-lines](no-multiple-empty-lines.md) - disallow multiple empty lines
* [no-negated-condition](no-negated-condition.md) - disallow negated conditions
* [no-nested-ternary](no-nested-ternary.md) - disallow nested ternary expressions
* [no-plusplus](no-plusplus.md) - disallow use of unary operators, `++` and `--`
* [no-restricted-syntax](no-restricted-syntax.md) - disallow use of certain syntax in code
* [no-spaced-func](no-spaced-func.md) - disallow space between function identifier and application (fixable)
* [no-ternary](no-ternary.md) - disallow the use of ternary operators
* [no-trailing-spaces](no-trailing-spaces.md) - disallow trailing whitespace at the end of lines (fixable)
* [no-underscore-dangle](no-underscore-dangle.md) - disallow dangling underscores in identifiers
* [no-whitespace-before-property](no-whitespace-before-property.md) - disallow whitespace before properties
* [object-curly-spacing](object-curly-spacing.md) - require or disallow padding inside curly braces (fixable)
* [one-var](one-var.md) - require or disallow one variable declaration per function
* [one-var-declaration-per-line](one-var-declaration-per-line.md) - require or disallow an newline around variable declarations
* [operator-assignment](operator-assignment.md) - require assignment operator shorthand where possible or prohibit it entirely
* [operator-linebreak](operator-linebreak.md) - enforce operators to be placed before or after line breaks
* [padded-blocks](padded-blocks.md) - enforce padding within blocks
* [quote-props](quote-props.md) - require quotes around object literal property names (Partially relevant to pre-ES5 code)
* [quotes](quotes.md) - specify whether backticks, double or single quotes should be used (fixable)
* [semi](semi.md) - require or disallow use of semicolons instead of ASI (fixable)
* [semi-spacing](semi-spacing.md) - enforce spacing before and after semicolons (fixable)
* [sort-imports](sort-imports.md) - sort import declarations within module
* [sort-vars](sort-vars.md) - sort variables within the same declaration block
* [space-before-blocks](space-before-blocks.md) - require or disallow a space before blocks (fixable)
* [space-before-function-paren](space-before-function-paren.md) - require or disallow a space before function opening parenthesis (fixable)
* [space-in-parens](space-in-parens.md) - require or disallow spaces inside parentheses (fixable)
* [space-infix-ops](space-infix-ops.md) - require spaces around operators (fixable)
* [space-unary-ops](space-unary-ops.md) - require or disallow spaces before/after unary operators (fixable)
* [spaced-comment](spaced-comment.md) - require or disallow a space immediately following the `//` or `/*` in a comment

## Removed

These rules existed in a previous version of ESLint but have since been replaced by newer rules.

* [generator-star](generator-star.md) - enforce the position of the `*` in generator functions (replaced by [generator-star-spacing](generator-star-spacing.md))
* [global-strict](global-strict.md) - require or disallow the `"use strict"` pragma in the global scope (replaced by [strict](strict.md))
* [no-arrow-condition](no-arrow-condition.md) - disallow arrow functions where a condition is expected (replaced by [no-confusing-arrow](no-confusing-arrow.md) and [no-constant-condition](no-constant-condition.md))
* [no-comma-dangle](no-comma-dangle.md) - disallow trailing commas in object literals (replaced by [comma-dangle](comma-dangle.md))
* [no-empty-class](no-empty-class.md) - disallow the use of empty character classes in regular expressions (replaced by [no-empty-character-class](no-empty-character-class.md))
* [no-empty-label](no-empty-label.md) - disallow use of labels for anything other than loops and switches (replaced by [no-labels](no-labels.md))
* [no-extra-strict](no-extra-strict.md) - disallow unnecessary use of `"use strict";` when already in strict mode (replaced by [strict](strict.md))
* [no-reserved-keys](no-reserved-keys.md) - disallow reserved words being used as object literal keys (replaced by [quote-props](quote-props.md))
* [no-space-before-semi](no-space-before-semi.md) - disallow space before semicolon (replaced by [semi-spacing](semi-spacing.md))
* [no-wrap-func](no-wrap-func.md) - disallow wrapping of non-IIFE statements in parens (replaced by [no-extra-parens](no-extra-parens.md))
* [space-after-function-name](space-after-function-name.md) - require a space after function names (replaced by [space-before-function-paren](space-before-function-paren.md))
* [space-after-keywords](space-after-keywords.md) - require a space after certain keywords (fixable) (replaced by [keyword-spacing](keyword-spacing.md))
* [space-before-function-parentheses](space-before-function-parentheses.md) - require or disallow space before function parentheses (replaced by [space-before-function-paren](space-before-function-paren.md))
* [space-before-keywords](space-before-keywords.md) - require a space before certain keywords (fixable) (replaced by [keyword-spacing](keyword-spacing.md))
* [space-in-brackets](space-in-brackets.md) - require or disallow spaces inside brackets (replaced by [object-curly-spacing](object-curly-spacing.md) and [array-bracket-spacing](array-bracket-spacing.md))
* [space-return-throw-case](space-return-throw-case.md) - require a space after `return`, `throw`, and `case` (fixable) (replaced by [keyword-spacing](keyword-spacing.md))
* [space-unary-word-ops](space-unary-word-ops.md) - require or disallow spaces before/after unary operators (replaced by [space-unary-ops](space-unary-ops.md))
* [spaced-line-comment](spaced-line-comment.md) - require or disallow a space immediately following the `//` in a line comment (replaced by [spaced-comment](spaced-comment.md))
