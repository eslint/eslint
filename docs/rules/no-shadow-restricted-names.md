# Disallow Shadowing of Restricted Names (no-shadow-restricted-names)

ES5 §15.1.1 Value Properties of the Global Object (`NaN`, `Infinity`, `undefined`) as well as strict mode restricted identifiers `eval` and `arguments` are considered to be restricted names in JavaScript. Defining them to mean something else can have unintended consequences and confuse others reading the code. For example, there's nothing prevent you from writing:

```js
var undefined = "foo";
```

Then any code used within the same scope would not get the global `undefined`, but rather the local version with a very different meaning.

## Rule Details

The following patterns are considered problems:

```js
/*eslint no-shadow-restricted-names: 2*/

function NaN(){}       /*error Shadowing of global property "NaN".*/

!function(Infinity){}; /*error Shadowing of global property "Infinity".*/

var undefined;         /*error Shadowing of global property "undefined".*/

try {} catch(eval){}   /*error Shadowing of global property "eval".*/
```

The following patterns are not considered problems:

```js
/*eslint no-shadow-restricted-names: 2*/

var Object;

function f(a, b){}
```

## Further Reading

* [Annotated ES5 - §15.1.1](http://es5.github.io/#x15.1.1)
* [Annotated ES5 - Annex C](http://es5.github.io/#C)
