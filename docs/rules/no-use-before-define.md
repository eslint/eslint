# no use before define

This error is raised to highlight potentially dangerous code or code that could cause a fatal error. Your code may run without error, depending on the identifier in question, but is likely to cause confusion to other developers and could in some cases cause a fatal error that will prevent the rest of your script from executing. 

```js
alert(a); var a = 10;
```

## Rule Details

This rule will warn when it encounters a reference to an identifier that has not been declared as part of a var or function statement

The following patterns are considered warnings:

```js
alert(a); var a = 10;

f(); function f() {}
```

The following patterns are not considered warnings:

```js
var a = 10; alert(a);

function f() {} f();
```
