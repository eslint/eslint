# require or disallow an empty line after after class members (lines-between-class-members)

This rule improves readability by enforcing lines between class members. it will not check empty lines before the first member and after the last member, since that is already taken care of by padded-blocks.

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

* `"always"`(default) require an empty line after after class members
* `"never"` disallows an empty line after after class members

Object option:

* `"multiline": "always"` require an empty line after after multiline class members
* `"multiline": "never"` disallows an empty line after after multiline class members
* `"singleline": "always"` require an empty line after after singleline class members
* `"singleline": "never"` disallows an empty line after after singleline class members

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
