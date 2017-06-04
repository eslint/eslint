# avoid misnamed constructor method (no-java-constructor)

If you have ever written Java code, you might start out by writing ES6 classes
like the following:

```js
class Point {
  Point(x, y) {
    this.x = x;
    this.y = y;
  }
}
```

If so, you would be in for a surprise when you ran:

```js
const p = new Point(3, 4);
console.log(`(${p.x}, ${p.y})`);
```

Most likely, instead of declaring a method named `Point`, you probably meant to
define a constructor:

```js
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
```

`no-java-constructor` flags this issue. It does not provide an autofix because
that would change the behavior of the original code.
