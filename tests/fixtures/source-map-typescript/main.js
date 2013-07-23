var App = (function () {
    function App(id) {
        if (typeof id === "undefined") { id = 0; }
        this.id = id;
    }
    App.prototype.greet = function () {
        console.log("Hello!");
    };
    return App;
})();
var app = new App();

if (app.id == 2) {
    app.greet();
}
//@ sourceMappingURL=main.js.map
