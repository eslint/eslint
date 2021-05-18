# disallow `Object` constructors (no-new-object)

The `Object` constructor is used to create new generic objects in JavaScript, such as:

```js
var myObject = new Object();
```

However, this is no different from using the more concise object literal syntax:

```js
var myObject = {};
```

For this reason, many prefer to always use the object literal syntax and never use the `Object` constructor.

While there are no performance differences between the two approaches, the byte savings and conciseness of the object literal form is what has made it the de facto way of creating new objects.

## Rule Details

This rule disallows `Object` constructors.

Examples of **incorrect** code for this rule:

```js
/*eslint no-new-object: "error"*/

var myObject = new Object();

var myObject = new Object;
```

Examples of **correct** code for this rule:

```js
/*eslint no-new-object: "error"*/

var myObject = new CustomObject();

var myObject = {};
```

## When Not To Use It

If you wish to allow the use of the `Object` constructor, you can safely turn this rule off.

## Related Rules

* [no-array-constructor](no-array-constructor.md)
* [no-new-wrappers](no-new-wrappers.md)
