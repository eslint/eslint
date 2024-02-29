/*eslint no-regex-spaces: "error", wrap-regex: "error"*/

function a() {
    return /  foo/.test("bar");
}
