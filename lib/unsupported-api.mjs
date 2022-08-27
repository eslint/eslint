/**
 * @fileoverview APIs that are not officially supported by ESLint.
 *      These APIs may change or be removed at any time. Use at your
 *      own risk.
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

import unsupportedAPI from './unsupported-api.js';

const {
    builtinRules,
    FlatESLint,
    FlatRuleTester,
    FileEnumerator
} = unsupportedAPI;

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

export {
    builtinRules,
    FlatESLint,
    FlatRuleTester,
    FileEnumerator
};
