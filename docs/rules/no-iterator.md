# Disallow Iterator (no-iterator)

The `__iterator__` property was a SpiderMonkey extension to JavaScript that could be used to create custom iterators that are compatible with JavaScript's `for in` and `for each` constructs. However, this property is now obsolete, so it should not be used. Here's an example of how this used to work:

```js
Foo.prototype.__iterator__ = function() {
    return new FooIterator(this);
}
```

You should use ECMAScript 6 iterators and generators instead.

## Rule Details

This rule is aimed at preventing errors that may arise from using the `__iterator__` property, which is not implemented in several browsers. As such, it will warn whenever it encounters the `__iterator__` property.

The following patterns are considered problems:

```js
/*eslint no-iterator: 2*/

Foo.prototype.__iterator__ = function() { /*error Reserved name '__iterator__'.*/
    return new FooIterator(this);
};

foo.__iterator__ = function () {};        /*error Reserved name '__iterator__'.*/

foo["__iterator__"] = function () {};     /*error Reserved name '__iterator__'.*/

```

The following patterns are not considered problems:

```js
/*eslint no-iterator: 2*/

var __iterator__ = foo; // Not using the `__iterator__` property.
```

## Further Reading

* [MDN - Iterators and Generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators)
* [ECMAScript 6 compatibility table - Iterators](http://kangax.github.io/es5-compat-table/es6/#Iterators)
* [Deprecated and Obsolete Features](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Deprecated_and_obsolete_features#Object_methods)
