# require or disallow an empty line between class members (lines-between-class-members)

This rule improves readability by enforcing lines between class members. It will not check empty lines before the first member and after the last member, since that is already taken care of by padded-blocks.

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

This rule has a string option and an object option.

String option:

* `"always"`(default) require an empty line after class members
* `"never"` disallows an empty line after class members

Object option:

* `"exceptAfterSingleLine": false`(default) **do not** skip checking empty lines after single-line class members
* `"exceptAfterSingleLine": true` skip checking empty lines after single-line class members

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

Examples of **correct** code for this rule with the object option:

```js
/* eslint lines-between-class-members: ["error", "always", { exceptAfterSingleLine: true }]*/
class Foo{
  bar(){} // single line class member
  baz(){
    // multi line class member
  }

  qux(){}
}
```

## When Not To Use It

If you don't want to enforce empty lines between class members, you can disable this rule.

## Related Rules

* [padded-blocks](padded-blocks.md)
* [padding-line-between-statements](padding-line-between-statements.md)

## Compatibility

* [requirePaddingNewLinesAfterBlocks](https://jscs-dev.github.io/rule/requirePaddingNewLinesAfterBlocks)
* [disallowPaddingNewLinesAfterBlocks](https://jscs-dev.github.io/rule/disallowPaddingNewLinesAfterBlocks)
