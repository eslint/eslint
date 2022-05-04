/**
 * @fileoverview Data file for package information
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const fs = require("fs");
const path = require("path");

//-----------------------------------------------------------------------------
// Initialization
//-----------------------------------------------------------------------------

const pkgPath = path.resolve(__dirname, "../../../package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const { ESLINT_VERSION } = process.env;

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

/*
 * Because we want to differentiate between the development branch and the 
 * most recent release, we need a way to override the version. The
 * ESLINT_VERSION environment variable allows us to set this to override
 * the value displayed on the website. The most common case is we will set
 * this equal to "HEAD" for the version that is currently in development on
 * GitHub. Otherwise, we will use the version from package.json.
 */

module.exports = ESLINT_VERSION ?? pkg.version;
