/**
 * @fileoverview Build file
 * @author nzakas
 */
/*global cat, cd, cp, echo, exec, exit, find, mkdir, mv, pwd, rm, target, test*/

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

require("shelljs/make");

var path = require("path"),
    checker = require("npm-license"),
    dateformat = require("dateformat"),
    nodeCLI = require("shelljs-nodecli"),
    os = require("os"),
    semver = require("semver");

//------------------------------------------------------------------------------
// Settings
//------------------------------------------------------------------------------

/*
 * A little bit fuzzy. My computer has a first CPU speed of 3093 and the perf test
 * always completes in < 2000ms. However, Travis is less predictable due to
 * multiple different VM types. So I'm fudging this for now in the hopes that it
 * at least provides some sort of useful signal.
 */
var PERF_MULTIPLIER = 7.5e6;

var OPEN_SOURCE_LICENSES = [
    /MIT/, /BSD/, /Apache/, /ISC/, /WTF/, /Public Domain/
];

//------------------------------------------------------------------------------
// Data
//------------------------------------------------------------------------------

var NODE = "node ", // intentional extra space
    NODE_MODULES = "./node_modules/",
    TEMP_DIR = "./tmp/",
    BUILD_DIR = "./build/",
    DOCS_DIR = "../eslint.github.io/docs",

    // Utilities - intentional extra space at the end of each string
    MOCHA = NODE_MODULES + "mocha/bin/_mocha ",
    ESLINT = NODE + " bin/eslint.js ",

    // Files
    MAKEFILE = "./Makefile.js",
    /*eslint-disable no-use-before-define */
    JS_FILES = find("lib/").filter(fileType("js")).join(" "),
    JSON_FILES = find("conf/").filter(fileType("json")).join(" ") + " .eslintrc",
    TEST_FILES = find("tests/lib/").filter(fileType("js")).join(" ");
    /*eslint-enable no-use-before-define */

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Generates a function that matches files with a particular extension.
 * @param {string} extension The file extension (i.e. "js")
 * @returns {Function} The function to pass into a filter method.
 * @private
 */
function fileType(extension) {
    return function(filename) {
        return filename.substring(filename.lastIndexOf(".") + 1) === extension;
    };
}

/**
 * Generates a static file that includes each rule by name rather than dynamically
 * looking up based on directory. This is used for the browser version of ESLint.
 * @param {string} basedir The directory in which to look for code.
 * @returns {void}
 */
function generateRulesIndex(basedir) {
    var output = "module.exports = function() {\n";
    output += "    var rules = Object.create(null);\n";

    find(basedir + "rules/").filter(fileType("js")).forEach(function(filename) {
        var basename = path.basename(filename, ".js");
        output += "    rules[\"" + basename + "\"] = require(\"./rules/" + basename + "\");\n";
    });

    output += "\n    return rules;\n};";
    output.to(basedir + "load-rules.js");
}

/**
 * Creates a release version tag and pushes to origin.
 * @param {string} type The type of release to do (patch, minor, major)
 * @returns {void}
 */
function release(type) {
    target.test();
    exec("npm version " + type);
    target.changelog();
    exec("git push origin master --tags");
    exec("npm publish");
    target.gensite();
    target.publishsite();
}

/**
 * Executes a command and returns the output instead of printing it to stdout.
 * @param {string} cmd The command string to execute.
 * @returns {string} The result of the executed command.
 */
function execSilent(cmd) {
    return exec(cmd, { silent: true }).output;
}

/**
 * Splits a command result to separate lines.
 * @param {string} result The command result string.
 * @returns {array} The separated lines.
 */
function splitCommandResultToLines(result) {
    return result.trim().split("\n");
}

/**
 * Gets the first commit sha of the given file.
 * @param {string} filePath The file path which should be checked.
 * @returns {string} The commit sha.
 */
function getFirstCommitOfFile(filePath) {
    var commits = execSilent("git rev-list HEAD -- " + filePath);

    commits = splitCommandResultToLines(commits);
    return commits[commits.length - 1].trim();
}

/**
 * Gets the tag name where a given file was introduced first.
 * @param {string} filePath The file path to check.
 * @returns {string} The tag name.
 */
function getTagOfFirstOccurrence(filePath) {
    var firstCommit = getFirstCommitOfFile(filePath),
        tags = execSilent("git tag --contains " + firstCommit);

    tags = splitCommandResultToLines(tags);
    return tags.reduce(function(list, version) {
        version = semver.valid(version.trim());
        if (version) {
            list.push(version);
        }
        return list;
    }, []).sort(semver.compare)[0];
}

/**
 * Gets the version number where a given file was introduced first.
 * @param {string} filePath The file path to check.
 * @returns {string} The version number.
 */
function getFirstVersionOfFile(filePath) {
    return getTagOfFirstOccurrence(filePath);
}

//------------------------------------------------------------------------------
// Tasks
//------------------------------------------------------------------------------

target.all = function() {
    target.test();
};

target.lint = function() {
    var errors = 0,
        lastReturn;

    echo("Validating Makefile.js");
    lastReturn = exec(ESLINT + MAKEFILE);
    if (lastReturn.code !== 0) {
      errors++;
    }

    echo("Validating JSON Files");
    lastReturn = nodeCLI.exec("jsonlint", "-q -c", JSON_FILES);
    if (lastReturn.code !== 0) {
      errors++;
    }

    echo("Validating JavaScript files");
    lastReturn = exec(ESLINT + JS_FILES);
    if (lastReturn.code !== 0) {
      errors++;
    }

    echo("Validating JavaScript test files");
    lastReturn = exec(ESLINT + TEST_FILES);
    if (lastReturn.code !== 0) {
      errors++;
    }

    if (errors) {
        exit(1);
    }
};

target.test = function() {
    target.lint();
    target.checkRuleFiles();
    var errors = 0,
        lastReturn;

    // exec(ISTANBUL + " cover " + MOCHA + "-- -c " + TEST_FILES);
    lastReturn = nodeCLI.exec("istanbul", "cover", MOCHA, "-- -c", TEST_FILES);
    if (lastReturn.code !== 0) {
      errors++;
    }

    // exec(ISTANBUL + "check-coverage --statement 99 --branch 98 --function 99 --lines 99");
    lastReturn = nodeCLI.exec("istanbul", "check-coverage", "--statement 99 --branch 98 --function 99 --lines 99");
    if (lastReturn.code !== 0) {
      errors++;
    }

    target.browserify();

    lastReturn = nodeCLI.exec("mocha-phantomjs", "-R dot", "tests/tests.htm");
    if (lastReturn.code !== 0) {
      errors++;
    }

    if (errors) {
        exit(1);
    }

    target.checkLicenses();
};

target.docs = function() {
    echo("Generating documentation");
    nodeCLI.exec("jsdoc", "-d jsdoc lib");
    echo("Documentation has been output to /jsdoc");
};

target.gensite = function() {

    echo("Generating eslint.org");

    rm("-r", DOCS_DIR);
    mkdir(DOCS_DIR);
    cp("-rf", "docs/*", DOCS_DIR);

    find(DOCS_DIR).forEach(function(filename) {
        if (test("-f", filename)) {
            var rulesUrl = "https://github.com/eslint/eslint/tree/master/lib/rules/";
            var docsUrl = "https://github.com/eslint/eslint/tree/master/docs/rules/";

            var text = cat(filename);

            var baseName = path.basename(filename);
            var sourceBaseName = path.basename(filename, ".md") + ".js";

            text = "---\ntitle: ESLint\nlayout: doc\n---\n<!-- Note: No pull requests accepted for this file. See README.md in the root directory for details. -->\n" + text;

            text = text.replace(/\.md(.*)\)/g, ".html$1").replace("README.html", "index.html");

            if (filename.indexOf("rules/") !== -1 && baseName !== "README.md") {
                var version = getFirstVersionOfFile(path.join("lib/rules", sourceBaseName));

                if (version) {
                    text += "\n## Version\n\n";
                    text += "This rule was introduced in ESLint " + version + ".\n";
                }

                text += "\n## Resources\n\n";
                text += "* [Rule source](" + rulesUrl + sourceBaseName + ")\n";
                text += "* [Documentation source](" + docsUrl + baseName + ")\n";
            }

            text.to(filename.replace("README.md", "index.md"));
        }
    });
};

target.publishsite = function() {
    var currentDir = pwd();

    cd(DOCS_DIR);
    exec("git add -A .");
    exec("git commit -m \"Autogenerated new docs at " + dateformat(new Date()) + "\"");
    exec("git fetch origin && git rebase origin/master");
    exec("git push origin master");
    cd(currentDir);
};

target.browserify = function() {

    // 1. create temp and build directory
    if (!test("-d", TEMP_DIR)) {
        mkdir(TEMP_DIR);
    }

    if (!test("-d", BUILD_DIR)) {
        mkdir(BUILD_DIR);
    }

    // 2. copy files into temp directory
    cp("-r", "lib/*", TEMP_DIR);

    // 3. delete the load-rules.js file
    rm(TEMP_DIR + "load-rules.js");

    // 4. create new load-rule.js with hardcoded requires
    generateRulesIndex(TEMP_DIR);

    // 5. browserify the temp directory
    nodeCLI.exec("browserify", TEMP_DIR + "eslint.js", "-o", BUILD_DIR + "eslint.js", "-s eslint");
    // exec(BROWSERIFY + TEMP_DIR + "eslint.js -o " + BUILD_DIR + "eslint.js -s eslint");

    // 6. remove temp directory
    rm("-r", TEMP_DIR);
};

target.changelog = function() {

    // get most recent two tags
    var tags = exec("git tag", { silent: true }).output.trim().split(/\s/g),
        rangeTags = tags.slice(tags.length - 2),
        now = new Date(),
        timestamp = dateformat(now, "mmmm d, yyyy");

    // output header
    (rangeTags[1] + " - " + timestamp + "\n").to("CHANGELOG.tmp");

    // get log statements
    var logs = exec("git log --pretty=format:\"* %s (%an)\" " + rangeTags.join(".."), {silent: true}).output.split(/\n/g);
    logs = logs.filter(function(line) {
        return line.indexOf("Merge pull request") === -1 && line.indexOf("Merge branch") === -1;
    });
    logs.push(""); // to create empty lines
    logs.unshift("");

    // output log statements
    logs.join("\n").toEnd("CHANGELOG.tmp");

    // switch-o change-o
    cat("CHANGELOG.tmp", "CHANGELOG.md").to("CHANGELOG.md.tmp");
    rm("CHANGELOG.tmp");
    rm("CHANGELOG.md");
    mv("CHANGELOG.md.tmp", "CHANGELOG.md");

    // add into commit
    exec("git add CHANGELOG.md");
    exec("git commit --amend --no-edit");

};

target.checkRuleFiles = function() {

    echo("Validating rules");

    var eslintConf = require("./conf/eslint.json");
    var environmentsConf = require("./conf/environments.json");

    var confRules = {};
    confRules["default"] = eslintConf.rules;
    Object.keys(environmentsConf).forEach(function (env) {
        confRules[env] = environmentsConf[env].rules;
    });

    var ruleFiles = find("lib/rules/").filter(fileType("js")),
        rulesIndexText = cat("docs/rules/README.md"),
        errors = 0;

    ruleFiles.forEach(function(filename) {
        var basename = path.basename(filename, ".js");
        var docFilename = "docs/rules/" + basename + ".md";

        var indexLine = new RegExp("\\* \\[" + basename + "\\].*").exec(rulesIndexText);
        indexLine = indexLine ? indexLine[0] : "";


        function isInConfig(env) {
            return confRules[env] && confRules[env].hasOwnProperty(basename);
        }

        function isOffInConfig(env) {
            var envRule = confRules[env][basename];
            return envRule === 0 || (envRule && envRule[0] === 0);
        }

        function isOnInConfig(env) {
            return !isOffInConfig(env);
        }

        function isOffInIndex(env) {
            if (env === "default") {
                return indexLine.indexOf("(off by default)") !== -1;
            } else {
                return indexLine.indexOf("(off by default in the " + env + " environment)") !== -1;
            }
        }

        function isOnInIndex(env) {
            if (env === "default") {
                return indexLine.indexOf("(off by default)") === -1;
            } else {
                return indexLine.indexOf("(on by default in the " + env + " environment)") !== -1;
            }
        }

        function hasIdInTitle(basename) {
            var docText = cat(docFilename);
            var idInTitleRegExp = new RegExp("^# (.*?) \\(" + basename + "\\)");
            return idInTitleRegExp.test(docText);
        }

        // check for docs
        if (!test("-f", docFilename)) {
            console.error("Missing documentation for rule %s", basename);
            errors++;
        } else {

            // check for entry in docs index
            if (rulesIndexText.indexOf("(" + basename + ".md)") === -1) {
                console.error("Missing link to documentation for rule %s in index", basename);
                errors++;
            }

            // check for proper doc format
            if (!hasIdInTitle(basename)) {
                console.error("Missing id in the doc page's title of rule %s", basename);
                errors++;
            }
        }

        // check for default configuration
        if (!isInConfig("default")) {
            console.error("Missing default setting for %s in eslint.json", basename);
            errors++;
        }

        // check that rule is not on in docs but off in default config
        if (isOnInIndex("default") && isOffInConfig("default")) {
            console.error("Missing '(off by default)' for rule %s in index", basename);
            errors++;
        }

        // check that rule is not off in docs but on in default config
        if (isOffInIndex("default") && isOnInConfig("default")) {
            console.error("Rule documentation says that %s is off by default but it is enabled in eslint.json.", basename);
            errors++;
        }

        // check rule config for each environment
        Object.keys(confRules).forEach(function (env) {
            if (env === "default") {
                return;
            }

            // only check if rule has been explicitly set for environment
            if (isInConfig(env)) {

                // check that rule is not on in docs but off in environment config
                if (isOnInIndex(env)) {
                    if (isOffInConfig(env)) {
                        console.error("Rule documentation says that %s is off in environment %s but it is enabled in eslint.json.", basename, env);
                        errors++;
                    }

                // check that rule is not off in docs but on in default config
                } else if (isOffInIndex(env)) {
                    if (isOnInConfig(env)) {
                        console.error("Rule documentation says that %s is on in environment %s but it is disabled in eslint.json.", basename, env);
                        errors++;
                    }

                // rule has been overridden in environment but is not in docs
                } else {
                    console.error("Missing '(%s by default in the %s environment)' for rule %s in index", isOnInConfig(env) ? "on" : "off", env, basename);
                    errors++;
                }

            }
        });

        // check for tests
        if (!test("-f", "tests/lib/rules/" + basename + ".js")) {
            console.error("Missing tests for rule %s", basename);
            errors++;
        }

    });

    if (errors) {
        exit(1);
    }

};

target.checkLicenses = function() {

    function isPermissible(dependency) {
        var licenses = dependency.licenses;

        if (Array.isArray(licenses)) {
            return licenses.some(function(license) {
                return isPermissible({
                    name: dependency.name,
                    licenses: license
                });
            });
        }

        return OPEN_SOURCE_LICENSES.some(function(license) {
            return license.test(licenses);
        });
    }

    echo("Validating licenses");

    checker.init({
        start: __dirname
    }, function(deps) {
        var impermissible = Object.keys(deps).map(function(dependency) {
            return {
                name: dependency,
                licenses: deps[dependency].licenses
            };
        }).filter(function(dependency) {
            return !isPermissible(dependency);
        });

        if (impermissible.length) {
            impermissible.forEach(function (dependency) {
                console.error("%s license for %s is impermissible.",
                    dependency.licenses,
                    dependency.name
                );
            });
            exit(1);
        }
    });
};

function time(cmd, runs, runNumber, results, cb) {
    var start = process.hrtime();
    exec(cmd, { silent: true }, function() {
        var diff = process.hrtime(start),
            actual = (diff[0] * 1e3 + diff[1] / 1e6); // ms

        results.push(actual);
        echo("Performance Run #" + runNumber + ":  %dms", actual);
        if (runs > 1) {
            time(cmd, runs - 1, runNumber + 1, results, cb);
        } else {
            cb(results);
        }
    });

}

target.perf = function() {
    var cpuSpeed = os.cpus()[0].speed,
        max = PERF_MULTIPLIER / cpuSpeed,
        cmd = ESLINT + "./tests/performance/jshint.js";

    echo("CPU Speed is %d with multiplier %d", cpuSpeed, PERF_MULTIPLIER);

    time(cmd, 5, 1, [], function(results) {
        results.sort(function(a, b) {
            return a - b;
        });

        var median = results[~~(results.length / 2)];

        if (median > max) {
            echo("Performance budget exceeded: %dms (limit: %dms)", median, max);
            exit(1);
        } else {
            echo("Performance budget ok:  %dms (limit: %dms)", median, max);
        }
    });

};

target.patch = function() {
    release("patch");
};

target.minor = function() {
    release("minor");
};

target.major = function() {
    release("major");
};
