/**
 * @fileoverview Tests for HTML reporter.
 * @author Julian Laval
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert;
const formatter = require("../../../lib/formatters/html");
const cheerio = require("cheerio");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Run unit tests on the overview section
 * @param {Object} $ Cheerio instance
 * @param {Object} args Array of relevant info to be tested
 * @returns {void}
 */
function checkOverview($, args) {
    assert($("#overview").hasClass(args.bgColor), "Check if color is correct");
    assert.strictEqual($("#overview span").text(), args.problems, "Check if correct problem totals");
}

/**
 * Run unit tests on the header section
 * @param {Object} $ Cheerio instance
 * @param {Object} rowObject Header row being tested
 * @param {Object} args Array of relevant info to be tested
 * @returns {void}
 */
function checkHeaderRow($, rowObject, args) {
    const row = $(rowObject);

    assert(row.hasClass(args.bgColor), "Check that background color is correct");
    assert.strictEqual(row.attr("data-group"), args.group, "Check that header group is correct");
    assert.strictEqual(row.find("th span").text(), args.problems, "Check if correct totals");
    assert.strictEqual(row.find("th").html().trim().match(/ [^<]*/u)[0].trim(), args.file, "Check if correctly displays filePath");
}

/**
 * Run unit tests on the content section
 * @param {Object} $ Cheerio instance
 * @param {Object} rowObject Content row being tested
 * @param {Object} args Array of relevant info to be tested
 * @returns {void}
 */
function checkContentRow($, rowObject, args) {
    const row = $(rowObject);

    assert(row.hasClass(args.group), "Check that linked to correct header");
    assert.strictEqual($(row.find("td")[0]).text(), args.lineCol, "Check that line:column is correct");
    assert($(row.find("td")[1]).hasClass(args.color), "Check that severity color is correct");
    assert.strictEqual($(row.find("td")[2]).html(), args.message, "Check that message is correct");
    assert.strictEqual($(row.find("td")[3]).find("a").text(), args.ruleId, "Check that ruleId is correct");
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("formatter:html", () => {
    describe("when passed a single error message", () => {

        const code = [{
            filePath: "foo.js",
            errorCount: 1,
            warningCount: 0,
            messages: [{
                message: "Unexpected foo.",
                severity: 2,
                line: 5,
                column: 10,
                ruleId: "foo",
                source: "foo"
            }]
        }];

        it("should return a string in HTML format with 1 issue in 1 file and styled accordingly", () => {
            const result = formatter(code);
            const $ = cheerio.load(result);

            // Check overview
            checkOverview($, { bgColor: "bg-2", problems: "1 problem (1 error, 0 warnings)" });

            // Check rows
            assert.strictEqual($("tr").length, 2, "Check that there are two (1 header, 1 content)");
            assert.strictEqual($("tr[data-group|=\"f\"]").length, 1, "Check that is 1 header row (implying 1 content row)");
            checkHeaderRow($, $("tr")[0], { bgColor: "bg-2", group: "f-0", file: "foo.js", problems: "1 problem (1 error, 0 warnings)" });
            checkContentRow($, $("tr")[1], { group: "f-0", lineCol: "5:10", color: "clr-2", message: "Unexpected foo.", ruleId: "foo" });
        });
    });

    describe("when passed a single warning message", () => {

        const code = [{
            filePath: "foo.js",
            errorCount: 0,
            warningCount: 1,
            messages: [{
                message: "Unexpected foo.",
                severity: 1,
                line: 5,
                column: 10,
                ruleId: "foo",
                source: "foo"
            }]
        }];

        it("should return a string in HTML format with 1 issue in 1 file and styled accordingly", () => {
            const result = formatter(code);
            const $ = cheerio.load(result);

            // Check overview
            checkOverview($, { bgColor: "bg-1", problems: "1 problem (0 errors, 1 warning)" });

            // Check rows
            assert.strictEqual($("tr").length, 2, "Check that there are two (1 header, 1 content)");
            assert.strictEqual($("tr[data-group|=\"f\"]").length, 1, "Check that is 1 header row (implying 1 content row)");
            checkHeaderRow($, $("tr")[0], { bgColor: "bg-1", group: "f-0", file: "foo.js", problems: "1 problem (0 errors, 1 warning)" });
            checkContentRow($, $("tr")[1], { group: "f-0", lineCol: "5:10", color: "clr-1", message: "Unexpected foo.", ruleId: "foo" });
        });
    });

    describe("when passed a single error message", () => {

        const code = [{
            filePath: "foo.js",
            errorCount: 1,
            warningCount: 0,
            messages: [{
                message: "Unexpected foo.",
                severity: 2,
                line: 5,
                column: 10,
                ruleId: "foo",
                source: "foo"
            }]
        }];

        it("should return a string in HTML format with 1 issue in 1 file and styled accordingly", () => {
            const result = formatter(code);
            const $ = cheerio.load(result);

            // Check overview
            checkOverview($, { bgColor: "bg-2", problems: "1 problem (1 error, 0 warnings)" });

            // Check rows
            assert.strictEqual($("tr").length, 2, "Check that there are two (1 header, 1 content)");
            assert.strictEqual($("tr[data-group|=\"f\"]").length, 1, "Check that is 1 header row (implying 1 content row)");
            checkHeaderRow($, $("tr")[0], { bgColor: "bg-2", group: "f-0", file: "foo.js", problems: "1 problem (1 error, 0 warnings)" });
            checkContentRow($, $("tr")[1], { group: "f-0", lineCol: "5:10", color: "clr-2", message: "Unexpected foo.", ruleId: "foo" });
        });
    });

    describe("when passed no error/warning messages", () => {

        const code = [{
            filePath: "foo.js",
            errorCount: 0,
            warningCount: 0,
            messages: []
        }];

        it("should return a string in HTML format with 0 issues in 1 file and styled accordingly", () => {
            const result = formatter(code);
            const $ = cheerio.load(result);

            // Check overview
            checkOverview($, { bgColor: "bg-0", problems: "0 problems" });

            // Check rows
            assert.strictEqual($("tr").length, 1, "Check that there is 1 row (header)");
            checkHeaderRow($, $("tr")[0], { bgColor: "bg-0", group: "f-0", file: "foo.js", problems: "0 problems" });
        });
    });

    describe("when passed multiple messages", () => {
        const code = [{
            filePath: "foo.js",
            errorCount: 1,
            warningCount: 1,
            messages: [{
                message: "Unexpected foo.",
                severity: 2,
                line: 5,
                column: 10,
                ruleId: "foo",
                source: "foo"
            }, {
                message: "Unexpected bar.",
                severity: 1,
                line: 6,
                column: 11,
                ruleId: "bar",
                source: "bar"
            }]
        }];

        it("should return a string in HTML format with 2 issues in 1 file and styled accordingly", () => {
            const result = formatter(code);
            const $ = cheerio.load(result);

            // Check overview
            checkOverview($, { bgColor: "bg-2", problems: "2 problems (1 error, 1 warning)" });

            // Check rows
            assert.strictEqual($("tr").length, 3, "Check that there are two (1 header, 2 content)");
            assert.strictEqual($("tr[data-group|=\"f\"]").length, 1, "Check that is 1 header row (implying 2 content row)");
            checkHeaderRow($, $("tr")[0], { bgColor: "bg-2", group: "f-0", file: "foo.js", problems: "2 problems (1 error, 1 warning)" });
            checkContentRow($, $("tr")[1], { group: "f-0", lineCol: "5:10", color: "clr-2", message: "Unexpected foo.", ruleId: "foo" });
            checkContentRow($, $("tr")[2], { group: "f-0", lineCol: "6:11", color: "clr-1", message: "Unexpected bar.", ruleId: "bar" });
        });
    });

    describe("when passed multiple files with 1 error & warning message respectively", () => {
        const code = [{
            filePath: "foo.js",
            errorCount: 1,
            warningCount: 0,
            messages: [{
                message: "Unexpected foo.",
                severity: 2,
                line: 5,
                column: 10,
                ruleId: "foo",
                source: "foo"
            }]
        }, {
            filePath: "bar.js",
            errorCount: 0,
            warningCount: 1,
            messages: [{
                message: "Unexpected bar.",
                severity: 1,
                line: 6,
                column: 11,
                ruleId: "bar",
                source: "bar"
            }]
        }];

        it("should return a string in HTML format with 2 issues in 2 files and styled accordingly", () => {
            const result = formatter(code);
            const $ = cheerio.load(result);

            // Check overview
            checkOverview($, { bgColor: "bg-2", problems: "2 problems (1 error, 1 warning)" });

            // Check rows
            assert.strictEqual($("tr").length, 4, "Check that there are two (2 header, 2 content)");
            assert.strictEqual($("tr[data-group|=\"f\"]").length, 2, "Check that is 2 header row (implying 2 content row)");
            checkHeaderRow($, $("tr")[0], { bgColor: "bg-2", group: "f-0", file: "foo.js", problems: "1 problem (1 error, 0 warnings)" });
            checkContentRow($, $("tr")[1], { group: "f-0", lineCol: "5:10", color: "clr-2", message: "Unexpected foo.", ruleId: "foo" });
            checkHeaderRow($, $("tr")[2], { bgColor: "bg-1", group: "f-1", file: "bar.js", problems: "1 problem (0 errors, 1 warning)" });
            checkContentRow($, $("tr")[3], { group: "f-1", lineCol: "6:11", color: "clr-1", message: "Unexpected bar.", ruleId: "bar" });
        });
    });

    describe("when passed multiple files with 1 warning message each", () => {
        const code = [{
            filePath: "foo.js",
            errorCount: 0,
            warningCount: 1,
            messages: [{
                message: "Unexpected foo.",
                severity: 1,
                line: 5,
                column: 10,
                ruleId: "foo",
                source: "foo"
            }]
        }, {
            filePath: "bar.js",
            errorCount: 0,
            warningCount: 1,
            messages: [{
                message: "Unexpected bar.",
                severity: 1,
                line: 6,
                column: 11,
                ruleId: "bar",
                source: "bar"
            }]
        }];

        it("should return a string in HTML format with 2 issues in 2 files and styled accordingly", () => {
            const result = formatter(code);
            const $ = cheerio.load(result);

            // Check overview
            checkOverview($, { bgColor: "bg-1", problems: "2 problems (0 errors, 2 warnings)" });

            // Check rows
            assert.strictEqual($("tr").length, 4, "Check that there are two (2 header, 2 content)");
            assert.strictEqual($("tr[data-group|=\"f\"]").length, 2, "Check that is 2 header row (implying 2 content row)");
            checkHeaderRow($, $("tr")[0], { bgColor: "bg-1", group: "f-0", file: "foo.js", problems: "1 problem (0 errors, 1 warning)" });
            checkContentRow($, $("tr")[1], { group: "f-0", lineCol: "5:10", color: "clr-1", message: "Unexpected foo.", ruleId: "foo" });
            checkHeaderRow($, $("tr")[2], { bgColor: "bg-1", group: "f-1", file: "bar.js", problems: "1 problem (0 errors, 1 warning)" });
            checkContentRow($, $("tr")[3], { group: "f-1", lineCol: "6:11", color: "clr-1", message: "Unexpected bar.", ruleId: "bar" });
        });
    });

    describe("when passing a single message with illegal characters", () => {

        const code = [{
            filePath: "foo.js",
            errorCount: 1,
            warningCount: 0,
            messages: [{
                message: "Unexpected <&\"'> foo.",
                severity: 2,
                line: 5,
                column: 10,
                ruleId: "foo",
                source: "foo"
            }]
        }];

        it("should return a string in HTML format with 1 issue in 1 file", () => {
            const result = formatter(code);
            const $ = cheerio.load(result);

            checkContentRow($, $("tr")[1], { group: "f-0", lineCol: "5:10", color: "clr-2", message: "Unexpected &lt;&amp;&quot;&apos;&gt; foo.", ruleId: "foo" });
        });
    });

    describe("when passing a single message with no rule id or message", () => {
        const code = [{
            filePath: "foo.js",
            errorCount: 1,
            warningCount: 0,
            messages: [{
                severity: 2,
                line: 5,
                column: 10
            }]
        }];

        it("should return a string in HTML format with 1 issue in 1 file", () => {
            const result = formatter(code);
            const $ = cheerio.load(result);

            checkContentRow($, $("tr")[1], { group: "f-0", lineCol: "5:10", color: "clr-2", message: "", ruleId: "" });
        });
    });

    describe("when passed a single message with no line or column", () => {

        const code = [{
            filePath: "foo.js",
            errorCount: 1,
            warningCount: 0,
            messages: [{
                message: "Unexpected foo.",
                severity: 2,
                ruleId: "foo",
                source: "foo"
            }]
        }];

        it("should return a string in HTML format with 1 issue in 1 file and styled accordingly", () => {
            const result = formatter(code);
            const $ = cheerio.load(result);

            checkContentRow($, $("tr")[1], { group: "f-0", lineCol: "0:0", color: "clr-2", message: "Unexpected foo.", ruleId: "foo" });
        });
    });
});
