# Disallow duplicate left and right hand ternary expressions (no-dupe-ternary-expressions)

Ternary operators are most often used as a shorthand `if-else` clause to execute code based on the conditional expression of the ternary operator.

```js
const getFee = (isMember) => isMember ? 2.00 : 3.00;
```

Identical left and right-hand ternary expressions are almost always a mistake in the code. Unless there are side effects in the expressions, identical left and right hand expressions mean the same code will be executed whether or not the condition being tested evaluates to true or false.

```js
const getFee = (isMember) => isMember ? 2.00 : 2.00;
```

In the above example `getFee()` will always return the same fee whether or not `isMember` is true or false.

## Rule Details

This rule disallows identical left and right hand ternary expressions, no matter how far or where they are nested.

Examples of **incorrect** code for this rule:

```js
/*eslint no-dupe-ternary-expressions: "error"*/

const getFee = (isMember) => isMember ? 2.00 : 2.00;

const formula = complexCondition1 && complexCondition2 ? `(${User.months}*${currentRate})-${User.fee}` : `(${User.months}*${currentRate})-${User.fee}`

thing === otherThing
  ? User.a && myBoolean
  : User.a && myBoolean

condition1 ? foo() : condition2 ? bar() : condition3 ? baz() : baz()

5 < 7 ? (5 < 6 ? true : true) : false
```

Examples of **correct** code for this rule:

```js
/*eslint no-dupe-ternary-expressions: "error"*/

const getFee = (isMember) => isMember ? 2.00 : 3.00;

const formula = complexCondition1 && complexCondition2 ? `(${User.months}*${currentRate})-${User.fee}` : `(${User.months}*${oldRate})-${User.fee}`

thing === otherThing
  ? User.a && myBoolean
  : User.b && myBoolean

condition1 ? foo() : condition2 ? bar() : condition3 ? baz() : qux()

5 < 7 ? (5 < 6 ? true : false) : false
```

## When Not To Use It

It is difficult to imagine a scenario wherein a developer explicitly needs identical left and right hand ternary expressions. Strictly speaking this would mean the ternary operator is unnecessary since the same result could be achieved by executing that code without any condition being checked. If you find or think of any examples please [file an issue][0] and let us know.

## Related Rules

* [no-dupe-else-if](no-dupe-else-if.md)
* [no-unneeded-ternary](no-unneeded-ternary.md)

  [0]: https://github.com/eslint/eslint/issues/new/choose
