/**
 * @fileoverview Release tests for the Makefile.js
 * @author Victor Hom
 */

"use strict";

// const childProcess = require("child_process");
// const fs = require("fs");
const assert = require("chai").assert;
const shell = require("shelljs");
const find = shell.find;
const ls = shell.ls;
const rm = shell.rm;
const os = require("os");
const fs = require("fs");
const Makefile = require(`${__dirname}/../Makefile.js`);
const JSON_FILES = find("conf/").filter(Makefile.fileType("json"));

describe("Makefile.js", () => {

    describe("getTestFilesPatterns", () => {
        it("should return a string of string delimited test file patterns", () => {
            const filePatterns = Makefile.getTestFilePatterns().split(" ");
            const pattern = [
                "tests/lib/rules/**/*.js",
                "tests/lib/*.js",
                "tests/templates/*.js",
                "tests/bin/**/*.js",
                "tests/tools/*.js",
                "\"tests/lib/code-path-analysis/**/*.js\"",
                "\"tests/lib/config/**/*.js\"",
                "\"tests/lib/formatters/**/*.js\"",
                "\"tests/lib/internal-rules/**/*.js\"",
                "\"tests/lib/testers/**/*.js\"",
                "\"tests/lib/util/**/*.js\""
            ];
            assert.sameOrderedMembers(filePatterns, pattern);
            assert.equal(filePatterns.length, 11);
        });
    });
    
    describe("validateJsonFile", () => {
        
        it("should parse the contents", () => {
            assert.equal(JSON_FILES.length, 3);
            assert.sameOrderedMembers(JSON_FILES, 
                [ 
                    'conf/blank-script.json',
                    'conf/category-list.json',
                    'conf/replacements.json' 
                ]
            );
            JSON_FILES.forEach((filepath) => {
                Makefile.validateJsonFile(filepath);
            });
        });

        it("throw an error if it's invalid JSON", () => {
            const invalidJson = `${__dirname}/fixtures/conf/invalid-conf.json`;
            function testfun() {
                Makefile.validateJsonFile(invalidJson);
            }
            assert.throws(testfun, SyntaxError, "Unexpected token / in JSON at position 0");
        });
    });
    
    describe("fileType", () => {
        const fileTypeMatcher = Makefile.fileType("json");

        it("returns a function", () => {
            assert.isFunction(fileTypeMatcher);
        });

        it("returns true if file type matches", () => {
            assert.isTrue(fileTypeMatcher("test.json"), true);
        })
        
        it("returns false if the file type does not match", () => {
            assert.isFalse(fileTypeMatcher("test.xyz"));
            assert.isFalse(fileTypeMatcher("noExtensionFile"));
            assert.isFalse(fileTypeMatcher(""));
        });
    });

    describe("parentDirectory", () => {
        const parentDirectoryMatcher = Makefile.parentDirectory("rules");

        it("returns a function", () => {
            assert.isFunction(parentDirectoryMatcher);
        });

        it("returns true if parent directory name matches", () => {
            assert.isTrue(parentDirectoryMatcher("./test/rules/filename.js"));
        });

        it("returns false if parent directory name does not match", () => {
            assert.isFalse(parentDirectoryMatcher("./rulesbreaker/filename.js"));
        });
    });
    
    describe("generateRuleIndex", () => {
        it("generates a file that exports a method that returns a rules object", () => {
            const fixturesDir = `${__dirname}/fixtures/`;
            const loadRulesPath = `${fixturesDir}load-rules.js`;
            const ruleKeys = ["custom-rule", "fixture-rule", "make-syntax-error-rule", "test-multi-rulesdirs"];

            fs.writeFile(loadRulesPath, '');
            Makefile.generateRulesIndex(fixturesDir);

            const generatedRulesExport = require(loadRulesPath);
            const generatedRulesIndex = generatedRulesExport();

            assert.isFunction(generatedRulesExport);
            assert.isObject(generatedRulesIndex);
            assert.containsAllKeys(generatedRulesIndex, ruleKeys);
        });
    });
    
    describe("execSilent", () => {
        it("executes a command and returns the output", () => {
            assert.include(Makefile.execSilent("node --version"), process.versions.node);
        });
    });
    // need to clean up definitely
    describe("generateBlogPost", () => {
        const releaseInfo = {
            version: 1,
            type: "test",
            changelog: {
                new: ["7777777", "dedbeef"]
            }
        };
        const now = new Date(), 
        month = now.getMonth() + 1,
        day = now.getDate(),
        fileName = `${os.tmpdir()}/_posts/${now.getFullYear()}-${
            month < 10 ? `0${month}` : month}-${
            day < 10 ? `0${day}` : day}-eslint-v${
            releaseInfo.version}-released.md`;        
        
        // assumes the eslint.github.io project is at same level as eslint project 
        it("generates a release blog post for eslint.org", () => {
            fs.mkdirSync(os.tmpdir() + "/_posts");
            Makefile.generateBlogPost(releaseInfo, os.tmpdir());

            assert.isTrue(fs.existsSync(fileName));

            // remove file and /_posts to avoid errors on consecutive test runs
            rm(fileName);
            fs.rmdirSync(os.tmpdir() + "/_posts");
        });
    });
    
    describe("generateFormmatterExamples", () => {
    
    });
    
    describe("generateRuleIndexPage", () => {
    
    });
    
    describe("publishSite", () => {
    
    });
    
    describe("release", () => {
    
    });
    
    describe("prerelease", () => {
    
    });
    
    describe("splitCommandResultToLines", () => {
    
    });
    
    describe("getFirstCommitOfFile", () => {
    
    });
    
    describe("getTagOfFirstOccurence", () => {
    
    });
    
    describe("getCommitDeletingFile", () => {
    
    });
    
    describe("getFirstVersionOfDeletion", () => {
    
    });
    
    describe("getBranches", () => {
    
    });
    
    describe("lintMarkdown", () => {
    
    });
    
    describe("hasBranch", () => {
    
    });
    
    describe("getFormatterResults", () => {
    
    });
    
    // Tasks
    // A lot of things are happening here
    //
    
    describe("downloadMultifilesTestTarget", () => {
    
    });
    
    describe("createConfigForPerformanceTest", () => {
    
    });
    
    describe("time", () => {
    
    
    });
    
    describe("runPerformanceTest", () => {
    
    });
    
    describe("loadPerformance", () => {
    
    });
    
    // test.perf
});
