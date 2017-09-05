# enforce lines between class members (lines-between-class-members)

This rule improves readability by enforcing lines between class members.

## Rule Details

Examples of **incorrect** code for this rule:

```js
/* eslint lines-between-class-members: ["error", "always"]*/
class MyClass {
  foo() {
    //...
  }
  bar() {
    //...
  }
}
```

Examples of **correct** code for this rule:

```js
/* eslint lines-between-class-members: ["error", "always"]*/
class MyClass {
  foo() {
    //...
  }

  bar() {
    //...
  }
}
```

### Options

This rule has one option, which can be a string option or an object option.

String option:

* `"always"`(default) requires line breaks between methods
* `"never"` disallows line breaks between methods

Object option:

* `"multiline": "always"` requires line breaks if the method is multiline
* `"multiline": "never"` disallow line breaks if the method is multiline
* `"singleline": "always"` requires line breaks if the method is singleline
* `"singleline": "never"` disallow line breaks if the method is singleline

Examples of **incorrect** code for this rule with the string option:

```js
/* eslint lines-between-class-members: ["error", "always"]*/
class Foo{
  bar(){}
  baz(){}
}

/* eslint lines-between-class-members: ["error", "never"]*/
class Foo{
  bar(){}

  baz(){}
}
```

Examples of **correct** code for this rule with the string option:

```js
/* eslint lines-between-class-members: ["error", "always"]*/
class Foo{
  bar(){}

  baz(){}
}

/* eslint lines-between-class-members: ["error", "never"]*/
class Foo{
  bar(){}
  baz(){}
}
```

Examples of **incorrect** code for this rule with the object option:

```js
/* eslint lines-between-class-members: ["error", { multiline: "always" }]*/
class Foo{
  bar(){
    bar();
  }
  baz(){}
}

/* eslint lines-between-class-members: ["error", { multiline: "never" }]*/
class Foo{
  bar(){
    bar();
  }

  baz(){}
}

/* eslint lines-between-class-members: ["error", { singleline: "always" }]*/
class Foo{
  bar(){}
  baz(){}
}

/* eslint lines-between-class-members: ["error", { singleline: "never" }]*/
class Foo{
  bar(){}

  baz(){}
}
```

Examples of **correct** code for this rule with the object option:

```js
/* eslint lines-between-class-members: ["error", { multiline: "always" }]*/
class Foo{
  bar(){
    bar();
  }

  baz(){}
}

/* eslint lines-between-class-members: ["error", { multiline: "never" }]*/
class Foo{
  bar(){
    bar();
  }
  baz(){}
}

/* eslint lines-between-class-members: ["error", { singleline: "always" }]*/
class Foo{
  bar(){}

  baz(){}
}

/* eslint lines-between-class-members: ["error", { singleline: "never" }]*/
class Foo{
  bar(){}
  baz(){}
}
```
