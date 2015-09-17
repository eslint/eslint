# Disallow Regexs That Look Like Division (no-div-regex)

Require regex literals to escape division operators.

```js
function bar() { return /=foo/; }
```

## Rule Details

This is used to disambiguate the division operator to not confuse users.

The following patterns are considered problems:

```js
/*eslint no-div-regex: 2*/

function bar() { return /=foo/; } /*error A regular expression literal can be confused with '/='.*/
```

The following patterns are not considered problems:

```js
/*eslint no-div-regex: 2*/

function bar() { return /\=foo/; }
```

## Related Rules

* [no-control-regex](no-control-regex.md)
* [no-regex-spaces](no-regex-spaces.md)
