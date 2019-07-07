# Require using the `async`/`await` syntax instead of the Promise methods (prefer-async-await)

With the addition of the `async`/`await` syntax in ECMAScript 2017, one can write asynchronous code
in a synchronous-like manner.

This rule restricts the use of the Promise methods in favor of the `async`/`await` syntax,
which is easier to write and to read afterwards.

## Rule Details

This rule flags all `.then()`, `.catch()` and `.finally()` method calls, assuming they are made on a promise object.

Examples of **incorrect** code for this rule:

```js
/*eslint prefer-async-await: "error"*/

function show(id) {
  getBook()
      .then(book => {
          getAuthor(book.authorId)
              .then((author) => {
                  display(book, author)
              })
      })
}

function show(id) {
  let book;
  getBook()
      .then(b => {
          book = b;
          return getAuthor(book.authorId);
      })
      .then((author) => {
          display(book, author);
      })
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

## Options

This rule has an object option with two options:

* `"atTopLevel": false` allows promise method calls at the top level
* `"inGetOrSet": false` allows promise method calls in getters and setters

### atTopLevel

The `await` expression cannot be used at the top level, yet. An alternative is to
wrap the expression in an async IIFE.

If you want to allow Promise method calls at the top level, set this option to `false`.

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

If you want to allow Promise method calls in getters and setters, set this option to `false`.

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

## Further Reading

* [Making asynchronous programming easier with async and await](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await)

