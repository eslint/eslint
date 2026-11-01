/**
 * @fileoverview Reads captured Git blobs using an efficient batched Git process.
 * @author GitHub Copilot
 */

"use strict";

const { spawn } = require("node:child_process");

/**
 * A persistent git cat-file --batch client for a specific repository.
 */
class GitBatchClient {
	/**
	 * Creates a new GitBatchClient instance.
	 * @param {string} repository The repository root path.
	 * @param {Object} [options] Client options.
	 * @param {Function} [options.spawn] Custom spawn function for testing.
	 */
	constructor(repository, options = {}) {
		this.repository = repository;
		this.spawn = options.spawn || spawn;
		this.child = null;
		this.queue = [];
		this.writeQueue = [];
		this.writing = false;
		this.buffer = Buffer.alloc(0);
		this.state = "HEADER";
		this.expectedSize = 0;
		this.currentBlobId = "";
		this.closed = false;
		this.stderr = "";
		this.disposePromise = null;
	}

	/**
	 * Spawns the persistent git cat-file --batch process if not already running.
	 * @private
	 * @throws {Error} If the client is closed.
	 * @returns {void}
	 */
	_ensureProcess() {
		if (this.child) {
			return;
		}
		if (this.closed) {
			throw new Error("Git batch client is closed.");
		}

		this.child = this.spawn("git", ["cat-file", "--batch"], {
			cwd: this.repository,
			stdio: ["pipe", "pipe", "pipe"],
		});

		this.child.stdout.on("data", chunk => this._onStdout(chunk));
		this.child.stderr.on("data", chunk => {
			this.stderr += chunk.toString("utf8");
		});

		this.child.on("error", err => {
			this._cleanup(err);
		});

		this.child.on("close", (code, signal) => {
			const errorMsg =
				this.stderr.trim() ||
				(code !== null
					? `Git process exited with code ${code}.`
					: `Git process terminated by signal ${signal}.`);
			const err = new Error(`Git file source: ${errorMsg}`);

			this._cleanup(err);
		});
	}

	/**
	 * Rejects all pending requests and resets state.
	 * @param {Error} err The error to reject pending requests with.
	 * @private
	 * @returns {void}
	 */
	_cleanup(err) {
		this.child = null;
		this.writeQueue = [];
		this.writing = false;
		while (this.queue.length > 0) {
			const req = this.queue.shift();

			req.cleanup?.();
			if (!req.aborted) {
				req.reject(err || new Error("Git batch client closed."));
			}
		}
	}

	/**
	 * Flushes queued write items to stdin while honoring backpressure.
	 * @private
	 * @returns {void}
	 */
	_flushWrites() {
		if (this.writing || !this.child || this.writeQueue.length === 0) {
			return;
		}

		this.writing = true;

		while (this.writeQueue.length > 0) {
			const item = this.writeQueue[0];
			let ok;

			try {
				ok = this.child.stdin.write(item);
			} catch (err) {
				this._cleanup(err);
				return;
			}

			this.writeQueue.shift();

			if (!ok) {
				this.child.stdin.once("drain", () => {
					this.writing = false;
					this._flushWrites();
				});
				return;
			}
		}

		this.writing = false;
	}

	/**
	 * Handles data from stdout.
	 * @param {Buffer} chunk Stream chunk.
	 * @private
	 * @returns {void}
	 */
	_onStdout(chunk) {
		this.buffer = Buffer.concat([this.buffer, chunk]);
		this._processBuffer();
	}

	/**
	 * Processes the incoming buffer according to git cat-file --batch framing.
	 * @private
	 * @returns {void}
	 */
	_processBuffer() {
		while (true) {
			if (this.state === "HEADER") {
				const newlineIndex = this.buffer.indexOf(0x0a);

				if (newlineIndex === -1) {
					break;
				}

				const headerLine = this.buffer
					.subarray(0, newlineIndex)
					.toString("utf8");

				this.buffer = this.buffer.subarray(newlineIndex + 1);

				if (headerLine.endsWith(" missing")) {
					const req = this.queue.shift();

					if (req) {
						req.cleanup?.();
						if (!req.aborted) {
							req.reject(
								new Error(`Git object missing: ${req.blobId}`),
							);
						}
					}
					continue;
				}

				const match = /^([a-f\d]+)\s+blob\s+(\d+)$/u.exec(headerLine);

				if (!match) {
					const error = new Error(
						`Invalid Git batch response: ${headerLine}`,
					);

					this._cleanup(error);
					break;
				}

				this.currentBlobId = match[1];
				this.expectedSize = parseInt(match[2], 10);
				this.state = "CONTENT";
			}

			if (this.state === "CONTENT") {
				if (this.buffer.length < this.expectedSize + 1) {
					break;
				}

				const contentBytes = this.buffer.subarray(0, this.expectedSize);

				this.buffer = this.buffer.subarray(this.expectedSize + 1);
				this.state = "HEADER";

				const req = this.queue.shift();

				if (req) {
					req.cleanup?.();
					if (!req.aborted) {
						const text = contentBytes.toString("utf8");

						req.resolve(text);
					}
				}
			}
		}
	}

	/**
	 * Reads a blob using the batch protocol.
	 * @param {string} blobId The blob SHA.
	 * @param {{signal?: AbortSignal}} [options] Read options.
	 * @returns {Promise<string>} The UTF-8 decoded source content.
	 */
	async readFile(blobId, { signal } = {}) {
		if (signal?.aborted) {
			const error = new Error("The operation was aborted");

			error.name = "AbortError";
			throw error;
		}

		this._ensureProcess();

		return new Promise((resolve, reject) => {
			const req = {
				blobId,
				resolve,
				reject,
				aborted: false,
			};

			let cleanup = null;

			if (signal) {
				// eslint-disable-next-line jsdoc/require-jsdoc -- inline event listener
				function onAbort() {
					req.aborted = true;
					const error = new Error("The operation was aborted");

					error.name = "AbortError";
					reject(error);
				}

				signal.addEventListener("abort", onAbort, { once: true });
				cleanup = () => signal.removeEventListener("abort", onAbort);
			}

			req.cleanup = cleanup;
			this.queue.push(req);
			this.writeQueue.push(`${blobId}\n`);
			this._flushWrites();
		});
	}

	/**
	 * Closes the batch process and cleans up resources.
	 * @returns {Promise<void>}
	 */
	dispose() {
		if (this.disposePromise) {
			return this.disposePromise;
		}

		this.disposePromise = (async () => {
			this.closed = true;
			this.writeQueue = [];
			this.writing = false;

			const err = new Error("Git batch client is closed.");

			while (this.queue.length > 0) {
				const req = this.queue.shift();

				req.cleanup?.();
				if (!req.aborted) {
					req.reject(err);
				}
			}

			if (this.child) {
				const child = this.child;

				this.child = null;
				try {
					child.stdin.end();
				} catch {
					// ignore
				}
				await new Promise(resolve => {
					let timer = null;

					// eslint-disable-next-line jsdoc/require-jsdoc -- inline callback
					function done() {
						if (timer) {
							clearTimeout(timer);
							timer = null;
						}
						resolve();
					}

					child.once("close", done);
					timer = setTimeout(() => {
						try {
							child.kill();
						} catch {
							// ignore
						}
						done();
					}, 500);
				});
			}
		})();

		return this.disposePromise;
	}
}

/**
 * Manages repository-scoped Git batch clients.
 */
class GitBatchProvider {
	/**
	 * Creates a new GitBatchProvider.
	 * @param {Object} [options] Provider options.
	 */
	constructor(options = {}) {
		this.clients = new Map();
		this.options = options;
		this.disposed = false;
		this.disposePromise = null;
	}

	/**
	 * Reads the blob captured by a selector.
	 * @param {import("../file-source").FileInput} input Selected input with Git metadata.
	 * @param {{signal?: AbortSignal}} [options] Read options.
	 * @returns {Promise<string>} Staged UTF-8 source text.
	 */
	async readFile(input, options = {}) {
		if (this.disposed) {
			throw new Error("Git batch provider is closed.");
		}

		if (
			!input.blobId ||
			!/^[a-f\d]{40,64}$/u.test(input.blobId) ||
			!input.repository
		) {
			throw new Error(
				`Git input has no captured blob ID: ${input.filePath}`,
			);
		}

		let client = this.clients.get(input.repository);

		if (!client) {
			client = new GitBatchClient(input.repository, this.options);
			this.clients.set(input.repository, client);
		}

		return client.readFile(input.blobId, options);
	}

	/**
	 * Disposes all active batch clients.
	 * @returns {Promise<void>}
	 */
	dispose() {
		if (this.disposePromise) {
			return this.disposePromise;
		}

		this.disposePromise = (async () => {
			this.disposed = true;
			const clients = [...this.clients.values()];

			this.clients.clear();
			await Promise.all(clients.map(client => client.dispose()));
		})();

		return this.disposePromise;
	}
}

const defaultProvider = new GitBatchProvider();

/**
 * Default readFile function using the shared default provider.
 * @param {import("../file-source").FileInput} input Selected input.
 * @param {{signal?: AbortSignal}} [options] Read options.
 * @returns {Promise<string>} Staged UTF-8 source text.
 */
function readFile(input, options) {
	return defaultProvider.readFile(input, options);
}

/**
 * Creates a dedicated Git batch provider instance.
 * @param {Object} [options] Provider options.
 * @returns {GitBatchProvider} A new provider instance.
 */
function createGitProvider(options) {
	return new GitBatchProvider(options);
}

module.exports = {
	readFile,
	createGitProvider,
	GitBatchProvider,
	GitBatchClient,
};
