# Disallow Use of Reserved Words as Keys (no-resv-key)

Reserved words being used as keys can cause problems in (IE8)[http://kangax.github.io/compat-table/es5/#Reserved_words_as_property_names], therefore one might disallow their use as keys.

## Rule Details

The rule will check both object definitions and assignments. The following will generate warnings:

```js
var superman = {
    class: 'Superhero',
    private: 'Clark Kent'
};

superman['default'] = 'Is it a bird? ...';
```

## When not to use

When in a controlled environment like Node.js, where reserved words are allowed as keys. See further discussion [here](https://github.com/airbnb/javascript/issues/61). 

## Further Reading

* [Reserved words as property names](http://kangax.github.io/compat-table/es5/#Reserved_words_as_property_names)
