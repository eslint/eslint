/**
 * @fileoverview Tests for pr-create.md.ejs
 * @author Nicholas C. Zakas
 * @copyright 2016 Nicholas C. Zakas. All rights reserved.
 * MIT License. See LICENSE in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    fs = require("fs"),
    path = require("path"),
    ejs = require("ejs");

//------------------------------------------------------------------------------
// Data
//------------------------------------------------------------------------------

var TEMPLATE_TEXT = fs.readFileSync(path.resolve(__dirname, "../../templates/pr-create.md.ejs"), "utf8");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("pr-create.md.ejs", function() {


    it("should greet the submitter by name", function() {
        var result = ejs.render(TEMPLATE_TEXT, {
            payload: {
                sender: {
                    login: "nzakas"
                }
            },
            meta: {}
        });

        assert.ok(result.indexOf("@nzakas") > -1);
    });

    it("should mention the CLA when one isn't found", function() {
        var result = ejs.render(TEMPLATE_TEXT, {
            payload: {
                sender: {
                    login: "nzakas"
                }
            },
            meta: { cla: false }
        });

        assert.ok(result.indexOf("http://eslint.org/cla") > -1);
    });

    it("should say LGTM when there are no problems with the pull request", function() {
        var result = ejs.render(TEMPLATE_TEXT, {
            payload: {
                sender: {
                    login: "nzakas"
                },
                commits: 1
            },
            meta: { cla: true }
        });

        assert.equal(result.trim(), "LGTM");
    });

    it("should mention squashing commits when more than one commit is found", function() {
        var result = ejs.render(TEMPLATE_TEXT, {
            payload: {
                sender: {
                    login: "nzakas"
                },
                commits: 2
            },
            meta: { cla: true }
        });

        assert.ok(result.indexOf("squash") > -1);
    });

    it("should mention commit message format when there's one commit and an invalid commit message is found", function() {
        var result = ejs.render(TEMPLATE_TEXT, {
            payload: {
                sender: {
                    login: "nzakas"
                },
                commits: 1
            },
            meta: {
                cla: true,
                commits: [
                    {
                        commit: {
                            message: "Foo bar"
                        }
                    }
                ]
            }
        });

        assert.ok(result.indexOf("begin with a tag") > -1);
        assert.ok(result.indexOf("require an issue") > -1);
    });

    it("should mention commit message length when there's a message longer than 72 characters", function() {
        var result = ejs.render(TEMPLATE_TEXT, {
            payload: {
                sender: {
                    login: "nzakas"
                },
                commits: 1
            },
            meta: {
                cla: true,
                commits: [
                    {
                        commit: {
                            message: "Fix: abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz (fixes #124)"
                        }
                    }
                ]
            }
        });

        assert.ok(result.indexOf("72 characters") > -1);
        assert.ok(result.indexOf("require an issue") === -1);
    });

    it("should not mention missing issue when there's one documentation commit", function() {
        var result = ejs.render(TEMPLATE_TEXT, {
            payload: {
                sender: {
                    login: "nzakas"
                },
                commits: 1
            },
            meta: {
                cla: true,
                commits: [
                    {
                        commit: {
                            message: "Docs: Foo bar"
                        }
                    }
                ]
            }
        });

        assert.equal(result.trim(), "LGTM");
        assert.ok(result.indexOf("require an issue") === -1);
    });

    it("should not mention missing issue or length check when there's one fix commit", function() {
        var result = ejs.render(TEMPLATE_TEXT, {
            payload: {
                sender: {
                    login: "nzakas"
                },
                commits: 1
            },
            meta: {
                cla: true,
                commits: [
                    {
                        commit: {
                            message: "Fix: Foo bar (fixes #1234)\nSome really long string. abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz"
                        }
                    }
                ]
            }
        });

        assert.equal(result.trim(), "LGTM");
        assert.ok(result.indexOf("require an issue") === -1);
    });

    it("should mention missing issue when there's a missing closing paren", function() {
        var result = ejs.render(TEMPLATE_TEXT, {
            payload: {
                sender: {
                    login: "nzakas"
                },
                commits: 1
            },
            meta: {
                cla: true,
                commits: [
                    {
                        commit: {
                            message: "Fix: Foo bar (fixes #1234"
                        }
                    }
                ]
            }
        });

        assert.ok(result.indexOf("require an issue") > -1);
    });

});
