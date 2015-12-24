# Disallow Double Assignments (no-double-assignments)

Overwriting a variable twice in a row is most likely an error:

```js
cursor_x = 53;
cursor_x = 62;
```

The code above most likely is a result of a copy and paste error and the correct code should be

```js
cursor_x = 53;
cursor_y = 62;
```

## Rule Details

The following patterns are considered warnings:

```js
foo = 5;
foo = 6;

foo += 5;
foo = 6;

foo = bar();
foo = quux();
```

The following patterns are not considered warnings:

```js
foo = 5;
bar = 5;

foo = 5;
foo += 5;

foo = 5;
foo *= 5;

foo = 5;
bar(foo);
foo = 6;
```
