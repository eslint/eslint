# Restrict if the catch and finally handler in a try statement can be left empty (no-empty-catch)

It is considered good practice not to have empty `catch` or `finally` handler in a try statement.
This rule raises an errow when a `catch` or `finally` handler is empty.
The boolean option allows to specify if a block with just comments is considered empty or not.
If the option is true a block with only comments is not seen as empty or else he is.

## Rule Details

The following patterns are considered warnings:

```js
/*eslint no-empty-catch: [2, true]*/
try {
	throw new Error();
} catch (e) {
}

try {
	throw new Error();
} finally {
}

/*eslint no-empty-catch: [2, false]*/
try {
	throw new Error();
} catch (e) {
	// empty
}
```

The following patterns are not considered warnings:

```js
/*eslint no-empty-catch: [2, true]*/
try {
	throw new Error();
} catch (e) {
	throw e;
}

try {
	throw new Error();
} finally {
	throw e;
}

try {
	throw new Error();
} finally {
	// empty
}
```
