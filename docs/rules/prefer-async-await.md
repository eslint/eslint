# Require using the `async`/`await` syntax instead of the Promise prototype methods (prefer-async-await)

With the addition of the `async`/`await` syntax in ECMAScript 2017, one can write asynchronous code
in a synchronous-like manner.

This rule restricts the use of the Promise prototype methods in favor of the `async`/`await` syntax,
which is easier to write and to read afterwards.

Namely, restricted methods are: `.then()`, `.catch()` and `.finally()`.

Static methods, such as `Promise.all()`, are **not** restricted.
You should still use `Promise.all()` for parallel execution.

## Rule Details

This rule flags all `.then()`, `.catch()` and `.finally()` method calls, assuming they are made on a promise object.

Examples of **incorrect** code for this rule:

```js
/*eslint prefer-async-await: "error"*/

function show(id) {
    return getBook()
        .then(book => {
            return getAuthor(book.authorId)
                .then((author) => {
                    display(book, author);
                });
        });
}

function show(id) {
    let book;
    return getBook()
        .then(b => {
            book = b;
            return getAuthor(book.authorId);
        })
        .then((author) => {
            display(book, author);
        });
}
```

Examples of **correct** code for this rule:

```js
/*eslint prefer-async-await: "error"*/

async function show(id) {
    const book = await getBook();
    const author = await getAuthor(book.authorId);
    display(book, author);
}
```

### Promise.all()

`Promise.all()` can be used along with the `async`/`await` syntax.

Example of **incorrect** code for this rule:

```js
/*eslint prefer-async-await: "error"*/

function foo() {
    return Promise.all([
        asyncFunc1(),
        asyncFunc2(),
    ]).then(([result1, result2]) => {
        doSomething(result1, result2);
    });
}
```

Example of **correct** code for this rule:

```js
/*eslint prefer-async-await: "error"*/

async function foo() {
    const [result1, result2] = await Promise.all([
        asyncFunc1(),
        asyncFunc2(),
    ]);
    doSomething(result1, result2);
}
```

Note that the following code is **not equivalent** to the previous two examples.
In this example, the function calls are executed **sequentially**:

```js
async function foo() {
    const result1 = await asyncFunc1();
    const result2 = await asyncFunc2();
    doSomething(result1, result2);
}
```

## Options

This rule has an object option with four options:

* `"atTopLevel": false` allows Promise prototype method calls at the top level
* `"inGetOrSet": false` allows Promise prototype method calls in getters and setters
* `"inAwaitExpressions": false` allows Promise prototype method calls in await expressions
* `"inYieldExpressions": false` allows Promise prototype method calls in yield expressions

### atTopLevel

The `await` expression cannot be used at the top level, yet. An alternative is to
wrap the expression in an async IIFE.

If you want to allow Promise prototype method calls at the top level, set this option to `false`.

Examples of **incorrect** code for this rule with `"atTopLevel"` option set to `true` (default):

```js
/*eslint prefer-async-await: ["error", {"atTopLevel": true}]*/

getSomething().then(x => doSomething(x));
```

Examples of **correct** code for this rule with `"atTopLevel"` option set to `true` (default):

```js
/*eslint prefer-async-await: ["error", {"atTopLevel": true}]*/

(async () => {
    const x = await getSomething();
    doSomething(x);
})();
```

Examples of **correct** code for this rule with `"atTopLevel"` option set to `false`:

```js
/*eslint prefer-async-await: ["error", {"atTopLevel": false}]*/

getSomething().then(x => doSomething(x));
```

### inGetOrSet

If you consume promises in getters or setters, switching to the `async`/`await` syntax would require
certain refactoring, since the getters and setters cannot be async.

If you want to allow Promise prototype method calls in getters and setters, set this option to `false`.

Examples of **incorrect** code for this rule with `"inGetOrSet"` option set to `true` (default):

```js
/*eslint prefer-async-await: ["error", {"inGetOrSet": true}]*/

class foo {
    set bar(x) {
        doSomething(x).then(y => this.y = y);
    }
}
```

Examples of **correct** code for this rule with `"inGetOrSet"` option set to `false`:

```js
/*eslint prefer-async-await: ["error", {"inGetOrSet": false}]*/

class foo {
    set bar(x) {
        doSomething(x).then(y => this.y = y);
    }
}
```

### inAwaitExpressions

If you want to allow Promise prototype method calls in `await` expressions, set this option to `false`.

Examples of **incorrect** code for this rule with `"inAwaitExpressions"` option set to `true` (default):

```js
/*eslint prefer-async-await: ["error", {"inAwaitExpressions": true}]*/

async function foo() {
    const x = await getSomething().catch(err => {});
    if (x) {
        doSomething();
    }
}
```

Examples of **correct** code for this rule with `"inAwaitExpressions"` option set to `false`:

```js
/*eslint prefer-async-await: ["error", {"inAwaitExpressions": false}]*/

async function foo() {
    const x = await getSomething().catch(err => {});
    if (x) {
        doSomething();
    }
}
```

### inYieldExpressions

If you want to allow Promise prototype method calls in `yield` expressions, set this option to `false`.

Examples of **incorrect** code for this rule with `"inYieldExpressions"` option set to `true` (default):

```js
/*eslint prefer-async-await: ["error", {"inYieldExpressions": true}]*/

function *foo() {
    yield getSomething().catch(err => {});
}
```

Examples of **correct** code for this rule with `"inYieldExpressions"` option set to `false`:

```js
/*eslint prefer-async-await: ["error", {"inYieldExpressions": false}]*/

function *foo() {
    yield getSomething().catch(err => {});
}
```

## Further Reading

* [Making asynchronous programming easier with async and await](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await)

