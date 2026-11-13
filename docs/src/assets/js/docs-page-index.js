/**
 * @fileoverview Look up whether a documentation page exists for a version.
 */

"use strict";

(function (root) {
	const routeSets = new WeakMap();

	/**
	 * Normalizes a docs route so lookups ignore trailing slashes, `index`,
	 * `.html`, queries, and hashes.
	 * @param {string} route Route under a version root.
	 * @returns {string} Normalized route. The version root is an empty string.
	 */
	function normalizeDocsRoute(route) {
		let value = String(route ?? "");
		const hashIndex = value.indexOf("#");

		if (hashIndex !== -1) {
			value = value.slice(0, hashIndex);
		}

		const queryIndex = value.indexOf("?");

		if (queryIndex !== -1) {
			value = value.slice(0, queryIndex);
		}

		if (value.includes("%")) {
			try {
				value = decodeURIComponent(value);
			} catch {
				// Keep the raw route when percent-encoding is invalid.
			}
		}

		value = value.replace(/\.html$/iu, "");
		value = value.replace(/^\/+|\/+$/gu, "");
		value = value.replace(/\/index$/u, "");

		if (value === "index") {
			return "";
		}

		return value;
	}

	/**
	 * @param {Object<string, string[]>} pages Version path to route list.
	 * @param {string} versionPath Version base path such as `/docs/v8.x/`.
	 * @returns {Set<string>|null} Routes for that version, or `null` when it is not indexed.
	 */
	function routesForVersion(pages, versionPath) {
		if (!pages || typeof versionPath !== "string" || versionPath === "") {
			return null;
		}

		const key = versionPath.endsWith("/") ? versionPath : `${versionPath}/`;

		if (!Object.prototype.hasOwnProperty.call(pages, key)) {
			return null;
		}

		let sets = routeSets.get(pages);

		if (!sets) {
			sets = new Map();
			routeSets.set(pages, sets);
		}

		let routes = sets.get(key);

		if (!routes) {
			routes = new Set(pages[key].map(normalizeDocsRoute));
			sets.set(key, routes);
		}

		return routes;
	}

	/**
	 * Reports whether `route` is published for `versionPath`.
	 * @param {Object<string, string[]>|null|undefined} pages Version path to route list.
	 * @param {string} versionPath Version base path such as `/docs/v8.x/`.
	 * @param {string} route Route under that version, with or without a query or hash.
	 * @returns {boolean|null} `true` or `false` when that version is indexed, otherwise `null`.
	 */
	function docsPageExists(pages, versionPath, route) {
		const routes = routesForVersion(pages, versionPath);

		if (!routes) {
			return null;
		}

		return routes.has(normalizeDocsRoute(route));
	}

	if (root) {
		root.docsPageExists = function (versionPath, route) {
			return docsPageExists(root.ESLINT_DOCS_PAGES, versionPath, route);
		};
	}

	if (typeof module === "object" && module.exports) {
		module.exports = {
			docsPageExists,
			normalizeDocsRoute,
		};
	}
})(typeof window === "undefined" ? undefined : window);
