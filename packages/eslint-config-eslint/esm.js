/**
 * @fileoverview the base eslint config for esm projects.
 * @author 唯然<weiran.zsd@outlook.com>
 */

 const base = require("./base.js");

 const cjsConfig = require("eslint-plugin-n/configs/recommended-script");
 const esmConfig = require("eslint-plugin-n/configs/recommended-module");
 
 // extends eslint-plugin-n's recommended config
 const nodeConfigs = [
    {
        files: ["**/*.js"],
        ...esmConfig
    },
    {
        files: ["**/*.cjs"],
        ...cjsConfig
    }
];
 
 module.exports = [...base, ...nodeConfigs];