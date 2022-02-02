# no-confusing-arrow

Disallows arrow functions where they could be confused with comparisons.

Arrow functions (`=>`) are similar in syntax to some comparison operators (`>`, `<`, `<=`, and `>=`). This rule warns against using the arrow function syntax in places where it could be confused with a comparison operator.

Here's an example where the usage of `=>` could be confusing:

```js
// The intent is not clear
var x = a => 1 ? 2 : 3;
// Did the author mean this
var x = function (a) { return 1 ? 2 : 3 };
// Or this
var x = a <= 1 ? 2 : 3;
```

## Rule Details

Examples of **incorrect** code for this rule:

```js
/*eslint no-confusing-arrow: "error"*/
/*eslint-env es6*/

var x = a => 1 ? 2 : 3;
var x = (a) => 1 ? 2 : 3;
```

Examples of **correct** code for this rule:

```js
/*eslint no-confusing-arrow: "error"*/
/*eslint-env es6*/

var x = a => (1 ? 2 : 3);
var x = (a) => (1 ? 2 : 3);
var x = a => { return 1 ? 2 : 3; };
var x = (a) => { return 1 ? 2 : 3; };
```

## Options

This rule accepts two options argument with the following defaults:

```json
{
    "rules": {
        "no-confusing-arrow": ["error", {"allowParens": true,"onlyOneSimpleParam": false}]
    }
}
```

`allowParens` is a boolean setting that can be `true`(default) or `false`:

1. `true` relaxes the rule and accepts parenthesis as a valid "confusion-preventing" syntax.
2. `false` warns even if the expression is wrapped in parenthesis

Examples of **incorrect** code for this rule with the `{"allowParens": false}` option:

```js
/*eslint no-confusing-arrow: ["error", {"allowParens": false}]*/
/*eslint-env es6*/
var x = a => (1 ? 2 : 3);
var x = (a) => (1 ? 2 : 3);
```

`onlyOneSimpleParam` is a boolean setting that can be `true` or `false`(false):

1. `true` warns if arrow functions with a single argument that is either an identifier or a primitive literal is used.
2. `false` relaxes the rule.

Examples of **incorrect** code for this rule with the `{"onlyOneSimpleParam": true}` option:

```js
/*eslint no-confusing-arrow: ["error", {"onlyOneSimpleParam": true}]*/
/*eslint-env es6*/
var x = (a) => (1 ? 2 : 3);
```

## Related Rules

* [no-constant-condition](no-constant-condition.md)
* [arrow-parens](arrow-parens.md)
