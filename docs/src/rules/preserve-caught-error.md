---
title: preserve-caught-error
rule_type: suggestion
further_reading:
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause
- https://nodejs.org/api/errors.html#errorcause
- https://github.com/tc39/proposal-error-cause/blob/main/README.md
- https://dev.to/amnish04/never-lose-valuable-error-context-in-javascript-3aco
- https://github.com/microsoft/TypeScript/blob/main/src/lib/es2022.error.d.ts
---

JavaScript developers often re-throw errors in `catch` blocks to add context but forget to preserve the original error, resulting in lost debugging information.

Using the `cause` option when throwing new errors helps retain the original error and maintain complete error chains, which improves debuggability and traceability.

```js
try {
	await fetch("https://xyz.com/resource");
} catch(error) {
	// Throw a more specific error without losing original context
	throw new Error("Failed to fetch resource", {
		cause: error
	});
}
```

## Rule Details

This rule enforces the use of the `cause` property when throwing a new error inside a `catch` block.

Checks for all built-in `error types` that support passing a `cause`.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/* eslint preserve-caught-error: "error" */

// Not using the `cause` option
try {
    // ...
} catch (error) {
    throw new Error("Something went wrong: " + error.message);
}

// Throwing a new Error with unrelated cause
try {
	doSomething();
} catch (err) {
	const unrelated = new Error("other");
	throw new Error("Something failed", { cause: unrelated });
}

// Caught error is being lost partially due to destructuring
try {
	doSomething();
} catch ({ message, ...rest }) {
	throw new Error(message);
}

// Cause error is being shadowed by a closer scoped redeclaration.
try {
    doSomething();
} catch (error) {
    if (whatever) {
        const error = anotherError; // This declaration is the problem.
        throw new Error("Something went wrong", { cause: error });
    }
}
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/* eslint preserve-caught-error: "error" */

try {
    // ...
} catch (error) {
    throw new Error("Something went wrong", { cause: error });
}

// When the thrown error is not directly related to the caught error.
try {
} catch (error) {
	foo = {
		bar() {
			// This throw is not directly related to the caught error.
			throw new Error("Something went wrong");
		}
	};
}

// No throw inside catch
try {
    doSomething();
} catch (e) {
    console.error(e);
}

// Ignoring the caught error at the parameter level
// This is valid by default, but this behavior can be changed
// by using the `requireCatchParameter` option discussed below.
try {
	doSomething();
} catch {
	throw new TypeError("Something went wrong");
}
```

:::

## Options

This rule takes a single option — an object with the following optional property:

- `requireCatchParameter`: Requires the catch blocks to always have the caught error parameter when set to `true`. By default, this is `false`.

### requireCatchParameter

Enabling this option mandates for all the catch blocks to have a caught error parameter. This makes sure that the caught error is not discarded at the parameter level.

```js
"preserve-caught-error": ["error", {
  "requireCatchParameter": true
}]
```

Example of **incorrect** code for the `{ "requireCatchParameter": true }` option:

::: incorrect

```js
/* eslint preserve-caught-error: ["error", { "requireCatchParameter": true }] */

try {
	doSomething();
} catch { // Can't discard the error ❌
	throw new Error("Something went wrong");
}
```

:::

Example of **correct** code for the `{ "requireCatchParameter": true }` option:

::: correct

```js
/* eslint preserve-caught-error: ["error", { "requireCatchParameter": true }] */

try {
	doSomething();
} catch(error) { // Error is being referenced ✅
	// Handling and re-throw logic
}
```

:::

## When Not To Use It

You might not want to enable this rule if:

- You follow a custom error-handling approach where the original error is intentionally omitted from re-thrown errors (e.g., to avoid exposing internal details or to log the original error separately).

- You use a third-party or internal error-handling library that preserves error context using non-standard properties (e.g., [verror](https://www.npmjs.com/package/verror)) instead of the cause option.

- (In rare cases) you are targeting legacy environments where the cause option in `Error` constructors is not supported.
