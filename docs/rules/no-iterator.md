# no iterator

The `__iterator__` property can used to create custom iterators that are compatible with JavaScript's `for in` and `for each` constructs. However, this property is not supported in many browsers, so it should be used with caution.

```js
Foo.prototype.__iterator__ = function() {
    return new FooIterator(this);
}
```

## Rule Details

This rule is aimed at preventing errors that may arise from using the `__iterator__` property, which is not implemented in several browsers. As such, it will warn whenever it encounters the `__iterator__` property.

The following patterns are considered warnings:

```js
Foo.prototype.__iterator__ = function() {
    return new FooIterator(this);
};

foo.__iterator__ = function () {};

foo["__iterator__"] = function () {};

```

The following patterns are not considered warnings:

```js
var __iterator__ = foo; // Not using the `__iterator__` property.
```

## Further Reading

* [MDN - Iterators and Generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators)
* [ECMAScript 6 compatibility table - Iterators](http://kangax.github.io/es5-compat-table/es6/#Iterators)
