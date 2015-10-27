# Enforces spacing around commas (comma-spacing)

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

Spacing around commas improve readability of a list of items. Although most of the style guidelines for languages prescribe adding a space after a comma and not before it, it is subjective to the preferences of a project.

```js
var foo = 1, bar = 2;
var foo = 1 ,bar = 2;
```

## Rule Details

This rule aims to enforce spacing around a comma. As such, it warns whenever it sees a missing or unwanted space in commas of variable declaration, object property, function parameter, sequence and array element.


### Options

The rule takes one option, an object, which has two keys `before` and `after` having boolean values `true` or `false`. If `before` is `true`, space is enforced before commas and if it's `false`, space is disallowed before commas. If `after` is `true`, space is enforced after commas and if it's `false`, space is disallowed after commas. The default is `{"before": false, "after": true}`.

```json
    "comma-spacing": [2, {"before": false, "after": true}]
```

The following examples show two primary usages of this option.

#### {"before": false, "after": true}

This is the default option. It enforces spacing after commas and disallows spacing before commas.

The following patterns are considered problems:

```js
/*eslint comma-spacing: [2, {"before": false, "after": true}]*/

var foo = 1 ,bar = 2;                   /*error There should be no space before ','.*/ /*error A space is required after ','.*/
var arr = [1 , 2];                      /*error There should be no space before ','.*/
var obj = {"foo": "bar" ,"baz": "qur"}; /*error There should be no space before ','.*/ /*error A space is required after ','.*/
foo(a ,b);                              /*error There should be no space before ','.*/ /*error A space is required after ','.*/
new Foo(a ,b);                          /*error There should be no space before ','.*/ /*error A space is required after ','.*/
function foo(a ,b){}                    /*error There should be no space before ','.*/ /*error A space is required after ','.*/
a ,b                                    /*error There should be no space before ','.*/ /*error A space is required after ','.*/
```

The following patterns are not considered problems:

```js
/*eslint comma-spacing: [2, {"before": false, "after": true}]*/

var foo = 1, bar = 2
    , baz = 3;
var arr = [1, 2];
var obj = {"foo": "bar", "baz": "qur"};
foo(a, b);
new Foo(a, b);
function foo(a, b){}
a, b
```

#### {"before": true, "after": false}

This option enforces spacing before commas and disallows spacing after commas.

The following patterns are considered problems:

```js
/*eslint comma-spacing: [2, {"before": true, "after": false}]*/

var foo = 1, bar = 2;                   /*error A space is required before ','.*/ /*error There should be no space after ','.*/
var arr = [1 , 2];                      /*error There should be no space after ','.*/
var obj = {"foo": "bar", "baz": "qur"}; /*error A space is required before ','.*/ /*error There should be no space after ','.*/
new Foo(a,b);                           /*error A space is required before ','.*/
function foo(a,b){}                     /*error A space is required before ','.*/
a, b                                    /*error A space is required before ','.*/ /*error There should be no space after ','.*/
```

The following patterns are not considered problems:

```js
/*eslint comma-spacing: [2, {"before": true, "after": false}]*/

var foo = 1 ,bar = 2 ,
    baz = true;
var arr = [1 ,2];
var obj = {"foo": "bar" ,"baz": "qur"};
foo(a ,b);
new Foo(a ,b);
function foo(a ,b){}
a ,b
```

### Handling of `null` elements in `ArrayExpression` or `ArrayPattern`

If you have a `null` element within of an `ArrayExpression` or `ArrayPattern` this rule will not validate the spacing before the respective comma.

The following both examples are valid when the rule is configured with `{"before": false, "after": true}`.

```js
var items = [, 2, 3 ]
var items = [ , 2, 3 ]
```

This behavior avoids conflicts with the [`array-bracket-spacing`](array-bracket-spacing.md) rule.

## When Not To Use It

If your project will not be following a consistent comma-spacing pattern, turn this rule off.


## Further Reading

* [Javascript](http://javascript.crockford.com/code.html)
* [Dojo Style Guide](https://dojotoolkit.org/reference-guide/1.9/developer/styleguide.html)


## Related Rules

* [array-bracket-spacing](array-bracket-spacing.md)
* [comma-style](comma-style.md)
* [space-in-brackets](space-in-brackets.md) (deprecated)
* [space-in-parens](space-in-parens.md)
* [space-infix-ops](space-infix-ops.md)
* [space-after-keywords](space-after-keywords)
* [space-unary-ops](space-unary-ops)
* [space-return-throw-case](space-return-throw-case)
