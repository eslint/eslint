---
title: no-dupe-class-members
rule_type: problem
handled_by_typescript: true
---



If there are declarations of the same name in class members, the last declaration overwrites other declarations silently.
It can cause unexpected behaviors.

```js
class Foo {
  bar() { console.log("hello"); }
  bar() { console.log("goodbye"); }
}

var foo = new Foo();
foo.bar(); // goodbye
```

## Rule Details

This rule is aimed to flag the use of duplicate names in class members.

## Examples

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-dupe-class-members: "error"*/

class A {
  bar() { }
  bar() { }
}

class B {
  bar() { }
  get bar() { }
}

class C {
  bar;
  bar;
}

class D {
  bar;
  bar() { }
}

class E {
  static bar() { }
  static bar() { }
}
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-dupe-class-members: "error"*/

class A {
  bar() { }
  qux() { }
}

class B {
  get bar() { }
  set bar(value) { }
}

class C {
  bar;
  qux;
}

class D {
  bar;
  qux() { }
}

class E {
  static bar() { }
  bar() { }
}
```

:::

## When Not To Use It

This rule should not be used in ES3/5 environments.

In ES2015 (ES6) or later, if you don't want to be notified about duplicate names in class members, you can safely disable this rule.
