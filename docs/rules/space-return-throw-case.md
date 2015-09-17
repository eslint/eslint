# Require spaces following `return`, `throw`, and `case` (space-return-throw-case)

Require spaces following `return`, `throw`, and `case`.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

The following patterns are considered problems:

```js
/*eslint space-return-throw-case: 2*/

throw{a:0}                   /*error Keyword "throw" must be followed by whitespace.*/

function f(){ return-a; }    /*error Keyword "return" must be followed by whitespace.*/

switch(a){ case'a': break; } /*error Keyword "case" must be followed by whitespace.*/
```

The following patterns are not considered problems:

```js
/*eslint space-return-throw-case: 2*/

throw {a: 0};

function f(){ return -a; }

switch(a){ case 'a': break; }
```
