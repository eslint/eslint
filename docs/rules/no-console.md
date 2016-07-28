# disallow the use of `console` (no-console)

In JavaScript that is designed to be executed in the browser, it's considered a best practice to avoid using methods on `console`. Such messages are considered to be for debugging purposes and therefore not suitable to ship to the client. In general, calls using `console` should be stripped before being pushed to production.

```js
console.log("Made it here.");
console.error("That shouldn't have happened.");
```

## Rule Details

This rule disallows calls to methods of the `console` object.

Examples of **incorrect** code for this rule:

```js
/*eslint no-console: "error"*/

console.log("Log a debug level message.");
console.warn("Log a warn level message.");
console.error("Log an error level message.");
```

Examples of **correct** code for this rule:

```js
/*eslint no-console: "error"*/

// custom console
Console.log("Hello world!");
```

## Options

This rule has an object option for exceptions:

* `"allow"` has an array of strings which are allowed methods of the `console` object
* `"disallowGlobals"` A list of global objects not to be used in addition to any `console` references.

### allow

Examples of additional **correct** code for this rule with a sample `{ "allow": ["warn", "error"] }` option:

```js
/*eslint no-console: ["error", { allow: ["warn", "error"] }] */

console.warn("Log a warn level message.");
console.error("Log an error level message.");
```

### disallowGlobals

Examples of additional **correct** code for this rule with a sample `{ "allow": ["error"], "disallowGlobals": ["self"] }` option:

```js
/*eslint no-console: ["error", { allow: ["error"], disallowGlobals: ["window"] }] */

console.error("this will not be considered a problem");
self.console.error("this will not be considered a problem");
```

Examples of additional **incorrect** code for this rule with a sample `{ "allow": ["error"], "disallowGlobals": ["self"] }` option:

```js
/*eslint no-console: ["error", { allow: ["error"], disallowGlobals: ["window"] }] */

window.console.error("this will be considered a problem");
console.log("this will be considered a problem");
```

## When Not To Use It

If you're using Node.js, however, `console` is used to output information to the user and so is not strictly used for debugging purposes. If you are developing for Node.js then you most likely do not want this rule enabled.

## Related Rules

* [no-alert](no-alert.md)
* [no-debugger](no-debugger.md)
