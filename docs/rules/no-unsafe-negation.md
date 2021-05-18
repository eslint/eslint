# disallow negating the left operand of relational operators (no-unsafe-negation)

Just as developers might type `-a + b` when they mean `-(a + b)` for the negative of a sum, they might type `!key in object` by mistake when they almost certainly mean `!(key in object)` to test that a key is not in an object. `!obj instanceof Ctor` is similar.

## Rule Details

This rule disallows negating the left operand of [Relational Operators](https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Expressions_and_Operators#Relational_operators).

Relational Operators are:

- `in` operator.
- `instanceof` operator.

Examples of **incorrect** code for this rule:

```js
/*eslint no-unsafe-negation: "error"*/

if (!key in object) {
    // operator precedence makes it equivalent to (!key) in object
    // and type conversion makes it equivalent to (key ? "false" : "true") in object
}

if (!obj instanceof Ctor) {
    // operator precedence makes it equivalent to (!obj) instanceof Ctor
    // and it equivalent to always false since boolean values are not objects.
}
```

Examples of **correct** code for this rule:

```js
/*eslint no-unsafe-negation: "error"*/

if (!(key in object)) {
    // key is not in object
}

if (!(obj instanceof Ctor)) {
    // obj is not an instance of Ctor
}

if(("" + !key) in object) {
    // make operator precedence and type conversion explicit
    // in a rare situation when that is the intended meaning
}
```

## When Not To Use It

If you don't want to notify unsafe logical negations, then it's safe to disable this rule.
