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
```

### Exception

For rare situations when negating the left operand is intended, this rule allows an exception.
If the whole negation is explicitly wrapped in parentheses, the rule will not report a problem.

Examples of **correct** code for this rule:

```js
/*eslint no-unsafe-negation: "error"*/

if ((!foo) in object) {
    // allowed, because the negation is explicitly wrapped in parentheses
    // it is equivalent to (foo ? "false" : "true") in object
    // this is allowed as an exception for rare situations when that is the intended meaning
}

if(("" + !foo) in object) {
    // you can also make the intention more explicit, with type conversion
}
```

Examples of **incorrect** code for this rule:

```js
/*eslint no-unsafe-negation: "error"*/

if (!(foo) in object) {
    // this is not an allowed exception
}
```

## When Not To Use It

If you don't want to notify unsafe logical negations, then it's safe to disable this rule.
