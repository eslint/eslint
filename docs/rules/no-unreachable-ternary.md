# Disallow unreachable ternary expressions (no-unreachable-ternary)

Ternary operators are most often used as a shorthand `if-else` clause to execute code based on the conditional expression of the ternary operator. Ternary operators can also contain any number of nested ternary conditions to chain conditions together.

```js
const getFee = (user) => user.isMember
    ? user.isFounder
    ? 2.00 // member and founder
    : 3.00 // member not founder
    : 4.00; // not a member (could technically still be a founder, but we skip that check)
```

Identical ternary conditions are almost always a mistake. Unless there are side effects in the test conditions identical (and equivalent) conditions necessarily result in unreachable code.

```js
const getFee = (user) => user.isMember
    ? user.isMember
    ? 2.00
    : 3.00 // unreachable code
    : 4.00;
```

In the above example value `3.00` is unreachable code. This is due to the fact that `user.isMember` cannot be true and then become false without the conditional expression having side effects. Similarly, inverted duplicate conditions also result in unreachable code due to how nested ternary operators work.

```js
const getFee = (user) => user.isMember
    ? !user.isMember
    ? 2.00 // unreachable code
    : 3.00
    : 4.00;
```

By inverting the original condition we end up with same predicament however this time value `2.00` is unreachable.

## Rule Details

This rule disallows identical ternary conditions and duplicate inverted ternary conditions within nested ternary expressions no matter how far or where they are nested.

It will also detect and report equivalent or conditions (i.e. `x || y` is logically equivalent to `y || x`).

Examples of **incorrect** code for this rule:

```js
/*eslint no-unreachable-ternary: "error"*/

const getFee = (user) => user.isMember ? user.isMember ? 2.00 : 3.00 : 4.00;
// 3.00 is unreachable

const thing = condition1 || condition2 ? condition2 || condition1 ? 'x' : 'y' : 'z';
// 'y' is unreachable

const getFee = (user) => user.isMember ? 3.00 : user.isMember ? 2.00 : 4.00;
// 2.00 is unreachable

const result = foo(x) ? !foo(x) ? 1 : 2 : 3;
// 1 is unreachable

const formula = condition1 && condition2
    ? condition2
    ? `${oldRate}+${User.fee}`
    : `${currentRate}+${User.fee}`
    : `${newRate}+${User.fee}`;
// `${currentRate}-${User.fee} is unreachable`

condition1 ? foo() : condition2 ? bar() : condition3 ? baz() : condition1 ? qux() : bar());
// qux() is unreachable
```

Examples of **correct** code for this rule:

```js
/*eslint no-unreachable-ternary: "error"*/

const getFee = (user) => user.isMember ? user.isFounder ? 2.00 : 3.00 : 4.00;

const thing = condition1 || condition2 ? condition2 ? 'x' : 'y' : 'z';
// This nested ternary won't error by default. While this pattern is uncommon it does not result in unreachable code. See option details below.

const formula = condition1
    ? condition2
    ? `${oldRate}+${User.fee}`
    : `${currentRate}+${User.fee}`
    : `${newRate}+${User.fee}`;

condition1 ? foo() : condition2 ? bar() : condition3 ? baz() : condition4 ? qux() : bar());
```

## Options

This rule has an object option:

- `"allowDuplicateOrConditions": true` (default) allows duplicate OR type ternary conditions if the expression does not result in unreachable code
- `"allowDuplicateOrConditions": false` disallows OR type ternary conditions from appearing more than once inside the ternary chain (no matter how far nested)

### allowDuplicateOrConditions

When set to true, which it is by default, the allowDuplicateOrConditions option allows expressions in the form of `condition1 || condition2 ? condition2 || condition3 ? x : y : z;` even though
this could be shortened to `condition2 ? condition1 || condition3 ? x : y : z`.

Examples of **correct** code for this rule with the `{ "allowDuplicateOrConditions": true}` option:

```js
/*eslint no-unreachable-ternary: ["error", { "allowDuplicateOrConditions": true }]*/

const thing = condition1 || condition2 ? condition2 || condition3 ? 'x' : 'y' : 'z';

const otherThing = condition1 || condition3 ? condition2 ? condition1 || condition4 ? 'w' : 'x' : 'y' : 'z';
```

By setting allowDuplicateOrConditions option to `false` the above code would error with `Duplicate ternary OR conditions {{condition}}.`.

Please note the difference in the error message from the standard `Equivalent ternary OR conditions {{condition}}.`.

Examples of **incorrect** code for this rule with the `{ "allowDuplicateOrConditions": false}` option:

```js
/*eslint no-unreachable-ternary: ["error", { "allowDuplicateOrConditions": false }]*/

const thing = condition1 || condition2 ? !condition2 || condition1 ? 'x' : 'y' : 'z';
// Error: Duplicate ternary OR conditions 'condition1'.

const otherThing = condition1 || condition4 ? condition2 ? condition3 || condition4 ? 'w' : 'x' : 'y' : 'z';
// Error: Duplicate ternary OR conditions 'condition4'
```

Examples of **correct** code for this rule with the `{ "allowDuplicateOrConditions": false}` option:

```js
/*eslint no-unreachable-ternary: ["error", { "allowDuplicateOrConditions": false }]*/

const thing = condition1 ? condition2 ? 'x' : 'y' : 'z';

const otherThing = condition1 || condition2 ? condition3 || condition4 ? 'x' : 'y' : 'z';
```

## Known Limitations

Due to how this rule is implemented it will never report inverted conditions that also form part of a ternary OR condition:

```js
const result = condition1 || condition2 ? !condition1 ? x : y : z;
```

This, again, technically does not result in unreachable code but it does represent an uncommon coding pattern.

## When Not To Use It

In rare cases where you really need identical ternary conditions in the same chain, which necessarily means that the expressions in the chain are causing and relying on side effects, you will have to turn this rule off.

If you prefer not to have nested ternary expressions please use [no-nested-ternary](no-nested-ternary.md) instead.

## Related Rules

- [no-dupe-else-if](no-dupe-else-if.md)
- [no-unneeded-ternary](no-unneeded-ternary.md)
- [no-nested-ternary](no-nested-ternary.md)

  [0]: https://github.com/eslint/eslint/issues/new/choose
