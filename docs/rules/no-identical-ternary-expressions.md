# Disallow identical expressions and duplicate tests conditions in ternary operators (no-identical-ternary-expressions)

Identical left and right hand expressions inside a ternary operator are a logical type of programming error, since the consequent and alternate (the if and else blocks) are in fact executing the exact same code. Chances are the developer meant to do something else.

Identical test conditions inside chained ternary operators are also a logical error since this will result in unreachable code.

## Rule Details

This rule disallows left and right hand expressions within ternary operators that are logically identical. It also catches duplicate test conditions.

It will ignore grouping parentheses and strip out whitespace when comparing left and right hand expressions that are not string literals.

It does not apply to if/else blocks.

Examples of **incorrect** code for this rule:

```js
/*eslint no-identical-ternary-expressions: "error"*/

function getFee(isMember) {
  return (isMember ? "$2.00" : "$2.00");
}

x === 2
  ? getFee(bar)
  : getFee(bar);

var foo = bar > baz ? value1 : value1;

var a = foo ? (((2+5)*7)*2) : ( ( (2+5)* 7)*2 );
// the left and right hand expressions are identical once stripped of whitespace

var a = foo ? (bar === getFee((baz))) : ((((bar === getFee(baz)))));
// the left and right hand expressions are identical, grouping parentheses are ignored

return condition1 ? value1 : condition1 ? value2 : value3
// the first and second tests are identical (condition1 used twice, value2 is unreachable code)

return condition1 ? value1 : condition2 ? value2 : condition1 ? value3 : value4
// the first and third tests are identical (condition1 used twice, value3 is unreachable code)
```

Examples of **correct** code for this rule:

```js
/*eslint no-identical-ternary-expressions: "error"*/

function getFee(isMember) {
  return (isMember ? "$2.00" : "$5.00");
}

x === 2
  ? getFee(bar)
  : getFee(baz);

var foo = bar > baz ? value1 : value2;

var a = foo ? (((2+5)*7)*2) : ( ( (5+5)* 7)*2 );

var a = foo ? (bar === getFee((bar))) : ((((bar === getFee(baz)))));

return condition1 ? value1 : condition2 ? value2 : value3

return condition1 ? value1 : condition2 ? value2 : condition3 ? value3 : value4
```

## Style Note

This rule compares the consequent and alternate of individual ternary operators, it will not check for identical values within a chained ternary operator.

This is because this rule is only concerned with logical errors, not with enforcing a consistent style. See the related rules for enforcing a specific ternary style.

```js
// this code returns value1 when either condition1 or condition3 is met. It's probably an error, but not something this rule would catch
function foo() {
    return condition1 ? value1
         : condition2 ? value2
         : condition3 ? value1 : value3
}

// No error even though the above code could be shortened to something like this:
function foo() {
    return (condition1 || condition3) ? value1 : condition2 ? value2 : value3
}
```

## Related Rules

* [multiline-ternary](multiline-ternary.md)
* [no-nested-ternary](no-nested-ternary.md)
* [no-ternary](no-ternary.md)
* [no-unneeded-ternary](no-unneeded-ternary.md)
