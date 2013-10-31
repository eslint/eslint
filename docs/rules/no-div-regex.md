# no div regex

Require regex literals to escape division operators.

```js
function() { return /=foo/; }
```

## Rule Details

This is used to disambiguate the division operator to not confuse users.

The following patterns are considered warnings:

```js
function() { return /=foo/; }
```

The following patterns adhere to this rule:

```js
function() { return /\=foo/; }
```
