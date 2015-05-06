# Require newline before `return` statement (newline-before-return)

Projects usually start with clear, minimal code:

```js
function greet(greeting) {
  return greeting || "Hello" + " world!";
}
```

As variables & logic increases, it becomes difficult to quickly tell
how `return` values are created
and which preceding statements are relevant:

```js
function greet(greeting, subject) {
  greeting = greeting || "Hello";
  if (!subject) {
    greeting += "!";
    return greeting
  }
  // greet the subject
  return greeting + " " + subject + "!";
}
```

Leveraging whitespace can help visibly
distinguish variable assignments & logic blocks from `return` statements:


```js
function greet(greeting, subject) {
  greeting = greeting || "Hello";

  if (!subject) {
    greeting += "!";

    return greeting
  }

  // greet the subject
  return greeting + " " + subject + "!";
}
```

As a result, the `return` value is visibly separate from the statements
that created it, revealing clear exit points within the function.


## Rule Details

The following patterns are considered **warnings**:

```js
var greet = 'hello'; return greet;
```

```js
var greet = 'hello';
return greet;
```

```js
var greet = 'hello';
// Comment
return greet;
```

The following patterns are **valid**:

```js
return 'hello';
```

```js
var greet = 'hello';

return greet;
```

```js
var greet = 'hello';




return greet;
```

```js
var greet = 'hello';

// about to return a variable
return greet;
```

```js
var greet = 'hello';
// just set a variable

return greet;
```

As you can see, a blank line has to _precede_ the `return` statement and any
accompanying comments.


## When Not To Use It

If you have simplistic functions with minimal assignments, logic, & `return`
statements, disable this rule.


## Further Reading

When using this rule, consider also enabling [`newline-after-var`][2].

Thanks to [Symfony2's Coding Standards][1] for inspiration!

_This rule works just as well with `globalReturn` set to either `true` or `false`._


[1]: http://symfony.com/doc/current/contributing/code/standards.html#structure
[2]: http://eslint.org/docs/rules/newline-after-var
