# Require Parens for Constructors (new-parens)

JavaScript allows the omission of parentheses when invoking a function via the `new` keyword and the constructor has no arguments. However, some coders believe that omitting the parentheses is inconsistent with the rest of the language and thus makes code less clear.

```js
var person = new Person;
```

## Rule Details

This rule is aimed at highlighting a lack of convention and increasing code clarity by requiring the use of parentheses when invoking a constructor via the `new` keyword. As such, it will warn when these parentheses are omitted.

The following patterns are considered problems:

```js
/*eslint new-parens: 2*/

var person = new Person; /*error Missing '()' invoking a constructor*/
```

The following patterns are not considered problems:

```js
/*eslint new-parens: 2*/

var person = new Person();
```
