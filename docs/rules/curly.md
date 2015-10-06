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

The following patterns are considered problems:

```js
/*eslint curly: 2*/

if (foo) foo++; /*error Expected { after 'if' condition.*/

while (bar)     /*error Expected { after 'while' condition.*/
    baz();

if (foo) {      /*error Expected { after 'else'.*/
    baz();
} else qux();
```

The following patterns are not considered problems:

```js
/*eslint curly: 2*/

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

### Options

#### multi

By default, this rule warns whenever `if`, `else`, `for`, `while`, or `do` are used without block statements as their body. However, you can specify that block statements should be used only when there are multiple statements in the block and warn when there is only one statement in the block. To do so, configure the rule as:

```json
curly: [2, "multi"]
```

With this configuration, the rule will warn for these patterns:

```js
/*eslint curly: [2, "multi"]*/

if (foo) {                             /*error Unnecessary { after 'if' condition.*/
    foo++;
}

if (foo) bar();                        /*error Unnecessary { after 'else'.*/
else {
    foo++;
}

while (true) {                         /*error Unnecessary { after 'while' condition.*/
    doSomething();
}

for (var i=0; i < items.length; i++) { /*error Unnecessary { after 'for' condition.*/
    doSomething();
}
```

It will not warn for these patterns:

```js
/*eslint curly: [2, "multi"]*/

if (foo) foo++;

else foo();

while (true) {
    doSomething();
    doSomethingElse();
}
```

#### multi-line

Alternatively, you can relax the rule to allow brace-less single-line `if`, `else if`, `else`, `for`, `while`, or `do`, while still enforcing the use of curly braces for other instances. To do so, configure the rule as:

```json
curly: [2, "multi-line"]
```

With this configuration, the rule will warn for these patterns:

```js
/*eslint curly: [2, "multi-line"]*/

if (foo)             /*error Expected { after 'if' condition.*/ /*error Expected { after 'else'.*/
  doSomething();
else
  doSomethingElse();

if (foo) foo(        /*error Expected { after 'if' condition.*/
  bar,
  baz);
```

It will not warn for these patterns:

```js
/*eslint curly: [2, "multi-line"]*/

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

#### multi-or-nest

You can use another configuration that forces brace-less `if`, `else if`, `else`, `for`, `while`, or `do` if their body contains only one single-line statement. And forces braces in all other cases.

```json
curly: [2, "multi-or-nest"]
```

With this configuration, the rule will warn for these patterns:

```js
/*eslint curly: [2, "multi-or-nest"]*/

if (!foo)                   /*error Expected { after 'if' condition.*/
    foo = {
        bar: baz,
        qux: foo
    };

while (true)                /*error Expected { after 'while' condition.*/
  if(foo)
      doSomething();
  else
      doSomethingElse();

if (foo) {                  /*error Unnecessary { after 'if' condition.*/
    foo++;
}

while (true) {              /*error Unnecessary { after 'while' condition.*/
    doSomething();
}

for (var i = 0; foo; i++) { /*error Unnecessary { after 'for' condition.*/
    doSomething();
}
```

It will not warn for these patterns:

```js
/*eslint curly: [2, "multi-or-nest"]*/

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

#### consistent

When using any of the `multi*` option, you can add an option to enforce all bodies of a `if`,
`else if` and `else` chain to be with or without braces.

```json
curly: [2, "multi", "consistent"]
```

With this configuration, the rule will warn for those patterns:

```js
/*eslint curly: [2, "multi", "consistent"]*/

if (foo) {
    bar();
    baz();
} else                      /*error Expected { after 'else'.*/
    buz();

if (foo)                    /*error Expected { after 'if' condition.*/
    bar();
else if (faa)               /*error Expected { after 'if' condition.*/
    bor();
else {
    other();
    things();
}

if (true)
    foo();
else {                      /*error Unnecessary { after 'else'.*/
    baz();
}

if (foo) {                  /*error Unnecessary { after 'if' condition.*/
    foo++;
}
```

It will not warn for these patterns:

```js
/*eslint curly: [2, "multi", "consistent"]*/

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

The default configuration is:

```json
curly: [2, "all"]
```

## When Not To Use It

If you have no strict conventions about when to use block statements and when not to, you can safely disable this rule.
