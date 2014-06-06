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
// When ["always"]
if (color == "blue") {
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


## Further Reading

* [Yoda Conditions](http://en.wikipedia.org/wiki/Yoda_conditions)
* [Yoda Notation and Safe Switching](http://thomas.tuerke.net/on/design/?with=1249091668#msg1146181680)
