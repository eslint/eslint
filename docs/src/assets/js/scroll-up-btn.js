(function () {
    const scrollUpBtn = document.getElementById("scroll-up-btn");

    if(window.innerWidth < 1400) {
        window.addEventListener("scroll", function () {
            if(document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
                scrollUpBtn.style.display = "flex";
            } else {
                scrollUpBtn.style.display = "none";
            }
        });
    }
})();