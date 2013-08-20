# No with Statements

The `with` statement is potentially problematic because it adds members of an object to the current scope, making it impossible to tell what a variable inside the block actually refers to.

## Rule Details

This rule is aimed at eliminating `with` statements. See this [blogpost](http://www.yuiblog.com/blog/2006/04/11/with-statement-considered-harmful/) by Douglas Crockford for more details.

The following patterns are considered warnings:

```js
with (foo) {
    // ...
}
```

## When Not To Use It

If you intentionally use `with` statements then you can disable this rule.

