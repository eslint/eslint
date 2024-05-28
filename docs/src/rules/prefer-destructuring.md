---
title: prefer-destructuring
rule_type: suggestion
further_reading:
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
- https://2ality.com/2015/01/es6-destructuring.html
---


<!-- markdownlint-disable-next-line MD051 -->
With JavaScript ES6, a new syntax was added for creating variables from an array index or object property, called [destructuring](#further-reading).  This rule enforces usage of destructuring instead of accessing a property through a member expression.

## Rule Details

### Options

This rule takes two arguments, both of which are objects. The first object parameter determines what types of destructuring the rule applies to.

In the first object, there are two properties, `array` and `object`, that can be used to turn on or off the destructuring requirement for each of those types independently. By default, both are true.

```json
{
  "rules": {
    "prefer-destructuring": ["error", {
      "array": true,
      "object": true
    }]
  }
}
```

For example, the following configuration enforces only object destructuring, but not array destructuring:

```json
{
  "rules": {
    "prefer-destructuring": ["error", {"object": true, "array": false}]
  }
}
```

Examples of **incorrect** code for this rule:

::: incorrect

```javascript
/* eslint prefer-destructuring: "error" */

// With `array` enabled
var foo = array[0];
bar.baz = array[0];

// With `object` enabled
var foo = object.foo;
var foo = object['foo'];
```

:::

Examples of **correct** code for this rule:

::: correct

```javascript
/* eslint prefer-destructuring: "error" */

// With `array` enabled
var [ foo ] = array;
var foo = array[someIndex];
[bar.baz] = array;


// With `object` enabled
var { foo } = object;

var foo = object.bar;

let bar;
({ bar } = object);
```

:::

Alternatively, you can use separate configurations for different assignment types. The first argument accepts two other keys instead of `array` and `object`.

One key is `VariableDeclarator` and the other is `AssignmentExpression`, which can be used to control the destructuring requirement for each of those types independently. Each property is an object containing two properties, `array` and `object`, which can be used to control the destructuring requirement for each of `array` and `object` independently for variable declarations and assignment expressions.  By default, `array` and `object` are set to `true` for both `VariableDeclarator` and `AssignmentExpression`.

```json
{
  "rules": {
    "prefer-destructuring": ["error", {
      "VariableDeclarator": {
        "array": true,
        "object": true
      },
      "AssignmentExpression": {
        "array": true,
        "object": true
      }
    }]
  }
}
```

Examples of **correct** code when object destructuring in `VariableDeclarator` is enforced:

::: correct

```javascript
/* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */
var {bar: foo} = object;
```

:::

Examples of **correct** code when array destructuring in `AssignmentExpression` is enforced:

::: correct

```javascript
/* eslint prefer-destructuring: ["error", {AssignmentExpression: {array: true}}] */
[bar] = array;
```

:::

#### enforceForRenamedProperties

The rule has a second object argument with a single key, `enforceForRenamedProperties`, which determines whether the `object` destructuring applies to renamed variables.

```json
{
  "rules": {
    "prefer-destructuring": ["error",
    {
      "object": true
    },
    {
      "enforceForRenamedProperties": true
    }]
  }
}
```

Examples of **incorrect** code when `enforceForRenamedProperties` is enabled:

::: incorrect

```javascript
/* eslint "prefer-destructuring": ["error", { "object": true }, { "enforceForRenamedProperties": true }] */
var foo = object.bar;
```

:::

Examples of **correct** code when `enforceForRenamedProperties` is enabled:

::: correct

```javascript
/* eslint "prefer-destructuring": ["error", { "object": true }, { "enforceForRenamedProperties": true }] */
var { bar: foo } = object;
```

:::

Examples of additional **correct** code when `enforceForRenamedProperties` is enabled:

::: correct

```javascript
/* eslint "prefer-destructuring": ["error", { "object": true }, { "enforceForRenamedProperties": true }] */
class C {
    #x;
    foo() {
        const bar = this.#x; // private identifiers are not allowed in destructuring
    }
}
```

:::

**Note**: It is not possible to determine if a variable will be referring to an object or an array at runtime. This rule therefore guesses the assignment type by checking whether the key being accessed is an integer. This can lead to the following possibly confusing situations:

* Accessing an object property whose key is an integer will fall under the category `array` destructuring.
* Accessing an array element through a computed index will fall under the category `object` destructuring.

The `--fix` option on the command line fixes only problems reported in variable declarations, and among them only those that fall under the category `object` destructuring. Furthermore, the name of the declared variable has to be the same as the name used for non-computed member access in the initializer. For example, `var foo = object.foo` can be automatically fixed by this rule. Problems that involve computed member access (e.g., `var foo = object[foo]`) or renamed properties (e.g., `var foo = object.bar`) are not automatically fixed.

## When Not To Use It

If you want to be able to access array indices or object properties directly, you can either configure the rule to your tastes or disable the rule entirely.

Additionally, if you intend to access large array indices directly, like:

```javascript
var foo = array[100];
```

Then the `array` part of this rule is not recommended, as destructuring does not match this use case very well.

Or for non-iterable 'array-like' objects:

```javascript
var $ = require('jquery');
var foo = $('body')[0];
var [bar] = $('body'); // fails with a TypeError
```
