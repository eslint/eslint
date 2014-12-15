# Require or disallow Yoda Conditions (yoda)

Yoda conditions are so named because the literal value of the condition comes first while the variable comes second. For example, the following is a Yoda condition:

```js
if ("red" === color) {
    // ...
}
```

This is called a Yoda condition because it reads as, "red is the color", similar to the way the Star Wars character Yoda speaks. Compare to the other way of arranging the operands:

```js
if (color === "red") {
    // ...
}
```

This typically reads, "color is red", which is arguably a more natural way to describe the comparison.

Proponents of Yoda conditions highlight that it is impossible to mistakenly use `=` instead of `==` because you cannot assign to a literal value. Doing so will cause a syntax error and you will be informed of the mistake early on. This practice was therefore very common in early programming where tools were not yet available.

Opponents of Yoda conditions point out that tooling has made us better programmers because tools will catch the mistaken use of `=` instead of `==` (ESLint will catch this for you). Therefore, they argue, the utility of the pattern doesn't outweigh the readability hit the code takes while using Yoda conditions.

## Rule Details

This rule takes one argument. If it is `"never"` then comparisons must never be a Yoda condition. If `"always"`, then the literal must always come first. The default is `"never"`.

The following patterns are considered warnings:

```js
if ("red" === color) {
    // ...
}
```

```js
if (true == flag) {
    // ...
}
```

```js
if (5 > count) {
    // ...
}
```

```js
if (-1 < str.indexOf(substr)) {
    // ...
}
```

```js
// When ["always"]
if (color == "blue") {
	// ...
}
```

```js
if (0 <= x && x < 1) {
    // ...
}
```

The following patterns are not considered warnings:

```js
if (5 & value) {
    // ...
}
```

```js
if (value === "red") {
    // ...
}
```

```js
// When ["always"]
if ("blue" == value) {
    // ...
}
```

```js
// When ["always"]
if (-1 < str.indexOf(substr)) {
    // ...
}
```

### Range Tests

"Range" comparisons test whether a variable is inside or outside the range between two literals. When configured with the `exceptRange` option, range tests are allowed when the comparison itself is wrapped directly in parentheses, such as those of an `if` or `while` condition.

```json
"yoda": [2, "never", { "exceptRange": true }]
```

With the `exceptRange` option enabled, the following patterns become valid:

```js
function isReddish(color) {
    return (color.hue < 60 || 300 < color.hue);
}
```

```js
if (x < -1 || 1 < x) {
    // ...
}
```

```js
if (count < 10 && (0 <= rand && rand < 1)) {
    // ...
}
```

```js
function howLong(arr) {
    return (0 <= arr.length && arr.length < 10) ? "short" : "long";
}
```

## Further Reading

* [Yoda Conditions](http://en.wikipedia.org/wiki/Yoda_conditions)
* [Yoda Notation and Safe Switching](http://thomas.tuerke.net/on/design/?with=1249091668#msg1146181680)
