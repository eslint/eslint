(function () {
    const scrollUpBtn = document.getElementById("scroll_up_btn");

    if(window.innerWidth < 1400) {
        window.addEventListener("scroll", function () {
            if(this.document.body.scrollTop > 500 || this.document.documentElement.scrollTop > 500) {
                scrollUpBtn.style.display = "flex";
            } else {
                scrollUpBtn.style.display = "none";
            }
        });
    }
})();