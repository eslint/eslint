# require parentheses when invoking a constructor with no arguments (new-parens)

JavaScript allows the omission of parentheses when invoking a function via the `new` keyword and the constructor has no arguments. However, some coders believe that omitting the parentheses is inconsistent with the rest of the language and thus makes code less clear.

```js
var person = new Person;
```

## Rule Details

This rule requires parentheses when invoking a constructor with no arguments using the `new` keyword in order to increase code clarity.

Examples of **incorrect** code for this rule:

```js
/*eslint new-parens: "error"*/

var person = new Person;
var person = new (Person);
```

Examples of **correct** code for this rule:

```js
/*eslint new-parens: "error"*/

var person = new Person();
var person = new (Person)();
```
