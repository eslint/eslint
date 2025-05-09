---
title: prefer-optional-chaining
rule_type: suggestion
---

The optional chaining operator (`?.`) allows developers to safely access properties of objects that might be `null` or `undefined` without causing errors. This rule enforces using optional chaining instead of logical operators like `&&` or ternary expressions when performing null checks before accessing properties.

## Rule Details

This rule aims to encourage the use of the optional chaining operator (`?.`) instead of logical AND (`&&`), conditional expressions (`? :`) or if statements for property access, method calls, and function calls when the object might be `null` or `undefined`.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint prefer-optional-chaining: "error"*/

// Using logical AND for null checks
obj && obj.prop;
obj && obj[key];
obj && obj();

// Using conditional expressions for null checks
obj != null ? obj.prop : undefined;
obj !== null ? obj.prop : undefined;
obj !== undefined ? obj.prop : undefined;

// Using if statements for null checks
if (obj) obj.prop;
if (obj) { obj.prop; }
if (obj) obj();
if (obj) { obj(); }
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint prefer-optional-chaining: "error"*/

// Already using optional chaining
obj?.prop;
obj?.[key];
obj?.();

// Non-matching patterns
a && b;
obj.prop && obj.other.prop;
a && a.b.c;
obj && prop;
obj && obj.prop.subprop;
obj || obj.prop;
obj ? obj.prop : null;
obj !== undefined ? obj : obj.prop;
obj != null ? value : obj.prop;
```

:::

## When Not To Use It

If you're working in an environment that doesn't support optional chaining (e.g., older browsers without polyfills or older Node.js versions before 14.0.0), you should not use this rule.

Additionally, there might be cases where using logical operators instead of optional chaining is more appropriate, particularly for boolean operations or when you need to ensure more complex conditional logic around property access.

## Resources

* [MDN documentation on Optional Chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
* [The original feature request issue on GitHub](https://github.com/eslint/eslint/issues/13430)
