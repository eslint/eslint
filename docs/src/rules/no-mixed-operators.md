---
title: no-mixed-operators
rule_type: suggestion
related_rules:
- no-extra-parens
---

This rule was **deprecated** in ESLint v8.53.0. Please use the corresponding rule in [`@stylistic/eslint-plugin-js`](https://eslint.style/packages/js).

Enclosing complex expressions by parentheses clarifies the developer's intention, which makes the code more readable.
This rule warns when different operators are used consecutively without parentheses in an expression.

```js
var foo = a && b || c || d;    /*BAD: Unexpected mix of '&&' and '||'.*/
var foo = (a && b) || c || d;  /*GOOD*/
var foo = a && (b || c || d);  /*GOOD*/
```

**Note:**
It is expected for this rule to emit one error for each mixed operator in a pair. As a result, for each two consecutive mixed operators used, a distinct error will be displayed, pointing to where the specific operator that breaks the rule is used:

```js
var foo = a && b || c || d;
```

will generate

```shell
1:13  Unexpected mix of '&&' and '||'. (no-mixed-operators)
1:18  Unexpected mix of '&&' and '||'. (no-mixed-operators)
```

## Rule Details

This rule checks `BinaryExpression`, `LogicalExpression` and `ConditionalExpression`.

This rule may conflict with [no-extra-parens](no-extra-parens) rule.
If you use both this and [no-extra-parens](no-extra-parens) rule together, you need to use the `nestedBinaryExpressions` option of [no-extra-parens](no-extra-parens) rule.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-mixed-operators: "error"*/

var foo = a && b < 0 || c > 0 || d + 1 === 0;
var foo = a + b * c;
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-mixed-operators: "error"*/

var foo = a || b || c;
var foo = a && b && c;
var foo = (a && b < 0) || c > 0 || d + 1 === 0;
var foo = a && (b < 0 || c > 0 || d + 1 === 0);
var foo = a + (b * c);
var foo = (a + b) * c;
```

:::

## Options

```json
{
    "no-mixed-operators": [
        "error",
        {
            "groups": [
                ["+", "-", "*", "/", "%", "**"],
                ["&", "|", "^", "~", "<<", ">>", ">>>"],
                ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
                ["&&", "||"],
                ["in", "instanceof"]
            ],
            "allowSamePrecedence": true
        }
    ]
}
```

This rule has 2 options.

* `groups` (`string[][]`) - specifies operator groups to be checked. The `groups` option is a list of groups, and a group is a list of binary operators. Default operator groups are defined as arithmetic, bitwise, comparison, logical, and relational operators. Note: Ternary operator(?:) can be part of any group and by default is allowed to be mixed with other operators.

* `allowSamePrecedence` (`boolean`) - specifies whether to allow mixed operators if they are of equal precedence. Default is `true`.

### groups

The following operators can be used in `groups` option:

* Arithmetic Operators: `"+"`, `"-"`, `"*"`, `"/"`, `"%"`, `"**"`
* Bitwise Operators: `"&"`, `"|"`, `"^"`, `"~"`, `"<<"`, `">>"`, `">>>"`
* Comparison Operators: `"=="`, `"!="`, `"==="`, `"!=="`, `">"`, `">="`, `"<"`, `"<="`
* Logical Operators: `"&&"`, `"||"`
* Coalesce Operator: `"??"`
* Relational Operators: `"in"`, `"instanceof"`
* Ternary Operator: `?:`

Now, consider the following group configuration: `{"groups": [["&", "|", "^", "~", "<<", ">>", ">>>"], ["&&", "||"]]}`.
There are 2 groups specified in this configuration: bitwise operators and logical operators.
This rule checks if the operators belong to the same group only.
In this case, this rule checks if bitwise operators and logical operators are mixed, but ignores all other operators.

Examples of **incorrect** code for this rule with `{"groups": [["&", "|", "^", "~", "<<", ">>", ">>>"], ["&&", "||"]]}` option:

::: incorrect

```js
/*eslint no-mixed-operators: ["error", {"groups": [["&", "|", "^", "~", "<<", ">>", ">>>"], ["&&", "||"]]}]*/

var foo = a && b < 0 || c > 0 || d + 1 === 0;
var foo = a & b | c;
```

:::

::: incorrect

```js
/*eslint no-mixed-operators: ["error", {"groups": [["&&", "||", "?:"]]}]*/

var foo = a || b ? c : d;

var bar = a ? b || c : d;

var baz = a ? b : c || d;
```

:::

Examples of **correct** code for this rule with `{"groups": [["&", "|", "^", "~", "<<", ">>", ">>>"], ["&&", "||"]]}` option:

::: correct

```js
/*eslint no-mixed-operators: ["error", {"groups": [["&", "|", "^", "~", "<<", ">>", ">>>"], ["&&", "||"]]}]*/

var foo = a || b > 0 || c + 1 === 0;
var foo = a && b > 0 && c + 1 === 0;
var foo = (a && b < 0) || c > 0 || d + 1 === 0;
var foo = a && (b < 0 ||  c > 0 || d + 1 === 0);
var foo = (a & b) | c;
var foo = a & (b | c);
var foo = a + b * c;
var foo = a + (b * c);
var foo = (a + b) * c;
```

:::

::: correct

```js
/*eslint no-mixed-operators: ["error", {"groups": [["&&", "||", "?:"]]}]*/

var foo = (a || b) ? c : d;
var foo = a || (b ? c : d);

var bar = a ? (b || c) : d;

var baz = a ? b : (c || d);
var baz = (a ? b : c) || d;
```

:::

### allowSamePrecedence

Examples of **correct** code for this rule with `{"allowSamePrecedence": true}` option:

::: correct

```js
/*eslint no-mixed-operators: ["error", {"allowSamePrecedence": true}]*/

// + and - have the same precedence.
var foo = a + b - c;
```

:::

Examples of **incorrect** code for this rule with `{"allowSamePrecedence": false}` option:

::: incorrect

```js
/*eslint no-mixed-operators: ["error", {"allowSamePrecedence": false}]*/

// + and - have the same precedence.
var foo = a + b - c;
```

:::

Examples of **correct** code for this rule with `{"allowSamePrecedence": false}` option:

::: correct

```js
/*eslint no-mixed-operators: ["error", {"allowSamePrecedence": false}]*/

// + and - have the same precedence.
var foo = (a + b) - c;
```

:::

## When Not To Use It

If you don't want to be notified about mixed operators, then it's safe to disable this rule.
