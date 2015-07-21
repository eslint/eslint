# Restrict what can be thrown as an exception (no-throw-literal)

It is considered good practice to only `throw` the `Error`object itself or an object using the `Error` object as base objects for user-defined exceptions.
The fundamental benefit of `Error` objects is that they automatically keep track of where they were built and originated.
This rule restrict what can be thrown as an exception by preventing to throw literals.

## Rule Details

This rule is aimed at maintaining consistency when throwing exception by disallowing to throw literals.

The following patterns are considered warnings:

```js
throw "error";

throw 0;

throw undefined;

throw null;

throw 'an ' + 'error';
```

The following patterns are not considered warnings:

```js
throw new Error();

throw new Error("error");

var e = new Error("error");
throw e;

try {
    throw new Error("error");
} catch (e) {
    throw e;
}
```
