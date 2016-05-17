# space-return-throw-case: require spaces after `return`, `throw`, and `case` keywords

(removed) This rule was **removed** in ESLint v2.0 and **replaced** by the [keyword-spacing](keyword-spacing.md) rule.

(fixable) The `--fix` option on the [command line](../user-guide/command-line-interface#fix) automatically fixed problems reported by this rule.

Require spaces following `return`, `throw`, and `case`.

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
