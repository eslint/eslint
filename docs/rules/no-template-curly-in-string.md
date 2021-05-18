# Disallow template literal placeholder syntax in regular strings (no-template-curly-in-string)

ECMAScript 6 allows programmers to create strings containing variable or expressions using template literals, instead of string concatenation, by writing expressions like `${variable}` between two backtick quotes (\`). It can be easy to use the wrong quotes when wanting to use template literals, by writing `"${variable}"`, and end up with the literal value `"${variable}"` instead of a string containing the value of the injected expressions.


## Rule Details

This rule aims to warn when a regular string contains what looks like a template literal placeholder. It will warn when it finds a string containing the template literal place holder (`${something}`) that uses either `"` or `'` for the quotes.

## Examples

Examples of **incorrect** code for this rule:

```js
/*eslint no-template-curly-in-string: "error"*/
"Hello ${name}!";
'Hello ${name}!';
"Time: ${12 * 60 * 60 * 1000}";
```

Examples of **correct** code for this rule:

```js
/*eslint no-template-curly-in-string: "error"*/
`Hello ${name}!`;
`Time: ${12 * 60 * 60 * 1000}`;

templateFunction`Hello ${name}`;
```

## When Not To Use It

This rule should not be used in ES3/5 environments.
