# require `let` or `const` instead of `var` (no-var)

ECMAScript 6 allows programmers to create variables with block scope instead of function scope using the `let`
and `const` keywords. Block scope is common in many other programming languages and helps programmers avoid mistakes
such as:

```js
var count = people.length;
var enoughFood = count > sandwhiches.length;

if (enoughFood) {
    var count = sandwhiches.length; // accidently overriding the count variable
    console.log("We have " + count + " sandwhiches for everyone. Plenty for all!");
}

// our count variable is no longer accurate
console.log("We have " + count + " people and " + sandwhiches.length + " sandwhiches!");
```

## Rule Details

This rule is aimed at discouraging the use of `var` and encouraging the use of `const` or `let` instead.

The following patterns are considered warnings:

```js
var x = "y";
var CONFIG = {};
```

The following patterns are not considered warnings:

```js
let x = "y";
const CONFIG = {};
```

If you intend to use this rule, you must set `blockBindings` to `true` in the `ecmaFeatures` configuration object,
which will give ESLint the ability to read `let` and `const` variables.

## When Not To Use It

In addition to non-ES6 environments, existing JavaScript projects that are beginning to introduce ES6 into their
codebase may not want to apply this rule if the cost of migrating from `var` to `let` is too costly.
