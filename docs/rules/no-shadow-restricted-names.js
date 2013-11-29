# no shadow restricted names

Disallow shadowing of ES5 §15.1.1 Value Properties of the Global Object (`NaN`,
`Infinity`, `undefined`) as well as strict mode restricted identifiers `eval`
and `arguments`.

## Rule Details

The following patterns are considered warnings:

```js
function NaN(){}
```

```js
!funtion(Infinity){};
```

```js
var undefined;
```

```js
try {} catch(eval){}
```

The following patterns are not considered warnings:

```js
var Object;
```

```js
function f(a, b){}
```

## Further Reading

* [Annotated ES5 - §15.1.1](http://es5.github.io/#x15.1.1)
* [Annotated ES5 - Annex C](http://es5.github.io/#C)
