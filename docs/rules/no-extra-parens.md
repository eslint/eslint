# Disallow Extra Parens (no-extra-parens)

This rule restricts the use of parentheses to only where they are necessary. It may be restricted to report only function expressions. It can also be configured to allow parentheses around JSX elements.

## Rule Details

### Exceptions

A few cases of redundant parentheses are always allowed:

* RegExp literals: `(/abc/).test(var)` is always valid.
* IIFEs: `var x = (function () {})();`, `((function foo() {return 1;})())` are always valid.

### Options

The default behavior of the rule is specified by `"all"` and it will report unnecessary parentheses around any expression. The following patterns are considered problems:

```js
/*eslint no-extra-parens: 2*/

a = (b * c); /*error Gratuitous parentheses around expression.*/

(a * b) + c; /*error Gratuitous parentheses around expression.*/

typeof (a);  /*error Gratuitous parentheses around expression.*/
```

The following patterns are not considered problems:

```js
/*eslint no-extra-parens: 2*/

(0).toString();

({}.toString.call());

(function(){} ? a() : b())

(/^a$/).test(x);
```

If the option is set to `"functions"`, only function expressions will be checked for unnecessary parentheses. The following patterns are considered problems:

```js
/*eslint no-extra-parens: [2, "functions"]*/

((function foo() {}))();           /*error Gratuitous parentheses around expression.*/

var y = (function () {return 1;}); /*error Gratuitous parentheses around expression.*/
```

The following patterns are not considered problems:

```js
/*eslint no-extra-parens: [2, "functions"]*/

(0).toString();

({}.toString.call());

(function(){} ? a() : b());

(/^a$/).test(x);

a = (b * c);

(a * b) + c;

typeof (a);
```

#### JSX

The second, optional configuration parameter for the rule is an exceptions object. There is one configurable exception for JSX elements, with possible values `"never"`, `"all"`, or `"multiline"`.

By default, the rule will warn about parentheses around JSX elements:

```jsx
/*eslint no-extra-parens: [2, "all"]*/

var app = (<App />); /*error Gratuitous parentheses around expression.*/
```

This is equivalent to explicitly setting the JSX exception to `"never"`:

```jsx
/*eslint no-extra-parens: [2, "all", { "jsx": "never" }]*/

var app = (<App />); /*error Gratuitous parentheses around expression.*/
```

If those parentheses are considered acceptable, set the JSX exception to `"all"` to allow parentheses around all JSX elements:

```jsx
/*eslint no-extra-parens: [2, "all", { "jsx": "all" }]*/

var app = (<App />);
```

Set the JSX exception `"multiline"` to allow parentheses only around JSX elements that span multiple lines:

```jsx
/*eslint no-extra-parens: [2, "all", { "jsx": "multiline" }]*/

var app = (
    <App>
        Hello, world!
    </App>
);
```

The JSX `"multiline"` exception mode will still warn about parentheses around JSX elements that do not span more than one line:

```jsx
/*eslint no-extra-parens: [2, "all", { "jsx": "multiline" }]*/

var app = (<App>Hello world</App>); /*error Gratuitous parentheses around expression.*/
```

## Further Reading

* [MDN: Operator Precedence](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)
