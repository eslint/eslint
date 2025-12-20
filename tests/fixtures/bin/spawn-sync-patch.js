// Replaces `spawnSync` with a mock that logs its arguments for testing.

"use strict";

const childProcess = require("node:child_process");

childProcess.spawnSync = (...args) => {
    console.log("spawnSync called with args: %s", JSON.stringify(args));
};
