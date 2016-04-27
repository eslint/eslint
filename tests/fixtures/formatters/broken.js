/*global module*/
var nonExistantFormatter = require('this-module-does-not-exist');
module.exports = function(results) {
    return nonExistantFormatter(results);
};
