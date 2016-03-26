# Disallow Use of console (no-console)

In JavaScript that is designed to be executed in the browser, it's considered a best practice to avoid using methods on `console`. Such messages are considered to be for debugging purposes and therefore not suitable to ship to the client. In general, calls using `console` should be stripped before being pushed to production.

```js
console.log("Made it here.");
console.error("That shouldn't have happened.");
```


## Rule Details

This rule is aimed at eliminating unwanted `console` references from your JavaScript. As such, it warns whenever it sees `console` used as an identifier in code.

Examples of **incorrect** code for this rule:

```js
/*eslint no-console: "error"*/

console.log("Hello world!");
console.error("Something bad happened.");
```

Examples of **correct** code for this rule:

```js
/*eslint no-console: "error"*/

// custom console
Console.log("Hello world!");
```

## Options

This rule supports the following options:

`allow`: The list of console operations to be used as exceptions to the rule. For example:

```js
/*eslint no-console: ["error", { allow: ["warn", "error"] }] */

console.log("this will be considered a problem");
console.warn("this will not be considered a problem");
console.error("this will not be considered a problem");
```

## When Not To Use It

If you're using Node.js, however, `console` is used to output information to the user and so is not strictly used for debugging purposes. If you are developing for Node.js then you most likely do not want this rule enabled.

## Related Rules

* [no-alert](no-alert.md)
* [no-debugger](no-debugger.md)
