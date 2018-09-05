# Disallow a STYLE READ statement after any WRITE statement (layout-thrashing)

For each frame creation, browser has to undergo below steps

1. Javascript
2. Style
3. Layout
4. Paint
5. Composite

Above five steps is the default behaviour of the browser to create a frame.  Forcing the browser to change its behaviour surely takes extra time.

## Forced Reflow

If we are trying to read the style value of an element after writing something into the DOM.  The write operation may change the dimensions of element we are about to read. In order to provide accurate results of the read statement, the layout process is forced to happen for the write statement.  As we are forcing the Layout to happen within the JavaScript execution, this is referred as Forced Reflow or Forced Synchronous Layout

## Layout thrashing

If the Forced Reflow happens again and again in between the JavaScript execution, then it is Layout Thrashing.

## Rule Details

This rule is aimed at flagging any STYLE READ statements after a WRITE statement as error.

Examples of **incorrect** code for this rule:

```js
(1)
document.getElementById("id").appendChild(elem);
var dimensions = document.getElementById("id").getBoundingClientRect();

(2)
var maxLimit = 1000,
min = 0;
for(var i = 0; i < len; i++){
var dimensions = document.getElementById("id").children[i].getBoundingClientRect();
min += dimensions.width;
if(min < maxLimit){
document.getElementById("id"+i).appendChild(elem);
}
}
```

Examples of **correct** code for this rule:

```js
(1)
var dimensions = document.getElementById("id").getBoundingClientRect();
document.getElementById("id").appendChild(elem);

(2)
var dimensions = [],
maxLimit = 1000,
min = 0;
for(var i = 0; i < len; i++){
dimensions[i] = document.getElementById("id").children[i].getBoundingClientRect();
}
for(var i = 0; i < len; i++){
min += dimensions[i].width;
if(min < maxLimit){
document.getElementById("id"+i).appendChild(elem);
}
}
```

```json
{
    "rules": {
        "layout-thrashing": "error"
    }
}
```