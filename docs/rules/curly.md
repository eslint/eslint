# Require Following Curly Brace Conventions (curly)

JavaScript allows the omission of curly braces when a block contains only one statement. However, it is considered by many to be best practice to _never_ omit curly braces around blocks, even when they are optional, because it can lead to bugs and reduces code clarity. So the following:

```js
if (foo) foo++;
```

Can be rewritten as:

```js
if (foo) {
    foo++;
}
```

There are, however, some who prefer to only use braces when there is more than one statement to be executed.

## Rule Details

This rule is aimed at preventing bugs and increasing code clarity by ensuring that block statements are wrapped in curly braces. It will warn when it encounters blocks that omit curly braces.

## Options

### all

Examples of **incorrect** code for the default `"all"` option:

```js
/*eslint curly: "error"*/

if (foo) foo++;

while (bar)
    baz();

if (foo) {
    baz();
} else qux();
```

Examples of **correct** code for the default `"all"` option:

```js
/*eslint curly: "error"*/

if (foo) {
    foo++;
}

while (bar) {
    baz();
}

if (foo) {
    baz();
} else {
    qux();
}
```

### multi

By default, this rule warns whenever `if`, `else`, `for`, `while`, or `do` are used without block statements as their body. However, you can specify that block statements should be used only when there are multiple statements in the block and warn when there is only one statement in the block.

Examples of **incorrect** code for the `"multi"` option:

```js
/*eslint curly: ["error", "multi"]*/

if (foo) {
    foo++;
}

if (foo) bar();
else {
    foo++;
}

while (true) {
    doSomething();
}

for (var i=0; i < items.length; i++) {
    doSomething();
}
```

Examples of **correct** code for the `"multi"` option:

```js
/*eslint curly: ["error", "multi"]*/

if (foo) foo++;

else foo();

while (true) {
    doSomething();
    doSomethingElse();
}
```

### multi-line

Alternatively, you can relax the rule to allow brace-less single-line `if`, `else if`, `else`, `for`, `while`, or `do`, while still enforcing the use of curly braces for other instances.

Examples of **incorrect** code for the `"multi-line"` option:

```js
/*eslint curly: ["error", "multi-line"]*/

if (foo)
  doSomething();
else
  doSomethingElse();

if (foo) foo(
  bar,
  baz);
```

Examples of **correct** code for the `"multi-line"` option:

```js
/*eslint curly: ["error", "multi-line"]*/

if (foo) foo++; else doSomething();

if (foo) foo++;
else if (bar) baz()
else doSomething();

do something();
while (foo);

while (foo
  && bar) baz();

if (foo) {
    foo++;
}

if (foo) { foo++; }

while (true) {
    doSomething();
    doSomethingElse();
}
```

### multi-or-nest

You can use another configuration that forces brace-less `if`, `else if`, `else`, `for`, `while`, or `do` if their body contains only one single-line statement. And forces braces in all other cases.

Examples of **incorrect** code for the `"multi-or-nest"` option:

```js
/*eslint curly: ["error", "multi-or-nest"]*/

if (!foo)
    foo = {
        bar: baz,
        qux: foo
    };

while (true)
  if(foo)
      doSomething();
  else
      doSomethingElse();

if (foo) {
    foo++;
}

while (true) {
    doSomething();
}

for (var i = 0; foo; i++) {
    doSomething();
}

if (foo)
    // some comment
    bar();
```

Examples of **correct** code for the `"multi-or-nest"` option:

```js
/*eslint curly: ["error", "multi-or-nest"]*/

if (!foo) {
    foo = {
        bar: baz,
        qux: foo
    };
}

while (true) {
  if(foo)
      doSomething();
  else
      doSomethingElse();
}

if (foo)
    foo++;

while (true)
    doSomething();

for (var i = 0; foo; i++)
    doSomething();

if (foo) {
    // some comment
    bar();
}
```

### consistent

When using any of the `multi*` options, you can add an option to enforce all bodies of a `if`,
`else if` and `else` chain to be with or without braces.

Examples of **incorrect** code for the `"multi", "consistent"` options:

```js
/*eslint curly: ["error", "multi", "consistent"]*/

if (foo) {
    bar();
    baz();
} else
    buz();

if (foo)
    bar();
else if (faa)
    bor();
else {
    other();
    things();
}

if (true)
    foo();
else {
    baz();
}

if (foo) {
    foo++;
}
```

Examples of **correct** code for the `"multi", "consistent"` options:

```js
/*eslint curly: ["error", "multi", "consistent"]*/

if (foo) {
    bar();
    baz();
} else {
    buz();
}

if (foo) {
    bar();
} else if (faa) {
    bor();
} else {
    other();
    things();
}

if (true)
    foo();
else
    baz();

if (foo)
    foo++;

```

## When Not To Use It

If you have no strict conventions about when to use block statements and when not to, you can safely disable this rule.
