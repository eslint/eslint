/* inert polyfill 
 * source: https://cdn.rawgit.com/GoogleChrome/inert-polyfill/v0.1.0/inert-polyfill.min.js
 */
window.addEventListener("load", function () {
  function h(a, b, c) { if (0 > b) { if (a.previousElementSibling) { for (a = a.previousElementSibling; a.lastElementChild;)a = a.lastElementChild; return a } return a.parentElement } if (a != c && a.firstElementChild) return a.firstElementChild; for (; null != a;) { if (a.nextElementSibling) return a.nextElementSibling; a = a.parentElement } return null } function g(a) { for (; a && a !== document.documentElement;) { if (a.hasAttribute("inert")) return a; a = a.parentElement } return null } (function (a) {
    var b = document.createElement("style");
    b.type = "text/css"; b.styleSheet ? b.styleSheet.cssText = a : b.appendChild(document.createTextNode(a)); document.body.appendChild(b)
  })("/*[inert]*/[inert]{position:relative!important;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none}[inert]::before{content:'';display:block;position:absolute;top:0;left:0;right:0;bottom:0}"); var c = 0; document.addEventListener("keydown", function (a) { c = 9 === a.keyCode ? a.shiftKey ? -1 : 1 : 0 }); document.addEventListener("mousedown",
    function () { c = 0 }); document.body.addEventListener("focus", function (a) {
      var b = a.target, f = g(b); if (f) {
        if (document.hasFocus() && 0 !== c) {
          var d = document.activeElement, e = new KeyboardEvent("keydown", { keyCode: 9, which: 9, key: "Tab", code: "Tab", keyIdentifier: "U+0009", shiftKey: !!(0 > c), bubbles: !0 }); Object.defineProperty(e, "keyCode", { value: 9 }); document.activeElement.dispatchEvent(e); if (d != document.activeElement) return; for (d = f; ;) {
            d = h(d, c, f); if (!d) break; a: {
              e = b; if (!(0 > d.tabIndex) && (d.focus(), document.activeElement !== e)) {
                e =
                  !0; break a
              } e = !1
            } if (e) return
          }
        } b.blur(); a.preventDefault(); a.stopPropagation()
      }
    }, !0); document.addEventListener("click", function (a) { g(a.target) && (a.preventDefault(), a.stopPropagation()) }, !0)
});