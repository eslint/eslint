"use strict";
module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            lib: {
                src: ["lib/**/*.js", "bin/*.js"]
            }
        },
        coverage: {
            options: {
                thresholds: {
                    "statements": 95,
                    "branches": 95,
                    "lines": 95,
                    "functions": 95
                },
                dir: "reports",
                root: "build"
            }
        },
        clean: ["build/"],
        instrument : {
            files : ["lib/**/*.js", "bin/*.js"],
            options : {
                lazy : true,
                basePath : "build/instrument/"
            }
        },
        copy: {
            all: {
                src: ["tests/**/*", "conf/*", "tests/fixtures/configurations/single-quotes/.eslintrc"],
                dest: "build/instrument/"
            }
        },
        storeCoverage : {
            options : {
                dir : "build/reports/"
            }
        },
        makeReport : {
            src : "build/reports/**/*.json",
            options : {
                type : "lcov",
                dir : "build/reports/",
                print: "print"
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: "spec"
                },
                src: "build/instrument/tests/lib/**/*.js"
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-istanbul");
    grunt.loadNpmTasks("grunt-istanbul-coverage");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-mocha-test");

    // Default task.
    grunt.registerTask("default", ["jshint"]);
    grunt.registerTask("test", ["jshint", "instrument", "copy", "mochaTest", "storeCoverage", "makeReport", "coverage", "clean"]);
};
