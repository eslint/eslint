# disallow statement continuation characters at the start of statements (no-unexpected-start)

Starting statements with characters like `[`, `(`, `+`, `/`, `-`, `/`, and `` ` `` can sometimes lead to an unexpected multi-line statement. The `no-unexpected-multiline` resolves this by detecting when an unexpected multi-line statement is parsed, but doesn't prevent developers from using these characters at the start of statements.

This is especially common when writing JavaScript without semicolons, which depends on automatic semicolon insertion.

## Rule Details

This rule aims to disallow statements that start with characters that could potentially start an unexpected multi-line statement if a semicolon is missing.

Examples of **incorrect** code for this rule:

```js
[1, 2, 3].reverse();

`hello`.indexOf("o");

/abc/.source;

(function() { console.log(42) })();
```

Examples of **correct** code for this rule:

```js
const numbers = [1, 2, 3];
numbers.reverse();

const greeting = `hello`;
greeting.indexOf("o");

const regex = /abc/;
regex.source;

const f = function() { console.log(42) };
f();

{
  console.log(42);
}
```

## When Not To Use It

If you want to be able to use short-hand you should disable this rule and use `no-unexpected-multiline`, semicolons, or both.
