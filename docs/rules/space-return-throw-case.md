# space-return-throw-case: require spaces after `return`, `throw`, and `case` keywords

(removed) This rule was **removed** in ESLint v2.0 and **replaced** by the [keyword-spacing](keyword-spacing.md) rule.

(fixable) The `--fix` option on the [command line](../user-guide/command-line-interface#fix) automatically fixed problems reported by this rule.

Require spaces following `return`, `throw`, and `case`.

## Rule Details

Examples of **incorrect** code for this rule:

```js
/*eslint space-return-throw-case: "error"*/

throw{a:0}

function f(){ return-a; }

switch(a){ case'a': break; }
```

Examples of **correct** code for this rule:

```js
/*eslint space-return-throw-case: "error"*/

throw {a: 0};

function f(){ return -a; }

switch(a){ case 'a': break; }
```
