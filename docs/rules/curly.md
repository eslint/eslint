# Require Following Curly Brace Conventions (curly)

(fixable) The `--fix` option on the [command line](../user-guide/command-line-interface#fix) automatically fixes problems reported by this rule.

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

This rule has a string option:

* `"all"` (default) Require braces around all `if`, `else`, `for`, `while`, or `do` statements.
* `"multi"` Require curly braces if the statement body contains multiple statements.
* `"multi-line"` Require curly braces for statements on multiplte lines.
* `"multi-or-nest"` Require curly braces if the statement body contains multiple statements or contains nested statements.

This rule has an options object argument:

* `consistent` If set to `true` (default is `false`), it enforces the same braces rules for the bodies of a single `if`, `else if` and `else` chain.
* `allowExtra` If set to `true` (default is `false`), it relaxes the rule to allow additional braces and only warn about missing braces.

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

Examples of **incorrect** code for the `"multi"` option:

```js
/*eslint curly: ["error", "multi"]*/

if (foo) {
    foo++;
}

if (foo) {
    bar();
} else {
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

if (foo) {
    var bat = foo;
    foo++;
}

if (foo) bar();
else
    foo++;

while (true) {
    doSomething();
    doSomethingElse();
}

for (var i=0; i < items.length; i++)
    doSomething();
```

### multi-line

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
else if (bar) baz();
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
```

### consistent

Examples of **incorrect** code for the `"multi", {consistent: true}` options:

```js
/*eslint curly: ["error", "multi", {consistent: true}]*/

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
```

Examples of **correct** code for the `"multi", {consistent: true}` options:

```js
/*eslint curly: ["error", "multi", {consistent: true}]*/

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

```

### allowExtra

Examples of **correct** code for the `"multi", {allowExtra: true}` options:

```js
/*eslint curly: ["error", "multi", {allowExtra: true}]*/

if (foo) {
    bar();
}

if (foo)
    bar();

```

## When Not To Use It

If you have no strict conventions about when to use block statements and when not to, you can safely disable this rule.
