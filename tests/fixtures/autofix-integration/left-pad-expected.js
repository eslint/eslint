/* eslint dot-notation: 2 */
/* eslint indent: [2, 2] */
/* eslint no-extra-parens: 2 */
/* eslint no-implicit-coercion: 2 */
/* eslint no-whitespace-before-property: 2 */
/* eslint quotes: [2, "single"] */
/* eslint semi: 2 */
/* eslint semi-spacing: 2 */
/* eslint space-before-function-paren: 2 */
/* eslint space-before-blocks: 1 */

/*
* left-pad@0.0.3
* WTFPL https://github.com/stevemao/left-pad/blob/aff6d744155a70b81f09effb8185a1564f348462/COPYING
*/

module.exports = leftpad;

function leftpad (str, len, ch) {
  str = String(str);

  var i = -1;

  ch || (ch = ' ');
  len = len - str.length;


  while (++i < len) {
    str = ch + str;
  }

  return str;
}
