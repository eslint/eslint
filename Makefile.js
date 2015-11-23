/**
 * @fileoverview Build file
 * @author nzakas
 */
/* global cat, cd, cp, echo, exec, exit, find, ls, mkdir, mv, pwd, rm, target, test*/

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

require("shelljs/make");

var checker = require("npm-license"),
    dateformat = require("dateformat"),
    fs = require("fs"),
    markdownlint = require("markdownlint"),
    nodeCLI = require("shelljs-nodecli"),
    os = require("os"),
    path = require("path"),
    semver = require("semver"),
    ejs = require("ejs"),
    loadPerf = require("load-perf");

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
    SITE_DIR = "../eslint.github.io/",

    // Utilities - intentional extra space at the end of each string
    MOCHA = NODE_MODULES + "mocha/bin/_mocha ",
    ESLINT = NODE + " bin/eslint.js ",

    // Files
    MAKEFILE = "./Makefile.js",
    PACKAGE = "./package.json",
    /* eslint-disable no-use-before-define */
    JS_FILES = find("lib/").filter(fileType("js")).join(" "),
    JSON_FILES = find("conf/").filter(fileType("json")).join(" ") + " .eslintrc",
    MARKDOWN_FILES_ARRAY = find("docs/").concat(ls(".")).filter(fileType("md")),
    TEST_FILES = find("tests/lib/").filter(fileType("js")).join(" "),
    /* eslint-enable no-use-before-define */

    // Regex
    TAG_REGEX = /^(?:Fix|Update|Breaking|Docs|Build|New|Upgrade):/,
    ISSUE_REGEX = /\((?:fixes|refs) #\d+(?:.*(?:fixes|refs) #\d+)*\)$/,

    // Settings
    MOCHA_TIMEOUT = 4000;

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
 * Returns package.json contents as a JavaScript object
 * @returns {Object} Contents of package.json for the project
 * @private
 */
function getPackageInfo() {
    return JSON.parse(fs.readFileSync(PACKAGE));
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
 * Executes a command and returns the output instead of printing it to stdout.
 * @param {string} cmd The command string to execute.
 * @returns {string} The result of the executed command.
 */
function execSilent(cmd) {
    return exec(cmd, { silent: true }).output;
}

/**
 * Generates a release blog post for eslint.org
 * @param {Object} releaseInfo The release metadata.
 * @returns {void}
 * @private
 */
function generateBlogPost(releaseInfo) {
    var output = ejs.render(cat("./templates/blogpost.md.ejs"), releaseInfo),
        now = new Date(),
        month = now.getMonth() + 1,
        day = now.getDate(),
        filename = "../eslint.github.io/_posts/" + now.getFullYear() + "-" +
            (month < 10 ? "0" + month : month) + "-" +
            (day < 10 ? "0" + day : day) + "-eslint-" + releaseInfo.version +
            "-released.md";

    output.to(filename);
}

/**
 * Generates a doc page with formatter result examples
 * @param  {Object} formatterInfo Linting results from each formatter
 * @returns {void}
 */
function generateFormatterExamples(formatterInfo) {
    var output = ejs.render(cat("./templates/formatter-examples.md.ejs"), formatterInfo),
        filename = "../eslint.github.io/docs/user-guide/formatters/index.md",
        htmlFilename = "../eslint.github.io/docs/user-guide/formatters/html-formatter-example.html";

    output.to(filename);
    formatterInfo.formatterResults.html.result.to(htmlFilename);
}

/**
 * Given a semver version, determine the type of version.
 * @param {string} version A semver version string.
 * @returns {string} The type of version.
 * @private
 */
function getReleaseType(version) {

    if (semver.patch(version) > 0) {
        return "patch";
    } else if (semver.minor(version) > 0) {
        return "minor";
    } else {
        return "major";
    }
}

/**
 * Creates a release version tag and pushes to origin.
 * @param {string} type The type of release to do (patch, minor, major)
 * @returns {void}
 */
function release(type) {
    var newVersion;/* , changes;*/

    exec("git checkout master && git fetch origin && git reset --hard origin/master");
    exec("npm install && npm prune");

    target.test();
    echo("Generating new version");
    newVersion = execSilent("npm version " + type).trim();

    echo("Generating changelog");
    var releaseInfo = target.changelog();

    // add changelog to commit
    exec("git add CHANGELOG.md");
    exec("git commit --amend --no-edit");

    // replace existing tag
    exec("git tag -f " + newVersion);

    // push all the things
    echo("Publishing to git");
    exec("git push origin master --tags");

    // now push the changelog...changes to the tag
    // echo("Publishing changes to github release");
    // this requires a github API token in process.env.ESLINT_GITHUB_TOKEN
    // it will continue with an error message logged if not set
    // ghGot("repos/eslint/eslint/releases", {
    //     body: JSON.stringify({
    //         tag_name: newVersion,
    //         name: newVersion,
    //         target_commitish: "master",
    //         body: changes
    //     }),
    //     method: "POST",
    //     json: true,
    //     token: process.env.ESLINT_GITHUB_TOKEN
    // }, function(pubErr) {
    //     if (pubErr) {
    //         echo("Warning: error when publishing changes to github release: " + pubErr.message);
    //     }
    echo("Publishing to npm");
    getPackageInfo().files.filter(function(dirPath) {
        return fs.lstatSync(dirPath).isDirectory();
    }).forEach(nodeCLI.exec.bind(nodeCLI, "linefix"));
    exec("npm publish");
    exec("git reset --hard");

    echo("Generating site");
    target.gensite();
    generateBlogPost(releaseInfo);
    target.publishsite();
    // });
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

/**
 * Gets the commit that deleted a file.
 * @param {string} filePath The path to the deleted file.
 * @returns {string} The commit sha.
 */
function getCommitDeletingFile(filePath) {
    var commits = execSilent("git rev-list HEAD -- " + filePath);

    return splitCommandResultToLines(commits)[0];
}

/**
 * Gets the first version number where a given file is no longer present.
 * @param {string} filePath The path to the deleted file.
 * @returns {string} The version number.
 */
function getFirstVersionOfDeletion(filePath) {
    var deletionCommit = getCommitDeletingFile(filePath),
        tags = execSilent("git tag --contains " + deletionCommit);

    return splitCommandResultToLines(tags)
        .map(function(version) {
            return semver.valid(version.trim());
        })
        .filter(function(version) {
            return version;
        })
        .sort(semver.compare)[0];
}


/**
 * Returns the version tags
 * @returns {string[]} Tags
 * @private
 */
function getVersionTags() {
    var tags = splitCommandResultToLines(execSilent("git tag"));

    return tags.reduce(function(list, tag) {
        if (semver.valid(tag)) {
            list.push(tag);
        }
        return list;
    }, []).sort(semver.compare);
}

/**
 * Returns all the branch names
 * @returns {string[]} branch names
 * @private
 */
function getBranches() {
    var branchesRaw = splitCommandResultToLines(execSilent("git branch --list")),
        branches = [],
        branchName;

    for (var i = 0; i < branchesRaw.length; i++) {
        branchName = branchesRaw[i].replace(/^\*(.*)/, "$1").trim();
        branches.push(branchName);
    }
    return branches;
}

/**
 * Lints Markdown files.
 * @param {array} files Array of file names to lint.
 * @returns {object} exec-style exit code object.
 * @private
 */
function lintMarkdown(files) {
    var config = {
            default: true,
            // Exclusions for deliberate/widespread violations
            MD001: false, // Header levels should only increment by one level at a time
            MD002: false, // First header should be a h1 header
            MD007: {      // Unordered list indentation
                indent: 4
            },
            MD012: false, // Multiple consecutive blank lines
            MD013: false, // Line length
            MD014: false, // Dollar signs used before commands without showing output
            MD019: false, // Multiple spaces after hash on atx style header
            MD021: false, // Multiple spaces inside hashes on closed atx style header
            MD024: false, // Multiple headers with the same content
            MD026: false, // Trailing punctuation in header
            MD029: false, // Ordered list item prefix
            MD030: false, // Spaces after list markers
            MD034: false, // Bare URL used
            MD040: false, // Fenced code blocks should have a language specified
            MD041: false  // First line in file should be a top level header
        },
        result = markdownlint.sync({
            files: files,
            config: config
        }),
        resultString = result.toString(),
        returnCode = resultString ? 1 : 0;
    if (resultString) {
        console.error(resultString);
    }
    return { code: returnCode };
}

/**
 * Check if the branch name is valid
 * @param {string} branchName Branch name to check
 * @returns {boolean} true is branch exists
 * @private
 */
function hasBranch(branchName) {
    var branches = getBranches();
    return branches.indexOf(branchName) !== -1;
}

/**
 * Gets linting results from every formatter, based on a hard-coded snippet and config
 * @returns {Object} Output from each formatter
 */
function getFormatterResults() {
    var CLIEngine = require("./lib/cli-engine"),
        chalk = require("chalk");

    var formatterFiles = fs.readdirSync("./lib/formatters/"),
        cli = new CLIEngine({
            useEslintrc: false,
            baseConfig: { "extends": "eslint:recommended" },
            rules: {
                "no-else-return": 1,
                "indent": [1, 4],
                "space-unary-ops": 2,
                "semi": [1, "always"],
                "consistent-return": 2
            }
        }),
        codeString = [
            "function addOne(i) {",
            "    if (i != NaN) {",
            "        return i ++",
            "    } else {",
            "      return",
            "    }",
            "};"
        ].join("\n"),
        rawMessages = cli.executeOnText(codeString, "fullOfProblems.js");

    return formatterFiles.reduce(function(data, filename) {
        var fileExt = path.extname(filename),
            name = path.basename(filename, fileExt);
        if (fileExt === ".js") {
            data.formatterResults[name] = {
                result: chalk.stripColor(cli.getFormatter(name)(rawMessages.results))
            };
        }
        return data;
    }, { formatterResults: {} });
}

//------------------------------------------------------------------------------
// Tasks
//------------------------------------------------------------------------------

target.all = function() {
    target.test();
};

target.lint = function() {
    var errors = 0,
        makeFileCache = " ",
        jsCache = " ",
        testCache = " ",
        lastReturn;

    // using the cache locally to speed up linting process
    if (!process.env.TRAVIS) {
        makeFileCache = " --cache --cache-file .cache/makefile_cache ";
        jsCache = " --cache --cache-file .cache/js_cache ";
        testCache = " --cache --cache-file .cache/test_cache ";
    }

    echo("Validating Makefile.js");
    lastReturn = exec(ESLINT + makeFileCache + MAKEFILE);
    if (lastReturn.code !== 0) {
        errors++;
    }

    echo("Validating JSON Files");
    lastReturn = nodeCLI.exec("jsonlint", "-q -c", JSON_FILES);
    if (lastReturn.code !== 0) {
        errors++;
    }

    echo("Validating Markdown Files");
    lastReturn = lintMarkdown(MARKDOWN_FILES_ARRAY);
    if (lastReturn.code !== 0) {
        errors++;
    }

    echo("Validating JavaScript files");
    lastReturn = exec(ESLINT + jsCache + JS_FILES);
    if (lastReturn.code !== 0) {
        errors++;
    }

    echo("Validating JavaScript test files");
    lastReturn = exec(ESLINT + testCache + TEST_FILES);
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
    lastReturn = nodeCLI.exec("istanbul", "cover", MOCHA, "-- -R progress -t " + MOCHA_TIMEOUT, "-c", TEST_FILES);
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

    var docFiles = [
        "/rules/",
        "/user-guide/command-line-interface.md",
        "/user-guide/configuring.md",
        "/developer-guide/nodejs-api.md",
        "/developer-guide/working-with-plugins.md",
        "/developer-guide/working-with-rules.md"
    ];

    // 1. create temp and build directory
    if (!test("-d", TEMP_DIR)) {
        mkdir(TEMP_DIR);
    }

    // 2. remove old files from the site
    docFiles.forEach(function(filePath) {
        var fullPath = path.join(DOCS_DIR, filePath),
            htmlFullPath = fullPath.replace(".md", ".html");

        if (test("-f", fullPath)) {

            rm("-r", fullPath);

            if (filePath.indexOf(".md") >= 0 && test("-f", htmlFullPath)) {
                rm("-r", htmlFullPath);
            }
        }
    });

    // 3. Copy docs folder to a temporary directory
    cp("-rf", "docs/*", TEMP_DIR);

    var versions = test("-f", "./versions.json") ? JSON.parse(cat("./versions.json")) : {};
    if (!versions.added) {
        versions = {
            added: versions,
            removed: {}
        };
    }

    // 4. Loop through all files in temporary directory
    find(TEMP_DIR).forEach(function(filename) {
        if (test("-f", filename) && path.extname(filename) !== "") {

            var rulesUrl = "https://github.com/eslint/eslint/tree/master/lib/rules/";
            var docsUrl = "https://github.com/eslint/eslint/tree/master/docs/rules/";

            var text = cat(filename);

            var baseName = path.basename(filename);
            var sourceBaseName = path.basename(filename, ".md") + ".js";
            var sourcePath = path.join("lib/rules", sourceBaseName);
            var ruleName = path.basename(filename, ".md");

            // 5. Prepend page title and layout variables at the top of rules
            if (path.dirname(filename).indexOf("rules") >= 0) {
                text = "---\ntitle: " + (ruleName === "README" ? "List of available rules" : "Rule " + ruleName) + "\nlayout: doc\n---\n<!-- Note: No pull requests accepted for this file. See README.md in the root directory for details. -->\n" + text;
            } else {
                text = "---\ntitle: Documentation\nlayout: doc\n---\n<!-- Note: No pull requests accepted for this file. See README.md in the root directory for details. -->\n" + text;
            }

            // 6. Remove .md extension for links and change README to empty string
            text = text.replace(/\.md(.*?\))/g, ")").replace("README.html", "");

            // 7. Check if there's a trailing white line at the end of the file, if there isn't one, add it
            if (!/\n$/.test(text)) {
                text = text + "\n";
            }

            // 8. Append first version of ESLint rule was added at.
            if (filename.indexOf("rules/") !== -1 && baseName !== "README.md") {
                var added, removed;

                if (!versions.added[baseName]) {
                    versions.added[baseName] = getFirstVersionOfFile(sourcePath);
                }
                added = versions.added[baseName];

                if (!versions.removed[baseName] && !fs.existsSync(sourcePath)) {
                    versions.removed[baseName] = getFirstVersionOfDeletion(sourcePath);
                }
                removed = versions.removed[baseName];

                text += "\n## Version\n\n";
                text += removed
                    ? "This rule was introduced in ESLint " + added + " and removed in " + removed + ".\n"
                    : "This rule was introduced in ESLint " + added + ".\n";

                text += "\n## Resources\n\n";
                if (!removed) {
                    text += "* [Rule source](" + rulesUrl + sourceBaseName + ")\n";
                }
                text += "* [Documentation source](" + docsUrl + baseName + ")\n";
            }

            // 9. Update content of the file with changes
            text.to(filename.replace("README.md", "index.md"));
        }
    });
    JSON.stringify(versions).to("./versions.json");

    // 10. Copy temorary directory to site's docs folder
    cp("-rf", TEMP_DIR + "*", DOCS_DIR);

    // 11. Delete temporary directory
    rm("-r", TEMP_DIR);

    // 12. Browserify ESLint
    target.browserify();
    cp("-f", "build/eslint.js", SITE_DIR + "js/app/eslint.js");
    cp("-f", "conf/eslint.json", SITE_DIR + "js/app/eslint.json");

    // 13. Create Example Formatter Output Page
    generateFormatterExamples(getFormatterResults());
};

target.publishsite = function() {
    var currentDir = pwd();

    cd(SITE_DIR);
    exec("git add -A .");
    exec("git commit -m \"Autogenerated new docs and demo at " + dateformat(new Date()) + "\"");
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
    nodeCLI.exec("browserify", "-x espree", TEMP_DIR + "eslint.js", "-o", BUILD_DIR + "eslint.js", "-s eslint");

    // 6. Browserify espree
    nodeCLI.exec("browserify", "-r espree", "-o", TEMP_DIR + "espree.js");

    // 7. Concatenate the two files together
    cat(TEMP_DIR + "espree.js", BUILD_DIR + "eslint.js").to(BUILD_DIR + "eslint.js");

    // 8. remove temp directory
    rm("-r", TEMP_DIR);
};

target.changelog = function() {

    // get most recent two tags
    var tags = getVersionTags(),
        rangeTags = tags.slice(tags.length - 2),
        now = new Date(),
        timestamp = dateformat(now, "mmmm d, yyyy"),
        releaseInfo = {
            releaseType: getReleaseType(rangeTags[1]),
            version: rangeTags[1]
        };

    // output header
    (rangeTags[1] + " - " + timestamp + "\n").to("CHANGELOG.tmp");

    // get log statements
    var logs = execSilent("git log --no-merges --pretty=format:\"* %s (%an)\" " + rangeTags.join("..")).split(/\n/g);
    logs.shift();   // get rid of version commit
    logs.forEach(function(log) {
        var tag = log.substring(2, log.indexOf(":")).toLowerCase();

        if (!releaseInfo["changelog_" + tag]) {
            releaseInfo["changelog_" + tag] = [];
        }

        releaseInfo["changelog_" + tag].push(log);
    });

    var output = logs.join("\n"); // and join it into a string
    releaseInfo.raw = output;

    logs.push(""); // to create empty lines
    logs.unshift("");

    // output log statements
    logs.join("\n").toEnd("CHANGELOG.tmp");

    // switch-o change-o
    cat("CHANGELOG.tmp", "CHANGELOG.md").to("CHANGELOG.md.tmp");
    rm("CHANGELOG.tmp");
    rm("CHANGELOG.md");
    mv("CHANGELOG.md.tmp", "CHANGELOG.md");

    return releaseInfo;
};

target.checkRuleFiles = function() {

    echo("Validating rules");

    var eslintConf = require("./conf/eslint.json").rules;

    var ruleFiles = find("lib/rules/").filter(fileType("js")),
        rulesIndexText = cat("docs/rules/README.md"),
        errors = 0;

    ruleFiles.forEach(function(filename) {
        var basename = path.basename(filename, ".js");
        var docFilename = "docs/rules/" + basename + ".md";

        var indexLine = new RegExp("\\* \\[" + basename + "\\].*").exec(rulesIndexText);
        indexLine = indexLine ? indexLine[0] : "";

        /**
         * Check if basename is present in eslint conf
         * @returns {boolean} true if present
         * @private
         */
        function isInConfig() {
            return eslintConf.hasOwnProperty(basename);
        }

        /**
         * Check if rule is off in eslint conf
         * @returns {boolean} true if off
         * @private
         */
        function isOffInConfig() {
            var rule = eslintConf[basename];
            return rule === 0 || (rule && rule[0] === 0);
        }

        /**
         * Check if rule is on in eslint conf
         * @returns {boolean} true if on
         * @private
         */
        function isOnInConfig() {
            return !isOffInConfig();
        }

        /**
         * Check if rule is not recommended by eslint
         * @returns {boolean} true if not recommended
         * @private
         */
        function isNotRecommended() {
            return indexLine.indexOf("(recommended)") === -1;
        }

        /**
         * Check if rule is recommended by eslint
         * @returns {boolean} true if recommended
         * @private
         */
        function isRecommended() {
            return !isNotRecommended();
        }

        /**
         * Check if id is present in title
         * @param {string} id id to check for
         * @returns {boolean} true if present
         * @private
         */
        function hasIdInTitle(id) {
            var docText = cat(docFilename);
            var idInTitleRegExp = new RegExp("^# (.*?) \\(" + id + "\\)");
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
        if (!isInConfig()) {
            console.error("Missing default setting for %s in eslint.json", basename);
            errors++;
        }

        // check that rule is not recommended in docs but off in default config
        if (isRecommended() && isOffInConfig()) {
            console.error("Rule documentation says that %s is recommended, but it is disabled in eslint.json.", basename);
            errors++;
        }

        //  check that rule is not on in default config but not recommended
        if (isOnInConfig("default") && isNotRecommended("default")) {
            console.error("Missing '(recommended)' for rule %s in index", basename);
            errors++;
        }

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

    /**
     * Check if a dependency is eligible to be used by us
     * @param {object} dependency dependency to check
     * @returns {boolean} true if we have permission
     * @private
     */
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
            impermissible.forEach(function(dependency) {
                console.error("%s license for %s is impermissible.",
                    dependency.licenses,
                    dependency.name
                );
            });
            exit(1);
        }
    });
};

target.checkGitCommit = function() {
    var commitMsgs,
        failed;

    if (hasBranch("master")) {
        commitMsgs = splitCommandResultToLines(execSilent("git log HEAD --not master --format=format:%s --no-merges"));
    } else {
        commitMsgs = [execSilent("git log -1 --format=format:%s --no-merges")];
    }

    echo("Validating Commit Message");

    // No commit since master should not cause test to fail
    if (commitMsgs[0] === "") {
        return;
    }

    // Check for more than one commit
    if (commitMsgs.length > 1) {
        echo(" - More than one commit found, please squash.");
        failed = true;
    }

    // Only check non-release messages
    if (!semver.valid(commitMsgs[0]) && !/^Revert /.test(commitMsgs[0])) {
        if (commitMsgs[0].slice(0, commitMsgs[0].indexOf("\n")).length > 72) {
            echo(" - First line of commit message must not exceed 72 characters");
            failed = true;
        }

        // Check for tag at start of message
        if (!TAG_REGEX.test(commitMsgs[0])) {
            echo([" - Commit summary must start with one of:",
                "    'Fix:'",
                "    'Update:'",
                "    'Breaking:'",
                "    'Docs:'",
                "    'Build:'",
                "    'New:'",
                "    'Upgrade:'",
                "   Please refer to the contribution guidelines for more details."].join("\n"));
            failed = true;
        }

        // Check for an issue reference at end (unless it's a documentation commit)
        if (!/^Docs:/.test(commitMsgs[0])) {
            if (!ISSUE_REGEX.test(commitMsgs[0])) {
                echo([" - Commit summary must end with with one of:",
                    "    '(fixes #1234)'",
                    "    '(refs #1234)'",
                    "   Where '1234' is the issue being addressed.",
                    "   Please refer to the contribution guidelines for more details."].join("\n"));
                failed = true;
            }
        }
    }

    if (failed) {
        exit(1);
    }
};

/**
 * Calculates the time for each run for performance
 * @param {string} cmd cmd
 * @param {int} runs Total number of runs to do
 * @param {int} runNumber Current run number
 * @param {int[]} results Collection results from each run
 * @param {function} cb Function to call when everything is done
 * @returns {int[]} calls the cb with all the results
 * @private
 */
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
            return cb(results);
        }
    });

}

/**
 * Run the load performance for eslint
 * @returns {void}
 * @private
 */
function loadPerformance() {
    var results = [];
    for (var cnt = 0; cnt < 5; cnt++) {
        var loadPerfData = loadPerf({
            checkDependencies: false
        });

        echo("Load performance Run #" + (cnt + 1) + ":  %dms", loadPerfData.loadTime);
        results.push(loadPerfData.loadTime);
    }
    results.sort(function(a, b) {
        return a - b;
    });
    var median = results[~~(results.length / 2)];
    echo("\nLoad Performance median :  %dms", median);
}

target.perf = function() {
    var cpuSpeed = os.cpus()[0].speed,
        max = PERF_MULTIPLIER / cpuSpeed,
        cmd = ESLINT + "--no-ignore ./tests/performance/jshint.js";

    echo("CPU Speed is %d with multiplier %d", cpuSpeed, PERF_MULTIPLIER);

    time(cmd, 5, 1, [], function(results) {
        results.sort(function(a, b) {
            return a - b;
        });

        var median = results[~~(results.length / 2)];

        if (median > max) {
            echo("Performance budget exceeded: %dms (limit: %dms)", median, max);
        } else {
            echo("Performance budget ok:  %dms (limit: %dms)", median, max);
        }
        echo("\n");
        loadPerformance();
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
