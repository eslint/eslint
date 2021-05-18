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

Examples of additional **correct** code for this rule with a sample `{ "allow": ["warn", "error"] }` option:

```js
/*eslint no-console: ["error", { allow: ["warn", "error"] }] */

console.warn("Log a warn level message.");
console.error("Log an error level message.");
```

## When Not To Use It

If you're using Node.js, however, `console` is used to output information to the user and so is not strictly used for debugging purposes. If you are developing for Node.js then you most likely do not want this rule enabled.

Another case where you might not use this rule is if you want to enforce console calls and not console overwrites. For example:

```js
/*eslint no-console: ["error", { allow: ["warn"] }] */
console.error = function (message) {
  throw new Error(message);
};
```

With the `no-console` rule in the above example, ESLint will report an error. For the above example, you can disable the rule:

```js
// eslint-disable-next-line no-console
console.error = function (message) {
  throw new Error(message);
};

// or

console.error = function (message) {  // eslint-disable-line no-console
  throw new Error(message);
};
```

However, you might not want to manually add `eslint-disable-next-line` or `eslint-disable-line`. You can achieve the effect of only receiving errors for console calls with the `no-restricted-syntax` rule:

```json
{
    "rules": {
        "no-console": "off",
        "no-restricted-syntax": [
            "error",
            {
                "selector": "CallExpression[callee.object.name='console'][callee.property.name!=/^(log|warn|error|info|trace)$/]",
                "message": "Unexpected property on console object was called"
            }
        ]
    }
}
```

## Related Rules

* [no-alert](no-alert.md)
* [no-debugger](no-debugger.md)
