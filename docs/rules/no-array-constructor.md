# disallow `Array` constructors (no-array-constructor)

Use of the `Array` constructor to construct a new array is generally
discouraged in favor of array literal notation because of the single-argument
pitfall and because the `Array` global may be redefined. The exception is when
the Array constructor is used to intentionally create sparse arrays of a
specified size by giving the constructor a single numeric argument.

## Rule Details

This rule disallows `Array` constructors.

Examples of **incorrect** code for this rule:

```js
/*eslint no-array-constructor: "error"*/

Array(0, 1, 2)

new Array(0, 1, 2)
```

Examples of **correct** code for this rule:

```js
/*eslint no-array-constructor: "error"*/

Array(500)

new Array(someOtherArray.length)

[0, 1, 2]
```

## When Not To Use It

This rule enforces a nearly universal stylistic concern. That being said, this
rule may be disabled if the constructor style is preferred.

## Related Rules

* [no-new-object](no-new-object.md)
* [no-new-wrappers](no-new-wrappers.md)
