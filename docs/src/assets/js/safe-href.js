/**
 * @fileoverview Safely parse http(s) URLs for navigation and links.
 */

/**
 * Returns a safe http(s) href for the given URL, or `undefined` if the URL is
 * invalid or uses a non-http(s) protocol.
 * @param {string} url The URL to parse.
 * @param {string} [base] Optional base URL for relative `url` values.
 * @returns {string|undefined} The normalized href, or `undefined`.
 */
function getSafeHref(url, base) {
	try {
		const parsed =
			typeof base === "undefined" ? new URL(url) : new URL(url, base);

		if (parsed.protocol === "http:" || parsed.protocol === "https:") {
			return parsed.href;
		}
	} catch (e) {
		if (!(e instanceof TypeError)) {
			throw e;
		}
	}

	return undefined;
}
