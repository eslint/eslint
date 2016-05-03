# Rules

Rules in ESLint are grouped by category to help you understand their purpose.

No rules are enabled by default. The `"extends": "eslint:recommended"` property in a [configuration file](../user-guide/configuring#extending-configuration-files) enables rules that report common problems, which have a check mark (recommended) below.

The `--fix` option on the [command line](../user-guide/command-line-interface#fix) automatically fixes problems (currently mostly whitespace) reported by rules which have a wrench (fixable) below.

## Possible Errors

These rules relate to possible syntax or logic errors in JavaScript code:

* [comma-dangle](comma-dangle.md): require or disallow trailing commas (recommended) (fixable)
* [no-cond-assign](no-cond-assign.md): disallow assignment operators in conditional expressions (recommended)
* [no-console](no-console.md): disallow the use of `console` (recommended)
* [no-constant-condition](no-constant-condition.md): disallow constant expressions in conditions (recommended)
* [no-control-regex](no-control-regex.md): disallow control characters in regular expressions (recommended)
* [no-debugger](no-debugger.md): disallow the use of `debugger` (recommended)
* [no-dupe-args](no-dupe-args.md): disallow duplicate arguments in `function` definitions (recommended)
* [no-dupe-keys](no-dupe-keys.md): disallow duplicate keys in object literals (recommended)
* [no-duplicate-case](no-duplicate-case.md): disallow duplicate case labels (recommended)
* [no-empty](no-empty.md): disallow empty block statements (recommended)
* [no-empty-character-class](no-empty-character-class.md): disallow empty character classes in regular expressions (recommended)
* [no-ex-assign](no-ex-assign.md): disallow reassigning exceptions in `catch` clauses (recommended)
* [no-extra-boolean-cast](no-extra-boolean-cast.md): disallow unnecessary boolean casts (recommended)
* [no-extra-parens](no-extra-parens.md): disallow unnecessary parentheses
* [no-extra-semi](no-extra-semi.md): disallow unnecessary semicolons (recommended) (fixable)
* [no-func-assign](no-func-assign.md): disallow reassigning `function` declarations (recommended)
* [no-inner-declarations](no-inner-declarations.md): disallow `function` or `var` declarations in nested blocks (recommended)
* [no-invalid-regexp](no-invalid-regexp.md): disallow invalid regular expression strings in `RegExp` constructors (recommended)
* [no-irregular-whitespace](no-irregular-whitespace.md): disallow irregular whitespace outside of strings and comments (recommended)
* [no-negated-in-lhs](no-negated-in-lhs.md): disallow negating the left operand in `in` expressions (recommended)
* [no-obj-calls](no-obj-calls.md): disallow calling global object properties as functions (recommended)
* [no-regex-spaces](no-regex-spaces.md): disallow multiple spaces in regular expression literals (recommended)
* [no-sparse-arrays](no-sparse-arrays.md): disallow sparse arrays (recommended)
* [no-unexpected-multiline](no-unexpected-multiline.md): disallow confusing multiline expressions (recommended)
* [no-unreachable](no-unreachable.md): disallow unreachable code after `return`, `throw`, `continue`, and `break` statements (recommended)
* [no-unsafe-finally](no-unsafe-finally.md): disallow control flow statements in `finally` blocks
* [use-isnan](use-isnan.md): require calls to `isNaN()` when checking for `NaN` (recommended)
* [valid-jsdoc](valid-jsdoc.md): enforce valid JSDoc comments
* [valid-typeof](valid-typeof.md): enforce comparing `typeof` expressions against valid strings (recommended)

## Best Practices

These rules relate to better ways of doing things to help you avoid problems:

* [accessor-pairs](accessor-pairs.md): enforce getter and setter pairs in objects
* [array-callback-return](array-callback-return.md): enforce `return` statements in callbacks of array methods
* [block-scoped-var](block-scoped-var.md): enforce the use of variables within the scope they are defined
* [complexity](complexity.md): enforce a maximum cyclomatic complexity allowed in a program
* [consistent-return](consistent-return.md): require `return` statements to either always or never specify values
* [curly](curly.md): enforce consistent brace style for all control statements
* [default-case](default-case.md): require `default` cases in `switch` statements
* [dot-location](dot-location.md): enforce consistent newlines before and after dots
* [dot-notation](dot-notation.md): enforce dot notation whenever possible
* [eqeqeq](eqeqeq.md): require the use of `===` and `!==`
* [guard-for-in](guard-for-in.md): require `for-in` loops to include an `if` statement
* [no-alert](no-alert.md): disallow the use of `alert`, `confirm`, and `prompt`
* [no-caller](no-caller.md): disallow the use of `arguments.caller` or `arguments.callee`
* [no-case-declarations](no-case-declarations.md): disallow lexical declarations in case clauses (recommended)
* [no-div-regex](no-div-regex.md): disallow division operators explicitly at the beginning of regular expressions
* [no-else-return](no-else-return.md): disallow `else` blocks after `return` statements in `if` statements
* [no-empty-function](no-empty-function.md): disallow empty functions
* [no-empty-pattern](no-empty-pattern.md): disallow empty destructuring patterns (recommended)
* [no-eq-null](no-eq-null.md): disallow `null` comparisons without type-checking operators
* [no-eval](no-eval.md): disallow the use of `eval()`
* [no-extend-native](no-extend-native.md): disallow extending native types
* [no-extra-bind](no-extra-bind.md): disallow unnecessary calls to `.bind()`
* [no-extra-label](no-extra-label.md): disallow unnecessary labels
* [no-fallthrough](no-fallthrough.md): disallow fallthrough of `case` statements (recommended)
* [no-floating-decimal](no-floating-decimal.md): disallow leading or trailing decimal points in numeric literals
* [no-implicit-coercion](no-implicit-coercion.md): disallow shorthand type conversions
* [no-implicit-globals](no-implicit-globals.md): disallow `var` and named `function` declarations in the global scope
* [no-implied-eval](no-implied-eval.md): disallow the use of `eval()`-like methods
* [no-invalid-this](no-invalid-this.md): disallow `this` keywords outside of classes or class-like objects
* [no-iterator](no-iterator.md): disallow the use of the `__iterator__` property
* [no-labels](no-labels.md): disallow labeled statements
* [no-lone-blocks](no-lone-blocks.md): disallow unnecessary nested blocks
* [no-loop-func](no-loop-func.md): disallow `function` declarations and expressions inside loop statements
* [no-magic-numbers](no-magic-numbers.md): disallow magic numbers
* [no-multi-spaces](no-multi-spaces.md): disallow multiple spaces (fixable)
* [no-multi-str](no-multi-str.md): disallow multiline strings
* [no-native-reassign](no-native-reassign.md): disallow reassigning native objects
* [no-new](no-new.md): disallow `new` operators outside of assignments or comparisons
* [no-new-func](no-new-func.md): disallow `new` operators with the `Function` object
* [no-new-wrappers](no-new-wrappers.md): disallow `new` operators with the `String`, `Number`, and `Boolean` objects
* [no-octal](no-octal.md): disallow octal literals (recommended)
* [no-octal-escape](no-octal-escape.md): disallow octal escape sequences in string literals
* [no-param-reassign](no-param-reassign.md): disallow reassigning `function` parameters
* [no-proto](no-proto.md): disallow the use of the `__proto__` property
* [no-redeclare](no-redeclare.md): disallow `var` redeclaration (recommended)
* [no-return-assign](no-return-assign.md): disallow assignment operators in `return` statements
* [no-script-url](no-script-url.md): disallow `javascript:` urls
* [no-self-assign](no-self-assign.md): disallow assignments where both sides are exactly the same (recommended)
* [no-self-compare](no-self-compare.md): disallow comparisons where both sides are exactly the same
* [no-sequences](no-sequences.md): disallow comma operators
* [no-throw-literal](no-throw-literal.md): disallow throwing literals as exceptions
* [no-unmodified-loop-condition](no-unmodified-loop-condition.md): disallow unmodified loop conditions
* [no-unused-expressions](no-unused-expressions.md): disallow unused expressions
* [no-unused-labels](no-unused-labels.md): disallow unused labels (recommended)
* [no-useless-call](no-useless-call.md): disallow unnecessary calls to `.call()` and `.apply()`
* [no-useless-concat](no-useless-concat.md): disallow unnecessary concatenation of literals or template literals
* [no-useless-escape](no-useless-escape.md): disallow unnecessary escape characters
* [no-void](no-void.md): disallow `void` operators
* [no-warning-comments](no-warning-comments.md): disallow specified warning terms in comments
* [no-with](no-with.md): disallow `with` statements
* [radix](radix.md): enforce the consistent use of the radix argument when using `parseInt()`
* [vars-on-top](vars-on-top.md): require `var` declarations be placed at the top of their containing scope
* [wrap-iife](wrap-iife.md): require parentheses around immediate `function` invocations
* [yoda](yoda.md): require or disallow "Yoda" conditions

## Strict Mode

These rules relate to strict mode directives:

* [strict](strict.md): require or disallow strict mode directives

## Variables

These rules relate to variable declarations:

* [init-declarations](init-declarations.md): require or disallow initialization in `var` declarations
* [no-catch-shadow](no-catch-shadow.md): disallow `catch` clause parameters from shadowing variables in the outer scope
* [no-delete-var](no-delete-var.md): disallow deleting variables (recommended)
* [no-label-var](no-label-var.md): disallow labels that share a name with a variable
* [no-restricted-globals](no-restricted-globals.md): disallow specified global variables
* [no-shadow](no-shadow.md): disallow `var` declarations from shadowing variables in the outer scope
* [no-shadow-restricted-names](no-shadow-restricted-names.md): disallow identifiers from shadowing restricted names
* [no-undef](no-undef.md): disallow the use of undeclared variables unless mentioned in `/*global */` comments (recommended)
* [no-undef-init](no-undef-init.md): disallow initializing variables to `undefined`
* [no-undefined](no-undefined.md): disallow the use of `undefined` as an identifier
* [no-unused-vars](no-unused-vars.md): disallow unused variables (recommended)
* [no-use-before-define](no-use-before-define.md): disallow the use of variables before they are defined

## Node.js and CommonJS

These rules relate to code running in Node.js, or in browsers with CommonJS:

* [callback-return](callback-return.md): require `return` statements after callbacks
* [global-require](global-require.md): require `require()` calls to be placed at top-level module scope
* [handle-callback-err](handle-callback-err.md): require error handling in callbacks
* [no-mixed-requires](no-mixed-requires.md): disallow `require` calls to be mixed with regular `var` declarations
* [no-new-require](no-new-require.md): disallow `new` operators with calls to `require`
* [no-path-concat](no-path-concat.md): disallow string concatenation with `__dirname` and `__filename`
* [no-process-env](no-process-env.md): disallow the use of `process.env`
* [no-process-exit](no-process-exit.md): disallow the use of `process.exit()`
* [no-restricted-modules](no-restricted-modules.md): disallow specified modules when loaded by `require`
* [no-sync](no-sync.md): disallow synchronous methods

## Stylistic Issues

These rules relate to style guidelines, and are therefore quite subjective:

* [array-bracket-spacing](array-bracket-spacing.md): enforce consistent spacing inside array brackets (fixable)
* [block-spacing](block-spacing.md): enforce consistent spacing inside single-line blocks (fixable)
* [brace-style](brace-style.md): enforce consistent brace style for blocks
* [camelcase](camelcase.md): enforce camelcase naming convention
* [comma-spacing](comma-spacing.md): enforce consistent spacing before and after commas (fixable)
* [comma-style](comma-style.md): enforce consistent comma style
* [computed-property-spacing](computed-property-spacing.md): enforce consistent spacing inside computed property brackets (fixable)
* [consistent-this](consistent-this.md): enforce consistent naming when capturing the current execution context
* [eol-last](eol-last.md): enforce at least one newline at the end of files (fixable)
* [func-names](func-names.md): enforce named `function` expressions
* [func-style](func-style.md): enforce the consistent use of either `function` declarations or expressions
* [id-blacklist](id-blacklist.md): disallow specified identifiers
* [id-length](id-length.md): enforce minimum and maximum identifier lengths
* [id-match](id-match.md): require identifiers to match a specified regular expression
* [indent](indent.md): enforce consistent indentation (fixable)
* [jsx-quotes](jsx-quotes.md): enforce the consistent use of either double or single quotes in JSX attributes (fixable)
* [key-spacing](key-spacing.md): enforce consistent spacing between keys and values in object literal properties
* [keyword-spacing](keyword-spacing.md): enforce consistent spacing before and after keywords (fixable)
* [linebreak-style](linebreak-style.md): enforce consistent linebreak style (fixable)
* [lines-around-comment](lines-around-comment.md): require empty lines around comments
* [max-depth](max-depth.md): enforce a maximum depth that blocks can be nested
* [max-len](max-len.md): enforce a maximum line length
* [max-nested-callbacks](max-nested-callbacks.md): enforce a maximum depth that callbacks can be nested
* [max-params](max-params.md): enforce a maximum number of parameters in `function` definitions
* [max-statements](max-statements.md): enforce a maximum number of statements allowed in `function` blocks
* [max-statements-per-line](max-statements-per-line.md): enforce a maximum number of statements allowed per line
* [new-cap](new-cap.md): require constructor `function` names to begin with a capital letter
* [new-parens](new-parens.md): require parentheses when invoking a constructor with no arguments
* [newline-after-var](newline-after-var.md): require or disallow an empty line after `var` declarations
* [newline-before-return](newline-before-return.md): require an empty line before `return` statements
* [newline-per-chained-call](newline-per-chained-call.md): require a newline after each call in a method chain
* [no-array-constructor](no-array-constructor.md): disallow `Array` constructors
* [no-bitwise](no-bitwise.md): disallow bitwise operators
* [no-continue](no-continue.md): disallow `continue` statements
* [no-inline-comments](no-inline-comments.md): disallow inline comments after code
* [no-lonely-if](no-lonely-if.md): disallow `if` statements as the only statement in `else` blocks
* [no-mixed-spaces-and-tabs](no-mixed-spaces-and-tabs.md): disallow mixed spaces and tabs for indentation (recommended)
* [no-multiple-empty-lines](no-multiple-empty-lines.md): disallow multiple empty lines
* [no-negated-condition](no-negated-condition.md): disallow negated conditions
* [no-nested-ternary](no-nested-ternary.md): disallow nested ternary expressions
* [no-new-object](no-new-object.md): disallow `Object` constructors
* [no-plusplus](no-plusplus.md): disallow the unary operators `++` and `--`
* [no-restricted-syntax](no-restricted-syntax.md): disallow specified syntax
* [no-spaced-func](no-spaced-func.md): disallow spacing between `function` identifiers and their applications (fixable)
* [no-ternary](no-ternary.md): disallow ternary operators
* [no-trailing-spaces](no-trailing-spaces.md): disallow trailing whitespace at the end of lines (fixable)
* [no-underscore-dangle](no-underscore-dangle.md): disallow dangling underscores in identifiers
* [no-unneeded-ternary](no-unneeded-ternary.md): disallow ternary operators when simpler alternatives exist
* [no-whitespace-before-property](no-whitespace-before-property.md): disallow whitespace before properties (fixable)
* [object-curly-spacing](object-curly-spacing.md): enforce consistent spacing inside braces (fixable)
* [object-property-newline](object-property-newline.md): enforce placing object properties on separate lines
* [one-var](one-var.md): enforce variables to be declared either together or separately in functions
* [one-var-declaration-per-line](one-var-declaration-per-line.md): require or disallow newlines around `var` declarations
* [operator-assignment](operator-assignment.md): require or disallow assignment operator shorthand where possible
* [operator-linebreak](operator-linebreak.md): enforce consistent linebreak style for operators
* [padded-blocks](padded-blocks.md): require or disallow padding within blocks
* [quote-props](quote-props.md): require quotes around object literal property names
* [quotes](quotes.md): enforce the consistent use of either backticks, double, or single quotes (fixable)
* [require-jsdoc](require-jsdoc.md): require JSDoc comments
* [semi](semi.md): require or disallow semicolons instead of ASI (fixable)
* [semi-spacing](semi-spacing.md): enforce consistent spacing before and after semicolons (fixable)
* [sort-vars](sort-vars.md): require variables within the same declaration block to be sorted
* [space-before-blocks](space-before-blocks.md): enforce consistent spacing before blocks (fixable)
* [space-before-function-paren](space-before-function-paren.md): enforce consistent spacing before `function` definition opening parenthesis (fixable)
* [space-in-parens](space-in-parens.md): enforce consistent spacing inside parentheses (fixable)
* [space-infix-ops](space-infix-ops.md): require spacing around operators (fixable)
* [space-unary-ops](space-unary-ops.md): enforce consistent spacing before or after unary operators (fixable)
* [spaced-comment](spaced-comment.md): enforce consistent spacing after the `//` or `/*` in a comment (fixable)
* [wrap-regex](wrap-regex.md): require parenthesis around regex literals

## ECMAScript 6

These rules relate to ES6, also known as ES2015:

* [arrow-body-style](arrow-body-style.md): require braces around arrow function bodies
* [arrow-parens](arrow-parens.md): require parentheses around arrow function arguments
* [arrow-spacing](arrow-spacing.md): enforce consistent spacing before and after the arrow in arrow functions (fixable)
* [constructor-super](constructor-super.md): require `super()` calls in constructors (recommended)
* [generator-star-spacing](generator-star-spacing.md): enforce consistent spacing around `*` operators in generator functions (fixable)
* [no-class-assign](no-class-assign.md): disallow reassigning class members (recommended)
* [no-confusing-arrow](no-confusing-arrow.md): disallow arrow functions where they could be confused with comparisons
* [no-const-assign](no-const-assign.md): disallow reassigning `const` variables (recommended)
* [no-dupe-class-members](no-dupe-class-members.md): disallow duplicate class members (recommended)
* [no-duplicate-imports](no-duplicate-imports.md): disallow duplicate module imports
* [no-new-symbol](no-new-symbol.md): disallow `new` operators with the `Symbol` object (recommended)
* [no-restricted-imports](no-restricted-imports.md): disallow specified modules when loaded by `import`
* [no-this-before-super](no-this-before-super.md): disallow `this`/`super` before calling `super()` in constructors (recommended)
* [no-useless-computed-key](no-useless-computed-key.md): disallow unnecessary computed property keys in object literals
* [no-useless-constructor](no-useless-constructor.md): disallow unnecessary constructors
* [no-var](no-var.md): require `let` or `const` instead of `var`
* [object-shorthand](object-shorthand.md): require or disallow method and property shorthand syntax for object literals
* [prefer-arrow-callback](prefer-arrow-callback.md): require arrow functions as callbacks
* [prefer-const](prefer-const.md): require `const` declarations for variables that are never reassigned after declared
* [prefer-reflect](prefer-reflect.md): require `Reflect` methods where applicable
* [prefer-rest-params](prefer-rest-params.md): require rest parameters instead of `arguments`
* [prefer-spread](prefer-spread.md): require spread operators instead of `.apply()`
* [prefer-template](prefer-template.md): require template literals instead of string concatenation
* [require-yield](require-yield.md): require generator functions to contain `yield`
* [sort-imports](sort-imports.md): enforce sorted import declarations within modules
* [template-curly-spacing](template-curly-spacing.md): require or disallow spacing around embedded expressions of template strings (fixable)
* [yield-star-spacing](yield-star-spacing.md): require or disallow spacing around the `*` in `yield*` expressions (fixable)

## Removed

These rules from older versions of ESLint have been replaced by newer rules:

* [generator-star](generator-star.md): enforce consistent positioning of the `*` in generator functions (replaced by [generator-star-spacing](generator-star-spacing.md))
* [global-strict](global-strict.md): require or disallow `"use strict"` in the global scope (replaced by [strict](strict.md))
* [no-arrow-condition](no-arrow-condition.md): disallow arrow functions where conditions are expected (replaced by [no-confusing-arrow](no-confusing-arrow.md) and [no-constant-condition](no-constant-condition.md))
* [no-comma-dangle](no-comma-dangle.md): disallow trailing commas in object literals (replaced by [comma-dangle](comma-dangle.md))
* [no-empty-class](no-empty-class.md): disallow empty character classes in regular expressions (replaced by [no-empty-character-class](no-empty-character-class.md))
* [no-empty-label](no-empty-label.md): disallow labels for anything other than loops and switches (replaced by [no-labels](no-labels.md))
* [no-extra-strict](no-extra-strict.md): disallow `"use strict";` when already in strict mode (replaced by [strict](strict.md))
* [no-reserved-keys](no-reserved-keys.md): disallow the use of reserved words as object literal keys (replaced by [quote-props](quote-props.md))
* [no-space-before-semi](no-space-before-semi.md): disallow spacing before semicolons (replaced by [semi-spacing](semi-spacing.md))
* [no-wrap-func](no-wrap-func.md): disallow parentheses around non-IIFE statements (replaced by [no-extra-parens](no-extra-parens.md))
* [space-after-function-name](space-after-function-name.md): enforce consistent spacing after `function` names (replaced by [space-before-function-paren](space-before-function-paren.md))
* [space-after-keywords](space-after-keywords.md): enforce consistent spacing after specified keywords (fixable) (replaced by [keyword-spacing](keyword-spacing.md))
* [space-before-function-parentheses](space-before-function-parentheses.md): enforce consistent spacing before `function` parentheses (replaced by [space-before-function-paren](space-before-function-paren.md))
* [space-before-keywords](space-before-keywords.md): enforce consistent spacing before specified keywords (fixable) (replaced by [keyword-spacing](keyword-spacing.md))
* [space-in-brackets](space-in-brackets.md): enforce consistent spacing inside brackets (replaced by [object-curly-spacing](object-curly-spacing.md) and [array-bracket-spacing](array-bracket-spacing.md))
* [space-return-throw-case](space-return-throw-case.md): require spacing after `return`, `throw`, and `case` (fixable) (replaced by [keyword-spacing](keyword-spacing.md))
* [space-unary-word-ops](space-unary-word-ops.md): enforce consistent spacing before and after unary operators (replaced by [space-unary-ops](space-unary-ops.md))
* [spaced-line-comment](spaced-line-comment.md): enforce consistent spacing after the `//` in line comments (replaced by [spaced-comment](spaced-comment.md))
