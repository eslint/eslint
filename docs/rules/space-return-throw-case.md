# Require spaces following `return`, `throw`, and `case` (space-return-throw-case)

**Replacement notice**: This rule was removed in ESLint v2.0 and replaced by [keyword-spacing](keyword-spacing.md) rule.

Require spaces following `return`, `throw`, and `case`.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

The following patterns are considered problems:

```js
/*eslint space-return-throw-case: "error"*/

throw{a:0}

function f(){ return-a; }

switch(a){ case'a': break; }
```

The following patterns are not considered problems:

```js
/*eslint space-return-throw-case: "error"*/

throw {a: 0};

function f(){ return -a; }

switch(a){ case 'a': break; }
```
