/**
 * @fileoverview Build file
 * @author nzakas
 */

/* global cat, cd, cp, echo, exec, exit, find, ls, mkdir, pwd, rm, target, test*/
/* eslint no-use-before-define: "off", no-console: "off" */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

require("shelljs/make");

const lodash = require("lodash"),
    checker = require("npm-license"),
    ReleaseOps = require("eslint-release"),
    dateformat = require("dateformat"),
    fs = require("fs"),
    glob = require("glob"),
    markdownlint = require("markdownlint"),
    nodeCLI = require("shelljs-nodecli"),
    os = require("os"),
    path = require("path"),
    semver = require("semver"),
    ejs = require("ejs"),
    loadPerf = require("load-perf"),
    yaml = require("js-yaml");

//------------------------------------------------------------------------------
// Settings
//------------------------------------------------------------------------------

/*
 * A little bit fuzzy. My computer has a first CPU speed of 3392 and the perf test
 * always completes in < 3800ms. However, Travis is less predictable due to
 * multiple different VM types. So I'm fudging this for now in the hopes that it
 * at least provides some sort of useful signal.
 */
const PERF_MULTIPLIER = 13e6;

const OPEN_SOURCE_LICENSES = [
    /MIT/, /BSD/, /Apache/, /ISC/, /WTF/, /Public Domain/
];

//------------------------------------------------------------------------------
// Data
//------------------------------------------------------------------------------

const NODE = "node ", // intentional extra space
    NODE_MODULES = "./node_modules/",
    TEMP_DIR = "./tmp/",
    BUILD_DIR = "./build/",
    DOCS_DIR = "../eslint.github.io/docs",
    SITE_DIR = "../eslint.github.io/",
    PERF_TMP_DIR = path.join(os.tmpdir(), "eslint", "performance"),

    // Utilities - intentional extra space at the end of each string
    MOCHA = `${NODE_MODULES}mocha/bin/_mocha `,
    ESLINT = `${NODE} bin/eslint.js --rulesdir lib/internal-rules/ `,

    // Files
    MAKEFILE = "./Makefile.js",
    JS_FILES = "\"lib/**/*.js\" \"conf/**/*.js\" \"bin/**/*.js\"",
    JSON_FILES = find("conf/").filter(fileType("json")),
    MARKDOWN_FILES_ARRAY = find("docs/").concat(ls(".")).filter(fileType("md")),
    TEST_FILES = getTestFilePatterns(),
    PERF_ESLINTRC = path.join(PERF_TMP_DIR, "eslintrc.yml"),
    PERF_MULTIFILES_TARGET_DIR = path.join(PERF_TMP_DIR, "eslint"),
    PERF_MULTIFILES_TARGETS = `"${PERF_MULTIFILES_TARGET_DIR + path.sep}{lib,tests${path.sep}lib}${path.sep}**${path.sep}*.js"`,

    // Regex
    TAG_REGEX = /^(?:Breaking|Build|Chore|Docs|Fix|New|Update|Upgrade):/,

    // Settings
    MOCHA_TIMEOUT = 10000;

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Generates file patterns for test files
 * @returns {string} test file patterns
 * @private
 */
function getTestFilePatterns() {
    const testLibPath = "tests/lib/",
        testTemplatesPath = "tests/templates/",
        testBinPath = "tests/bin/";

    return ls(testLibPath).filter(pathToCheck => test("-d", testLibPath + pathToCheck)).reduce((initialValue, currentValues) => {
        if (currentValues !== "rules") {
            initialValue.push(`"${testLibPath + currentValues}/**/*.js"`);
        }
        return initialValue;
    }, [`"${testLibPath}rules/**/*.js"`, `"${testLibPath}*.js"`, `"${testTemplatesPath}*.js"`, `"${testBinPath}**/*.js"`]).join(" ");
}

/**
 * Simple JSON file validation that relies on ES JSON parser.
 * @param {string} filePath Path to JSON.
 * @throws Error If file contents is invalid JSON.
 * @returns {undefined}
 */
function validateJsonFile(filePath) {
    const contents = fs.readFileSync(filePath, "utf8");

    JSON.parse(contents);
}

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
    let output = "module.exports = function() {\n";

    output += "    var rules = Object.create(null);\n";

    find(`${basedir}rules/`).filter(fileType("js")).forEach(filename => {
        const basename = path.basename(filename, ".js");

        output += `    rules["${basename}"] = require("./rules/${basename}");\n`;
    });

    output += "\n    return rules;\n};";
    output.to(`${basedir}load-rules.js`);
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
    const ruleList = ls("lib/rules")

        // Strip the .js extension
        .map(ruleFileName => ruleFileName.replace(/\.js$/, ""))

        /*
         * Sort by length descending. This ensures that rule names which are substrings of other rule names are not
         * matched incorrectly. For example, the string "no-undefined" should get matched with the `no-undefined` rule,
         * instead of getting matched with the `no-undef` rule followed by the string "ined".
         */
        .sort((ruleA, ruleB) => ruleB.length - ruleA.length);
    const output = ejs.render(cat("./templates/blogpost.md.ejs"), Object.assign({ ruleList }, releaseInfo)),
        now = new Date(),
        month = now.getMonth() + 1,
        day = now.getDate(),
        filename = `../eslint.github.io/_posts/${now.getFullYear()}-${
            month < 10 ? `0${month}` : month}-${
            day < 10 ? `0${day}` : day}-eslint-v${
            releaseInfo.version}-released.md`;

    output.to(filename);
}

/**
 * Generates a doc page with formatter result examples
 * @param  {Object} formatterInfo Linting results from each formatter
 * @param  {string} [prereleaseVersion] The version used for a prerelease. This
 *      changes where the output is stored.
 * @returns {void}
 */
function generateFormatterExamples(formatterInfo, prereleaseVersion) {
    const output = ejs.render(cat("./templates/formatter-examples.md.ejs"), formatterInfo);
    let filename = "../eslint.github.io/docs/user-guide/formatters/index.md",
        htmlFilename = "../eslint.github.io/docs/user-guide/formatters/html-formatter-example.html";

    if (prereleaseVersion) {
        filename = filename.replace("/docs", `/docs/${prereleaseVersion}`);
        htmlFilename = htmlFilename.replace("/docs", `/docs/${prereleaseVersion}`);
    }

    output.to(filename);
    formatterInfo.formatterResults.html.result.to(htmlFilename);
}

/**
 * Generate a doc page that lists all of the rules and links to them
 * @param {string} basedir The directory in which to look for code.
 * @returns {void}
 */
function generateRuleIndexPage(basedir) {
    const outputFile = "../eslint.github.io/_data/rules.yml",
        categoryList = "conf/category-list.json",
        categoriesData = JSON.parse(cat(path.resolve(categoryList)));

    find(path.join(basedir, "/lib/rules/")).filter(fileType("js")).forEach(filename => {
        const rule = require(filename);
        const basename = path.basename(filename, ".js");

        if (rule.meta.deprecated) {
            categoriesData.deprecated.rules.push({
                name: basename,
                replacedBy: rule.meta.docs.replacedBy || []
            });
        } else {
            const output = {
                    name: basename,
                    description: rule.meta.docs.description,
                    recommended: rule.meta.docs.recommended || false,
                    fixable: !!rule.meta.fixable
                },
                category = lodash.find(categoriesData.categories, { name: rule.meta.docs.category });

            if (!category.rules) {
                category.rules = [];
            }

            category.rules.push(output);
        }
    });

    const output = yaml.safeDump(categoriesData, { sortKeys: true });

    output.to(outputFile);
}

/**
 * Commits the changes in the site and publishes them to GitHub.
 * @param {string} [tag] The string to tag the commit with.
 * @returns {void}
 */
function publishSite(tag) {
    const currentDir = pwd();

    cd(SITE_DIR);
    exec("git add -A .");
    exec(`git commit -m "Autogenerated new docs and demo at ${dateformat(new Date())}"`);

    if (tag) {
        exec(`git tag ${tag}`);
    }

    exec("git fetch origin && git rebase origin/master");
    exec("git push origin master --tags");
    cd(currentDir);
}

/**
 * Creates a release version tag and pushes to origin.
 * @param {boolean} [ciRelease] Set to true to indicate this is a CI release.
 * @returns {void}
 */
function release(ciRelease) {

    const releaseInfo = ReleaseOps.release(null, ciRelease);

    echo("Generating site");
    target.gensite();
    generateBlogPost(releaseInfo);
    publishSite(`v${releaseInfo.version}`);
    echo("Site has been published");

    echo("Publishing to GitHub");
    ReleaseOps.publishReleaseToGitHub(releaseInfo);
}

/**
 * Creates a prerelease version tag and pushes to origin.
 * @param {string} prereleaseId The prerelease identifier (alpha, beta, etc.)
 * @returns {void}
 */
function prerelease(prereleaseId) {

    const releaseInfo = ReleaseOps.release(prereleaseId);

    echo("Generating site");

    // always write docs into the next major directory (so 2.0.0-alpha.0 writes to 2.0.0)
    target.gensite(semver.inc(releaseInfo.version, "major"));
    generateBlogPost(releaseInfo);
    echo("Site has not been pushed, please update blog post and push manually.");
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
    let commits = execSilent(`git rev-list HEAD -- ${filePath}`);

    commits = splitCommandResultToLines(commits);
    return commits[commits.length - 1].trim();
}

/**
 * Gets the tag name where a given file was introduced first.
 * @param {string} filePath The file path to check.
 * @returns {string} The tag name.
 */
function getTagOfFirstOccurrence(filePath) {
    const firstCommit = getFirstCommitOfFile(filePath);
    let tags = execSilent(`git tag --contains ${firstCommit}`);

    tags = splitCommandResultToLines(tags);
    return tags.reduce((list, version) => {
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
    const commits = execSilent(`git rev-list HEAD -- ${filePath}`);

    return splitCommandResultToLines(commits)[0];
}

/**
 * Gets the first version number where a given file is no longer present.
 * @param {string} filePath The path to the deleted file.
 * @returns {string} The version number.
 */
function getFirstVersionOfDeletion(filePath) {
    const deletionCommit = getCommitDeletingFile(filePath),
        tags = execSilent(`git tag --contains ${deletionCommit}`);

    return splitCommandResultToLines(tags)
        .map(version => semver.valid(version.trim()))
        .filter(version => version)
        .sort(semver.compare)[0];
}


/**
 * Returns all the branch names
 * @returns {string[]} branch names
 * @private
 */
function getBranches() {
    const branchesRaw = splitCommandResultToLines(execSilent("git branch --list")),
        branches = [];

    for (let i = 0; i < branchesRaw.length; i++) {
        const branchName = branchesRaw[i].replace(/^\*(.*)/, "$1").trim();

        branches.push(branchName);
    }
    return branches;
}

/**
 * Lints Markdown files.
 * @param {array} files Array of file names to lint.
 * @returns {Object} exec-style exit code object.
 * @private
 */
function lintMarkdown(files) {
    const config = {
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
            MD033: false, // Allow inline HTML
            MD034: false, // Bare URL used
            MD040: false, // Fenced code blocks should have a language specified
            MD041: false  // First line in file should be a top level header
        },
        result = markdownlint.sync({
            files,
            config,
            resultVersion: 1
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
    const branches = getBranches();

    return branches.indexOf(branchName) !== -1;
}

/**
 * Gets linting results from every formatter, based on a hard-coded snippet and config
 * @returns {Object} Output from each formatter
 */
function getFormatterResults() {
    const CLIEngine = require("./lib/cli-engine"),
        chalk = require("chalk");

    const formatterFiles = fs.readdirSync("./lib/formatters/"),
        cli = new CLIEngine({
            useEslintrc: false,
            baseConfig: { extends: "eslint:recommended" },
            rules: {
                "no-else-return": 1,
                indent: [1, 4],
                "space-unary-ops": 2,
                semi: [1, "always"],
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
        rawMessages = cli.executeOnText(codeString, "fullOfProblems.js", true);

    return formatterFiles.reduce((data, filename) => {
        const fileExt = path.extname(filename),
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
    let errors = 0,
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
    lodash.forEach(JSON_FILES, validateJsonFile);

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
    lastReturn = exec(`${ESLINT}${testCache}"tests/**/*.js"`);
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
    let errors = 0,
        lastReturn;

    // exec(ISTANBUL + " cover " + MOCHA + "-- -c " + TEST_FILES);
    lastReturn = nodeCLI.exec("istanbul", "cover", MOCHA, `-- -R progress -t ${MOCHA_TIMEOUT}`, "-c", TEST_FILES);
    if (lastReturn.code !== 0) {
        errors++;
    }

    // exec(ISTANBUL + "check-coverage --statement 99 --branch 98 --function 99 --lines 99");
    lastReturn = nodeCLI.exec("istanbul", "check-coverage", "--statement 99 --branch 98 --function 99 --lines 99");
    if (lastReturn.code !== 0) {
        errors++;
    }

    target.browserify();

    lastReturn = nodeCLI.exec("karma", "start karma.conf.js");
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

target.gensite = function(prereleaseVersion) {
    echo("Generating eslint.org");

    let docFiles = [
        "/rules/",
        "/user-guide/",
        "/maintainer-guide/",
        "/developer-guide/",
        "/about/"
    ];

    // append version
    if (prereleaseVersion) {
        docFiles = docFiles.map(docFile => `/${prereleaseVersion}${docFile}`);
    }

    // 1. create temp and build directory
    if (!test("-d", TEMP_DIR)) {
        mkdir(TEMP_DIR);
    }

    // 2. remove old files from the site
    docFiles.forEach(filePath => {
        const fullPath = path.join(DOCS_DIR, filePath),
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

    let versions = test("-f", "./versions.json") ? JSON.parse(cat("./versions.json")) : {};

    if (!versions.added) {
        versions = {
            added: versions,
            removed: {}
        };
    }

    // 4. Loop through all files in temporary directory
    find(TEMP_DIR).forEach(filename => {
        if (test("-f", filename) && path.extname(filename) === ".md") {

            const rulesUrl = "https://github.com/eslint/eslint/tree/master/lib/rules/",
                docsUrl = "https://github.com/eslint/eslint/tree/master/docs/rules/",
                baseName = path.basename(filename),
                sourceBaseName = `${path.basename(filename, ".md")}.js`,
                sourcePath = path.join("lib/rules", sourceBaseName),
                ruleName = path.basename(filename, ".md");
            let text = cat(filename),
                title;

            // 5. Prepend page title and layout variables at the top of rules
            if (path.dirname(filename).indexOf("rules") >= 0) {
                text = `---\ntitle: ${ruleName} - Rules\nlayout: doc\n---\n<!-- Note: No pull requests accepted for this file. See README.md in the root directory for details. -->\n\n${text}`;
            } else {

                // extract the title from the file itself
                title = text.match(/#([^#].+)\n/);
                if (title) {
                    title = title[1].trim();
                } else {
                    title = "Documentation";
                }
                text = `---\ntitle: ${title}\nlayout: doc\n---\n<!-- Note: No pull requests accepted for this file. See README.md in the root directory for details. -->\n\n${text}`;
            }

            // 6. Remove .md extension for relative links and change README to empty string
            text = text.replace(/\((?!https?:\/\/)([^)]*?)\.md.*?\)/g, "($1)").replace("README.html", "");

            // 7. Check if there's a trailing white line at the end of the file, if there isn't one, add it
            if (!/\n$/.test(text)) {
                text = `${text}\n`;
            }

            // 8. Append first version of ESLint rule was added at.
            if (filename.indexOf("rules/") !== -1) {
                if (!versions.added[baseName]) {
                    versions.added[baseName] = getFirstVersionOfFile(sourcePath);
                }
                const added = versions.added[baseName];

                if (!versions.removed[baseName] && !test("-f", sourcePath)) {
                    versions.removed[baseName] = getFirstVersionOfDeletion(sourcePath);
                }
                const removed = versions.removed[baseName];

                text += "\n## Version\n\n";
                text += removed
                    ? `This rule was introduced in ESLint ${added} and removed in ${removed}.\n`
                    : `This rule was introduced in ESLint ${added}.\n`;

                text += "\n## Resources\n\n";
                if (!removed) {
                    text += `* [Rule source](${rulesUrl}${sourceBaseName})\n`;
                }
                text += `* [Documentation source](${docsUrl}${baseName})\n`;
            }

            // 9. Update content of the file with changes
            text.to(filename.replace("README.md", "index.md"));
        }
    });
    JSON.stringify(versions).to("./versions.json");

    // 10. Copy temporary directory to site's docs folder
    let outputDir = DOCS_DIR;

    if (prereleaseVersion) {
        outputDir += `/${prereleaseVersion}`;
    }
    cp("-rf", `${TEMP_DIR}*`, outputDir);

    // 11. Generate rule listing page
    generateRuleIndexPage(process.cwd());

    // 12. Delete temporary directory
    rm("-r", TEMP_DIR);

    // 13. Update demos, but only for non-prereleases
    if (!prereleaseVersion) {
        cp("-f", "build/eslint.js", `${SITE_DIR}js/app/eslint.js`);
        cp("-f", "conf/eslint.json", `${SITE_DIR}js/app/eslint.json`);
    }

    // 14. Create Example Formatter Output Page
    generateFormatterExamples(getFormatterResults(), prereleaseVersion);
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
    rm(`${TEMP_DIR}load-rules.js`);

    // 4. create new load-rule.js with hardcoded requires
    generateRulesIndex(TEMP_DIR);

    // 5. browserify the temp directory
    nodeCLI.exec("browserify", "-x espree", `${TEMP_DIR}eslint.js`, "-o", `${BUILD_DIR}eslint.js`, "-s eslint", "-t [ babelify --presets [ es2015 ] ]");

    // 6. Browserify espree
    nodeCLI.exec("browserify", "-r espree", "-o", `${TEMP_DIR}espree.js`);

    // 7. Concatenate Babel polyfill, Espree, and ESLint files together
    cat("./node_modules/babel-polyfill/dist/polyfill.js", `${TEMP_DIR}espree.js`, `${BUILD_DIR}eslint.js`).to(`${BUILD_DIR}eslint.js`);

    // 8. remove temp directory
    rm("-r", TEMP_DIR);
};

target.checkRuleFiles = function() {

    echo("Validating rules");

    const eslintConf = require("./conf/eslint.json").rules;

    const ruleFiles = find("lib/rules/").filter(fileType("js"));
    let errors = 0;

    ruleFiles.forEach(filename => {
        const basename = path.basename(filename, ".js");
        const docFilename = `docs/rules/${basename}.md`;

        /**
         * Check if basename is present in eslint conf
         * @returns {boolean} true if present
         * @private
         */
        function isInConfig() {
            return eslintConf.hasOwnProperty(basename);
        }

        /**
         * Check if id is present in title
         * @param {string} id id to check for
         * @returns {boolean} true if present
         * @private
         */
        function hasIdInTitle(id) {
            const docText = cat(docFilename);
            const idOldAtEndOfTitleRegExp = new RegExp(`^# (.*?) \\(${id}\\)`); // original format
            const idNewAtBeginningOfTitleRegExp = new RegExp(`^# ${id}: `); // new format is same as rules index
            // 1. Added support for new format.
            // 2. Will remove support for old format after all docs files have new format.
            // 3. Will remove this check when the main heading is automatically generated from rule metadata.

            return idNewAtBeginningOfTitleRegExp.test(docText) || idOldAtEndOfTitleRegExp.test(docText);
        }

        // check for docs
        if (!test("-f", docFilename)) {
            console.error("Missing documentation for rule %s", basename);
            errors++;
        } else {

            // check for proper doc format
            if (!hasIdInTitle(basename)) {
                console.error("Missing id in the doc page's title of rule %s", basename);
                errors++;
            }
        }

        // check for default configuration
        if (!isInConfig()) {
            console.error("Missing default setting for %s in conf/eslint.json", basename);
            errors++;
        }

        // check for tests
        if (!test("-f", `tests/lib/rules/${basename}.js`)) {
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
     * @param {Object} dependency dependency to check
     * @returns {boolean} true if we have permission
     * @private
     */
    function isPermissible(dependency) {
        const licenses = dependency.licenses;

        if (Array.isArray(licenses)) {
            return licenses.some(license => isPermissible({
                name: dependency.name,
                licenses: license
            }));
        }

        return OPEN_SOURCE_LICENSES.some(license => license.test(licenses));
    }

    echo("Validating licenses");

    checker.init({
        start: __dirname
    }, deps => {
        const impermissible = Object.keys(deps).map(dependency => ({
            name: dependency,
            licenses: deps[dependency].licenses
        })).filter(dependency => !isPermissible(dependency));

        if (impermissible.length) {
            impermissible.forEach(dependency => {
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
    let commitMsgs,
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
        if (commitMsgs[0].split(/\r?\n/)[0].length > 72) {
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
                "    'Chore:'",
                "   Please refer to the contribution guidelines for more details."].join("\n"));
            failed = true;
        }
    }

    if (failed) {
        exit(1);
    }
};

/**
 * Downloads a repository which has many js files to test performance with multi files.
 * Here, it's eslint@1.10.3 (450 files)
 * @param {Function} cb - A callback function.
 * @returns {void}
 */
function downloadMultifilesTestTarget(cb) {
    if (test("-d", PERF_MULTIFILES_TARGET_DIR)) {
        process.nextTick(cb);
    } else {
        mkdir("-p", PERF_MULTIFILES_TARGET_DIR);
        echo("Downloading the repository of multi-files performance test target.");
        exec(`git clone -b v1.10.3 --depth 1 https://github.com/eslint/eslint.git "${PERF_MULTIFILES_TARGET_DIR}"`, { silent: true }, cb);
    }
}

/**
 * Creates a config file to use performance tests.
 * This config is turning all core rules on.
 * @returns {void}
 */
function createConfigForPerformanceTest() {
    const content = [
        "root: true",
        "env:",
        "    node: true",
        "    es6: true",
        "rules:"
    ];

    content.push.apply(
        content,
        ls("lib/rules").map(fileName => `    ${path.basename(fileName, ".js")}: 1`)
    );

    content.join("\n").to(PERF_ESLINTRC);
}

/**
 * Calculates the time for each run for performance
 * @param {string} cmd cmd
 * @param {int} runs Total number of runs to do
 * @param {int} runNumber Current run number
 * @param {int[]} results Collection results from each run
 * @param {Function} cb Function to call when everything is done
 * @returns {int[]} calls the cb with all the results
 * @private
 */
function time(cmd, runs, runNumber, results, cb) {
    const start = process.hrtime();

    exec(cmd, { silent: true }, (code, stdout, stderr) => {
        const diff = process.hrtime(start),
            actual = (diff[0] * 1e3 + diff[1] / 1e6); // ms

        if (code) {
            echo(`  Performance Run #${runNumber} failed.`);
            if (stdout) {
                echo(`STDOUT:\n${stdout}\n\n`);
            }

            if (stderr) {
                echo(`STDERR:\n${stderr}\n\n`);
            }
            return cb(null);
        }

        results.push(actual);
        echo(`  Performance Run #${runNumber}:  %dms`, actual);
        if (runs > 1) {
            return time(cmd, runs - 1, runNumber + 1, results, cb);
        } else {
            return cb(results);
        }
    });

}

/**
 * Run a performance test.
 *
 * @param {string} title - A title.
 * @param {string} targets - Test targets.
 * @param {number} multiplier - A multiplier for limitation.
 * @param {Function} cb - A callback function.
 * @returns {void}
 */
function runPerformanceTest(title, targets, multiplier, cb) {
    const cpuSpeed = os.cpus()[0].speed,
        max = multiplier / cpuSpeed,
        cmd = `${ESLINT}--config "${PERF_ESLINTRC}" --no-eslintrc --no-ignore ${targets}`;

    echo("");
    echo(title);
    echo("  CPU Speed is %d with multiplier %d", cpuSpeed, multiplier);

    time(cmd, 5, 1, [], results => {
        if (!results || results.length === 0) {  // No results? Something is wrong.
            throw new Error("Performance test failed.");
        }

        results.sort((a, b) => a - b);

        const median = results[~~(results.length / 2)];

        echo("");
        if (median > max) {
            echo("  Performance budget exceeded: %dms (limit: %dms)", median, max);
        } else {
            echo("  Performance budget ok:  %dms (limit: %dms)", median, max);
        }
        echo("");
        cb();
    });
}

/**
 * Run the load performance for eslint
 * @returns {void}
 * @private
 */
function loadPerformance() {
    echo("");
    echo("Loading:");

    const results = [];

    for (let cnt = 0; cnt < 5; cnt++) {
        const loadPerfData = loadPerf({
            checkDependencies: false
        });

        echo(`  Load performance Run #${cnt + 1}:  %dms`, loadPerfData.loadTime);
        results.push(loadPerfData.loadTime);
    }

    results.sort((a, b) => a - b);
    const median = results[~~(results.length / 2)];

    echo("");
    echo("  Load Performance median:  %dms", median);
    echo("");
}

target.perf = function() {
    downloadMultifilesTestTarget(() => {
        createConfigForPerformanceTest();

        loadPerformance();

        runPerformanceTest(
            "Single File:",
            "tests/performance/jshint.js",
            PERF_MULTIPLIER,
            () => {

                // Count test target files.
                const count = glob.sync(
                    process.platform === "win32"
                        ? PERF_MULTIFILES_TARGETS.slice(2).replace("\\", "/")
                        : PERF_MULTIFILES_TARGETS
                ).length;

                runPerformanceTest(
                    `Multi Files (${count} files):`,
                    PERF_MULTIFILES_TARGETS,
                    3 * PERF_MULTIPLIER,
                    () => {}
                );
            }
        );
    });
};

target.release = function() {
    release();
};

target.ciRelease = function() {
    release(true);
};

target.publishsite = function() {
    publishSite();
};

target.prerelease = function(args) {
    prerelease(args[0]);
};
