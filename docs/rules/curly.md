# Require Following Curly Brace Conventions (curly)

JavaScript allows the omission of curly braces when a block contains only one statement. However, it is considered by many to be best practice to _never_ omit curly braces around blocks, even when they optional, because it can lead to bugs and reduces code clarity. So the following:

```js
if (foo) return;
```

Can be rewritten as:

```js
if (foo) {
    return;
}
```

There are, however, some who prefer to only use braces when there is more than one statement to be executed.

## Rule Details

This rule is aimed at preventing bugs and increasing code clarity by ensuring that block statements are wrapped in curly braces. It will warn when it encounters blocks that omit curly braces.

The following patterns are considered warnings:

```js
if (foo) return;

while (bar)
    baz();

if (foo) {
    baz();
} else qux();
```

The following patterns are not considered warnings:

```js
if (foo) {
    return;
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

By default, this rule warns whenever `if`, `else`, `for`, `while`, or `do` are used without block statements as their body. However, you can specify that block statements should be used only when there are multiple statements in the block and warn when there is only one statement in the block. To do so, configure the rule as:

```
curly: [2, "multi"]
```

With this configuration, the rule will warn for these patterns:

```js
if (foo) {
    return;
}

if (foo) bar();
else {
    return;
}

while (true) {
    doSomething();
}

for (var i=0; i < items.length; i++) {
    doSomething();
}
```

It will not warn for these patterns:

```js
if (foo) return;
else foo();

while (true) {
    doSomething();
    doSomethingElse();
}
```

The default configuration is:

```
curly: [2, "all"]
```

## When Not To Use It

If you have no strict conventions about when to use block statements and when not to, you can safely disable this rule.
