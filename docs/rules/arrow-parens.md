# Require parens in arrow function arguments (arrow-parens)

Arrow function can omit parens if they are passed only one arguments,
but you need to add parens if the argument count is different.
This rule requires parens in arrow function arguments regardless of arity, for consistency.

```js
// Bad
a => {}

// Good
(a) => {}
```


It will also help to find arrow functions (`=>`) which may be mistakenly included in a condition when a comparison such as `>=` was the intent.


```js
// Bad
if (a => 2) {
}

// Good
if (a >= 2) {
}
```


## Rule Details

The following patterns are considered warnings:

```js
a => {}
a => a
a => {\n}
a.then(foo => {});
a.then(foo => a);
a(foo => { if (true) {}; });
```

The following patterns are not warnings:

```js
() => {}
(a) => {}
(a) => a
(a) => {\n}
a.then((foo) => {});
a.then((foo) => { if (true) {}; });
```

this saves you from behavior like the following:

```js
var a = 1;
var b = 2;
// ...
if (a => b) {
 console.log('bigger');
} else {
 console.log('smaller');
};
// outputs 'bigger', not smaller as expected
```

The contents of the `if` statement is an arrow function, not a comparison.
If the arrow function is intentional, it should be wrapped in parens to remove ambiguity.

```js
var a = 1;
var b = 0;
// ...
if ((a) => b) {
 console.log('truthy value returned');
} else {
 console.log('falsey value returned');
};
// outputs 'falsey value returned'
```

The following is another example of this behavior:

```js
var a = 1, b = 2, c = 3, d = 4;
var f = a => b ? c: d;
// f = ?
```

`f` is an arrow function which takes `a` as an argument and returns the result of `b ? c: d`.

This should be rewritten like so:

```js
var a = 1, b = 2, c = 3, d = 4;
var f = (a) => b ? c: d;
```
