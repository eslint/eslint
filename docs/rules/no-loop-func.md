# no loop functions

## Rule Details

This error is raised to highlight a piece of code that may not work as you expect it to and could also indicate a misunderstanding of how the language works. Your code may run without any problems if you do not fix this error, but in some situations it could behave unexpectedly.

The following patterns are considered warnings:

```js

for (var i=10; i; i--) {
    (function() { ... })();
}
while(i) {
    var a = function() {};
    a();
}
do {
    function a() {};
    a();
} while (i);
```

The following patterns are considered okay and do not cause warnings:

```js
var a = function() {};

for (var i=10; i; i--) {
    a();
}
```

## Further Reading

* [Don't make functions within a loop](http://jslinterrors.com/dont-make-functions-within-a-loop/)
