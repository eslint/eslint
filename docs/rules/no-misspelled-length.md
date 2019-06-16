# Prevents misspelling the 'length' property. (no-misspelled-length)

A misspelled length property does not result in an error, but instead is valid (but buggy) Javascript code that tries to access an undefined property on an object.

## Rule Details

This rule checks that if all sorted letters in the property accessor are found in 'length' as well, the property is probably misspelled.

Examples of **incorrect** code for this rule:

```js
var wordLength = "Word".lenght;

if ("Foo".lnegth > 0) {
    return true;
}
```

Examples of **correct** code for this rule:

```js
var wordLength = "Word".length;

if ("Foo".length > 0) {
    return true;
}
```
