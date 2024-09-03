let foo;
export default [
    {
        ignores: ["subsubdir"]
    },
    {
        files: ['*.mjs'],
        rules: {
            "no-unused-vars": "error"
        }
    }
];
