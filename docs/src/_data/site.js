/**
 * @fileoverview Convenience helper for site data.
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const path = require("path");
const fs = require("fs");
const yaml = require("js-yaml");

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

module.exports = function(eleventy) {
   
    const siteName = eleventy.site_name;
    const siteDataFile = path.resolve(__dirname, `sites/${siteName}.yml`);

    fs.statSync(siteDataFile);

    return yaml.load(fs.readFileSync(siteDataFile));
}
