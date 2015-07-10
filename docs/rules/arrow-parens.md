# Require parens in arrow function arguments (arrow-parens)

Arrow function can omit parens if there passed only one arguments.
But you need to add parens if arguments decreased to 0 or increase.
This rule requires parens in arrow function arguments for normalize coding style.

```js
// Bad
a => {}

// Good
(a) => {}
```


And also it will help to find if arrow function(`=>`) are wrote in condition context instead of comparison (`>=`) by mistake.


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

this saves you from bizarre behavior like below

```js
var a = 1;
if (a => 2) {
 console.log('bigger');
} else {
 console.log('smaller')
};
```

this is better, because condition of if is arrow function, not comparison.
this should be like this, and you can notice it's not what you expect.

```js
var a = 1;
if ((a) => 2) {
 console.log('bigger');
} else {
 console.log('smaller')
};
```

same thing happens here.

```js
var a = 1, b = 2, c = 3, d = 4;
var f = a => b ? c: d;
// f = ?
```

`f` is arrow function which gets a as arguments and returns the result of `b ? c: d`.

this should be like this again.

```js
var a = 1, b = 2, c = 3, d = 4;
var f = (a) => b ? c: d;
```

you may notice what this is.
