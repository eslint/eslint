/**
 * @fileoverview Checks that the ESLint package size stays under the configured limit (see SIZE_LIMIT)
 * by simulating an npm installation. Used in CI to prevent accidental size increases.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const fs = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");
const { execSync } = require("node:child_process");

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

const SIZE_LIMIT = 10 * 1024 * 1024;
const TEMP_DIR_PREFIX = "eslint-size-check";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Formats a number of bytes into a human-readable string.
 * @param {number} bytes The number of bytes to format
 * @returns {string} The formatted size string
 */
function formatBytes(bytes) {
	if (bytes === 0) return "0 Bytes";

	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Calculates the total size of a directory and its contents.
 * @param {string} dirPath The path to the directory to measure
 * @returns {Promise<number>} The total size in bytes
 */
async function calculateDirSize(dirPath) {
	let totalSize = 0;

	async function traverse(currentPath) {
		const files = await fs.readdir(currentPath);

		await Promise.all(
			files.map(async file => {
				const filePath = path.join(currentPath, file);
				const stats = await fs.stat(filePath);

				if (stats.isDirectory()) {
					await traverse(filePath);
				} else {
					totalSize += stats.size;
				}
			}),
		);
	}

	await traverse(dirPath);
	return totalSize;
}

//------------------------------------------------------------------------------
// Main
//------------------------------------------------------------------------------

(async () => {
	const originalDir = process.cwd();
	const tempDir = path.join(os.tmpdir(), `${TEMP_DIR_PREFIX}-${Date.now()}`);
	let tarballName;

	try {
		await fs.mkdir(tempDir);

		tarballName = execSync("npm pack --silent").toString().trim();
		await fs.rename(
			path.join(originalDir, tarballName),
			path.join(tempDir, tarballName),
		);

		execSync(`npm install ${tarballName}`, {
			cwd: tempDir,
		});

		const installedSize = await calculateDirSize(
			path.join(tempDir, "node_modules"),
		);

		if (installedSize > SIZE_LIMIT) {
			throw new Error(
				`Package size ${formatBytes(
					installedSize,
				)} exceeds limit of ${formatBytes(SIZE_LIMIT)}`,
			);
		}

		console.log(`✓ Package size validated (${formatBytes(installedSize)})`);
	} catch (error) {
		console.error(error.message);
		process.exitCode = 1;
	} finally {
		await fs.rm(tempDir, { recursive: true, force: true });
	}
})();
