"use strict";

const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginTOC = require("eleventy-plugin-nesting-toc");
const slugify = require("slugify");
const markdownItAnchor = require("markdown-it-anchor");
const Image = require("@11ty/eleventy-img");
const path = require("path");

const {
    DateTime
} = require("luxon");

module.exports = function(eleventyConfig) {

    /*
     * The site is loaded from /docs on eslint.org and so we need to adjust
     * the path prefix so URLs are evaluated correctly.
     *
     * The path prefix is turned off for `npm start` and deploy previews so we can properly
     * see changes before deployed.
     */
    const pathPrefix = ["local-serve", "deploy-preview"].includes(process.env.CONTEXT) ? "" : "/docs";

    //------------------------------------------------------------------------------
    // Filters
    //------------------------------------------------------------------------------

    eleventyConfig.addFilter("limitTo", (arr, limit) => arr.slice(0, limit));

    eleventyConfig.addFilter("jsonify", variable => JSON.stringify(variable));

    eleventyConfig.addFilter("slugify", str => {
        if (!str) {
            return "";
        }

        return slugify(str, {
            lower: true,
            strict: true,
            remove: /["]/gu
        });
    });

    eleventyConfig.addFilter("URIencode", str => {
        if (!str) {
            return "";
        }
        return encodeURI(str);
    });

    /* order collection by the order specified in the front matter */
    eleventyConfig.addFilter("sortByPageOrder", values => values.slice().sort((a, b) => a.data.order - b.data.order));

    eleventyConfig.addFilter("readableDate", dateObj => {

        // turn it into a JS Date string
        const date = new Date(dateObj);

        // pass it to luxon for formatting
        return DateTime.fromJSDate(date).toFormat("dd MMM, yyyy");
    });

    eleventyConfig.addFilter("blogPermalinkDate", dateObj => {

        // turn it into a JS Date string
        const date = new Date(dateObj);

        // pass it to luxon for formatting
        return DateTime.fromJSDate(date).toFormat("yyyy/MM");
    });

    eleventyConfig.addFilter("readableDateFromISO", ISODate => DateTime.fromISO(ISODate).toUTC().toLocaleString(DateTime.DATE_FULL));

    eleventyConfig.addFilter("dollars", value => new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(value));

    /*
     * parse markdown from includes, used for author bios
     * Source: https://github.com/11ty/eleventy/issues/658
     */
    eleventyConfig.addFilter("markdown", value => {
        const markdown = require("markdown-it")({
            html: true
        });

        return markdown.render(value);
    });

    /*
     * Removes `.html` suffix from the given url.
     * `page.url` will include the `.html` suffix for all documents
     * except for those written as `index.html` (their `page.url` ends with a `/`).
     */
    eleventyConfig.addFilter("prettyURL", url => {
        if (url.endsWith(".html")) {
            return url.slice(0, -".html".length);
        }

        return url;
    });

    //------------------------------------------------------------------------------
    // Plugins
    //------------------------------------------------------------------------------

    eleventyConfig.addPlugin(eleventyNavigationPlugin);
    eleventyConfig.addPlugin(syntaxHighlight, {
        alwaysWrapLineHighlights: true
    });
    eleventyConfig.addPlugin(pluginRss);
    eleventyConfig.addPlugin(pluginTOC, {
        tags: ["h2", "h3", "h4"],
        wrapper: "nav", // Element to put around the root `ol`
        wrapperClass: "c-toc", // Class for the element around the root `ol`
        headingText: "", // Optional text to show in heading above the wrapper element
        headingTag: "h2" // Heading tag when showing heading above the wrapper element
    });

    // add IDs to the headers
    const markdownIt = require("markdown-it");

    eleventyConfig.setLibrary("md",
        markdownIt({
            html: true,
            linkify: true,
            typographer: true

        }).use(markdownItAnchor, {}).disable("code"));

    //------------------------------------------------------------------------------
    // Shortcodes
    //------------------------------------------------------------------------------

    eleventyConfig.addNunjucksShortcode("link", function(url) {

        // eslint-disable-next-line no-invalid-this -- Eleventy API
        const urlData = this.ctx.further_reading_links[url];

        if (!urlData) {
            throw new Error(`Data missing for ${url}`);
        }

        const {
            domain,
            title,
            logo
        } = urlData;

        return `
        <article class="resource">
            <div class="resource__image">
                <img class="resource__img" width="75" height="75" src="${logo}" alt="Avatar image for ${domain}" onerror="this.onerror = null; this.src = '/icon.svg'" />
            </div>
            <div class="resource__content">
                <a href="${url}" class="resource__title"> ${title} </a><br>
                <span class="resource__domain"> ${domain}</span>
            </div>
            <svg class="c-icon resource__icon" width="13" height="12" viewBox="0 0 13 12" fill="none">
            <path d="M1.5 11L11.5 1M11.5 1H1.5M11.5 1V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </article>`;
    });

    eleventyConfig.addShortcode("fixable", () => `
        <div class="rule-category">
            <span class="rule-category__icon">🛠 <span class="visually-hidden">Fixable</span></span>
            <p class="rule-category__description">
                if some problems reported by the rule are automatically fixable by the <code>--fix</code> command line option
            </p>
        </div>`);

    eleventyConfig.addShortcode("recommended", () => `
        <div class="rule-category">
            <span class="rule-category__icon">✅ <span class="visually-hidden">Recommended</span></span>
            <p class="rule-category__description">
                if the <code>"extends": "eslint:recommended"</code> property in a configuration file enables the rule.
            </p>
        </div>`);

    eleventyConfig.addShortcode("hasSuggestions", () => `
        <div class="rule-category">
            <span class="rule-category__icon">💡 <span class="visually-hidden">hasSuggestions</span></span>
            <p class="rule-category__description">
                if some problems reported by the rule are manually fixable by editor suggestions
            </p>
        </div>`);

    eleventyConfig.addShortcode("related_rules", arr => {
        const rules = arr;
        let items = "";

        rules.forEach(rule => {
            const listItem = `<li class="related-rules__list__item">
                <a href="${pathPrefix}/rules/${rule}">
                    <span>${rule}</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </a>
            </li>`;

            items += listItem;
        });

        return `
        <ul class="related-rules__list" role="list">
           ${items}
        </ul>`;
    });

    eleventyConfig.addShortcode("important", (text, url) => `
        <div role="note" class="alert alert--important">
            <svg class="alert__icon" aria-hidden="true" focusable="false" width="21" height="18" viewBox="0 0 21 18" fill="none">
                <path d="M10.4998 6.66666V9.99999M10.4998 13.3333H10.5081M9.0748 2.38333L2.01647 14.1667C1.87094 14.4187 1.79394 14.7044 1.79313 14.9954C1.79231 15.2864 1.86771 15.5726 2.01183 15.8254C2.15594 16.0783 2.36374 16.2889 2.61456 16.4365C2.86538 16.5841 3.15047 16.6635 3.44147 16.6667H17.5581C17.8491 16.6635 18.1342 16.5841 18.385 16.4365C18.6359 16.2889 18.8437 16.0783 18.9878 15.8254C19.1319 15.5726 19.2073 15.2864 19.2065 14.9954C19.2057 14.7044 19.1287 14.4187 18.9831 14.1667L11.9248 2.38333C11.7762 2.13841 11.5671 1.93593 11.3175 1.7954C11.0679 1.65487 10.7862 1.58104 10.4998 1.58104C10.2134 1.58104 9.93175 1.65487 9.68214 1.7954C9.43254 1.93593 9.22336 2.13841 9.0748 2.38333Z" stroke="currentColor" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <div class="alert__content">
                <span class="alert__type">Important</span>
                <div class="alert__text">${text}</div>
                <a href="${url}" class="alert__learn-more">Learn more</a>
            </div>
        </div>`);

    eleventyConfig.addShortcode("warning", (text, url) => `
        <div role="note" class="alert alert--warning">
            <svg class="alert__icon" aria-hidden="true" focusable="false" width="19" height="20" viewBox="0 0 19 20" fill="none">
                <path d="M9.49999 6.66667V10M9.49999 13.3333H9.50832M17.8333 10C17.8333 14.6024 14.1024 18.3333 9.49999 18.3333C4.89762 18.3333 1.16666 14.6024 1.16666 10C1.16666 5.39763 4.89762 1.66667 9.49999 1.66667C14.1024 1.66667 17.8333 5.39763 17.8333 10Z" stroke="currentColor" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <div class="alert__content">
                <span class="alert__type">Warning</span>
                <div class="alert__text">${text}</div>
                <a href="${url}" class="alert__learn-more">Learn more</a>
            </div>
        </div>`);

    eleventyConfig.addShortcode("tip", (text, url) => `
        <div role="note" class="alert alert--tip">
            <svg class="alert__icon" aria-hidden="true" focusable="false" width="19" height="20" viewBox="0 0 19 20" fill="none">
                <path d="M17.8333 9.23333V10C17.8323 11.797 17.2504 13.5456 16.1744 14.9849C15.0985 16.4241 13.5861 17.4771 11.8628 17.9866C10.1395 18.4961 8.29771 18.4349 6.61205 17.8122C4.92639 17.1894 3.4872 16.0384 2.50912 14.5309C1.53105 13.0234 1.06648 11.2401 1.18472 9.44693C1.30296 7.6538 1.99766 5.94694 3.16522 4.58089C4.33278 3.21485 5.91064 2.26282 7.66348 1.86679C9.41632 1.47076 11.2502 1.65195 12.8917 2.38333M17.8333 3.33333L9.49999 11.675L6.99999 9.175" stroke="currentColor" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <div class="alert__content">
                <span class="alert__type">Tip</span>
                <div class="alert__text">${text}</div>
                <a href="${url}" class="alert__learn-more">Learn more</a>
            </div>
        </div>`);


    eleventyConfig.addWatchTarget("./src/assets/");

    //------------------------------------------------------------------------------
    // File PassThroughs
    //------------------------------------------------------------------------------

    eleventyConfig.addPassthroughCopy({
        "./src/static": "/"
    });

    eleventyConfig.addPassthroughCopy("./src/assets/");

    eleventyConfig.addPassthroughCopy({
        "./src/content/**/*.png": "/assets/images"
    });

    eleventyConfig.addPassthroughCopy({
        "./src/content/**/*.jpg": "/assets/images"
    });

    eleventyConfig.addPassthroughCopy({
        "./src/content/**/*.jpeg": "/assets/images"
    });

    eleventyConfig.addPassthroughCopy({
        "./src/content/**/*.svg": "/assets/images"
    });

    eleventyConfig.addPassthroughCopy({
        "./src/content/**/*.mp4": "/assets/videos"
    });

    eleventyConfig.addPassthroughCopy({
        "./src/content/**/*.pdf": "/assets/documents"
    });

    eleventyConfig.addPassthroughCopy({
        "./node_modules/algoliasearch/dist/algoliasearch-lite.esm.browser.js": "/assets/js/algoliasearch.js"
    });

    //------------------------------------------------------------------------------
    // Collections
    //------------------------------------------------------------------------------

    eleventyConfig.addCollection("docs", collection => collection.getFilteredByGlob("./src/**/**/*.md"));

    eleventyConfig.addCollection("library", collection => collection.getFilteredByGlob("./src/library/**/*.md"));


    // START, eleventy-img (https://www.11ty.dev/docs/plugins/image/)
    /* eslint-disable-next-line jsdoc/require-jsdoc
       --
       This shortcode is currently unused. If we are going to use it, add JSDoc
       and describe what exactly is this doing.
    */
    function imageShortcode(source, alt, cls, sizes = "(max-width: 768px) 100vw, 50vw") {
        const options = {
            widths: [600, 900, 1500],
            formats: ["webp", "jpeg"],
            urlPath: "/assets/images/",
            outputDir: "./_site/assets/images/",
            filenameFormat(id, src, width, format) {
                const extension = path.extname(src);
                const name = path.basename(src, extension);

                return `${name}-${width}w.${format}`;
            }
        };

        /**
         * Resolves source
         * @returns {string} URL or a local file path
         */
        function getSRC() {
            if (source.startsWith("http://") || source.startsWith("https://")) {
                return source;
            }

            /*
             * for convenience, you only need to use the image's name in the shortcode,
             * and this will handle appending the full path to it
             */
            return path.join("./src/assets/images/", source);
        }

        const fullSrc = getSRC();


        // generate images
        Image(fullSrc, options); // eslint-disable-line new-cap -- `Image` is a function

        const imageAttributes = {
            alt,
            class: cls,
            sizes,
            loading: "lazy",
            decoding: "async"
        };

        // get metadata
        const metadata = Image.statsSync(fullSrc, options);

        return Image.generateHTML(metadata, imageAttributes);
    }
    eleventyConfig.addShortcode("image", imageShortcode);

    // END, eleventy-img

    //------------------------------------------------------------------------------
    // Settings
    //------------------------------------------------------------------------------

    /*
     * When we run `eleventy --serve`, Eleventy 1.x uses browser-sync to serve the content.
     * By default, browser-sync will not serve `foo/bar.html` when we request `foo/bar`.
     * Thus, we need to specify "html" in `server.serveStaticOptions.extensions` so that
     * pretty links without `.html` can work in a local development environment.
     *
     * Note that eleventy is doing a shallow merge into its own browser-sync config,
     * so this will unfortunately completely overwrite `server` settings.
     * https://github.com/11ty/eleventy/blob/v1.0.1/src/EleventyServe.js#L78-L91
     * Therefore, we also have to specify `baseDir` here.
     */
    eleventyConfig.setBrowserSyncConfig({
        server: {
            baseDir: "_site",
            serveStaticOptions: {
                extensions: ["html"]
            }
        }
    });


    return {
        passthroughFileCopy: true,

        pathPrefix,

        markdownTemplateEngine: "njk",
        dataTemplateEngine: "njk",
        htmlTemplateEngine: "njk",

        dir: {
            input: "src",
            includes: "_includes",
            layouts: "_includes/layouts",
            data: "_data",
            output: "_site"
        }
    };
};
