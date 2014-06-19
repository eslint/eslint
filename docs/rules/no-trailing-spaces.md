# Disallow trailing spaces at the end of lines (no-trailing-spaces)

Whitespaces at the end of lines are not a bug, but those can be not convenient.
When a developer moves the cursor to the end of the line, they expect to see the
cursor at the end of visible text. Also, additional spaces can be inconvenient when
you select text with mouse. And finally, it's just a good idea to keep your
code clear.

## Rule Details

The following patterns are considered warnings:

```js
    // spaces, tabs and unicode whitespaces
    // are not allowed at the end of lines
    var foo = 0;•
••••
    var baz = 5;
••
```

The following patterns are not warnings:

```js
    var foo = 0;

    var baz = 5;
```
