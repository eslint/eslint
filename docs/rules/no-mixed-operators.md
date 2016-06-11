# Disallow mixes of different operators (no-mixed-operators)

Enclosing complex expressions by parentheses clarifies the developer's intention, which makes the code more readable.
This rule warns when different operators are used consecutively without parentheses in an expression.

```js
var foo = a && b || c || d;    /*BAD: Unexpected mix of '&&' and '||'.*/
var foo = (a && b) || c || d;  /*GOOD*/
var foo = a && (b || c || d);  /*GOOD*/
```

## Rule Details

This rule checks `BinaryExpression` and `LogicalExpression`.

This rule may conflict with [no-extra-parens](no-extra-parens.md) rule.
If you use both this and [no-extra-parens](no-extra-parens.md) rule together, you need to use the `nestedBinaryExpressions` option of [no-extra-parens](no-extra-parens.md) rule.

Examples of **incorrect** code for this rule:

```js
/*eslint no-mixed-operators: "error"*/

var foo = a && b < 0 || c > 0 || d + 1 === 0;
var foo = a + b * c;
```

Examples of **correct** code for this rule:

```js
/*eslint no-mixed-operators: "error"*/

var foo = a || b || c;
var foo = a && b && c;
var foo = (a && b < 0) || c > 0 || d + 1 === 0;
var foo = a && (b < 0 || c > 0 || d + 1 === 0);
var foo = a + (b * c);
var foo = (a + b) * c;
```

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

* `groups` (`string[][]`) - specifies groups to compare operators.
  When this rule compares two operators, if both operators are included in a same group, this rule checks it. Otherwise, this rule ignores it.
  This value is a list of groups. The group is a list of binary operators.
  Default is the groups for each kind of operators.
* `allowSamePrecedence` (`boolean`) - specifies to allow mix of 2 operators if those have the same precedence. Default is `true`.

### groups

The following operators can be used in `groups` option:

* Arithmetic Operators: `"+"`, `"-"`, `"*"`, `"/"`, `"%"`, `"**"`
* Bitwise Operators: `"&"`, `"|"`, `"^"`, `"~"`, `"<<"`, `">>"`, `">>>"`
* Comparison Operators: `"=="`, `"!="`, `"==="`, `"!=="`, `">"`, `">="`, `"<"`, `"<="`
* Logical Operators: `"&&"`, `"||"`
* Relational Operators: `"in"`, `"instanceof"`

Now, considers about `{"groups": [["&", "|", "^", "~", "<<", ">>", ">>>"], ["&&", "||"]]}` configure.
This configure has 2 groups: bitwise operators and logical operators.
This rule checks only if both operators are included in a same group.
So, in this case, this rule comes to check between bitwise operators and between logical operators.
This rule ignores other operators.

Examples of **incorrect** code for this rule with `{"groups": [["&", "|", "^", "~", "<<", ">>", ">>>"], ["&&", "||"]]}` option:

```js
/*eslint no-mixed-operators: ["error", {"groups": [["&", "|", "^", "~", "<<", ">>", ">>>"], ["&&", "||"]]}]*/

var foo = a && b < 0 || c > 0 || d + 1 === 0;
var foo = a & b | c;
```

Examples of **correct** code for this rule with `{"groups": [["&", "|", "^", "~", "<<", ">>", ">>>"], ["&&", "||"]]}` option:

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

### allowSamePrecedence

Examples of **correct** code for this rule with `{"allowSamePrecedence": true}` option:

```js
/*eslint no-mixed-operators: ["error", {"allowSamePrecedence": true}]*/

// + and - have the same precedence.
var foo = a + b - c;
```

Examples of **incorrect** code for this rule with `{"allowSamePrecedence": false}` option:

```js
/*eslint no-mixed-operators: ["error", {"allowSamePrecedence": false}]*/

// + and - have the same precedence.
var foo = a + b - c;
```

## When Not To Use It

If you don't want to be notified about mixed operators, then it's safe to disable this rule.

## Related Rules

* [no-extra-parens](no-extra-parens.md)
