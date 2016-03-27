# Disallow Primitive Wrapper Instances (no-new-wrappers)

There are three primitive types in JavaScript that have wrapper objects: string, number, and boolean. These are represented by the constructors `String`, `Number`, and `Boolean`, respectively. The primitive wrapper types are used whenever one of these primitive values is read, providing them with object-like capabilities such as methods. Behind the scenes, an object of the associated wrapper type is created and then destroyed, which is why you can call methods on primitive values, such as:

```js
var text = "Hello world".substring(2);
```

Behind the scenes in this example, a `String` object is constructed. The `substring()` method exists on `String.prototype` and so is accessible to the string instance.

It's also possible to manually create a new wrapper instance:

```js
var stringObject = new String("Hello world");
var numberObject = new Number(33);
var booleanObject = new Boolean(false);
```

Although possible, there aren't any good reasons to use these primitive wrappers as constructors. They tend to confuse other developers more than anything else because they seem like they should act as primitives, but they do not. For example:

```js
var stringObject = new String("Hello world");
console.log(typeof stringObject);       // "object"

var text = "Hello world";
console.log(typeof text);               // "string"

var booleanObject = new Boolean(false);
if (booleanObject) {    // all objects are truthy!
    console.log("This executes");
}
```

The first problem is that primitive wrapper objects are, in fact, objects. That means `typeof` will return `"object"` instead of `"string"`, `"number"`, or `"boolean"`. The second problem comes with boolean objects. Every object is truthy, that means an instance of `Boolean` always resolves to `true` even when its actual value is `false`.

For these reasons, it's considered a best practice to avoid using primitive wrapper types with `new`.

## Rule Details

This rule aims to eliminate the use of `String`, `Number`, and `Boolean` with the `new` operator. As such, it warns whenever it sees `new String`, `new Number`, or `new Boolean`.

Examples of **incorrect** code for this rule:

```js
/*eslint no-new-wrappers: "error"*/

var stringObject = new String("Hello world");
var numberObject = new Number(33);
var booleanObject = new Boolean(false);

var stringObject = new String;
var numberObject = new Number;
var booleanObject = new Boolean;
```

Examples of **correct** code for this rule:

```js
/*eslint no-new-wrappers: "error"*/

var text = String(someValue);
var num = Number(someValue);

var object = new MyString();
```

## When Not To Use It

If you want to allow the use of primitive wrapper objects, then you can safely disable this rule.

## Further Reading

* [Wrapper objects](https://www.inkling.com/read/javascript-definitive-guide-david-flanagan-6th/chapter-3/wrapper-objects)

## Related Rules

* [no-array-constructor](no-array-constructor.md)
* [no-new-object](no-new-object.md)
