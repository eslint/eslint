# enforce a maximum depth that callbacks can be nested (max-nested-callbacks)

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

This rule enforces a maximum depth that callbacks can be nested to increase code clarity.

## Options

This rule has a number or object option:

* `"max"` (default `10`) enforces a maximum depth that callbacks can be nested

**Deprecated:** The object property `maximum` is deprecated; please use the object property `max` instead.

### max

Examples of **incorrect** code for this rule with the `{ "max": 3 }` option:

```js
/*eslint max-nested-callbacks: ["error", 3]*/

foo1(function() {
    foo2(function() {
        foo3(function() {
            foo4(function() {
                // Do something
            });
        });
    });
});
```

Examples of **correct** code for this rule with the `{ "max": 3 }` option:

```js
/*eslint max-nested-callbacks: ["error", 3]*/

foo1(handleFoo1);

function handleFoo1() {
    foo2(handleFoo2);
}

function handleFoo2() {
    foo3(handleFoo3);
}

function handleFoo3() {
    foo4(handleFoo4);
}

function handleFoo4() {
    foo5();
}
```

## Further Reading

* [Control flow in Node.js](http://book.mixu.net/node/ch7.html)
* [Control Flow in Node](https://howtonode.org/control-flow)
* [Control Flow in Node Part II](https://howtonode.org/control-flow-part-ii)

## Related Rules

* [complexity](complexity.md)
* [max-depth](max-depth.md)
* [max-len](max-len.md)
* [max-lines](max-lines.md)
* [max-lines-per-function](max-lines-per-function.md)
* [max-params](max-params.md)
* [max-statements](max-statements.md)
