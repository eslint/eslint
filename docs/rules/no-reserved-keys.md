# Disallow Use of Reserved Words as Object Keys (no-reserved-keys)

Reserved words being used as property names is not allowed under ES3, however is allowed under ES5+.

## Rule Details

This rule will only check object literals. To check assignments use [`dot-notation`](dot-notation.md)

```js
var superman = {
    class: 'Superhero',
    private: 'Clark Kent'
};
```

## When not to use

When in a controlled environment like Node.js, where reserved words are allowed as keys. See further discussion [here](https://github.com/airbnb/javascript/issues/61).

## Further Reading

* [Support overview](http://kangax.github.io/compat-table/es5/#Reserved_words_as_property_names)
* [Reserved words as property names](http://kangax.github.io/compat-table/es5/#Reserved_words_as_property_names)
* [`ReservedWord`s under ES3 vs. ES5](https://github.com/jshint/jshint/issues/674)
