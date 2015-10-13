/**
 * @fileoverview Converts YAML file into JSON.
 * @author Nicholas C. Zakas
 * @copyright 2015 Nicholas C. Zakas. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var fs = require("fs"),
    yaml = require("js-yaml");

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = (function() {

    var filePath = "./default.yml";

    try {
        return yaml.safeLoad(fs.readFileSync(filePath, "utf8")) || {};
    } catch (e) {
        console.error("Error reading YAML file: " + filePath);
        e.message = "Cannot read config file: " + filePath + "\nError: " + e.message;
        throw e;
    }

}());
