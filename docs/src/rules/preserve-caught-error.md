---
title: preserve-caught-error
rule_type: suggestion
further_reading:
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause
- https://nodejs.org/api/errors.html#errorcause
- https://dev.to/amnish04/never-lose-valuable-error-context-in-javascript-3aco
---

JavaScript developers often re-throw errors in `catch` blocks to add context but forget to preserve the original error, resulting in lost debugging information.

Using the `cause` option when throwing new errors helps retain the **original error** and maintain complete **error chains**, which improves debuggability and traceability.

## Rule Details

This rule enforces the use of the [`cause`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause) property when throwing a new error inside a `catch` block.

Examples of **incorrect** code for this rule:

```js
// Not using the `cause` option
try {
    // ...
} catch (error) {
    throw new Error("Something went wrong: " + error.message);
}

// Ignoring the caught error at the parameter level
try {
	doSomething();
} catch {
	throw new Error("Something went wrong");
}
```

Examples of **correct** code for this rule:

```js
try {
    // ...
} catch (error) {
    throw new Error("Something went wrong", { cause: error });
}
```

## Options
This rule takes a single option — an object with the following optional property:

- `customErrorTypes`: An array of user-defined error type names (strings) that the rule should recognize as valid error constructors. These are useful when your project uses custom error classes, that support the cause option.

```js
"preserve-caught-error": ["warn", {
  "customErrorTypes": ["ApiError", "MyCustomError"]
}]
```

If omitted, the rule only checks for built-in error types that support the `cause` option, such as `Error`, `TypeError`, `RangeError`, etc.

For an exhaustive list, see [typescript error interfaces](https://github.com/microsoft/TypeScript/blob/main/src/lib/es2022.error.d.ts)

Examples of **correct** code for the `{ "customErrorTypes": ["ApiError"] }` option:

```js
try {
	doSomething();
} catch(error) {
	if (someCondition) {
		throw new ApiError("Something went wrong", {
			cause: error
		});
	}

	// This won't be flagged as `CustomError` was not configured in `customErrorTypes` option
	throw new CustomError("Operation failed");
}
```

## When Not To Use It

You might not want to enable this rule if:

- You follow a custom error-handling approach where the original error is intentionally omitted from re-thrown errors (e.g., to avoid exposing internal details or to log the original error separately).

- You use a third-party or internal error-handling library that preserves error context using non-standard properties (e.g., [verror](https://www.npmjs.com/package/verror)) instead of the cause option.

- (In rare cases) you are targeting legacy environments where the cause option in `Error` constructors is not supported.
