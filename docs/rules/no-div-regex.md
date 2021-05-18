# Disallow Regular Expressions That Look Like Division (no-div-regex)

Require regex literals to escape division operators.

```js
function bar() { return /=foo/; }
```

## Rule Details

This is used to disambiguate the division operator to not confuse users.

Examples of **incorrect** code for this rule:

```js
/*eslint no-div-regex: "error"*/

function bar() { return /=foo/; }
```

Examples of **correct** code for this rule:

```js
/*eslint no-div-regex: "error"*/

function bar() { return /\=foo/; }
```

## Related Rules

* [no-control-regex](no-control-regex.md)
* [no-regex-spaces](no-regex-spaces.md)
