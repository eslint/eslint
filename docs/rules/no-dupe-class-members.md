# Disallow duplicate name in class members (no-dupe-class-members)

If there are declarations of the same name in class members, the last declaration overwrites other declarations silently.
It can cause unexpected behaviors.

```js
/*eslint-env es6*/

class Foo {
  bar() { console.log("hello"); }
  bar() { console.log("goodbye"); }
}

var foo = new Foo();
foo.bar(); // goodbye
```

## Rule Details

This rule is aimed to flag the use of duplicate names in class members.

The following patterns are considered problems:

```js
/*eslint no-dupe-class-members: 2*/
/*eslint-env es6*/

class Foo {
  bar() { }
  bar() { }          /*error Duplicate name "bar".*/
}

class Foo {
  bar() { }
  get bar() { }      /*error Duplicate name "bar".*/
}

class Foo {
  static bar() { }
  static bar() { }   /*error Duplicate name "bar".*/
}
```

The following patterns are not considered problems:

```js
/*eslint no-dupe-class-members: 2*/
/*eslint-env es6*/

class Foo {
  bar() { }
  qux() { }
}

class Foo {
  get bar() { }
  set bar(value) { }
}

class Foo {
  static bar() { }
  bar() { }
}
```

## When Not to Use It

This rule should not be used in ES3/5 environments.

In ES2015 (ES6) or later, if you don't want to be notified about duplicate names in class members, you can safely disable this rule.
