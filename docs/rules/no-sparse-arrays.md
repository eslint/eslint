# disallow sparse arrays (no-sparse-arrays)

Sparse arrays contain empty slots, most frequently due to multiple commas being used in an array literal, such as:

```js
var items = [,,];
```

While the `items` array in this example has a `length` of 2, there are actually no values in `items[0]` or `items[1]`. The fact that the array literal is valid with only commas inside, coupled with the `length` being set and actual item values not being set, make sparse arrays confusing for many developers. Consider the following:

```js
var colors = [ "red",, "blue" ];
```

In this example, the `colors` array has a `length` of 3. But did the developer intend for there to be an empty spot in the middle of the array? Or is it a typo?

The confusion around sparse arrays defined in this manner is enough that it's recommended to avoid using them unless you are certain that they are useful in your code.

## Rule Details

This rule disallows sparse array literals which have "holes" where commas are not preceded by elements. It does not apply to a trailing comma following the last element.

Examples of **incorrect** code for this rule:

```js
/*eslint no-sparse-arrays: "error"*/

var items = [,];
var colors = [ "red",, "blue" ];
```

Examples of **correct** code for this rule:

```js
/*eslint no-sparse-arrays: "error"*/

var items = [];
var items = new Array(23);

// trailing comma (after the last element) is not a problem
var colors = [ "red", "blue", ];
```

## When Not To Use It

If you want to use sparse arrays, then it is safe to disable this rule.

## Further Reading

* [Inconsistent array literals](https://www.nczonline.net/blog/2007/09/09/inconsistent-array-literals/)
