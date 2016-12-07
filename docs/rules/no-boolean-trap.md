# disallow boolean trap (no-boolean-trap)

This rule disallows passing `Boolean` literals as arguments in function call expressions, a practice known as *boolean traps* or *flag arguments*

## Rule Details

This rule disallows use of boolean traps.

```js
// disallowed
volumeSlider.setValue(90, false);
volumeSlider.setValue.apply(null, [false]);
volumeSlider.setValue.call(null, 90, false);
const set90 = volumeSlider.setValue.bind(null, 90, false);

// allowed
const animateTransition = false;
volumeSlider.setValue(90, animateTransition);

// allowed
volumeSlider.setValue(90, { animation: false } );

// allowed
// create a function for each responsibility
volumeSlider.setValue(90);
// and
volumeSlider.animateSetValue(90);
```

## Options

None

## Further Reading

* [hall of api shame: boolean trap](https://ariya.io/2011/08/hall-of-api-shame-boolean-trap)
* [Clean Code, "Flag Arguments", p41](http://www.goodreads.com/book/show/3735293-clean-code)
