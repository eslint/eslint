---
title: ESLint
layout: default
---
# Rules

Rules in ESLint are divided into several categories to help you better understand their value. Additionally, not all rules are enabled by default. Those that are not enabled by default are marked as being off.

## Possible Errors

The following rules point out areas where you might have made mistakes.

* [no-console](no-console.html) - disallow use of `console`
* [no-debugger](No-debugger.html) - disallow use of `debugger`
* [no-empty](No-empty.html) - disallow empty statements
* [no-unreachable](No-unreachable.html) - disallow unreachable statements after a return, throw, continue, or break statement
* [use-isnan](use-isnan.html) - disallow comparisons with the value `NaN`

## Best Practices

These are rules designed to prevent you from making mistakes. They either prescribe a better way of doing something or help you avoid footguns.

* [no-caller] - disallow use of `arguments.caller` or `arguments.callee` are used
* [curly] - require curly brace for all control statements
* [eqeqeq] - require the use of `===` and `!==`
* [no-eval] - disallow use of `eval()`
* [no-with] - disallow use of the `with` statement
* [no-undef-init] - disallow use of undefined when initializing variables
* [no-floating-decimal] - disallow the use of leading or trailing decimal points in numeric literals
* [no-octal] - disallow use of octal literals
* [no-new] - disallow use of new operator when not part of the assignment or comparison

## Stylistic Issues

These rules are purely matters of style and are quite subjective.

* [camelcase] - require camel case names
* [new-cap](new-cap.html) - require a capital letter for constructors
* [quote-props](Quote-props.html) - require quotes around object literal property names
* [semi] - require use of semicolons instead of relying on ASI

## Alternate Rules

* [smarter-eqeqeq](smarter-eqeqeq.html) - require the use of `===` and `!==` when it makes sense to use them

## Legacy

The following rules are included for compatibility with [JSHint](http://jshint.com) and [JSLint](http://jslint.com). While the names of the rules may not match up with the JSHint/JSLint counterpart, the functionality is the same.

* [no-bitwise] - disallow use of bitwise operators (off by default)
* [guard-for-in] - make sure `for-in` loops have an `if` statement (off by default)
