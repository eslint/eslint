/**
 * @fileoverview Optimized version of the `text-table` npm module to improve performance by replacing inefficient regex-based
 * whitespace trimming with a modern built-in method.
 *
 * @author Nitin Kumar
 *
 * This modification addresses a performance issue reported in https://github.com/eslint/eslint/issues/18709
 *
 * The `text-table` module is published under the MIT License. For the original source, refer to:
 * https://www.npmjs.com/package/text-table.
 */

"use strict";

function dotindex(c) {
    const m = /\.[^.]*$/u.exec(c);

    return m ? m.index + 1 : c.length;
}

function reduce(xs, f, init) {
    if (xs.reduce) {
        return xs.reduce(f, init);
    }
    let i = 0;
    const acc = arguments.length >= 3 ? init : xs[i++];

    for (; i < xs.length; i++) {
        f(acc, xs[i], i);
    }
    return acc;
}

function forEach(xs, f) {
    if (xs.forEach) {
        return xs.forEach(f);
    }
    for (let i = 0; i < xs.length; i++) {
        f.call(xs, xs[i], i);
    }
}

function map(xs, f) {
    if (xs.map) {
        return xs.map(f);
    }
    const res = [];

    for (let i = 0; i < xs.length; i++) {
        res.push(f.call(xs, xs[i], i));
    }
    return res;
}

module.exports = function(rows_, opts) {
    if (!opts) {
        opts = {};
    }
    const hsep = typeof opts.hsep === "undefined" ? "  " : opts.hsep;
    const align = opts.align || [];
    const stringLength = opts.stringLength ||
        function(s) {
            return String(s).length;
        };
    const dotsizes = reduce(rows_, (acc, row) => {
        forEach(row, (c, ix) => {
            const n = dotindex(c);

            if (!acc[ix] || n > acc[ix]) {
                acc[ix] = n;
            }
        });
        return acc;
    }, []);

    const rows = map(rows_, row => map(row, (c_, ix) => {
        const c = String(c_);

        if (align[ix] === ".") {
            const index = dotindex(c);
            const size = dotsizes[ix] + (/\./u.test(c) ? 1 : 2) -
                    (stringLength(c) - index);

            return c + Array(size).join(" ");
        }
        return c;
    }));

    const sizes = reduce(rows, (acc, row) => {
        forEach(row, (c, ix) => {
            const n = stringLength(c);

            if (!acc[ix] || n > acc[ix]) {
                acc[ix] = n;
            }
        });
        return acc;
    }, []);

    return map(rows, row => map(row, (c, ix) => {
        const n = (sizes[ix] - stringLength(c)) || 0;
        const s = Array(Math.max(n + 1, 1)).join(" ");

        if (align[ix] === "r" || align[ix] === ".") {
            return s + c;
        }
        if (align[ix] === "c") {
            return Array(Math.ceil(n / 2 + 1)).join(" ") +
                    c + Array(Math.floor(n / 2 + 1)).join(" ");
        }

        return c + s;
    }).join(hsep).trimEnd()).join("\n");
};
