# Set Maximum Depth of Nested Callbacks (max-nested-callbacks)

Many JavaScript libraries use the callback pattern to manage asynchronous operations. A program of any complexity will most likely need to manage several asynchronous operations at various levels of concurrency. A common pitfall that is easy to fall into is nesting callbacks, which makes code more difficult to read the deeper the callbacks are nested.

```js
foo(function () {
    bar(function () {
        baz(function() {
            qux(function () {

            });
        });
    });
});
```

## Rule Details

This rule is aimed at increasing code clarity by discouraging deeply nesting callbacks. As such, it will warn when callbacks are nested deeper than the specified limit.

### Options

The default max depth for this rule is 10. You can define the depth as an option by using the second argument in your configuration. For example, this sets the rule as an error (code is 2) with a maximum depth of 3:

```json
"max-nested-callbacks": [2, 3]
```

The following patterns are considered problems:

```js
/*eslint max-nested-callbacks: [2, 3]*/

foo(function () {
    bar(function () {
        baz(function() {
            qux(function () { /*error Too many nested callbacks (4). Maximum allowed is 3.*/

            });
        });
    });
});
```

The following patterns are not considered problems:

```js
/*eslint max-nested-callbacks: [2, 3]*/

foo(handleFoo);

function handleFoo (){
    bar(handleBar);
}

function handleBar() {
    baz(handleBaz);
}

function handleBaz() {
    qux(handleQux);
}

function handleQux() {

}
```

## Further Reading

* [Control flow in Node.js](http://book.mixu.net/node/ch7.html)
* [Control Flow in Node](http://howtonode.org/control-flow)
* [Control Flow in Node Part II](http://howtonode.org/control-flow-part-ii)

## Related Rules

* [complexity](complexity.md)
* [max-depth](max-depth.md)
* [max-len](max-len.md)
* [max-params](max-params.md)
* [max-statements](max-statements.md)
