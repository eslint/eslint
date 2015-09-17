# Require or disallow spaces following keywords (space-after-keywords)

Some style guides will require or disallow spaces following the certain keywords.

```js
if (condition) {
    doSomething();
} else {
    doSomethingElse();
}

if(condition) {
    doSomething();
}else{
    doSomethingElse();
}
```

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

This rule will enforce consistency of spacing after the keywords `if`, `else`, `for`, `while`, `do`, `switch`, `try`, `catch`, `finally`, and `with`.

This rule takes one argument. If it is `"always"` then the keywords must be followed by at least one space. If `"never"`
then there should be no spaces following. The default is `"always"`.

The following patterns are considered problems:

```js
/*eslint space-after-keywords: 2*/

if(a) {}         /*error Keyword "if" must be followed by whitespace.*/

if (a) {} else{} /*error Keyword "else" must be followed by whitespace.*/

do{} while (a);  /*error Keyword "do" must be followed by whitespace.*/
```

```js
/*eslint space-after-keywords: [2, "never"]*/

if (a) {}        /*error Keyword "if" must not be followed by whitespace.*/
```

The following patterns are not considered problems:

```js
/*eslint space-after-keywords: 2*/

if (a) {}

if (a) {} else {}
```

```js
/*eslint space-after-keywords: [2, "never"]*/

if(a) {}
```
