/**
 * @fileoverview Read-only Git commands for file selection and source reading.
 * @author GitHub Copilot
 */

"use strict";

const { spawn } = require("node:child_process");

/**
 * Runs Git without shell expansion or checkout filters.
 * @param {string} cwd The working directory.
 * @param {string[]} args Git arguments.
 * @param {AbortSignal} [signal] Cancellation signal.
 * @returns {Promise<Buffer>} The command output.
 */
function runGit(cwd, args, signal) {
	return new Promise((resolve, reject) => {
		const child = spawn("git", args, {
			cwd,
			signal,
			stdio: ["ignore", "pipe", "pipe"],
		});
		const stdout = [];
		const stderr = [];

		child.stdout.on("data", chunk => stdout.push(chunk));
		child.stderr.on("data", chunk => stderr.push(chunk));
		child.on("error", reject);
		child.on("close", (code, exitSignal) => {
			if (code === 0) {
				resolve(Buffer.concat(stdout));
			} else {
				reject(
					new Error(
						`Git file source: ${
							Buffer.concat(stderr).toString().trim() ||
							`Git terminated with ${exitSignal || `exit code ${code}`}.`
						}`,
					),
				);
			}
		});
	});
}

module.exports = { runGit };
