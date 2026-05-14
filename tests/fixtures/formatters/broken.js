/*global module*/
var nonExistentFormatter = require('this-module-does-not-exist');
module.exports = function(results) {
    return nonExistentFormatter(results);
};
