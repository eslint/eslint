# Avoid use of `class` (no-class)

ECMAScript 6 allows programmers to create `class` to "help" those coming from a OOP language, such as Java or C++, to create constructors, thus multiple instances of an object.
In the JS community this is considered one of the bad parts.


## Rule Details

This rule aims to discourage the use of `class` and to encourage other approaches such as functional inheritance,
prototypal inheritance or object composition.

The following patterns are considered warnings:

```js
class Foo {
  constructor() {
    this.foo = 'bar';
  }
}
```

## When Not To Use It

Existing ES6 JavaScript projects that are heavily using classical inheritance may not want to apply this rule if the cost of removing `class` is too costly.

## Further Reading

- https://www.youtube.com/watch?v=PSGEjv3Tqo0
- https://medium.com/javascript-scene/the-two-pillars-of-javascript-ee6f3281e7f3
- https://medium.com/@_ericelliott/how-to-fix-the-es6-class-keyword-2d42bb3f4caf
