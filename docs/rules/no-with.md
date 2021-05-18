# disallow `with` statements (no-with)

The `with` statement is potentially problematic because it adds members of an object to the current scope, making it impossible to tell what a variable inside the block actually refers to.

## Rule Details

This rule disallows `with` statements.

If ESLint parses code in strict mode, the parser (instead of this rule) reports the error.

Examples of **incorrect** code for this rule:

```js
/*eslint no-with: "error"*/

with (point) {
    r = Math.sqrt(x * x + y * y); // is r a member of point?
}
```

Examples of **correct** code for this rule:

```js
/*eslint no-with: "error"*/
/*eslint-env es6*/

const r = ({x, y}) => Math.sqrt(x * x + y * y);
```

## When Not To Use It

If you intentionally use `with` statements then you can disable this rule.

## Further Reading

* [with Statement Considered Harmful](https://yuiblog.com/blog/2006/04/11/with-statement-considered-harmful/)
