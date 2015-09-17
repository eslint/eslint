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

The following patterns are considered problems:

```js
/*eslint yoda: 2*/

if ("red" === color) {          /*error Expected literal to be on the right side of ===.*/
    // ...
}

if (true == flag) {             /*error Expected literal to be on the right side of ==.*/
    // ...
}

if (5 > count) {                /*error Expected literal to be on the right side of >.*/
    // ...
}

if (-1 < str.indexOf(substr)) { /*error Expected literal to be on the right side of <.*/
    // ...
}

if (0 <= x && x < 1) {          /*error Expected literal to be on the right side of <=.*/
    // ...
}
```

```js
/*eslint yoda: [2, "always"]*/

if (color == "blue") { /*error Expected literal to be on the left side of ==.*/
    // ...
}
```


The following patterns are not considered problems:

```js
/*eslint yoda: 2*/

if (5 & value) {
    // ...
}

if (value === "red") {
    // ...
}
```

```js
/*eslint yoda: [2, "always"]*/

if ("blue" == value) {
    // ...
}

if (-1 < str.indexOf(substr)) {
    // ...
}
```

### Options

There are a few options to the rule:

```json
"yoda": [2, "never", {
    "exceptRange": false,
    "onlyEquality": false
}]
```

The `onlyEquality` option is a superset of `exceptRange`, thus both options are hardly useful together.

#### Range Tests

"Range" comparisons test whether a variable is inside or outside the range between two literals. When configured with the `exceptRange` option, range tests are allowed when the comparison itself is wrapped directly in parentheses, such as those of an `if` or `while` condition.

```json
"yoda": [2, "never", { "exceptRange": true }]
```

With the `exceptRange` option enabled, the following patterns become valid:

```js
/*eslint yoda: [2, "never", { "exceptRange": true }]*/

function isReddish(color) {
    return (color.hue < 60 || 300 < color.hue);
}

if (x < -1 || 1 < x) {
    // ...
}

if (count < 10 && (0 <= rand && rand < 1)) {
    // ...
}

function howLong(arr) {
    return (0 <= arr.length && arr.length < 10) ? "short" : "long";
}
```

#### Apply only to equality, but not other operators

Some developers might prefer to only enforce the rule for the equality operators `==` and `===`, and not showing any warnings for any code around other operators. With `onlyEquality` option, these patterns will not be considered problems:

```js
/*eslint yoda: [2, "never", { "onlyEquality": true }]*/

if (x < -1 || 9 < x) {
}

if (x !== 'foo' && 'bar' != x) {
}
```

## Further Reading

* [Yoda Conditions](http://en.wikipedia.org/wiki/Yoda_conditions)
* [Yoda Notation and Safe Switching](http://thomas.tuerke.net/on/design/?with=1249091668#msg1146181680)
