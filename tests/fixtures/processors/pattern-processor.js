"use strict";

/**
 * Define a processor which extract code blocks `pattern` regexp matched.
 * The defined processor supports autofix, but doesn't have `supportsAutofix` property.
 *
 * @param {RegExp} pattern The regular expression pattern for code blocks.
 *   The first capture group becomes the file extension of the code block.
 *   The second capture group becomes the text of the code block.
 * @returns {Processor} The defined processor.
 */
exports.defineProcessor = (pattern, legacy = false) => {
    const blocksMap = new Map();

    return {
        preprocess(wholeCode, filename) {
            const blocks = [];
            blocksMap.set(filename, blocks);

            // Extract code blocks.
            let match;
            while ((match = pattern.exec(wholeCode)) !== null) {
                const [codeBlock, ext, text] = match;
                const filename = `${blocks.length}.${ext}`;
                const offset = match.index + codeBlock.indexOf(text);
                const lineOffset = wholeCode.slice(0, match.index).split("\n").length;

                blocks.push({ text, filename, lineOffset, offset });
            }

            if (legacy) {
                return blocks.map(b => b.text);
            }
            return blocks;
        },

        postprocess(messageLists, filename) {
            const blocks = blocksMap.get(filename);
            blocksMap.delete(filename);

            // Fix the location of reports.
            if (blocks) {
                for (let i = 0; i < messageLists.length; ++i) {
                    const messages = messageLists[i];
                    const { lineOffset, offset } = blocks[i];

                    for (const message of messages) {
                        message.line += lineOffset;
                        if (message.endLine != null) {
                            message.endLine += lineOffset;
                        }
                        if (message.fix != null) {
                            message.fix.range[0] += offset;
                            message.fix.range[1] += offset;
                        }
                    }
                }
            }

            return [].concat(...messageLists);
        }
    };
};
