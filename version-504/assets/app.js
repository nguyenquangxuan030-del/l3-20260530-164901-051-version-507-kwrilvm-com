(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var toggle = document.querySelector("[data-menu-toggle]");
        var nav = document.querySelector("[data-mobile-nav]");

        if (toggle && nav) {
            toggle.addEventListener("click", function () {
                nav.classList.toggle("open");
            });
        }

        document.querySelectorAll("img").forEach(function (image) {
            image.addEventListener("error", function () {
                image.classList.add("image-missing");
            });
        });

        var hero = document.querySelector("[data-hero]");
        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
            var current = 0;
            var timer = null;

            function show(index) {
                if (!slides.length) {
                    return;
                }

                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("active", slideIndex === current);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("active", dotIndex === current);
                });
            }

            function start() {
                clearInterval(timer);
                timer = setInterval(function () {
                    show(current + 1);
                }, 5600);
            }

            dots.forEach(function (dot, index) {
                dot.addEventListener("click", function () {
                    show(index);
                    start();
                });
            });

            show(0);
            start();
        }

        var catalog = document.querySelector("[data-catalog]");
        if (catalog) {
            var cards = Array.prototype.slice.call(catalog.querySelectorAll(".movie-card"));
            var search = document.querySelector("[data-filter-search]");
            var category = document.querySelector("[data-filter-category]");
            var year = document.querySelector("[data-filter-year]");

            function apply() {
                var keyword = search ? search.value.trim().toLowerCase() : "";
                var categoryValue = category ? category.value : "";
                var yearValue = year ? year.value : "";

                cards.forEach(function (card) {
                    var text = (card.getAttribute("data-title") || "").toLowerCase();
                    var cardCategory = card.getAttribute("data-category") || "";
                    var cardYear = card.getAttribute("data-year") || "";
                    var matched = true;

                    if (keyword && text.indexOf(keyword) === -1) {
                        matched = false;
                    }

                    if (categoryValue && cardCategory !== categoryValue) {
                        matched = false;
                    }

                    if (yearValue && cardYear !== yearValue) {
                        matched = false;
                    }

                    card.style.display = matched ? "" : "none";
                });
            }

            [search, category, year].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", apply);
                    control.addEventListener("change", apply);
                }
            });
        }
    });
})();
