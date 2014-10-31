# Require or Disallow Dangling Commas (comma-dangle)

Trailing commas in object literals are valid according to the ECMAScript 5 (and ECMAScript 3!) spec, however IE8 (when not in IE8 document mode) and below will throw an error when it encounters trailing commas in JavaScript.

```js
var foo = {
    bar: "baz",
    qux: "quux",
};
```

Nevertheless some coding conventions require last element in array or last property in object declaration to have trailing comma.

## Rule Details

This rule is aimed at detecting trailing commas in object literals. By default it prohibits dangling commas (the same happens when you pass `"never"` as the only argument).

The following are considered warnings by default:

```js
var foo = {
    bar: "baz",
    qux: "quux",
};

var arr = [1,2,];

foo({
  bar: "baz",
  qux: "quux",
});
```

The following are okay and will not raise warnings:

```js
var foo = {
    bar: "baz",
    qux: "quux"
};

var arr = [1,2];

foo({
  bar: "baz",
  qux: "quux"
});
```

If you specify `"always"` as the only argument, the following will be considered warnings:
```js
var foo = {
    bar: "baz",
    qux: "quux"
};

var arr = [1,2];

foo({
  bar: "baz",
  qux: "quux"
});```

And the following are okay and will not raise warnings:

```js
var foo = {
    bar: "baz",
    qux: "quux",
};

var arr = [1,2,];

foo({
  bar: "baz",
  qux: "quux",
});
```

## Further Reading

* [ES5 Array Initialiser](http://es5.github.io/#x11.1.4)
* [ES5 Object Initialiser](http://es5.github.io/#x11.1.5)
