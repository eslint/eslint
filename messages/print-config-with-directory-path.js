"use strict";

module.exports = function() {
    return `
The '--print-config' CLI option requires a path to a source code file rather than a directory.
See also: https://eslint.org/docs/use/command-line-interface#--print-config
`.trimStart();
};
