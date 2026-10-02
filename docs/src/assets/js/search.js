/**
 * @fileoverview Search functionality
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import algoliasearch from "./algoliasearch.js";

//-----------------------------------------------------------------------------
// Initialization
//-----------------------------------------------------------------------------

// search
const client = algoliasearch("L633P0C2IR", "bb6bbd2940351f3afc18844a6b06a6e8");
const index = client.initIndex("eslint");

// page
const resultsElement = document.querySelector("#search-results");
const resultsLiveRegion = document.querySelector(
	"#search-results-announcement",
);
const searchInput = document.querySelector("#search");
const searchClearBtn = document.querySelector("#search__clear-btn");
const poweredByLink = document.querySelector(".search_powered-by-wrapper");
let activeIndex = -1;
let searchQuery;
let caretPosition = 0;

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/**
 * Executes a search against the Algolia index.
 * @param {string} query The search query to execute.
 * @returns {Promise<Array<object>>} The search results.
 */
function fetchSearchResults(query) {
	return index
		.search(query, {
			facetFilters: ["tags:docs"],
		})
		.then(({ hits }) => hits);
}

/**
 * Clears the search results from the display.
 * If the removeEventListener flag is true, removes the click event listener from the document.
 * @param {boolean} [removeEventListener=false] - Optional flag to indicate if the click event listener should be removed. Default is false.
 * @returns {void} - This function doesn't return anything.
 */
function clearSearchResults(removeEventListener = false) {
	resultsElement.innerHTML = "";
	if (removeEventListener && document.clickEventAdded) {
		document.removeEventListener("click", handleDocumentClick);
		document.clickEventAdded = false;
	}
}

/**
 * Displays a "No results found" message in both the live region and results display area.
 * This is typically used when no matching results are found in the search.
 * @returns {void} - This function doesn't return anything.
 */
function showNoResults() {
	resultsLiveRegion.innerHTML = "No results found.";
	resultsElement.innerHTML = "No results found.";
	resultsElement.setAttribute("data-results", "false");
}

/**
 * Clears any "No results found" message from the live region and results display area.
 * @returns {void} - This function doesn't return anything.
 */
function clearNoResults() {
	resultsLiveRegion.innerHTML = "";
	resultsElement.innerHTML = "";
}

/**
 * Returns the base path of the currently selected docs version
 * from the version switcher (e.g. "/docs/v8.x/", "/docs/latest/").
 * @returns {string|null} The version base path, or null if unavailable.
 */
function getCurrentVersionPath() {
	const versionSelect =
		document.querySelector("#version-select") ||
		document.querySelector("#nav-version-select");

	if (versionSelect) {
		const selected = versionSelect.options[versionSelect.selectedIndex];

		if (selected) {
			const dataUrl = selected.getAttribute("data-url");

			if (dataUrl && !dataUrl.startsWith("http")) {
				return dataUrl;
			}
		}
	}
	return null;
}

/**
 * Rewrites an Algolia search result URL to point to the currently
 * selected docs version instead of the indexed version (typically "latest").
 * @param {string} url The original result URL from Algolia.
 * @returns {string} The adjusted URL for the current version.
 */
function adjustSearchResultUrl(url) {
	const currentVersionPath = getCurrentVersionPath();

	if (!currentVersionPath) {
		return url;
	}

	return url.replace(/\/docs\/[^/]+\//, currentVersionPath);
}

/**
 * Sets a safe http(s) URL on an anchor (rejects javascript: and other schemes).
 * @param {HTMLAnchorElement} anchor The anchor element.
 * @param {string} url The destination URL.
 * @returns {void}
 */
function setSafeHref(anchor, url) {
	const adjusted = adjustSearchResultUrl(url);

	try {
		const parsed = new URL(adjusted, window.location.href);

		if (parsed.protocol === "http:" || parsed.protocol === "https:") {
			anchor.href = parsed.href;
		}
	} catch (e) {
		if (e instanceof TypeError) {
			// Invalid URL: leave href unset
		} else {
			throw e;
		}
	}
}

/**
 * Appends highlight markup from Algolia by allowing only text, <em>, and <br>
 * (avoids assigning remote HTML to innerHTML).
 * @param {HTMLElement} parent The container element.
 * @param {string} htmlString The highlight HTML from Algolia.
 * @returns {void}
 */
function appendSanitizedHighlight(parent, htmlString) {
	const parser = new DOMParser();
	const doc = parser.parseFromString(htmlString, "text/html");

	/**
	 * @param {Node} node The node to copy.
	 * @param {HTMLElement} target The parent to append into.
	 */
	function appendNode(node, target) {
		if (node.nodeType === Node.TEXT_NODE) {
			target.appendChild(document.createTextNode(node.textContent));
			return;
		}

		if (node.nodeType !== Node.ELEMENT_NODE) {
			return;
		}

		const tag = /** @type {Element} */ (node).tagName.toLowerCase();

		if (tag === "em") {
			const em = document.createElement("em");

			if (node.className) {
				em.className = node.className;
			}

			node.childNodes.forEach(child => appendNode(child, em));
			target.appendChild(em);
		} else if (tag === "br") {
			target.appendChild(document.createElement("br"));
		} else {
			node.childNodes.forEach(child => appendNode(child, target));
		}
	}

	doc.body.childNodes.forEach(child => appendNode(child, parent));
}

/**
 * Displays the given search results in the page.
 * @param {Array<object>} results The search results to display.
 * @returns {void}
 */
function displaySearchResults(results) {
	clearSearchResults();

	if (results.length) {
		const list = document.createElement("ul");
		list.setAttribute("role", "list");
		list.classList.add("search-results__list");
		resultsElement.append(list);
		resultsElement.setAttribute("data-results", "true");
		activeIndex = -1;

		for (const result of results) {
			const listItem = document.createElement("li");
			listItem.classList.add("search-results__item");
			const maxLvl = Math.max(
				...Object.keys(result._highlightResult.hierarchy).map(k =>
					Number(k.substring(3)),
				),
			);
			const title = document.createElement("h2");

			title.classList.add("search-results__item__title");

			const link = document.createElement("a");

			setSafeHref(link, result.url);
			link.textContent = result.hierarchy.lvl0;
			title.appendChild(link);

			const context = document.createElement("p");

			context.classList.add("search-results__item__context");

			const highlightHtml =
				typeof result._highlightResult.content !== "undefined"
					? result._highlightResult.content.value
					: result._highlightResult.hierarchy[`lvl${maxLvl}`].value;

			appendSanitizedHighlight(context, highlightHtml);
			listItem.appendChild(title);
			listItem.appendChild(context);
			list.append(listItem);
		}
	} else {
		showNoResults();
	}
}

// Check if an element is currently scrollable
function isScrollable(element) {
	return element && element.clientHeight < element.scrollHeight;
}

// Ensure given child element is within the parent's visible scroll area
function maintainScrollVisibility(activeElement, scrollParent) {
	const { offsetHeight, offsetTop } = activeElement;
	const { offsetHeight: parentOffsetHeight, scrollTop } = scrollParent;

	const isAbove = offsetTop < scrollTop;
	const isBelow = offsetTop + offsetHeight > scrollTop + parentOffsetHeight;

	if (isAbove) {
		scrollParent.scrollTo(0, offsetTop);
	} else if (isBelow) {
		scrollParent.scrollTo(0, offsetTop - parentOffsetHeight + offsetHeight);
	}
}

/**
 * Debounces the provided callback with a given delay.
 * @param {Function} callback The callback that needs to be debounced.
 * @param {Number} delay Time in ms that the timer should wait before the callback is executed.
 * @returns {Function} Returns the new debounced function.
 */
function debounce(callback, delay) {
	let timer;
	return (...args) => {
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => callback.apply(this, args), delay);
	};
}

/**
 * Debounced function to fetch search results after 300ms of inactivity.
 * Calls `fetchSearchResults` to retrieve data and `displaySearchResults` to show them.
 * If an error occurs, clears the search results.
 * @param {string} query - The search query.
 * @returns {void} - No return value.
 * @see debounce - Limits the number of requests during rapid typing.
 */
const debouncedFetchSearchResults = debounce(query => {
	fetchSearchResults(query)
		.then(displaySearchResults)
		.catch(() => {
			clearSearchResults(true);
		});
}, 300);

/**
 * Handles the document click event to clear search results if the user clicks outside of the search input or results element.
 * @param {MouseEvent} e - The event object representing the click event.
 * @returns {void} - This function does not return any value. It directly interacts with the UI by clearing search results.
 */
const handleDocumentClick = e => {
	if (e.target !== resultsElement && e.target !== searchInput) {
		clearSearchResults(true);
	}
};

//-----------------------------------------------------------------------------
// Event Handlers
//-----------------------------------------------------------------------------

// listen for input changes
if (searchInput)
	searchInput.addEventListener("keyup", function (e) {
		const query = searchInput.value;

		if (query === searchQuery) return;

		if (query.length) searchClearBtn.removeAttribute("hidden");
		else searchClearBtn.setAttribute("hidden", "");

		if (query.length > 2) {
			debouncedFetchSearchResults(query);
			if (!document.clickEventAdded) {
				document.addEventListener("click", handleDocumentClick);
				document.clickEventAdded = true;
			}
		} else {
			clearSearchResults(true);
		}

		searchQuery = query;
	});

if (searchClearBtn) {
	searchClearBtn.addEventListener("click", function () {
		searchInput.value = "";
		searchInput.focus();
		clearSearchResults(true);
		searchClearBtn.setAttribute("hidden", "");
	});

	searchInput.addEventListener("blur", function () {
		caretPosition = searchInput.selectionStart;
	});

	searchInput.addEventListener("focus", function () {
		if (searchInput.selectionStart !== caretPosition) {
			searchInput.setSelectionRange(caretPosition, caretPosition);
		}
	});
}

if (poweredByLink) {
	poweredByLink.addEventListener("focus", function () {
		clearSearchResults();
	});
}

if (resultsElement) {
	resultsElement.addEventListener("keydown", e => {
		if (
			e.key !== "ArrowUp" &&
			e.key !== "ArrowDown" &&
			e.key !== "Tab" &&
			e.key !== "Shift" &&
			e.key !== "Enter"
		) {
			searchInput.focus();
		}
	});
}

document.addEventListener("keydown", function (e) {
	const searchResults = Array.from(
		document.querySelectorAll(".search-results__item"),
	);
	const isArrowKey = e.key === "ArrowUp" || e.key === "ArrowDown";

	if (e.key === "Escape") {
		e.preventDefault();
		if (searchResults.length) {
			clearSearchResults(true);
			searchInput.focus();
		} else if (document.activeElement === searchInput) {
			clearNoResults();
			searchInput.blur();
		}
	}

	if ((e.metaKey || e.ctrlKey) && e.key === "k") {
		e.preventDefault();
		searchInput.focus();
		document
			.querySelector(".search")
			.scrollIntoView({ behavior: "smooth", block: "start" });
	}

	if (!searchResults.length) return;

	if (isArrowKey) {
		e.preventDefault();

		if (e.key === "ArrowUp") {
			activeIndex =
				activeIndex - 1 < 0
					? searchResults.length - 1
					: activeIndex - 1;
		} else if (e.key === "ArrowDown") {
			activeIndex =
				activeIndex + 1 < searchResults.length ? activeIndex + 1 : 0;
		}

		if (activeIndex !== -1) {
			const activeSearchResult = searchResults[activeIndex];
			activeSearchResult.querySelector("a").focus();

			if (isScrollable(resultsElement)) {
				maintainScrollVisibility(activeSearchResult, resultsElement);
			}
		}
	}
});
