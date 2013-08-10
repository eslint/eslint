/**
 * @fileoverview Tests for jUnit Formatter.
 * @author Jamund Ferguson
 */

/*jshint node:true*/

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var vows = require("vows"),
    assert = require("assert"),
    sinon = require("sinon"),
    formatter = require("../../../lib/formatters/junit");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe("formatter:junit").addBatch({

    "when there are no problems": {

        topic: [],

        "should not complain about anything": function(topic) {
            var config = {}; // not needed for this test
            var result = formatter(topic, config);
            assert.equal('<?xml version="1.0" encoding="utf-8"?><testsuites></testsuites>', result.replace(/\n/g, ""));
        }
    },

    "when passed a single message": {

        topic: [{
            filePath: "foo.js",
            messages: [{
                message: "Unexpected foo.",
                line: 5,
                column: 10,
                ruleId: "foo"
            }]
        }],

        "should return a single <testcase> with a message and the line and col number in the body (error)": function(topic) {
            var config = {
                rules: { foo: 2 }
            };

            var result = formatter(topic, config);
            assert.equal('<?xml version="1.0" encoding="utf-8"?><testsuites><testsuite package="org.eslint" time="0" tests="1" errors="1" name="foo.js"><testcase time="0" name="org.eslint.foo"><failure message="Unexpected foo."><![CDATA[line 5, col 10, Error - Unexpected foo.]]></failure></testcase></testsuite></testsuites>', result.replace(/\n/g, ""));
        },

        "should return a single <testcase> with a message and the line and col number in the body (warning)": function(topic) {
            var config = {
                rules: { foo: 1 }
            };

            var result = formatter(topic, config);
            assert.equal('<?xml version="1.0" encoding="utf-8"?><testsuites><testsuite package="org.eslint" time="0" tests="1" errors="1" name="foo.js"><testcase time="0" name="org.eslint.foo"><failure message="Unexpected foo."><![CDATA[line 5, col 10, Warning - Unexpected foo.]]></failure></testcase></testsuite></testsuites>', result.replace(/\n/g, ""));
        },

        "should return a single <testcase> with a message and the line and col number in the body (error) with options config": function(topic) {
            var config = {
                rules: { foo: [2, "option"] }
            };

            var result = formatter(topic, config);
            assert.equal('<?xml version="1.0" encoding="utf-8"?><testsuites><testsuite package="org.eslint" time="0" tests="1" errors="1" name="foo.js"><testcase time="0" name="org.eslint.foo"><failure message="Unexpected foo."><![CDATA[line 5, col 10, Error - Unexpected foo.]]></failure></testcase></testsuite></testsuites>', result.replace(/\n/g, ""));
        },

    },

    "when passed a fatal error message": {

        topic: [{
            filePath: "foo.js",
            messages: [{
                fatal: true,
                message: "Unexpected foo.",
                line: 5,
                column: 10,
                ruleId: "foo"
            }]
        }],

        "should return a single <testcase> and an <error>": function(topic) {
            var config = {};
            var result = formatter(topic, config);
            assert.equal('<?xml version="1.0" encoding="utf-8"?><testsuites><testsuite package="org.eslint" time="0" tests="1" errors="1" name="foo.js"><testcase time="0" name="org.eslint.foo"><error message="Unexpected foo."><![CDATA[line 5, col 10, Error - Unexpected foo.]]></error></testcase></testsuite></testsuites>', result.replace(/\n/g, ""));
        }
    },

    "when passed a fatal error message with no line or column": {

        topic: [{
            filePath: "foo.js",
            messages: [{
                fatal: true,
                message: "Unexpected foo."
            }]
        }],

        "should return a single <testcase> and an <error>": function(topic) {
            var config = {};
            var result = formatter(topic, config);
            assert.equal('<?xml version="1.0" encoding="utf-8"?><testsuites><testsuite package="org.eslint" time="0" tests="1" errors="1" name="foo.js"><testcase time="0" name="org.eslint.unknown"><error message="Unexpected foo."><![CDATA[line 0, col 0, Error - Unexpected foo.]]></error></testcase></testsuite></testsuites>', result.replace(/\n/g, ""));
        }
    },

    "when passed a fatal error message with no line, column, or message text": {

        topic: [{
            filePath: "foo.js",
            messages: [{
                fatal: true
            }]
        }],

        "should return a single <testcase> and an <error>": function(topic) {
            var config = {};
            var result = formatter(topic, config);
            assert.equal('<?xml version="1.0" encoding="utf-8"?><testsuites><testsuite package="org.eslint" time="0" tests="1" errors="1" name="foo.js"><testcase time="0" name="org.eslint.unknown"><error message=""><![CDATA[line 0, col 0, Error - ]]></error></testcase></testsuite></testsuites>', result.replace(/\n/g, ""));
        }
    },

    "when passed multiple messages": {

        topic: [{
            filePath: "foo.js",
            messages: [{
                message: "Unexpected foo.",
                line: 5,
                column: 10,
                ruleId: "foo"
            }, {
                message: "Unexpected bar.",
                line: 6,
                column: 11,
                ruleId: "bar"
            }]
        }],

        "should return a multiple <testcase>'s": function(topic) {
            var config = {
                rules: { foo: 2, bar: 1 }
            };

            var result = formatter(topic, config);
            assert.equal('<?xml version="1.0" encoding="utf-8"?><testsuites><testsuite package="org.eslint" time="0" tests="2" errors="2" name="foo.js"><testcase time="0" name="org.eslint.foo"><failure message="Unexpected foo."><![CDATA[line 5, col 10, Error - Unexpected foo.]]></failure></testcase><testcase time="0" name="org.eslint.bar"><failure message="Unexpected bar."><![CDATA[line 6, col 11, Warning - Unexpected bar.]]></failure></testcase></testsuite></testsuites>', result.replace(/\n/g, ""));
        }

    },

    "when passed special characters": {

        topic: [{
            filePath: "foo.js",
            messages: [{
                message: "Unexpected <foo></foo>.",
                line: 5,
                column: 10,
                ruleId: "foo"
            }]
        }],

        "should make them go away": function(topic) {
            var config = {
                rules: { foo: 1 }
            };

            var result = formatter(topic, config);
            assert.equal('<?xml version="1.0" encoding="utf-8"?><testsuites><testsuite package="org.eslint" time="0" tests="1" errors="1" name="foo.js"><testcase time="0" name="org.eslint.foo"><failure message="Unexpected &lt;foo&gt;&lt;/foo&gt;."><![CDATA[line 5, col 10, Warning - Unexpected &lt;foo&gt;&lt;/foo&gt;.]]></failure></testcase></testsuite></testsuites>', result.replace(/\n/g, ""));

        }
    },

    "when passed multiple files with 1 message each": {
        topic: [{
            filePath: "foo.js",
            messages: [{
                message: "Unexpected foo.",
                line: 5,
                column: 10,
                ruleId: "foo"
            }]
        }, {
            filePath: "bar.js",
            messages: [{
                message: "Unexpected bar.",
                line: 6,
                column: 11,
                ruleId: "bar"
            }]
        }],

        "should return 2 <testsuite>'s": function(topic) {
            var config = {
                rules: { foo: 1, bar: 2 }
            };

            var result = formatter(topic, config);
            assert.equal('<?xml version="1.0" encoding="utf-8"?><testsuites><testsuite package="org.eslint" time="0" tests="1" errors="1" name="foo.js"><testcase time="0" name="org.eslint.foo"><failure message="Unexpected foo."><![CDATA[line 5, col 10, Warning - Unexpected foo.]]></failure></testcase></testsuite><testsuite package="org.eslint" time="0" tests="1" errors="1" name="bar.js"><testcase time="0" name="org.eslint.bar"><failure message="Unexpected bar."><![CDATA[line 6, col 11, Error - Unexpected bar.]]></failure></testcase></testsuite></testsuites>', result.replace(/\n/g, ""));

        }
    },

    "when passed multiple files with total 1 failure": {
        topic: [{
            filePath: "foo.js",
            messages: [{
                message: "Unexpected foo.",
                line: 5,
                column: 10,
                ruleId: "foo"
            }]
        }, {
            filePath: "bar.js",
            messages: []
        }],

        "should return 1 <testsuite>'": function(topic) {
            var config = {
                rules: { foo: 1, bar: 2 }
            };

            var result = formatter(topic, config);
            assert.equal('<?xml version="1.0" encoding="utf-8"?><testsuites><testsuite package="org.eslint" time="0" tests="1" errors="1" name="foo.js"><testcase time="0" name="org.eslint.foo"><failure message="Unexpected foo."><![CDATA[line 5, col 10, Warning - Unexpected foo.]]></failure></testcase></testsuite></testsuites>', result.replace(/\n/g, ""));

        }
    }


}).export(module);
