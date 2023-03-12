(function () {
    const scrollUpBtn = document.getElementById("scroll_up_btn");

    if(window.innerWidth < 1400) {
        window.addEventListener("scroll", function () {
            if(this.document.body.scrollTop > 500 || this.document.documentElement.scrollTop > 500) {
                scrollUpBtn.style.display = "block";
            } else {
                scrollUpBtn.style.display = "none";
            }
        });
    }

    scrollUpBtn.addEventListener("click", function () {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    });
})();